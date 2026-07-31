import { api } from '../api.js';

export async function renderRecipes(container) {
  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2>🧁 Buku Resipi & Auto Scaling Sukatan</h2>
      <p style="color: var(--text-muted);">Simpan resipi kegemaran & ubah sukatan ikut saiz kek automatik.</p>
    </div>

    <div class="card">
      <h3 style="color: var(--primary-pink); margin-bottom: 10px;">🍰 Red Velvet Cake Premium</h3>
      <p style="color: var(--text-muted); margin-bottom: 15px;">Resipi asas untuk 1 x Kek 8 Inch (Yield: 1.2kg)</p>

      <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center;">
        <label><strong>Pilih Saiz Kek Target:</strong></label>
        <select id="recipe-scale" class="form-control" style="max-width: 180px;">
          <option value="1">8 Inch (Asal)</option>
          <option value="1.5">10 Inch (x 1.5)</option>
          <option value="0.5">6 Inch (x 0.5)</option>
        </select>
      </div>

      <ul id="ingredient-list" style="line-height: 2; padding-left: 20px;">
        <li>Tepung Kek: <strong id="ing-1">250</strong> gram</li>
        <li>Butter Anchor: <strong id="ing-2">120</strong> gram</li>
        <li>Gula Halus: <strong id="ing-3">200</strong> gram</li>
        <li>Serbuk Koko: <strong id="ing-4">15</strong> gram</li>
      </ul>
    </div>
  `;

  document.getElementById('recipe-scale').addEventListener('change', (e) => {
    const factor = parseFloat(e.target.value);
    document.getElementById('ing-1').innerText = (250 * factor).toFixed(0);
    document.getElementById('ing-2').innerText = (120 * factor).toFixed(0);
    document.getElementById('ing-3').innerText = (200 * factor).toFixed(0);
    document.getElementById('ing-4').innerText = (15 * factor).toFixed(0);
  });
}
