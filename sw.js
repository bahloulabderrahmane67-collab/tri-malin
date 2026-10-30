/* Tri Malin — service worker */
const CACHE = 'tri-malin-d4ac2a44e9';
const ASSETS = [
  "./",
  "index.html",
  "css/style.css",
  "js/game.js",
  "manifest.webmanifest",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
  "assets/items/arrosoir.webp",
  "assets/items/basket.webp",
  "assets/items/bougie.webp",
  "assets/items/brosse-bois.webp",
  "assets/items/brosse.webp",
  "assets/items/cactus-bleu.webp",
  "assets/items/cactus.webp",
  "assets/items/cadeau.webp",
  "assets/items/canard.webp",
  "assets/items/casque.webp",
  "assets/items/ciseaux.webp",
  "assets/items/citron.webp",
  "assets/items/citrouille.webp",
  "assets/items/croissant.webp",
  "assets/items/cupcake.webp",
  "assets/items/fraise.webp",
  "assets/items/grenouille.webp",
  "assets/items/jus.webp",
  "assets/items/livre.webp",
  "assets/items/macaron.webp",
  "assets/items/marguerite.webp",
  "assets/items/ourson.webp",
  "assets/items/pain.webp",
  "assets/items/parfum.webp",
  "assets/items/pasteque.webp",
  "assets/items/pomme.webp",
  "assets/items/reveil.webp",
  "assets/items/tasse.webp",
  "assets/items/theiere.webp",
  "assets/items/thermos.webp",
  "assets/items/vernis.webp",
  "assets/items/voiture.webp",
  "assets/containers/bac-blanc.webp",
  "assets/containers/bac-chene.webp",
  "assets/containers/bac-menthe.webp",
  "assets/containers/bac-noyer.webp",
  "assets/ui/boost-aimant.webp",
  "assets/ui/boost-baguette.webp",
  "assets/ui/boost-bombe.webp",
  "assets/ui/boost-etoile.webp",
  "assets/ui/boost-plus.webp",
  "assets/ui/boost-sablier.webp",
  "assets/ui/btn-aide.webp",
  "assets/ui/btn-bleu.webp",
  "assets/ui/btn-close.webp",
  "assets/ui/btn-coeur.webp",
  "assets/ui/btn-orange.webp",
  "assets/ui/btn-pause.webp",
  "assets/ui/btn-play.webp",
  "assets/ui/btn-reglages.webp",
  "assets/ui/btn-son.webp",
  "assets/ui/chat-joie.webp",
  "assets/ui/chat-salut.webp",
  "assets/ui/chat-surpris.webp",
  "assets/ui/chat-triste.webp",
  "assets/ui/coeur.webp",
  "assets/ui/etoile.webp",
  "assets/ui/gemme.webp",
  "assets/ui/panneau.webp",
  "assets/ui/piece.webp",
  "assets/fx/fx-anneau.webp",
  "assets/fx/fx-confettis.webp",
  "assets/fx/fx-etincelle.webp",
  "assets/fx/fx-flare.webp",
  "assets/fx/fx-halo.webp",
  "assets/fx/fx-poussiere.webp",
  "assets/backgrounds/fond.webp"
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(u => c.add(u)))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;

  if(req.mode === 'navigate'){
    e.respondWith(fetch(req).catch(() => caches.match('index.html').then(r => r || caches.match('./'))));
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if(res && res.status === 200 && res.type === 'basic'){
        const copie = res.clone();
        caches.open(CACHE).then(c => c.put(req, copie));
      }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
