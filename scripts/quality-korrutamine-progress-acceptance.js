#!/usr/bin/env node
'use strict';
// Independent output acceptance for EDUKASS's existing multiplication game.
// Tests an actual exported user save in two isolated Chromium browser profiles.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const C=JSON.parse(fs.readFileSync(path.join(ROOT,'quality/korrutamine-progress-acceptance.json'),'utf8'));
const REPORT=path.join(ROOT,'artifacts/edukass-quality/korrutamine');
fs.mkdirSync(REPORT,{recursive:true});
const checks=[];
function verify(name,ok,details=''){
  checks.push({name,passed:!!ok,details:String(details)});
  console.log((ok?'PASS ':'FAIL ')+name+(details?' — '+details:''));
  assert.ok(ok,name+(details?': '+details:''));
}
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png',
 '.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 const filename=path.resolve(ROOT,'.'+pathname);
 if(!filename.startsWith(ROOT+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){
  res.writeHead(404).end('not found');return;
 }
 res.setHeader('Content-Type',types[path.extname(filename)]||'application/octet-stream');
 fs.createReadStream(filename).pipe(res);
});
const completed=Array.from({length:C.expectedTransferredProgressCount},(_,i)=>i+1);
const fixture={
 saveVersion:2,unlockedLevel:43,completedLevels:completed,
 multiplicationLessonSeen:true,divisionLessonSeen:true,
 lessonSeen:{'multiply-2':true,'divide-2':true,'multiply-3':true},
 factStats:{'test-multiply-6-times-7':{correct:17,mistakes:3}},
 lastSuccessfulMissionId:42
};
const previous={...fixture,unlockedLevel:3,completedLevels:[1,2],
 factStats:{'test-multiply-6-times-7':{correct:1,mistakes:0}},lastSuccessfulMissionId:2};
let browser;
(async()=>{
 verify('Correct audited game',C.page==='games/korrutamine-test/index.html');
 const config=require(path.join(ROOT,'games/korrutamine-test/chapter-one.config.js'));
 verify('Original 252 missions unchanged',config.missions.length===C.expectedMissionCount);
 verify('Original 16 chapters unchanged',config.chapters.length===C.expectedChapterCount);
 verify('Original 15-question lesson unchanged',config.roundLength===C.expectedRoundLength);
 verify('Storage schema and key unchanged',
   config.storage.progressKey===C.storageKey&&config.storage.progressSchemaVersion===C.schemaVersion);
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 const base='http://127.0.0.1:'+server.address().port+'/'+C.page;
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const sourceContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const destContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const from=await sourceContext.newPage(),to=await destContext.newPage();
 const errors=[];
 from.on('pageerror',err=>errors.push('origin: '+err.message));
 to.on('pageerror',err=>errors.push('destination: '+err.message));
 await from.goto(base,{waitUntil:'load'});
 await from.evaluate(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[C.storageKey,fixture]);
 await from.reload({waitUntil:'load'});
 verify('Install button absent',await from.locator(C.installButtonMustBeAbsent).count()===0);
 verify('Web app manifest absent',await from.locator('link[rel="manifest"]').count()===0);
 await from.locator('#introPlayButton').click({timeout:13000});
 await from.locator(C.exportButton).click({timeout:13000});
 verify('Progress transfer dialog opened',await from.locator('#passportDialog').evaluate(e=>e.open));
 verify('Transfer title is Estonian',(await from.locator('#passportTitle').innerText()).trim()===C.expectedExportLabel);
 await from.locator('#passportCreate').click();
 await from.waitForFunction(()=>document.getElementById('passportLink').value.includes('#ekpass='),{timeout:13000});
 const url=await from.locator('#passportLink').inputValue();
 verify('Private link points at original game',url.startsWith(base+'#ekpass='));
 verify('Progress data is in hash rather than query',new URL(url).search===''&&new URL(url).hash.length>100);
 await from.screenshot({path:path.join(REPORT,'origin-mobile.png'),fullPage:false});

 // Device 2 starts with different data, to prove that merely receiving
 // a link never overwrites the student's existing progress.
 await to.goto(base,{waitUntil:'load'});
 await to.evaluate(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[C.storageKey,previous]);
 await to.goto('about:blank');
 await to.goto(url,{waitUntil:'load'});
 await to.locator('#passportDialog[open]').waitFor({timeout:13000});
 await to.waitForFunction(()=>!document.getElementById('passportRestore').hidden,{timeout:13000});
 const prior=await to.evaluate(key=>JSON.parse(localStorage.getItem(key)),C.storageKey);
 verify('Incoming link does NOT overwrite automatically',prior.completedLevels.length===C.expectedExistingProgressCount);
 verify('Incoming save presents correct mission count',
   (await to.locator('#passportImportSummary').innerText()).includes('42 / 252'));
 verify('Incoming link hash cleared immediately',!(await to.evaluate(()=>location.hash)).includes('ekpass='));
 verify('Explicit warning is visible',await to.locator('#passportRestoreActions .passport-alert').isVisible());
 await to.screenshot({path:path.join(REPORT,'restore-prompt-mobile.png'),fullPage:false});
 await to.locator('#passportDecline').click();
 const afterDecline=await to.evaluate(key=>JSON.parse(localStorage.getItem(key)),C.storageKey);
 verify('Decline preserves previous progress',afterDecline.completedLevels.length===2);
 await to.goto('about:blank');await to.goto(url,{waitUntil:'load'});
 await to.waitForFunction(()=>!document.getElementById('passportRestore').hidden,{timeout:13000});
 await to.locator(C.importConfirmation).click();
 await to.waitForFunction(key=>{
  const state=window.__EDUKASS_TEST__?.getState()?.progress;
  return state?.completedLevels?.length===42 && state?.factStats?.['test-multiply-6-times-7']?.mistakes===3;
 },C.storageKey,{timeout:16000});
 const after=await to.evaluate(key=>JSON.parse(localStorage.getItem(key)),C.storageKey);
 verify('Confirmed import writes every mission',after.completedLevels.length===C.expectedTransferredProgressCount);
 verify('Confirmed import preserves exercise statistics',
   after.factStats['test-multiply-6-times-7'].correct===17&&after.factStats['test-multiply-6-times-7'].mistakes===3);
 verify('Confirmed import preserves lesson flags',
   after.lessonSeen['divide-2']===true&&after.unlockedLevel===43);
 await to.reload({waitUntil:'load'});
 verify('Progress persists after another reload',await to.evaluate(key=>
   JSON.parse(localStorage.getItem(key)).completedLevels.length===42,C.storageKey));
 verify('No mobile horizontal overflow',await to.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2));
 verify('No page JavaScript errors',errors.length===0,errors.join(' / '));
 console.log('Independent accepted browser checks: '+checks.length);
})().catch(err=>{console.error(err);process.exitCode=1}).finally(async()=>{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(REPORT,'report.json'),JSON.stringify({
  product:C.product,checks,passed:checks.length>0&&checks.every(x=>x.passed)
 },null,2)+'\n');
});
