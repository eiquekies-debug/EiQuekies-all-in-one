import { state } from './state.js';

// Tukar URL ini kepada Cloudflare Worker API URL anda semasa pengeluaran
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8787/api' 
  : '/api';

export const api = {
  async request(endpoint, method = 'GET', data = null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }

    const config = {
      method,
      headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Berlaku ralat pelayan.');
      }

      return json;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },

  get(endpoint) { return this.request(endpoint, 'GET'); },
  post(endpoint, data) { return this.request(endpoint, 'POST', data); },
  put(endpoint, data) { return this.request(endpoint, 'PUT', data); },
  delete(endpoint) { return this.request(endpoint, 'DELETE'); }
};
