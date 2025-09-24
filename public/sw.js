const CACHE_NAME = 'rr-autos-v1'
const STATIC_CACHE = 'rr-autos-static-v1'
const API_CACHE = 'rr-autos-api-v1'

// Archivos estáticos para cachear
const STATIC_ASSETS = ['/', '/catalogo', '/favicon.svg', '/manifest.json']

// URLs de API para cachear
const API_URLS = ['https://api-ecommerce.hostinger.com/store/store_01J9S3VMVD29XN5DP0E917FH67/collections']

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache de archivos estáticos
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_ASSETS)
      }),
      // Pre-cache de API crítica
      caches.open(API_CACHE).then(cache => {
        return cache.addAll(API_URLS)
      }),
    ])
  )

  // Forzar activación inmediata
  self.skipWaiting()
})

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches
        .keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
                return caches.delete(cacheName)
              }
            })
          )
        })
        .then(() => {
          // Tomar control de todas las pestañas
          return self.clients.claim()
        }),
      // Limpiar datos antiguos del localStorage
      self.registration.sync?.register('background-sync'),
    ])
  )
})

// Estrategia de cache para diferentes tipos de recursos
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requests que no son GET
  if (request.method !== 'GET') return

  // Estrategia para archivos estáticos
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Estrategia para APIs
  if (url.hostname === 'api-ecommerce.hostinger.com') {
    event.respondWith(networkFirst(request, API_CACHE))
    return
  }

  // Estrategia para imágenes - Stale While Revalidate
  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAME))
    return
  }

  // Estrategia para otros recursos
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request, STATIC_CACHE))
    return
  }
})

// Cache First - para recursos estáticos
async function cacheFirst(request, cacheName) {
  try {
    // Intentar obtener del cache primero
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Si no está en cache, buscar en red

    const networkResponse = await fetch(request)

    // Cachear la respuesta si es exitosa
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Fallback para páginas
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE)
      return cache.match('/catalogo') || new Response('Offline')
    }

    // Fallback para imágenes
    if (request.destination === 'image') {
      return new Response('<svg>...</svg>', {
        headers: { 'Content-Type': 'image/svg+xml' },
      })
    }

    throw error
  }
}

// Network First - para APIs y contenido dinámico
async function networkFirst(request, cacheName) {
  try {
    // Intentar red primero

    const networkResponse = await fetch(request)

    // Cachear respuesta exitosa
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Fallback al cache
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Si no hay cache, devolver error
    throw error
  }
}

// Manejar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Background sync para requests fallidos
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Stale While Revalidate - para imágenes
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)

  // Obtener la respuesta del cache primero (si existe)
  const cachedResponse = await cache.match(request)

  // Fetch del network en paralelo
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      // Actualizar el cache con la nueva respuesta
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => {
      // Si falla el network, usar cache o fallback
      return (
        cachedResponse ||
        new Response('<svg>...</svg>', {
          headers: { 'Content-Type': 'image/svg+xml' },
        })
      )
    })

  // Devolver cache inmediatamente si existe, sino esperar al network
  return cachedResponse || fetchPromise
}

async function doBackgroundSync() {
  // Aquí se pueden reintentar requests fallidos
}
