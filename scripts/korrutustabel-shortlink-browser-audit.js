#!/usr/bin/env node
'use strict';
// KORRUTUSTABEL_SHORTLINK_BROWSER_AUDIT: real Chromium acceptance for the public /k/ landing shortcut.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const contentType={
 '.html':'text/html; charset=utf-8',
 '.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8',
 '.png':'image/png',
 '.jpg':'image/jpeg',
 '.jpeg':'image/jpeg',
 '.webp':'image/webp',
 '.svg':'image/svg+xml',
 '.ico':'image/x-icon',
 '.woff2':'font/woff2'
};
const server=http.createServer((req,res)=>{
  let urlPath;
  try{urlPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
  const rel=urlPath.replace(/^\/+/, '');
  let full=path.resolve(root,rel);
  if(full!==root&&!full.startsWith(root+path.sep)){res.writeHead(403).end();return}
  try{if(fs.statSync(full).isDirectory())full=path.join(full,'index.html')}catch{}
  fs.readFile(full,(err,data)=>{
    if(err){res.writeHead(404).end();return}
    res.writeHead(200,{'content-type':contentType[path.extname(full)]||'application/octet-stream'});
    res.end(data);
  });
});

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const evidence=path.join(root,'artifacts/edukass-quality');
  fs.mkdirSync(evidence,{recursive:true});
  try{
    for(const width of [390,844,1440]){
      const height=width===844?390:width===390?844:900;
      const context=await browser.newContext({viewport:{width,height}});
      const page=await context.newPage();
      await page.route(/^https?:/,r=>{
        const u=new URL(r.request().url());
        return u.hostname==='127.0.0.1'?r.continue():r.abort();
      });
      await page.goto(origin+'/k/',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>location.pathname==='/'&&location.hash==='#feature-title',undefined,{timeout:10000});
      await page.waitForLoadState('load');
      const inspect=()=>page.evaluate(()=>{
        const title=document.getElementById('feature-title');
        const card=title?.closest('.home-feature-card');
        const gameLink=card?.querySelector('a.home-button[href="games/korrutamine-test/"]');
        const box=title?.getBoundingClientRect();
        const top=document.querySelector('.site-header')?.getBoundingClientRect().bottom??0;
        const button=gameLink?.getBoundingClientRect();
        return {
          name:title?.textContent?.trim(),hasButton:!!gameLink,
          scrollY:scrollY,headingTop:box?.top,headerBottom:top,
          buttonTop:button?.top,buttonBottom:button?.bottom,
          url:location.pathname+location.hash
        };
      });
      let result=await inspect();
      const label='at '+width+'x'+height+': ';
      assert.equal(result.name,'Korrutustabeli treener',label+'wrong game heading');
      assert.equal(result.hasButton,true,label+'Mängi kohe missing');
      assert.equal(result.url,'/#feature-title',label+'redirect/anchor lost');
      assert(result.scrollY>200,label+'not scrolled past Kirjalik arvutamine');
      assert(result.headingTop>=result.headerBottom-6&&result.headingTop<180,label+'heading not visible below header: '+JSON.stringify(result));
      assert(result.buttonTop>=0&&result.buttonBottom<=height+5,label+'play button outside viewport: '+JSON.stringify(result));
      await page.screenshot({path:path.join(evidence,'shortlink-'+width+'.png')});
      await page.reload({waitUntil:'load'});
      result=await inspect();
      assert(result.scrollY>200&&result.url===' /#feature-title'.trim(),label+'reload lost deep link: '+JSON.stringify(result));
      await page.goto(origin+'/',{waitUntil:'load'});
      const topOfHome=await page.evaluate(()=>({y:scrollY,hash:location.hash}));
      assert(topOfHome.y<100&&!topOfHome.hash,label+'normal homepage did not start at top: '+JSON.stringify(topOfHome));
      await context.close();
    }
    console.log('PASS KORRUTUSTABEL_SHORTLINK_BROWSER_AUDIT: /k/ redirect, visible correct card, refresh, normal homepage, three viewports');
  }finally{
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
