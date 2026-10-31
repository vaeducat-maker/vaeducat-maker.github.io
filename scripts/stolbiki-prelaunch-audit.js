#!/usr/bin/env node
'use strict';
// EDUKASS one-time, on-demand prelaunch audit. Two independent adversarial roles:
// ARITHMETIC METHODIST checks mathematical truth and Estonian written-work requirements.
// COMPETITOR checks real phone/browser journeys, friction, game loop, and rewards.
// No user's progress is touched: the entire audit runs on a local isolated copy.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const pageFile = path.resolve(root, 'proov/stolbiki-mosaic-7q4m9k/index.html');
const reportDir = path.resolve(root, 'artifacts/stolbiki-prelaunch');
fs.mkdirSync(reportDir, { recursive: true });
const html = fs.readFileSync(pageFile, 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(Boolean);
const checks = [];
const note = (role, name, ok, detail = '', severity = 'major') => {
  checks.push({role, name, passed: !!ok, detail: String(detail), severity});
  console.log((ok ? 'PASS' : 'FAIL') + ' [' + role + '] ' + name + (detail ? ' — ' + detail : ''));
};
const failCount = () => checks.filter(c => !c.passed).length;
const screenshot = async (page, name) => {
  try { await page.screenshot({ path: path.join(reportDir, name + '.png'), fullPage: true, timeout: 15000 }); }
  catch (e) { note('competitor', 'Screenshot ' + name, false, e.message, 'minor'); }
};

// INDEPENDENT educational contract. Never import the game's unhelpfulRoutine:
// a faulty generator must not be allowed to certify itself.
function classroomAudit(sample) {
  const level=Number(sample.skill.slice(1)),{op,a,b}=sample;
  const str=String(a),digits=[...str];
  const repeatedDividend=digits.length>1&&digits.every(x=>x===digits[0]);
  let ban='';
  if(op==='div'&&level<=6) {
    if(repeatedDividend)ban='repeated-digit mental division';
    else if(a%10===0)ban='round-ten shortcut';
    else if(a/b===11||a/b===111)ban='eleven-times table shortcut';
    else if(a%b!==0&&level<=6)ban='unintended remainder at entry';
  }
  if(op==='div'&&(a%10===0||b%10===0))ban='trailing-zero division shortcut';
  if(op==='mul'&&(a%10===0||b%10===0))ban='trailing-zero multiplication shortcut';
  if(op==='mul'&&level<=5&&(a%10===0||b===1||b===2))ban='mental multiplication shortcut';
  if(op==='sub'&&level<=4&&(b<10||a-b<12||a%10===0))ban='mental subtraction shortcut';
  if(op==='add'&&level<=3&&(a%10===0||b%10===0||a===b))ban='mental addition shortcut';
  // Stage one is foundational demonstration: acceptable very briefly, not
  // as the dominant work in a quarter-hour session.
  const warmup=level===1;
  return {ban,warmup};
}
function independentClassroomReview(lessons) {
  // Demonstrate that the reviewer can actually reject known wrong behavior.
  const badExamples=[
    {op:'div',skill:'D1',a:66,b:6},
    {op:'div',skill:'D1',a:77,b:7},
    {op:'div',skill:'D1',a:88,b:8},
    {op:'div',skill:'D1',a:80,b:2},
    {op:'div',skill:'D1',a:60,b:6},
    {op:'div',skill:'D11',a:330,b:30},
    {op:'div',skill:'D13',a:660,b:60},
    {op:'div',skill:'D14',a:23040,b:60},
    {op:'div',skill:'D16',a:17070,b:60},
    {op:'mul',skill:'M1',a:80,b:7},
    {op:'mul',skill:'M3',a:930,b:3},
    {op:'mul',skill:'M4',a:750,b:4},
    {op:'mul',skill:'M6',a:7570,b:7},
    {op:'mul',skill:'M7',a:4110,b:8},
    {op:'mul',skill:'M14',a:615,b:9090},
    {op:'div',skill:'D1',a:77,b:11},
    {op:'mul',skill:'M1',a:20,b:4},
    {op:'sub',skill:'S1',a:89,b:4}
  ];
  note('independent-methodist','Known bad examples are rejected by independent rules',
    badExamples.every(t=>classroomAudit(t).ban),
    JSON.stringify(badExamples.map(t=>t.a+':'+t.b+' → '+classroomAudit(t).ban)),'critical');
  const poor=[],slow=[],noProgress=[],boring=[];
  const generated=[];
  for(const entry of lessons){
    const rows=entry.tasks;
    for(const t of rows){
      const q=classroomAudit(t);
      if(q.ban)poor.push(entry.kind+' '+t.skill+' '+t.a+':'+t.b+' '+q.ban);
    }
    if(entry.kind==='fluent'){
      const warmups=rows.filter(x=>classroomAudit(x).warmup).length;
      const lateWarmups=rows.slice(28).filter(x=>classroomAudit(x).warmup).length;
      if(warmups>8||lateWarmups>0)slow.push(entry.name+': '+warmups+' warmups, '+lateWarmups+' after task 28');
      for(const op of ['add','sub','mul','div']){
        const opRows=rows.filter(x=>x.op===op);
        const levels=new Set(opRows.map(x=>x.skill));
        if(levels.size<4)noProgress.push(entry.name+' '+op+' '+[...levels].join(','));
        const signature=t=>t.op==='div'? t.skill+':'+t.b+':'+(Math.floor(t.a/t.b)%10):t.skill+':'+(t.a%10)+':'+(t.b%10);
        for(let i=3;i<opRows.length;i++){
          const last4=opRows.slice(i-3,i+1);
          if(last4.every(t=>signature(t)===signature(last4[0])))boring.push(entry.name+' '+op+' repeated numeric template '+signature(last4[0]));
        }
      }
    }
    generated.push({
      scenario:entry.name,kind:entry.kind,total:rows.length,
      stages:Object.fromEntries(['add','sub','mul','div'].map(op=>[op,[...new Set(rows.filter(t=>t.op===op).map(t=>t.skill))]])),
      first24:rows.slice(0,24).map(t=>t.a+({add:'+',sub:'-',mul:'×',div:':'}[t.op])+t.b),
      last16:rows.slice(-16).map(t=>t.a+({add:'+',sub:'-',mul:'×',div:':'}[t.op])+t.b)
    });
  }
  note('independent-methodist','Actual player sessions contain no blacklisted mental-arithmetic examples',
    poor.length===0,'failures '+poor.length+': '+poor.slice(0,10).join('; '),'critical');
  note('independent-methodist','Fluent pupils never spend an entire lesson on starter exercises',
    slow.length===0,'failures '+slow.length+': '+slow.slice(0,8).join('; '),'critical');
  note('independent-methodist','All four operations develop at least four skills in each fluent simulation',
    noProgress.length===0,'failures '+noProgress.length+': '+noProgress.slice(0,8).join('; '),'critical');
  note('independent-methodist','Fluent lessons avoid four consecutive repetitions of one numeric template',
    boring.length===0,'failures '+boring.length+': '+boring.slice(0,8).join('; '),'critical');
  fs.writeFileSync(path.join(reportDir,'classroom-simulations.json'),JSON.stringify({generated,issues:{poor,slow,noProgress,boring}},null,2));
}

function checkMethodist() {
  assert(scripts.length >= 3, 'Embedded math and game scripts missing');
  const env = {module: {exports:{}}, console};
  env.globalThis = env;
  vm.createContext(env);
  const engineSource=scripts.find(s=>s.includes('root.EDUKASS_MATH_ENGINE=api'));
  const adaptiveSource=scripts.find(s=>s.includes('root.EDUKASS_ADAPTIVE=api'));
  assert(engineSource&&adaptiveSource,'Missing real engine or adaptive script');
  vm.runInContext(engineSource, env, {timeout: 12000});
  vm.runInContext(adaptiveSource, env, {timeout: 12000});
  const engine = env.EDUKASS_MATH_ENGINE;
  const adaptive = env.EDUKASS_ADAPTIVE;
  assert(engine && adaptive, 'Math APIs missing');
  const skills = engine.skillList();
  note('methodist', 'Full mathematical skill catalogue', skills.length === 52,
    skills.length + ' levels from addition, subtraction, multiplication, division');

  let total = 0, invalid = [], badArithmetic = [], badRemainder = [];
  const byOperation = {};
  for (const skill of skills) {
    const count = 160;
    const op = skill[0];
    byOperation[op] = (byOperation[op] || 0) + count;
    for (let i = 0; i < count; i++) {
      total++;
      const sample = engine.generateSkill(skill, ((911827 + i * 1664525 + skill.charCodeAt(0)*98711 + Number(skill.slice(1))*1013904223) >>> 0) || 1);
      if (!engine.validateSkill(sample)) invalid.push(skill + ' ' + sample.a + ',' + sample.b);
      const {a,b,meta} = sample;
      if (sample.op === 'add' && a + b !== meta.sum) badArithmetic.push(skill);
      if (sample.op === 'sub' && a - b !== meta.difference) badArithmetic.push(skill);
      if (sample.op === 'mul' && a * b !== meta.product) badArithmetic.push(skill);
      if (sample.op === 'div') {
        if (Math.floor(a/b) !== Number(meta.quotient)) badArithmetic.push(skill);
        if (a % b !== meta.finalRemainder || meta.finalRemainder >= b || meta.finalRemainder < 0) badRemainder.push(skill + ' ' + a + '/' + b);
        for (const stage of meta.stages) {
          if (stage.part !== stage.q * b + stage.rem || stage.rem >= b || stage.rem < 0) badRemainder.push(skill + ': partial stage');
        }
      }
    }
  }
  note('methodist', 'Generated examples satisfy target skill', !invalid.length,
    total + ' sampled examples; violations: ' + invalid.slice(0,8).join('; '));
  note('methodist', 'Arithmetic answers agree with independent operations', !badArithmetic.length,
    'violations: ' + badArithmetic.slice(0,8).join('; '));
  note('methodist', 'Division intermediate stages and remainders', !badRemainder.length,
    'violations: ' + badRemainder.slice(0,8).join('; '));
  note('methodist', 'Estonian textbook borrow marking', html.includes("borrowNotation:'dot'"),
    'Subtraction is configured for dot marks, not 10 written above');
  note('methodist', 'Multiplication carries kept out of writing grid',
    html.includes('No small carry cells are shown above the example'),
    'Source implementation rule checked; browser layouts checked separately');
  note('methodist', 'No written zero final remainder',
    html.includes('if(s.rem>0)') && html.includes('if(hasRemainder)'),
    'Final remainder zero should be omitted');

  const div11 = [];
  for (let i=0;i<220;i++) div11.push(engine.generateSkill('D11', i*100003+31415).b);
  const unique = new Set(div11);
  note('methodist', 'D11 divisor variety', unique.size >= 15, unique.size + ' distinct divisors across 220 generations');

  const states = [];
  const mock = adaptive.createProfile();
  for (const mode of ['add','sub','mul','div','mix']) {
    const ses = adaptive.createSession(mock,mode,()=>0.5,Date.now());
    const a = adaptive.nextAssignment(ses);
    states.push(mode + '→' + a.op + '/' + a.skill);
  }
  note('methodist', 'Adaptive mode generation does not crash',states.length===5,states.join(', '));
  return {total,byOperation};
}

async function checkCompetitor() {
  const server = http.createServer((req,res)=>{
    const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
    const full = path.resolve(root, '.' + pathname);
    if (!full.startsWith(root+path.sep) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
      res.writeHead(404);res.end('Not Found');return;
    }
    res.writeHead(200, {'Content-Type': full.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8'});
    fs.createReadStream(full).pipe(res);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port = server.address().port;
  const url='http://127.0.0.1:'+port+'/proov/stolbiki-250/index.html';
  let browser;
  try {
    browser=await chromium.launch({headless:true});

    // PUBLIC_LAUNCH_NAVIGATION: real first-visit from the public homepage.
    // The user approved publication only after the whole game passed QA.
    // Check both discovery surfaces and play via the stable public permalink,
    // without touching the verified arithmetic renderer or saved profiles.
    {
      const ctx=await browser.newContext({viewport:{width:390,height:844},
        isMobile:true,hasTouch:true,deviceScaleFactor:1,serviceWorkers:'block'});
      try{
        const page=await ctx.newPage(),errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded',timeout:30000});
        const publicLinks=await page.evaluate(()=>{
          const list=[...document.querySelectorAll('a[href="kirjalik-arvutamine/"]')];
          const catalogCount=document.querySelectorAll('.home-new-stolbiki').length;
          return{count:list.length,newCards:catalogCount,
            visibleNames:list.map(x=>x.closest('article')?.querySelector('h2,h3')?.textContent||'')};
        });
        note('public-launch','Stolbiki has discoverable public entries in UUS and Mängud',
          publicLinks.count===2&&publicLinks.newCards===1&&
          publicLinks.visibleNames.every(x=>x.includes('Kirjalik arvutamine')),
          JSON.stringify(publicLinks),'critical');
        const catalog=await page.evaluate(async()=>await(await fetch('/data/catalog.json')).json());
        const entry=catalog.products.find(p=>p.id==='kirjalik-arvutamine');
        note('public-launch','Public free game registered with 52-stage destination and permanent URL',
          !!entry&&entry.status==='published'&&entry.type==='game'&&
          entry.priceType==='free'&&entry.page==='/kirjalik-arvutamine/'&&
          entry.catalogPage==='/'&&entry.catalogHref==='kirjalik-arvutamine/',
          JSON.stringify(entry),'critical');
        await page.locator('.home-new-stolbiki a[href="kirjalik-arvutamine/"]').click();
        await page.waitForURL(u=>u.pathname==='/proov/stolbiki-mosaic-7q4m9k/',
          {timeout:18000});
        await page.waitForFunction(()=>!!window.__EDUKASS_TEST__,null,{timeout:15000});
        if(await page.locator('#introPlay').isVisible()){
          await page.locator('#introPlay').click();
        }
        await page.locator('#home').waitFor({state:'visible',timeout:8000});
        const launch=await page.evaluate(()=>({
          path:location.pathname,
          title:document.querySelector('#home h1')?.textContent,
          levels:[...document.querySelectorAll('.op')].length,
          world:window.__EDUKASS_TEST__?.getRealWorldProgress()?.tiles,
          realStorage:localStorage.getItem('edukass_stolbiki_player_profile_v42')}));
        note('public-launch','Homepage click enters exact full trainer with all four operations and player world',
          launch.path==='/proov/stolbiki-mosaic-7q4m9k/'&&
          launch.title==='Kirjalik arvutamine'&&launch.levels===4&&launch.world>=50&&
          errors.length===0,JSON.stringify({launch,errors}),'critical');
        await screenshot(page,'published-stolbiki-from-homepage');
        await page.locator('.op[data-op="add"]').click();
        await page.locator('#train').waitFor({state:'visible',timeout:8000});
        note('public-launch','Visitor can start a real arithmetic exercise from published homepage',true);
        // Personal transfer URLs are passed through the public redirect intact.
        const publicPage=await ctx.newPage();
        await publicPage.goto('http://127.0.0.1:'+port+
          '/kirjalik-arvutamine/?from=site#personal-link',{waitUntil:'domcontentloaded'});
        await publicPage.waitForURL(u=>u.pathname==='/proov/stolbiki-mosaic-7q4m9k/',{timeout:12000});
        const forwarding=await publicPage.evaluate(()=>({search:location.search,hash:location.hash}));
        note('public-launch','Public permanent link keeps query and fragment for transfer/deep links',
          forwarding.search==='?from=site'&&forwarding.hash==='#personal-link',
          JSON.stringify(forwarding),'critical');
        await publicPage.close();
      }catch(e){
        note('public-launch','Real public homepage -> full Stolbiki trainer',
          false,e.stack?.slice(0,1350)||String(e),'critical');
      }finally{await ctx.close()}
    }

    // Match the owner's real Android screenshot: at normal first opening,
    // BOTH the full title and the transfer button must fit without scrolling.
    // Prior test only scrolled the transfer button into view, hiding the title.
    for(const [width,height] of [[360,640],[390,700],[390,844]]){
      const ctx=await browser.newContext({viewport:{width,height},
        isMobile:true,hasTouch:true,deviceScaleFactor:1,serviceWorkers:'block'});
      try{
        const page=await ctx.newPage(),errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.goto('http://127.0.0.1:'+port+
          '/proov/stolbiki-mosaic-7q4m9k/index.html?freshStart=1',
          {waitUntil:'domcontentloaded',timeout:35000});
        await page.waitForFunction(()=>!!window.__EDUKASS_TEST__,null,{timeout:15000});
        if(!(await page.locator('#home').isVisible())){
          await page.locator('#introPlay').click({force:true,timeout:9000});
        }
        await page.locator('#home').waitFor({state:'visible',timeout:10000});
        await page.waitForTimeout(250);
        const state=await page.evaluate(()=>{
          const home=document.getElementById('home'),
            keys=['.home-head','.home-world-card','.world-collection-strip',
              '.continue-card','.route-card','#openPassport'];
          const bounds=keys.map(selector=>{
            const b=document.querySelector(selector).getBoundingClientRect();
            return{selector,top:Math.round(b.top),bottom:Math.round(b.bottom),
              height:Math.round(b.height)};
          });
          const top=bounds[0],bottom=bounds[bounds.length-1];
          return{viewport:{width:innerWidth,height:innerHeight},
            scrollHeight:home.scrollHeight,clientHeight:home.clientHeight,
            scrollTop:home.scrollTop,bounds,
            fits:home.scrollHeight<=home.clientHeight+2 &&
              home.scrollTop===0&&top.top>=0&&bottom.bottom<=innerHeight-5 &&
              bounds.every(b=>b.top>=0&&b.bottom<=innerHeight) &&
              bounds[1].height>=130&&bounds[3].height>=44&&
              bounds[5].height>=44};
        });
        note('first-open-phone-fit','Full title, world, four cards and progress-transfer all fit WITHOUT scroll at '+width+'×'+height,
          state.fits&&errors.length===0,JSON.stringify({...state,errors}),'critical');
        await screenshot(page,'real-first-open-fits-'+width+'x'+height);
        await page.locator('#openPassport').click({timeout:5000});
        await page.locator('#passportDialog[open]').waitFor({state:'visible'});
        note('first-open-phone-fit','Bottom transfer button remains tappable at '+width+'×'+height,true);
        await page.locator('#passportClose').click();
        await page.locator('.op[data-op="add"]').click();
        await page.locator('#train').waitFor({state:'visible'});
        note('first-open-phone-fit','Addition still starts after compact home at '+width+'×'+height,true);
      }catch(e){
        note('first-open-phone-fit','Real beginner first opening at '+width+'×'+height,
          false,e.stack?.slice(0,1200)||String(e),'critical');
      }finally{await ctx.close()}
    }
    // All 52 mastered: real page switches to Kordamine, preserves 15 min
    // and worlds. Direct owner simulation is strictly isolated by lateDemo.
    for(const [width,height] of [[390,844],[1202,868]]){
      const ctx=await browser.newContext({viewport:{width,height},
        isMobile:width<900,hasTouch:width<900,deviceScaleFactor:1,serviceWorkers:'block'});
      try{
        const p=await ctx.newPage(),errors=[];
        p.on('pageerror',e=>errors.push(e.message));
        await p.goto('http://127.0.0.1:'+port+
          '/proov/stolbiki-mosaic-7q4m9k/index.html?lateDemo=1&reviewDemo=1',
          {waitUntil:'domcontentloaded',timeout:35000});
        await p.waitForFunction(()=>window.__EDUKASS_TEST__?.reviewQA?.state()?.complete,
          null,{timeout:12000});
        const initial=await p.evaluate(()=>({
          label:document.getElementById('homeLessonAction').textContent,
          banner:!document.getElementById('reviewStatus').classList.contains('hidden'),
          levels:[...document.querySelectorAll('.lvl')].map(x=>x.textContent),
          demo:window.__EDUKASS_TEST__.reviewQA.state(),
          tiles:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
          normalSave:localStorage.getItem('edukass_stolbiki_player_profile_v42')
        }));
        note('mastered-review','All 52 mastered visible on home and real saves isolated, '+width+'×'+height,
          initial.demo.mastered===52&&initial.banner&&initial.label==='Kordamine'&&
          initial.levels.every(x=>x.includes('omandatud'))&&initial.normalSave===null,
          JSON.stringify(initial),'critical');
        await p.locator('.op[data-op="div"]').click();
        await p.locator('#train').waitFor({state:'visible'});
        const sessions=await p.evaluate(()=>{
          const api=window.__EDUKASS_TEST__;
          const before=api.getLesson();
          api.setLessonElapsed(240000);
          const samples=[api.getState().current.op];
          const skills=[api.getState().assignment.skill];
          for(let i=0;i<39;i++){
            const a=api.reviewQA.next();
            samples.push(a.op);skills.push(a.skill);
          }
          return{mode:api.getLesson().mode,
            ops:samples,skills,clock:document.querySelector('#lessonTime').textContent,
            after:api.getLesson(),tiles:api.getRealWorldProgress().tiles,
            label:document.querySelector('#mode').textContent,
            normalSave:localStorage.getItem('edukass_stolbiki_player_profile_v42')};
        });
        const freq={add:0,sub:0,mul:0,div:0};
        for(const op of sessions.ops)freq[op]++;
        note('mastered-review','Every entry automatically mixes all four operations across 40 tasks, '+width+'×'+height,
          sessions.mode==='mix'&&Object.values(freq).every(n=>n===10)&&
          new Set(sessions.skills).size>=12&&sessions.label.includes('Kordamine'),
          JSON.stringify({freq,unique:new Set(sessions.skills).size,mode:sessions.mode,
            label:sessions.label}),'critical');
        note('mastered-review','15-min clock, 350 world tiles and user data stay untouched, '+width+'×'+height,
          sessions.clock==='11:00'&&sessions.after.active&&
          sessions.tiles===initial.tiles&&sessions.normalSave===null&&errors.length===0,
          JSON.stringify({clock:sessions.clock,tiles:sessions.tiles,errors}),'critical');
        await screenshot(p,'mastered-kordamine-'+width);
      }catch(e){
        note('mastered-review','Post-curriculum browser scenario '+width+'×'+height,
          false,e.stack?.slice(0,1100)||String(e),'critical');
      }finally{await ctx.close()}
    }
    // Public owner-only demo link: launches EXACT 3465 : 33 = 105 with a
    // zero in the middle of the quotient, without touching ordinary saves.
    for(const [width,height] of [[390,844],[1202,868]]){
      const ctx=await browser.newContext({viewport:{width,height},
        isMobile:width<900,hasTouch:width<900,deviceScaleFactor:1,serviceWorkers:'block'});
      try{
        const p=await ctx.newPage(),errs=[];
        p.on('pageerror',e=>errs.push(e.message));
        await p.goto('http://127.0.0.1:'+port+
          '/proov/stolbiki-mosaic-7q4m9k/index.html?lateDemo=1&divisionExample=3465-33',
          {waitUntil:'domcontentloaded',timeout:35000});
        await p.waitForFunction(()=>window.__EDUKASS_TEST__?.getState()?.current?.a===3465,
          null,{timeout:12000});
        await p.waitForTimeout(150);
        const v=await p.evaluate(()=>{
          const t=window.__EDUKASS_TEST__.getState(),equation=document.querySelector('.division-expression');
          const cells=[...document.querySelectorAll('.division-answer [data-target^="q"]')];
          const paper=document.getElementById('paper').getBoundingClientRect(),
            ar=document.querySelector('.division-answer').getBoundingClientRect();
          const normal=localStorage.getItem('edukass_stolbiki_player_profile_v42');
          return{a:t.current.a,b:t.current.b,quotient:t.current.meta.quotient,
            displayed:equation?.textContent,slots:cells.length,mode:document.getElementById('mode').textContent,
            visible:ar.top>=paper.top-1&&ar.bottom<=paper.bottom+1,
            hasMidZero:t.steps.some(s=>s.target==='q1'&&s.value==='0'),
            normalSave:normal};
        });
        note('direct-division-demo','Direct-link real interactive 3465 : 33 = 105, zero in quotient, '+width+'×'+height,
          v.a===3465&&v.b===33&&String(v.quotient)==='105'&&v.displayed==='3465 : 33 ='&&
          v.slots===3&&v.hasMidZero&&v.visible&&v.mode==='Jagamine · näide'&&
          v.normalSave===null&&errs.length===0,JSON.stringify({...v,errors:errs}),'critical');
        await p.locator('.division-answer [data-target="q0"]').click();
        await p.locator('#pad [data-key="1"]').click();
        const entered=await p.locator('.division-answer [data-target="q0"]').textContent();
        note('direct-division-demo','Pupil can enter quotient digits in exact example',entered.trim()==='1',
          'entered='+JSON.stringify(entered),'critical');
        await screenshot(p,'direct-division-3465-zero-'+width);
      }catch(e){
        note('direct-division-demo','Direct-link division example '+width+'×'+height,false,
          e.stack?.slice(0,900)||String(e),'critical');
      }finally{await ctx.close()}
    }
    // Regression from owner screenshot: D15 long division (984048 : 48) displayed
    // only the subtraction grid because the divisor and quotient were clipped.
    // The old header showed WORLD tile stage 301 instead of real math stage.
    for(const [width,height] of [[1202,868],[390,844],[360,640]]){
      const rc=await browser.newContext({
        viewport:{width,height},isMobile:width<900,hasTouch:width<900,
        deviceScaleFactor:1,serviceWorkers:'block'
      });
      try{
        const p=await rc.newPage(),err=[];
        p.on('pageerror',e=>err.push(e.message));
        await p.goto('http://127.0.0.1:'+port+
          '/proov/stolbiki-mosaic-7q4m9k/index.html?lateDemo=1',
          {waitUntil:'domcontentloaded',timeout:35000});
        await p.waitForFunction(()=>!!window.__EDUKASS_TEST__,null,{timeout:16000});
        await p.locator('#home').waitFor({state:'visible'});
        await p.locator('.op[data-op="div"]').click();
        await p.locator('#train').waitFor({state:'visible'});
        await p.waitForTimeout(220);
        const stage=await p.evaluate(()=>{
          const T=window.__EDUKASS_TEST__,st=T.getState(),
            level=Number(st.assignment?.skill?.slice(1)),text=document.querySelector('#mode').textContent;
          return{level,text,skill:st.assignment?.skill,world:T.getRealWorldProgress().level};
        });
        note('division-long-geometry','Training header shows true D skill, NOT world tile stage, '+width+'×'+height,
          stage.level>=1&&stage.level<=16&&stage.text.startsWith(stage.level+'. tase')&&
          !stage.text.startsWith(stage.world+'. tase'),JSON.stringify(stage),'critical');
        await p.evaluate(()=>window.__EDUKASS_TEST__.startExample('div',984048,48));
        await p.waitForTimeout(280);
        const top=await p.evaluate(()=>{
          const paper=document.querySelector('#paper'),layout=document.querySelector('#mathWrap .division-layout'),
            answer=document.querySelector('#mathWrap .division-answer'),
            expr=document.querySelector('#mathWrap .division-expression'),
            grid=document.querySelector('#mathWrap .math-grid');
          const q=document.querySelectorAll('#mathWrap .division-answer [data-target^="q"]');
          const pr=paper.getBoundingClientRect(),ar=answer.getBoundingClientRect(),
            gr=grid.getBoundingClientRect(),lr=layout.getBoundingClientRect();
          return {equation:expr?.textContent,quotientSlots:q.length,
            layoutTop:lr.top,answerTop:ar.top,answerBottom:ar.bottom,
            gridTop:gr.top,gridBottom:gr.bottom,paperTop:pr.top,paperBottom:pr.bottom,
            scrollTop:layout.scrollTop,scrollHeight:layout.scrollHeight,clientHeight:layout.clientHeight,
            answerVisible:ar.top>=pr.top-1&&ar.bottom<=pr.bottom+1&&
              ar.width>40&&ar.height>20&&gr.top>=ar.bottom-1&&
              lr.top>=pr.top-1,firstGridVisible:gr.top<pr.bottom-20};
        });
        note('division-long-geometry','984048 : 48 = and five quotient cells visible before any scroll, '+width+'×'+height,
          top.equation==='984048 : 48 ='&&top.quotientSlots===5&&
          top.answerVisible&&top.firstGridVisible&&top.scrollTop===0,
          JSON.stringify(top),'critical');
        const zeroWork=await p.evaluate(()=>{
          const task=window.__EDUKASS_TEST__.getState().current,
            stages=task.meta.stages,zeros=stages.map((s,i)=>Number(s.q)===0?i:-1).filter(i=>i>=0);
          const symbols=[...document.querySelectorAll('#mathWrap .math-grid .symbol')].filter(x=>x.textContent==='−');
          const forbidden=zeros.filter(i=>document.querySelector('#mathWrap [data-target="p'+i+'_0"]'));
          const qCells=zeros.map(i=>document.querySelector('#mathWrap [data-target="q'+i+'"]')!==null);
          return {zeros,zeroProductsRendered:forbidden.length,zeroQuotientSlotsPresent:qCells.every(Boolean),
            shownSubtractions:symbols.length,expectedSubtractions:stages.length-zeros.length};
        });
        // Regression baseline, NOT a new curricular rule: the pre-change
        // layout explicitly renders all quotient stages, including zero stages.
        note('division-long-geometry','Original zero-quotient stages preserved, no unrequested simplification, '+width+'×'+height,
          zeroWork.zeros.length===2&&zeroWork.zeroQuotientSlotsPresent&&
          zeroWork.zeroProductsRendered===2&&
          zeroWork.shownSubtractions===zeroWork.expectedSubtractions+zeroWork.zeros.length,
          JSON.stringify(zeroWork),'critical');
        const bottom=await p.evaluate(()=>{
          const layout=document.querySelector('#mathWrap .division-layout');
          const grid=document.querySelector('#mathWrap .math-grid');
          const paper=document.querySelector('#paper').getBoundingClientRect();
          layout.scrollTop=layout.scrollHeight;
          const g=grid.getBoundingClientRect();
          return{gridBottom:g.bottom,paperBottom:paper.bottom,
            reachable:g.bottom<=paper.bottom+1,scrollTop:layout.scrollTop,
            scrollHeight:layout.scrollHeight,clientHeight:layout.clientHeight};
        });
        note('division-long-geometry','Bottom of written calculation is accessible, '+width+'×'+height,
          bottom.reachable,JSON.stringify(bottom),'critical');
        await p.evaluate(()=>{document.querySelector('#mathWrap .division-layout').scrollTop=0});
        await screenshot(p,'long-division-header-'+width);
        note('division-long-geometry','No browser exceptions in long division, '+width+'×'+height,
          err.length===0,JSON.stringify(err.slice(0,3)),'critical');
      }catch(e){
        note('division-long-geometry','Long division screen '+width+'×'+height,false,
          e.stack?.slice(0,900)||String(e),'critical');
      }finally{await rc.close()}
    }
    // A late-stage demo is a complete real-app interaction, with private
    // storage and its own saved worlds. The transfer control must not clip.
    for(const [width,height] of [[360,640],[390,844],[1440,900]]){
      const demoContext=await browser.newContext({
        viewport:{width,height},isMobile:width<900,hasTouch:width<900,
        deviceScaleFactor:1,serviceWorkers:'block'
      });
      try{
        const demoPage=await demoContext.newPage();
        const demoErrors=[];
        demoPage.on('pageerror',e=>demoErrors.push(e.message));
        await demoPage.goto('http://127.0.0.1:'+port+
          '/proov/stolbiki-mosaic-7q4m9k/index.html?lateDemo=1',
          {waitUntil:'domcontentloaded',timeout:35000});
        await demoPage.waitForFunction(()=>!!window.__EDUKASS_TEST__,null,{timeout:18000});
        await demoPage.locator('#home').waitFor({state:'visible',timeout:8000});
        await demoPage.waitForTimeout(250);
        const checkpoint=await demoPage.evaluate(()=>{
          const transfer=document.getElementById('openPassport');
          const bounds=transfer.getBoundingClientRect(),marker=document.getElementById('lateDemoMark');
          const stages=['add','sub','mul','div'].map(op=>document.getElementById('lvl-'+op).textContent);
          return {world:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
            stages,bounds:{x:bounds.x,y:bounds.y,w:bounds.width,h:bounds.height},
            windowSize:{w:innerWidth,h:innerHeight},visible:getComputedStyle(transfer).visibility==='visible'&&
              bounds.width>100&&bounds.height>=40&&bounds.y>=0&&bounds.bottom<=innerHeight+1,
            marker:!marker.classList.contains('hidden'),
            originalProfile:localStorage.getItem('edukass_stolbiki_player_profile_v42'),
            originalWorld:localStorage.getItem('edukass-columns-player-world')
          };
        });
        note('late-stage-demo','Real middle pupil near final skill stages on '+width+'×'+height,
          checkpoint.world===350&&checkpoint.stages[0].includes('9. tase')&&
          checkpoint.stages[1].includes('11. tase')&&checkpoint.stages[2].includes('13. tase')&&
          checkpoint.stages[3].includes('15. tase')&&checkpoint.marker,
          JSON.stringify(checkpoint),'critical');
        // IMPORTANT: button must follow both second-row operation cards;
        // a fixed footer that overlays them is a hard accessibility failure.
        const transfer=demoPage.locator('#openPassport');
        await transfer.scrollIntoViewIfNeeded();
        const placement=await demoPage.evaluate(()=>{
          const transfer=document.getElementById('openPassport');
          const t=transfer.getBoundingClientRect();
          const mul=document.querySelector('.op[data-op="mul"]').getBoundingClientRect();
          const div=document.querySelector('.op[data-op="div"]').getBoundingClientRect();
          const parent=document.querySelector('.route-card').getBoundingClientRect();
          return {buttonY:t.y,buttonBottom:t.bottom,operationBottom:Math.max(mul.bottom,div.bottom),
            routeBottom:parent.bottom,viewportHeight:innerHeight,
            withinViewport:t.y>=0&&t.bottom<=innerHeight+1,
            belowCards:t.y>=Math.max(mul.bottom,div.bottom)+8,
            belowPanel:t.y>=parent.bottom+6,
            position:getComputedStyle(transfer).position};
        });
        note('passport-visibility','Transfer button BELOW four cards, not covering multiplication or division on '+width+'×'+height,
          placement.belowCards&&placement.belowPanel&&placement.position!=='absolute'&&placement.position!=='fixed',
          JSON.stringify(placement),'critical');
        note('passport-visibility','Transfer button can scroll fully into view on '+width+'×'+height,
          placement.withinViewport,JSON.stringify(placement),'critical');
        note('late-stage-demo','Demo does not alter real math or art storage at '+width+'×'+height,
          checkpoint.originalProfile===null&&checkpoint.originalWorld===null,
          'owner storage untouched','critical');
        await screenshot(demoPage,'late-student-home-'+width);
        await transfer.click({timeout:5500});
        await demoPage.locator('#passportDialog[open]').waitFor({state:'visible',timeout:4500});
        note('passport-visibility','Transfer dialog opens at '+width+'×'+height,true);
        await demoPage.locator('#passportClose').click();
        await demoPage.locator('#openWorldGallery').click();
        await demoPage.locator('#worldGalleryDialog[open]').waitFor({state:'visible',timeout:4500});
        const gallery=await demoPage.evaluate(()=>{
          const cards=[...document.querySelectorAll('#worldGalleryTiles button.world-gallery-item')];
          const headings=[...document.querySelectorAll('#worldGalleryTiles .world-pack-heading')];
          return {cards:cards.length,headings:headings.length,finished:cards.filter(c=>c.classList.contains('archived')).length};
        });
        note('late-stage-demo','One complete collection plus seven discovered worlds in next pack',
          gallery.cards===17&&gallery.headings===2&&gallery.finished===10,
          JSON.stringify(gallery),'critical');
        await screenshot(demoPage,'late-student-gallery-'+width);
        if(width===390){
          // Separate empty pupil (same layout, no advanced-demo badge) must
          // also expose all four modes before the transfer action.
          const normal=await demoContext.newPage();
          await normal.goto('http://127.0.0.1:'+port+
            '/proov/stolbiki-mosaic-7q4m9k/index.html?worldTest=1',
            {waitUntil:'domcontentloaded',timeout:35000});
          await normal.waitForFunction(()=>!!window.__EDUKASS_TEST__);
          if(await normal.locator('#introPlay').isVisible())await normal.locator('#introPlay').click();
          await normal.locator('#home').waitFor({state:'visible'});
          await normal.locator('#openPassport').scrollIntoViewIfNeeded();
          const order=await normal.evaluate(()=>{
            const passport=document.querySelector('#openPassport').getBoundingClientRect();
            const cards=[...document.querySelectorAll('.op[data-op]')].map(x=>x.getBoundingClientRect());
            return {bottomOfCards:Math.max(...cards.map(x=>x.bottom)),
              topOfPassport:passport.top,visible:passport.top>=0&&passport.bottom<=innerHeight+1,
              count:cards.length};
          });
          note('passport-visibility','Normal beginner: all operation cards uncovered, transfer below',
            order.count===4&&order.visible&&order.topOfPassport>=order.bottomOfCards+8,
            JSON.stringify(order),'critical');
          await screenshot(normal,'normal-pupil-passport-under-cards');
          await normal.close();
        }
        note('late-stage-demo','No uncaught browser exceptions on '+width+'×'+height,
          demoErrors.length===0,demoErrors.slice(0,3).join('; '),'critical');
      }catch(e){
        note('late-stage-demo','Full demo and bottom control at '+width+'×'+height,
          false,e.stack?.slice(0,900)||String(e),'critical');
      }finally{await demoContext.close()}
    }
    for (const width of [360,390,412]) {
      const context = await browser.newContext({
        viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1,
        serviceWorkers:'block'
      });
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      try {
        await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
        await page.waitForFunction(()=>!!window.__EDUKASS_TEST__,null,{timeout:15000});
        const progress=await page.evaluate(()=>window.__EDUKASS_TEST__.getRealWorldProgress());
        note('competitor','World progress loads at 250 on '+width+'px',progress.tiles===250,
          'Loaded '+progress.tiles+' tiles; expected 250');
        if (await page.locator('#introPlay').isVisible()) await page.locator('#introPlay').click();
        await page.locator('#home').waitFor({state:'visible',timeout:8000});
        await page.waitForTimeout(350);
        await screenshot(page,'home-'+width);
        const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1);
        note('competitor','No horizontal scrolling on '+width+'px',noOverflow,'viewport '+width+'px');
        const btns=await page.locator('.op[data-op]').count();
        note('competitor','All operation choices accessible on '+width+'px',btns===4,'buttons: '+btns);
        // Share is a real browser interaction, with the same native/fallback model as Korrutustabel.
        const shareButton=page.locator('#shareGameButton');
        note('competitor','Share invitation button visible at '+width+'px',await shareButton.isVisible(),
          'EDUKASS JAGA launch control');
        if(width===390) {
          // Browser share cannot be completed headlessly; force the copy-link fallback.
          await page.evaluate(()=>{try{Object.defineProperty(navigator,'share',{value:undefined,configurable:true})}catch{}});
          await shareButton.click();
          await page.locator('#shareDialog').waitFor({state:'visible',timeout:4500});
          const copiedLink=await page.locator('#shareUrlInput').inputValue();
          const correctInvite=copiedLink==='https://edukass-preview.va-educat.workers.dev/proov/stolbiki-mosaic-7q4m9k/?invite=2';
          const social=await page.evaluate(async()=>{
            const html=await (await fetch('/proov/stolbiki-mosaic-7q4m9k/index.html')).text();
            const doc=new DOMParser().parseFromString(html,'text/html');
            return {
              image:doc.querySelector('meta[property="og:image"]')?.getAttribute('content'),
              width:doc.querySelector('meta[property="og:image:width"]')?.getAttribute('content'),
              height:doc.querySelector('meta[property="og:image:height"]')?.getAttribute('content')
            };
          });
          note('competitor','Invitation metadata names a dedicated full-size image',
            social.image?.includes('/assets/stolbiki-share-preview.jpg')&&social.width==='1200'&&social.height==='630',
            JSON.stringify(social),'critical');
          note('competitor','Invitation uses clean player version, not world 250 demo',correctInvite,copiedLink,'critical');
          await screenshot(page,'share-invitation');
          // Browser clipboard permission is intentionally stubbed in CI. The button
          // still gets physically clicked, and we verify the EXACT URL sent to clipboard.
          await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{
            configurable:true,value:{writeText:async text=>{window.__shareCopiedUrl=text}}
          }));
          await page.locator('#copyShareLinkButton').click();
          await page.waitForFunction(()=>document.querySelector('#shareStatus').textContent.includes('Link kopeeritud'),null,{timeout:3000});
          const sharedCopy=await page.evaluate(()=>window.__shareCopiedUrl);
          note('competitor','Copy link button copies exact invite URL and confirms it',
            sharedCopy===copiedLink,'copied '+sharedCopy,'critical');
          await page.locator('#shareClose').click();
          const guest=await context.newPage();
          try{
            await guest.goto('http://127.0.0.1:'+port+'/proov/stolbiki-mosaic-7q4m9k/index.html',
              {waitUntil:'domcontentloaded',timeout:30000});
            await guest.waitForFunction(()=>!!window.__EDUKASS_TEST__);
            const fresh=await guest.evaluate(()=>({
              world:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
              frontier:window.__EDUKASS_TEST__.getState().profile
            }));
            note('competitor','Guest starts clean at 50 despite shared browser storage',fresh.world===50,
              'fresh world '+fresh.world+'/550','critical');
            const levels=await guest.evaluate(()=>{
              const ops=['add','sub','mul','div'];
              return {
                stages:ops.map(op=>document.querySelector('#lvl-'+op)?.textContent),
                bars:ops.map(op=>document.querySelector('#prog-'+op)?.style.width),
                frontiers:Object.values(window.__EDUKASS_TEST__.getState().profile).map(x=>x.frontier)
              };
            });
            note('competitor','Every fresh mathematical operation begins at stage one',
              levels.frontiers.every(x=>/^[ASMD]1$/.test(x))&&levels.stages.every(x=>x?.startsWith('Harjutad: 1. tase')),
              JSON.stringify(levels),'critical');
            note('competitor','Fresh player has four tiny current-stage markers, not false course completion bars',
              levels.bars.every(x=>x==='12px'),JSON.stringify(levels.bars),'critical');
            // Simulate husband's previously loaded, but unsolved, default profile (3/3/3/2).
            await guest.evaluate(()=>{
              const p=window.EDUKASS_ADAPTIVE.createProfile();
              for(const op of ['add','sub','mul']){p.ops[op].frontier=3;p.ops[op].diagnostic=true}
              p.ops.div.frontier=2;p.ops.div.diagnostic=true;
              localStorage.setItem('edukass_stolbiki_player_profile_v42',JSON.stringify(p));
            });
            await guest.reload({waitUntil:'domcontentloaded'});
            await guest.waitForFunction(()=>!!window.__EDUKASS_TEST__);
            const repaired=await guest.evaluate(()=>Object.values(window.__EDUKASS_TEST__.getState().profile).map(x=>x.frontier));
            note('competitor','Old unplayed 3/3/3/2 profile is corrected at next visit',
              repaired.every(x=>/^[ASMD]1$/.test(x)),JSON.stringify(repaired),'critical');
            // Genuine work is never erased by the first-visit migration.
            await guest.evaluate(()=>{
              const key='edukass_stolbiki_player_profile_v42',p=JSON.parse(localStorage.getItem(key));
              p.ops.add.frontier=3;
              p.ops.add.skills.A1.attempts=1;
              localStorage.setItem(key,JSON.stringify(p));
            });
            await guest.reload({waitUntil:'domcontentloaded'});
            await guest.waitForFunction(()=>!!window.__EDUKASS_TEST__);
            const retained=await guest.evaluate(()=>window.__EDUKASS_TEST__.getState().profile.add.frontier);
            note('competitor','Already earned arithmetic progress is never reset',
              retained==='A3',retained,'critical');
            // A numeric skills audit cannot catch a monotonous lesson.
            const pedagogy=await guest.evaluate(()=>{
              const T=window.__EDUKASS_TEST__,A=window.EDUKASS_ADAPTIVE;
              const early=Array.from({length:80},(_,i)=>T.challenge.generate('D1',i+1));
              const sessions={};
              for(const op of ['add','sub','mul','div'])sessions[op]=T.challenge.simulate(op,22);
              const s=A.createSession(A.createProfile(),'mix',()=>0.25,Date.now()),mix=[];
              for(let i=0;i<56;i++){
                const assign=A.nextAssignment(s),task=T.challenge.generate(assign.skill,5000+i);
                mix.push({skill:assign.skill,op:assign.op,a:task.a,b:task.b,unhelpful:T.challenge.unhelpful(task)});
                A.recordResult(s,assign,{firstTry:true,errors:0,ms:12000,assisted:false});
              }
              return {early:early.map(x=>({a:x.a,b:x.b,unhelpful:T.challenge.unhelpful(x)})),sessions,mix};
            });
            note('pedagogy','No repeated-digit or round-ten division patterns at entry',
              pedagogy.early.every(t=>!t.unhelpful&&t.a%11!==0&&t.a%10!==0),
              JSON.stringify(pedagogy.early.slice(0,12)),'critical');
            const secondLevel=await guest.evaluate(()=>{
              const T=window.__EDUKASS_TEST__,examples=[];
              for(const skill of ['D2','D3','D4','D5','D6','S1','S2','M1','M2']){
                for(let i=1;i<=24;i++){
                  const t=T.challenge.generate(skill,i*173+9);
                  if(T.challenge.unhelpful(t))examples.push(skill+': '+t.a+':'+t.b);
                }
              }
              return examples;
            });
            note('pedagogy','200+ early lessons reject obviously pointless shortcut expressions',
              secondLevel.length===0,JSON.stringify(secondLevel.slice(0,12)),'critical');
            note('pedagogy','Correct independent solving leads to varied skill stages in every operation',
              Object.values(pedagogy.sessions).every(s=>new Set(s.tasks.map(t=>t.skill)).size>=4&&s.tasks.every(t=>!t.unhelpful)),
              JSON.stringify(Object.fromEntries(Object.entries(pedagogy.sessions).map(([op,s])=>[op,[...new Set(s.tasks.map(t=>t.skill))]]))),'critical');
            note('pedagogy','56 example mixed lesson is not filled with mental-arithmetic templates',
              pedagogy.mix.every(t=>!t.unhelpful)&&
              pedagogy.mix.some(t=>t.op==='div'&&Number(t.skill.slice(1))>=4)&&
              pedagogy.mix.some(t=>t.op==='mul'&&Number(t.skill.slice(1))>=4),
              JSON.stringify(pedagogy.mix.slice(0,24)),'critical');
            // Run the actual player generator + adaptive policy over complete lessons.
            // Judgment is performed OUTSIDE the player, against a separate rubric.
            const classroomLessons=await guest.evaluate(()=>{
              const T=window.__EDUKASS_TEST__,A=window.EDUKASS_ADAPTIVE;
              function rngMaker(seed){
                let n=seed>>>0;
                return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296};
              }
              const out=[];
              for(const kind of ['fluent','struggling','uneven']){
                for(let run=0;run<16;run++){
                  const random=rngMaker(500+run*43),p=A.createProfile();
                  const s=A.createSession(p,'mix',random,Date.now()),tasks=[];
                  for(let i=0;i<88;i++){
                    const assignment=A.nextAssignment(s);
                    const task=T.challenge.generate(assignment.skill,run*100000+i*139+71);
                    const firstTry=kind==='fluent'||kind==='uneven'&&assignment.op==='add'||(kind==='struggling'&&i%7===0);
                    tasks.push({op:assignment.op,skill:assignment.skill,a:task.a,b:task.b});
                    A.recordResult(s,assignment,{firstTry,errors:firstTry?0:1,ms:12000,assisted:!firstTry});
                  }
                  out.push({kind,name:kind+'-'+run,tasks});
                }
              }
              return out;
            });
            independentClassroomReview(classroomLessons);
            // The 15-minute class is ONE lesson across all operation choices.
            // Reproduce the user's real path: eight minutes of mixed work,
            // Back, choose division, Back, choose multiplication/mixed.
            const switchContext=await browser.newContext({
              viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'
            });
            try{
              const sw=await switchContext.newPage();
              await sw.goto('http://127.0.0.1:'+port+'/proov/stolbiki-mosaic-7q4m9k/index.html',
                {waitUntil:'domcontentloaded',timeout:30000});
              await sw.waitForFunction(()=>!!window.__EDUKASS_TEST__);
              await sw.locator('#introPlay').click();
              await sw.locator('#home').waitFor({state:'visible'});
              await sw.locator('.continue-play').click();
              await sw.locator('#train').waitFor({state:'visible'});
              await sw.evaluate(()=>window.__EDUKASS_TEST__.setLessonElapsed(480000));
              // Solve the first A1 task as a real child would, with visible cell
              // clicks and on-screen keyboard (not a developer auto-solve API).
              for(let turn=0;turn<15;turn++){
                const state=await sw.evaluate(()=>window.__EDUKASS_TEST__.getState());
                if((await sw.evaluate(()=>window.__EDUKASS_TEST__.getLesson())).solved>0)break;
                const step=state.steps[state.stepIndex];
                if(!step) {await sw.waitForTimeout(100);continue}
                const entry=sw.locator('#mathWrap .entry[data-target="'+step.target+'"]');
                await entry.click({timeout:2500});
                for(const char of String(step.value))
                  await sw.locator('#pad button[data-key="'+(char==='•'?'dot':char)+'"]').click({timeout:2500});
                await sw.waitForTimeout(140);
              }
              await sw.waitForFunction(()=>window.__EDUKASS_TEST__.getLesson().solved===1);
              await sw.waitForFunction(()=>window.__EDUKASS_TEST__.getLesson().taskInWorld===1);
              const initial=await sw.evaluate(()=>window.__EDUKASS_TEST__.getLesson());
              await sw.locator('#back').click();
              await sw.locator('#home').waitFor({state:'visible',timeout:4500});
              const homeState=await sw.evaluate(()=>({
                lesson:window.__EDUKASS_TEST__.getLesson(),
                label:document.querySelector('#homeLessonTime').textContent,
                levels:document.querySelector('#lvl-add').textContent,
                dot:document.querySelector('#prog-add').style.width
              }));
              note('competitor','Back from mixed lesson keeps elapsed time, saved exercises and world reward counter',
                homeState.lesson.active&&homeState.lesson.solved===1&&
                homeState.lesson.elapsed>=480000&&homeState.lesson.elapsed<486000&&
                homeState.lesson.taskInWorld===1&&homeState.label.includes('JÄÄNUD'),
                JSON.stringify(homeState),'critical');
              note('competitor','Home shows current learning stage, not a fake percent-completion bar',
                homeState.levels.startsWith('Harjutad:')&&homeState.dot==='12px',
                homeState.levels+'; marker '+homeState.dot,'critical');
              await sw.locator('.op[data-op="div"]').click();
              await sw.locator('#train').waitFor({state:'visible',timeout:4500});
              const division=await sw.evaluate(()=>({
                lesson:window.__EDUKASS_TEST__.getLesson(),
                operation:window.__EDUKASS_TEST__.getState().current.op,
                clock:document.querySelector('#lessonTime').textContent
              }));
              note('competitor','Switching mid-class to division keeps eight-minute clock and completed tasks',
                division.operation==='div'&&division.lesson.mode==='div'&&
                division.lesson.solved===1&&division.lesson.elapsed>=480000&&
                division.lesson.elapsed<486000&&division.clock!=='15:00'&&
                division.lesson.taskInWorld===1,
                JSON.stringify(division),'critical');
              await sw.locator('#back').click();
              await sw.locator('#home').waitFor({state:'visible',timeout:4500});
              await sw.locator('.op[data-op="mul"]').click();
              const multiply=await sw.evaluate(()=>({
                lesson:window.__EDUKASS_TEST__.getLesson(),
                operation:window.__EDUKASS_TEST__.getState().current.op
              }));
              note('competitor','Mixed → division → multiplication remains one lesson with one reward counter',
                multiply.operation==='mul'&&multiply.lesson.solved===1&&
                multiply.lesson.elapsed>=480000&&multiply.lesson.taskInWorld===1,
                JSON.stringify(multiply),'critical');
              await sw.locator('#back').click();
              await sw.locator('#home').waitFor({state:'visible',timeout:4500});
              await sw.locator('.continue-play').click();
              const final=await sw.evaluate(()=>({
                lesson:window.__EDUKASS_TEST__.getLesson(),
                operation:window.__EDUKASS_TEST__.getState().current.op
              }));
              note('competitor','Returning to Kõik koos continues the same 15-minute lesson',
                final.lesson.mode==='mix'&&final.lesson.solved===1&&
                final.lesson.elapsed>=480000&&final.lesson.taskInWorld===1,
                JSON.stringify(final),'critical');
            }finally{await switchContext.close()}
            // Strong learner earns GROUPED reward on spaced-verified mastery:
            // one manual map choice + connected automatic reveals (never nine taps).
            const achievementContext=await browser.newContext({
              viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'
            });
            try{
              const rewardPage=await achievementContext.newPage();
              await rewardPage.goto('http://127.0.0.1:'+port+'/proov/stolbiki-mosaic-7q4m9k/index.html',
                {waitUntil:'domcontentloaded',timeout:30000});
              await rewardPage.evaluate(()=>{
                const a=window.EDUKASS_ADAPTIVE,p=a.createProfile(),s=p.ops.add.skills.A1;
                Object.assign(s,{mastered:true,verified:true,attempts:4,firstTry:4,reviewStage:3});
                p.ops.add.frontier=2;
                localStorage.setItem('edukass_stolbiki_player_profile_v42',JSON.stringify(p));
                localStorage.setItem('edukass-columns-player-world','50');
                localStorage.setItem('edukass-columns-player-level','1');
                localStorage.removeItem('edukass-columns-player-world-order-v1');
              });
              await rewardPage.reload({waitUntil:'domcontentloaded'});
              await rewardPage.waitForFunction(()=>!!window.__EDUKASS_TEST__);
              const beforeReward=await rewardPage.evaluate(()=>window.__EDUKASS_TEST__.getRealWorldProgress());
              note('world-balance','A verified skill releases nine pieces without hundreds of filler examples',
                beforeReward.pending===9&&beforeReward.evidence.verified===1&&beforeReward.tiles===50,
                JSON.stringify(beforeReward),'critical');
              await rewardPage.locator('#introPlay').click();
              await rewardPage.locator('.continue-play').click();
              await rewardPage.locator('#protoWorld.on').waitFor({state:'visible',timeout:6000});
              await rewardPage.waitForTimeout(430);
              await rewardPage.locator('#pc0').click();
              await rewardPage.waitForFunction(()=>window.__EDUKASS_TEST__.getRealWorldProgress().tiles===59,
                {timeout:9000});
              const rewarded=await rewardPage.evaluate(()=>{
                const T=window.__EDUKASS_TEST__,w=T.getRealWorldProgress(),tiles=T.getWorldTileOrder();
                return{world:w,unique:new Set(tiles).size===tiles.length,count:tiles.length}
              });
              note('world-balance','One world choice unveils all nine connected achievement pieces without resets',
                rewarded.world.tiles===59&&rewarded.world.pending===0&&rewarded.unique&&rewarded.count===59,
                JSON.stringify(rewarded),'critical');
              await rewardPage.reload({waitUntil:'domcontentloaded'});
              await rewardPage.waitForFunction(()=>!!window.__EDUKASS_TEST__);
              const kept=await rewardPage.evaluate(()=>window.__EDUKASS_TEST__.getRealWorldProgress());
              note('world-balance','All nine skill pieces and confirmation persist across device reload',
                kept.tiles===59&&kept.pending===0&&kept.evidence.verified===1,
                JSON.stringify(kept),'critical');
            }finally{await achievementContext.close()}
            // Real first-time pupil: a separate browser storage namespace,
            // random artwork, early 12-tile reward, one offered picture and
            // persistent switching to the original artwork.
            const worldContext=await browser.newContext({
              viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'
            });
            try{
              const wp=await worldContext.newPage();
              await wp.goto('http://127.0.0.1:'+port+'/proov/stolbiki-mosaic-7q4m9k/index.html?worldTest=1&resetWorldTest=1',
                {waitUntil:'domcontentloaded',timeout:35000});
              await wp.waitForFunction(()=>!!window.__EDUKASS_TEST__&&!!window.EDUKASS_WORLD_COLLECTION_QA);
              const first=await wp.evaluate(()=>({
                collection:window.EDUKASS_WORLD_COLLECTION_QA(),
                math:window.__EDUKASS_TEST__.getState().profile,
                original:localStorage.getItem('edukass_stolbiki_player_profile_v42')
              }));
              note('world-gallery','First-time test has ten real worlds, a randomly selected first artwork and zero external storage modification',
                first.collection.count===50&&first.collection.order.length===10&&
                first.collection.unlocked.length===1&&first.collection.introSeparate&&
                first.collection.studentIsolated&&first.original===null&&
                Object.values(first.math).every(x=>x.frontier.endsWith('1')),
                JSON.stringify({scene:first.collection,original:first.original}),'critical');
              await wp.locator('#introPlay').click();
              await wp.locator('#openWorldGallery').click();
              await wp.locator('#worldGalleryDialog[open]').waitFor({state:'visible'});
              const soloCount=await wp.locator('#worldGalleryTiles button').count();
              note('world-gallery','Before first reward gallery reveals only original pupil artwork',
                soloCount===1,String(soloCount),'critical');
              const artDecode=await wp.evaluate(async()=>{
                const all=window.EDUKASS_WORLD_ART||[];
                const failed=[];
                await Promise.all(all.map(w=>new Promise(resolve=>{
                  const im=new Image();
                  im.onload=()=>{if(!im.naturalWidth||!im.naturalHeight)failed.push(w.id);resolve()};
                  im.onerror=()=>{failed.push(w.id);resolve()};
                  im.src=w.src;
                })));
                return {total:all.length,unique:new Set(all.map(w=>w.id)).size,
                  approved:window.EDUKASS_APPROVED_ART_COUNT||0,
                  allWebp:all.every(w=>w.src.startsWith('data:image/webp;base64,')),
                  failed:failed.slice(0,15)};
              });
              note('world-gallery','All 50 distinct SVG scenes decode as real game images on mobile',
                artDecode.total===50&&artDecode.unique===50&&artDecode.approved===50&&artDecode.allWebp&&artDecode.failed.length===0,
                JSON.stringify(artDecode),'critical');
              await wp.locator('#galleryClose').click();
              await wp.evaluate(()=>{
                const p=window.EDUKASS_ADAPTIVE.createProfile();
                p.ops.add.skills.A1.attempts=5;
                localStorage.setItem('edukass-world-student-test-v1:edukass_stolbiki_player_profile_v42',JSON.stringify(p));
              });
              await wp.reload({waitUntil:'domcontentloaded'});
              await wp.waitForFunction(()=>!!window.__EDUKASS_TEST__&&!!window.EDUKASS_WORLD_COLLECTION_QA);
              // Reload correctly restores the home screen, so intro can be absent.
              if(await wp.locator('#introPlay').isVisible())await wp.locator('#introPlay').click();
              await wp.locator('#home').waitFor({state:'visible'});
              await wp.locator('.continue-play').click();
              await wp.locator('#protoWorld.on').waitFor({state:'visible',timeout:6000});
              await wp.locator('#pc0').waitFor({state:'visible',timeout:6000});
              const tappedTile=await wp.locator('#pc0').getAttribute('data-k');
              await wp.locator('#pc0').click();
              await wp.waitForFunction(()=>window.__EDUKASS_TEST__.getRealWorldProgress().tiles===62,{timeout:10000});
              await wp.locator('#worldNewDialog[open]').waitFor({state:'visible',timeout:8000});
              const offered=await wp.evaluate(()=>({
                collection:window.EDUKASS_WORLD_COLLECTION_QA(),
                world:window.__EDUKASS_TEST__.getRealWorldProgress(),
                offer:document.querySelector('#worldNewTitle').textContent
              }));
              note('world-gallery','First five problems grow world by twelve tiles and unlock exactly one new random scene',
                offered.world.tiles===62&&offered.collection.unlocked.length===2&&
                offered.collection.notice===2&&offered.offer.includes('Avastasid:'),
                JSON.stringify(offered),'critical');
              const growthDirection=await wp.evaluate(tapped=>{
                const tile=Number(tapped),x0=tile%22,y0=Math.floor(tile/22);
                const dx=x0-11,dy=y0-14,len=Math.hypot(dx,dy)||1;
                const saved=JSON.parse(localStorage.getItem('edukass-world-student-test-v1:edukass-columns-player-world-order-v1')||'[]');
                const extra=saved.slice(51,62);
                const rightWay=extra.filter(k=>(((k%22)-x0)*dx+(Math.floor(k/22)-y0)*dy)/len>=-.25);
                return {extra:extra.length,onChosenSide:rightWay.length,tapped};
              },tappedTile);
              note('world-gallery','Eleven bonus tiles expand on the chosen tap side, not arbitrary remote sectors',
                growthDirection.extra===11&&growthDirection.onChosenSide>=10,
                JSON.stringify(growthDirection),'critical');
              await wp.locator('#tryNewWorld').click();
              await wp.locator('#worldContinue').waitFor({state:'visible'});
              const rewardUX=await wp.evaluate(()=>({
                worldVisible:document.querySelector('#protoWorld').classList.contains('viewing'),
                hasVoxelScenes:window.EDUKASS_VOXEL_ART_VERSION==='3.0-approved-concept-art'&&window.EDUKASS_APPROVED_ART_COUNT===50,
                galleryRect:document.querySelector('#galleryFromWorld').getBoundingClientRect().toJSON(),
                countRect:document.querySelector('#protoWorldCount').getBoundingClientRect().toJSON(),
                soundRect:document.querySelector('#soundToggleButton').getBoundingClientRect().toJSON()
              }));
              const overlaps=(a,b)=>a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y;
              note('world-gallery','New world is shown before next calculation, voxel art is active and mobile controls are separated',
                rewardUX.worldVisible&&rewardUX.hasVoxelScenes&&
                !overlaps(rewardUX.galleryRect,rewardUX.countRect)&&
                !overlaps(rewardUX.galleryRect,rewardUX.soundRect)&&
                !overlaps(rewardUX.countRect,rewardUX.soundRect),
                JSON.stringify(rewardUX),'critical');
              const switched=await wp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
              note('world-gallery','Choosing newly discovered artwork preserves all 62 tiles',
                switched.active===switched.unlocked[1]&&switched.count===62,
                JSON.stringify(switched),'critical');
              await wp.locator('#worldContinue').click();
              await wp.locator('#train').waitFor({state:'visible'});
              await wp.locator('#back').click();
              await wp.locator('#home').waitFor({state:'visible'});
              await wp.locator('#openWorldGallery').click();
              const twoCount=await wp.locator('#worldGalleryTiles button').count();
              await wp.locator('#worldGalleryTiles button').first().click();
              await wp.locator('#protoWorld.viewing').waitFor({state:'visible'});
              const returned=await wp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
              note('world-gallery','Both designs stay available and first artwork is instantly recoverable',
                twoCount===2&&returned.active===first.collection.active&&returned.count===62,
                JSON.stringify(returned),'critical');
              await wp.reload({waitUntil:'domcontentloaded'});
              const persisted=await wp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
              note('world-gallery','Same randomized order, selected picture and opening count survive reload',
                persisted.active===returned.active&&persisted.count===62&&
                persisted.order.every((id,i)=>id===first.collection.order[i]),
                JSON.stringify(persisted),'critical');
              // Owner-only, isolated fast-forward: verify five independent
              // collections and preservation of the school arithmetic profile.
              if(await wp.locator('#protoWorld.viewing').isVisible()){
                await wp.locator('#galleryFromWorld').click();
              }else{
                if(await wp.locator('#introPlay').isVisible())await wp.locator('#introPlay').click();
                await wp.locator('#openWorldGallery').click();
              }
              const fivePackLog=[];
              for(let pk=2;pk<=5;pk++){
                await wp.locator('#worldQANextPack').click();
                await wp.locator('#protoWorld.viewing').waitFor({state:'visible'});
                const pack=await wp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
                fivePackLog.push({index:pack.activePack,tiles:pack.count,
                  history:pack.packCounts.slice(),all:pack.totalWorlds,packs:pack.packIds});
                if(pk<5)await wp.locator('#galleryFromWorld').click();
              }
              const afterPacks=await wp.evaluate(()=>({
                state:window.EDUKASS_WORLD_COLLECTION_QA(),
                math:window.__EDUKASS_TEST__.getState().profile
              }));
              note('world-gallery','Five different sets of ten scenes restart at 50 tiles and archive previous 550 pieces',
                fivePackLog.length===4&&fivePackLog.every((p,i)=>
                  p.index===i+2&&p.tiles===50&&p.all===50&&p.packs.every(n=>n===10)&&
                  p.history.slice(0,i+1).every(n=>n===550))&&
                Object.values(afterPacks.math).every(x=>x.frontier.endsWith('1')),
                JSON.stringify(fivePackLog),'critical');
              await wp.reload({waitUntil:'domcontentloaded'});
              const persistPacks=await wp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
              note('world-gallery','Entire archived library stays safe after reload',
                persistPacks.activePack===5&&persistPacks.count===50&&
                persistPacks.packCounts.slice(0,4).every(n=>n===550)&&
                persistPacks.totalWorlds===50,
                JSON.stringify(persistPacks),'critical');
            }finally{await worldContext.close()}
            // A dedicated view of the real 10-world victory moment. Its data
            // must not modify normal play or the separate student-test profile.
            const victoryContext=await browser.newContext({
              viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'
            });
            try{
              const vp=await victoryContext.newPage();
              const victoryUrl='http://127.0.0.1:'+port+
                '/proov/stolbiki-mosaic-7q4m9k/index.html?victoryDemo=1&victoryReset=1';
              await vp.goto(victoryUrl,{waitUntil:'domcontentloaded',timeout:45000});
              await vp.locator('#worldPackDone[open]').waitFor({state:'visible',timeout:15000});
              const fullPainting=await vp.evaluate(async()=>{
                const source=window.EDUKASS_WORLD_ART.find(w=>w.id===window.EDUKASS_WORLD_COLLECTION_QA().active);
                const img=new Image();img.src=source.src;await img.decode();
                const canvas=document.querySelector('#protoWorldCanvas');
                // Give the original app's image onload renderer a chance to paint.
                for(let i=0;i<30;i++){
                  const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
                  if(pixels.some((v,k)=>k%4===3&&v>0))break;
                  await new Promise(resolve=>setTimeout(resolve,50));
                }
                const expected=document.createElement('canvas');
                expected.width=canvas.width;expected.height=canvas.height;
                const scale=Math.min(expected.width/img.naturalWidth,expected.height/img.naturalHeight);
                const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;
                expected.getContext('2d').drawImage(img,(expected.width-dw)/2,
                  (expected.height-dh)/2,dw,dh);
                const got=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
                const want=expected.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
                let diff=0,count=0,opaque=0;
                for(let i=0;i<want.length;i+=16){
                  for(let j=0;j<4;j++)diff+=Math.abs(got[i+j]-want[i+j]);
                  opaque+=want[i+3]>0?1:0;
                  count+=4;
                }
                return {meanPixelDifference:+(diff/count).toFixed(3),
                  original:[img.naturalWidth,img.naturalHeight],
                  canvas:[canvas.width,canvas.height],
                  fullArtworkVisible:opaque>3000,
                  margins:[(expected.width-dw)/2,(expected.height-dh)/2]};
              });
              note('world-gallery','Full 550/550 painting is pixel-equivalent to entire original approved image, not a crop',
                fullPainting.fullArtworkVisible&&fullPainting.meanPixelDifference<3&&
                fullPainting.margins.every(n=>n>=-0.01),
                JSON.stringify(fullPainting),'critical');
              const victory=await vp.evaluate(()=>({
                gallery:window.EDUKASS_WORLD_COLLECTION_QA(),
                count:document.querySelector('#protoWorldCount').textContent,
                title:document.querySelector('#worldPackDoneTitle').textContent,
                normalSave:localStorage.getItem('edukass-columns-world-collection-v1'),
                normalMath:localStorage.getItem('edukass_stolbiki_player_profile_v42'),
                testSave:localStorage.getItem('edukass-world-student-test-v1:edukass-columns-world-collection-v1'),
                simWorld:localStorage.getItem('edukass-world-victory-demo-v1:edukass-columns-player-world')
              }));
              note('world-gallery','Victory deep link opens real first-collection celebration at 550/550 without touching actual saves',
                victory.gallery.victoryDemo===true&&victory.gallery.count===550&&
                victory.gallery.unlocked.length===10&&victory.gallery.activePack===1&&
                victory.title.includes('kogumik')&&victory.simWorld==='550'&&
                victory.normalSave===null&&victory.normalMath===null&&victory.testSave===null,
                JSON.stringify(victory),'critical');
              await screenshot(vp,'world-victory-first-pack');
              await vp.locator('#worldPackStay').click();
              await vp.locator('#worldGalleryDialog[open]').waitFor({state:'visible'});
              const completeWorldCount=await vp.locator('#worldGalleryTiles .world-gallery-item').count();
              note('world-gallery','Completed world gallery really contains ten fully-open selectable paintings',
                completeWorldCount===10,'cards: '+completeWorldCount,'critical');
              await screenshot(vp,'world-victory-gallery');
              await vp.locator('#worldGalleryTiles .world-gallery-item').nth(5).click();
              await vp.locator('#protoWorld.viewing').waitFor({state:'visible'});
              const chosen=await vp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
              note('world-gallery','Winner can inspect any of the ten finished images in full screen',
                chosen.count===550&&chosen.active===chosen.order[5],
                JSON.stringify(chosen),'critical');
              // The arrow MUST return to the gallery without invoking browser
              // history.back(), particularly for an opened-from-message URL.
              await vp.locator('#worldViewBack').click();
              await vp.locator('#worldGalleryDialog[open]').waitFor({state:'visible',timeout:5000});
              const returnToGallery=await vp.locator('#worldGalleryTiles .world-gallery-item').count();
              note('world-gallery','World back arrow returns to all ten images, no freeze or app exit',
                returnToGallery===10,'gallery images: '+returnToGallery,'critical');
              await vp.locator('#galleryClose').click();
              await vp.locator('#home').waitFor({state:'visible',timeout:5000});
              await vp.locator('#openWorldView').click();
              await vp.locator('#protoWorld.viewing').waitFor({state:'visible',timeout:5000});
              await vp.locator('#worldViewBack').click();
              await vp.locator('#home').waitFor({state:'visible',timeout:5000});
              note('world-gallery','World back arrow works from home too, independent of history',
                await vp.locator('#home').isVisible(),'returned to home','critical');
              await vp.locator('#openWorldView').click();
              await vp.locator('#galleryFromWorld').click();
              await vp.locator('#worldGalleryDialog[open]').waitFor({state:'visible'});
              await vp.locator('#worldGalleryTiles .world-collection-primary').click();
              await vp.locator('#protoWorld.viewing').waitFor({state:'visible'});
              const second=await vp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
              note('world-gallery','After inspecting all ten, winner can start new ten-world collection at 50/550',
                second.activePack===2&&second.count===50&&
                second.packCounts[0]===550&&second.packCounts[1]===50,
                JSON.stringify(second),'critical');
              await vp.reload({waitUntil:'domcontentloaded'});
              const preserved=await vp.evaluate(()=>window.EDUKASS_WORLD_COLLECTION_QA());
              note('world-gallery','Victory simulation archive and next pack survive page reload without contaminating real saves',
                preserved.activePack===2&&preserved.count===50&&preserved.packCounts[0]===550&&
                preserved.victoryDemo&&
                await vp.evaluate(()=>localStorage.getItem('edukass-columns-world-collection-v1')===null),
                JSON.stringify(preserved),'critical');
            }finally{await victoryContext.close()}
            // INDEPENDENT VISUAL ACCEPTANCE: compare the actual game canvas
            // with the approved full-size source for ALL 50 paintings.
            // Samples are retained as screenshots, and each image is checked
            // numerically (not only by checking that its file exists).
            const matrixContext=await browser.newContext({
              viewport:{width:390,height:844},isMobile:true,hasTouch:true,
              deviceScaleFactor:1,serviceWorkers:'block'
            });
            try{
              const matrix=await matrixContext.newPage();
              const matrixErrors=[];
              matrix.on('pageerror',e=>matrixErrors.push(e.message));
              await matrix.goto('http://127.0.0.1:'+port+
                '/proov/stolbiki-mosaic-7q4m9k/index.html?worldTest=1&resetWorldTest=1',
                {waitUntil:'domcontentloaded',timeout:45000});
              await matrix.waitForFunction(()=>window.__EDUKASS_TEST__?.visualQA?.setScene);
              const artMetrics=[];
              for(let pack=0;pack<5;pack++){
                const batch=await matrix.evaluate(async p=>{
                  const all=window.EDUKASS_WORLD_ART;
                  const order=window.EDUKASS_WORLD_PACKS[p];
                  const result=[];
                  for(const id of order){
                    const switched=await window.__EDUKASS_TEST__.visualQA.setScene(p,id);
                    if(!switched){result.push({id,error:'Cannot select isolated test scene'});continue}
                    const current=document.querySelector('#protoWorldCanvas');
                    const image=new Image();image.src=all.find(w=>w.id===id)?.src||'';
                    try{await image.decode()}catch{result.push({id,error:'Source not decoded'});continue}
                    const expected=document.createElement('canvas');
                    expected.width=current.width;expected.height=current.height;
                    const ectx=expected.getContext('2d');
                    const scale=Math.min(expected.width/image.naturalWidth,expected.height/image.naturalHeight);
                    const dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;
                    const dx=(expected.width-dw)/2,dy=(expected.height-dh)/2;
                    ectx.drawImage(image,dx,dy,dw,dh);
                    const actual=current.getContext('2d').getImageData(0,0,current.width,current.height).data;
                    const reference=ectx.getImageData(0,0,expected.width,expected.height).data;
                    let err=0,n=0;
                    for(let k=0;k<reference.length;k+=16){
                      for(let c=0;c<4;c++){err+=Math.abs(actual[k+c]-reference[k+c]);n++}
                    }
                    result.push({
                      id,source:[image.naturalWidth,image.naturalHeight],
                      drawn:[current.width,current.height],
                      delta:+(err/n).toFixed(3),
                      expectedMargins:[+dx.toFixed(2),+dy.toFixed(2)]
                    });
                  }
                  return result;
                },pack);
                artMetrics.push(...batch);
                await screenshot(matrix,'approved-world-pack-'+(pack+1)+'-full-scene');
              }
              const mismatches=artMetrics.filter(x=>x.error||x.delta>1||
                !x.source||x.expectedMargins.some(n=>n<-.001));
              note('visual-acceptance','ALL 50 game-rendered paintings match complete approved source images pixel-by-pixel',
                artMetrics.length===50&&mismatches.length===0&&matrixErrors.length===0,
                JSON.stringify({tested:artMetrics.length,mismatches,errors:matrixErrors}),'critical');
              fs.writeFileSync(path.join(reportDir,'approved-art-50.json'),
                JSON.stringify(artMetrics,null,2));
            }finally{await matrixContext.close()}
            // Cross-device passport: use an independently isolated browser context.
            await guest.evaluate(()=>{
              const key='edukass_stolbiki_player_profile_v42',p=JSON.parse(localStorage.getItem(key));
              p.ops.add.frontier=4;
              p.ops.add.skills.A1.attempts=8;
              p.ops.add.skills.A1.firstTry=6;
              localStorage.setItem(key,JSON.stringify(p));
              localStorage.setItem('edukass-columns-player-world','56');
              localStorage.setItem('edukass-columns-player-level','7');
            });
            await guest.reload({waitUntil:'domcontentloaded'});
            await guest.waitForFunction(()=>!!window.__EDUKASS_TEST__);
            const passport=await guest.evaluate(()=>window.__EDUKASS_TEST__.passport.make());
            const token=passport.split('#ekpass=')[1];
            note('competitor','Passport creates a personal recovery URL without a backend',
              token?.length>100&&token.length<17000&&token[0]==='g',
              'code size '+(token?.length||0)+' characters','critical');
            const secondDevice=await browser.newContext({
              viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'
            });
            try{
              const newPhone=await secondDevice.newPage();
              await newPhone.goto('http://127.0.0.1:'+port+'/proov/stolbiki-mosaic-7q4m9k/index.html#ekpass='+token,
                {waitUntil:'domcontentloaded',timeout:30000});
              await newPhone.waitForFunction(()=>!!window.__EDUKASS_TEST__);
              await newPhone.locator('#passportDialog').waitFor({state:'visible',timeout:10000});
              const pre=await newPhone.evaluate(()=>window.__EDUKASS_TEST__.getRealWorldProgress().tiles);
              note('competitor','Opening personal recovery link never overwrites progress silently',
                pre===50,'world before confirmation: '+pre,'critical');
              await screenshot(newPhone,'passport-confirm');
              await newPhone.locator('#passportRestore').click();
              const restored=await newPhone.evaluate(()=>({
                world:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
                frontier:window.__EDUKASS_TEST__.getState().profile.add.frontier
              }));
              note('competitor','Recovery restores complete world and mathematical levels on another device',
                restored.world===56&&restored.frontier==='A4',JSON.stringify(restored),'critical');
              await newPhone.reload({waitUntil:'domcontentloaded'});
              await newPhone.waitForFunction(()=>!!window.__EDUKASS_TEST__);
              const permanent=await newPhone.evaluate(()=>({
                world:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
                frontier:window.__EDUKASS_TEST__.getState().profile.add.frontier
              }));
              note('competitor','Transferred progress persists after a fresh browser reload',
                permanent.world===56&&permanent.frontier==='A4',JSON.stringify(permanent),'critical');
            }finally{await secondDevice.close()}
            // Owner's genuine first-ever 15-minute lesson: one-time reset must
            // erase this game's progress, start at stage 1 and not erase again
            // when a later page is refreshed. Other EDUKASS keys are untouched.
            await guest.evaluate(()=>{
              localStorage.setItem('edukass-columns-player-world','57');
              localStorage.setItem('edukass-columns-player-level','8');
              localStorage.setItem('edukass-other-game-sentinel','keep');
            });
            await guest.goto('http://127.0.0.1:'+port+'/proov/stolbiki-mosaic-7q4m9k/index.html?freshStart=1',
              {waitUntil:'domcontentloaded',timeout:30000});
            await guest.waitForFunction(()=>!!window.__EDUKASS_TEST__);
            const clean=await guest.evaluate(()=>{
              const state=window.__EDUKASS_TEST__.getState();
              return{
                frontiers:Object.values(state.profile).map(x=>x.frontier),
                world:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
                level:window.__EDUKASS_TEST__.getRealWorldProgress().level,
                intro:!document.querySelector('#introScreen').classList.contains('hidden'),
                resetUrlConsumed:!location.search.includes('freshStart'),
                otherSave:localStorage.getItem('edukass-other-game-sentinel'),
                skillsClean:(()=>{
                  const saved=JSON.parse(localStorage.getItem('edukass_stolbiki_player_profile_v42')||'null');
                  return !saved || Object.values(saved.ops).every(x=>Object.values(x.skills).every(s=>s.attempts===0));
                })()
              }
            });
            note('competitor','One-time fresh-entry URL erases all four math levels and saved world, not other games',
              clean.frontiers.every(x=>x.endsWith('1'))&&clean.world===50&&clean.level===1&&clean.intro&&
              clean.resetUrlConsumed&&clean.otherSave==='keep'&&clean.skillsClean,
              JSON.stringify(clean),'critical');
            await guest.evaluate(()=>{
              const stored=localStorage.getItem('edukass_stolbiki_player_profile_v42');
              const p=stored?JSON.parse(stored):window.EDUKASS_ADAPTIVE.createProfile();
              p.ops.add.frontier=3;
              localStorage.setItem('edukass_stolbiki_player_profile_v42',JSON.stringify(p));
              localStorage.setItem('edukass-columns-player-world','58');
            });
            await guest.reload({waitUntil:'domcontentloaded'});
            await guest.waitForFunction(()=>!!window.__EDUKASS_TEST__);
            const retainedAfterReset=await guest.evaluate(()=>({
              world:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
              add:window.__EDUKASS_TEST__.getState().profile.add.frontier,
              url:location.search
            }));
            note('competitor','After reset, reload retains newly earned progress instead of repeatedly deleting it',
              retainedAfterReset.world===58&&retainedAfterReset.add==='A3'&&!retainedAfterReset.url.includes('freshStart'),
              JSON.stringify(retainedAfterReset),'critical');
            await guest.goto('http://127.0.0.1:'+port+'/proov/stolbiki-mosaic-7q4m9k/index.html?freshStart=1',
              {waitUntil:'domcontentloaded',timeout:30000});
            await guest.waitForFunction(()=>!!window.__EDUKASS_TEST__);
            const repeatedLink=await guest.evaluate(()=>({
              world:window.__EDUKASS_TEST__.getRealWorldProgress().tiles,
              add:window.__EDUKASS_TEST__.getState().profile.add.frontier,
              consumed:!location.search.includes('freshStart')
            }));
            note('competitor','Owner reopening the ORIGINAL fresh-start chat link cannot destroy their new lesson',
              repeatedLink.world===58&&repeatedLink.add==='A3'&&repeatedLink.consumed,
              JSON.stringify(repeatedLink),'critical');
          }finally{await guest.close()}
          await page.locator('#openWorldView').click();
          await page.waitForTimeout(3900);
          const movie=await page.evaluate(()=>({
            label:document.querySelector('#protoWorldCount').textContent,
            replay:!!document.querySelector('#worldReplay')?.offsetParent,
            demo:!!document.querySelector('#worldDemo250'),
            back:!!document.querySelector('#worldViewBack')?.offsetParent
          }));
          note('competitor','Full world timelapse reaches saved state',movie.label.includes('250 / 550'),JSON.stringify(movie));
          note('competitor','World has one replay and no duplicate demo control',movie.replay&&!movie.demo);
          await screenshot(page,'world-timelapse-ended');
          await page.locator('#worldViewBack').click();
          await page.locator('#home').waitFor({state:'visible',timeout:8000});
          await page.locator('.op[data-op="div"]').click();
          await page.locator('#train').waitFor({state:'visible'});
          const initial=await page.evaluate(()=>window.__EDUKASS_TEST__.getState());
          note('competitor','Division opens with cell input',initial.current?.op==='div'&&initial.steps?.length>0,
            (initial.current?.a||0)+' : '+(initial.current?.b||0)+'; steps '+initial.steps?.length);
          const visible=await page.evaluate(()=>window.__EDUKASS_TEST__.getState().allMathVisible);
          note('competitor','Division written grid is inside paper',visible,'mobile viewport: 390px');
          const clock=await page.locator('#lessonTime').innerText();
          note('competitor','15-minute clock appears in exercise',clock==='15:00','clock '+clock);
          await screenshot(page,'division-'+width);
          // Real child-like interaction: tap the highlighted cell and use on-screen digit keys.
          const firstStep=await page.evaluate(()=>{
            const s=window.__EDUKASS_TEST__.getState();return s.steps[s.stepIndex]||null;
          });
          assert(firstStep && firstStep.target && firstStep.value, 'No recommended answer cell');
          const cell=page.locator('#mathWrap .entry[data-target="'+firstStep.target+'"]');
          await cell.click();
          for(const char of String(firstStep.value)) {
            const key=char==='•'?'dot':char;
            await page.locator('#pad button[data-key="'+key+'"]').click();
          }
          const accepted=await page.evaluate(step=>{
            const state=window.__EDUKASS_TEST__.getState();
            const entry=[...document.querySelectorAll('#mathWrap .entry')].find(x=>x.dataset.target===step.target);
            return {value:entry?.textContent,done:state.completed.includes(state.steps.findIndex(x=>x.target===step.target))};
          },firstStep);
          note('competitor','Physical cell tap and numeric keypad accept the answer',
            accepted.value===String(firstStep.value)&&accepted.done,
            'entered '+accepted.value+' in '+firstStep.target);
          // Simulate time ending during an exercise. The exercise must not be interrupted.
          await page.evaluate(()=>window.__EDUKASS_TEST__.setLessonElapsed(900000));
          const remains=await page.locator('#train').isVisible();
          note('competitor','Timer never interrupts an active written exercise',remains);
          // Complete every remaining written cell through actual interface taps.
          // No developer-only auto-solve calls: this catches real input and counting races.
          await page.waitForTimeout(160);
          let tapped=1;
          for(let turn=0;turn<90;turn++){
            if(!await page.locator('#train').isVisible())break;
            const state=await page.evaluate(()=>window.__EDUKASS_TEST__.getState());
            if(state.transitioning||state.assisting){await page.waitForTimeout(180);continue}
            const step=state.steps[state.stepIndex];
            if(!step){await page.waitForTimeout(180);continue}
            const entry=page.locator('#mathWrap .entry[data-target="'+step.target+'"]');
            if(!await entry.count())break;
            await entry.click({timeout:2000});
            for(const digit of String(step.value)){
              await page.locator('#pad button[data-key="'+(digit==='•'?'dot':digit)+'"]').click({timeout:2000});
            }
            tapped++;
            await page.waitForTimeout(145);
          }
          note('competitor','All written division cells can be entered using visible controls',tapped>=5,
            tapped+' cells tapped, not simulated');
          await page.locator('#lessonScreen').waitFor({state:'visible',timeout:6000});
          const after=await page.evaluate(()=>window.__EDUKASS_TEST__.getLesson());
          note('competitor','Exactly one completed exercise is counted once',after.solved===1,
            'solved count: '+after.solved,'critical');
          note('competitor','15-minute lesson finishes naturally after solved problem',after.finished===true);
          const lessons=await page.locator('#lessonSolvedCount').innerText();
          note('competitor','15-minute completion report shows solved count',Number(lessons)>=1,lessons);
          await page.locator('#lessonOpenList').click();
          const cards=await page.locator('.lesson-card').count();
          note('competitor','Child can review solved problems',cards>=1,'cards: '+cards);
          if(cards) {
            await page.locator('.lesson-card').first().click();
            const solution=await page.locator('#lessonDetailPaper .gcell').count();
            note('competitor','Review contains full written solution grid',solution>=1,'cells: '+solution);
            await screenshot(page,'review-'+width);
            await page.locator('#lessonRedo').click();
            const redo=await page.evaluate(()=>window.__EDUKASS_TEST__.getState().current?.op);
            note('competitor','Redo opens exercise again',redo==='div','operation: '+redo);
          }
        }
        note('competitor','No uncaught browser errors at '+width+'px',errors.length===0,errors.slice(0,4).join('; '));
      } catch(e) {
        note('competitor','Mobile scenario '+width+'px',false,e.stack?.slice(0,850)||String(e),'critical');
        await screenshot(page,'failure-'+width);
      } finally {await context.close()}
    }
  } catch(e) {
    note('competitor','Headless browser launch',false,e.stack||String(e),'critical');
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}

(async()=>{
  let math={};
  try{math=checkMethodist()}catch(e){note('methodist','Audit could not complete',false,e.stack||String(e),'critical')}
  await checkCompetitor();
  const failures=checks.filter(x=>!x.passed);
  const md=[
    '# EDUKASS — Prelaunch review: Methodologist + Competitor','',
    'Source: '+path.relative(root,pageFile),
    'Run: '+new Date().toISOString(),
    'Status: '+(failures.length?'NOT READY FOR LAUNCH':'AUTOMATED CHECKS PASSED'),
    'Passed '+(checks.length-failures.length)+' / '+checks.length+' checks.',
    '',
    '**Scope warning:** This is an automated mathematics and browser audit. A qualified Estonian teacher must still review the methods, and an AI UX critique requires separate visual review. Passing does not certify launch readiness.',
    '',
    '## Critical and major findings',
    ...(failures.length?failures.map(c=>'- ['+c.role+' / '+c.severity+'] '+c.name+': '+c.detail):['No automated failures.']),
    '',
    '## All checks',
    ...checks.map(c=>'- '+(c.passed?'PASS':'FAIL')+' — '+c.role+' — '+c.name+(c.detail?' — '+c.detail:'')),
    '',
    '## Evidence',
    'Mobile home screenshots, world-timelapse end, division exercise, completed exercise review, and failure screenshots appear in this artifact.',
    '',
    'This test changes no user accounts or published code; separate private browser contexts and local serving only.'
  ].join('\n');
  fs.writeFileSync(path.join(reportDir,'report.md'),md);
  fs.writeFileSync(path.join(reportDir,'results.json'),JSON.stringify({math,checks,failed:failures.length},null,2));
  if(failures.length) process.exitCode=1;
})().catch(e=>{console.error(e.stack||String(e));process.exitCode=1});
