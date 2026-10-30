#!/usr/bin/env node
'use strict';
// Separate, deterministic review-mode audit using the ACTUAL 52-skill adaptive engine.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
const R=require('../proov/stolbiki-mosaic-7q4m9k/review-mode.js');
const html=fs.readFileSync(path.join(ROOT,'proov/stolbiki-mosaic-7q4m9k/index.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
const engine=scripts.find(x=>x.includes('root.EDUKASS_MATH_ENGINE=api'));
const adaptive=scripts.find(x=>x.includes('root.EDUKASS_ADAPTIVE=api'));
assert(engine&&adaptive,'Cannot find the existing math and adaptive scripts');
const context={console};context.globalThis=context;vm.createContext(context);
vm.runInContext(engine,context,{timeout:10000});
vm.runInContext(adaptive,context,{timeout:10000});
const A=context.EDUKASS_ADAPTIVE;
const ops=[['add','A',10],['sub','S',12],['mul','M',14],['div','D',16]];
const profile=A.createProfile();
assert.equal(R.masteredCount(profile),0);
assert.equal(R.isComplete(profile),false);
for(const [op,prefix,max] of ops){
  assert.equal(A.META[op].max,max);
  for(let n=1;n<=max;n++){
    const sk=profile.ops[op].skills[prefix+n];
    Object.assign(sk,{mastered:true,verified:true,attempts:8,firstTry:8,
      cleanStreak:5,reviewStage:4,nextReviewAt:Date.now()+86400000});
  }
  profile.ops[op].frontier=max;
}
assert.equal(R.masteredCount(profile),52);
assert.equal(R.isComplete(profile),true);
profile.ops.div.skills.D16.mastered=false;
Object.assign(profile.ops.div.skills.D16,{attempts:3,firstTry:3,cleanStreak:1});
assert.equal(R.masteredCount(profile),51);
assert.equal(R.isComplete(profile),false);
assert.throws(()=>R.nextAssignment({profile,rng:()=>0.5,index:0,retryQueue:[]}),/locked/);
// The actual adaptive method records a child's independent final D16 solution.
const before=A.createSession(profile,'div',()=>0.41,Date.now());
A.recordResult(before,{op:'div',skill:'D16',index:1},
  {firstTry:true,errors:0,ms:12000,assisted:false});
assert.equal(profile.ops.div.skills.D16.mastered,true);
assert.equal(R.isComplete(profile),true);
let seed=12345;
const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const session=A.createSession(profile,'mix',rng,Date.now());
const appearances=new Map(),counts={add:0,sub:0,mul:0,div:0};
for(let i=0;i<5200;i++){
  const a=R.nextAssignment(session);
  assert.equal(a.index,i+1);
  assert.equal(a.reason,'mixed-review');
  assert.equal(a.op,ops[(i+session.profile.sessionNo)%4][0]);
  assert.equal(profile.ops[a.op].skills[a.skill]?.mastered,true);
  appearances.set(a.skill,(appearances.get(a.skill)||0)+1);
  counts[a.op]++;
}
assert.equal(appearances.size,52,'All 52 skill levels must participate');
assert.deepEqual(counts,{add:1300,sub:1300,mul:1300,div:1300});
for(const [op,prefix,max] of ops){
  assert(appearances.get(prefix+max)>appearances.get(prefix+'1'),
    'Advanced '+prefix+' should appear more frequently than trivial level 1');
}
const weakProfile=A.createProfile();
for(const [op,prefix,max] of ops)for(let n=1;n<=max;n++){
  Object.assign(weakProfile.ops[op].skills[prefix+n],{mastered:true,verified:true,
    attempts:12,firstTry:12,cleanStreak:9,reviewStage:4,nextReviewAt:Date.now()+7*86400000});
}
Object.assign(weakProfile.ops.div.skills.D2,{verified:false,attempts:12,
  firstTry:4,errors:8,cleanStreak:0,reviewStage:1,nextReviewAt:Date.now()-1000});
const weakSession=A.createSession(weakProfile,'mix',rng,Date.now());
let weak=0,strong=0;
for(let i=0;i<2400;i++){
  const a=R.nextAssignment(weakSession);
  if(a.skill==='D2')weak++;
  if(a.skill==='D16')strong++;
}
assert(weak>strong*3,'Overdue/weak D2 should strongly outweigh fluent D16: '+weak+' vs '+strong);
const retrySession=A.createSession(profile,'mix',()=>0.5,Date.now());
retrySession.retryQueue.push({op:'div',skill:'D4',dueAt:0});
let ret;
for(let i=0;i<4;i++){const a=R.nextAssignment(retrySession);if(a.op==='div')ret=a}
assert.equal(ret.skill,'D4');assert.equal(ret.reason,'retry');
assert.equal(retrySession.retryQueue.length,0);
assert.equal(R.masteredCount(A.createProfile()),0);
console.log('PASS Kordamine: 51/52 locked, real final D16 independent mastery unlocks 52/52');
console.log('PASS: 5,200 mixed assignments sample all 52 levels and evenly rotate 4 operations');
console.log('PASS: overdue/weak skills prioritized, retries preserved, new pupil unaffected');
