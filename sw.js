
const CACHE_NAME = 'loneboo-static-v23'; // Incremento v23 per reset totale

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

  // STRATEGIA PASS-THROUGH ESPLICITA PER AWS S3
  // Questo istruisce il Service Worker a non toccare minimamente le richieste verso S3
  if (requestUrl.hostname.includes('amazonaws.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network First per i file di sistema
  if (event.request.mode === 'navigate' || requestUrl.pathname.match(/\.(js|css|json)$/)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Fallback normale per tutto il resto
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
