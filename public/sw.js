const CACHE_NAME = 'loneboo-static-v20'; 
const IMAGE_CACHE_NAME = 'loneboo-images-v9';

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

  // Per i file di sistema (JS, HTML, CSS), usiamo Network First per evitare blocchi
  if (event.request.mode === 'navigate' || requestUrl.pathname.match(/\.(js|css|json)$/)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Per le immagini, usiamo Stale-While-Revalidate
  if (
      event.request.destination === 'image' || 
      requestUrl.hostname.includes('loneboo-images.s3.eu-south-1.amazonaws.com') ||
      requestUrl.hostname.includes('postimg.cc') || 
      requestUrl.hostname.includes('googleusercontent.com')
  ) {
    console.log('[SW] Fetching image:', event.request.url);
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', event.request.url);
          }
          // Usiamo la richiesta originale senza forzare CORS che rompe S3
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // Cache se successo (200) o se opaco (0 - cross-origin senza CORS)
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
              console.log('[SW] Caching image:', event.request.url, 'Status:', networkResponse.status);
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch((err) => {
            console.error('[SW] Fetch failed for:', event.request.url, err);
            return cachedResponse;
          });

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});