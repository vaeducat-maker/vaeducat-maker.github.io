#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'artifacts','korrutamine-promo-captures');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  let f=path.resolve(root,'.'+decodeURIComponent(pathname));
  if(f===root||pathname.endsWith('/'))f=path.join(f,'index.html');
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-cache'});
  fs.createReadStream(f).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/games/korrutamine-test/';
 const browser=await chromium.launch({headless:true});
 let manifest={source:'Original EDUKASS Korrutustabeli treener at games/korrutamine-test/ — browser screenshots of unmodified game',frames:[]};
 try{
   for(const [format,width,height,scale] of [['desktop',1440,900,1],['mobile',390,844,2]]){
     const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:scale,isMobile:format==='mobile',hasTouch:format==='mobile',serviceWorkers:'block',reducedMotion:'reduce'});
     const page=await context.newPage();
     page.on('pageerror',e=>console.error('Page error',e.message));
     await page.route('https://plausible.io/**',r=>r.abort());
     await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});
     await page.waitForFunction(()=>Boolean(window.__EDUKASS_TEST__),{timeout:30000});
     await page.waitForTimeout(700);
     const screenshot=async(name,meta={})=>{
       const file=format+'-'+name+'.png';
       await page.screenshot({path:path.join(out,file),animations:'disabled',timeout:20000});
       const state=await page.evaluate(()=>({screen:[...document.querySelectorAll('.screen.is-active')].map(x=>x.id).join(','),expression:[document.querySelector('#factorA')?.textContent,document.querySelector('#operationSymbol')?.textContent,document.querySelector('#factorB')?.textContent,document.querySelector('#answerDisplay')?.textContent].join(' '),mission:window.__EDUKASS_TEST__?.getState()?.currentLevel}));
       manifest.frames.push({file,format,...state,...meta});console.log('CAPTURE',JSON.stringify({file,...state}));
     };
     // Real start screen with animated cat and rocket.
     await screenshot('00-intro');
     await page.evaluate(()=>window.__EDUKASS_TEST__.skipIntro());
     await page.waitForTimeout(550);
     await page.evaluate(()=>window.__EDUKASS_TEST__.showMap({historyMode:'replace'}));
     await page.waitForTimeout(650);
     await screenshot('01-map');
     const modes=await page.evaluate(()=>{
       const levels=window.__EDUKASS_TEST__.LEVELS;
       return {first:1,mulChoice:levels.find(x=>x.mode==='choice'&&x.operation==='multiply'&&x.id>14)?.id||1,mulInput:levels.find(x=>x.mode==='input'&&x.operation==='multiply'&&x.id>=16)?.id,divChoice:levels.find(x=>x.mode==='choice'&&x.operation==='divide')?.id,divInput:levels.find(x=>x.mode==='input'&&x.operation==='divide')?.id};
     });
     console.log('CHOICES',JSON.stringify({format,...modes}));
     const captureMission=async(id,label)=>{
       if(!id)return;
       await page.evaluate(id=>window.__EDUKASS_TEST__.startLevel(id),id);
       await page.waitForTimeout(450);
       await screenshot(label+'-before',{id});
       await page.evaluate(()=>window.__EDUKASS_TEST__.answerCorrect());
       await page.waitForTimeout(160);
       await screenshot(label+'-answered',{id});
       await page.waitForTimeout(1300);
       await screenshot(label+'-next',{id});
     };
     await captureMission(modes.first,'02-mul-first');
     await captureMission(modes.mulInput,'03-mul-input');
     await captureMission(modes.divInput||modes.divChoice,'04-division');
     await page.evaluate(()=>window.__EDUKASS_TEST__.showMap({historyMode:'replace'}));
     await page.waitForTimeout(500);
     await screenshot('05-map-again');
     await context.close();
   }
 } finally{
   await browser.close();
   server.close();
   fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
 }
})();
