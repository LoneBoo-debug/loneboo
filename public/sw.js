
const CACHE_NAME = 'loneboo-static-v9'; // NUCLEAR UPDATE v9
const IMAGE_CACHE_NAME = 'loneboo-images-v2';

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
          // Delete ALL old caches aggressively
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
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

  // 1. IMMAGINI (Cache First)
  if (
      event.request.destination === 'image' || 
      requestUrl.hostname.includes('postimg.cc') || 
      requestUrl.hostname.includes('googleusercontent.com') ||
      requestUrl.hostname.includes('freepik.com') ||
      requestUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 2. HTML/JS/CSS (Network First - STRICT)
  // Per evitare il problema della pagina bianca, cerchiamo SEMPRE prima in rete per i file core.
  if (event.request.mode === 'navigate' || requestUrl.pathname.endsWith('.js') || requestUrl.pathname.endsWith('.css') || requestUrl.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
            // Se la rete risponde bene, aggiorniamo la cache e restituiamo
            return caches.open(CACHE_NAME).then((cache) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            });
        })
        .catch(() => {
            // Solo se la rete fallisce (offline totale), usiamo la cache
            return caches.match(event.request);
        })
    );
    return;
  }

  // 3. DEFAULT (Cache First)
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then( windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
