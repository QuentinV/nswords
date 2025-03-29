// eslint-disable-next-line no-restricted-globals
const ignored = self.__WB_MANIFEST;

const CACHE_NAME = 'nswords';

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME) {
                    console.log(`Deleting old cache: ${cacheName}`);
                    return caches.delete(cacheName);
                }
            })
        ))
    )
})

self.addEventListener('fetch', (event) => { 
    console.log('Fetching:', event.request.url);
    if (event.request.url.startsWith('chrome-extension://')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }
  
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => 
            fetch(event.request)
                .then((response) => {
                    console.log('caching', event.request)
                    cache.put(event.request, response.clone());
                    return response;
                })
                .catch(() => caches.match(event.request))
        )
    )
});