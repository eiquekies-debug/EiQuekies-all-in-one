import { api } from '../api.js';
import { formatRM } from '../utils.js';

export async function renderInventory(container) {
  let items = [];
  try {
    const res = await api.get('/inventory');
    if (res.success) items = res.data;
  } catch (err) {
    console.log('Tiada sambungan API inventori');
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2>🧈 Inventori Bahan & Packaging</h2>
        <p style="color: var(--text-muted);">Pantau stok bahan, kotak kek & reben.</p>
      </div>
      <button id="btn-add-inventory" class="btn btn-primary">➕ Tambah Bahan</button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
      ${items.length === 0 ? '<div class="card">Tiada stok direkodkan.</div>' : items.map(item => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <span class="badge" style="background: var(--soft-pink); color: var(--primary-pink);">${item.category}</span>
              <h3 style="margin-top: 8px;">${item.name}</h3>
            </div>
            ${item.current_stock <= item.min_stock_alert ? '<span class="badge badge-pending">⚠️ Stok Rendah</span>' : ''}
          </div>

          <div style="margin: 15px 0;">
            <div style="font-size: 1.4rem; font-weight: bold; color: var(--dark-brown);">
              ${item.current_stock} <small style="font-size: 0.9rem;">${item.unit}</small>
            </div>
            <small style="color: var(--text-muted);">Kos Unit: ${formatRM(item.cost_per_unit)} / ${item.unit}</small>
          </div>

          <button class="btn btn-secondary btn-stock-adjust" data-id="${item.id}" style="width: 100%; padding: 8px;">
            🔄 Kemaskini / Terima Stok
          </button>
        </div>
      `).join('')}
    </div>
  `;
}
