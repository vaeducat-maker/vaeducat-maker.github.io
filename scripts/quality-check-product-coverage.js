#!/usr/bin/env node
'use strict';
// EDUKASS coverage watchdog. A product without its own independently
// executed acceptance audit is NOT allowed to slip into a release.
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const registryPath=path.join(ROOT,'quality/product-registry.json');
const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
const candidateRoots=new Set(['games','materials','proov']);

function productPrefix(file){
  const parts=String(file).replaceAll('\\','/').split('/');
  if(parts.length<3||!candidateRoots.has(parts[0]))return null;
  return parts[0]+'/'+parts[1]+'/';
}
function validateRegistry(data=registry,{exists=fs.existsSync,read=p=>fs.readFileSync(p,'utf8')}={}){
  const violations=[];
  const check=(good,message)=>{if(!good)violations.push(message)};
  check(data?.schemaVersion===1,'Product registry schema must be version 1');
  check(Array.isArray(data?.products)&&data.products.length>0,'Product registry must list products');
  const seen=new Set(),ids=new Set();
  for(const p of data?.products||[]){
    check(typeof p.id==='string'&&p.id.length>3,'Product missing stable id');
    if(ids.has(p.id))violations.push('Duplicate product id: '+p.id);
    ids.add(p.id);
    check(typeof p.pathPrefix==='string'&&!!productPrefix(p.pathPrefix+'index.html')&&
      p.pathPrefix===productPrefix(p.pathPrefix+'index.html'),
      'Invalid product scope: '+p.pathPrefix);
    if(seen.has(p.pathPrefix))violations.push('Duplicate product scope: '+p.pathPrefix);
    seen.add(p.pathPrefix);
    check(['verified','requires-individual-audit'].includes(p.acceptance),
      p.id+': missing explicit acceptance status');
    if(p.acceptance==='verified'){
      check(typeof p.sourceContract==='string',p.id+': missing approved source contract');
      check(typeof p.visualAudit==='string',p.id+': missing real result audit');
      const contractFile=path.resolve(ROOT,p.sourceContract||'INVALID');
      const auditFile=path.resolve(ROOT,p.visualAudit||'INVALID');
      const inside=abs=>abs.startsWith(ROOT+path.sep);
      check(inside(contractFile)&&exists(contractFile),p.id+': approved source contract not found');
      check(inside(auditFile)&&exists(auditFile),p.id+': independent result audit not found');
      if(inside(contractFile)&&exists(contractFile)){
        try {
          const contract=JSON.parse(read(contractFile));
          check(contract.page===p.pathPrefix+'index.html',
            p.id+': source contract does not describe this product');
        }catch(e){violations.push(p.id+': cannot read approved source contract: '+e.message)}
      }
      if(inside(auditFile)&&exists(auditFile)){
        const text=read(auditFile);
        check(text.includes(p.pathPrefix+'index.html'),
          p.id+': result audit does not reference product page');
      }
    }
  }
  return violations;
}
function checkCoverage(files,{data=registry,inventory=[]}={}){
  const violations=validateRegistry(data);
  const byPrefix=new Map((data.products||[]).map(p=>[p.pathPrefix,p]));
  const watched=new Set(),untested=new Set();
  for(const file of inventory){
    const prefix=productPrefix(file);
    if(prefix&&!byPrefix.has(prefix))violations.push('Unregistered EDUKASS product exists: '+prefix);
  }
  for(const file of files){
    const prefix=productPrefix(file);
    if(prefix){
      const p=byPrefix.get(prefix);
      if(!p){violations.push('Changed unregistered product: '+prefix);continue}
      watched.add(p.id);
      if(p.acceptance!=='verified'){
        untested.add(p.id);
        violations.push('Cannot release untested '+p.id+' ('+file+'). Register approved source and independent result audit first.');
      }
      continue;
    }
    // Unowned shared assets can silently change what is shown in MANY
    // products. Require explicit mapping to the affected product(s) first.
    if(/^(assets\/|downloads\/|data\/catalog\.json$|(?:home\.css|home-refresh\.js|styles\.css|index\.html)$)/.test(file)){
      violations.push('Shared public asset/page changed without owner-scoped result contract: '+file);
    }
  }
  return {passed:violations.length===0,changedFiles:files.length,
    verifiedProducts:[...watched].sort(),untestedProducts:[...untested].sort(),violations:[...new Set(violations)]};
}
function git(args){
  return cp.execFileSync('git',args,{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});
}
function changedFiles(){
  const eventFile=process.env.GITHUB_EVENT_PATH;
  let base=null;
  if(eventFile&&fs.existsSync(eventFile)){
    try{
      const e=JSON.parse(fs.readFileSync(eventFile,'utf8'));
      if(/^[0-9a-f]{40}$/.test(e.before||'')&&!/^0{40}$/.test(e.before))base=e.before;
    }catch{}
  }
  if(!base&&process.env.GITHUB_BASE_REF){
    base='origin/'+process.env.GITHUB_BASE_REF;
  }
  if(!base)base='HEAD^';
  const changed=git(['diff','--name-only','--diff-filter=ACMRD',base,'HEAD']);
  return changed.trim().split('\n').filter(Boolean);
}
function inventoryFiles(){
  return git(['ls-files','games','materials','proov']).trim().split('\n').filter(Boolean);
}
function main(){
  const flags=new Set(process.argv.slice(2));
  const files=flags.has('--all')?[]:changedFiles();
  const report=checkCoverage(files,{inventory:inventoryFiles()});
  const out=path.join(ROOT,'artifacts/edukass-quality');
  fs.mkdirSync(out,{recursive:true});
  const summary={
    ...report,registryCount:registry.products.length,
    individuallyAuditedCount:registry.products.filter(p=>p.acceptance==='verified').length,
    coverageNotes:'Non-audited legacy products are inventoried, not certified. Changes are blocked until individual audit exists.'
  };
  fs.writeFileSync(path.join(out,'product-coverage.json'),JSON.stringify(summary,null,2)+'\n');
  const md='# EDUKASS product scope coverage\n\n'+
    'Registered products: '+summary.registryCount+'\n\n'+
    'Individually audited: '+summary.individuallyAuditedCount+'\n\n'+
    'Changed product(s) with full audit: '+(report.verifiedProducts.join(', ')||'(none)')+'\n\n'+
    (report.passed?'**PASS**':'**BLOCKED**')+'\n\n'+
    report.violations.map(x=>'- '+x).join('\n')+'\n';
  fs.writeFileSync(path.join(out,'product-coverage.md'),md);
  process.stdout.write(md);
  if(!report.passed)process.exitCode=1;
}
if(require.main===module)main();
module.exports={productPrefix,validateRegistry,checkCoverage};
