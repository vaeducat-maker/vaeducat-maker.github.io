const CACHE='edukass-korrutustabel-v53';
const ASSETS=['./','./index.html','./game.css?v=53','./game.js?v=53','./manifest.webmanifest','./locales/et.js?v=53','./chapter-one.config.js?v=53','./i18n.js?v=53','./question-engine.js?v=53','./progress-store.js?v=53','./assets/icon-192.png?v=53','./assets/icon-512.png?v=53','./assets/share-korrutustabel.png?v=53','./assets/edukass-cat.png','./assets/edukass-cat-transparent.png','./assets/edukass-cat-reward-surprise.png','./assets/edukass-cat-reward-joy.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))));
});
