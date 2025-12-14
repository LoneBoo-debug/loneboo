
const CACHE_NAME = 'loneboo-static-v3';
const IMAGE_CACHE_NAME = 'loneboo-images-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installazione: Cache dei file statici principali
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Attivazione: Pulizia vecchie cache
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

// Intercettazione richieste di rete
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // STRATEGIA 1: Cache First per le Immagini
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
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // STRATEGIA 2: Cache First con Network Fallback per il resto dell'app
  // Gestisce anche i chunk JS del lazy loading
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// GESTIONE CLICK NOTIFICA DI SISTEMA
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then( windowClients => {
      // Se c'è una finestra aperta, portala in primo piano
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Altrimenti apri l'app
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
