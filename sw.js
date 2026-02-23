const CACHE_NAME = 'hrfa-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/variables.css',
    '/css/main.css',
    '/js/main.js',
    '/js/i18n.js',
    '/js/components.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
