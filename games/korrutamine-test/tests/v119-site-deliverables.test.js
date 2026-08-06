const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'../../..');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const exists=relative=>fs.existsSync(path.join(root,relative));

for(const relative of [
  'materials/korrutustabel/index.html',
  'assets/korrutustabel.png',
  'downloads/korrutustabel-A4.pdf',
  'games/umbermoot-pindala/index.html',
  'games/umbermoot-pindala/prototype.css',
  'games/umbermoot-pindala/prototype.js'
]) assert.ok(exists(relative),`Missing v119 deliverable: ${relative}`);

const mathCatalog=read('materials/matemaatika/index.html');
assert.match(mathCatalog,/href="\.\.\/korrutustabel\/"/,'Mathematics catalog must contain the multiplication-table material.');
assert.match(mathCatalog,/href="\.\.\/umbermoot-pindala\/"/,'Mathematics catalog must contain the perimeter-and-area material.');

const tablePage=read('materials/korrutustabel/index.html');
assert.match(tablePage,/Korrutustabel/i);
assert.match(tablePage,/downloads\/korrutustabel-A4\.pdf/,'The printable A4 multiplication table must be downloadable.');
assert.match(tablePage,/assets\/korrutustabel\.png/,'The multiplication table must have a visible preview.');

const materialPage=read('materials/umbermoot-pindala/index.html');
assert.match(materialPage,/games\/umbermoot-pindala\//,'The material page must link to the playable prototype.');

const prototype=read('games/umbermoot-pindala/prototype.js');
assert.match(prototype,/type:'introP'/,'Prototype must introduce perimeter visually before asking.');
assert.match(prototype,/type:'introS'/,'Prototype must introduce area visually before asking.');
assert.match(prototype,/queue\.splice\(Math\.min\(index\+4,queue\.length\),0,retry\)/,'A mistaken skill must return later, not immediately.');
assert.match(prototype,/RISTKÜLIK · ÜMBERMÕÕT/);
assert.match(prototype,/RUUT · PINDALA/);

console.log('v119 site deliverables protected: multiplication table, mathematics catalog and playable geometry prototype.');
