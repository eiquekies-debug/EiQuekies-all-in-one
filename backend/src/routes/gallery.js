import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleGalleryRoutes(path, method, request, env, user) {
  if (path === '/api/gallery' && method === 'GET') {
    const items = await env.DB.prepare('SELECT * FROM gallery ORDER BY created_at DESC').all();
    return jsonResponse({ success: true, data: items.results });
  }

  if (path === '/api/gallery' && method === 'POST') {
    const { title, image_url, category, order_id } = await request.json();
    const id = 'gal_' + Date.now();
    await env.DB.prepare(
      `INSERT INTO gallery (id, title, image_url, category, order_id) VALUES (?, ?, ?, ?, ?)`
    ).bind(id, title, image_url, category || 'KEK', order_id || null).run();

    return jsonResponse({ success: true, message: 'Gambar ditambah ke galeri!' });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
