import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleFinanceRoutes(path, method, request, env, user) {
  if (path === '/api/finance' && method === 'GET') {
    const records = await env.DB.prepare('SELECT * FROM finances ORDER BY transaction_date DESC LIMIT 50').all();
    return jsonResponse({ success: true, data: records.results });
  }

  if (path === '/api/finance' && method === 'POST') {
    const { type, category, amount, payment_method, description, transaction_date } = await request.json();

    const id = 'fin_' + Date.now();
    await env.DB.prepare(
      `INSERT INTO finances (id, type, category, amount, payment_method, description, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, type, category, amount, payment_method || 'CASH', description || '', transaction_date || new Date().toISOString().split('T')[0]).run();

    return jsonResponse({ success: true, message: 'Rekod kewangan berjaya disimpan.' });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
