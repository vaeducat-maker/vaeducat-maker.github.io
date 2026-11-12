#!/usr/bin/env node
'use strict';
// NOVEMBER_POSTER_PRESENTATION_BROWSER_AUDIT — owner-approved real-browser result acceptance.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const evidence = path.join(root, 'artifacts/edukass-quality');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 let file=path.resolve(root,pathname.replace(/^\/+/,''));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html')}catch{}
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404).end();return}
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});
  res.end(data);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 fs.mkdirSync(evidence,{recursive:true});
 try{
  for(const width of [390,844,1440]){
   const height=width===844?390:width===390?844:900;
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
   const page=await context.newPage();
   await page.route(/^https?:/,route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());

   await page.goto(origin+'/rahvakalender/november/',{waitUntil:'domcontentloaded'});
   const title=page.locator('h1');
   assert.equal((await title.innerText()).trim(),'Rahvakalender: november');
   assert.equal(await page.locator('.nov-topics, .nov-panel, .nov-hero').count(),0,'Redundant content blocks remain');
   assert.equal(await page.locator('#plakat img[src="./november-plakat.webp"]').count(),1,'Approved poster missing');
   assert.equal(await page.locator('a[download="EDUKASS-Rahvakalender-November.webp"]').count(),1,'Poster save link missing');
   assert.equal(await page.locator('a[href="./esitlus/"]').count()>0,true,'Full-screen presentation link missing');
   assert.equal(await page.locator('#esitlus iframe[src="./esitlus/"]').count(),1,'11-screen embedded presentation missing');
   assert.equal(await page.locator('.nov-crumb a[href="/materials/#eesti-keel"]').count(),1,'Wrong category');
   await page.locator('#plakat img').evaluate(img=>img.decode());
   const detail=await page.evaluate(()=>{
    const img=document.querySelector('#plakat img');
    const h=document.querySelector('h1').getBoundingClientRect();
    const p=img.getBoundingClientRect();
    return {naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,posterBelowTitle:p.top>=h.bottom,overflow:document.documentElement.scrollWidth-innerWidth};
   });
   assert.equal(detail.naturalWidth,1024,'Poster image failed to load');
   assert.equal(detail.naturalHeight,1536,'Poster image aspect/asset changed');
   assert(detail.posterBelowTitle,'Poster must follow heading');
   assert(detail.overflow<=2,'November page overflows mobile screen: '+JSON.stringify(detail));
   if(width===390)await page.screenshot({path:path.join(evidence,'november-landing-390.png')});

   await page.locator('#esitlus').scrollIntoViewIfNeeded();
   const frame=page.frameLocator('#esitlus iframe');
   await frame.locator('body').waitFor({state:'attached',timeout:15000});
   if(width===390)await page.screenshot({path:path.join(evidence,'november-presentation-390.png')});

   await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
   await page.locator('.home-new-grid > article').first().waitFor();
   assert.equal(await page.locator('.home-new-grid > article').first().getAttribute('data-edukass-rahvakalender-november'),'','November is not newest');
   assert.equal(await page.locator('.home-new-grid > article').count(),5,'UUS must show exactly five newest materials');
   assert.equal(await page.locator('.home-new-grid > article').first().locator('img[src="/rahvakalender/november/november-plakat.webp"]').count(),1,'Homepage poster preview missing');
   assert((await page.locator('.home-new-grid > article').first().innerText()).includes('Rahvakalender: november'),'Newest card title missing');
   if(width===390){await page.locator('.home-new-grid').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(evidence,'november-home-new-390.png')})}

   await page.goto(origin+'/materials/#eesti-keel',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#eesti-keel a[href="/rahvakalender/november/"]').count()>=1,true,'Missing in Eesti keel');
   assert.equal(await page.locator('#kaelised-oskused a[href="loika-kosmoserada/"]').count()>=1,true,'Legacy cutouts must remain in their category');
   await context.close();
  }
  console.log('PASS NOVEMBER_POSTER_PRESENTATION_BROWSER_AUDIT: poster, presentation, Eesti keel, UUS first, cutouts preserved, 390/844/1440 px');
 }finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(err=>{console.error(err);server.close();process.exitCode=1});
