// ============================================================
//  history.js — halaman riwayat transaksi
//  Depends on: main.js (formatIDR)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('historyContainer');
  if (!container) return;

  const history = JSON.parse(localStorage.getItem('rd_history') || '[]');

  if (!history.length) {
    container.innerHTML = `
      <div class="card" style="padding:3rem;text-align:center;">
        <div style="font-size:3rem;margin-bottom:1rem;">📦</div>
        <h3 style="color:#fff;margin-bottom:0.5rem;">Belum Ada Transaksi</h3>
        <p style="color:#888;margin-bottom:1.5rem;">Mulai belanja sekarang dan order kamu akan muncul di sini.</p>
        <a href="products.html" class="btn btn-primary">Belanja Sekarang</a>
      </div>`;
    return;
  }

  const statusColor = {
    'Paid':     '#22c55e',
    'Shipped':  '#3b82f6',
    'Pending':  '#f59e0b',
    'Cancelled':'#ef4444'
  };

  container.innerHTML = history.map(order => {
    const itemList = (order.items || []).map(i => `
      <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;
                  border-bottom:1px solid #1a1a1a;">
        <img
          src="${i.image || ''}"
          alt="${i.name}"
          onerror="this.src='https://placehold.co/40x40/111/da291c?text=MU'"
          style="width:40px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0;"
        >
        <div style="flex:1;min-width:0;">
          <div style="color:#fff;font-size:0.85rem;font-weight:600;
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${i.name}
          </div>
          <div style="color:#888;font-size:0.75rem;">× ${i.qty} — ${formatIDR(i.price * i.qty)}</div>
        </div>
      </div>
    `).join('');

    const color = statusColor[order.status] || '#888';

    return `
      <div class="card" style="padding:1.5rem;margin-bottom:1.25rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;
                    margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
          <div>
            <h3 style="color:#fff;margin:0;">${order.id}</h3>
            <p style="color:#888;font-size:0.8rem;margin:0.2rem 0 0;">${order.date}</p>
          </div>
          <span style="
            background:${color}22;
            color:${color};
            border:1px solid ${color}44;
            padding:0.25rem 0.75rem;
            border-radius:999px;
            font-size:0.75rem;
            font-weight:700;
            letter-spacing:0.08em;
            text-transform:uppercase;
          ">${order.status}</span>
        </div>

        <div style="margin-bottom:1rem;">${itemList}</div>

        <div style="display:flex;justify-content:space-between;align-items:center;
                    padding-top:0.75rem;border-top:1px solid #222;">
          <div style="color:#888;font-size:0.85rem;">
            ${order.name ? `👤 ${order.name}` : ''}
            ${order.payment ? ` · ${order.payment}` : ''}
          </div>
          <div style="color:var(--red);font-weight:700;font-size:1rem;">
            ${formatIDR(order.total)}
          </div>
        </div>
      </div>
    `;
  }).join('');
});