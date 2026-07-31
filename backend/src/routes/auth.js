import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleAuthRoutes(path, method, request, env) {
  // POST /api/auth/register
  if (path === '/api/auth/register' && method === 'POST') {
    const body = await request.json();
    const { username, email, password, full_name, role, phone } = body;

    if (!username || !email || !password || !full_name) {
      return errorResponse('Sila isi semua maklumat mandatori.');
    }

    const id = 'usr_' + Date.now();
    // Di produksi, gunakan crypto.subtle untuk hash kata laluan
    const password_hash = btoa(password); 

    try {
      await env.DB.prepare(
        `INSERT INTO users (id, username, email, password_hash, full_name, role, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(id, username, email, password_hash, full_name, role || 'STAFF', phone || '').run();

      return jsonResponse({ success: true, message: 'Pendaftaran berjaya!', userId: id });
    } catch (e) {
      return errorResponse('Username atau e-mel telah wujud.', 400);
    }
  }

  // POST /api/auth/login
  if (path === '/api/auth/login' && method === 'POST') {
    const body = await request.json();
    const { username, password } = body;

    const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first();

    if (!user || user.password_hash !== btoa(password)) {
      return errorResponse('Username atau kata laluan salah.', 401);
    }

    // Bina Token Sesi Simpanan
    const tokenPayload = { userId: user.id, role: user.role, exp: Date.now() + 86400000 };
    const token = 'header.' + btoa(JSON.stringify(tokenPayload)) + '.signature';

    return jsonResponse({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        email: user.email
      }
    });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
