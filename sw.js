// Cache-first service worker. İçerik değişince VERSION'ı artır.
const VERSION = 'durus-v2';

const JPG = ['treadmill-warmup','leg-press','chest-press','seated-cable-row','lat-pulldown','face-pull',
  'plank','goblet-squat','incline-db-press','one-arm-db-row','reverse-fly','leg-curl','dead-bug',
  'db-rdl','close-grip-pulldown','shoulder-press','leg-extension','curl-pushdown','side-plank'];
const SVG = ['chin-tuck','wall-angel','incline-walk','doorway-stretch'];

const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png',
  ...JPG.flatMap(id => [`./images/${id}.jpg`, `./images/${id}-2.jpg`]),
  ...SVG.flatMap(id => [`./images/${id}.svg`, `./images/${id}-2.svg`])
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
  );
});
