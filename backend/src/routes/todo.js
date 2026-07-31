import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleTodoRoutes(path, method, request, env, user) {
  if (path === '/api/todo' && method === 'GET') {
    const todos = await env.DB.prepare('SELECT * FROM todos ORDER BY status ASC, due_date ASC').all();
    return jsonResponse({ success: true, data: todos.results });
  }

  if (path === '/api/todo' && method === 'POST') {
    const { title, due_date } = await request.json();
    const id = 'todo_' + Date.now();
    await env.DB.prepare('INSERT INTO todos (id, title, due_date) VALUES (?, ?, ?)').bind(id, title, due_date || null).run();
    return jsonResponse({ success: true, message: 'Tugasan ditambah.' });
  }

  if (path === '/api/todo/toggle' && method === 'PUT') {
    const { id, status } = await request.json();
    await env.DB.prepare('UPDATE todos SET status = ? WHERE id = ?').bind(status, id).run();
    return jsonResponse({ success: true, message: 'Status tugasan dikemaskini.' });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
