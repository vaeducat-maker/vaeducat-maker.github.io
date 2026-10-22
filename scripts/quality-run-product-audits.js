#!/usr/bin/env node
'use strict';
// Do not hardcode a favored game into the shared release gate.
// Every independently accepted product contributes its own result audit.
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'quality/product-registry.json'),'utf8'));
const products=manifest.products.filter(p=>p.acceptance==='verified');
if(!products.length)throw Error('No EDUKASS product has an independent result audit');
let bad=0;
for(const p of products){
  if(!p.visualAudit)throw Error(p.id+' claims verified without a result-audit script');
  console.log('\n### Real outcome audit: '+p.id+' -> '+p.visualAudit+' ###');
  const result=cp.spawnSync(process.execPath,[p.visualAudit],{
    cwd:root,env:process.env,stdio:'inherit',timeout:25*60*1000
  });
  if(result.error||result.status!==0){
    bad++;console.error('BLOCK '+p.id+': '+(result.error?.message||'exit '+result.status));
  }else console.log('PASS independent result audit: '+p.id);
}
if(bad)process.exitCode=1;
