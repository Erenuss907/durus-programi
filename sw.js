// Service worker
// - Sayfa (index.html): önce ağ, 3 sn içinde cevap yoksa ya da çevrimdışıysa önbellek → güncellemeler hemen gelir.
// - Görseller, ikonlar vb.: önce önbellek (cache-first).
// İçerik değişince VERSION'ı artır.
const VERSION = 'durus-v3';

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
  // cache:'reload' → tarayıcının HTTP önbelleğini atla, sunucudan taze dosya al
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: 'reload'}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(req){
  const net = fetch(req, {cache: 'no-cache'}).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); }
    return res;
  });
  const timeout = new Promise(r => setTimeout(r, 3000));
  const fromCache = () => caches.match('./index.html');
  return Promise.race([net, timeout.then(fromCache)])
    .then(res => res || net)
    .catch(() => fromCache());
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(networkFirst(req)); return; }
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
