const CACHE='edukass-korrutustabel-v38';
const ASSETS=['./','./index.html','./game.css?v=38','./game.js?v=38','./manifest.webmanifest','./locales/et.js','./chapter-one.config.js','./i18n.js','./question-engine.js','./progress-store.js','./assets/icon-192.png?v=38','./assets/icon-512.png?v=38','./assets/share-korrutustabel.png?v=38','./assets/edukass-cat.png','./assets/edukass-cat-transparent.png','./assets/edukass-cat-reward-surprise.png','./assets/edukass-cat-reward-joy.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))));
});
