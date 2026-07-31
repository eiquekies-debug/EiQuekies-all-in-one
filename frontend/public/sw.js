const CACHE_NAME = 'eiquekies-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/style.css',
  '/css/components.css',
  '/css/dark-mode.css',
  '/js/app.js',
  '/js/sound.js',
  '/js/utils.js',
  '/js/api.js',
  '/js/router.js',
  '/js/state.js',
  '/public/manifest.json'
];

// Installation & Pre-caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation & Cleaning Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
