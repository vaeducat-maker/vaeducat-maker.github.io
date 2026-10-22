#!/usr/bin/env node
'use strict';
// General EDUKASS pedagogical release gate. Fast, dependency-free, independent
// from any individual game's own claim that a generated question is useful.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const problems = [];
const ok = (condition, message) => { if (!condition) problems.push(message); };
const loadJSON = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const isPowerOfTen = n => Number.isSafeInteger(n) && n >= 10 && /^10*$/.test(String(n));
const isSafeRelative = p => typeof p === 'string' && !p.startsWith('/') && !p.includes('..') && !p.includes('\\');
const exists = p => isSafeRelative(p) && fs.existsSync(path.join(root, p));
const stageIds = new Set();

function independentNearestTenPower(value, unit) {
  // Safe integers only. No call to the application generator or its validator.
  const n = BigInt(value), u = BigInt(unit);
  return Number((n / u + (2n * (n % u) >= u ? 1n : 0n)) * u);
}
function validateContract(p) {
  let c;
  try { c = loadJSON(p); } catch (e) { problems.push('Cannot read contract '+p+': '+e.message); return; }
  const prefix = p + ': ';
  ok(c.schema_version === 1, prefix+'unsupported contract schema');
  ok(['planned','active'].includes(c.status),prefix+'invalid status');
  ok(typeof c.trainer_id === 'string' && /^[a-z][a-z0-9-]+$/.test(c.trainer_id),prefix+'missing trainer id');
  ok(typeof c.purpose_ru === 'string' && c.purpose_ru.length > 40, prefix+'learning outcome must be measurable and explicit');
  ok(Array.isArray(c.entry_requirements) && c.entry_requirements.length >= 1,prefix+'entry prerequisites required');
  ok(Array.isArray(c.common_misconceptions) && c.common_misconceptions.length >= 2,prefix+'known misconceptions required');
  ok(Array.isArray(c.negative_controls) && c.negative_controls.length >= 3 &&
      c.negative_controls.every(x=>x.id && typeof x.why_ru === 'string' && x.why_ru.length > 15),
      prefix+'at least three explained negative controls are mandatory');
  ok(Array.isArray(c.release_evidence) && c.release_evidence.length >= 4,prefix+'independent release evidence required');
  ok(c.task_contract && ['skill_id','case_type','expected_answer','signature'].every(x=>c.task_contract.mandatory_fields?.includes(x)),
    prefix+'generator must carry skill, case, answer and structural signature');
  ok(Array.isArray(c.stages) && c.stages.length >= 1,prefix+'skill progression stages required');
  const localIds = new Set();
  for (const stage of c.stages || []) {
    const label = prefix + (stage.id || '?') + ': ';
    ok(typeof stage.id === 'string' && !localIds.has(stage.id),label+'nonunique skill id'); localIds.add(stage.id);
    ok(Array.isArray(stage.case_types) && new Set(stage.case_types).size === stage.case_types.length &&
       stage.case_types.length >= 3,label+'at least three distinct pedagogical case types required');
    ok(Array.isArray(stage.examples) && stage.examples.length >= 3,label+'at least three worked reference examples required');
    for (const ex of stage.examples || []) {
      ok(stage.case_types?.includes(ex.case_type),label+'reference example missing declared case_type');
      ok(stage.targets?.includes(ex.unit),label+'reference example targets wrong place value');
      if (c.trainer_id === 'umardamine') {
        ok(Number.isSafeInteger(ex.value) && ex.value >= 0 &&
           Number.isSafeInteger(ex.answer) && ex.answer >= 0 && isPowerOfTen(ex.unit),
           label+'rounding example contains invalid or unsafe number');
        if (Number.isSafeInteger(ex.value) && isPowerOfTen(ex.unit))
          ok(independentNearestTenPower(ex.value, ex.unit) === ex.answer,
             label+'incorrect rounding reference: '+ex.value+' to '+ex.unit+' should be '+independentNearestTenPower(ex.value, ex.unit)+', not '+ex.answer);
      } else {
        // Non-rounding subjects MUST provide an executable independent audit
        // before activation. Static contracts are never taken as proof of math.
        ok(ex.expected_answer !== undefined || ex.answer !== undefined,
           label+'reference answer required');
      }
    }
  }
  const types = new Set((c.stages || []).flatMap(s=>s.case_types || []));
  ok(types.size >= 4,prefix+'case type coverage too narrow');
  if (c.trainer_id === 'umardamine') {
    const targets = [...new Set((c.stages||[]).flatMap(s=>s.targets || []))];
    for (const u of [10,100,1000,10000,100000,1000000,10000000,100000000,1000000000])
      ok(targets.includes(u),prefix+'rounding target place missing: '+u);
    ok(types.has('exact_half') && types.has('already_multiple'),prefix+'exact half and exact multiple cases required');
    ok(c.stages.some(s=>s.case_types.includes('carry_into_billions')),prefix+'billion-carry transition missing');
  }
  console.log('CONTRACT '+c.trainer_id+' ('+c.status+'): '+(c.stages||[]).length+' skills, '+(c.stages||[]).reduce((n,s)=>n+(s.examples||[]).length,0)+' independently checked references');
  return c;
}
function findGameEntries(folder) {
  const base = path.join(root, folder), found = [];
  if (!fs.existsSync(base)) return found;
  function walk(dir) {
    for (const ent of fs.readdirSync(dir,{withFileTypes:true})) {
      if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
      const absolute = path.join(dir,ent.name);
      if (ent.isDirectory()) walk(absolute);
      else if (ent.isFile() && ent.name === 'index.html')
        found.push(path.relative(root,absolute).split(path.sep).join('/'));
    }
  }
  walk(base); return found;
}
let registry;
try { registry = loadJSON('pedagogy/registry.json'); } catch (e) {
  console.error('EDUKASS PEDAGOGICAL GATE BLOCKED: registry missing: '+e.message); process.exit(1);
}
ok(registry.schema_version === 1,'Invalid registry version');
ok(Array.isArray(registry.legacy_paths),'Registry requires legacy_paths array');
ok(Array.isArray(registry.new_games),'Registry requires new_games array');
const legacy = new Set(registry.legacy_paths || []);
const registered = new Map();
for (const item of registry.new_games || []) {
  ok(isSafeRelative(item.entry) && !registered.has(item.entry),'New game duplicate or invalid entry '+item.entry);
  registered.set(item.entry,item);
  ok(!legacy.has(item.entry),'A legacy product cannot be relabelled new without owner-approved migration: '+item.entry);
  ok(exists(item.entry),'Registered game entry not found: '+item.entry);
  ok(exists(item.contract),'Missing pedagogical contract for new game: '+item.entry);
  ok(exists(item.audit) && /^scripts\/pedagogy\/audit-[a-z0-9-]+\.js$/.test(item.audit),
    'Missing approved independent executable audit for '+item.entry);
  if (exists(item.contract)) {
    const c = validateContract(item.contract);
    ok(c?.status === 'active','A registered new game must have active contract: '+item.entry);
    ok(c?.trainer_id === item.trainer_id,'Wrong trainer contract for '+item.entry);
  }
}
for (const game of [...findGameEntries('games'),...findGameEntries('proov')])
  ok(legacy.has(game) || registered.has(game),
    'UNREGISTERED NEW GAME: '+game+' — create pedagogy/contracts/<slug>.json, independent audit and registry entry before publication');
const contractsDir = path.join(root,'pedagogy/contracts');
if (!fs.existsSync(contractsDir)) problems.push('Missing pedagogy/contracts directory');
else for (const file of fs.readdirSync(contractsDir)) {
  if (!file.endsWith('.json')) continue;
  const rel='pedagogy/contracts/'+file;
  if (![...(registry.new_games || [])].some(x=>x.contract===rel)) validateContract(rel);
}
if (problems.length) {
  console.error('\nEDUKASS LEARNING QUALITY BLOCKED ('+problems.length+' issue(s)):\n'+problems.map(x=>' - '+x).join('\n'));
  process.exit(1);
}
// Independently authored subject-specific audits of ACTIVE games; no game may
// silently skip its audit. The general gate is a prerequisite, not a replacement.
for (const item of registry.new_games || []) {
  const result=cp.spawnSync(process.execPath,[path.join(root,item.audit)],{
    cwd:root,encoding:'utf8',stdio:'inherit',timeout:120000
  });
  if (result.error || result.status!==0) problems.push('Independent audit failed for '+item.entry);
}
if (problems.length) { console.error('EDUKASS LEARNING QUALITY BLOCKED:\n'+problems.join('\n')); process.exit(1); }
console.log('EDUKASS LEARNING QUALITY PASS: '+(registry.new_games||[]).length+' new game(s), '+legacy.size+' legacy path(s), all available contracts validated.');
