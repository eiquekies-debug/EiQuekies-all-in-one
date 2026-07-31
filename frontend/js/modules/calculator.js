import { api } from '../api.js';
import { formatRM } from '../utils.js';

export async function renderCalculator(container) {
  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2>🧮 Kalkulator Kos & Margin Keuntungan Kek</h2>
      <p style="color: var(--text-muted);">Kira kos bahan, packaging, elektrik, upah & cadangan harga jualan.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
      <!-- Borang Input Kos -->
      <div class="card">
        <h3 style="margin-bottom: 15px; color: var(--primary-pink);">📝 Input Kos Barangan</h3>
        
        <div class="form-group">
          <label class="form-label">Kos Bahan-Bahan (RM)</label>
          <input type="number" step="0.10" id="calc-ing" class="form-control" value="25.00">
        </div>
        <div class="form-group">
          <label class="form-label">Kos Packaging (Kotak, Board, Reben) (RM)</label>
          <input type="number" step="0.10" id="calc-pack" class="form-control" value="5.50">
        </div>
        <div class="form-group">
          <label class="form-label">Kos Elektrik & Air (RM)</label>
          <input type="number" step="0.10" id="calc-util" class="form-control" value="3.00">
        </div>
        <div class="form-group">
          <label class="form-label">Kos Upah Masa / Labour (RM)</label>
          <input type="number" step="0.10" id="calc-labour" class="form-control" value="15.00">
        </div>
        <div class="form-group">
          <label class="form-label">Margin Keuntungan Dihajati (%)</label>
          <input type="number" id="calc-margin" class="form-control" value="40">
        </div>

        <button id="btn-run-calc" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
          ⚡ Kira Harga Cadangan
        </button>
      </div>

      <!-- Result Card -->
      <div class="card" id="calc-result" style="background: var(--cream-card);">
        <h3 style="margin-bottom: 15px;">📊 Keputusan Pengiraan</h3>
        <div style="font-size: 1.1rem; line-height: 2;">
          <div>Jumlah Kos Modal: <strong id="res-cost">RM 48.50</strong></div>
          <div>Untung Bersih (Retail): <strong id="res-profit" style="color: var(--status-ready);">RM 19.40</strong></div>
          <hr style="margin: 15px 0; border: none; border-top: 1px solid var(--border-color);">
          
          <h4 style="color: var(--primary-pink); margin-bottom: 10px;">🏷️ Cadangan Tier Harga Jualan:</h4>
          <ul>
            <li>Retail / Walk-in: <strong id="tier-retail">RM 67.90</strong></li>
            <li>Agent Price (-15%): <strong id="tier-agent">RM 57.70</strong></li>
            <li>Dropship Price (-10%): <strong id="tier-dropship">RM 61.10</strong></li>
            <li>Wholesale / Borong (-25%): <strong id="tier-wholesale">RM 50.90</strong></li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-run-calc').addEventListener('click', async () => {
    const payload = {
      ingredients_cost: parseFloat(document.getElementById('calc-ing').value) || 0,
      packaging_cost: parseFloat(document.getElementById('calc-pack').value) || 0,
      electricity_cost: parseFloat(document.getElementById('calc-util').value) || 0,
      labour_cost: parseFloat(document.getElementById('calc-labour').value) || 0,
      profit_margin_percent: parseFloat(document.getElementById('calc-margin').value) || 30
    };

    try {
      const res = await api.post('/calculator/cost', payload);
      if (res.success) {
        const d = res.data;
        document.getElementById('res-cost').innerText = formatRM(d.totalCost);
        document.getElementById('res-profit').innerText = formatRM(d.profitAmount);
        document.getElementById('tier-retail').innerText = formatRM(d.pricingTiers.retail);
        document.getElementById('tier-agent').innerText = formatRM(d.pricingTiers.agent);
        document.getElementById('tier-dropship').innerText = formatRM(d.pricingTiers.dropship);
        document.getElementById('tier-wholesale').innerText = formatRM(d.pricingTiers.wholesale);
      }
    } catch (err) {
      console.error(err);
    }
  });
}
