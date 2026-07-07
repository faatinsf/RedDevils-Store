// ============================================================
//  checkout.js — halaman checkout
//  Depends on: main.js (Cart, formatIDR, Toast)
// ============================================================

// ── RENDER ORDER SUMMARY ────────────────────────────────────
function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkoutSummary');
  if (!summaryEl) return;

  const items = Cart.get();

  if (!items.length) {
    summaryEl.innerHTML = `
      <p style="color:#888;text-align:center;">Keranjang kosong.<br>
      <a href="products.html" style="color:var(--red)">Kembali belanja</a></p>`;
    return;
  }

  const rows = items.map(item => `
    <div style="display:flex;justify-content:space-between;align-items:center;
                padding:0.6rem 0;border-bottom:1px solid #222;gap:0.5rem;">
      <div style="display:flex;align-items:center;gap:0.75rem;flex:1;min-width:0;">
        <img
          src="${item.image || ''}"
          alt="${item.name}"
          onerror="this.src='https://placehold.co/44x44/111/da291c?text=MU'"
          style="width:44px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0;"
        >
        <div style="min-width:0;">
          <div style="color:#fff;font-size:0.85rem;font-weight:600;
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${item.name}
          </div>
          <div style="color:#888;font-size:0.75rem;">
            × ${item.qty}${item.size && item.size !== 'default' ? ' · ' + item.size : ''}
          </div>
        </div>
      </div>
      <div style="color:var(--gold);font-weight:700;white-space:nowrap;flex-shrink:0;">
        ${formatIDR(item.price * item.qty)}
      </div>
    </div>
  `).join('');

  summaryEl.innerHTML = `
    ${rows}
    <div style="display:flex;justify-content:space-between;padding:0.75rem 0 0.25rem;color:#888;">
      <span>Subtotal</span><span style="color:#fff;">${formatIDR(Cart.total())}</span>
    </div>
    <div style="display:flex;justify-content:space-between;padding:0.25rem 0;color:#888;">
      <span>Ongkir</span><span style="color:#4cd137;font-weight:600;">GRATIS</span>
    </div>
    <div style="display:flex;justify-content:space-between;padding:0.75rem 0 0;
                border-top:1px solid #333;margin-top:0.5rem;font-size:1.1rem;font-weight:700;">
      <span style="color:#fff;">Total</span>
      <span style="color:var(--red);">${formatIDR(Cart.total())}</span>
    </div>
  `;
}

// ── PRE-FILL NAMA & EMAIL DARI SESSION ──────────────────────
function prefillUserData() {
  const user = JSON.parse(localStorage.getItem('rd_user_now') || 'null');
  if (!user) return;
  const nameInput  = document.getElementById('inputName');
  const emailInput = document.getElementById('inputEmail');
  if (nameInput  && user.name)  nameInput.value  = user.name;
  if (emailInput && user.email) emailInput.value = user.email;
}

// ── SIMPAN ORDER KE HISTORY ─────────────────────────────────
function saveToHistory(formData) {
  const history = JSON.parse(localStorage.getItem('rd_history') || '[]');
  const order = {
    id:      'INV-' + Date.now(),
    date:    new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }),
    items:   Cart.get(),
    total:   Cart.total(),
    name:    formData.name,
    email:   formData.email,
    address: formData.address,
    payment: formData.payment,
    status:  'Paid'
  };
  history.unshift(order); // terbaru di atas
  localStorage.setItem('rd_history', JSON.stringify(history));
}

// ── SUBMIT FORM ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  prefillUserData();

  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!Cart.get().length) {
      Toast.show('❌ Keranjang kosong, tidak bisa checkout', 'error');
      return;
    }

    const formData = {
      name:    document.getElementById('inputName')?.value || '',
      email:   document.getElementById('inputEmail')?.value || '',
      address: document.getElementById('inputAddress')?.value || '',
      payment: document.getElementById('inputPayment')?.value || ''
    };

    saveToHistory(formData);
    Cart.clear();

    Toast.show('✅ Order berhasil! Terima kasih, GGMU 🔴', 'success');

    setTimeout(() => {
      window.location.href = 'history.html';
    }, 2000);
  });
});