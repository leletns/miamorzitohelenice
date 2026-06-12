// Service worker: guarda TUDO em cache para o presente funcionar
// offline, para sempre, no celular dela. 💕
const CACHE = 'miamorzito-v6';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './assets/fonts/pressstart2p-latin.woff2',
  './assets/fonts/pressstart2p-latin-ext.woff2',
  './js/challenges.js',
  './js/sprites.js',
  './js/levels.js',
  './js/main.js',
  './js/platformer.js',
  './js/board.js',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/photos/p01.jpg',
  './assets/photos/p02.jpg',
  './assets/photos/p03.jpg',
  './assets/photos/p04.jpg',
  './assets/photos/p05.jpg',
  './assets/photos/p06.jpg',
  './assets/photos/p07.jpg',
  './assets/photos/p08.jpg',
  './assets/photos/p09.jpg',
  './assets/photos/p10.jpg',
  './assets/photos/p11.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// cache-first: se está no cache, entrega; senão busca e guarda
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
