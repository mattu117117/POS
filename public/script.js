document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-button');
  const discountInput = document.getElementById('discount-input');
  const nextOrderIdSpan = document.getElementById('next-order-id');

  let cart = [];

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
    const products = await response.json();
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

  function addToCart(product) {
    cart.push(product);
    renderCart();
  }

  function deleteProductFromCart(productId) {
    // 同じIDの商品を全てカートから削除する
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  }

  // ★カート描画の最終版
  function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    const itemCounts = {};

    // 商品ごとに個数を集計
    cart.forEach(item => {
      itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
    });

    const uniqueItems = [...new Map(cart.map(item => [item.id, item])).values()];
    
    uniqueItems.forEach(item => {
        const count = itemCounts[item.id];
        const itemTotal = item.price * count;
        total += itemTotal;
        const li = document.createElement('li');
        // li.className = 'cart-item'; // style.cssで直接指定するため不要
        li.innerHTML = `
          <div class="cart-item-details">${item.name} x ${count}</div>
          <span class="item-price">${itemTotal}円</span>
          <button class="delete-item-btn" data-id="${item.id}">
            <img src="trash-icon.png" alt="削除" style="width:20px; height:20px; vertical-align:middle;">
          </button>
        `;
        cartItems.appendChild(li);
    });
    
    // ゴミ箱ボタンにイベントリスナーを再設定
    document.querySelectorAll('.delete-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // dataset.idは文字列なのでparseIntで数値に変換
            const productId = parseInt(e.currentTarget.dataset.id, 10);
            deleteProductFromCart(productId);
        });
    });

    const discount = parseInt(discountInput.value) || 0;
    const finalTotal = total - discount;
    cartTotal.textContent = finalTotal < 0 ? 0 : finalTotal;
  }
  
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
  
  // 初期読み込み
  fetchProducts();
  fetchNextOrderId();
});