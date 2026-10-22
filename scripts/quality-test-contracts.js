#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {contractGate}=require('./quality-verify-contracts');
const root=path.resolve(__dirname,'..');
const c=JSON.parse(fs.readFileSync(path.join(root,'quality/contracts/stolbiki-worlds.json'),'utf8'));
const read=f=>fs.readFileSync(path.join(root,f));
const normal=contractGate(c,{read});
assert(normal.passed,'Baseline approved images contract is broken: '+normal.failures.join('; '));
const test=(name,change,expected)=>{
  const map=new Map([[change.file,change.buffer]]);
  const result=contractGate(c,{read:f=>map.get(f)||read(f)});
  assert(!result.passed,'NEGATIVE CONTROL NOT CAUGHT: '+name);
  assert(result.failures.some(s=>s.includes(expected)),
    name+' detected unexpected error, not '+expected+': '+result.failures.join('; '));
  console.log('PASS negative control: '+name);
};
const asset=c.collections[0].approvedBundle;
const src=read(asset).toString('utf8');
test('approved artwork bundle tampered',
  {file:asset,buffer:Buffer.from(src.replace('Taevalinn','Taevalinn-X'))},
  'APPROVED ART WAS MODIFIED');
const page=read(c.page).toString('utf8');
test('approved image pack quietly removed',
  {file:c.page,buffer:Buffer.from(page.replace(
    '<script src="/'+asset+'"></script>',''))},
  'must be loaded exactly once');
const defs=read(c.sceneDefinitions).toString('utf8');
test('source world changed after approval',
  {file:c.sceneDefinitions,buffer:Buffer.from(defs.replace("id:'egiptus'","id:'unapproved'"))},
  'Scene identifiers/order');
console.log('QUALITY CONTRACT NEGATIVE CONTROLS: PASS');
