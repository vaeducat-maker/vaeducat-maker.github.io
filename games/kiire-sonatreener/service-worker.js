const CACHE='edukass-sonatreener-v4';
const ASSETS=[
  './','./index.html',
  './trainer.css?v=20260909-1','./lesson-library.css?v=20260909-2',
  './trainer.js?v=20260909-2','./poster-fix.js?v=20260909-7',
  './poster-pretty/0.txt?v=20260909-2','./poster-pretty/1.txt?v=20260909-2','./poster-pretty/2.txt?v=20260909-2',
  './poster-pretty/3.txt?v=20260909-2','./poster-pretty/4.txt?v=20260909-2','./poster-pretty/5.txt?v=20260909-2',
  './icon-192.png','./icon-512.png','./icon.svg'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))));
});