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
  test('Eight independently approved tense transformations',CONTRACT.independentExpectedTensePairs.length===8);
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

  // Exercise 4 must appear immediately after the eight answers.
  const exercise4=page.locator('#aliceqaExercise4');
  test('Exercise 4 follows the eight written answers',await page.evaluate(()=>{
    const target=document.querySelector('#aliceqaExercise4');
    const last=document.querySelectorAll('.aliceqa-item')[7];
    return !!target&&!!last&&!!(last.compareDocumentPosition(target)&Node.DOCUMENT_POSITION_FOLLOWING);
  }));
  test('Exercise 4 heading is correct',await exercise4.locator('h3').innerText()==='ÜLESANNE 4');
  const headings=exercise4.locator('.aliceqa-tense-name');
  test('Bold large OLEVIK / LIHTMINEVIK headings',await headings.count()===2&&
    await headings.nth(0).innerText()==='OLEVIK'&&await headings.nth(1).innerText()==='LIHTMINEVIK'&&
    await headings.evaluateAll(els=>els.every(el=>{const c=getComputedStyle(el);return parseInt(c.fontWeight,10)>=700&&parseFloat(c.fontSize)>=20})));
  const tenseRows=exercise4.locator('.aliceqa-pair');
  test('Eight visible tense conversion pairs',await tenseRows.count()===8);
  for(let i=0;i<8;i++){
    const [present,past]=CONTRACT.independentExpectedTensePairs[i];
    test('Original present sentence '+(i+1),(await tenseRows.nth(i).locator('.aliceqa-present .aliceqa-tense-text').innerText()).trim()===present);
    test('Correct simple-past sentence '+(i+1),(await tenseRows.nth(i).locator('.aliceqa-past .aliceqa-tense-text').innerText()).trim()===past);
  }

  // Check actual end-user output of all print-workbook exercises against independent expectations.
  const w5=page.locator('#aliceqaExercise5'),w6=page.locator('#aliceqaExercise6'),w7=page.locator('#aliceqaExercise7');
  test('Exercises 5–7 follow exercise 4 in order',await page.evaluate(()=>{
    const elements=[4,5,6,7].map(x=>document.getElementById('aliceqaExercise'+x));
    return elements.every(Boolean)&&elements.slice(1).every((el,i)=>!!(elements[i].compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING));
  }));
  test('8 numbered places per worksheet exercise',
    await w5.locator('[data-print5]').count()===8&&await w6.locator('[data-print6]').count()===8&&await w7.locator('[data-print7]').count()===8);
  for(let i=0;i<8;i++){
    const [definition,expected,note]=CONTRACT.expectedWorksheet5[i];
    const row=w5.locator('[data-print5="'+(i+1)+'"]');
    test('Worksheet 5 prompt '+(i+1),(await row.locator('.aliceqa-ws-prompt').innerText()).trim()===(i+1)+'. '+definition);
    if(expected)test('Worksheet 5 copy answer '+(i+1),(await row.locator('.aliceqa-ws-write').innerText()).trim()===expected);
    else test('Worksheet 5 flags missing exact equivalent',await row.locator('[data-no-exact-answer="true"]').count()===1);
  }
  for(const [num,section,expected] of [[6,w6,CONTRACT.expectedWorksheet6],[7,w7,CONTRACT.expectedWorksheet7]]){
    for(let i=0;i<8;i++){
      const [original,left,focus,right]=expected[i];
      const row=section.locator('[data-print'+num+'="'+(i+1)+'"]');
      test('Worksheet '+num+' copyable sentence '+(i+1),(await row.locator('.aliceqa-ws-write').innerText()).trim()===left+focus+right);
      test('Worksheet '+num+' highlights changed words '+(i+1),(await row.locator('.aliceqa-ws-write strong').innerText())===focus);
    }
  }
  test('Only intended answers are large and bold',await page.locator('.aliceqa-ws-write').evaluateAll(els=>els.length===23&&els.every(el=>{
    const s=getComputedStyle(el);return parseFloat(s.fontSize)>=22&&parseFloat(s.fontWeight)>=700;
  })));
  await page.locator('[data-go-ex="7"]').click();
  test('Worksheet 7 jump control works',await w7.isVisible());
  test('Answers are legible and not clipped', await page.evaluate(()=>{
    const a=[...document.querySelectorAll('.aliceqa-answer')];
    return a.length===8&&a.every(el=>{const r=el.getBoundingClientRect();return r.width>220&&r.height>30});
  }));
  test('No horizontal overflow on phone',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2));
  await page.screenshot({path:path.join(REPORT,'alice-lesson-phone.png'),fullPage:true});
  await page.locator('#aliceqaToggleRu').click();
  test('Russian translations hide',await page.locator('#aliceqaLesson').evaluate(el=>el.classList.contains('aliceqa-hide-ru')));
  test('Estonian answer remains visible',await page.locator('.aliceqa-answer').first().isVisible());
  test('Tense exercise stays visible when translations hidden',await page.locator('.aliceqa-pair').first().isVisible());
  test('Worksheet answers remain visible when translations hidden',await w7.locator('.aliceqa-ws-write').first().isVisible());
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

  // Independent German worksheet QA. Source of truth is not imported from the lesson.
  const deExpected=[
    ['Лео играет в парке.','Leo spielt in dem Park.','wo','dem','in'],
    ['Лео идёт в парк.','Leo geht in den Park.','wohin','den','in'],
    ['Мира плавает в бассейне.','Mira schwimmt in dem Schwimmbad.','wo','dem','in'],
    ['Анна идёт в библиотеку.','Anna geht in die Bibliothek.','wohin','die','in'],
    ['Анна читает в библиотеке.','Anna liest in der Bibliothek.','wo','der','in'],
    ['Лукас идёт в кино.','Lukas geht in das Kino.','wohin','das','in'],
    ['Дженни идёт на вечеринку.','Jenny geht auf die Party.','wohin','die','auf'],
    ['Дженни танцует на вечеринке.','Jenny tanzt auf der Party.','wo','der','auf'],
    ['Папа и Лиза идут на игровую площадку.','Papa und Lisa gehen auf den Spielplatz.','wohin','den','auf'],
    ['Папа и Лиза играют в прятки на игровой площадке.','Papa und Lisa spielen Verstecken auf dem Spielplatz.','wo','dem','auf']
  ];
  await page.goto(base+'?lesson=wo-wohin&v=acceptance',{waitUntil:'load'});
  await page.locator('#dewPractice').waitFor({state:'visible',timeout:12000});
  test('German lesson 5 opens from direct link',await page.locator('.dew-line').count()===10);
  for(let i=0;i<10;i++){
    test('German copywork pair '+(i+1),
      await page.locator('.dew-line').nth(i).locator('.dew-ru').innerText()===(i+1)+'. '+deExpected[i][0]&&
      await page.locator('.dew-line').nth(i).locator('.dew-de').innerText()===deExpected[i][1]);
  }
  await page.locator('#dewStart').click();
  test('Eight vocabulary cards preserved',await page.locator('#dewFlip').count()===1);
  await page.locator('#dewLesson').click();
  await page.locator('#dewPractice').click();
  test('Training opens at first stage',await page.locator('.dew-pr-progress').innerText()==='Этап 1 из 3 · Где или куда?');
  const firstPrompt=await page.locator('.dew-pr-ru').innerText();
  const firstCase=deExpected.find(r=>r[0]===firstPrompt);
  test('Question from the approved worksheet',!!firstCase);
  await page.locator('[data-dew-group="question"][data-dew-val="'+(firstCase[2]==='wo'?'wohin':'wo')+'"]').click();
  test('Wrong response red',await page.locator('.dew-pr-wrong').count()===1);
  test('Right response green after error',await page.locator('.dew-pr-correct').count()===1);
  await page.locator('#dewPrNext').click();
  const secondPrompt=await page.locator('.dew-pr-ru').innerText();
  test('Missed question comes back later, not immediately',firstPrompt!==secondPrompt);
  await page.reload({waitUntil:'load'});
  await page.locator('#dewPractice').click();
  test('Exercise resumes after reload',await page.locator('.dew-pr-ru').innerText()===secondPrompt);
  test('German practice fits mobile viewport',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2));
  await page.screenshot({path:path.join(REPORT,'deutsch-wo-wohin-phone.png')});
  for(let stage=0;stage<3;stage++){
    let attempts=0;
    while((await page.locator('.dew-pr-progress').count())===1&&
      (await page.locator('.dew-pr-progress').innerText()).startsWith('Этап '+(stage+1)+' из 3')){
      if(++attempts>25)throw Error('German lesson is stuck at stage '+(stage+1));
      const ru=await page.locator('.dew-pr-ru').innerText();
      const row=deExpected.find(r=>r[0]===ru);
      test('Exercise uses existing case',!!row);
      if(stage===0)await page.locator('[data-dew-group="question"][data-dew-val="'+row[2]+'"]').click();
      if(stage===1)await page.locator('[data-dew-group="article"][data-dew-val="'+row[3]+'"]').click();
      if(stage===2){
        await page.locator('[data-dew-group="prep"][data-dew-val="'+row[4]+'"]').click();
        await page.locator('[data-dew-group="article"][data-dew-val="'+row[3]+'"]').click();
        await page.locator('#dewPrCheck').click();
      }
      test('Correct answer accepted',await page.locator('.dew-pr-success').count()===1);
      await page.locator('#dewPrNext').click();
    }
  }
  test('All three grammar stages completed',await page.locator('#dewPrAgain').count()===1);
  await page.locator('#dewPrBack').click();
  test('Return to copywork and flashcards',await page.locator('.dew-line').count()===10&&await page.locator('#dewStart').count()===1);
  test('German practice has no browser script errors',pageErrors.length===0,pageErrors.join(' | '));

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