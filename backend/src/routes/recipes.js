import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleRecipeRoutes(path, method, request, env, user) {
  if (path === '/api/recipes' && method === 'GET') {
    const recipes = await env.DB.prepare('SELECT * FROM recipes ORDER BY title ASC').all();
    return jsonResponse({ success: true, data: recipes.results });
  }

  if (path === '/api/recipes' && method === 'POST') {
    const body = await request.json();
    const { title, category, base_yield, prep_time_mins, image_url, notes, ingredients } = body;

    const recipeId = 'rcp_' + Date.now();
    await env.DB.prepare(
      `INSERT INTO recipes (id, title, category, base_yield, prep_time_mins, image_url, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(recipeId, title, category || 'KEK', base_yield || 1, prep_time_mins || 0, image_url || '', notes || '').run();

    if (ingredients && Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        await env.DB.prepare(
          `INSERT INTO recipe_ingredients (id, recipe_id, inventory_item_id, quantity, unit)
           VALUES (?, ?, ?, ?, ?)`
        ).bind('ring_' + Date.now() + Math.random(), recipeId, ing.inventory_item_id, ing.quantity, ing.unit).run();
      }
    }

    return jsonResponse({ success: true, message: 'Resipi berjaya disimpan!', recipeId });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
