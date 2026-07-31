class StateManager {
  constructor() {
    this.token = localStorage.getItem('eiquekies_token') || null;
    this.user = JSON.parse(localStorage.getItem('eiquekies_user') || 'null');
    this.darkMode = localStorage.getItem('eiquekies_dark_mode') === 'true';
    this.currentView = 'dashboard';
    this.listeners = [];
  }

  setUser(user, token) {
    this.user = user;
    this.token = token;
    if (token) {
      localStorage.setItem('eiquekies_token', token);
      localStorage.setItem('eiquekies_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eiquekies_token');
      localStorage.removeItem('eiquekies_user');
    }
    this.notify();
  }

  setDarkMode(enabled) {
    this.darkMode = enabled;
    localStorage.setItem('eiquekies_dark_mode', enabled);
    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }
}

export const state = new StateManager();
