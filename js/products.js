// ============================================================
//  products.js — halaman daftar produk
//  Depends on: main.js (Cart, formatIDR, Toast)
// ============================================================

const ALL_PRODUCTS = [
  { id: 1,  name: "MU Home Jersey 2026",             price: 1250000, category: "Jersey",      image: "assets/images/homejersey.jpg" },
  { id: 2,  name: "MU Away Jersey 2026",             price: 1250000, category: "Jersey",      image: "assets/images/jerseyaway.jpg" },
  { id: 3,  name: "Red Devils Premium Hoodie",       price: 850000,  category: "Hoodie",      image: "assets/images/hoodie.jpg" },
  { id: 4,  name: "Scarf Theatre of Dreams",         price: 250000,  category: "Scarf",       image: "assets/images/silkscarf.jpg" },
  { id: 5,  name: "Manchester United Red Cap",       price: 300000,  category: "Cap",         image: "assets/images/redcap.jpg" },
  { id: 6,  name: "Old Trafford Ceramic Mug",        price: 180000,  category: "Mug",         image: "assets/images/mug.jpg" },
  { id: 7,  name: "MU Black Training Kit",           price: 950000,  category: "Jersey",      image: "assets/images/training-kit.jpg" },
  { id: 8,  name: "Official Devil Leather Wallet",   price: 450000,  category: "Accessories", image: "assets/images/wallet.jpg" },
  { id: 9,  name: "Premium Red Devils Necklace",     price: 180000,  category: "Accessories", image: "assets/images/kalung.jpg" },
  { id: 10, name: "Jacket Man United",               price: 800000,  category: "Jacket",      image: "assets/images/jaket.jpg" },
  { id: 11, name: "Retro Jersey Paket",              price: 5000000, category: "Jersey",      image: "assets/images/retro.jpg" },
  { id: 12, name: "Adidas Man United Shoes",         price: 4000000, category: "Shoes",       image: "assets/images/sepatu.jpg" },
  { id: 13, name: "Streetwear Man United Jersey",    price: 700000,  category: "Jersey",      image: "assets/images/streatwer.jpg" },
  { id: 14, name: "Manchester United Black Cap",     price: 300000,  category: "Cap",         image: "assets/images/cap.jpg" },
  { id: 15, name: "Manchester United Black Cap Premium", price: 380000, category: "Cap",     image: "assets/images/blackcap2.jpg" }
];

// simpan produk ke sessionStorage supaya detail page bisa akses
sessionStorage.setItem('rd_products', JSON.stringify(ALL_PRODUCTS));

// ── RENDER ──────────────────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  const count = document.getElementById('resultCount');
  if (!grid) return;

  if (count) count.textContent = `${list.length} products found`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="no-products">
        <p>Produk tidak ditemukan. Coba kata kunci lain.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="custom-product-card">
      <a href="product-detail.html?id=${p.id}" style="text-decoration:none;color:inherit;">
        <img
          src="${p.image}"
          alt="${p.name}"
          onerror="this.src='https://placehold.co/300x300/111/da291c?text=${encodeURIComponent(p.name)}'"
        >
        <h3>${p.name}</h3>
        <p class="price">${formatIDR(p.price)}</p>
      </a>
      <button
        class="btn-add-cart"
        onclick="Cart.add(${p.id}, ${p.price}, 'default', '${p.name.replace(/'/g, "\\'")}', '${p.image}')"
      >🛒 Masukkan Keranjang</button>
    </div>
  `).join('');
}

// ── FILTER ──────────────────────────────────────────────────
function filterProducts() {
  const keyword  = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const category = document.getElementById('categoryFilter')?.value || 'All';

  const filtered = ALL_PRODUCTS.filter(p => {
    const matchName = p.name.toLowerCase().includes(keyword);
    const matchCat  = category === 'All' || p.category === category;
    return matchName && matchCat;
  });

  renderProducts(filtered);
}

// ── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(ALL_PRODUCTS);

  document.getElementById('searchInput')?.addEventListener('input', filterProducts);
  document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
});