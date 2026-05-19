/**
 * Service Worker para Controle de Câmara 3D
 * Posicione este arquivo na raiz do seu repositório (junto ao index.html)
 */

const CACHE_NAME = 'camara-3d-v1';

// Lista de arquivos que devem ficar disponíveis offline
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Instalação: baixa e armazena os arquivos no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Cache aberto');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Ativação: remove caches antigos que não correspondem ao nome atual
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removendo cache antigo:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// Fetch: intercepta requisições
self.addEventListener('fetch', event => {
    // IMPORTANTE: NÃO interceptar requisições para o IP do seu ESP32
    // Caso contrário, o PWA tentará buscar os dados no cache ou no GitHub em vez do seu hardware
    if (event.request.url.includes('192.168.1.119')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            // Retorna do cache se existir, senão busca na rede
            return response || fetch(event.request);
        })
    );
});