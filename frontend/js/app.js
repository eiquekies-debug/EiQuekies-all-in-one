import { state } from './state.js';
import { handleRouting, navigateTo } from './router.js';
import { soundEngine } from './sound.js';
import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Terapkan Tema Dark Mode jika diaktifkan
  if (state.darkMode) {
    document.body.classList.add('dark-mode');
  }

  // 2. Daftar PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('EIQUEKIES PWA Service Worker Berjaya Didaftarkan'))
      .catch((err) => console.log('SW Registration Failed:', err));
  }

  // 3. Pautkan Bunyi Soft Click pada Semua Butang
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.btn') || e.target.closest('.nav-item')) {
      soundEngine.playClick();
    }
  });

  // 4. Pengurus Carian Pantas Global
  const searchBtn = document.getElementById('btn-quick-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = prompt('🔍 Cari Tempahan / Pelanggan / Resipi:');
      if (query) {
        showToast(`Mencari "${query}"...`);
        navigateTo('orders');
      }
    });
  }

  // 5. Dengar Pertukaran Routing Hash
  window.addEventListener('hashchange', handleRouting);
  
  // 6. Jalankan Routing Pertama Kali
  handleRouting();
});
