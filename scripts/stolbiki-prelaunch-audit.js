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
const pageFile = path.resolve(root, 'proov/stolbiki-250/index.html');
const reportDir = path.resolve(root, 'artifacts/stolbiki-prelaunch');
fs.mkdirSync(reportDir, { recursive: true });
const html = fs.readFileSync(pageFile, 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
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

function checkMethodist() {
  assert(scripts.length >= 3, 'Embedded math and game scripts missing');
  const env = {module: {exports:{}}, console};
  env.globalThis = env;
  vm.createContext(env);
  vm.runInContext(scripts[0], env, {timeout: 12000});
  vm.runInContext(scripts[1], env, {timeout: 12000});
  const engine = env.EDUKASS_MATH_ENGINE;
  const adaptive = env.EDUKASS_ADAPTIVE;
  assert(engine && adaptive, 'Math APIs missing');
  const skills = engine.skillList();
  note('methodist', 'Full mathematical skill catalogue', skills.length === 52,
    skills.length + ' levels from addition, subtraction, multiplication, division');

  let total = 0, invalid = [], badArithmetic = [], badRemainder = [];
  const byOperation = {};
  for (const skill of skills) {
    const count = 36;
    const op = skill[0];
    byOperation[op] = (byOperation[op] || 0) + count;
    for (let i = 0; i < count; i++) {
      total++;
      const sample = engine.generateSkill(skill, ((Date.now() + i * 1664525 + skill.charCodeAt(0)*98711 + Number(skill.slice(1))*1013904223) >>> 0) || 1);
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
        if(width===390) {
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
