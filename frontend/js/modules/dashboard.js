import { api } from '../api.js';
import { formatRM, formatDate } from '../utils.js';
import { navigateTo } from '../router.js';

export async function renderDashboard(container) {
  let stats = {
    todayOrdersCount: 0,
    todaySalesTotal: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    netProfit: 0,
    upcomingOrders: [],
    lowStockItems: []
  };

  try {
    const res = await api.get('/dashboard/stats');
    if (res.success) stats = res.data;
  } catch (err) {
    console.log('Menggunakan data paparan asas...');
  }

  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2>🌸 Selamat Datang ke EIQUEKIES</h2>
      <p style="color: var(--text-muted);">Ringkasan perniagaan bakery anda hari ini.</p>
    </div>

    <!-- Quick Action Bar -->
    <div style="display: flex; gap: 10px; margin-bottom: 25px; overflow-x: auto; padding-bottom: 5px;">
      <button class="btn btn-primary" id="dash-btn-new-order">➕ Tempahan Baru</button>
      <button class="btn btn-secondary" onclick="window.location.hash='calculator'">🧮 Kira Kos Kek</button>
      <button class="btn btn-secondary" onclick="window.location.hash='todo'">📝 Tugasan Harian</button>
    </div>

    <!-- Stat Grid Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
      <div class="card" style="border-left: 5px solid var(--primary-pink);">
        <small style="color: var(--text-muted);">Jualan Hari Ini</small>
        <h3 style="font-size: 1.6rem; color: var(--primary-pink); margin-top: 5px;">${formatRM(stats.todaySalesTotal)}</h3>
        <small>${stats.todayOrdersCount} tempahan hari ini</small>
      </div>

      <div class="card" style="border-left: 5px solid var(--status-ready);">
        <small style="color: var(--text-muted);">Pendapatan Bulan Ini</small>
        <h3 style="font-size: 1.6rem; color: var(--status-ready); margin-top: 5px;">${formatRM(stats.monthlyIncome)}</h3>
      </div>

      <div class="card" style="border-left: 5px solid var(--status-danger);">
        <small style="color: var(--text-muted);">Perbelanjaan Bulan Ini</small>
        <h3 style="font-size: 1.6rem; color: var(--status-danger); margin-top: 5px;">${formatRM(stats.monthlyExpense)}</h3>
      </div>

      <div class="card" style="border-left: 5px solid var(--light-brown);">
        <small style="color: var(--text-muted);">Untung Bersih Bulan Ini</small>
        <h3 style="font-size: 1.6rem; color: var(--dark-brown); margin-top: 5px;">${formatRM(stats.netProfit)}</h3>
      </div>
    </div>

    <!-- Amaran Stok Rendah Banner -->
    ${stats.lowStockItems.length > 0 ? `
      <div class="card" style="background-color: #FFF3CD; border-color: #FFEEBA; color: #856404; margin-bottom: 25px;">
        ⚠️ <strong>Amaran Stok Rendah:</strong> ${stats.lowStockItems.map(i => `${i.name} (${i.current_stock} ${i.unit})`).join(', ')}
        <a href="#inventory" style="margin-left: 10px; color: #856404; font-weight: bold;">Urus Stok →</a>
      </div>
    ` : ''}

    <!-- Tempahan Akan Datang -->
    <div class="card">
      <h3 style="margin-bottom: 15px;">📌 Tempahan Sedia / Pickup Akan Datang</h3>
      ${stats.upcomingOrders.length === 0 ? '<p style="color: var(--text-muted);">Tiada tempahan akan datang.</p>' : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${stats.upcomingOrders.map(o => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--cream-bg); border-radius: var(--radius-md);">
              <div>
                <strong>#${o.order_number} - ${o.customer_name}</strong><br>
                <small style="color: var(--text-muted);">Tarikh Pickup: ${formatDate(o.pickup_date)}</small>
              </div>
              <div>
                <span class="badge badge-${o.status.toLowerCase()}">${o.status}</span>
                <span style="font-weight: bold; margin-left: 10px;">${formatRM(o.total_amount)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  document.getElementById('dash-btn-new-order').addEventListener('click', () => {
    navigateTo('orders');
  });
}
