import { state } from '../state.js';
import { soundEngine } from '../sound.js';
import { navigateTo } from '../router.js';
import { showToast } from '../utils.js';

export async function renderSettings(container) {
  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2>⚙️ Tetapan Aplikasi</h2>
      <p style="color: var(--text-muted);">Tetapan tema, bunyi, sandaran data & profil.</p>
    </div>

    <div class="card" style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Toggle Dark Mode -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>🌙 Mode Gelap (Dark Mode)</strong>
          <small style="display: block; color: var(--text-muted);">Tukar kepada tema gelap pastel</small>
        </div>
        <input type="checkbox" id="toggle-dark" ${state.darkMode ? 'checked' : ''} style="width: 22px; height: 22px;">
      </div>

      <hr style="border: none; border-top: 1px solid var(--border-color);">

      <!-- Toggle Sound FX -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>🔊 Bunyi Klik Butang (Sound Effects)</strong>
          <small style="display: block; color: var(--text-muted);">Mainkan bunyi lembut apabila butang ditekan</small>
        </div>
        <input type="checkbox" id="toggle-sound" ${soundEngine.enabled ? 'checked' : ''} style="width: 22px; height: 22px;">
      </div>

      <hr style="border: none; border-top: 1px solid var(--border-color);">

      <!-- Backup & Restore -->
      <div>
        <strong>💾 Sandaran & Pulihan Data (Backup & Restore)</strong>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Muat turun salinan pangkalan data JSON anda.</p>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button id="btn-backup" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">📥 Muat Turun Backup</button>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid var(--border-color);">

      <!-- Log Keluar -->
      <div>
        <button id="btn-logout" class="btn btn-primary" style="background-color: var(--status-danger); width: 100%;">
          🚪 Log Keluar Sesi
        </button>
      </div>
    </div>
  `;

  document.getElementById('toggle-dark').addEventListener('change', (e) => {
    state.setDarkMode(e.target.checked);
  });

  document.getElementById('toggle-sound').addEventListener('change', (e) => {
    soundEngine.toggleSound(e.target.checked);
  });

  document.getElementById('btn-backup').addEventListener('click', () => {
    showToast('Memuat turun fail salinan backup...');
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    state.setUser(null, null);
    showToast('Anda telah log keluar.');
    navigateTo('login');
  });
}
