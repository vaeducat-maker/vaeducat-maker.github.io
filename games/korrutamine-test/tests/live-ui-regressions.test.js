const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const gameRoot=path.resolve(__dirname,'..');
const config=require(path.join(gameRoot,'chapter-one.config.js'));
const gameCode=fs.readFileSync(path.join(gameRoot,'game.js'),'utf8');
const gameCss=fs.readFileSync(path.join(gameRoot,'game.css'),'utf8');
const gameHtml=fs.readFileSync(path.join(gameRoot,'index.html'),'utf8');

const visibilityFunction=gameCode.match(/function shouldHideRewardCat\(chapterId,levelPassed\)\{[^}]+\}/)?.[0];
assert.ok(visibilityFunction,'Reward-cat visibility must remain independently testable.');
const sandbox={};vm.runInNewContext(visibilityFunction,sandbox);
for(const chapter of config.chapters){
  assert.equal(sandbox.shouldHideRewardCat(chapter.id,false),false,`Failed attempt in chapter ${chapter.id} must show the recovering cat.`);
  assert.equal(sandbox.shouldHideRewardCat(chapter.id,true),chapter.id>=2,`Victory composition changed in chapter ${chapter.id}.`);
}
assert.match(gameCode,/style\.setProperty\('display',hide\?'none':'block','important'\)/,'Failure visibility must beat chapter-specific display:none rules.');
assert.match(gameCode,/style\.setProperty\('visibility',hide\?'hidden':'visible','important'\)/);
assert.match(gameCss,/#resultScreen \.reward-scene\.reward-failed > \.result-cat-crop\{[\s\S]*display:block!important/);
assert.match(gameCss,/z-index:90!important/);
assert.match(gameHtml,/class="failure-dizzy-stars"/);
assert.match(gameCss,/\.reward-failed\.is-playing \.failure-dizzy-stars\{[\s\S]*display:block/);

assert.match(gameHtml,/class="hero-cat-figure"/,'Helmet needs an image-sized coordinate system.');
assert.match(gameCss,/\.hero-cat-figure\{[\s\S]*aspect-ratio:743 \/ 856/);
assert.match(gameCss,/\.hero-cat-figure \.hero-helmet\{[\s\S]*top:8\.5%/);
assert.doesNotMatch(gameCss.slice(gameCss.lastIndexOf('/* v119:')),/hero-cat-gear\{animation:[^n]/);

console.log('Live UI regressions protected: image-anchored helmet and visible failure recovery in all 16 chapters.');
