
const CACHE_NAME = 'loneboo-static-v28'; 
const IMAGE_CACHE_NAME = 'loneboo-images-v7';

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
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
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

  // Bypass solo per le API interne, NON per gli asset remoti
  if (requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  // Strategia Network-First per file di sistema (JS, CSS, HTML)
  if (event.request.mode === 'navigate' || requestUrl.pathname.match(/\.(js|css|json)$/)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Strategia Stale-While-Revalidate per IMMAGINI (Incluso AWS S3 e Postimg)
  // Questo risolve i blocchi della TWA sulle immagini remote
  if (
    event.request.destination === 'image' || 
    requestUrl.hostname.includes('amazonaws.com') || 
    requestUrl.hostname.includes('postimg.cc') ||
    requestUrl.hostname.includes('googleusercontent.com')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request, { 
            mode: 'cors', 
            credentials: 'omit' 
          }).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Default: Cache First
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
