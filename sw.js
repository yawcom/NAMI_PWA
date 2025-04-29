const CACHE_NAME = 'nami-game-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.json',
  './assets/bg.png',
  './assets/bg1.png',
  './assets/bg2.png',
  './assets/ship.png',
  './assets/chest.png',
  './assets/obstacle.png',
  './assets/water.png',
  './assets/Copy.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update cache when new version is available
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});