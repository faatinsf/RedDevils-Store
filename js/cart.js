// ============================================================
//  cart.js — halaman keranjang belanja
//  Depends on: main.js (Cart, formatIDR, Toast)
// ============================================================

function renderCartPage() {
  const container  = document.getElementById('cartContainer');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl    = document.getElementById('total');
  if (!container) return;

  const items = Cart.get();

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-cart-message">
        <div style="font-size:3rem;margin-bottom:1rem;">🛒</div>
        <h3 style="color:#fff;margin-bottom:0.5rem;">Keranjang Masih Kosong</h3>
        <p style="color:#888;margin-bottom:1.5rem;">Tambahkan merchandise favoritmu dulu, bro.</p>
        <a href="products.html" class="btn btn-primary">Belanja Sekarang</a>
      </div>`;
    if (subtotalEl) subtotalEl.textContent = formatIDR(0);
    if (totalEl)    totalEl.textContent    = formatIDR(0);
    return;
  }

  container.innerHTML = items.map(item => {
    // Pengaman: ambil jumlah barang apa pun nama variabelnya (qty atau quantity)
    const currentQty = item.qty || item.quantity || 1;

    return `
    <div class="cart-item">
      <div class="cart-item-info">
        <img
          src="${item.image || ''}"
          alt="${item.name}"
          onerror="this.src='https://placehold.co/70x70/111/da291c?text=MU'"
        >
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="price">${formatIDR(item.price)}</div>
          ${item.size && item.size !== 'default' ? `<div style="font-size:0.8rem;color:#888;">Size: ${item.size}</div>` : ''}
        </div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.key}', -1)">−</button>
          <span class="qty-val">${currentQty}</span>
          <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
        </div>
        <button class="btn-delete" onclick="removeItem('${item.key}')" title="Hapus">🗑️</button>
      </div>
    </div>
    `;
  }).join('');

  // KALKULATOR MANDIRI: Menghitung total harga secara manual agar bebas dari bug RpNaN
  let grandTotal = 0;
  items.forEach(item => {
    const currentQty = item.qty || item.quantity || 1;
    grandTotal += item.price * currentQty;
  });

  if (subtotalEl) subtotalEl.textContent = formatIDR(grandTotal);
  if (totalEl)    totalEl.textContent    = formatIDR(grandTotal);
}

function changeQty(key, delta) {
  const item = Cart.get().find(i => i.key === key);
  if (!item) return;
  
  const currentQty = item.qty || item.quantity || 1;
  const newQty = currentQty + delta;
  
  if (newQty <= 0) {
    removeItem(key);
  } else {
    Cart.updateQty(key, newQty);
    renderCartPage();
  }
}

function removeItem(key) {
  Cart.remove(key);
  Toast.show('🗑️ Produk dihapus dari keranjang', 'info');
  renderCartPage();
}

document.addEventListener('DOMContentLoaded', renderCartPage);