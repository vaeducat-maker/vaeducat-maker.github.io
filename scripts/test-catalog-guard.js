#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {validateCatalog}=require('./catalog-guard');
const root=path.resolve(__dirname,'..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'releases/catalog-v121.json'),'utf8'));
const current=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8'));

let result=validateCatalog(current,baseline,{checkFiles:false});
assert.equal(result.errors.length,0,'Valid catalog must pass.');

const missing=structuredClone(current);
missing.products=missing.products.filter(p=>p.id!=='tunniplaan');
result=validateCatalog(missing,baseline,{checkFiles:false});
assert.ok(result.errors.some(e=>e.includes('tunniplaan')),'Silent deletion must be blocked.');

const moved=structuredClone(current);
moved.products.find(p=>p.id==='korrutustabel').page='/materials/new-korrutustabel/';
result=validateCatalog(moved,baseline,{checkFiles:false});
assert.ok(result.errors.some(e=>e.includes('Изменён постоянный URL')),'Permanent URL change must be blocked.');

const badArchive=structuredClone(current);
const p=badArchive.products.find(p=>p.id==='loika-kosmoserada');
p.status='archived';
result=validateCatalog(badArchive,baseline,{checkFiles:false});
assert.ok(result.errors.some(e=>e.includes('ownerApproval')),'Archive without explicit owner approval must be blocked.');

console.log('Catalog guard self-test: PASS (silent deletion, URL change and unauthorized archive are blocked).');
