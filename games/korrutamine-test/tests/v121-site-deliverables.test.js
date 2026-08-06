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
  'materials/tunniplaan/index.html',
  'assets/minu-tunniplaan.png',
  'downloads/minu-tunniplaan.pdf'
]) assert.ok(exists(relative),`Missing v121 public deliverable: ${relative}`);

assert.ok(!exists('games/umbermoot-pindala/index.html'),'Geometry prototype must not be present in the public site build.');

const materialsPage=read('materials/index.html');
assert.match(materialsPage,/href="tunniplaan\/"/,'Materials catalog must contain Minu tunniplaan.');
assert.match(materialsPage,/Minu tunniplaan/,'Materials catalog must show Minu tunniplaan.');

const tunniPage=read('materials/tunniplaan/index.html');
assert.match(tunniPage,/Minu tunniplaan/i);
assert.match(tunniPage,/downloads\/minu-tunniplaan\.pdf/,'The timetable PDF must be downloadable.');
assert.match(tunniPage,/assets\/minu-tunniplaan\.png/,'The timetable must have a visible preview.');

const mathCatalog=read('materials/matemaatika/index.html');
assert.match(mathCatalog,/href="\.\.\/korrutustabel\/"/,'Mathematics catalog must contain the multiplication-table material.');
assert.doesNotMatch(mathCatalog,/games\/umbermoot-pindala\//,'Mathematics catalog must not expose the private geometry prototype.');

console.log('v121 public deliverables protected: Minu tunniplaan restored; geometry prototype remains private.');
