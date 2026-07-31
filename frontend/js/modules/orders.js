import { api } from '../api.js';
import { formatRM, formatDate, showToast } from '../utils.js';
import { generateWhatsAppLink, WhatsAppTemplates } from '../../../backend/src/utils/whatsapp.js';

export async function renderOrders(container) {
  let orders = [];
  try {
    const res = await api.get('/orders');
    if (res.success) orders = res.data;
  } catch (err) {
    console.log('Tiada sambungan API tempahan...');
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2>📦 Tempahan Kek & Kuih</h2>
        <p style="color: var(--text-muted);">Urus tempahan, deposit dan baki bayaran.</p>
      </div>
      <button id="btn-create-order" class="btn btn-primary">➕ Tempahan Baru</button>
    </div>

    <!-- Senarai Tempahan Cards -->
    <div style="display: flex; flex-direction: column; gap: 15px;">
      ${orders.length === 0 ? '<div class="card">Tiada tempahan direkodkan. Klik "Tempahan Baru" untuk mencipta.</div>' : orders.map(o => {
        const waMsg = WhatsAppTemplates.orderConfirmation(o.customer_name, o.order_number, o.total_amount, o.deposit_paid, o.balance_due);
        const waUrl = generateWhatsAppLink(o.customer_phone || '', waMsg);

        return `
          <div class="card" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <h3 style="color: var(--primary-pink);">#${o.order_number}</h3>
                <strong>👤 ${o.customer_name}</strong> (${o.pricing_tier})
              </div>
              <div>
                <span class="badge badge-${o.status.toLowerCase()}">${o.status}</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; background: var(--cream-bg); padding: 12px; border-radius: var(--radius-md); font-size: 0.9rem;">
              <div>💰 Total: <strong>${formatRM(o.total_amount)}</strong></div>
              <div>💳 Deposit: <strong>${formatRM(o.deposit_paid)}</strong></div>
              <div>⚠️ Baki: <strong style="color: var(--status-danger);">${formatRM(o.balance_due)}</strong></div>
              <div>📅 Pickup: <strong>${formatDate(o.pickup_date)}</strong></div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; margin-top: 5px;">
              <a href="${waUrl}" target="_blank" class="btn btn-whatsapp" style="padding: 8px 16px; font-size: 0.85rem; text-decoration: none;">
                💬 WhatsApp Pelanggan
              </a>
              <button class="btn btn-secondary btn-update-status" data-id="${o.id}" style="padding: 8px 16px; font-size: 0.85rem;">
                🔄 Status / Bayar Baki
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Listener Modal Tempahan Baru
  document.getElementById('btn-create-order').addEventListener('click', () => {
    openNewOrderModal();
  });
}

function openNewOrderModal() {
  const modalContainer = document.getElementById('modal-container');
  const modalContent = document.getElementById('modal-content');
  modalContainer.style.display = 'flex';

  modalContent.innerHTML = `
    <h3 style="margin-bottom: 15px; color: var(--primary-pink);">➕ Tambah Tempahan Baru</h3>
    <form id="form-new-order">
      <div class="form-group">
        <label class="form-label">ID Pelanggan (atau Nama)</label>
        <input type="text" id="ord-cust-id" class="form-control" placeholder="cust_1" required value="cust_1">
      </div>
      <div class="form-group">
        <label class="form-label">Kategori Tempahan</label>
        <select id="ord-type" class="form-control">
          <option value="KEK">Kek Custom</option>
          <option value="KUIH">Kuih Muih</option>
          <option value="DESSERT">Dessert Box</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tier Harga (Pricing Tier)</label>
        <select id="ord-tier" class="form-control">
          <option value="RETAIL">Retail (Harga Biasa)</option>
          <option value="AGENT">Agent Price</option>
          <option value="DROPSHIP">Dropship Price</option>
          <option value="WHOLESALE">Wholesale (Borong)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nama Barangan/Kek</label>
        <input type="text" id="ord-item-name" class="form-control" placeholder="Kek Red Velvet 8 Inch" required>
      </div>
      <div class="form-group">
        <label class="form-label">Jumlah Harga (RM)</label>
        <input type="number" step="0.01" id="ord-total" class="form-control" placeholder="120.00" required>
      </div>
      <div class="form-group">
        <label class="form-label">Deposit Dibayar (RM)</label>
        <input type="number" step="0.01" id="ord-deposit" class="form-control" placeholder="50.00" value="0">
      </div>
      <div class="form-group">
        <label class="form-label">Tarikh Pickup / Delivery</label>
        <input type="date" id="ord-pickup-date" class="form-control" required>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button type="submit" class="btn btn-primary" style="flex: 1;">Disimpan</button>
        <button type="button" class="btn btn-secondary" id="btn-close-modal">Batal</button>
      </div>
    </form>
  `;

  document.getElementById('btn-close-modal').addEventListener('click', () => {
    modalContainer.style.display = 'none';
  });

  document.getElementById('form-new-order').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      customer_id: document.getElementById('ord-cust-id').value,
      order_type: document.getElementById('ord-type').value,
      pricing_tier: document.getElementById('ord-tier').value,
      items: [{
        item_name: document.getElementById('ord-item-name').value,
        quantity: 1,
        unit_price: parseFloat(document.getElementById('ord-total').value),
        subtotal: parseFloat(document.getElementById('ord-total').value)
      }],
      total_amount: parseFloat(document.getElementById('ord-total').value),
      deposit_paid: parseFloat(document.getElementById('ord-deposit').value) || 0,
      pickup_date: document.getElementById('ord-pickup-date').value
    };

    try {
      await api.post('/orders', payload);
      showToast('Tempahan berjaya ditambah! 🧁');
      modalContainer.style.display = 'none';
      renderOrders(document.getElementById('app-view'));
    } catch (err) {
      showToast('Ralat menambah tempahan', 'danger');
    }
  });
}
