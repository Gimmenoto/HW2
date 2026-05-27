const CACHE_NAME = 'v2-news-cache';
const ASSETS_TO_CACHE = [
    'index.html',
    'style.css',
    'main.js',
    'https://picsum.photos/600/300'
];

// Install Event
self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('SW: Installing and Caching New Version');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Event
self.addEventListener('activate', event => {
    console.log('SW: Activated and Cleaning Old Caches');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW: Clearing Old Cache:', cache);
                        return caches.delete(cache); 
                    }
                })
            );
        })
    );
    return self.clients.claim(); 
});

// Fetch Event
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, resClone);
                });
                return response;
            })
            .catch(() => {
                console.log('SW: Network Fail, Serving from Cache');
                return caches.match(event.request);
            })
    );
});