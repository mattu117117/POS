const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const SALES_FILE = path.join(__dirname, 'data', 'sales.json');

// --- Middleware ---
app.use(express.json());
app.use(express.static('public'));


// --- データアクセス用ヘルパー関数 ---
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // ファイルが存在しない場合は空の配列を返す
    if (err.code === 'ENOENT') {
      return []; 
    }
    throw err;
  }
}

async function writeData(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function getNextId(filePath) {
  const data = await readData(filePath);
  if (data.length === 0) return 1;
  return Math.max(...data.map(item => item.id)) + 1;
}


// --- APIエンドポイント ---

// 商品リストを取得
app.get('/api/products', async (req, res) => {
  res.json(await readData(PRODUCTS_FILE));
});

// 新しい商品を追加 ★バグ修正済み
app.post('/api/products', async (req, res) => {
  try {
    const products = await readData(PRODUCTS_FILE);
    const newProduct = {
      id: await getNextId(PRODUCTS_FILE),
      name: req.body.name,
      price: parseInt(req.body.price, 10),
      color: req.body.color || '#ffffff'
    };
    products.push(newProduct);
    await writeData(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
  } catch(err) { res.status(500).json({ message: "商品追加エラー" }); }
});

// 商品を削除
app.delete('/api/products/:id', async (req, res) => {
    try {
        const products = await readData(PRODUCTS_FILE);
        const updatedProducts = products.filter(p => p.id !== parseInt(req.params.id, 10));
        await writeData(PRODUCTS_FILE, updatedProducts);
        res.json({ message: "商品を削除しました。" });
    } catch(err) { res.status(500).json({ message: "商品削除エラー" }); }
});

// server.js 内

// （既存の app.get や app.post の定義はそのまま）

// 特定の会計情報を更新 (この部分を置き換える)
app.put('/api/sales/:id', async (req, res) => {
    try {
        const sales = await readData(SALES_FILE);
        const products = await readData(PRODUCTS_FILE); // 商品マスタを読み込む
        const saleId = parseInt(req.params.id, 10);
        const saleIndex = sales.findIndex(s => s.id === saleId);

        if (saleIndex === -1) {
            return res.status(404).json({ message: "該当の会計が見つかりません。" });
        }

        const { items: updatedItems } = req.body; // クライアントからは更新されたitems配列のみ受け取る

        if (!Array.isArray(updatedItems)) {
            return res.status(400).json({ message: "無効なデータ形式です。" });
        }
        
        // --- サーバー側で金額を再計算 ---
        let newTotal = 0;
        updatedItems.forEach(item => {
            const productInfo = products.find(p => p.id === item.id);
            if(productInfo) {
              newTotal += productInfo.price;
            }
        });

        const originalSale = sales[saleIndex];
        const discount = originalSale.discount || 0; // 割引額は元の記録を維持
        const newFinalTotal = newTotal - discount;

        // 元のデータを更新
        originalSale.items = updatedItems;
        originalSale.total = newTotal;
        originalSale.finalTotal = newFinalTotal < 0 ? 0 : newFinalTotal;
        
        // 提供ステータスをリセットする必要がある場合は、以下のコメントアウトを解除
        // originalSale.status = '未提供';
        // const itemStatus = {};
        // const uniqueProductIds = [...new Set(updatedItems.map(item => item.id))];
        // uniqueProductIds.forEach(id => { itemStatus[id] = 'undelivered'; });
        // originalSale.itemStatus = itemStatus;


        await writeData(SALES_FILE, sales);
        res.json({ message: "会計情報を更新しました。", sale: originalSale });

    } catch(err) {
        console.error("会計更新エラー:", err);
        res.status(500).json({ message: "会計更新エラー" });
    }
});

// （他のエンドポイントはそのまま）

// 次の注文IDを取得
app.get('/api/next-order-id', async (req, res) => {
  try {
    const nextId = await getNextId(SALES_FILE);
    res.json({ nextId });
  } catch (err) { res.status(500).json({ message: 'ID取得エラー' }); }
});

// 新しい会計を記録
app.post('/api/sales', async (req, res) => {
  try {
    const sales = await readData(SALES_FILE);
    const itemStatus = {};
    const uniqueProductIds = [...new Set(req.body.cart.map(item => item.id))];
    uniqueProductIds.forEach(id => {
      itemStatus[id] = 'undelivered';
    });

    const newSale = {
      id: await getNextId(SALES_FILE),
      items: req.body.cart,
      itemStatus: itemStatus,
      total: req.body.total,
      discount: req.body.discount,
      finalTotal: req.body.finalTotal,
      status: '未提供',
      createdAt: new Date().toISOString()
    };
    sales.push(newSale);
    await writeData(SALES_FILE, sales);
    res.status(201).json({ message: "会計が記録されました。", sale: newSale });
  } catch (err) { res.status(500).json({ message: "会計記録エラー" }); }
});

// 未提供の注文リストを取得
app.get('/api/kitchen/undelivered', async (req, res) => {
  const sales = await readData(SALES_FILE);
  res.json(sales.filter(sale => sale.status === '未提供').sort((a, b) => a.id - b.id));
});

// 特定の注文の特定商品を完了にする
app.post('/api/kitchen/order/:orderId/item/:productId/complete', async (req, res) => {
    try {
        const sales = await readData(SALES_FILE);
        const orderId = parseInt(req.params.orderId, 10);
        const productId = req.params.productId;

        const saleIndex = sales.findIndex(s => s.id === orderId);
        if (saleIndex > -1) {
            if (sales[saleIndex].itemStatus && sales[saleIndex].itemStatus[productId]) {
                sales[saleIndex].itemStatus[productId] = 'delivered';
            }
            
            const allDelivered = Object.values(sales[saleIndex].itemStatus).every(status => status === 'delivered');
            if (allDelivered) {
                sales[saleIndex].status = '提供済み';
            }
            
            await writeData(SALES_FILE, sales);
            res.json({ message: '商品を更新しました。'});
        } else {
            res.status(404).json({ message: '該当の注文が見つかりません。'});
        }
    } catch(err) { res.status(500).json({ message: "更新エラー" }); }
});

// 全ての会計履歴を取得
app.get('/api/sales/history', async (req, res) => {
    const sales = await readData(SALES_FILE);
    res.json(sales.sort((a, b) => b.id - a.id));
});

// 特定の会計を削除
app.delete('/api/sales/:id', async (req, res) => {
    try {
        const sales = await readData(SALES_FILE);
        const updatedSales = sales.filter(s => s.id !== parseInt(req.params.id, 10));
        await writeData(SALES_FILE, updatedSales);
        res.json({ message: "会計を削除しました。" });
    } catch(err) { res.status(500).json({ message: "会計削除エラー" }); }
});

// 期間を指定して会計履歴を一括削除
app.delete('/api/sales', async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ message: "開始日時と終了日時を指定してください。" });
        }
        const startDate = new Date(start);
        const endDate = new Date(end);
        const sales = await readData(SALES_FILE);
        const updatedSales = sales.filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate < startDate || saleDate > endDate;
        });
        await writeData(SALES_FILE, updatedSales);
        res.json({ message: `指定された期間の会計 ${sales.length - updatedSales.length} 件を削除しました。` });
    } catch (err) {
        res.status(500).json({ message: "会計の一括削除エラー" });
    }
});

// server.js内

// CSVをダウンロード (この関数全体を置き換える)
app.get('/api/sales/csv', async (req, res) => {
    const sales = await readData(SALES_FILE);
    // 1. ヘッダーに「値引額」を追加
    const header = ['会計ID', '日時', '商品名', '数量', '単価', '小計', '値引額'];
    let csvRows = [header.join(',')];
    
    // 2. 1つの会計IDで値引き額が重複しないように管理
    let processedIds = new Set();

    sales.forEach(sale => {
        const itemCounts = sale.items.reduce((acc, item) => {
            if (!acc[item.id]) { acc[item.id] = { name: item.name, price: item.price, quantity: 0 }; }
            acc[item.id].quantity++;
            return acc;
        }, {});

        let isFirstItemOfSale = true;
        Object.values(itemCounts).forEach(item => {
            // その会計の最初の行にだけ値引き額を記載し、それ以外は空にする
            const discountForThisRow = isFirstItemOfSale ? (sale.discount || 0) : '';
            
            const rowData = [
                sale.id, 
                new Date(sale.createdAt).toLocaleString('ja-JP'), 
                item.name, 
                item.quantity, 
                item.price, 
                item.price * item.quantity,
                discountForThisRow // 3. 行データに値引額を追加
            ];
            
            csvRows.push(rowData.join(','));
            isFirstItemOfSale = false; // 2行目以降は値引き額を空にするためのフラグ
        });
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="sales_data.csv"');
    res.status(200).send('\ufeff' + csvRows.join('\n')); // BOM付きUTF-8で出力
});

// --- サーバー起動 ---
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。 http://localhost:${PORT} でアクセスしてください。`);
});