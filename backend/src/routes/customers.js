import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleCustomerRoutes(path, method, request, env, user) {
  // GET /api/customers
  if (path === '/api/customers' && method === 'GET') {
    const customers = await env.DB.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
    return jsonResponse({ success: true, data: customers.results });
  }

  // GET /api/customers/birthdays (Hari Lahir Bulan Ini)
  if (path === '/api/customers/birthdays' && method === 'GET') {
    const birthdays = await env.DB.prepare(
      `SELECT * FROM customers WHERE strftime('%m', birthday) = strftime('%m', 'now') ORDER BY strftime('%d', birthday) ASC`
    ).all();
    return jsonResponse({ success: true, data: birthdays.results });
  }

  // POST /api/customers
  if (path === '/api/customers' && method === 'POST') {
    const body = await request.json();
    const { name, phone, email, address, customer_type, birthday, notes } = body;

    if (!name || !phone) return errorResponse('Nama dan nombor telefon wajib diisi.');

    const id = 'cust_' + Date.now();
    await env.DB.prepare(
      `INSERT INTO customers (id, name, phone, email, address, customer_type, birthday, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, name, phone, email || '', address || '', customer_type || 'RETAIL', birthday || null, notes || '').run();

    return jsonResponse({ success: true, message: 'Pelanggan berjaya didaftarkan!', customerId: id });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
