#!/usr/bin/env node
'use strict';
// FACEBOOK_FOLLOW_BROWSER_AUDIT: independent Chromium acceptance of header CTA.
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const originalPages=['index.html','materials/index.html','teemad/loodus/index.html','teemad/ajalugu-ja-kultuur/index.html','privaatsus/index.html'];
const legacyPages=['materials/ristsonad-sugis/index.html','materials/tunniplaanid-10/index.html','materials/matemaatika/index.html'];
const {normalizeHtml}=require('./sync-cloudflare-headers');
const tempPages=[];
for(const file of legacyPages){
 const original=fs.readFileSync(path.join(root,file),'utf8');
 if(original.includes('class="facebook-follow"'))throw new Error('Legacy test page no longer legacy: '+file);
 const updated=normalizeHtml(original,file);
 if(!updated.hasHeader||!updated.inserted)throw new Error('Cloudflare header sync did not upgrade '+file);
 const temp=path.join(path.dirname(file),'.facebook-follow-qa-'+path.basename(file));
 fs.writeFileSync(path.join(root,temp),updated.html,'utf8');
 tempPages.push(temp);
}
const pages=[...originalPages,...tempPages];
const href='https://www.facebook.com/share/1GH4qbcNqL/';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const evidence=path.join(root,'artifacts/edukass-quality');
 fs.mkdirSync(evidence,{recursive:true});
 let count=0;
 try{
  for(const file of pages){
   for(const width of [320,375,768,1280]){
    const context=await browser.newContext({viewport:{width,height:800},deviceScaleFactor:1});
    const page=await context.newPage();
    await page.route(/^https?:/,route=>route.abort());
    await page.goto('file://'+path.join(root,file),{waitUntil:'domcontentloaded'});
    const result=await page.evaluate(()=>{
     const head=document.querySelector('.site-header');
     const btn=head?.querySelector('.facebook-follow');
     const nav=head?.querySelector('.nav');
     const brand=head?.querySelector('.brand');
     if(!head||!btn||!nav||!brand)return {missing:true};
     const r=x=>x.getBoundingClientRect();
     const bb=r(btn),hb=r(head),br=r(brand);
     const links=[...nav.querySelectorAll('a')];
     const vis=e=>{const a=r(e),s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&a.width>0&&a.height>0};
     return {
      buttonVisible:vis(btn),navVisible:vis(nav),linksVisible:links.every(vis),
      linkCount:links.length,href:btn.href,target:btn.target,
      label:btn.querySelector('.facebook-long')?.textContent,
      shortVisible:vis(btn.querySelector('.facebook-short')),
      longVisible:vis(btn.querySelector('.facebook-long')),
      bg:getComputedStyle(btn).backgroundColor,
      inBounds:bb.left>=-1&&bb.right<=innerWidth+1&&bb.top>=hb.top-1&&bb.bottom<=hb.bottom+1,
      noBrandOverlap:bb.left>=br.right-1||bb.top>=br.bottom-1,
      noNavOverlap:bb.left>=r(nav).right-1||bb.top>=r(nav).bottom-1||r(nav).top>=bb.bottom-1
     };
    });
    const label=file+' @ '+width+'px: ';
    assert(!result.missing,label+'header elements absent');
    assert(result.buttonVisible&&result.navVisible&&result.linksVisible,label+'button/nav links hidden');
    assert.equal(result.linkCount,3,label+'navigation link count');
    assert.equal(result.href,href,label+'incorrect Facebook URL');
    assert.equal(result.target,'_blank',label+'must open new tab');
    assert.equal(result.inBounds,true,label+'button outside sticky header/viewport');
    assert.equal(result.noBrandOverlap,true,label+'button overlaps logo');
    assert.equal(result.noNavOverlap,true,label+'button overlaps nav');
    assert.equal(result.shortVisible,width<=860,label+'short label breakpoint');
    assert.equal(result.longVisible,width>860,label+'desktop label breakpoint');
    assert.equal(result.bg,'rgb(24, 119, 242)',label+'incorrect button color');
    if(file==='index.html'&&width===375){
      await page.screenshot({path:path.join(evidence,'facebook-follow-phone.png')});
      await page.evaluate(()=>{
       document.querySelector('.facebook-follow').addEventListener('click',e=>e.preventDefault(),true);
       document.querySelector('.facebook-follow').click();
      });
      const events=await page.evaluate(()=>window.plausible?.q||[]);
      assert(events.some(event=>event[0]==='Facebook Follow Click'),label+'Plausible click event missing');
    }
    if(file==='index.html'&&width===1280)await page.screenshot({path:path.join(evidence,'facebook-follow-desktop.png')});
    await context.close();
    count++;
   }
  }
 }finally{
  await browser.close();
  for(const file of tempPages)fs.rmSync(path.join(root,file),{force:true});
 }
 console.log('PASS Facebook follow button in real Chromium: '+count+' layouts, click tracking, navigation and viewport checks');
})().catch(e=>{console.error(e);process.exitCode=1});
