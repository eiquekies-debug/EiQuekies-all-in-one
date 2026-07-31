import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleDashboardRoutes(path, method, request, env, user) {
  if (path === '/api/dashboard/stats' && method === 'GET') {
    const today = new Date().toISOString().split('T')[0];

    // 1. Tempahan Hari Ini
    const todayOrders = await env.DB.prepare(
      `SELECT COUNT(*) as count, SUM(total_amount) as sales 
       FROM orders WHERE DATE(created_at) = ? AND status != 'CANCELLED'`
    ).bind(today).first();

    // 2. Tempahan Akan Datang (Pickup Hari Ini & Besok)
    const upcomingOrders = await env.DB.prepare(
      `SELECT o.*, c.name as customer_name, c.phone as customer_phone 
       FROM orders o JOIN customers c ON o.customer_id = c.id 
       WHERE o.status IN ('PENDING', 'IN_PROGRESS', 'READY') 
       ORDER BY o.pickup_date ASC LIMIT 5`
    ).all();

    // 3. Ringkasan Kewangan (Bulan Ini)
    const incomeMonth = await env.DB.prepare(
      `SELECT SUM(amount) as total FROM finances WHERE type = 'INCOME' AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')`
    ).first();

    const expenseMonth = await env.DB.prepare(
      `SELECT SUM(amount) as total FROM finances WHERE type = 'EXPENSE' AND strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')`
    ).first();

    // 4. Amaran Stok Rendah
    const lowStockAlerts = await env.DB.prepare(
      `SELECT * FROM inventory_items WHERE current_stock <= min_stock_alert ORDER BY current_stock ASC`
    ).all();

    return jsonResponse({
      success: true,
      data: {
        todayOrdersCount: todayOrders?.count || 0,
        todaySalesTotal: todayOrders?.sales || 0,
        monthlyIncome: incomeMonth?.total || 0,
        monthlyExpense: expenseMonth?.total || 0,
        netProfit: (incomeMonth?.total || 0) - (expenseMonth?.total || 0),
        upcomingOrders: upcomingOrders?.results || [],
        lowStockItems: lowStockAlerts?.results || []
      }
    });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
