
const CACHE_NAME = 'loneboo-static-v27'; 

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // BYPASS TOTALE PER LE API E AWS
  if (requestUrl.pathname.startsWith('/api/') || requestUrl.hostname.includes('amazonaws.com')) {
    return; // Lascia che il browser gestisca la richiesta normalmente
  }

  // Network First per i file di sistema
  if (event.request.mode === 'navigate' || requestUrl.pathname.match(/\.(js|css|json)$/)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache First per il resto degli asset locali
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
