import { api } from '../api.js';

export async function renderCustomers(container) {
  let customers = [];
  try {
    const res = await api.get('/customers');
    if (res.success) customers = res.data;
  } catch (err) {
    console.log('Tiada data pelanggan...');
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2>👥 Direktori Pelanggan</h2>
        <p style="color: var(--text-muted);">Program Loyalty Points & Hari Lahir Pelanggan.</p>
      </div>
      <button class="btn btn-primary">➕ Pelanggan Baru</button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${customers.length === 0 ? '<div class="card">Tiada pelanggan didaftarkan.</div>' : customers.map(c => `
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3>${c.name} <span class="badge badge-ready">${c.customer_type}</span></h3>
            <small style="color: var(--text-muted);">📞 ${c.phone} | 🎂 Hari Lahir: ${c.birthday || 'Tiada'}</small>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--primary-pink);">⭐ ${c.loyalty_points} Points</div>
            <small style="color: var(--text-muted);">${c.notes || 'Tiada nota'}</small>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
