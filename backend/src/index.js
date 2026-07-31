import { handleOptions, errorResponse } from './utils/response.js';
import { authenticateToken } from './middleware/auth.js';
import { handleAuthRoutes } from './routes/auth.js';
import { handleDashboardRoutes } from './routes/dashboard.js';
import { handleOrderRoutes } from './routes/orders.js';
import { handleCustomerRoutes } from './routes/customers.js';
import { handleInventoryRoutes } from './routes/inventory.js';
import { handleRecipeRoutes } from './routes/recipes.js';
import { handleCalculatorRoutes } from './routes/calculator.js';
import { handleFinanceRoutes } from './routes/finance.js';
import { handleTodoRoutes } from './routes/todo.js';
import { handleGalleryRoutes } from './routes/gallery.js';

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight Request
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // 2. Auth Public Routes
      if (path.startsWith('/api/auth')) {
        return await handleAuthRoutes(path, method, request, env);
      }

      // 3. Semak Pengesahan Pengguna (Authentication) bagi Laluan Terlindung
      const authResult = await authenticateToken(request, env);
      if (authResult.error) return authResult.error;

      const user = authResult.user;

      // 4. API Endpoints Routing
      if (path.startsWith('/api/dashboard')) return await handleDashboardRoutes(path, method, request, env, user);
      if (path.startsWith('/api/orders')) return await handleOrderRoutes(path, method, request, env, user);
      if (path.startsWith('/api/customers')) return await handleCustomerRoutes(path, method, request, env, user);
      if (path.startsWith('/api/inventory')) return await handleInventoryRoutes(path, method, request, env, user);
      if (path.startsWith('/api/recipes')) return await handleRecipeRoutes(path, method, request, env, user);
      if (path.startsWith('/api/calculator')) return await handleCalculatorRoutes(path, method, request, env, user);
      if (path.startsWith('/api/finance')) return await handleFinanceRoutes(path, method, request, env, user);
      if (path.startsWith('/api/todo')) return await handleTodoRoutes(path, method, request, env, user);
      if (path.startsWith('/api/gallery')) return await handleGalleryRoutes(path, method, request, env, user);

      return errorResponse('API Endpoint Tidak Dijumpai', 404);
    } catch (err) {
      return errorResponse('Ralat Pelayan Dalaman: ' + err.message, 500);
    }
  }
};
