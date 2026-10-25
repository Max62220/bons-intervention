// Cache hors ligne : l'application fonctionne sans réseau après une première ouverture.
const CACHE = 'bi-v23';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './logo.png', './icon-192.png', './icon-512.png',
  './lib/jspdf.umd.min.js', './lib/jspdf.plugin.autotable.min.js',
  './fonts/ibm-plex-sans-latin-400-normal.woff2', './fonts/ibm-plex-sans-latin-500-normal.woff2',
  './fonts/ibm-plex-sans-latin-600-normal.woff2', './fonts/ibm-plex-sans-latin-700-normal.woff2',
  './fonts/ibm-plex-mono-latin-500-normal.woff2', './fonts/ibm-plex-mono-latin-600-normal.woff2'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // config.json : toujours le réseau (l'appli garde sa propre copie pour le hors ligne)
  const pth = new URL(e.request.url).pathname;
  if (pth.endsWith('/config.json') || pth.includes('/sauvegarde/')) return;
  const isPage = e.request.mode === 'navigate';
  e.respondWith(
    isPage
      // page : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne
      ? fetch(e.request).then(r => {
          // ne mettre en cache que la page de l'appli, et seulement si elle a bien été servie
          const path = new URL(e.request.url).pathname;
          if (r.ok && (path.endsWith('/') || path.endsWith('/index.html'))) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); }
          return r;
        }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
      // le reste : cache d'abord
      : caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
          if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
          return r;
        }))
  );
});
