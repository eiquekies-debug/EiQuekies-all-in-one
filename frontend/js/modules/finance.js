import { api } from '../api.js';
import { formatRM } from '../utils.js';

export async function renderFinance(container) {
  let records = [];
  try {
    const res = await api.get('/finance');
    if (res.success) records = res.data;
  } catch (err) {
    console.log('Tiada data kewangan.');
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2>💵 Laporan Kewangan & Untung Rugi</h2>
        <p style="color: var(--text-muted);">Rekod aliran tunai harian dan bulanan.</p>
      </div>
      <button class="btn btn-primary">➕ Rekod Transaksi</button>
    </div>

    <div class="card">
      <h3>📜 Sejarah Transaksi Terkini</h3>
      <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
        ${records.length === 0 ? 'Tiada rekod kewangan.' : records.map(r => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color);">
            <div>
              <strong>${r.category}</strong> (${r.description || '-'})\n
              <small style="color: var(--text-muted); display: block;">${r.transaction_date}</small>
            </div>
            <div style="font-weight: bold; color: ${r.type === 'INCOME' ? 'var(--status-ready)' : 'var(--status-danger)'};">
              ${r.type === 'INCOME' ? '+' : '-'} ${formatRM(r.amount)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
