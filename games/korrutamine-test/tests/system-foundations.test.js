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
assert.equal(config.missions.length,33);
assert.deepEqual(config.chapters.map(chapter=>[chapter.id,chapter.startMissionId,chapter.endMissionId]),[
  [1,1,15],
  [2,16,33]
]);
assert.deepEqual(config.lesson.triggers.map(lesson=>[lesson.id,lesson.missionId,lesson.mode,lesson.table]),[
  ['multiply-2',1,'multiply',2],
  ['divide-2',11,'divide',2],
  ['multiply-3',16,'multiply',3],
  ['divide-3',26,'divide',3]
]);
assert.deepEqual(config.story.chapterTwo,{
  startMissionId:16,
  firstMoonMissionId:20,
  secondMoonMissionId:25,
  thirdMoonMissionId:30,
  vaultMissionIds:[31,32],
  finalMissionId:33
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
assert.match(gameHtml,/MISSIOONID 1–33/);
assert.match(gameHtml,/id="missionRouteScroll"/);
assert.match(gameCode,/missionRouteScroll\.scrollTop=/);
assert.match(gameCode,/missionRouteScroll\.classList\.add\('is-positioning'\)/);
assert.match(gameCode,/getBoundingClientRect\(\)/);
assert.match(gameCode,/storySpanHeight<=routeHeight-16/);
assert.match(gameCode,/currentMissionId-1/);
assert.match(gameCode,/setTimeout\(reveal,140\)/);
assert.match(gameCss,/overflow-anchor:none/);
assert.match(gameCode,/currentMissionId=Math\.max\(1,Math\.min\(LAST_MISSION_ID,progress\.unlockedLevel\)\)/);
assert.match(gameHtml,/id="storyThreeDoor"/);
assert.match(gameHtml,/data-story-machine="1"/);
assert.match(gameHtml,/data-story-step="1"/);
assert.match(gameHtml,/data-story-step="14"/);
assert.match(gameHtml,/three-crystal-bud/);
assert.match(gameHtml,/reward-crystal-carry/);
assert.match(gameHtml,/reward-three-console/);
assert.match(gameCss,/reward-chapter-two\s+\.crystal\{display:none!important\}/);
assert.match(gameCss,/first-completion:not\(\.is-playing\).*is-new-reward/);
assert.match(gameCode,/levelId===23\|\|levelId===33\?'artifactReceive'/);
assert.match(gameHtml,/data-reward-three="3"/);
assert.match(gameHtml,/data-reward-three="17"/);
assert.match(gameHtml,/class="reward-three-descent"/);
assert.match(gameHtml,/class="reward-three-chamber"/);
assert.match(gameHtml,/data-reward-three="18"/);

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
  maxLevel:33
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
  maxLevel:33
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
const invalidStore=progressStoreApi.create({storage:invalidStorage,key:config.storage.progressKey,schemaVersion:2,maxLevel:33});
assert.deepEqual(invalidStore.load(),invalidStore.defaultProgress());

const futureStorage=memoryStorage({
  [config.storage.progressKey]:JSON.stringify({saveVersion:3,unlockedLevel:33,completedLevels:[1]})
});
const futureStore=progressStoreApi.create({storage:futureStorage,key:config.storage.progressKey,schemaVersion:2,maxLevel:33});
assert.deepEqual(futureStore.load(),futureStore.defaultProgress());

const clampedStorage=memoryStorage({
  [config.storage.progressKey]:JSON.stringify({...legacyProgress,saveVersion:2,unlockedLevel:999,completedLevels:[1,15,33,34,999]})
});
const clampedStore=progressStoreApi.create({storage:clampedStorage,key:config.storage.progressKey,schemaVersion:2,maxLevel:33});
const clamped=clampedStore.load();
assert.equal(clamped.unlockedLevel,33);
assert.deepEqual(clamped.completedLevels,[1,15,33]);

console.log('Language, lesson-trigger and progress-version checks passed.');
