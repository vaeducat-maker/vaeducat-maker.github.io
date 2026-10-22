#!/usr/bin/env node
'use strict';
// EDUKASS educational release gate. The judge is intentionally independent:
// it MUST NOT import the game's unhelpfulRoutine() or E.validateSkill() as
// evidence of educational value. The actual production generator is extracted
// and executed unchanged, rather than a copied toy generator.
// Every deployment runs this fast audit BEFORE publishing to Cloudflare.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'proov/stolbiki-mosaic-7q4m9k/index.html'),'utf8');
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert(scripts.length>=3,'Production game no longer contains expected engine and adaptive scripts');
// Select scripts by their capabilities, never hard-coded array positions.
// Adding a new visual-art script must not break the independent math audit.
const engineScript=scripts.find(s=>s.includes('root.EDUKASS_MATH_ENGINE=api'));
const adaptiveScript=scripts.find(s=>s.includes('root.EDUKASS_ADAPTIVE=api'));
const gameScript=scripts.find(s=>s.includes('  // Pedagogical difficulty matters more than random-looking digits.')&&s.includes('  function nextTask(){'));
assert(engineScript&&adaptiveScript&&gameScript,'Cannot locate the original production math, adaptive or player scripts');
const context={module:{exports:{}},console};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(engineScript,context,{timeout:10000});
vm.runInContext(adaptiveScript,context,{timeout:10000});
const E=context.EDUKASS_MATH_ENGINE,A=context.EDUKASS_ADAPTIVE;
assert(E&&A,'Unable to load real production math and adaptive engines');
// Pull REAL task selector, including repetition memory, from the release build.
const begin=gameScript.indexOf('  // Pedagogical difficulty matters more than random-looking digits.');
const end=gameScript.indexOf('  function nextTask(){',begin);
assert(begin>=0&&end>begin,'Cannot find real player task-selection implementation; release blocked');
context.E=E;
vm.runInContext(gameScript.slice(begin,end)+'\nthis.productionTask=generateFreshTask;',context,{timeout:10000});
assert.equal(typeof context.productionTask,'function');

function random(seed){let state=seed>>>0;return()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296};}
function rubric(t){
  const {op,a,b,skill}=t,level=Number(skill.slice(1));
  const text=String(a),repeated=text.length>1&&[...text].every(d=>d===text[0]);
  if(op==='div'&&(a%10===0||b%10===0))return 'trailing-zero division shortcut';
  if(op==='mul'&&(a%10===0||b%10===0))return 'trailing-zero multiplication shortcut';
  if(op==='div'&&level<=6){
    if(repeated)return 'digit-clone shortcut (11,22,33,44...)';
    if(a%10===0)return 'round-ten division solvable by inspection';
    if(a/b===11||a/b===111)return 'multiplication by eleven shortcut';
    if(a%b!==0)return 'unexpected remainder in early division';
  }
  if(op==='mul'&&level<=5&&(a%10===0||b===1||b===2))return 'routine head-math multiplication';
  if(op==='sub'&&level<=4&&(b<10||a-b<12||a%10===0))return 'routine head-math subtraction';
  if(op==='add'&&level<=3&&(a%10===0||b%10===0||a===b))return 'routine head-math addition';
  return '';
}

let examples=0,lessons=0;
const failures=[],report={tested:0,lessons:[],negativeControls:[],failureSamples:[]};
const fail=(msg)=>{if(failures.length<45)failures.push(msg)};
const negative=[
  {op:'div',skill:'D1',a:66,b:6},{op:'div',skill:'D1',a:77,b:7},
  {op:'div',skill:'D1',a:88,b:8},{op:'div',skill:'D1',a:44,b:2},
  {op:'div',skill:'D1',a:80,b:2},{op:'div',skill:'D2',a:80,b:5},
  {op:'div',skill:'D1',a:60,b:6},{op:'div',skill:'D11',a:330,b:30},
  {op:'div',skill:'D13',a:660,b:60},{op:'div',skill:'D14',a:23040,b:60},
  {op:'div',skill:'D16',a:17070,b:60},
  {op:'mul',skill:'M1',a:80,b:7},{op:'mul',skill:'M3',a:930,b:3},
  {op:'mul',skill:'M4',a:750,b:4},{op:'mul',skill:'M6',a:7570,b:7},
  {op:'mul',skill:'M7',a:4110,b:8},{op:'mul',skill:'M14',a:615,b:9090},
  {op:'div',skill:'D1',a:77,b:11},{op:'mul',skill:'M1',a:20,b:4},
  {op:'sub',skill:'S1',a:89,b:4},{op:'add',skill:'A1',a:40,b:20}
];
for(const x of negative){
  const reason=rubric(x);
  report.negativeControls.push({expression:x.a+':'+x.b,skill:x.skill,reason});
  if(!reason)fail('The independent critic FAILED to catch known bad example: '+JSON.stringify(x));
}
for(const x of negative.filter(t=>t.op==='div'&&(t.a%10===0||t.b%10===0))){
  const task={...x,meta:E.analyzeDivision(x.a,x.b)};
  if(E.validateSkill(task))fail('Engine validator ACCEPTS forbidden trailing-zero division '+x.skill+' '+x.a+':'+x.b);
}
for(const x of negative.filter(t=>t.op==='mul'&&(t.a%10===0||t.b%10===0))){
  const task={...x,meta:E.analyzeMultiplication(x.a,x.b)};
  if(E.validateSkill(task))fail('Engine validator ACCEPTS forbidden trailing-zero multiplication '+x.skill+' '+x.a+'×'+x.b);
}
for(const skill of E.skillList()){
  for(let i=0;i<120;i++){
    const generated=E.generateSkill(skill,(i*214013+skill.charCodeAt(0)*973+Number(skill.slice(1))*29791+119392)>>>0);
    examples++;
    if(!E.validateSkill(generated))fail('Broken arithmetic generator '+skill+' '+generated.a+':'+generated.b);
  }
}
for(const type of ['fluent','struggling','uneven']){
  for(let trial=0;trial<24;trial++){
    const rng=random(30000+trial*1019),state=A.createProfile(),session=A.createSession(state,'mix',rng,Date.now());
    const all=[],limit=104;
    for(let i=0;i<limit;i++){
      const pick=A.nextAssignment(session),seed=(100000+trial*74381+i*179+type.length*1019)>>>0;
      const t=context.productionTask(pick.skill,seed),why=rubric(t);
      if(why)fail(type+' lesson '+trial+' item '+(i+1)+' '+pick.skill+' '+t.a+':'+t.b+' — '+why);
      all.push({op:pick.op,skill:pick.skill,a:t.a,b:t.b});
      const firstTry=type==='fluent'||(type==='uneven'&&['add','sub'].includes(pick.op))||
        (type==='struggling'&&i%7===0);
      A.recordResult(session,pick,{firstTry,errors:firstTry?0:1,assisted:!firstTry,ms:12000});
    }
    lessons++;
    const levels={};
    for(const op of ['add','sub','mul','div']){
      const items=all.filter(x=>x.op===op),stages=[...new Set(items.map(x=>x.skill))];
      levels[op]=stages;
      if(type==='fluent'){
        const starters=items.filter(x=>Number(x.skill.slice(1))===1);
        if(starters.length>2)fail('Starter stage lasted '+starters.length+' tasks in '+op+' fluent scenario '+trial);
        if(stages.length<5)fail('No timely advancement for '+op+' in fluent scenario '+trial+': '+stages.join(','));
      }
      // Exact duplicates are always pointless within 20 similar problems.
      for(let i=0;i<items.length;i++)for(let j=Math.max(0,i-17);j<i;j++){
        if(items[i].a===items[j].a&&items[i].b===items[j].b)
          fail('Repeated '+op+' exact problem '+items[i].a+':'+items[i].b+' within '+(i-j)+' rounds');
      }
    }
    if(type==='fluent'){
      const advanced=all.filter(x=>Number(x.skill.slice(1))>=4).length;
      if(advanced<all.length*.62)fail('Only '+advanced+'/'+all.length+' tasks reach meaningful fourth-or-higher skills');
      const lateFirst=all.slice(32).filter(x=>Number(x.skill.slice(1))===1).length;
      if(lateFirst)fail('Simple stage 1 tasks return late in fluent lesson: '+lateFirst);
    }
    if(trial<4)report.lessons.push({type,trial,levels,
      early:all.slice(0,25).map(x=>x.skill+' '+x.a+({add:'+',sub:'-',mul:'×',div:':'}[x.op])+x.b),
      late:all.slice(-18).map(x=>x.skill+' '+x.a+({add:'+',sub:'-',mul:'×',div:':'}[x.op])+x.b)});
  }
}
report.tested=examples;
report.lessonCount=lessons;
report.lessonTasks=lessons*104;
report.failures=failures;
const evidence=path.join(root,'artifacts/stolbiki-pedagogy');
fs.mkdirSync(evidence,{recursive:true});
fs.writeFileSync(path.join(evidence,'report.json'),JSON.stringify(report,null,2));
let summary=[
  '# EDUKASS independent pedagogical gate',
  'Source: REAL player release. Critic: separate rulebook.',
  'Mathematical samples: '+examples,
  'Simulated 15-minute-like sessions: '+lessons,
  'Simulated lesson tasks: '+lessons*104,
  'Negative examples caught: '+report.negativeControls.filter(t=>t.reason).length+'/'+negative.length,
  'Failures: '+failures.length,
  '',...failures.slice(0,22).map(t=>'- '+t)
].join('\n');
fs.writeFileSync(path.join(evidence,'report.md'),summary);
console.log(summary);
if(failures.length)process.exitCode=1;