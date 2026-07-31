import { api } from '../api.js';

export async function renderGallery(container) {
  let images = [];
  try {
    const res = await api.get('/gallery');
    if (res.success) images = res.data;
  } catch (err) {
    console.log('Tiada gambar galeri.');
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2>📷 Galeri Gambar Tempahan</h2>
        <p style="color: var(--text-muted);">Koleksi hasil seni kek dan dessert EiqueKies.</p>
      </div>
      <button class="btn btn-primary">➕ Muat Naik Gambar</button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
      ${images.length === 0 ? `
        <div class="card" style="text-align: center; padding: 40px;">
          <span style="font-size: 3rem;">🎂</span>
          <p style="margin-top: 10px; color: var(--text-muted);">Belum ada gambar muat naik.</p>
        </div>
      ` : images.map(img => `
        <div class="card" style="padding: 10px;">
          <img src="${img.image_url}" style="width: 100%; height: 150px; object-fit: cover; border-radius: var(--radius-md);">
          <strong style="display: block; margin-top: 8px;">${img.title}</strong>
        </div>
      `).join('')}
    </div>
  `;
}
