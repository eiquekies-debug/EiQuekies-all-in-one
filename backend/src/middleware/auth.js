import { errorResponse } from '../utils/response.js';

// Pengesahan Token Mudah (JWT / Session Token Mock)
export async function authenticateToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: errorResponse('Akses ditolak. Token tidak wujud.', 401) };
  }

  const token = authHeader.split(' ')[1];
  try {
    // Dekod token payload (Base64 JSON ringkas untuk demo/persekitaran Worker)
    const payload = JSON.parse(atob(token.split('.')[1] || token));
    
    // Semak user dalam DB
    const user = await env.DB.prepare('SELECT id, username, email, full_name, role FROM users WHERE id = ?')
      .bind(payload.userId)
      .first();

    if (!user) {
      return { error: errorResponse('Sesi tidak sah atau telah tamat.', 401) };
    }

    return { user };
  } catch (err) {
    return { error: errorResponse('Token tidak sah.', 401) };
  }
}

// Kebenaran mengikut Role (OWNER / STAFF / AGENT)
export function checkRole(allowedRoles) {
  return (userRole) => allowedRoles.includes(userRole);
}
