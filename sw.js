const CACHE = 'sensemate-v1';
const STATIC = [
    '/',
    '/styles.css',
    '/app.js',
    '/auth.js',
    '/themes.js',
    '/manifest.json',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    // Solo cachear GET de assets estáticos — las llamadas a la API siempre van a la red
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/translate') ||
        url.pathname.startsWith('/chat') || url.pathname.startsWith('/auth') ||
        url.pathname.startsWith('/mp') || url.pathname.startsWith('/writers') ||
        url.pathname.startsWith('/membership') || url.pathname.startsWith('/admin')) {
        return; // dejar pasar a la red
    }
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
