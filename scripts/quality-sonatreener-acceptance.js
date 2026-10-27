#!/usr/bin/env node
'use strict';
// Independent, browser-executed acceptance audit for Sõnatreener.
// Source-of-truth pairs are explicitly approved in quality/, not imported from the lesson JS.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');

const ROOT=path.resolve(__dirname,'..');
const CONTRACT=JSON.parse(fs.readFileSync(path.join(ROOT,'quality/sonatreener-alice-acceptance.json'),'utf8'));
const REPORT=path.join(ROOT,'artifacts/edukass-quality/sonatreener');
fs.mkdirSync(REPORT,{recursive:true});
const checks=[];
function test(name,condition,details=''){
  checks.push({name,passed:!!condition,details:String(details)});
  console.log((condition?'PASS ':'FAIL ')+name+(details?' — '+details:''));
  if(!condition)throw new Error(name+(details?': '+details:''));
}
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
  '.webmanifest':'application/manifest+json','.svg':'image/svg+xml',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
  const route=new URL(req.url,'http://localhost').pathname;
  let file;
  try {file=path.resolve(ROOT,'.'+decodeURIComponent(route))}
  catch {res.writeHead(400).end('invalid path');return}
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    res.writeHead(404).end('Not found');return;
  }
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
let browser;
(async()=>{
  test('Acceptance page is Sõnatreener',CONTRACT.page==='games/kiire-sonatreener/index.html');
  test('Eight independently approved question/answer pairs',CONTRACT.independentExpectedPairs.length===8);
  await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
  const base='http://127.0.0.1:'+server.address().port+'/games/kiire-sonatreener/index.html';
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'?lesson=alice-questions&v=acceptance',{waitUntil:'load'});
  const topic=page.locator('#aliceqaLesson');
  await topic.waitFor({state:'visible',timeout:12000});
  test('Direct-link lesson opens',await page.locator('.aliceqa-lesson h2').innerText()==='Alice ja valge jänes');
  const rows=page.locator('.aliceqa-item');
  test('All 8 question panels are displayed',await rows.count()===8);
  for(let i=0;i<8;i++){
    const [etQ,ruQ,etA,ruA]=CONTRACT.independentExpectedPairs[i];
    const card=rows.nth(i);
    test('Question '+(i+1)+' exact Estonian', (await card.locator('.aliceqa-question').innerText()).trim()===(i+1)+'. '+etQ);
    test('Question '+(i+1)+' exact Russian', (await card.locator('.aliceqa-ru').first().innerText()).trim()===ruQ);
    test('Answer '+(i+1)+' exact Estonian',(await card.locator('.aliceqa-answer').innerText()).trim()===etA);
    test('Answer '+(i+1)+' exact Russian', (await card.locator('.aliceqa-ru').last().innerText()).trim()===ruA);
  }
  test('Answers are legible and not clipped', await page.evaluate(()=>{
    const a=[...document.querySelectorAll('.aliceqa-answer')];
    return a.length===8&&a.every(el=>{const r=el.getBoundingClientRect();return r.width>220&&r.height>30});
  }));
  test('No horizontal overflow on phone',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2));
  await page.screenshot({path:path.join(REPORT,'alice-lesson-phone.png'),fullPage:true});
  await page.locator('#aliceqaToggleRu').click();
  test('Russian translations hide',await page.locator('#aliceqaLesson').evaluate(el=>el.classList.contains('aliceqa-hide-ru')));
  test('Estonian answer remains visible',await page.locator('.aliceqa-answer').first().isVisible());
  await page.locator('#aliceqaToggleRu').click();
  test('Russian translations reappear',await page.locator('.aliceqa-ru').first().isVisible());
  await page.locator('#aliceqaBack').click();
  test('Back button returns to all subjects',await page.locator('.library-heading').isVisible());
  const literature=page.locator('.library-section').filter({hasText:'Eesti kirjandus'});
  test('Literature catalog has lesson 8',await literature.locator('[data-handler="litAliceQuestionsLesson"]').count()===1);
  test('Earlier Carroll lesson remains',await literature.locator('[data-handler="litCarrollLesson"]').count()===1);
  await literature.locator('[data-handler="litAliceQuestionsLesson"]').click();
  test('Catalog navigation opens lesson',await page.locator('#aliceqaLesson .aliceqa-item').count()===8);
  test('No uncaught runtime errors',pageErrors.length===0,pageErrors.join(' | '));
  fs.writeFileSync(path.join(REPORT,'acceptance.json'),JSON.stringify({passed:true,checks,page:CONTRACT.page},null,2)+'\n');
  console.log('PASS Independent Sõnatreener chapter-one acceptance: '+checks.length+' checks');
})().catch(err=>{
  console.error(err.stack||err.message);
  fs.writeFileSync(path.join(REPORT,'acceptance.json'),JSON.stringify({passed:false,checks,error:err.message,page:CONTRACT.page},null,2)+'\n');
  process.exitCode=1;
}).finally(async()=>{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
});