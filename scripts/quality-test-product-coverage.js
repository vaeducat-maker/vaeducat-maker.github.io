#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {checkCoverage,validateRegistry}=require('./quality-check-product-coverage');
const data=require('../quality/product-registry.json');
const audit='proov/stolbiki-mosaic-7q4m9k/index.html';
assert.deepEqual(validateRegistry(data),[],'Product registry must be valid');
const good=checkCoverage([audit],{data});
assert(good.passed,'Accepted Stolbiki regression must be allowed: '+good.violations);
const doc=checkCoverage(['docs/ADAPTIVE_LEARNING_VISION.md'],{data});
assert(doc.passed,'Docs-only changes are allowed');
const legacy=checkCoverage(['games/kiire-sonatreener/index.html'],{data});
assert(!legacy.passed&&legacy.untestedProducts.includes('games-kiire-sonatreener'),
 'NEGATIVE CONTROL: untested Sõnatreener edit must block release');
const unknown=checkCoverage(['games/new-game/index.html'],{data});
assert(!unknown.passed&&unknown.violations.some(x=>x.includes('unregistered')),
 'NEGATIVE CONTROL: unregistered new game must block release');
const inventory=checkCoverage([], {data,inventory:['materials/future-material/index.html']});
assert(!inventory.passed&&inventory.violations.some(x=>x.includes('Unregistered')),
 'NEGATIVE CONTROL: hidden new material must block release');
const asset=checkCoverage(['downloads/unknown-poster.pdf'],{data});
assert(!asset.passed&&asset.violations.some(x=>x.includes('Shared')),
 'NEGATIVE CONTROL: unowned printable/PDF must block release');
const bypass=JSON.parse(JSON.stringify(data));
bypass.products.find(x=>x.id==='games-kiire-sonatreener').acceptance='verified';
assert(validateRegistry(bypass).some(x=>x.includes('missing approved source contract')),
 'NEGATIVE CONTROL: legacy cannot be labelled verified without evidence');
console.log('PASS EDUKASS product change coverage: verified trainer allowed');
console.log('PASS unaudited Sõnatreener edit blocked');
console.log('PASS unregistered game + material blocked');
console.log('PASS unowned shared PDF blocked');
console.log('PASS false verified label blocked');
