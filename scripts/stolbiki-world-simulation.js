#!/usr/bin/env node
'use strict';
/*
 EDUCASS Stolbiki: independent release check for educational reward economy.
 Profiles: fluent, typical and struggling. This is a mathematical simulation,
 not a claim of validated classroom effectiveness.
*/
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'proov/stolbiki-mosaic-7q4m9k/index.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
assert(scripts.length===3,'Release test requires real game scripts');
const ctx={module:{exports:{}},console};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(scripts[0],ctx,{timeout:10000});vm.runInContext(scripts[1],ctx,{timeout:10000});
const E=ctx.EDUKASS_MATH_ENGINE,A=ctx.EDUKASS_ADAPTIVE;
assert(E&&A,'Game mathematical engine unavailable');
const first=scripts[2].indexOf('  const TOTAL_LEARNING_SKILLS='),last=scripts[2].indexOf("  const WORLD_HISTORY_KEY=",first);
assert(first>=0&&last>first,'World reward policy not found in actual player');
ctx.A=A;
vm.runInContext(scripts[2].slice(first,last)+'\nthis.measureWorld=worldEvidence;',ctx,{timeout:10000});
const evidence=ctx.measureWorld;
const total=Object.values(A.META).reduce((n,x)=>n+x.max,0);
assert.equal(total,52,'Unexpected learning syllabus change');

function seedRandom(seed){let x=seed>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296}}
function confirmSkills(p,n){
  let i=0;
  for(const st of Object.values(p.ops))for(const s of Object.values(st.skills)){
    if(i++>=n)continue;
    Object.assign(s,{mastered:true,attempts:4,firstTry:4,assisted:0,reviewStage:3,cleanStreak:4});
  }
}
const blank=A.createProfile();
assert.equal(evidence(blank).target,50,'New pupil should begin at 50');
for(let n=0;n<=52;n++){
  const p=A.createProfile();confirmSkills(p,n);
  const got=evidence(p),expected=50+Math.floor(500*n/52);
  assert.equal(got.verified,n,'Verified skill counting wrong at '+n);
  assert.equal(got.target,expected,'Mastery must let fast pupil reach all 550 pieces at '+n);
  if(n>0)assert(got.target>50,'Verified skill must open actual world pieces');
}
const intro=A.createProfile();intro.ops.add.skills.A1=Object.assign(intro.ops.add.skills.A1,{
  attempts:2,firstTry:2,reviewStage:2,mastered:true
});
assert.equal(evidence(intro).verified,0,'Two fast answers must not award mastery bonus');
const oneOperation=A.createProfile();
for(const s of Object.values(oneOperation.ops.div.skills))Object.assign(s,{attempts:4,firstTry:4,reviewStage:3,mastered:true});
assert.equal(evidence(oneOperation).verified,16,'Concentrated division mastery should count');
assert(evidence(oneOperation).target>150,'Pupil concentrating on division deserves significant world progress');
assert(evidence(oneOperation).target<550,'Single operation must not claim entire four-operation curriculum');
const practiced=A.createProfile();practiced.ops.add.skills.A1.attempts=25;
assert(evidence(practiced).target>=55,'Five completed tasks must yield one tile');
assert.equal(evidence(practiced).verified,0,'Attempts alone do not verify competence');

const types=[
 {name:'fluent',tasks:40,accuracy:(level)=>level>=11?0.965:0.99,speed:16000},
 {name:'typical',tasks:30,accuracy:(level)=>level>=9?0.83:level>=5?0.87:0.93,speed:26000},
 {name:'struggling',tasks:19,accuracy:(level)=>level>=8?0.62:level>=4?0.70:0.83,speed:49000}
];
const summary=[];
for(const type of types){
 const rng=seedRandom(type.name.length*1000+297),p=A.createProfile();
 let solved=0,day=0;
 const daily=[];
 for(day=0;day<96;day++){
  const now=Date.UTC(2026,9,22)+day*86400000;
  const ss=A.createSession(p,'mix',rng,now);
  for(let i=0;i<type.tasks;i++){
    const assignment=A.nextAssignment(ss);
    const level=Number(assignment.skill.slice(1));
    const firstTry=rng()<type.accuracy(level);
    A.recordResult(ss,assignment,{firstTry,errors:firstTry?0:1,assisted:!firstTry,ms:type.speed});
    solved++;
  }
  const w=evidence(p);
  daily.push({day:day+1,solved,verified:w.verified,stagePassed:w.provisional,tiles:w.target,
    masteryTile:50+w.achievement,practiceTile:50+w.practice,stages:Object.fromEntries(Object.entries(p.ops).map(([op,v])=>[op,v.frontier]))});
  if(w.verified===total)break;
 }
 const last=daily[daily.length-1];
 for(let i=1;i<daily.length;i++){
   assert(daily[i].tiles>=daily[i-1].tiles,'World must never shrink between lessons');
   assert(daily[i].verified>=daily[i-1].verified,'Verified skills cannot disappear with normal results');
 }
 summary.push({profile:type.name,lessons:daily.length,simulatedSolved:solved,verified:last.verified,unlocked:last.tiles,
   stages:last.stages,milestones:[1,3,7,14,28,56,96].filter(d=>d<=daily.length).map(d=>daily[d-1]),last});
}
assert(summary[0].verified===52,'Fluent pupil should eventually verify every skill, not grind indefinitely');
assert(summary[0].unlocked===550,'Fluent pupil MUST complete the picture at verified mastery');
assert(summary[0].simulatedSolved<2500,'Fluent child must NOT solve 2500 problems before the full picture');
assert(summary[1].unlocked>200,'Typical pupil must see a growing world');
assert(summary[2].unlocked>100,'Struggling pupil must see visible progress while learning');
const report={purpose:'Pedagogical skill verification vs. world completion',totalSkills:total,
 rewardRule:'1 tile/5 completed tasks; verified stage contributes floor(500*verified/52) unlocked tiles; choose larger earned path; never revoke saved pieces',
 verification:'Mastered stage + at least 3 independent first tries + at least one successful scheduled review (reviewStage >=3) + 70% independent accuracy',
profiles:summary};
const directory=path.join(root,'artifacts/stolbiki-world-balance');
fs.mkdirSync(directory,{recursive:true});
fs.writeFileSync(path.join(directory,'simulation.json'),JSON.stringify(report,null,2));
console.log('EDUKASS WORLD SIMULATION PASS');
for(const r of summary)console.log(r.profile+': '+r.lessons+' sessions / '+r.simulatedSolved+' attempted, '+r.verified+'/52 verified, '+r.unlocked+'/550 pieces');
console.log('Fast child finishes without 2500 attempts; starting/practice/one-operation cases validated.');
