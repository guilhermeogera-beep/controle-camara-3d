const CACHE_NAME = 'Caixa-de-filamentos';

const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Instalação: guarda os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Intercepta requisições: serve do cache se disponível
self.addEventListener('fetch', event => {
    // CORREÇÃO AQUI: Não intercepta requisições para o endereço mDNS .local ou IPs locais
    if (event.request.url.includes('caixadefilamentos.local') || event.request.url.includes('http://caixadefilamentos.local/')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});