import { api } from '../api.js';
import { state } from '../state.js';
import { navigateTo } from '../router.js';
import { showToast } from '../utils.js';

export async function renderLogin(container) {
  container.innerHTML = `
    <div style="max-width: 400px; margin: 40px auto;" class="card">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 3.5rem;">🧁</span>
        <h2 style="color: var(--primary-pink); margin-top: 10px;">EIQUEKIES</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Sistem Pengurusan Bakery Premium</p>
      </div>

      <form id="login-form">
        <div class="form-group">
          <label class="form-label">Nama Pengguna (Username)</label>
          <input type="text" id="login-username" class="form-control" required placeholder="Contoh: admin">
        </div>

        <div class="form-group">
          <label class="form-label">Kata Laluan</label>
          <input type="password" id="login-password" class="form-control" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
          🔑 Log Masuk
        </button>
      </form>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await api.post('/auth/login', { username, password });
      state.setUser(res.user, res.token);
      showToast(`Selamat kembali, ${res.user.full_name}! 💕`);
      navigateTo('dashboard');
    } catch (err) {
      showToast(err.message || 'Log masuk gagal.', 'danger');
    }
  });
}
