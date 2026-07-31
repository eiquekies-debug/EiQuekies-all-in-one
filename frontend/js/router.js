import { state } from './state.js';
import { renderLogin } from './modules/auth.js';
import { renderDashboard } from './modules/dashboard.js';
import { renderOrders } from './modules/orders.js';
import { renderCalculator } from './modules/calculator.js';
import { renderInventory } from './modules/inventory.js';
import { renderCustomers } from './modules/customers.js';
import { renderRecipes } from './modules/recipes.js';
import { renderFinance } from './modules/finance.js';
import { renderCalendar } from './modules/calendar.js';
import { renderGallery } from './modules/gallery.js';
import { renderTodo } from './modules/todo.js';
import { renderSettings } from './modules/settings.js';

const routes = {
  login: renderLogin,
  dashboard: renderDashboard,
  orders: renderOrders,
  calculator: renderCalculator,
  inventory: renderInventory,
  customers: renderCustomers,
  recipes: renderRecipes,
  finance: renderFinance,
  calendar: renderCalendar,
  gallery: renderGallery,
  todo: renderTodo,
  settings: renderSettings
};

export function navigateTo(route) {
  window.location.hash = route;
}

export async function handleRouting() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  const targetRoute = routes[hash] ? hash : 'dashboard';

  // Semakan Pengesahan Sesi (Auth Guard)
  if (!state.token && targetRoute !== 'login') {
    navigateTo('login');
    return;
  }

  state.currentView = targetRoute;
  
  // Kemaskini Nav Active State
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.dataset.route === targetRoute) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  const viewContainer = document.getElementById('app-view');
  viewContainer.innerHTML = '<div style="text-align:center; padding: 40px;">⏳ Memuatkan...</div>';

  try {
    const renderFn = routes[targetRoute];
    if (renderFn) {
      await renderFn(viewContainer);
    }
  } catch (err) {
    viewContainer.innerHTML = `<div class="card" style="color: red;">Ralat memuatkan halaman: ${err.message}</div>`;
  }
}
