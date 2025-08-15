document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-button');
  const discountInput = document.getElementById('discount-input');
  const nextOrderIdSpan = document.getElementById('next-order-id');

  let cart = [];
  let products = []; // 商品リストをキャッシュする配列

  async function fetchNextOrderId() {
    try {
      const response = await fetch('/api/next-order-id');
      const data = await response.json();
      nextOrderIdSpan.textContent = `#${String(data.nextId).padStart(4, '0')}`;
    } catch(err) {
      nextOrderIdSpan.textContent = '#Error';
    }
  }

  async function fetchProducts() {
    const response = await fetch('/api/products');
    products = await response.json(); // 取得した商品リストをキャッシュ
    productList.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.backgroundColor = product.color;
      card.innerHTML = `<h4>${product.name}</h4><p>${product.price}円</p>`;
      card.addEventListener('click', () => addToCart(product));
      productList.appendChild(card);
    });
  }

  // --- ▼ここから関数を大幅に変更・追加▼ ---

  // カートに商品を追加（既存の関数）
  function addToCart(product) {
    cart.push(product);
    renderCart();
  }

  // (新規追加) カート内の商品を1つ増やす
  function increaseQuantity(productId) {
    const productToAdd = products.find(p => p.id === productId);
    if (productToAdd) {
      cart.push(productToAdd);
      renderCart();
    }
  }

  // (新規追加) カート内の商品を1つ減らす
  function decreaseQuantity(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      cart.splice(itemIndex, 1);
      renderCart();
    }
  }
  
  // (既存の関数) 特定の商品をカートから全て削除する
  function deleteProductFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  }

  // ★カート描画の最終版
  function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    const itemCounts = {};

    cart.forEach(item => {
      itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
    });

    const uniqueItems = [...new Map(cart.map(item => [item.id, item])).values()];
    
    uniqueItems.forEach(item => {
        const count = itemCounts[item.id];
        const itemTotal = item.price * count;
        total += itemTotal;
        const li = document.createElement('li');
        
        // HTML構造を数量変更ボタン付きのものに変更
        li.innerHTML = `
          <div class="cart-item-info">
            <span class="item-name">${item.name}</span>
          </div>
          <div class="cart-item-controls">
            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
            <span class="item-quantity">${count}</span>
            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            <span class="item-price">${itemTotal.toLocaleString()}円</span>
            <button class="delete-item-btn" data-id="${item.id}">
              <img src="trash-icon.png" alt="削除">
            </button>
          </div>
        `;
        cartItems.appendChild(li);
    });
    
    const discount = parseInt(discountInput.value) || 0;
    const finalTotal = total - discount;
    cartTotal.textContent = finalTotal < 0 ? 0 : finalTotal.toLocaleString();
  }
  
  // (新規追加) イベント委任を使ってカートのボタン操作をまとめて処理
  cartItems.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return; // ボタン以外がクリックされた場合は何もしない

    const productId = parseInt(target.dataset.id, 10);

    if (target.classList.contains('quantity-btn')) {
      const action = target.dataset.action;
      if (action === 'increase') {
        increaseQuantity(productId);
      } else if (action === 'decrease') {
        decreaseQuantity(productId);
      }
    } else if (target.classList.contains('delete-item-btn')) {
      deleteProductFromCart(productId);
    }
  });

  // --- ▲ここまで関数を大幅に変更・追加▲ ---

  checkoutButton.addEventListener('click', async () => {
    if (cart.length === 0) { alert('カートが空です。'); return; }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const discount = parseInt(discountInput.value) || 0;
    const finalTotal = total - discount;
    
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, total, discount, finalTotal: finalTotal < 0 ? 0 : finalTotal })
    });
    
    if (response.ok) {
      const result = await response.json();
      alert(`会計完了！ 会計ID: #${result.sale.id}`);
      cart = [];
      discountInput.value = '';
      renderCart();
      fetchNextOrderId();
    } else {
      alert('会計処理に失敗しました。');
    }
  });

  discountInput.addEventListener('input', renderCart);
  
  fetchProducts();
  fetchNextOrderId();
});