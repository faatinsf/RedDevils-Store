// ============================================================
//  admin.js — shared logic untuk semua halaman admin
//  Depends on: main.js (formatIDR, Toast, Cart)
// ============================================================

// ── DATA PRODUK (sama dengan products.js) ──────────────────
const ADMIN_PRODUCTS = [
  { id: 1,  name: "MU Home Jersey 2026",             price: 1250000, category: "Jersey",      image: "assets/images/homejersey.jpg",   stock: 42 },
  { id: 2,  name: "MU Away Jersey 2026",             price: 1250000, category: "Jersey",      image: "assets/images/jerseyaway.jpg",    stock: 35 },
  { id: 3,  name: "Red Devils Premium Hoodie",       price: 850000,  category: "Hoodie",      image: "assets/images/hoodie.jpg",        stock: 28 },
  { id: 4,  name: "Scarf Theatre of Dreams",         price: 250000,  category: "Scarf",       image: "assets/images/silkscarf.jpg",     stock: 80 },
  { id: 5,  name: "Manchester United Red Cap",       price: 300000,  category: "Cap",         image: "assets/images/redcap.jpg",        stock: 60 },
  { id: 6,  name: "Old Trafford Ceramic Mug",        price: 180000,  category: "Mug",         image: "assets/images/mug.jpg",           stock: 55 },
  { id: 7,  name: "MU Black Training Kit",           price: 950000,  category: "Jersey",      image: "assets/images/training-kit.jpg",  stock: 20 },
  { id: 8,  name: "Official Devil Leather Wallet",   price: 450000,  category: "Accessories", image: "assets/images/wallet.jpg",        stock: 33 },
  { id: 9,  name: "Premium Red Devils Necklace",     price: 180000,  category: "Accessories", image: "assets/images/kalung.jpg",        stock: 47 },
  { id: 10, name: "Jacket Man United",               price: 800000,  category: "Jacket",      image: "assets/images/jaket.jpg",         stock: 18 },
  { id: 11, name: "Retro Jersey Paket",              price: 5000000, category: "Jersey",      image: "assets/images/retro.jpg",         stock: 8  },
  { id: 12, name: "Adidas Man United Shoes",         price: 4000000, category: "Shoes",       image: "assets/images/sepatu.jpg",        stock: 12 },
  { id: 13, name: "Streetwear Man United Jersey",    price: 700000,  category: "Jersey",      image: "assets/images/streatwer.jpg",     stock: 25 },
  { id: 14, name: "Manchester United Black Cap",     price: 300000,  category: "Cap",         image: "assets/images/cap.jpg",           stock: 50 },
  { id: 15, name: "Manchester United Black Cap Premium", price: 380000, category: "Cap",     image: "assets/images/blackcap2.jpg",     stock: 30 }
];

// simpan ke sessionStorage supaya bisa diakses halaman lain
sessionStorage.setItem('rd_products', JSON.stringify(ADMIN_PRODUCTS));

// ── HELPER ─────────────────────────────────────────────────
function getHistory() {
  return JSON.parse(localStorage.getItem('rd_history') || '[]');
}

function getUsers() {
  // baca dari localStorage (disimpan auth.js saat register/login)
  return JSON.parse(localStorage.getItem('rd_users') || JSON.stringify([
    { id: 1, name: 'Admin',    email: 'admin@gmail.com', role: 'admin',  status: 'active',  joined: '1 Jan 2026'  },
    { id: 2, name: 'Faa',      email: 'user@gmail.com',  role: 'user',   status: 'active',  joined: '15 Mar 2026' },
    { id: 3, name: 'Rizky',    email: 'rizky@gmail.com', role: 'user',   status: 'active',  joined: '20 Apr 2026' }
  ]));
}

// ── DASHBOARD STATS ─────────────────────────────────────────
function initDashboard() {
  const history  = getHistory();
  const users    = getUsers();
  const revenue  = history.reduce((s, o) => s + (o.total || 0), 0);
  const pending  = history.filter(o => o.status === 'Pending').length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('statProducts',    ADMIN_PRODUCTS.length);
  set('statOrders',      history.length || 0);
  set('statUsers',       users.length);
  set('statRevenue',     revenue >= 1e6
    ? `Rp ${(revenue / 1e6).toFixed(1)}Jt`
    : formatIDR(revenue));
  set('statPending',     pending);

  // recent orders table
  renderRecentOrders(history.slice(0, 5));
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById('recentOrdersBody');
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#666;padding:2rem;">
      Belum ada transaksi</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td style="font-family:monospace;color:#da291c;">${o.id}</td>
      <td>${o.name || '—'}</td>
      <td>${o.date}</td>
      <td style="color:var(--gold);font-weight:600;">${formatIDR(o.total)}</td>
      <td>${badgePill(o.status)}</td>
    </tr>
  `).join('');
}

// ── MANAGE PRODUCTS ─────────────────────────────────────────
function initManageProducts() {
  renderProductTable(ADMIN_PRODUCTS);

  document.getElementById('searchProduct')?.addEventListener('input', function() {
    const kw = this.value.toLowerCase();
    renderProductTable(ADMIN_PRODUCTS.filter(p => p.name.toLowerCase().includes(kw)));
  });

  document.getElementById('filterCategory')?.addEventListener('change', function() {
    const cat = this.value;
    renderProductTable(cat === 'All'
      ? ADMIN_PRODUCTS
      : ADMIN_PRODUCTS.filter(p => p.category === cat));
  });

  // modal add product
  document.getElementById('btnAddProduct')?.addEventListener('click', () => openProductModal());
}

function renderProductTable(products) {
  const tbody = document.getElementById('productTable');
  if (!tbody) return;

  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#666;padding:2rem;">
      Tidak ada produk</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map((p, i) => `
    <tr>
      <td style="color:#666;">${i + 1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <img src="${p.image}" alt="${p.name}"
               onerror="this.src='https://placehold.co/40x40/111/da291c?text=MU'"
               style="width:40px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0;">
          <div>
            <div style="color:#fff;font-weight:600;font-size:0.9rem;">${p.name}</div>
            <div style="color:#666;font-size:0.75rem;">${p.category}</div>
          </div>
        </div>
      </td>
      <td style="color:var(--gold);">${formatIDR(p.price)}</td>
      <td style="color:#fff;">${p.stock}</td>
      <td>${p.stock > 0
        ? '<span style="color:#22c55e;font-size:0.78rem;font-weight:700;">● IN STOCK</span>'
        : '<span style="color:#ef4444;font-size:0.78rem;font-weight:700;">● OUT</span>'}</td>
      <td>
        <div style="display:flex;gap:0.5rem;">
          <button onclick="openProductModal(${p.id})"
            style="padding:0.3rem 0.7rem;background:#1a1a1a;border:1px solid #333;
                   color:#fff;border-radius:6px;cursor:pointer;font-size:0.8rem;">
            ✏️ Edit
          </button>
          <button onclick="deleteProduct(${p.id})"
            style="padding:0.3rem 0.7rem;background:rgba(239,68,68,0.1);border:1px solid #ef444444;
                   color:#ef4444;border-radius:6px;cursor:pointer;font-size:0.8rem;">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openProductModal(id) {
  const p = id ? ADMIN_PRODUCTS.find(x => x.id === id) : null;
  const modal = document.getElementById('productModal');
  if (!modal) return;

  document.getElementById('modalTitle').textContent = p ? 'Edit Product' : 'Add Product';
  document.getElementById('mProductName').value     = p?.name     || '';
  document.getElementById('mProductPrice').value    = p?.price    || '';
  document.getElementById('mProductCategory').value = p?.category || 'Jersey';
  document.getElementById('mProductStock').value    = p?.stock    || '';
  document.getElementById('mProductId').value       = p?.id       || '';

  modal.style.display = 'flex';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.style.display = 'none';
}

function saveProduct() {
  const id       = parseInt(document.getElementById('mProductId').value) || null;
  const name     = document.getElementById('mProductName').value.trim();
  const price    = parseInt(document.getElementById('mProductPrice').value) || 0;
  const category = document.getElementById('mProductCategory').value;
  const stock    = parseInt(document.getElementById('mProductStock').value) || 0;

  if (!name || !price) { Toast.show('❌ Nama dan harga wajib diisi', 'error'); return; }

  if (id) {
    const idx = ADMIN_PRODUCTS.findIndex(p => p.id === id);
    if (idx >= 0) {
      ADMIN_PRODUCTS[idx] = { ...ADMIN_PRODUCTS[idx], name, price, category, stock };
      Toast.show('✅ Produk berhasil diupdate');
    }
  } else {
    const newId = Math.max(...ADMIN_PRODUCTS.map(p => p.id)) + 1;
    ADMIN_PRODUCTS.push({
      id: newId, name, price, category, stock,
      image: 'assets/images/logomu.png'
    });
    Toast.show('✅ Produk berhasil ditambahkan');
  }

  closeProductModal();
  renderProductTable(ADMIN_PRODUCTS);
}

function deleteProduct(id) {
  if (!confirm('Hapus produk ini?')) return;
  const idx = ADMIN_PRODUCTS.findIndex(p => p.id === id);
  if (idx >= 0) {
    ADMIN_PRODUCTS.splice(idx, 1);
    Toast.show('🗑️ Produk dihapus', 'info');
    renderProductTable(ADMIN_PRODUCTS);
  }
}

// ── MANAGE TRANSACTIONS ─────────────────────────────────────
function initManageTransactions() {
  const history = getHistory();
  renderTransactionTable(history);

  document.getElementById('searchTx')?.addEventListener('input', function() {
    const kw = this.value.toLowerCase();
    renderTransactionTable(history.filter(o =>
      o.id.toLowerCase().includes(kw) ||
      (o.name || '').toLowerCase().includes(kw)
    ));
  });

  document.getElementById('filterStatus')?.addEventListener('change', function() {
    const s = this.value;
    renderTransactionTable(s === 'All' ? history : history.filter(o => o.status === s));
  });
}

function renderTransactionTable(orders) {
  const tbody = document.getElementById('txTable');
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#666;padding:2rem;">
      Belum ada transaksi</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td style="font-family:monospace;color:#da291c;font-size:0.85rem;">${o.id}</td>
      <td>
        <div style="color:#fff;font-weight:600;">${o.name || '—'}</div>
        <div style="color:#666;font-size:0.75rem;">${o.email || ''}</div>
      </td>
      <td style="color:#888;font-size:0.85rem;">${o.date}</td>
      <td style="color:var(--gold);font-weight:700;">${formatIDR(o.total)}</td>
      <td>${o.payment || '—'}</td>
      <td>
        <select onchange="updateTxStatus('${o.id}', this.value)"
          style="background:#1a1a1a;border:1px solid #333;color:#fff;
                 padding:0.3rem 0.5rem;border-radius:6px;font-size:0.8rem;cursor:pointer;">
          ${['Paid','Pending','Shipped','Cancelled'].map(s =>
            `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`
          ).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

function updateTxStatus(id, status) {
  const history = getHistory();
  const order   = history.find(o => o.id === id);
  if (order) {
    order.status = status;
    localStorage.setItem('rd_history', JSON.stringify(history));
    Toast.show(`✅ Status ${id} → ${status}`);
  }
}

// ── MANAGE USERS ────────────────────────────────────────────
function initManageUsers() {
  const users = getUsers();
  renderUserTable(users);

  document.getElementById('searchUser')?.addEventListener('input', function() {
    const kw = this.value.toLowerCase();
    renderUserTable(users.filter(u =>
      u.name.toLowerCase().includes(kw) ||
      u.email.toLowerCase().includes(kw)
    ));
  });
}

function renderUserTable(users) {
  const tbody = document.getElementById('userTable');
  if (!tbody) return;

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#666;padding:2rem;">
      Tidak ada user</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map((u, i) => `
    <tr>
      <td style="color:#666;">${i + 1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--red);
                      display:flex;align-items:center;justify-content:center;
                      font-weight:700;font-size:0.9rem;flex-shrink:0;">
            ${(u.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div style="color:#fff;font-weight:600;">${u.name}</div>
            <div style="color:#666;font-size:0.75rem;">${u.joined || '—'}</div>
          </div>
        </div>
      </td>
      <td style="color:#888;">${u.email}</td>
      <td>
        <span style="
          padding:0.2rem 0.6rem;border-radius:999px;font-size:0.72rem;font-weight:700;
          text-transform:uppercase;letter-spacing:0.08em;
          ${u.role === 'admin'
            ? 'background:rgba(218,41,28,0.15);color:#da291c;border:1px solid rgba(218,41,28,0.3);'
            : 'background:rgba(59,130,246,0.15);color:#3b82f6;border:1px solid rgba(59,130,246,0.3);'}
        ">${u.role}</span>
      </td>
      <td>
        <span style="color:${u.status === 'active' ? '#22c55e' : '#888'};
                     font-size:0.78rem;font-weight:700;">
          ● ${u.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </td>
    </tr>
  `).join('');
}

// ── BADGE HELPER ────────────────────────────────────────────
function badgePill(status) {
  const map = {
    'Paid':      'color:#22c55e;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);',
    'Pending':   'color:#f59e0b;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);',
    'Shipped':   'color:#3b82f6;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);',
    'Cancelled': 'color:#ef4444;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);'
  };
  const style = map[status] || 'color:#888;';
  return `<span style="padding:0.2rem 0.6rem;border-radius:999px;font-size:0.72rem;
    font-weight:700;text-transform:uppercase;letter-spacing:0.08em;${style}">${status}</span>`;
}

// ── AUTO INIT berdasar halaman ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('admin-dashboard'))        initDashboard();
  if (path.includes('manage-products'))        initManageProducts();
  if (path.includes('manage-transactions'))    initManageTransactions();
  if (path.includes('manage-users'))           initManageUsers();
});