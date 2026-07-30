const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const gameRoot=path.resolve(__dirname,'..');
const config=require(path.join(gameRoot,'chapter-one.config.js'));
const et=require(path.join(gameRoot,'locales/et.js'));
const i18nApi=require(path.join(gameRoot,'i18n.js'));
const progressStoreApi=require(path.join(gameRoot,'progress-store.js'));

function memoryStorage(initial={}){
  const values=new Map(Object.entries(initial));
  return {
    getItem:key=>values.has(key)?values.get(key):null,
    setItem:(key,value)=>values.set(key,String(value)),
    removeItem:key=>values.delete(key),
    snapshot:()=>Object.fromEntries(values)
  };
}

assert.equal(config.defaultLanguage,'et');
assert.deepEqual(config.supportedLanguages,['et']);
assert.equal(config.schemaVersion,2);
assert.equal(config.storage.progressKey,'edukass-chapter-one-v18');
assert.equal(config.storage.soundKey,'edukass-sound-enabled');
assert.equal(config.storage.introKey,'edukass-opening-seen-v28');
assert.equal(config.storage.progressSchemaVersion,2);
assert.equal(config.missions.length,172);
assert.deepEqual(config.chapters.map(chapter=>[chapter.id,chapter.startMissionId,chapter.endMissionId]),[
  [1,1,15],
  [2,16,33],
  [3,34,51],
  [4,52,69],
  [5,70,87],
  [6,88,105],
  [7,106,123],
  [8,124,141],
  [9,142,159],
  [10,160,172]
]);
assert.deepEqual(config.lesson.triggers.map(lesson=>[lesson.id,lesson.missionId,lesson.mode,lesson.table]),[
  ['multiply-2',1,'multiply',2],
  ['divide-2',11,'divide',2],
  ['multiply-3',16,'multiply',3],
  ['divide-3',26,'divide',3],
  ['multiply-4',34,'multiply',4],
  ['divide-4',44,'divide',4],
  ['multiply-5',52,'multiply',5],
  ['divide-5',62,'divide',5],
  ['multiply-6',70,'multiply',6],
  ['divide-6',80,'divide',6],
  ['multiply-7',88,'multiply',7],
  ['divide-7',98,'divide',7],
  ['multiply-8',106,'multiply',8],
  ['divide-8',116,'divide',8],
  ['multiply-9',124,'multiply',9],
  ['divide-9',134,'divide',9],
  ['multiply-10',142,'multiply',10],
  ['divide-10',152,'divide',10]
]);
assert.deepEqual(config.story.chapterTwo,{
  startMissionId:16,
  finalMissionId:33,
  worldSteps:[
    {missionId:16,role:'rocket'},
    {missionId:17,role:'cat'},
    {missionId:18,role:'crystals-one'},
    {missionId:19,role:'water'},
    {missionId:20,role:'mushrooms'},
    {missionId:21,role:'grass'},
    {missionId:22,role:'flowers'},
    {missionId:23,role:'crystals-two'},
    {missionId:24,role:'creature-one'},
    {missionId:25,role:'creature-two'},
    {missionId:26,role:'sky'},
    {missionId:27,role:'far-crystals'},
    {missionId:28,role:'arch'},
    {missionId:29,role:'path'},
    {missionId:30,role:'tower'},
    {missionId:31,role:'tower-light'},
    {missionId:32,role:'final-glow'},
    {missionId:33,role:'departure'}
  ]
});

const i18n=i18nApi.create({
  locales:{et},
  defaultLanguage:config.defaultLanguage,
  supportedLanguages:config.supportedLanguages,
  requestedLanguage:'et'
});
assert.equal(i18n.language,'et');
assert.equal(i18n.t('lesson.openMission',{number:26}),'Ava 26. missioon');
assert.equal(i18n.t('feedback.correctAnswer',{answer:18}),'Õige vastus on 18');
assert.equal(i18n.t('share.button'),'JAGA');
assert.equal(i18n.t('share.copied'),'Link kopeeritud!');
assert.equal(i18n.t('lesson.toExplanations'),'MÄNGI!');
assert.equal(i18n.t('chapter.2.title'),'2. PEATÜKK · KOLM');
assert.equal(i18n.t('chapter.3.title'),'3. PEATÜKK · NELI');
assert.equal(i18n.t('chapter.4.title'),'4. PEATÜKK · VIIS');
assert.equal(i18n.t('chapter.5.title'),'5. PEATÜKK · KUUS');
assert.equal(i18n.t('chapter.7.title'),'7. PEATÜKK · KAHEKSA');
assert.equal(i18n.t('chapter.8.title'),'8. PEATÜKK · ÜHEKSA');
assert.equal(i18n.t('chapter.9.title'),'9. PEATÜKK · KÜMME');
assert.equal(i18n.t('chapter.10.title'),'10. PEATÜKK · DRAAKONITE TAEVAS');
assert.equal(i18n.t('mission.33.title'),'Peatüki kontroll');
assert.equal(i18n.t('missing.key',{},'Varutekst'),'Varutekst');

const gameCode=fs.readFileSync(path.join(gameRoot,'game.js'),'utf8');
const gameHtml=fs.readFileSync(path.join(gameRoot,'index.html'),'utf8');
const gameCss=fs.readFileSync(path.join(gameRoot,'game.css'),'utf8');
assert.match(gameCode,/function lessonForMission\(levelId\)/);
assert.match(gameCode,/showLesson\(lesson\.id,nextLevel,\{historyMode:'replace'\}\)/);
assert.match(gameCode,/markLessonSeen\(currentLesson\)/);
assert.match(gameCode,/startLevel\(level,\{historyMode:'replace'\}\)/);
assert.match(gameCode,/lessonContinueButton\.textContent=t\('lesson\.toExplanations'\)/);
assert.doesNotMatch(gameCode,/lessonContinueButton\.innerHTML=.*MISSIOON/);
assert.match(gameHtml,/id="lessonContinueButton"[^>]*>MÄNGI!<\/button>/);
assert.match(gameHtml,/id="repeatThreeMultiplicationButton"/);
assert.match(gameHtml,/id="repeatThreeDivisionButton"/);
assert.match(gameHtml,/id="repeatFourMultiplicationButton"/);
assert.match(gameHtml,/id="repeatFourDivisionButton"/);
assert.match(gameHtml,/MISSIOONID 1–172/);
assert.match(gameHtml,/id="missionRouteScroll"/);
assert.match(gameCode,/missionRouteScroll\.scrollTop=/);
assert.match(gameCode,/currentRect\.top-routeRect\.top/);
assert.doesNotMatch(gameCode,/levelGrid\.offsetTop\+current\.offsetTop/);
assert.match(gameHtml,/id="livingWorldTemplate"/);
assert.match(gameHtml,/data-world-role="crystals-one"/);
assert.match(gameHtml,/data-world-role="water"/);
assert.match(gameHtml,/data-world-role="departure"/);
assert.match(gameCode,/function renderChapterTwoStory\(\)/);
assert.match(gameCode,/worldAwaken/);
assert.match(gameCode,/setChapterTwoRewardProgress\(levelId,true\)/);
assert.match(gameCode,/const chapterTwoReveal=levelId>FINAL_MISSION_ID/);
assert.match(gameCode,/const worldReveal=chapterTwoReveal\|\|chapterThreeReveal\|\|chapterFourReveal\|\|chapterFiveReveal\|\|chapterSixReveal\|\|chapterSevenReveal\|\|chapterEightReveal\|\|chapterNineReveal\|\|chapterTenReveal/);
assert.match(gameCode,/const visualReveal=firstCompletion\|\|worldReveal/);
const chapterTwoCinematicStart=gameCode.indexOf("if(levelId>FINAL_MISSION_ID){",gameCode.indexOf('function startRewardCinematic'));
const chapterOneCinematicStart=gameCode.indexOf("if(levelId===FINAL_MISSION_ID){",chapterTwoCinematicStart);
const chapterTwoCinematic=gameCode.slice(chapterTwoCinematicStart,chapterOneCinematicStart);
assert.doesNotMatch(chapterTwoCinematic,/rewardFx\.(?:sparkBurst|shockwave)/);
assert.doesNotMatch(gameHtml,/data-story-moon=/);
assert.doesNotMatch(gameHtml,/reward-three-vault/);
assert.match(gameCss,/\.world-life\{[^}]*opacity:0/);
assert.match(gameCss,/\.world-life\.is-earned\{opacity:1\}/);
assert.match(gameCss,/\.reward-chapter-two \.world-life\.is-new-reward\{opacity:0\}/);
assert.match(gameCss,/@keyframes worldCrystalLife/);
assert.match(gameCss,/@keyframes worldWaterFlow/);
assert.match(gameCss,/@media\(prefers-reduced-motion:reduce\)/);
for(const [index,worldStep] of config.story.chapterTwo.worldSteps.entries()){
  assert.match(
    gameHtml,
    new RegExp(`data-world-step="${index+1}"[^>]*data-world-role="${worldStep.role}"`),
    `Living-world layer ${index+1} (${worldStep.role}) is missing from the shared scene.`
  );
}
assert.ok(fs.existsSync(path.join(gameRoot,'assets','edukass-kolm-world.png')));
assert.ok(fs.existsSync(path.join(gameRoot,'assets','edukass-world-rocket.png')));
assert.match(gameHtml,/id="windWorldTemplate"/);
assert.match(gameCode,/function renderChapterThreeStory\(\)/);
assert.match(gameCode,/setChapterThreeRewardProgress\(levelId,true\)/);
for(const [index,worldStep] of config.story.chapterThree.worldSteps.entries()){
  assert.match(
    gameHtml,
    new RegExp(`data-wind-step="${index+1}"[^>]*data-wind-role="${worldStep.role}"`),
    `Wind-world layer ${index+1} (${worldStep.role}) is missing from the shared scene.`
  );
}
assert.match(gameHtml,/id="luminWorldTemplate"/);
assert.match(gameCode,/function renderChapterFourStory\(\)/);
assert.match(gameCode,/setChapterFourRewardProgress\(levelId,true\)/);
for(const [index,worldStep] of config.story.chapterFour.worldSteps.entries()){
  assert.match(
    gameHtml,
    new RegExp(`data-lumin-step="${index+1}"[^>]*data-lumin-role="${worldStep.role}"`),
    `Lumin-world layer ${index+1} (${worldStep.role}) is missing from the shared scene.`
  );
}
assert.match(gameHtml,/id="northWorldTemplate"/);
assert.match(gameCode,/function renderChapterFiveStory\(\)/);
assert.match(gameCode,/setChapterFiveRewardProgress\(levelId,true\)/);
for(const [index,worldStep] of config.story.chapterFive.worldSteps.entries()){
  assert.match(
    gameHtml,
    new RegExp(`data-north-step="${index+1}"[^>]*data-north-role="${worldStep.role}"`),
    `North-world layer ${index+1} (${worldStep.role}) is missing from the shared scene.`
  );
}
for(const [index,worldStep] of config.story.chapterSix.worldSteps.entries()){
  assert.equal(worldStep.missionId,88+index);
}
assert.match(gameHtml,/id="canopyWorldTemplate"/);
assert.match(gameCode,/function renderChapterSixStory\(\)/);
assert.match(gameCode,/setChapterSixRewardProgress\(levelId,true\)/);
for(const [index,worldStep] of config.story.chapterSeven.worldSteps.entries()){
  assert.equal(worldStep.missionId,106+index);
}
assert.match(gameHtml,/id="terraceWorldTemplate"/);
assert.match(gameCode,/function renderChapterSevenStory\(\)/);
assert.match(gameCode,/setChapterSevenRewardProgress\(levelId,true\)/);
for(const [index,worldStep] of config.story.chapterEight.worldSteps.entries()){
  assert.equal(worldStep.missionId,124+index);
}
assert.match(gameHtml,/id="oceanWorldTemplate"/);
assert.match(gameCode,/function renderChapterEightStory\(\)/);
assert.match(gameCode,/setChapterEightRewardProgress\(levelId,true\)/);
for(const [index,worldStep] of config.story.chapterNine.worldSteps.entries()){
  assert.equal(worldStep.missionId,142+index);
}
assert.match(gameHtml,/id="canyonWorldTemplate"/);
assert.match(gameCode,/function renderChapterNineStory\(\)/);
assert.match(gameCode,/setChapterNineRewardProgress\(levelId,true\)/);
for(const [index,worldStep] of config.story.chapterTen.worldSteps.entries()){
  assert.equal(worldStep.missionId,160+index);
}
assert.match(gameHtml,/id="dragonWorldTemplate"/);
assert.match(gameCode,/function renderChapterTenStory\(\)/);
assert.match(gameCode,/setChapterTenRewardProgress\(levelId,true\)/);
for(const table of [5,6,7,8,9,10]){
  const numberName={5:'Five',6:'Six',7:'Seven',8:'Eight',9:'Nine',10:'Ten'}[table];
  assert.match(gameHtml,new RegExp(`id="repeat${numberName}MultiplicationButton"`));
  assert.match(gameHtml,new RegExp(`id="repeat${numberName}DivisionButton"`));
  assert.match(gameCode,new RegExp(`showLesson\\('multiply-${table}','explanations'\\)`));
  assert.match(gameCode,new RegExp(`showLesson\\('divide-${table}','explanations'\\)`));
}
assert.match(gameCode,/demoMultiplyEquation\.textContent=`\$\{factor\} × \$\{currentLessonTable\} = \$\{product\}`/);
assert.match(gameCode,/demoStars\.replaceChildren\(\.\.\.buildGroups\(factor,\{value:currentLessonTable\}\)\)/);
assert.match(gameCode,/demoDivisionEquation\.textContent=`\$\{product\} ÷ \$\{currentLessonTable\} = \$\{factor\}`/);

const unsupported=i18nApi.create({
  locales:{et},
  defaultLanguage:'et',
  supportedLanguages:['et'],
  requestedLanguage:'ru'
});
assert.equal(unsupported.language,'et');
assert.equal(unsupported.t('result.done'),'Tehtud!');

for(const mission of config.missions){
  assert.equal(i18n.t(mission.titleKey),mission.title,`Mission ${mission.id} title changed in the Estonian locale.`);
  assert.equal(i18n.t(mission.shortKey),mission.short,`Mission ${mission.id} short label changed in the Estonian locale.`);
}

const legacyProgress={
  unlockedLevel:12,
  completedLevels:[1,2,3,4,5,6,7,8,9,10,11],
  multiplicationLessonSeen:true,
  divisionLessonSeen:true,
  factStats:{'multiply:7':{correct:4,mistakes:2}}
};
const legacyStorage=memoryStorage({[config.storage.progressKey]:JSON.stringify(legacyProgress)});
const legacyStore=progressStoreApi.create({
  storage:legacyStorage,
  key:config.storage.progressKey,
  schemaVersion:config.storage.progressSchemaVersion,
  maxLevel:config.missions.length
});
const migrated=legacyStore.load();
assert.equal(migrated.saveVersion,2);
assert.equal(migrated.unlockedLevel,12);
assert.deepEqual(migrated.completedLevels,legacyProgress.completedLevels);
assert.deepEqual(migrated.factStats,legacyProgress.factStats);
assert.equal(migrated.lessonSeen['multiply-2'],true);
assert.equal(migrated.lessonSeen['divide-2'],true);
assert.equal(migrated.lessonSeen['multiply-3'],undefined);

const versionOneProgress={...legacyProgress,saveVersion:1,lessonSeen:{'multiply-3':true}};
const versionOneStorage=memoryStorage({[config.storage.progressKey]:JSON.stringify(versionOneProgress)});
const versionOneStore=progressStoreApi.create({
  storage:versionOneStorage,
  key:config.storage.progressKey,
  schemaVersion:2,
  maxLevel:51
});
const versionOneMigrated=versionOneStore.load();
assert.equal(versionOneMigrated.saveVersion,2);
assert.equal(versionOneMigrated.lessonSeen['multiply-3'],true);
assert.equal(versionOneMigrated.lessonSeen['multiply-2'],true);
assert.equal(versionOneMigrated.lessonSeen['divide-2'],true);

// Regression: v42 stored unlockedLevel=15 even after mission 15 was complete,
// because 15 used to be the final mission. The expanded build must unlock 16.
const completedV42=Array.from({length:15},(_,index)=>index+1);
const v42Storage=memoryStorage({
  [config.storage.progressKey]:JSON.stringify({
    saveVersion:2,
    unlockedLevel:15,
    completedLevels:completedV42,
    lessonSeen:{'multiply-2':true,'divide-2':true},
    factStats:{}
  })
});
const v42Store=progressStoreApi.create({
  storage:v42Storage,
  key:config.storage.progressKey,
  schemaVersion:2,
  maxLevel:51
});
const expandedFromV42=v42Store.load();
assert.equal(expandedFromV42.unlockedLevel,16);
assert.deepEqual(expandedFromV42.completedLevels,completedV42);

const saved=legacyStore.save({...migrated,unlockedLevel:16,lessonSeen:{...migrated.lessonSeen,'multiply-3':true}});
assert.equal(saved.saveVersion,2);
const persisted=JSON.parse(legacyStorage.getItem(config.storage.progressKey));
assert.equal(persisted.unlockedLevel,16);
assert.equal(persisted.saveVersion,2);
assert.equal(persisted.lessonSeen['multiply-3'],true);

legacyStore.clear();
assert.equal(legacyStorage.getItem(config.storage.progressKey),null);

const invalidStorage=memoryStorage({[config.storage.progressKey]:'not json'});
const invalidStore=progressStoreApi.create({storage:invalidStorage,key:config.storage.progressKey,schemaVersion:2,maxLevel:51});
assert.deepEqual(invalidStore.load(),invalidStore.defaultProgress());

const futureStorage=memoryStorage({
  [config.storage.progressKey]:JSON.stringify({saveVersion:3,unlockedLevel:33,completedLevels:[1]})
});
const futureStore=progressStoreApi.create({storage:futureStorage,key:config.storage.progressKey,schemaVersion:2,maxLevel:51});
assert.deepEqual(futureStore.load(),futureStore.defaultProgress());

const clampedStorage=memoryStorage({
  [config.storage.progressKey]:JSON.stringify({...legacyProgress,saveVersion:2,unlockedLevel:999,completedLevels:[1,15,33,34,999]})
});
const clampedStore=progressStoreApi.create({storage:clampedStorage,key:config.storage.progressKey,schemaVersion:2,maxLevel:51});
const clamped=clampedStore.load();
assert.equal(clamped.unlockedLevel,51);
assert.deepEqual(clamped.completedLevels,[1,15,33,34]);

console.log('Language, lesson-trigger and progress-version checks passed.');
