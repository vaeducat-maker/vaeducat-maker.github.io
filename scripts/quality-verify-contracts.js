#!/usr/bin/env node
'use strict';
// Universal EDUKASS acceptance contracts. Other trainers add manifests.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const CONTRACTS=path.join(ROOT,'quality','contracts');
function blobSha(bytes){
  return crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
}
function readBuffer(file){return fs.readFileSync(path.resolve(ROOT,file))}
function contractGate(contract,{read=readBuffer}={}){
  const failures=[],detail=[],imageHashes=new Set(),allIds=new Set();
  const check=(condition,message)=>{if(!condition)failures.push(message)};
  check(contract.version===1,'Unsupported contract version: '+contract.product);
  check(typeof contract.page==='string'&&typeof contract.sceneDefinitions==='string','Contract is incomplete');
  check(Array.isArray(contract.collections)&&contract.collections.length===5,'Expected five approved collections');
  const sceneTotal=contract.collections?.reduce((sum,x)=>sum+x.sceneIds.length,0)||0;
  check(sceneTotal===contract.expectedSceneCount,'Wrong total scene count in contract');
  const page=read(contract.page).toString('utf8');
  const definitions=read(contract.sceneDefinitions).toString('utf8');
  const themes=definitions.slice(definitions.indexOf('const themes=['),definitions.indexOf('];\nconst r='));
  const definedIds=[...themes.matchAll(/id:'([^']+)'/g)].map(m=>m[1]);
  const expectedIds=contract.collections.flatMap(p=>p.sceneIds);
  check(definedIds.length===contract.expectedSceneCount,'Source world definition count is wrong');
  check(definedIds.join('|')===expectedIds.join('|'),'Scene identifiers/order no longer match approval');
  check(new Set(expectedIds).size===contract.expectedSceneCount,'Duplicate ids in approval contract');
  check(page.includes("window.EDUKASS_APPROVED_ART_COUNT=applied"),
    'Missing activation acknowledgement for approved art');
  check(page.includes("window.EDUKASS_VOXEL_ART_VERSION='3.0-approved-concept-art'"),
    'Approved art release-version marker missing or overwritten');
  const ref=(asset)=>new RegExp('<script\\s+src=["\\\']/?'+asset.replace(/[.*+?^\x24{}()|[\]\\]/g,'\\$&')+'["\\\']\\s*><\\/script>','g');
  const assets=[contract.sceneDefinitions,...contract.collections.map(x=>x.approvedBundle)];
  let previous=-1;
  for(const asset of assets){
    const occur=[...page.matchAll(ref(asset))];
    check(occur.length===1,asset+' must be loaded exactly once: found '+occur.length);
    if(occur.length===1){
      check(occur[0].index>previous,'Art scripts appear in unexpected order: '+asset);
      previous=occur[0].index;
    }
  }
  for(const pack of contract.collections){
    const bytes=read(pack.approvedBundle);
    const actualSha=blobSha(bytes);
    check(actualSha===pack.gitBlobSha,
      'APPROVED ART WAS MODIFIED: '+pack.approvedBundle+
      '. Expected Git blob '+pack.gitBlobSha+', got '+actualSha);
    const src=bytes.toString('utf8'),entries=[];
    // Each file is a frozen set of approved WebP data; never evaluate it.
    const re=/art\[("(?:\\.|[^"\\])*")\]=\{name:("(?:\\.|[^"\\])*"),src:"data:image\/webp;base64,([A-Za-z0-9+/=]+)"\}/g;
    for(const m of src.matchAll(re)){
      let id,name;
      try{id=JSON.parse(m[1]);name=JSON.parse(m[2])}catch{continue}
      const bytes=Buffer.from(m[3],'base64');
      check(bytes.length>=contract.imageMinBytes,id+' approved artwork is suspiciously small');
      check(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP',
        id+' image is not a valid WebP container');
      check(name.trim().length>0,id+' has no approved title');
      const digest=crypto.createHash('sha256').update(bytes).digest('hex');
      check(!imageHashes.has(digest),id+' duplicates another approved painting');
      imageHashes.add(digest);allIds.add(id);entries.push(id);
    }
    check(entries.length===10,pack.approvedBundle+' has '+entries.length+' paintings, not 10');
    check(entries.slice().sort().join('|')===pack.sceneIds.slice().sort().join('|'),
      pack.approvedBundle+' does not contain the ten approved scene ids');
    detail.push({pack:pack.number,scenes:entries.length,blobMatches:actualSha===pack.gitBlobSha});
  }
  check(allIds.size===contract.expectedSceneCount,
    'Only '+allIds.size+' unique approved scenes were found');
  return {product:contract.product,passed:failures.length===0,scenes:allIds.size,packs:detail,failures};
}
function main(){
  const files=fs.readdirSync(CONTRACTS).filter(x=>x.endsWith('.json')).sort();
  assert(files.length,'No approved quality contracts');
  const results=[];
  for(const name of files){
    const contract=JSON.parse(fs.readFileSync(path.join(CONTRACTS,name),'utf8'));
    const r=contractGate(contract);results.push(r);
    console.log((r.passed?'PASS':'FAIL')+' approved assets: '+r.product+' '+r.scenes+' scenes / '+r.packs.length+' packs');
    for(const err of r.failures)console.error('  FAIL: '+err);
  }
  const output=path.join(ROOT,'artifacts','edukass-quality');
  fs.mkdirSync(output,{recursive:true});
  const passed=results.every(x=>x.passed);
  fs.writeFileSync(path.join(output,'contracts.json'),JSON.stringify({passed,results},null,2));
  fs.writeFileSync(path.join(output,'contracts.md'),
    '# EDUKASS approved source audit\n\n'+results.map(r=>
    (r.passed?'✅':'❌')+' '+r.product+': '+r.scenes+' verified, '+r.packs.length+
      ' packages\n'+r.failures.map(x=>'- '+x).join('\n')).join('\n\n')+'\n');
  if(!passed)process.exitCode=1;
}
if(require.main===module)main();
module.exports={blobSha,contractGate};
