import { api } from '../api.js';
import { showToast } from '../utils.js';

export async function renderTodo(container) {
  let todos = [];
  try {
    const res = await api.get('/todo');
    if (res.success) todos = res.data;
  } catch (err) {
    console.log('Tiada tugasan.');
  }

  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h2>📝 Senarai Tugasan Harian (To-Do)</h2>
      <p style="color: var(--text-muted);">Checklist penyediaan bahan, baking & deco.</p>
    </div>

    <div class="card">
      <form id="form-todo" style="display: flex; gap: 10px; margin-bottom: 20px;">
        <input type="text" id="todo-input" class="form-control" placeholder="Contoh: Beli 10kg Tepung Kek..." required>
        <button type="submit" class="btn btn-primary" style="white-space: nowrap;">➕ Tambah</button>
      </form>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${todos.length === 0 ? '<p style="color: var(--text-muted);">Tiada tugasan aktif.</p>' : todos.map(t => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: var(--cream-bg); border-radius: var(--radius-md);">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" class="todo-check" data-id="${t.id}" ${t.status === 'COMPLETED' ? 'checked' : ''}>
              <span style="${t.status === 'COMPLETED' ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${t.title}</span>
            </label>
            <span class="badge ${t.status === 'COMPLETED' ? 'badge-delivered' : 'badge-pending'}">${t.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('form-todo').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('todo-input').value;
    try {
      await api.post('/todo', { title });
      showToast('Tugasan ditambah!');
      renderTodo(container);
    } catch (err) {
      showToast('Ralat menambah tugasan', 'danger');
    }
  });
}
