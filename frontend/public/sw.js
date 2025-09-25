const CACHE_NAME = 'xox-game-v1'
const STATIC_CACHE = 'xox-static-v1'

// Files to cache immediately
const CRITICAL_CACHE_URLS = [
  '/',
  '/game',
  '/manifest.json'
]

// Resources to cache on demand
const RUNTIME_CACHE_URLS = [
  '/_next/static/',
  '/static/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(CRITICAL_CACHE_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE
            })
            .map((cacheName) => {
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and moz-extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return
  }

  // Handle API requests differently (no caching for real-time data)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('socket.io')) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }

        // For runtime caching
        const shouldCache = RUNTIME_CACHE_URLS.some(pattern => 
          request.url.includes(pattern)
        )

        if (shouldCache) {
          return fetch(request)
            .then((response) => {
              // Don't cache opaque responses
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response
              }

              const responseToCache = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache)
                })

              return response
            })
            .catch(() => {
              // Return offline fallback if available
              if (request.destination === 'document') {
                return caches.match('/')
              }
            })
        }

        return fetch(request)
      })
  )
})

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any queued operations when back online
      console.log('Background sync triggered')
    )
  }
})

// Push notifications (for future game notifications)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        const url = event.notification.data.url
        
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})