// ============================================================
//  product-detail.js — halaman detail produk
//  Depends on: main.js (Cart, formatIDR, Toast)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const params    = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));

  // ambil data produk dari sessionStorage (diisi products.js)
  // fallback: fetch dari ALL_PRODUCTS kalau langsung buka URL ini
  let products = JSON.parse(sessionStorage.getItem('rd_products') || '[]');

  // fallback inline jika sessionStorage kosong
  if (!products.length) {
    products = [
      { id: 1,  name: "MU Home Jersey 2026",           price: 1250000, category: "Jersey",      image: "assets/images/homejersey.jpg",   desc: "Jersey kandang resmi Manchester United musim 2026 dengan teknologi premium dan desain modern." },
      { id: 2,  name: "MU Away Jersey 2026",           price: 1250000, category: "Jersey",      image: "assets/images/jerseyaway.jpg",    desc: "Jersey tandang resmi MU 2026 dengan material breathable terbaik." },
      { id: 3,  name: "Red Devils Premium Hoodie",     price: 850000,  category: "Hoodie",      image: "assets/images/hoodie.jpg",        desc: "Hoodie premium Red Devils dengan bordir crest eksklusif." },
      { id: 4,  name: "Scarf Theatre of Dreams",       price: 250000,  category: "Scarf",       image: "assets/images/silkscarf.jpg",     desc: "Syal resmi Theatre of Dreams, cocok untuk matchday." },
      { id: 5,  name: "Manchester United Red Cap",     price: 300000,  category: "Cap",         image: "assets/images/redcap.jpg",        desc: "Cap merah ikonik Manchester United untuk everyday wear." },
      { id: 6,  name: "Old Trafford Ceramic Mug",      price: 180000,  category: "Mug",         image: "assets/images/mug.jpg",           desc: "Mug keramik bergambar Old Trafford, kapasitas 350ml." },
      { id: 7,  name: "MU Black Training Kit",         price: 950000,  category: "Jersey",      image: "assets/images/training-kit.jpg",  desc: "Training kit hitam resmi MU yang dipakai para pemain saat latihan." },
      { id: 8,  name: "Official Devil Leather Wallet", price: 450000,  category: "Accessories", image: "assets/images/wallet.jpg",        desc: "Dompet kulit asli dengan logo Red Devils timbul." },
      { id: 9,  name: "Premium Red Devils Necklace",   price: 180000,  category: "Accessories", image: "assets/images/kalung.jpg",        desc: "Kalung premium berliontin crest Manchester United." },
      { id: 10, name: "Jacket Man United",             price: 800000,  category: "Jacket",      image: "assets/images/jaket.jpg",         desc: "Jaket resmi Manchester United cocok untuk cuaca dingin." },
      { id: 11, name: "Retro Jersey Paket",            price: 5000000, category: "Jersey",      image: "assets/images/retro.jpg",         desc: "Paket jersey retro legendaris MU dari berbagai era." },
      { id: 12, name: "Adidas Man United Shoes",       price: 4000000, category: "Shoes",       image: "assets/images/sepatu.jpg",        desc: "Sepatu kolaborasi Adidas × Manchester United edisi terbatas." },
      { id: 13, name: "Streetwear Man United Jersey",  price: 700000,  category: "Jersey",      image: "assets/images/streatwer.jpg",     desc: "Jersey streetwear casual Manchester United untuk daily look." },
      { id: 14, name: "Manchester United Black Cap",   price: 300000,  category: "Cap",         image: "assets/images/cap.jpg",           desc: "Cap hitam stylish dengan logo MU di depan." },
      { id: 15, name: "MU Black Cap Premium",         price: 380000,  category: "Cap",         image: "assets/images/blackcap2.jpg",     desc: "Cap hitam premium edisi terbatas Manchester United." }
    ];
  }

  const product = products.find(p => p.id === productId);

  const titleEl    = document.getElementById('detailTitle');
  const priceEl    = document.getElementById('detailPrice');
  const descEl     = document.getElementById('detailDesc');
  const imgEl      = document.getElementById('detailImage');
  const badgeEl    = document.getElementById('detailBadge');
  const addCartBtn = document.getElementById('addCartBtn');

  if (!product) {
    document.querySelector('.product-detail-info')?.insertAdjacentHTML('afterbegin', `
      <div style="color:#ef4444;margin-bottom:1rem;">
        Produk tidak ditemukan. <a href="products.html" style="color:var(--red);">Kembali ke Products</a>
      </div>`);
    return;
  }

  // isi konten
  if (titleEl)  titleEl.textContent = product.name;
  if (priceEl)  priceEl.textContent = formatIDR(product.price);
  if (descEl)   descEl.textContent  = product.desc || `${product.name} — koleksi resmi Manchester United berkualitas tinggi.`;
  if (badgeEl)  badgeEl.textContent = product.category;
  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.name;
    imgEl.onerror = () => imgEl.src = `https://placehold.co/600x500/111/da291c?text=${encodeURIComponent(product.name)}`;
  }

  // page title
  document.title = `${product.name} – RedDevils Store`;

  // size selection
  let selectedSize = 'default';
  const sizeContainer = document.getElementById('sizeOptions');

  // jersey & training kit → tampilkan size; produk lain → sembunyikan
  const hasSizes = ['Jersey', 'Hoodie', 'Jacket'].includes(product.category);
  const sizeSection = document.getElementById('sizeSection');

  if (!hasSizes && sizeSection) {
    sizeSection.style.display = 'none';
  } else if (sizeContainer) {
    sizeContainer.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        sizeContainer.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedSize = this.dataset.size || this.textContent.trim();
      });
    });
    // default size aktif pertama
    const firstBtn = sizeContainer.querySelector('.size-btn');
    if (firstBtn) {
      firstBtn.classList.add('active');
      selectedSize = firstBtn.dataset.size || firstBtn.textContent.trim();
    }
  }

  // add to cart button
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      Cart.add(product.id, product.price, selectedSize, product.name, product.image);
    });
  }
});