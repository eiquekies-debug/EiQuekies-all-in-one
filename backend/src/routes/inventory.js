import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleInventoryRoutes(path, method, request, env, user) {
  // GET /api/inventory
  if (path === '/api/inventory' && method === 'GET') {
    const items = await env.DB.prepare('SELECT * FROM inventory_items ORDER BY category ASC, name ASC').all();
    return jsonResponse({ success: true, data: items.results });
  }

  // POST /api/inventory
  if (path === '/api/inventory' && method === 'POST') {
    const body = await request.json();
    const { name, category, unit, current_stock, min_stock_alert, cost_per_unit, expiry_date, supplier } = body;

    const id = 'inv_' + Date.now();
    await env.DB.prepare(
      `INSERT INTO inventory_items (id, name, category, unit, current_stock, min_stock_alert, cost_per_unit, expiry_date, supplier)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, name, category, unit, current_stock || 0, min_stock_alert || 5, cost_per_unit || 0, expiry_date || null, supplier || '').run();

    return jsonResponse({ success: true, message: 'Item inventori berjaya ditambah!' });
  }

  // POST /api/inventory/movement (Terima/Guna Stok)
  if (path === '/api/inventory/movement' && method === 'POST') {
    const { item_id, type, quantity, notes } = await request.json();

    const item = await env.DB.prepare('SELECT * FROM inventory_items WHERE id = ?').bind(item_id).first();
    if (!item) return errorResponse('Item tidak wujud', 404);

    let newStock = item.current_stock;
    if (type === 'IN') newStock += Number(quantity);
    if (type === 'OUT') newStock -= Number(quantity);
    if (type === 'ADJUSTMENT') newStock = Number(quantity);

    await env.DB.prepare('UPDATE inventory_items SET current_stock = ? WHERE id = ?').bind(newStock, item_id).run();

    // Rekod Pergerakan Stok
    await env.DB.prepare(
      `INSERT INTO stock_movements (id, item_id, type, quantity, notes)
       VALUES (?, ?, ?, ?, ?)`
    ).bind('mov_' + Date.now(), item_id, type, quantity, notes || '').run();

    return jsonResponse({ success: true, message: 'Pergerakan stok direkodkan.', newStock });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
