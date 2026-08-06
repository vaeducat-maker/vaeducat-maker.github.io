const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const gameRoot=path.resolve(__dirname,'..');
const config=require(path.join(gameRoot,'chapter-one.config.js'));
const gameCode=fs.readFileSync(path.join(gameRoot,'game.js'),'utf8');
const gameCss=fs.readFileSync(path.join(gameRoot,'game.css'),'utf8');

const visibilityFunction=gameCode.match(/function shouldHideRewardCat\(chapterId,levelPassed\)\{[^}]+\}/)?.[0];
assert.ok(visibilityFunction,'The reward-cat visibility contract must remain a small testable function.');
const sandbox={};
vm.runInNewContext(visibilityFunction,sandbox);

for(const chapter of config.chapters){
  assert.equal(
    sandbox.shouldHideRewardCat(chapter.id,false),
    false,
    `A failed attempt in chapter ${chapter.id} must show the recovering cat.`
  );
  assert.equal(
    sandbox.shouldHideRewardCat(chapter.id,true),
    chapter.id>=2,
    `A victory in chapter ${chapter.id} must use the approved chapter-specific reward composition.`
  );
}
assert.match(gameCode,/syncRewardCatVisibility\(levelId,levelPassed\)/);
assert.match(gameCode,/configureRewardScene\(currentLevel\?\.id\|\|1,false,false\)/);

const helmetGuard=gameCss.slice(gameCss.indexOf('/* v118: the helmet and cat share one motion layer'));
assert.ok(helmetGuard.length>0,'The responsive helmet guard must remain in game.css.');
assert.match(helmetGuard,/\.hero-zone\.danger-high:not\(\.impact\) \.hero-cat-crop\{animation:helmetCatNervous/);
assert.match(helmetGuard,/\.hero-zone\.danger-critical:not\(\.impact\) \.hero-cat-crop\{animation:helmetCatBrace/);
assert.match(helmetGuard,/\.hero-zone\.impact \.hero-cat-crop\{animation:helmetCatImpact/);
assert.match(helmetGuard,/\.hero-zone\.impact \.hero-cat-gear\{animation:none!important\}/);
assert.match(helmetGuard,/@keyframes helmetCatNervous/);
assert.match(helmetGuard,/@keyframes helmetCatBrace/);
assert.match(helmetGuard,/@keyframes helmetCatImpact/);

console.log('Live UI regressions protected: helmet alignment and failed-attempt cat across all 16 chapters.');
