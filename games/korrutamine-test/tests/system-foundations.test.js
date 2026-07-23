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
assert.equal(config.storage.progressKey,'edukass-chapter-one-v18');
assert.equal(config.storage.soundKey,'edukass-sound-enabled');
assert.equal(config.storage.introKey,'edukass-opening-seen-v28');
assert.equal(config.storage.progressSchemaVersion,1);
assert.deepEqual(config.lesson,{
  initialMode:'multiply',
  divisionMode:'divide',
  demoFactor:4,
  divisionMissionId:11
});
assert.deepEqual(config.story,{
  segmentLength:5,
  shipMissionId:5,
  engineMissionId:10,
  finalMissionId:15,
  planetMissionIds:[3,6,9,10,12,15]
});

const i18n=i18nApi.create({
  locales:{et},
  defaultLanguage:config.defaultLanguage,
  supportedLanguages:config.supportedLanguages,
  requestedLanguage:'et'
});
assert.equal(i18n.language,'et');
assert.equal(i18n.t('lesson.openMission',{number:11}),'Ava 11. missioon');
assert.equal(i18n.t('feedback.correctAnswer',{answer:18}),'Õige vastus on 18');
assert.equal(i18n.t('share.button'),'JAGA');
assert.equal(i18n.t('share.copied'),'Link kopeeritud!');
assert.equal(i18n.t('lesson.toExplanations'),'MÄNGI!');
assert.equal(i18n.t('missing.key',{},'Varutekst'),'Varutekst');

const gameCode=fs.readFileSync(path.join(gameRoot,'game.js'),'utf8');
assert.match(gameCode,/currentLessonMode===LESSON_CONFIG\.divisionMode\?DIVISION_MISSION_ID:1/);
assert.match(gameCode,/startLevel\(level,\{historyMode:'replace'\}\)/);

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
assert.equal(migrated.saveVersion,1);
assert.equal(migrated.unlockedLevel,12);
assert.deepEqual(migrated.completedLevels,legacyProgress.completedLevels);
assert.deepEqual(migrated.factStats,legacyProgress.factStats);

const saved=legacyStore.save({...migrated,unlockedLevel:13});
assert.equal(saved.saveVersion,1);
const persisted=JSON.parse(legacyStorage.getItem(config.storage.progressKey));
assert.equal(persisted.unlockedLevel,13);
assert.equal(persisted.saveVersion,1);

legacyStore.clear();
assert.equal(legacyStorage.getItem(config.storage.progressKey),null);

const invalidStorage=memoryStorage({[config.storage.progressKey]:'not json'});
const invalidStore=progressStoreApi.create({storage:invalidStorage,key:config.storage.progressKey,schemaVersion:1,maxLevel:15});
assert.deepEqual(invalidStore.load(),invalidStore.defaultProgress());

const futureStorage=memoryStorage({
  [config.storage.progressKey]:JSON.stringify({saveVersion:2,unlockedLevel:15,completedLevels:[1]})
});
const futureStore=progressStoreApi.create({storage:futureStorage,key:config.storage.progressKey,schemaVersion:1,maxLevel:15});
assert.deepEqual(futureStore.load(),futureStore.defaultProgress());

const clampedStorage=memoryStorage({
  [config.storage.progressKey]:JSON.stringify({...legacyProgress,saveVersion:1,unlockedLevel:999})
});
const clampedStore=progressStoreApi.create({storage:clampedStorage,key:config.storage.progressKey,schemaVersion:1,maxLevel:15});
assert.equal(clampedStore.load().unlockedLevel,15);

console.log('Language and progress-version checks passed.');
