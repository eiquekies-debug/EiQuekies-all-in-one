import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleOrderRoutes(path, method, request, env, user) {
  // GET /api/orders
  if (path === '/api/orders' && method === 'GET') {
    const orders = await env.DB.prepare(
      `SELECT o.*, c.name as customer_name, c.phone as customer_phone 
       FROM orders o JOIN customers c ON o.customer_id = c.id 
       ORDER BY o.created_at DESC`
    ).all();
    return jsonResponse({ success: true, data: orders.results });
  }

  // POST /api/orders
  if (path === '/api/orders' && method === 'POST') {
    const body = await request.json();
    const {
      customer_id, order_type, pricing_tier, items,
      discount_amount, voucher_code, shipping_fee, additional_fee,
      total_cost, total_amount, deposit_paid, pickup_date, delivery_date, notes
    } = body;

    const orderId = 'ord_' + Date.now();
    const orderNum = 'EQK-' + Math.floor(10000 + Math.random() * 90000);
    const balanceDue = total_amount - (deposit_paid || 0);
    const qrHash = btoa(orderId + '_' + Date.now()).slice(0, 16);

    // Insert Order Utama
    await env.DB.prepare(
      `INSERT INTO orders (
        id, order_number, customer_id, order_type, pricing_tier, status,
        discount_amount, voucher_code, shipping_fee, additional_fee, total_cost,
        total_amount, deposit_paid, balance_due, pickup_date, delivery_date, notes, qr_code_hash
      ) VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderId, orderNum, customer_id, order_type || 'KEK', pricing_tier || 'RETAIL',
      discount_amount || 0, voucher_code || '', shipping_fee || 0, additional_fee || 0,
      total_cost || 0, total_amount, deposit_paid || 0, balanceDue,
      pickup_date, delivery_date, notes || '', qrHash
    ).run();

    // Insert Item Tempahan
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await env.DB.prepare(
          `INSERT INTO order_items (id, order_id, recipe_id, item_name, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind('item_' + Date.now() + Math.random(), orderId, item.recipe_id || null, item.item_name, item.quantity, item.unit_price, item.subtotal).run();
      }
    }

    // Rekod Kewangan Otomatis (Apabila Deposit dibayar)
    if (deposit_paid > 0) {
      await env.DB.prepare(
        `INSERT INTO finances (id, type, category, amount, payment_method, reference_id, description, transaction_date)
         VALUES (?, 'INCOME', 'Deposit Tempahan', ?, 'ONLINE', ?, ?, DATE('now'))`
      ).bind('fin_' + Date.now(), deposit_paid, orderId, `Deposit tempahan #${orderNum}`).run();
    }

    // Tambah Loyalty Points Pelanggan (1 Point bagi setiap RM10)
    const pointsEarned = Math.floor(total_amount / 10);
    await env.DB.prepare(
      `UPDATE customers SET loyalty_points = loyalty_points + ? WHERE id = ?`
    ).bind(pointsEarned, customer_id).run();

    return jsonResponse({ success: true, message: 'Tempahan berjaya dicipta!', orderId, orderNum });
  }

  // PUT /api/orders/status (Kemaskini Status Tempahan & Baki Bayaran)
  if (path === '/api/orders/status' && method === 'PUT') {
    const { order_id, status, balance_paid } = await request.json();

    const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(order_id).first();
    if (!order) return errorResponse('Tempahan tidak dijumpai', 404);

    let newBalance = order.balance_due;
    if (balance_paid && balance_paid > 0) {
      newBalance = Math.max(0, order.balance_due - balance_paid);

      // Catat pendapatan baki bayaran
      await env.DB.prepare(
        `INSERT INTO finances (id, type, category, amount, payment_method, reference_id, description, transaction_date)
         VALUES (?, 'INCOME', 'Baki Tempahan', ?, 'ONLINE', ?, ?, DATE('now'))`
      ).bind('fin_' + Date.now(), balance_paid, order_id, `Bayaran Baki #${order.order_number}`).run();
    }

    await env.DB.prepare(
      `UPDATE orders SET status = ?, balance_due = ? WHERE id = ?`
    ).bind(status || order.status, newBalance, order_id).run();

    return jsonResponse({ success: true, message: 'Status tempahan dikemaskini!' });
  }

  // GET /api/orders/verify-qr/:hash (Semak Tempahan Menggunakan QR Code)
  if (path.startsWith('/api/orders/verify-qr/') && method === 'GET') {
    const hash = path.split('/')[4];
    const order = await env.DB.prepare(
      `SELECT o.*, c.name as customer_name, c.phone as customer_phone 
       FROM orders o JOIN customers c ON o.customer_id = c.id 
       WHERE o.qr_code_hash = ?`
    ).bind(hash).first();

    if (!order) return errorResponse('QR Code Tempahan tidak sah!', 404);
    return jsonResponse({ success: true, data: order });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
