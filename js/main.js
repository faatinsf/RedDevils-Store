// ============================================================
//  REDDEVILS STORE — main.js
//  Cart system, Toast, utilities — dipakai semua halaman
// ============================================================

// ── FORMAT RUPIAH ──────────────────────────────────────────
function formatIDR(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

// ── TOAST NOTIFICATION ─────────────────────────────────────
const Toast = (() => {
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
        display:flex; flex-direction:column; gap:0.5rem;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'success') {
    const colors = {
      success: '#22c55e',
      error:   '#ef4444',
      info:    '#3b82f6',
      warning: '#f59e0b'
    };
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #1a1a1a;
      border: 1px solid ${colors[type] || colors.success};
      color: #fff;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      min-width: 260px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `;
    toast.textContent = message;
    getContainer().appendChild(toast);

    // animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // animate out
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  return { show };
})();

// ── CART SYSTEM ────────────────────────────────────────────
const Cart = (() => {
  const KEY = 'rd_cart';

  function get() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  }

  function save(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    _updateBadges();
  }

  // key unik per produk+size agar size berbeda dihitung terpisah
  function makeKey(id, size) {
    return `${id}_${size || 'default'}`;
  }

  function add(id, price, size, name, image) {
  price = Number(price);
  if (isNaN(price)) price = 0;
  size  = (typeof size === 'string' && size.trim()) ? size : 'default';
  name  = name || 'Produk';
  image = image || '';

  const cart = get();
  const key  = makeKey(id, size);
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ key, id, price, size, name, image, qty: 1 });
  }

  save(cart);
  Toast.show(`✅ ${name} ditambahkan ke keranjang`);
}

  function remove(key) {
  const cart = get().filter(i => String(i.key) !== String(key));
  save(cart);
}

  function updateQty(key, qty) {
    const cart = get();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    if (qty <= 0) { remove(key); return; }
    item.qty = qty;
    save(cart);
  }

  function total() {
    return get().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function count() {
    return get().reduce((sum, i) => sum + i.qty, 0);
  }

  function clear() {
    localStorage.removeItem(KEY);
    _updateBadges();
  }

  function _updateBadges() {
    const n = count();
    document.querySelectorAll('[id="cartBadgeCount"], .cart-badge').forEach(el => {
      el.textContent = n;
    });
  }

  return { get, add, remove, updateQty, total, count, clear, makeKey };
})();

// ── NAVBAR SCROLL + HAMBURGER ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // update badge saat load
  document.querySelectorAll('[id="cartBadgeCount"], .cart-badge').forEach(el => {
    el.textContent = Cart.count();
  });

  // scroll effect
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // hamburger
  const hbtn = document.getElementById('hamburger-btn');
  const mnav = document.getElementById('mobile-nav') || document.querySelector('.mobile-nav');
  if (hbtn && mnav) {
    hbtn.addEventListener('click', () => {
      hbtn.classList.toggle('active');
      mnav.classList.toggle('open');
    });
  }

  // fade-in observer
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

  // loading screen
  const ls = document.getElementById('loading-screen');
  if (ls) {
    setTimeout(() => {
      ls.classList.add('hidden');
      setTimeout(() => ls.style.display = 'none', 500);
    }, 1800);
  }
});

// ── LOGOUT ─────────────────────────────────────────────────
function logout() {
  localStorage.removeItem('rd_role');
  localStorage.removeItem('rd_user_now');
  window.location.href = 'index2.html';
}