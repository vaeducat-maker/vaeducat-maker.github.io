'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const contract=require('../quality/umardamine-acceptance.json');
const entry='games/umardamine/index.html';
for(const [p,sha] of Object.entries(contract.approvedBlobs)){const b=fs.readFileSync(p);assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha);}
const root=path.resolve(__dirname,'..'),out=path.join(root,'artifacts/edukass-quality');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+path.sep))return res.writeHead(403).end();try{if(fs.statSync(p).isDirectory())p=path.join(p,'index.html');const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4'};res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream'}).end(fs.readFileSync(p));}catch(e){res.writeHead(404).end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;let browser;try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});for(const [width,height] of [[390,844],[840,620],[1280,720],[1440,900]]){const page=await browser.newPage({viewport:{width,height}});await page.route('https://plausible.io/js/**',route=>route.fulfill({contentType:'application/javascript',body:'/* Stub collector: no QA data sent to Plausible. */'}));await page.goto(origin+'/',{waitUntil:'domcontentloaded'});const hero=page.locator('main > .top-rounding-promo');assert.equal(await hero.count(),1);const promo=hero.locator('video');assert.equal(await promo.count(),1);const media=await promo.evaluate(v=>({muted:v.muted,defaultMuted:v.defaultMuted,autoplay:v.autoplay,controls:v.controls,loop:v.loop,playsInline:v.playsInline,source:v.querySelector('source')?.getAttribute('src'),width:v.getBoundingClientRect().width,viewport:innerWidth}));assert(media.muted&&media.defaultMuted&&media.autoplay&&media.controls&&media.loop&&media.playsInline);assert.equal(media.source,'/EDUKASS_umardamine_post_v2.mp4');assert(media.width>0&&media.width<=media.viewport);assert.equal(await hero.locator('a.home-button[href="/games/umardamine/"]').count(),1);const response=await page.request.get(origin+media.source);assert.equal(response.status(),200);const videoBytes=await response.body();assert.equal(crypto.createHash('sha1').update('blob '+videoBytes.length+'\0').update(videoBytes).digest('hex'),'d15115668eb2b1cbf1d90f48d704436baf455742');await page.goto(origin+'/#mangud',{waitUntil:'domcontentloaded'});const link=page.locator('#mangud a[href="games/umardamine/"]');assert.equal(await link.count(),1);const layout=await link.evaluate(el=>{const card=el.closest('article'),prior=card.previousElementSibling;return {gap:card.getBoundingClientRect().top-prior.getBoundingClientRect().bottom,background:getComputedStyle(card).backgroundColor,priorBackground:getComputedStyle(prior).backgroundColor};});assert(layout.gap>=23,'Game cards touch: '+JSON.stringify(layout));assert.notEqual(layout.background,layout.priorBackground,'Game cards need different backgrounds');await link.click();await page.waitForURL('**/games/umardamine/');const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.evaluate(()=>localStorage.setItem('edukass-umardamine-last-start-day-v1','2000-01-01'));await page.locator('#begin').click();await page.locator('#keypad').waitFor({state:'visible'});const bottom=await page.locator('.key-zero').boundingBox();assert(bottom&&bottom.y+bottom.height<=height+3);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));await page.screenshot({path:path.join(out,'umardamine-'+width+'.png')});assert.equal(await page.evaluate(()=>window.__EDUKASS_TEST__.get().tasks.length),8);if(width===390){
 const results=await page.evaluate(()=>{
  const game=window.__EDUKASS_TEST__;
  const events=()=>Array.from(window.plausible.q||[],args=>Array.from(args));
  const first=events();
  const play=()=>{
   for(let n=0;n<5000;n++){
    const s=game.get();
    if(s.status!=='running')return s.status;
    if(!s.solved&&!s.typed)for(const digit of String(s.tasks[s.step].answer))game.press(digit);
    game.tick(100);
   }
   return 'simulation-timeout';
  };
  const firstWorld=play();
  game.reset();game.start();game.tick(20000);
  const failed=game.get().status;
  window.EDUKASS_GAME_PROGRESS.restore({completed:[1,2,3,4,5,6,7,8],lastWorld:9});
  const beforeFinal=events();
  game.start();
  const finalWorld=play();
  return {first,firstWorld,failed,beforeFinal,finalWorld,events:events()};
 });
 const names=items=>items.map(x=>x[0]);
 assert.equal(results.firstWorld,'finished');assert.equal(results.finalWorld,'finished');
 assert(['crashing','crashed'].includes(results.failed));
 assert(names(results.first).includes('pageview'));
 assert(names(results.first).includes('Umardamine Start'));
 assert.equal(names(results.events).filter(x=>x==='Umardamine Return').length,1);
 assert(names(results.events).includes('Umardamine World 1 Complete'));
 assert(names(results.events).includes('Umardamine World Failed'));
 assert(!names(results.beforeFinal).includes('Umardamine Game Complete'));
 assert(names(results.events).includes('Umardamine World 9 Complete'));
 assert.equal(names(results.events).filter(x=>x==='Umardamine Game Complete').length,1);
 for(const [name,options] of results.events){assert.equal(options.url,origin+'/games/umardamine/');if(options.props)assert(Object.keys(options.props).every(k=>['world','retry','reason','step'].includes(k)));}
 console.log('UMARDAMINE_ANALYTICS PASS: pageview, start, return, failure, world completion, final completion, private URLs');
 }assert.deepEqual(errors,[]);await page.close();}
console.log('UMARDAMINE_PUBLIC_NAVIGATION PASS: approved bytes, homepage and 4 viewport checks');}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
