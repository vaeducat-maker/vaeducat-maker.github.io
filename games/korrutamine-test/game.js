const screens=[...document.querySelectorAll('.screen')];
const answerDisplay=document.querySelector('#answerDisplay');
const feedback=document.querySelector('#feedback');
const factorA=document.querySelector('#factorA');
const factorB=document.querySelector('#factorB');
const operationSymbol=document.querySelector('#operationSymbol');
const correctCount=document.querySelector('#correctCount');
const mistakeCount=document.querySelector('#mistakeCount');
const timeCount=document.querySelector('#timeCount');
const distanceFill=document.querySelector('#distanceFill');
const meterStar=document.querySelector('.shower-meter i');
const showerMeter=document.querySelector('#showerMeter');
const starCurtain=document.querySelector('#starCurtain');
const battleStage=document.querySelector('#battleStage');
const questionCard=document.querySelector('#questionCard');
const heroZone=document.querySelector('#heroZone');
const choiceGrid=document.querySelector('#choiceGrid');
const keypad=document.querySelector('#keypad');
const answerPanel=document.querySelector('#answerPanel');
const answerPanelTitle=document.querySelector('#answerPanelTitle');
const levelGrid=document.querySelector('#levelGrid');
const missionRouteScroll=document.querySelector('#missionRouteScroll');
const completedLevelCount=document.querySelector('#completedLevelCount');
const mapEnergyTotal=document.querySelector('#mapEnergyTotal');
const mapEyebrow=document.querySelector('#mapEyebrow');
const levelKicker=document.querySelector('#levelKicker');
const battleTitle=document.querySelector('#battleTitle');
const resultEyebrow=document.querySelector('#resultEyebrow');
const resultTitle=document.querySelector('#resultTitle');
const resultMessage=document.querySelector('#resultMessage');
const resultMissionProgress=document.querySelector('#resultMissionProgress');
const resultPrimaryButton=document.querySelector('#resultPrimaryButton');
const resultMapButton=document.querySelector('#resultMapButton');
const lessonEyebrow=document.querySelector('#lessonEyebrow');
const lessonTitle=document.querySelector('#lessonTitle');
const multiplicationLesson=document.querySelector('#multiplicationLesson');
const divisionLesson=document.querySelector('#divisionLesson');
const lessonContinueButton=document.querySelector('#lessonContinueButton');
const lessonSign=document.querySelector('#lessonSign');
const demoMultiplyEquation=document.querySelector('#demoMultiplyEquation');
const demoOneLabel=document.querySelector('#demoOneLabel');
const demoMultiplyLabel=document.querySelector('#demoMultiplyLabel');
const demoDivisionLabel=document.querySelector('#demoDivisionLabel');
const demoOneEquation=document.querySelector('#demoOneEquation');
const demoDivisionEquation=document.querySelector('#demoDivisionEquation');
const demoStars=document.querySelector('#demoStars');
const demoOneStars=document.querySelector('#demoOneStars');
const demoDivisionStars=document.querySelector('#demoDivisionStars');
const soundToggleButton=document.querySelector('#soundToggleButton');
const explorerHint=document.querySelector('#explorerHint');
const factorPicker=document.querySelector('#factorPicker');
const mobileCorrectCount=document.querySelector('#mobileCorrectCount');
const mobileProgressPill=document.querySelector('#mobileProgressPill');
const repeatMultiplicationButton=document.querySelector('#repeatMultiplicationButton');
const repeatDivisionButton=document.querySelector('#repeatDivisionButton');
const repeatThreeMultiplicationButton=document.querySelector('#repeatThreeMultiplicationButton');
const repeatThreeDivisionButton=document.querySelector('#repeatThreeDivisionButton');
const repeatFourMultiplicationButton=document.querySelector('#repeatFourMultiplicationButton');
const repeatFourDivisionButton=document.querySelector('#repeatFourDivisionButton');
const repeatFiveMultiplicationButton=document.querySelector('#repeatFiveMultiplicationButton');
const repeatFiveDivisionButton=document.querySelector('#repeatFiveDivisionButton');
const repeatSixMultiplicationButton=document.querySelector('#repeatSixMultiplicationButton');
const repeatSixDivisionButton=document.querySelector('#repeatSixDivisionButton');
const repeatSevenMultiplicationButton=document.querySelector('#repeatSevenMultiplicationButton');
const repeatSevenDivisionButton=document.querySelector('#repeatSevenDivisionButton');
const repeatEightMultiplicationButton=document.querySelector('#repeatEightMultiplicationButton');
const repeatEightDivisionButton=document.querySelector('#repeatEightDivisionButton');
const repeatNineMultiplicationButton=document.querySelector('#repeatNineMultiplicationButton');
const repeatNineDivisionButton=document.querySelector('#repeatNineDivisionButton');
const repeatTenMultiplicationButton=document.querySelector('#repeatTenMultiplicationButton');
const repeatTenDivisionButton=document.querySelector('#repeatTenDivisionButton');
const storyStage=document.querySelector('#storyStage');
const storyPhaseKicker=document.querySelector('#storyPhaseKicker');
const storyPhaseTitle=document.querySelector('#storyPhaseTitle');
const shipGoalCount=document.querySelector('#shipGoalCount');
const engineGoalCount=document.querySelector('#engineGoalCount');
const portalGoalCount=document.querySelector('#portalGoalCount');
const vaultGoalCount=document.querySelector('#vaultGoalCount');
const storyTwo=document.querySelector('#storyTwo');
const storyThree=document.querySelector('#storyThree');
const storyFour=document.querySelector('#storyFour');
const storyFive=document.querySelector('#storyFive');
const storySix=document.querySelector('#storySix');
const storySeven=document.querySelector('#storySeven');
const storyEight=document.querySelector('#storyEight');
const storyNine=document.querySelector('#storyNine');
const storyTen=document.querySelector('#storyTen');
const storyEleven=document.querySelector('#storyEleven');
const storyTwelve=document.querySelector('#storyTwelve');
const storyThirteen=document.querySelector('#storyThirteen');
const storyFourteen=document.querySelector('#storyFourteen');
const storyFifteen=document.querySelector('#storyFifteen');
const storySixteen=document.querySelector('#storySixteen');
const stationWorldMap=document.querySelector('#stationWorldMap');
const storyCatCrop=storyStage.querySelector('.story-cat-crop');
const rewardScene=document.querySelector('#rewardScene');
const stationWorldReward=document.querySelector('#stationWorldReward');
const rewardLivingWorld=document.querySelector('#rewardLivingWorld');
const rewardWindWorld=document.querySelector('#rewardWindWorld');
const rewardLuminWorld=document.querySelector('#rewardLuminWorld');
const rewardNorthWorld=document.querySelector('#rewardNorthWorld');
const rewardCanopyWorld=document.querySelector('#rewardCanopyWorld');
const rewardTerraceWorld=document.querySelector('#rewardTerraceWorld');
const rewardOceanWorld=document.querySelector('#rewardOceanWorld');
const rewardCanyonWorld=document.querySelector('#rewardCanyonWorld');
const rewardDragonWorld=document.querySelector('#rewardDragonWorld');
const rewardMirrorWorld=document.querySelector('#rewardMirrorWorld');
const rewardJourneyFlowers=document.querySelector('#rewardJourneyFlowers');
const rewardJourneyCrystals=document.querySelector('#rewardJourneyCrystals');
const rewardJourneyRain=document.querySelector('#rewardJourneyRain');
const rewardJourneyFire=document.querySelector('#rewardJourneyFire');
const rewardJourneyHarbor=document.querySelector('#rewardJourneyHarbor');
const rewardCatCrop=rewardScene.querySelector('.result-cat-crop');
const livingWorldTemplate=document.querySelector('#livingWorldTemplate');
const windWorldTemplate=document.querySelector('#windWorldTemplate');
const luminWorldTemplate=document.querySelector('#luminWorldTemplate');
const northWorldTemplate=document.querySelector('#northWorldTemplate');
const canopyWorldTemplate=document.querySelector('#canopyWorldTemplate');
const terraceWorldTemplate=document.querySelector('#terraceWorldTemplate');
const oceanWorldTemplate=document.querySelector('#oceanWorldTemplate');
const canyonWorldTemplate=document.querySelector('#canyonWorldTemplate');
const dragonWorldTemplate=document.querySelector('#dragonWorldTemplate');
const mirrorWorldTemplate=document.querySelector('#mirrorWorldTemplate');
const journeyWorldTemplate=document.querySelector('#journeyWorldTemplate');
const starHarborWorldTemplate=document.querySelector('#starHarborWorldTemplate');
const rewardPill=document.querySelector('#rewardPill');
const resultScreen=document.querySelector('#resultScreen');
const battleFxCanvas=document.querySelector('#battleFxCanvas');
const rewardFxCanvas=document.querySelector('#rewardFxCanvas');
const introScreen=document.querySelector('#introScreen');
const introPlayButton=document.querySelector('#introPlayButton');
const introPlayLabel=document.querySelector('#introPlayLabel');
const installGameButton=document.querySelector('#installGameButton');
const installDialog=document.querySelector('#installDialog');
const confirmInstallButton=document.querySelector('#confirmInstallButton');
const continueInBrowserButton=document.querySelector('#continueInBrowserButton');
const installDialogTitle=document.querySelector('#installDialogTitle');
const installHelpText=document.querySelector('#installHelpText');
const shareGameButton=document.querySelector('#shareGameButton');
const shareDialog=document.querySelector('#shareDialog');
const shareUrlInput=document.querySelector('#shareUrlInput');
const copyShareLinkButton=document.querySelector('#copyShareLinkButton');
const shareStatus=document.querySelector('#shareStatus');
const factTableDialog=document.querySelector('#factTableDialog');
const factTableCloseButton=document.querySelector('#factTableCloseButton');
const factTableGrid=document.querySelector('#factTableGrid');
const factTableEquations=document.querySelector('#factTableEquations');
let factTableA=2;
let factTableB=3;
let factTablePausedRound=false;

function renderFactTable(){
  const head=document.createElement('tr');
  head.innerHTML='<th scope="col">×</th>'+Array.from({length:10},(_,index)=>`<th scope="col" data-factor-b="${index+1}">${index+1}</th>`).join('');
  const rows=[head];
  for(let a=1;a<=10;a++){
    const row=document.createElement('tr');
    row.innerHTML=`<th scope="row" data-factor-a="${a}">${a}</th>`+Array.from({length:10},(_,index)=>{
      const b=index+1;
      const classes=[];
      if(a===factTableA&&b<=factTableB)classes.push('is-row-path');
      if(b===factTableB&&a<=factTableA)classes.push('is-column-path');
      if(a===factTableA&&b===factTableB)classes.push('is-result');
      return `<td data-factor-a="${a}" data-factor-b="${b}" class="${classes.join(' ')}">${a*b}</td>`;
    }).join('');
    rows.push(row);
  }
  factTableGrid.replaceChildren(...rows);
  factTableGrid.querySelector(`[data-factor-a="${factTableA}"]`)?.classList.add('is-axis');
  factTableGrid.querySelector(`[data-factor-b="${factTableB}"]`)?.classList.add('is-axis');
  const c=factTableA*factTableB;
  factTableEquations.innerHTML=`<strong>${factTableA} × ${factTableB} = ${c}</strong><strong>${factTableB} × ${factTableA} = ${c}</strong><strong>${c} ÷ ${factTableA} = ${factTableB}</strong><strong>${c} ÷ ${factTableB} = ${factTableA}</strong>`;
}
function openFactTable(){
  factTableA=1+Math.floor(Math.random()*10);
  factTableB=1+Math.floor(Math.random()*10);
  factTablePausedRound=roundActive&&!roundPaused;
  if(factTablePausedRound)pauseRoundForVisibility();
  renderFactTable();
  factTableDialog.showModal();
}
function closeFactTable(){
  factTableDialog.close();
  if(factTablePausedRound)resumeRoundFromVisibility();
  factTablePausedRound=false;
}

function mountLivingWorld(container){
  if(!container||!livingWorldTemplate)return;
  container.append(livingWorldTemplate.content.cloneNode(true));
}

function mountWindWorld(container){
  if(!container||!windWorldTemplate)return;
  container.append(windWorldTemplate.content.cloneNode(true));
}
function mountLuminWorld(container){
  if(!container||!luminWorldTemplate)return;
  container.append(luminWorldTemplate.content.cloneNode(true));
}
function mountNorthWorld(container){
  if(!container||!northWorldTemplate)return;
  container.append(northWorldTemplate.content.cloneNode(true));
}
function mountCanopyWorld(container){
  if(!container||!canopyWorldTemplate)return;
  container.append(canopyWorldTemplate.content.cloneNode(true));
}
function mountTerraceWorld(container){
  if(!container||!terraceWorldTemplate)return;
  container.append(terraceWorldTemplate.content.cloneNode(true));
}
function mountOceanWorld(container){
  if(!container||!oceanWorldTemplate)return;
  container.append(oceanWorldTemplate.content.cloneNode(true));
}
function mountCanyonWorld(container){
  if(!container||!canyonWorldTemplate)return;
  container.append(canyonWorldTemplate.content.cloneNode(true));
}
function mountDragonWorld(container){
  if(!container||!dragonWorldTemplate)return;
  container.append(dragonWorldTemplate.content.cloneNode(true));
}
function mountMirrorWorld(container){
  if(!container||!mirrorWorldTemplate)return;
  container.append(mirrorWorldTemplate.content.cloneNode(true));
}
function mountJourneyWorld(container){
  if(!container||!journeyWorldTemplate)return;
  container.append(journeyWorldTemplate.content.cloneNode(true));
}
function mountStarHarborWorld(container){
  if(!container||!starHarborWorldTemplate)return;
  container.append(starHarborWorldTemplate.content.cloneNode(true));
}

mountLivingWorld(storyTwo);
mountLivingWorld(rewardLivingWorld);
mountWindWorld(storyThree);
mountWindWorld(rewardWindWorld);
mountLuminWorld(storyFour);
mountLuminWorld(rewardLuminWorld);
mountNorthWorld(storyFive);
mountNorthWorld(rewardNorthWorld);
mountCanopyWorld(storySix);
mountCanopyWorld(rewardCanopyWorld);
mountTerraceWorld(storySeven);
mountTerraceWorld(rewardTerraceWorld);
mountOceanWorld(storyEight);
mountOceanWorld(rewardOceanWorld);
mountCanyonWorld(storyNine);
mountCanyonWorld(rewardCanyonWorld);
mountDragonWorld(storyTen);
mountDragonWorld(rewardDragonWorld);
mountMirrorWorld(storyEleven);
mountMirrorWorld(rewardMirrorWorld);
[
  storyTwelve,storyThirteen,storyFourteen,storyFifteen,
  rewardJourneyFlowers,rewardJourneyCrystals,rewardJourneyRain,rewardJourneyFire
].forEach(mountJourneyWorld);
[storySixteen,rewardJourneyHarbor].forEach(mountStarHarborWorld);

const CHAPTER_CONFIG=window.EDUKASS_CHAPTER_ONE;
if(!CHAPTER_CONFIG)throw new Error('EDUKASS chapter configuration was not loaded.');
const I18N_API=window.EDUKASS_I18N;
if(!I18N_API)throw new Error('EDUKASS language system was not loaded.');
const QUESTION_ENGINE_API=window.EDUKASS_QUESTION_ENGINE;
if(!QUESTION_ENGINE_API)throw new Error('EDUKASS question engine was not loaded.');
const PROGRESS_STORE_API=window.EDUKASS_PROGRESS_STORE;
if(!PROGRESS_STORE_API)throw new Error('EDUKASS progress store was not loaded.');

const requestedLanguage=new URLSearchParams(location.search).get('lang')||document.documentElement.lang;
const i18n=I18N_API.create({
  locales:window.EDUKASS_LOCALES,
  defaultLanguage:CHAPTER_CONFIG.defaultLanguage,
  supportedLanguages:CHAPTER_CONFIG.supportedLanguages,
  requestedLanguage
});
i18n.apply(document);
const t=i18n.t;

const STORAGE_KEY=CHAPTER_CONFIG.storage.progressKey;
const SOUND_KEY=CHAPTER_CONFIG.storage.soundKey;
const INTRO_SEEN_KEY=CHAPTER_CONFIG.storage.introKey;
const ROUND_LENGTH=CHAPTER_CONFIG.roundLength;
const DEFAULT_PRACTICE_TABLE=CHAPTER_CONFIG.practiceTable;
const LESSON_CONFIG=CHAPTER_CONFIG.lesson;
const LESSON_TRIGGERS=LESSON_CONFIG.triggers||[];
const LESSONS_BY_ID=new Map(LESSON_TRIGGERS.map(lesson=>[lesson.id,lesson]));
const LESSONS_BY_MISSION=new Map(LESSON_TRIGGERS.map(lesson=>[lesson.missionId,lesson]));
const CHAPTERS=CHAPTER_CONFIG.chapters||[];
const STORY_CONFIG=CHAPTER_CONFIG.story;
const DIVISION_MISSION_ID=LESSON_CONFIG.divisionMissionId;
const STORY_SEGMENT_LENGTH=STORY_CONFIG.segmentLength;
const SHIP_MISSION_ID=STORY_CONFIG.shipMissionId;
const ENGINE_MISSION_ID=STORY_CONFIG.engineMissionId;
const FINAL_MISSION_ID=STORY_CONFIG.finalMissionId;
const CHAPTER_TWO_STORY=STORY_CONFIG.chapterTwo||{};
const CHAPTER_TWO_WORLD_STEPS=CHAPTER_TWO_STORY.worldSteps||[];
const CHAPTER_TWO_WORLD_STEP_COUNT=CHAPTER_TWO_WORLD_STEPS.length;
const CHAPTER_THREE_STORY=STORY_CONFIG.chapterThree||{};
const CHAPTER_THREE_WORLD_STEPS=CHAPTER_THREE_STORY.worldSteps||[];
const CHAPTER_THREE_WORLD_STEP_COUNT=CHAPTER_THREE_WORLD_STEPS.length;
const CHAPTER_FOUR_STORY=STORY_CONFIG.chapterFour||{};
const CHAPTER_FOUR_WORLD_STEPS=CHAPTER_FOUR_STORY.worldSteps||[];
const CHAPTER_FOUR_WORLD_STEP_COUNT=CHAPTER_FOUR_WORLD_STEPS.length;
const CHAPTER_FIVE_STORY=STORY_CONFIG.chapterFive||{};
const CHAPTER_FIVE_WORLD_STEPS=CHAPTER_FIVE_STORY.worldSteps||[];
const CHAPTER_FIVE_WORLD_STEP_COUNT=CHAPTER_FIVE_WORLD_STEPS.length;
const CHAPTER_SIX_STORY=STORY_CONFIG.chapterSix||{};
const CHAPTER_SIX_WORLD_STEPS=CHAPTER_SIX_STORY.worldSteps||[];
const CHAPTER_SIX_WORLD_STEP_COUNT=CHAPTER_SIX_WORLD_STEPS.length;
const CHAPTER_SEVEN_STORY=STORY_CONFIG.chapterSeven||{};
const CHAPTER_SEVEN_WORLD_STEPS=CHAPTER_SEVEN_STORY.worldSteps||[];
const CHAPTER_SEVEN_WORLD_STEP_COUNT=CHAPTER_SEVEN_WORLD_STEPS.length;
const CHAPTER_EIGHT_STORY=STORY_CONFIG.chapterEight||{};
const CHAPTER_EIGHT_WORLD_STEPS=CHAPTER_EIGHT_STORY.worldSteps||[];
const CHAPTER_EIGHT_WORLD_STEP_COUNT=CHAPTER_EIGHT_WORLD_STEPS.length;
const CHAPTER_NINE_STORY=STORY_CONFIG.chapterNine||{};
const CHAPTER_NINE_WORLD_STEPS=CHAPTER_NINE_STORY.worldSteps||[];
const CHAPTER_NINE_WORLD_STEP_COUNT=CHAPTER_NINE_WORLD_STEPS.length;
const CHAPTER_TEN_STORY=STORY_CONFIG.chapterTen||{};
const CHAPTER_TEN_WORLD_STEPS=CHAPTER_TEN_STORY.worldSteps||[];
const CHAPTER_TEN_WORLD_STEP_COUNT=CHAPTER_TEN_WORLD_STEPS.length;
const CHAPTER_ELEVEN_STORY=STORY_CONFIG.chapterEleven||{};
const CHAPTER_ELEVEN_WORLD_STEPS=CHAPTER_ELEVEN_STORY.worldSteps||[];
const CHAPTER_ELEVEN_WORLD_STEP_COUNT=CHAPTER_ELEVEN_WORLD_STEPS.length;
const JOURNEY_CHAPTERS=[
  {id:12,story:STORY_CONFIG.chapterTwelve||{},map:storyTwelve,reward:rewardJourneyFlowers,theme:'flowers',titles:['Saabumine hiidlillede planeedile','Vesi hakkab õitsema','Lilleelanikud ärkavad','Kogu planeet õitseb']},
  {id:13,story:STORY_CONFIG.chapterThirteen||{},map:storyThirteen,reward:rewardJourneyCrystals,theme:'observatory',titles:['Saabumine taevase vaatluskeskuse juurde','Kuldsed orbiidid süttivad','Tähevaatlejad ärkavad','Suur täheseade hakkab tööle']},
  {id:14,story:STORY_CONFIG.chapterFourteen||{},map:storyFourteen,reward:rewardJourneyRain,theme:'clouds',titles:['Saabumine pilvede ookeanile','Saared tõusevad pilvedest','Lendavad elanikud ilmuvad','Taevavaal äratab maailma']},
  {id:15,story:STORY_CONFIG.chapterFifteen||{},map:storyFifteen,reward:rewardJourneyFire,theme:'tree',titles:['Saabumine hiigelpuu sisse','Puulinn hakkab kasvama','Seemneelanikud ilmuvad','Kogu puulinn ärkab ellu']},
  {id:16,story:STORY_CONFIG.chapterSixteen||{},map:storySixteen,reward:rewardJourneyHarbor,theme:'harbor',titles:['Saabumine täheväravasse','Kosmosemajakas saadab signaali','Sõbrad kogunevad suurde sadamasse','Uus teekond algab']}
].map(item=>({...item,steps:item.story.worldSteps||[]}));
const LAST_MISSION_ID=CHAPTER_CONFIG.missions[CHAPTER_CONFIG.missions.length-1].id;
const CHAPTER_END_IDS=new Set(CHAPTERS.map(chapter=>chapter.endMissionId));
const PLANET_MISSION_IDS=new Set(STORY_CONFIG.planetMissionIds);
const ANSWER_DELAYS={exact:480,possiblePrefix:2200,wrong:1050};
const START_SHOWER_PROGRESS=.08;
const WRONG_ANSWER_ADVANCE=.105;
const NAVIGATION_MARKER='edukass-game-v28';
const MAP_PREVIEW_MISSION_KEY='edukass-map-preview-mission-v83';
const REWARD_BEFORE_HOLD=350;
const INTRO_READY_DELAY=2200;
const INTRO_EXIT_DELAY=1720;
const SHARE_URL='https://edukass.ee/games/korrutamine-test/';

const LEVELS=CHAPTER_CONFIG.missions.map(mission=>({
  id:mission.id,
  title:t(mission.titleKey,{},mission.title),
  short:t(mission.shortKey,{},mission.short),
  mode:mission.mode,
  operation:mission.operation,
  seconds:mission.seconds,
  accent:mission.accent,
  chapterId:mission.chapterId||CHAPTERS.find(chapter=>mission.id>=chapter.startMissionId&&mission.id<=chapter.endMissionId)?.id||1
}));
const LEVEL_IDS=new Set(LEVELS.map(level=>level.id));

const progressStore=PROGRESS_STORE_API.create({
  storage:localStorage,
  key:STORAGE_KEY,
  schemaVersion:CHAPTER_CONFIG.storage.progressSchemaVersion,
  maxLevel:LEVELS.length
});
let progress=loadProgress();
const questionEngine=QUESTION_ENGINE_API.create({
  config:CHAPTER_CONFIG,
  getFactStats:()=>progress.factStats
});
const {
  avoidAdjacentDuplicates,
  buildChoiceOptions,
  buildLevelQuestions,
  equationKey,
  questionKey,
  separatorQuestion
}=questionEngine;
let currentLevel=null;
let currentQuestion=null;
let questionQueue=[];
let currentAnswer='';
let correct=0;
let mistakes=0;
let inputLocked=false;
let roundActive=false;
let battleStartedAt=0;
let showerProgress=0;
let motionFrame=null;
let lastMotionTime=null;
let autoCheckTimer=null;
let currentLesson=LESSONS_BY_ID.get(LESSON_CONFIG.initialLessonId)||LESSON_TRIGGERS[0]||{id:'multiply-2',missionId:1,mode:LESSON_CONFIG.initialMode,table:DEFAULT_PRACTICE_TABLE};
let currentLessonMode=currentLesson.mode;
let currentLessonTable=currentLesson.table||DEFAULT_PRACTICE_TABLE;
let pendingLevelAfterLesson=null;
let resultAction='map';
let soundEnabled=loadSoundPreference();
let audioContext=null;
let noiseBuffer=null;
let dangerStage=0;
let lastDangerBeat=0;
let impactTimer=null;
let cinematicTimers=[];
let lastQuestionEquationKey='';
let introReadyTimer=null;
let introExitTimer=null;
let deferredInstallPrompt=null;
let roundPaused=false;
let pausedAt=0;
let totalPausedTime=0;
let lastSuccessfulPlayedMissionId=null;

function navigationState(view,details={}){
  return {marker:NAVIGATION_MARKER,view,...details};
}

function navigationHash(view,details={}){
  if(view==='map')return '#missions';
  if(view==='explanations')return '#explanations';
  if(view==='lesson')return `#explanation-${details.mode==='divide'?'division':'multiplication'}`;
  if(view==='battle')return `#mission-${details.levelId}`;
  if(view==='result')return '#mission-result';
  return '';
}

function writeNavigationState(view,details={},mode='push'){
  const state=navigationState(view,details);
  const url=`${location.pathname}${location.search}${navigationHash(view,details)}`;
  if(mode==='replace')history.replaceState(state,'',url);
  else history.pushState(state,'',url);
}

function defaultProgress(){
  return progressStore.defaultProgress();
}

function loadProgress(){
  return progressStore.load();
}

function saveProgress(){
  progress=progressStore.save(progress);
}

function loadSoundPreference(){
  return localStorage.getItem(SOUND_KEY)!=='false';
}

function updateSoundButton(){
  soundToggleButton.textContent=soundEnabled?'🔊':'🔇';
  soundToggleButton.setAttribute('aria-pressed',String(soundEnabled));
  soundToggleButton.setAttribute('aria-label',soundEnabled?t('sound.offAria'):t('sound.onAria'));
}

function toggleSound(){
  soundEnabled=!soundEnabled;
  localStorage.setItem(SOUND_KEY,String(soundEnabled));
  if(!soundEnabled&&audioContext){
    audioContext.close();
    audioContext=null;
    noiseBuffer=null;
  }
  updateSoundButton();
  if(soundEnabled)playSound('key');
}

function openShareFallback(){
  shareUrlInput.value=SHARE_URL;
  shareStatus.textContent='';
  if(typeof shareDialog.showModal==='function')shareDialog.showModal();
  else window.prompt(t('share.copyFailed'),SHARE_URL);
}

async function shareGame(){
  if(typeof navigator.share!=='function'){
    openShareFallback();
    return;
  }
  try{
    await navigator.share({
      title:t('share.title'),
      text:t('share.nativeText'),
      url:SHARE_URL
    });
  }catch(error){
    if(error?.name!=='AbortError')openShareFallback();
  }
}

async function copyShareLink(){
  let copied=false;
  try{
    if(navigator.clipboard&&window.isSecureContext){
      await navigator.clipboard.writeText(SHARE_URL);
      copied=true;
    }
  }catch(error){
    copied=false;
  }
  if(!copied){
    shareUrlInput.focus();
    shareUrlInput.select();
    try{
      copied=document.execCommand('copy');
    }catch(error){
      copied=false;
    }
  }
  shareStatus.textContent=copied?t('share.copied'):t('share.copyFailed');
}

function getAudioContext(){
  if(!soundEnabled)return null;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return null;
  if(!audioContext)audioContext=new AudioContextClass();
  if(audioContext.state==='suspended')audioContext.resume();
  return audioContext;
}

function playTone(frequency,startOffset,duration,volume,type='sine'){
  const context=getAudioContext();
  if(!context)return;
  const oscillator=context.createOscillator();
  const gain=context.createGain();
  const startsAt=context.currentTime+startOffset;
  const endsAt=startsAt+duration;
  oscillator.type=type;
  oscillator.frequency.setValueAtTime(frequency,startsAt);
  gain.gain.setValueAtTime(.0001,startsAt);
  gain.gain.exponentialRampToValueAtTime(volume,startsAt+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,endsAt);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(endsAt+.02);
}

function playSweep(fromFrequency,toFrequency,startOffset,duration,volume,type='sine'){
  const context=getAudioContext();
  if(!context)return;
  const oscillator=context.createOscillator();
  const gain=context.createGain();
  const startsAt=context.currentTime+startOffset;
  const endsAt=startsAt+duration;
  oscillator.type=type;
  oscillator.frequency.setValueAtTime(fromFrequency,startsAt);
  oscillator.frequency.exponentialRampToValueAtTime(toFrequency,endsAt);
  gain.gain.setValueAtTime(.0001,startsAt);
  gain.gain.exponentialRampToValueAtTime(volume,startsAt+.035);
  gain.gain.exponentialRampToValueAtTime(.0001,endsAt);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(endsAt+.03);
}

function playChord(frequencies,startOffset,duration,volume=.018){
  frequencies.forEach((frequency,index)=>playTone(frequency,startOffset+(index*.018),duration,volume,'sine'));
}

function getNoiseBuffer(context){
  if(noiseBuffer&&noiseBuffer.sampleRate===context.sampleRate)return noiseBuffer;
  const length=context.sampleRate*2;
  noiseBuffer=context.createBuffer(1,length,context.sampleRate);
  const data=noiseBuffer.getChannelData(0);
  for(let index=0;index<length;index++)data[index]=(Math.random()*2)-1;
  return noiseBuffer;
}

function playNoise(startOffset,duration,volume=.05,frequency=1200,filterType='lowpass'){
  const context=getAudioContext();
  if(!context)return;
  const source=context.createBufferSource();
  const filter=context.createBiquadFilter();
  const gain=context.createGain();
  const startsAt=context.currentTime+startOffset;
  const endsAt=startsAt+duration;
  source.buffer=getNoiseBuffer(context);
  filter.type=filterType;
  filter.frequency.setValueAtTime(frequency,startsAt);
  if(filterType==='lowpass')filter.frequency.exponentialRampToValueAtTime(Math.max(90,frequency*.24),endsAt);
  gain.gain.setValueAtTime(.0001,startsAt);
  gain.gain.exponentialRampToValueAtTime(volume,startsAt+.018);
  gain.gain.exponentialRampToValueAtTime(.0001,endsAt);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(startsAt);
  source.stop(endsAt+.03);
}

function playPitchDrop(fromFrequency,toFrequency,startOffset,duration,volume=.08,type='sine'){
  const context=getAudioContext();
  if(!context)return;
  const oscillator=context.createOscillator();
  const gain=context.createGain();
  const startsAt=context.currentTime+startOffset;
  const endsAt=startsAt+duration;
  oscillator.type=type;
  oscillator.frequency.setValueAtTime(fromFrequency,startsAt);
  oscillator.frequency.exponentialRampToValueAtTime(toFrequency,endsAt);
  gain.gain.setValueAtTime(.0001,startsAt);
  gain.gain.exponentialRampToValueAtTime(volume,startsAt+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,endsAt);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(endsAt+.03);
}

function playSound(kind){
  if(!soundEnabled)return;
  if(kind==='key')playTone(430,0,.045,.025,'sine');
  if(kind==='correct'){
    playTone(620,0,.075,.035,'sine');
    playTone(820,.085,.09,.035,'sine');
  }
  if(kind==='missionComplete'){
    playTone(659,0,.16,.026,'sine');
    playTone(784,.12,.2,.028,'sine');
    playTone(988,.28,.34,.031,'sine');
    playChord([523,659,784],.42,.42,.013);
  }
  if(kind==='wrong'){
    playTone(250,0,.11,.032,'triangle');
    playTone(185,.09,.13,.026,'triangle');
  }
  if(kind==='dangerRise'){
    playSweep(230,510,0,.24,.038,'triangle');
    playTone(115,.05,.28,.045,'sine');
  }
  if(kind==='dangerBeat'){
    playPitchDrop(92,61,0,.16,.06,'sine');
    playPitchDrop(82,54,.21,.19,.052,'sine');
  }
  if(kind==='impact'){
    playNoise(0,.12,.085,4200,'highpass');
    playNoise(.035,.78,.17,1250,'lowpass');
    playPitchDrop(128,34,.02,.86,.16,'sine');
    playPitchDrop(76,29,.16,1.15,.12,'triangle');
    playTone(520,.03,.08,.05,'square');
    playTone(1550,.11,.08,.035,'triangle');
    playChord([196,247,294],.86,.7,.028);
  }
  if(kind==='reward'){
    playTone(620,0,.08,.03,'sine');
    playTone(820,.09,.1,.035,'sine');
    playTone(1040,.2,.14,.035,'sine');
  }
  if(kind==='launch'){
    playTone(330,0,.12,.028,'sine');
    playTone(520,.12,.16,.034,'sine');
    playTone(780,.28,.2,.04,'sine');
  }
  if(kind==='storyStep'){
    playSweep(460,760,0,.32,.024,'sine');
    playTone(920,.26,.18,.027,'sine');
    playTone(1180,.42,.22,.021,'sine');
  }
  if(kind==='worldAwaken'){
    playTone(523,0,.16,.018,'sine');
    playSweep(430,780,.08,.48,.018,'sine');
    playTone(659,.42,.18,.016,'triangle');
    playTone(880,.62,.24,.014,'sine');
  }
  if(kind==='rewardReveal'){
    playSweep(260,920,.18,.82,.038,'sine');
    playNoise(.28,.62,.028,2800,'highpass');
    playTone(740,1.03,.09,.038,'triangle');
    playTone(1040,1.12,.18,.042,'sine');
    playChord([523,659,784],1.28,.52,.028);
  }
  if(kind==='shipFound'){
    [0,.18,.36,.54,.72].forEach((offset,index)=>{
      playTone(390+(index*72),offset,.09,.044,'triangle');
      playNoise(offset,.07,.025,2400,'bandpass');
    });
    playSweep(240,720,.78,.7,.052,'sine');
    playNoise(1.05,.58,.055,2100,'highpass');
    playChord([523,659,784],1.42,.65,.036);
  }
  if(kind==='engineStart'){
    [0,.2,.4,.6,.8].forEach((offset,index)=>playTone(105+(index*17),offset,.16,.052,'sawtooth'));
    playNoise(.72,1.55,.12,720,'lowpass');
    playPitchDrop(98,43,.78,1.25,.11,'sawtooth');
    playSweep(82,310,.82,1.2,.063,'sawtooth');
    playChord([392,494,587],1.72,.75,.038);
    playTone(988,2.05,.42,.04,'sine');
  }
  if(kind==='portalOpen'){
    playNoise(0,1.8,.075,4200,'highpass');
    playSweep(180,1320,0,1.85,.047,'sine');
    [392,494,587,784,988].forEach((frequency,index)=>playTone(frequency,.18+(index*.25),.32,.036,'sine'));
    playChord([523,659,784,1047],1.65,.9,.033);
    playNoise(2.16,1.15,.14,980,'lowpass');
    playPitchDrop(105,31,2.28,1.1,.12,'sawtooth');
    playSweep(145,620,2.35,.95,.061,'sawtooth');
    playTone(1318,3.05,.62,.037,'sine');
  }
  if(kind==='introIgnition'){
    playTone(440,0,.09,.035,'triangle');
    playTone(620,.17,.1,.04,'triangle');
    playTone(860,.34,.13,.045,'triangle');
    playSweep(105,360,.4,.78,.055,'sawtooth');
    playNoise(.42,.9,.07,820,'lowpass');
    playChord([523,659,784],.78,.62,.032);
    playSweep(380,1320,.92,.46,.038,'sine');
  }
}

class ParticleStage{
  constructor(canvas){
    this.canvas=canvas;
    this.context=canvas?.getContext('2d')||null;
    this.particles=[];
    this.rings=[];
    this.frame=null;
    this.lastTime=0;
    this.lastAmbientSpawn=0;
    this.ambient=0;
    this.running=false;
    this.resizeObserver=null;
    if(canvas&&this.context&&'ResizeObserver' in window){
      this.resizeObserver=new ResizeObserver(()=>this.resize());
      this.resizeObserver.observe(canvas);
    }
  }

  resize(){
    if(!this.canvas||!this.context)return;
    const rect=this.canvas.getBoundingClientRect();
    const density=Math.min(2,window.devicePixelRatio||1);
    const width=Math.max(1,Math.round(rect.width*density));
    const height=Math.max(1,Math.round(rect.height*density));
    if(this.canvas.width!==width||this.canvas.height!==height){
      this.canvas.width=width;
      this.canvas.height=height;
    }
    this.context.setTransform(density,0,0,density,0,0);
    this.width=rect.width;
    this.height=rect.height;
  }

  start(){
    if(!this.context||this.running)return;
    this.resize();
    this.running=true;
    this.lastTime=performance.now();
    this.frame=requestAnimationFrame(time=>this.tick(time));
  }

  stop(clear=true){
    this.running=false;
    cancelAnimationFrame(this.frame);
    this.frame=null;
    this.ambient=0;
    if(clear){
      this.particles.length=0;
      this.rings.length=0;
      this.context?.clearRect(0,0,this.width||0,this.height||0);
    }
  }

  setAmbient(value){
    this.ambient=Math.max(0,Math.min(1,value));
    if(this.ambient>0)this.start();
  }

  sparkBurst(nx,ny,count=32,palette=['#fff','#ffd34d','#70d9cf'],power=1){
    if(!this.context)return;
    this.resize();
    const x=(this.width||1)*nx;
    const y=(this.height||1)*ny;
    for(let index=0;index<count;index++){
      const angle=(Math.PI*2*index/count)+(Math.random()*.36);
      const speed=(75+Math.random()*230)*power;
      const life=.45+Math.random()*.75;
      this.particles.push({
        kind:'spark',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
        gravity:115*power,drag:.985,life,maxLife:life,size:1.6+Math.random()*4.2,
        color:palette[index%palette.length],trail:5+Math.random()*13
      });
    }
    this.start();
  }

  dustBurst(nx,ny,count=26,palette=['#ff9a3c','#ffd34d','#7355b7']){
    if(!this.context)return;
    this.resize();
    const x=(this.width||1)*nx;
    const y=(this.height||1)*ny;
    for(let index=0;index<count;index++){
      const spread=(Math.random()-.5)*Math.PI*.9;
      const angle=(-Math.PI/2)+spread;
      const speed=45+Math.random()*145;
      const life=.65+Math.random()*.9;
      this.particles.push({kind:'dust',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,gravity:85,drag:.965,life,maxLife:life,size:5+Math.random()*13,color:palette[index%palette.length]});
    }
    this.start();
  }

  shockwave(nx,ny,color='#fff',power=1){
    this.resize();
    this.rings.push({x:(this.width||1)*nx,y:(this.height||1)*ny,radius:8,maxRadius:Math.min(this.width||400,this.height||300)*(.42*power),life:.72,maxLife:.72,color,width:5});
    this.start();
  }

  meteor(intensity=1){
    this.resize();
    const width=this.width||400;
    const height=this.height||300;
    const x=Math.random()*width*.92;
    const speed=310+(Math.random()*260*intensity);
    const life=(height*.78)/speed;
    this.particles.push({kind:'meteor',x,y:-24,vx:55+Math.random()*65,vy:speed,gravity:45,drag:1,life,maxLife:life,size:2.5+Math.random()*5,color:Math.random()>.35?'#ffd34d':'#fff',trail:35+Math.random()*45});
    this.start();
  }

  tick(time){
    if(!this.running||!this.context)return;
    const delta=Math.min(.034,Math.max(.001,(time-this.lastTime)/1000));
    this.lastTime=time;
    this.resize();
    const context=this.context;
    context.clearRect(0,0,this.width||0,this.height||0);

    if(this.ambient>0&&time-this.lastAmbientSpawn>(220-(this.ambient*150))){
      this.lastAmbientSpawn=time;
      this.meteor(.75+this.ambient);
      if(this.ambient>.76&&Math.random()>.55)this.meteor(1.3);
    }

    this.particles.forEach(particle=>{
      particle.life-=delta;
      particle.vy+=particle.gravity*delta;
      particle.vx*=Math.pow(particle.drag,delta*60);
      particle.vy*=Math.pow(particle.drag,delta*60);
      particle.x+=particle.vx*delta;
      particle.y+=particle.vy*delta;
      const alpha=Math.max(0,Math.min(1,particle.life/particle.maxLife));
      context.save();
      context.globalAlpha=particle.kind==='dust'?alpha*.48:Math.min(1,alpha*1.8);
      context.fillStyle=particle.color;
      context.strokeStyle=particle.color;
      context.shadowColor=particle.color;
      context.shadowBlur=particle.kind==='dust'?3:12;
      if(particle.kind==='meteor'||particle.kind==='spark'){
        const length=particle.trail||9;
        const magnitude=Math.max(1,Math.hypot(particle.vx,particle.vy));
        context.lineWidth=particle.size;
        context.lineCap='round';
        context.beginPath();
        context.moveTo(particle.x,particle.y);
        context.lineTo(particle.x-(particle.vx/magnitude)*length,particle.y-(particle.vy/magnitude)*length);
        context.stroke();
        context.beginPath();
        context.arc(particle.x,particle.y,particle.size*.75,0,Math.PI*2);
        context.fill();
      }else{
        context.beginPath();
        context.arc(particle.x,particle.y,particle.size,0,Math.PI*2);
        context.fill();
      }
      context.restore();
    });
    this.particles=this.particles.filter(particle=>particle.life>0&&particle.y<(this.height||500)+100);

    this.rings.forEach(ring=>{
      ring.life-=delta;
      const progress=1-(ring.life/ring.maxLife);
      ring.radius=ring.maxRadius*(1-Math.pow(1-progress,3));
      context.save();
      context.globalAlpha=Math.max(0,1-progress);
      context.strokeStyle=ring.color;
      context.shadowColor=ring.color;
      context.shadowBlur=18;
      context.lineWidth=Math.max(1,ring.width*(1-progress));
      context.beginPath();
      context.arc(ring.x,ring.y,ring.radius,0,Math.PI*2);
      context.stroke();
      context.restore();
    });
    this.rings=this.rings.filter(ring=>ring.life>0);

    if(this.ambient>0||this.particles.length||this.rings.length)this.frame=requestAnimationFrame(next=>this.tick(next));
    else this.running=false;
  }
}

const battleFx=new ParticleStage(battleFxCanvas);
const rewardFx=new ParticleStage(rewardFxCanvas);

function clearCinematicTimers(){
  cinematicTimers.forEach(timer=>clearTimeout(timer));
  cinematicTimers=[];
}

function scheduleCinematic(delay,callback){
  cinematicTimers.push(setTimeout(callback,delay));
}

function showScreen(id,{historyMode='push',historyView=null,historyData={}}={}){
  if(id!=='resultScreen'){
    clearCinematicTimers();
    rewardFx.stop();
  }
  screens.forEach(screen=>screen.classList.toggle('is-active',screen.id===id));
  if(historyMode!=='none'&&historyView)writeNavigationState(historyView,historyData,historyMode);
  window.scrollTo({top:0,behavior:'smooth'});
}

function recordFact(question,isCorrect){
  const key=questionKey(question);
  const stat=progress.factStats[key]||{correct:0,mistakes:0};
  stat[isCorrect?'correct':'mistakes']++;
  progress.factStats[key]=stat;
  saveProgress();
}

function buildStars(){
  const glyphs=['★','✦','✧','✦'];
  let seed=7349;
  const random=()=>{
    seed=(seed*9301+49297)%233280;
    return seed/233280;
  };
  const stars=[];
  for(let index=0;index<34;index++){
    const star=document.createElement('span');
    star.textContent=glyphs[index%glyphs.length];
    star.style.setProperty('--x',`${4+random()*92}%`);
    star.style.setProperty('--y',`${random()*92}%`);
    star.style.setProperty('--size',`${12+random()*20}px`);
    star.style.setProperty('--delay',`${-random()*2.8}s`);
    star.style.setProperty('--drift',`${-8+random()*16}px`);
    stars.push(star);
  }
  starCurtain.replaceChildren(...stars);
}

function lessonForMission(levelId){
  return LESSONS_BY_MISSION.get(levelId)||null;
}

function hasSeenLesson(lesson){
  if(!lesson)return true;
  if(progress.lessonSeen?.[lesson.id])return true;
  if(lesson.id==='multiply-2')return Boolean(progress.multiplicationLessonSeen);
  if(lesson.id==='divide-2')return Boolean(progress.divisionLessonSeen);
  return false;
}

function markLessonSeen(lesson){
  if(!lesson)return;
  progress.lessonSeen={...(progress.lessonSeen||{}),[lesson.id]:true};
  if(lesson.id==='multiply-2')progress.multiplicationLessonSeen=true;
  if(lesson.id==='divide-2')progress.divisionLessonSeen=true;
}

function resolveLesson(reference){
  if(reference&&typeof reference==='object')return reference;
  if(LESSONS_BY_ID.has(reference))return LESSONS_BY_ID.get(reference);
  if(reference===LESSON_CONFIG.divisionMode)return LESSON_TRIGGERS.find(lesson=>lesson.mode==='divide'&&lesson.table===DEFAULT_PRACTICE_TABLE)||currentLesson;
  if(reference===LESSON_CONFIG.initialMode)return LESSONS_BY_ID.get(LESSON_CONFIG.initialLessonId)||currentLesson;
  return LESSONS_BY_ID.get(LESSON_CONFIG.initialLessonId)||currentLesson;
}

function updateDemo(factor){
  const product=factor*currentLessonTable;
  demoOneLabel.textContent='×1';
  demoMultiplyLabel.textContent=`×${currentLessonTable}`;
  demoDivisionLabel.textContent=`÷${currentLessonTable}`;
  demoOneEquation.textContent=`${factor} × 1 = ${factor}`;
  demoMultiplyEquation.textContent=`${factor} × ${currentLessonTable} = ${product}`;
  demoDivisionEquation.textContent=`${product} ÷ ${currentLessonTable} = ${factor}`;
  document.querySelectorAll('[data-demo-factor]').forEach(button=>button.classList.toggle('active',Number(button.dataset.demoFactor)===factor));

  const buildGroups=(groupCount,{division=false,value=factor}={})=>{
    const groups=[];
    for(let groupIndex=0;groupIndex<groupCount;groupIndex++){
      const group=document.createElement('span');
      group.className=`quantity-group${division?' division-group':''}`;
      const valueLabel=document.createElement('strong');
      valueLabel.textContent=String(value);
      group.append(valueLabel);
      groups.push(group);
    }
    return groups;
  };

  demoOneStars.replaceChildren(...buildGroups(factor,{value:1}));
  demoStars.replaceChildren(...buildGroups(factor,{value:currentLessonTable}));
  demoDivisionStars.replaceChildren(...buildGroups(currentLessonTable,{division:true}));
}

function configureDemoPicker(division){
  factorPicker.setAttribute('aria-label',division?t('lesson.dividendAria'):t('lesson.factorAria'));
  explorerHint.textContent=division?t('lesson.hintDivide'):t('lesson.hintMultiply');
  document.querySelectorAll('[data-demo-factor]').forEach((button,index)=>{
    const factor=index+1;
    button.dataset.demoFactor=String(factor);
    button.textContent=String(division?factor*currentLessonTable:factor);
    button.setAttribute('aria-label',division
      ?t('lesson.dividendValueAria',{value:factor*currentLessonTable})
      :t('lesson.numberAria',{value:factor}));
  });
}

function showLesson(lessonReference=LESSON_CONFIG.initialLessonId,pendingLevel=null,{historyMode='push'}={}){
  stopRound();
  currentLesson=resolveLesson(lessonReference);
  currentLessonMode=currentLesson.mode;
  currentLessonTable=currentLesson.table||DEFAULT_PRACTICE_TABLE;
  pendingLevelAfterLesson=pendingLevel;
  const division=currentLessonMode===LESSON_CONFIG.divisionMode;
  lessonEyebrow.textContent=t(currentLesson.eyebrowKey,{},division?t('lesson.eyebrowDivide'):t('lesson.eyebrowMultiply'));
  lessonTitle.textContent=t(currentLesson.titleKey,{},division?t('lesson.titleDivide'):t('lesson.titleMultiply'));
  // Preserve the compact first explanation, but show the title when a new table begins.
  lessonTitle.hidden=currentLesson.id==='multiply-2';
  multiplicationLesson.hidden=division;
  divisionLesson.hidden=!division;
  // The ×1 lane belongs only to the first combined explanation for 1 and 2.
  // Every later multiplication explanation demonstrates its own table alone.
  demoOneLabel.closest('.demo-one').hidden=division||currentLessonTable!==2;
  lessonSign.textContent=division?`÷${currentLessonTable}`:`×${currentLessonTable}`;
  configureDemoPicker(division);
  updateDemo(LESSON_CONFIG.demoFactor);
  lessonContinueButton.textContent=t('lesson.toExplanations');
  showScreen('lessonScreen',{historyMode,historyView:'lesson',historyData:{lessonId:currentLesson.id,mode:currentLessonMode,pendingLevel}});
}

function configureExplanationChoice(button,lesson,{unlocked,openAria,lockedAria}){
  if(!button||!lesson)return;
  button.disabled=!unlocked;
  button.classList.toggle('locked',!unlocked);
  button.setAttribute('aria-label',unlocked?t(openAria):t(lockedAria));
}

function showExplanationHub({historyMode='push'}={}){
  openFactTable();
  return;
  stopRound();
  const multiplyTwo=LESSONS_BY_ID.get('multiply-2');
  const divideTwo=LESSONS_BY_ID.get('divide-2');
  const multiplyThree=LESSONS_BY_ID.get('multiply-3');
  const divideThree=LESSONS_BY_ID.get('divide-3');
  const multiplyFour=LESSONS_BY_ID.get('multiply-4');
  const divideFour=LESSONS_BY_ID.get('divide-4');
  const multiplyFive=LESSONS_BY_ID.get('multiply-5');
  const divideFive=LESSONS_BY_ID.get('divide-5');
  const multiplySix=LESSONS_BY_ID.get('multiply-6');
  const divideSix=LESSONS_BY_ID.get('divide-6');
  const multiplySeven=LESSONS_BY_ID.get('multiply-7');
  const divideSeven=LESSONS_BY_ID.get('divide-7');
  const multiplyEight=LESSONS_BY_ID.get('multiply-8');
  const divideEight=LESSONS_BY_ID.get('divide-8');
  const multiplyNine=LESSONS_BY_ID.get('multiply-9');
  const divideNine=LESSONS_BY_ID.get('divide-9');
  const multiplyTen=LESSONS_BY_ID.get('multiply-10');
  const divideTen=LESSONS_BY_ID.get('divide-10');
  configureExplanationChoice(repeatMultiplicationButton,multiplyTwo,{
    unlocked:true,
    openAria:'explanations.repeatMultiplicationAria',
    lockedAria:'explanations.repeatMultiplicationAria'
  });
  configureExplanationChoice(repeatDivisionButton,divideTwo,{
    unlocked:hasSeenLesson(divideTwo)||progress.unlockedLevel>=divideTwo.missionId,
    openAria:'explanations.repeatDivisionAria',
    lockedAria:'explanations.lockedDivisionAria'
  });
  configureExplanationChoice(repeatThreeMultiplicationButton,multiplyThree,{
    unlocked:hasSeenLesson(multiplyThree)||progress.unlockedLevel>=multiplyThree.missionId,
    openAria:'explanations.repeatThreeMultiplicationAria',
    lockedAria:'explanations.lockedThreeMultiplicationAria'
  });
  configureExplanationChoice(repeatThreeDivisionButton,divideThree,{
    unlocked:hasSeenLesson(divideThree)||progress.unlockedLevel>=divideThree.missionId,
    openAria:'explanations.repeatThreeDivisionAria',
    lockedAria:'explanations.lockedThreeDivisionAria'
  });
  configureExplanationChoice(repeatFourMultiplicationButton,multiplyFour,{
    unlocked:hasSeenLesson(multiplyFour)||progress.unlockedLevel>=multiplyFour.missionId,
    openAria:'explanations.repeatFourMultiplicationAria',
    lockedAria:'explanations.lockedFourMultiplicationAria'
  });
  configureExplanationChoice(repeatFourDivisionButton,divideFour,{
    unlocked:hasSeenLesson(divideFour)||progress.unlockedLevel>=divideFour.missionId,
    openAria:'explanations.repeatFourDivisionAria',
    lockedAria:'explanations.lockedFourDivisionAria'
  });
  configureExplanationChoice(repeatFiveMultiplicationButton,multiplyFive,{
    unlocked:hasSeenLesson(multiplyFive)||progress.unlockedLevel>=multiplyFive.missionId,
    openAria:'explanations.repeatFiveMultiplicationAria',
    lockedAria:'explanations.lockedFiveMultiplicationAria'
  });
  configureExplanationChoice(repeatFiveDivisionButton,divideFive,{
    unlocked:hasSeenLesson(divideFive)||progress.unlockedLevel>=divideFive.missionId,
    openAria:'explanations.repeatFiveDivisionAria',
    lockedAria:'explanations.lockedFiveDivisionAria'
  });
  configureExplanationChoice(repeatSixMultiplicationButton,multiplySix,{
    unlocked:hasSeenLesson(multiplySix)||progress.unlockedLevel>=multiplySix.missionId,
    openAria:'explanations.repeatSixMultiplicationAria',
    lockedAria:'explanations.lockedSixMultiplicationAria'
  });
  configureExplanationChoice(repeatSixDivisionButton,divideSix,{
    unlocked:hasSeenLesson(divideSix)||progress.unlockedLevel>=divideSix.missionId,
    openAria:'explanations.repeatSixDivisionAria',
    lockedAria:'explanations.lockedSixDivisionAria'
  });
  configureExplanationChoice(repeatSevenMultiplicationButton,multiplySeven,{
    unlocked:hasSeenLesson(multiplySeven)||progress.unlockedLevel>=multiplySeven.missionId,
    openAria:'explanations.repeatSevenMultiplicationAria',
    lockedAria:'explanations.lockedSevenMultiplicationAria'
  });
  configureExplanationChoice(repeatSevenDivisionButton,divideSeven,{
    unlocked:hasSeenLesson(divideSeven)||progress.unlockedLevel>=divideSeven.missionId,
    openAria:'explanations.repeatSevenDivisionAria',
    lockedAria:'explanations.lockedSevenDivisionAria'
  });
  configureExplanationChoice(repeatEightMultiplicationButton,multiplyEight,{
    unlocked:hasSeenLesson(multiplyEight)||progress.unlockedLevel>=multiplyEight.missionId,
    openAria:'explanations.repeatEightMultiplicationAria',
    lockedAria:'explanations.lockedEightMultiplicationAria'
  });
  configureExplanationChoice(repeatEightDivisionButton,divideEight,{
    unlocked:hasSeenLesson(divideEight)||progress.unlockedLevel>=divideEight.missionId,
    openAria:'explanations.repeatEightDivisionAria',
    lockedAria:'explanations.lockedEightDivisionAria'
  });
  configureExplanationChoice(repeatNineMultiplicationButton,multiplyNine,{
    unlocked:hasSeenLesson(multiplyNine)||progress.unlockedLevel>=multiplyNine.missionId,
    openAria:'explanations.repeatNineMultiplicationAria',
    lockedAria:'explanations.lockedNineMultiplicationAria'
  });
  configureExplanationChoice(repeatNineDivisionButton,divideNine,{
    unlocked:hasSeenLesson(divideNine)||progress.unlockedLevel>=divideNine.missionId,
    openAria:'explanations.repeatNineDivisionAria',
    lockedAria:'explanations.lockedNineDivisionAria'
  });
  configureExplanationChoice(repeatTenMultiplicationButton,multiplyTen,{
    unlocked:hasSeenLesson(multiplyTen)||progress.unlockedLevel>=multiplyTen.missionId,
    openAria:'explanations.repeatTenMultiplicationAria',
    lockedAria:'explanations.lockedTenMultiplicationAria'
  });
  configureExplanationChoice(repeatTenDivisionButton,divideTen,{
    unlocked:hasSeenLesson(divideTen)||progress.unlockedLevel>=divideTen.missionId,
    openAria:'explanations.repeatTenDivisionAria',
    lockedAria:'explanations.lockedTenDivisionAria'
  });
  showScreen('explanationScreen',{historyMode,historyView:'explanations'});
}

function completedMissionCount(){
  return new Set(progress.completedLevels.filter(levelId=>LEVEL_IDS.has(levelId))).size;
}

function completedInRange(startMissionId,endMissionId){
  const completedSet=new Set(progress.completedLevels);
  let count=0;
  for(let missionId=startMissionId;missionId<=endMissionId;missionId++)if(completedSet.has(missionId))count++;
  return count;
}

function highestCompletedMissionId(){
  const completed=progress.completedLevels.filter(levelId=>LEVEL_IDS.has(levelId));
  return completed.length?completed[completed.length-1]:0;
}

function getMapPreviewMissionId(){
  if(Number.isInteger(lastSuccessfulPlayedMissionId)&&LEVEL_IDS.has(lastSuccessfulPlayedMissionId))return lastSuccessfulPlayedMissionId;
  const persisted=Number(localStorage.getItem(MAP_PREVIEW_MISSION_KEY));
  if(Number.isInteger(persisted)&&LEVEL_IDS.has(persisted))return persisted;
  const saved=Number(progress.lastSuccessfulMissionId);
  if(Number.isInteger(saved)&&LEVEL_IDS.has(saved))return saved;
  const highest=highestCompletedMissionId();
  if(highest)return highest;
  return Math.max(1,Math.min(progress.unlockedLevel||1,LAST_MISSION_ID));
}

function rememberMapPreviewMission(levelId){
  if(!Number.isInteger(levelId)||!LEVEL_IDS.has(levelId))return;
  lastSuccessfulPlayedMissionId=levelId;
  progress.lastSuccessfulMissionId=levelId;
  try{localStorage.setItem(MAP_PREVIEW_MISSION_KEY,String(levelId))}catch(error){}
}

function getMapStoryMissionLimit(story){
  const previewMissionId=getMapPreviewMissionId();
  if(!story||!Number.isInteger(story.startMissionId)||!Number.isInteger(story.finalMissionId))return null;
  if(previewMissionId<story.startMissionId||previewMissionId>story.finalMissionId)return null;
  return previewMissionId;
}

function completedInRangeForMap(startMissionId,endMissionId,story){
  const limit=getMapStoryMissionLimit(story);
  if(limit===null)return completedInRange(startMissionId,endMissionId);
  return Math.max(0,Math.min(endMissionId,limit)-startMissionId+1);
}

function isMapStoryMissionEarned(missionId,story){
  const limit=getMapStoryMissionLimit(story);
  if(limit!==null)return missionId<=limit;
  return progress.completedLevels.includes(missionId);
}

function activeMapChapter(){
  const openMissionId=Math.max(1,Math.min(progress.unlockedLevel||1,LAST_MISSION_ID));
  return CHAPTERS.find(chapter=>openMissionId>=chapter.startMissionId&&openMissionId<=chapter.endMissionId)
    ||CHAPTERS[CHAPTERS.length-1]
    ||{id:1,titleKey:'chapter.1.title',startMissionId:1,endMissionId:FINAL_MISSION_ID};
}

function previewMapChapter(){
  const previewMissionId=getMapPreviewMissionId();
  return CHAPTERS.find(chapter=>previewMissionId>=chapter.startMissionId&&previewMissionId<=chapter.endMissionId)
    ||activeMapChapter();
}

function syncMapCatVisibility(chapterId){
  if(!storyCatCrop)return;
  const hide=Number(chapterId)>=2;
  storyCatCrop.hidden=hide;
  storyCatCrop.style.display=hide?'none':'';
}

function syncChapterOneOverlayVisibility(chapterId){
  const hide=Number(chapterId)>=2;
  [storyShip,storyPortal,nextPlanet].forEach(element=>{
    if(!element)return;
    element.hidden=hide;
    element.style.display=hide?'none':'';
  });
  if(storyEnergyStream){
    storyEnergyStream.hidden=hide;
    storyEnergyStream.style.display=hide?'none':'';
  }
}

function syncRewardCatVisibility(levelId){
  if(!rewardCatCrop)return;
  const chapterId=LEVELS.find(level=>level.id===levelId)?.chapterId||1;
  const hide=chapterId>=2;
  rewardCatCrop.hidden=hide;
  rewardCatCrop.style.display=hide?'none':'';
}

function renderChapterOneStory(completed){
  const shipProgress=Math.min(STORY_SEGMENT_LENGTH,completed);
  const engineProgress=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,completed-SHIP_MISSION_ID));
  const portalProgress=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,completed-ENGINE_MISSION_ID));
  const phase=completed<SHIP_MISSION_ID?'ship':completed<ENGINE_MISSION_ID?'engine':completed<FINAL_MISSION_ID?'portal':'complete';

  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.className='story-stage chapter-one';
  storyStage.classList.remove('chapter-two');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active');
  storyStage.classList.remove('chapter-three');
  storyStage.closest('.story-progress')?.classList.remove('chapter-three-active');
  storyStage.classList.remove('chapter-four');
  storyStage.closest('.story-progress')?.classList.remove('chapter-four-active');
  storyStage.classList.remove('chapter-five','chapter-six');
  storyStage.closest('.story-progress')?.classList.remove('chapter-five-active','chapter-six-active');
  storyStage.classList.toggle('has-engine',engineProgress>0);
  storyStage.classList.toggle('has-portal',portalProgress>0);
  storyStage.classList.toggle('is-complete',completed===FINAL_MISSION_ID);
  storyStage.classList.toggle('phase-ship',phase==='ship');
  storyStage.classList.toggle('phase-engine',phase==='engine');
  storyStage.classList.toggle('phase-portal',phase==='portal');
  storyStage.style.setProperty('--engine-progress',String(engineProgress));
  storyStage.style.setProperty('--portal-progress',String(portalProgress));
  storyPhaseKicker.textContent=phase==='ship'?t('story.goal1'):phase==='engine'?t('story.goal2'):phase==='portal'?t('story.goal3'):t('story.complete');
  storyPhaseTitle.textContent=phase==='ship'?t('story.findShip'):phase==='engine'?t('story.startEngine'):phase==='portal'?t('story.openPortal'):t('story.newPlanet');
  shipGoalCount.textContent=`${shipProgress}/${STORY_SEGMENT_LENGTH}`;
  engineGoalCount.textContent=`${engineProgress}/${STORY_SEGMENT_LENGTH}`;
  portalGoalCount.textContent=`${portalProgress}/${STORY_SEGMENT_LENGTH}`;
  vaultGoalCount.textContent='0/3';

  document.querySelectorAll('[data-ship-part]').forEach(part=>part.classList.toggle('is-found',Number(part.dataset.shipPart)<=shipProgress));
  document.querySelectorAll('[data-engine-cell]').forEach(cell=>cell.classList.toggle('is-charged',Number(cell.dataset.engineCell)<=engineProgress));
  document.querySelectorAll('[data-portal-spark]').forEach(spark=>spark.classList.toggle('is-lit',Number(spark.dataset.portalSpark)<=portalProgress));
  stationWorldMap?.querySelectorAll('[data-station-step]').forEach(element=>{
    element.classList.toggle('is-earned',Number(element.dataset.stationStep)<=completed);
    element.classList.remove('is-new-reward');
  });
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const goalName=goal.dataset.storyGoal;
    if(goalName==='vault'){
      goal.classList.remove('is-active','is-done');
      goal.setAttribute('aria-label',t('story.worldLight'));
      return;
    }
    const goalPhase=goalName==='ship'?'ship':goalName==='engine'?'engine':'portal';
    const done=goalName==='ship'?shipProgress===STORY_SEGMENT_LENGTH:goalName==='engine'?engineProgress===STORY_SEGMENT_LENGTH:portalProgress===STORY_SEGMENT_LENGTH;
    goal.classList.toggle('is-done',done);
    goal.classList.toggle('is-active',phase===goalPhase);
    const value=goalName==='ship'?shipProgress:goalName==='engine'?engineProgress:portalProgress;
    const goalLabel=goalName==='ship'?t('story.ship'):goalName==='engine'?t('story.engine'):t('story.portal');
    goal.setAttribute('aria-label',`${goalLabel}: ${value}/${STORY_SEGMENT_LENGTH}`);
  });
}

function renderChapterTwoStory(){
  const arrivalProgress=completedInRangeForMap(16,19,CHAPTER_TWO_STORY);
  const natureProgress=completedInRangeForMap(20,23,CHAPTER_TWO_STORY);
  const friendsProgress=completedInRangeForMap(24,28,CHAPTER_TWO_STORY);
  const lightProgress=completedInRangeForMap(29,33,CHAPTER_TWO_STORY);
  const completed=arrivalProgress+natureProgress+friendsProgress+lightProgress;
  const phase=arrivalProgress<4?'arrival':natureProgress<4?'nature':friendsProgress<5?'friends':lightProgress<5?'light':'complete';

  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.add('chapter-two');
  storyStage.closest('.story-progress')?.classList.add('chapter-two-active');
  storyStage.classList.remove('chapter-three');
  storyStage.closest('.story-progress')?.classList.remove('chapter-three-active');
  storyStage.classList.remove('chapter-four');
  storyStage.closest('.story-progress')?.classList.remove('chapter-four-active');
  storyStage.classList.remove('chapter-five','chapter-six');
  storyStage.closest('.story-progress')?.classList.remove('chapter-five-active','chapter-six-active');
  storyStage.classList.remove('phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_TWO_WORLD_STEP_COUNT);
  const phaseKickers={
    arrival:t('story.goal1'),
    nature:t('story.goal2'),
    friends:t('story.goal3'),
    light:t('story.goal4'),
    complete:t('story.complete')
  };
  const phaseTitles={
    arrival:t('story.worldArrival'),
    nature:t('story.worldNature'),
    friends:t('story.worldFriends'),
    light:t('story.worldLight'),
    complete:t('story.leaveWorld')
  };
  storyPhaseKicker.textContent=phaseKickers[phase];
  storyPhaseTitle.textContent=phaseTitles[phase];

  const values={ship:arrivalProgress,engine:natureProgress,portal:friendsProgress,vault:lightProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:t('story.worldArrival'),engine:t('story.worldNature'),portal:t('story.worldFriends'),vault:t('story.worldLight')};
  shipGoalCount.textContent=`${arrivalProgress}/4`;
  engineGoalCount.textContent=`${natureProgress}/4`;
  portalGoalCount.textContent=`${friendsProgress}/5`;
  vaultGoalCount.textContent=`${lightProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal;
    const max=maximums[name]||1;
    const value=values[name]||0;
    const active=(phase==='arrival'&&name==='ship')||(phase==='nature'&&name==='engine')||(phase==='friends'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max);
    goal.classList.toggle('is-active',active);
    goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyTwo.dataset.worldStep=String(completed);
  storyTwo.classList.toggle('world-departed',isMapStoryMissionEarned(CHAPTER_TWO_STORY.finalMissionId,CHAPTER_TWO_STORY));
  storyTwo.querySelectorAll('[data-world-step]').forEach(element=>{
    const step=Number(element.dataset.worldStep);
    const worldStep=CHAPTER_TWO_WORLD_STEPS[step-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_TWO_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterThreeStory(){
  const arrivalProgress=completedInRangeForMap(34,37,CHAPTER_THREE_STORY);
  const motionProgress=completedInRangeForMap(38,41,CHAPTER_THREE_STORY);
  const skyProgress=completedInRangeForMap(42,46,CHAPTER_THREE_STORY);
  const lightProgress=completedInRangeForMap(47,51,CHAPTER_THREE_STORY);
  const completed=arrivalProgress+motionProgress+skyProgress+lightProgress;
  const phase=arrivalProgress<4?'arrival':motionProgress<4?'motion':skyProgress<5?'sky':lightProgress<5?'light':'complete';

  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.remove('chapter-four');
  storyStage.classList.remove('chapter-five','chapter-six');
  storyStage.classList.add('chapter-three');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-three-active');
  storyStage.closest('.story-progress')?.classList.remove('chapter-four-active');
  storyStage.closest('.story-progress')?.classList.remove('chapter-five-active','chapter-six-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_THREE_WORLD_STEP_COUNT);
  const phaseKickers={arrival:t('story.goal1'),motion:t('story.goal2'),sky:t('story.goal3'),light:t('story.goal4'),complete:t('story.complete')};
  const phaseTitles={arrival:t('story.windArrival'),motion:t('story.windMotion'),sky:t('story.windSky'),light:t('story.windLight'),complete:t('story.leaveWindWorld')};
  storyPhaseKicker.textContent=phaseKickers[phase];
  storyPhaseTitle.textContent=phaseTitles[phase];

  const values={ship:arrivalProgress,engine:motionProgress,portal:skyProgress,vault:lightProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:t('story.windArrival'),engine:t('story.windMotion'),portal:t('story.windSky'),vault:t('story.windLight')};
  shipGoalCount.textContent=`${arrivalProgress}/4`;
  engineGoalCount.textContent=`${motionProgress}/4`;
  portalGoalCount.textContent=`${skyProgress}/5`;
  vaultGoalCount.textContent=`${lightProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal;
    const max=maximums[name]||1;
    const value=values[name]||0;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max);
    goal.classList.toggle('is-active',active);
    goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyThree.dataset.windStep=String(completed);
  storyThree.classList.toggle('wind-departed',isMapStoryMissionEarned(CHAPTER_THREE_STORY.finalMissionId,CHAPTER_THREE_STORY));
  storyThree.querySelectorAll('[data-wind-step]').forEach(element=>{
    const step=Number(element.dataset.windStep);
    const worldStep=CHAPTER_THREE_WORLD_STEPS[step-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_THREE_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterFourStory(){
  const arrivalProgress=completedInRangeForMap(52,55,CHAPTER_FOUR_STORY);
  const sourceProgress=completedInRangeForMap(56,59,CHAPTER_FOUR_STORY);
  const cityProgress=completedInRangeForMap(60,64,CHAPTER_FOUR_STORY);
  const lightProgress=completedInRangeForMap(65,69,CHAPTER_FOUR_STORY);
  const completed=arrivalProgress+sourceProgress+cityProgress+lightProgress;
  const phase=arrivalProgress<4?'arrival':sourceProgress<4?'motion':cityProgress<5?'sky':lightProgress<5?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','chapter-three','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.add('chapter-four');
  storyStage.classList.remove('chapter-five','chapter-six');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active','chapter-three-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-four-active');
  storyStage.closest('.story-progress')?.classList.remove('chapter-five-active','chapter-six-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_FOUR_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine ööplaneedile',motion:'Valgus ärkab',sky:'Luminite linn',light:'Linn lööb särama',complete:'Valgusmaailm on ärganud'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:arrivalProgress,engine:sourceProgress,portal:cityProgress,vault:lightProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:'Saabumine',engine:'Valguse allikas',portal:'Luminite linn',vault:'Linna sära'};
  shipGoalCount.textContent=`${arrivalProgress}/4`; engineGoalCount.textContent=`${sourceProgress}/4`; portalGoalCount.textContent=`${cityProgress}/5`; vaultGoalCount.textContent=`${lightProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyFour.dataset.luminStep=String(completed);
  storyFour.classList.toggle('lumin-departed',isMapStoryMissionEarned(CHAPTER_FOUR_STORY.finalMissionId,CHAPTER_FOUR_STORY));
  storyFour.querySelectorAll('[data-lumin-step]').forEach(element=>{
    const worldStep=CHAPTER_FOUR_WORLD_STEPS[Number(element.dataset.luminStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_FOUR_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterFiveStory(){
  const coastProgress=completedInRangeForMap(70,73,CHAPTER_FIVE_STORY);
  const villageProgress=completedInRangeForMap(74,77,CHAPTER_FIVE_STORY);
  const peopleProgress=completedInRangeForMap(78,82,CHAPTER_FIVE_STORY);
  const lifeProgress=completedInRangeForMap(83,87,CHAPTER_FIVE_STORY);
  const completed=coastProgress+villageProgress+peopleProgress+lifeProgress;
  const phase=coastProgress<4?'arrival':villageProgress<4?'motion':peopleProgress<5?'sky':lifeProgress<5?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','chapter-three','chapter-four','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.add('chapter-five');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active','chapter-three-active','chapter-four-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-five-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_FIVE_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine põhjarannikule',motion:'Küla fjordi ääres',sky:'Põhjarahva elu',light:'Küla ärkab ellu',complete:'Põhjamaailm on valmis'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:coastProgress,engine:villageProgress,portal:peopleProgress,vault:lifeProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:'Fjord ja kaljud',engine:'Rannaküla',portal:'Elanikud',vault:'Elav põhjala'};
  shipGoalCount.textContent=`${coastProgress}/4`; engineGoalCount.textContent=`${villageProgress}/4`; portalGoalCount.textContent=`${peopleProgress}/5`; vaultGoalCount.textContent=`${lifeProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyFive.dataset.northStep=String(completed);
  storyFive.classList.toggle('north-departed',isMapStoryMissionEarned(CHAPTER_FIVE_STORY.finalMissionId,CHAPTER_FIVE_STORY));
  storyFive.querySelectorAll('[data-north-step]').forEach(element=>{
    const worldStep=CHAPTER_FIVE_WORLD_STEPS[Number(element.dataset.northStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_FIVE_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterSixStory(){
  const baseProgress=completedInRangeForMap(88,91,CHAPTER_SIX_STORY);
  const growthProgress=completedInRangeForMap(92,95,CHAPTER_SIX_STORY);
  const homesProgress=completedInRangeForMap(96,100,CHAPTER_SIX_STORY);
  const lifeProgress=completedInRangeForMap(101,105,CHAPTER_SIX_STORY);
  const completed=baseProgress+growthProgress+homesProgress+lifeProgress;
  const phase=baseProgress<4?'arrival':growthProgress<4?'motion':homesProgress<5?'sky':lifeProgress<5?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','chapter-three','chapter-four','chapter-five','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.add('chapter-six');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active','chapter-three-active','chapter-four-active','chapter-five-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-six-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_SIX_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine leheplaneedile',motion:'Hiigeltaimed ärkavad',sky:'Viljalinn avaneb',light:'Tagurpidi vihma maailm',complete:'Taevadžungel on valmis'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:baseProgress,engine:growthProgress,portal:homesProgress,vault:lifeProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:'Laguun',engine:'Hiigeltaimed',portal:'Viljalinn',vault:'Elav taevadžungel'};
  shipGoalCount.textContent=`${baseProgress}/4`; engineGoalCount.textContent=`${growthProgress}/4`; portalGoalCount.textContent=`${homesProgress}/5`; vaultGoalCount.textContent=`${lifeProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storySix.dataset.canopyStep=String(completed);
  storySix.classList.toggle('canopy-departed',isMapStoryMissionEarned(CHAPTER_SIX_STORY.finalMissionId,CHAPTER_SIX_STORY));
  storySix.querySelectorAll('[data-canopy-step]').forEach(element=>{
    const worldStep=CHAPTER_SIX_WORLD_STEPS[Number(element.dataset.canopyStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_SIX_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterSevenStory(){
  const arrivalProgress=completedInRangeForMap(106,109,CHAPTER_SEVEN_STORY);
  const settlementProgress=completedInRangeForMap(110,113,CHAPTER_SEVEN_STORY);
  const peopleProgress=completedInRangeForMap(114,118,CHAPTER_SEVEN_STORY);
  const awakeningProgress=completedInRangeForMap(119,123,CHAPTER_SEVEN_STORY);
  const completed=arrivalProgress+settlementProgress+peopleProgress+awakeningProgress;
  const phase=arrivalProgress<4?'arrival':settlementProgress<4?'motion':peopleProgress<5?'sky':awakeningProgress<5?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','chapter-three','chapter-four','chapter-five','chapter-six','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.add('chapter-seven');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active','chapter-three-active','chapter-four-active','chapter-five-active','chapter-six-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-seven-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_SEVEN_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine laulvasse kraatrisse',motion:'Terrassilinn avaneb',sky:'Kraatri elanikud',light:'Helid äratavad maailma',complete:'Laulvad terrassid on ärganud'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:arrivalProgress,engine:settlementProgress,portal:peopleProgress,vault:awakeningProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:'Kraater ja helikivid',engine:'Terrassilinn',portal:'Elanikud',vault:'Laulva maailma ärkamine'};
  shipGoalCount.textContent=`${arrivalProgress}/4`; engineGoalCount.textContent=`${settlementProgress}/4`; portalGoalCount.textContent=`${peopleProgress}/5`; vaultGoalCount.textContent=`${awakeningProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storySeven.dataset.terraceStep=String(completed);
  storySeven.classList.toggle('terrace-departed',isMapStoryMissionEarned(CHAPTER_SEVEN_STORY.finalMissionId,CHAPTER_SEVEN_STORY));
  storySeven.querySelectorAll('[data-terrace-step]').forEach(element=>{
    const worldStep=CHAPTER_SEVEN_WORLD_STEPS[Number(element.dataset.terraceStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_SEVEN_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterEightStory(){
  const arrivalProgress=completedInRangeForMap(124,127,CHAPTER_EIGHT_STORY);
  const settlementProgress=completedInRangeForMap(128,131,CHAPTER_EIGHT_STORY);
  const peopleProgress=completedInRangeForMap(132,136,CHAPTER_EIGHT_STORY);
  const awakeningProgress=completedInRangeForMap(137,141,CHAPTER_EIGHT_STORY);
  const completed=arrivalProgress+settlementProgress+peopleProgress+awakeningProgress;
  const phase=arrivalProgress<4?'arrival':settlementProgress<4?'motion':peopleProgress<5?'sky':awakeningProgress<5?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','chapter-three','chapter-four','chapter-five','chapter-six','chapter-seven','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.add('chapter-eight');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active','chapter-three-active','chapter-four-active','chapter-five-active','chapter-six-active','chapter-seven-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-eight-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_EIGHT_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine ookeaniplaneedile',motion:'Korallipuu ärkab',sky:'Veealune asula',light:'Ookean täitub eluga',complete:'Veealune maailm on ärganud'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:arrivalProgress,engine:settlementProgress,portal:peopleProgress,vault:awakeningProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:'Sukeldumine ja korallipuu',engine:'Veealused taimed',portal:'Asula ja elanikud',vault:'Elav ookean'};
  shipGoalCount.textContent=`${arrivalProgress}/4`; engineGoalCount.textContent=`${settlementProgress}/4`; portalGoalCount.textContent=`${peopleProgress}/5`; vaultGoalCount.textContent=`${awakeningProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyEight.dataset.oceanStep=String(completed);
  storyEight.classList.toggle('ocean-departed',isMapStoryMissionEarned(CHAPTER_EIGHT_STORY.finalMissionId,CHAPTER_EIGHT_STORY));
  storyEight.querySelectorAll('[data-ocean-step]').forEach(element=>{
    const worldStep=CHAPTER_EIGHT_WORLD_STEPS[Number(element.dataset.oceanStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_EIGHT_STORY)));
    element.classList.remove('is-new-reward');
  });
}


function renderChapterNineStory(){
  const arrivalProgress=completedInRangeForMap(142,145,CHAPTER_NINE_STORY);
  const settlementProgress=completedInRangeForMap(146,149,CHAPTER_NINE_STORY);
  const peopleProgress=completedInRangeForMap(150,154,CHAPTER_NINE_STORY);
  const awakeningProgress=completedInRangeForMap(155,159,CHAPTER_NINE_STORY);
  const completed=arrivalProgress+settlementProgress+peopleProgress+awakeningProgress;
  const phase=arrivalProgress<4?'arrival':settlementProgress<4?'motion':peopleProgress<5?'sky':awakeningProgress<5?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','chapter-three','chapter-four','chapter-five','chapter-six','chapter-seven','chapter-eight','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.add('chapter-nine');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active','chapter-three-active','chapter-four-active','chapter-five-active','chapter-six-active','chapter-seven-active','chapter-eight-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-nine-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_NINE_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine kahe päikese kanjonisse',motion:'Rippaiad ärkavad',sky:'Kaljude asula',light:'Roheline maailm helendab',complete:'Kosmiline aiakanjon on ärganud'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:arrivalProgress,engine:settlementProgress,portal:peopleProgress,vault:awakeningProgress};
  const maximums={ship:4,engine:4,portal:5,vault:5};
  const labels={ship:'Kanjon ja kaks päikest',engine:'Liaanid ja rippaiad',portal:'Asula ja elanikud',vault:'Helendav kosmiline aed'};
  shipGoalCount.textContent=`${arrivalProgress}/4`; engineGoalCount.textContent=`${settlementProgress}/4`; portalGoalCount.textContent=`${peopleProgress}/5`; vaultGoalCount.textContent=`${awakeningProgress}/5`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyNine.dataset.canyonStep=String(completed);
  storyNine.classList.toggle('canyon-departed',isMapStoryMissionEarned(CHAPTER_NINE_STORY.finalMissionId,CHAPTER_NINE_STORY));
  storyNine.querySelectorAll('[data-canyon-step]').forEach(element=>{
    const worldStep=CHAPTER_NINE_WORLD_STEPS[Number(element.dataset.canyonStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_NINE_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterTenStory(){
  const arrivalProgress=completedInRangeForMap(160,162,CHAPTER_TEN_STORY);
  const nestProgress=completedInRangeForMap(163,165,CHAPTER_TEN_STORY);
  const dragonProgress=completedInRangeForMap(166,168,CHAPTER_TEN_STORY);
  const awakeningProgress=completedInRangeForMap(169,172,CHAPTER_TEN_STORY);
  const completed=arrivalProgress+nestProgress+dragonProgress+awakeningProgress;
  const phase=arrivalProgress<3?'arrival':nestProgress<3?'motion':dragonProgress<3?'sky':awakeningProgress<4?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.classList.remove('chapter-two','chapter-three','chapter-four','chapter-five','chapter-six','chapter-seven','chapter-eight','chapter-nine','phase-ship','phase-engine','phase-portal','has-engine','has-portal');
  storyStage.classList.add('chapter-ten');
  storyStage.closest('.story-progress')?.classList.remove('chapter-two-active','chapter-three-active','chapter-four-active','chapter-five-active','chapter-six-active','chapter-seven-active','chapter-eight-active','chapter-nine-active','chapter-eleven-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-ten-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_TEN_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine draakonite taevasse',motion:'Taevasaared ja pesad',sky:'Draakonipere ärkab',light:'Tähtede taevas elab',complete:'Draakoniplaneet on ärganud'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:arrivalProgress,engine:nestProgress,portal:dragonProgress,vault:awakeningProgress};
  const maximums={ship:3,engine:3,portal:3,vault:4};
  const labels={ship:'Võõras taevas',engine:'Saared ja pesad',portal:'Draakonid',vault:'Elav tähistaevas'};
  shipGoalCount.textContent=`${arrivalProgress}/3`; engineGoalCount.textContent=`${nestProgress}/3`; portalGoalCount.textContent=`${dragonProgress}/3`; vaultGoalCount.textContent=`${awakeningProgress}/4`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyTen.dataset.dragonStep=String(completed);
  storyTen.classList.toggle('dragon-departed',isMapStoryMissionEarned(CHAPTER_TEN_STORY.finalMissionId,CHAPTER_TEN_STORY));
  storyTen.querySelectorAll('[data-dragon-step]').forEach(element=>{
    const worldStep=CHAPTER_TEN_WORLD_STEPS[Number(element.dataset.dragonStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_TEN_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderChapterElevenStory(){
  const arrivalProgress=completedInRangeForMap(173,175,CHAPTER_ELEVEN_STORY);
  const landscapeProgress=completedInRangeForMap(176,178,CHAPTER_ELEVEN_STORY);
  const settlementProgress=completedInRangeForMap(179,181,CHAPTER_ELEVEN_STORY);
  const awakeningProgress=completedInRangeForMap(182,185,CHAPTER_ELEVEN_STORY);
  const completed=arrivalProgress+landscapeProgress+settlementProgress+awakeningProgress;
  const phase=arrivalProgress<3?'arrival':landscapeProgress<3?'motion':settlementProgress<3?'sky':awakeningProgress<4?'light':'complete';
  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
  storyStage.className='story-stage chapter-eleven';
  storyStage.closest('.story-progress')?.classList.remove('chapter-ten-active');
  storyStage.closest('.story-progress')?.classList.add('chapter-eleven-active');
  storyStage.classList.toggle('is-complete',completed===CHAPTER_ELEVEN_WORLD_STEP_COUNT);
  const titles={arrival:'Saabumine peegelliivadele',motion:'Järv ja liivakaared',sky:'Täherändurite laager',light:'Peegeldused ärkavad',complete:'Peegelliivad säravad'};
  storyPhaseKicker.textContent=phase==='complete'?t('story.complete'):t(`story.goal${phase==='arrival'?1:phase==='motion'?2:phase==='sky'?3:4}`);
  storyPhaseTitle.textContent=titles[phase];
  const values={ship:arrivalProgress,engine:landscapeProgress,portal:settlementProgress,vault:awakeningProgress};
  const maximums={ship:3,engine:3,portal:3,vault:4};
  const labels={ship:'Kosmiline taevas',engine:'Peegeljärv ja kaared',portal:'Rändurite laager',vault:'Elavad peegeldused'};
  shipGoalCount.textContent=`${arrivalProgress}/3`; engineGoalCount.textContent=`${landscapeProgress}/3`; portalGoalCount.textContent=`${settlementProgress}/3`; vaultGoalCount.textContent=`${awakeningProgress}/4`;
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const name=goal.dataset.storyGoal,value=values[name]||0,max=maximums[name]||1;
    const active=(phase==='arrival'&&name==='ship')||(phase==='motion'&&name==='engine')||(phase==='sky'&&name==='portal')||(phase==='light'&&name==='vault');
    goal.classList.toggle('is-done',value===max); goal.classList.toggle('is-active',active); goal.setAttribute('aria-label',`${labels[name]}: ${value}/${max}`);
  });
  storyEleven.dataset.mirrorStep=String(completed);
  storyEleven.classList.toggle('mirror-departed',isMapStoryMissionEarned(CHAPTER_ELEVEN_STORY.finalMissionId,CHAPTER_ELEVEN_STORY));
  storyEleven.querySelectorAll('[data-mirror-step]').forEach(element=>{
    const worldStep=CHAPTER_ELEVEN_WORLD_STEPS[Number(element.dataset.mirrorStep)-1];
    element.classList.toggle('is-earned',Boolean(worldStep&&isMapStoryMissionEarned(worldStep.missionId,CHAPTER_ELEVEN_STORY)));
    element.classList.remove('is-new-reward');
  });
}

function renderJourneyStory(chapterId){
  const item=JOURNEY_CHAPTERS.find(chapter=>chapter.id===chapterId);
  if(!item)return;
  const completed=item.steps.filter(step=>isMapStoryMissionEarned(step.missionId,item.story)).length;
  const phaseIndex=Math.min(3,Math.floor(completed/3));
  storyStage.dataset.phase=['arrival','motion','sky','light'][phaseIndex];
  storyStage.dataset.completed=String(completed);
  storyStage.className=`story-stage chapter-${['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen'][chapterId]}`;
  storyStage.classList.toggle('is-complete',completed===item.steps.length);
  storyPhaseKicker.textContent=completed===item.steps.length?t('story.complete'):t(`story.goal${phaseIndex+1}`);
  storyPhaseTitle.textContent=item.titles[phaseIndex];
  const chunks=[Math.min(3,completed),Math.min(3,Math.max(0,completed-3)),Math.min(3,Math.max(0,completed-6)),Math.min(4,Math.max(0,completed-9))];
  [shipGoalCount,engineGoalCount,portalGoalCount,vaultGoalCount].forEach((node,index)=>{node.textContent=`${chunks[index]}/${index===3?4:3}`});
  document.querySelectorAll('[data-story-goal]').forEach((goal,index)=>{
    goal.classList.toggle('is-done',chunks[index]===(index===3?4:3));
    goal.classList.toggle('is-active',index===phaseIndex&&completed<item.steps.length);
  });
  item.map.querySelectorAll('[data-journey-step]').forEach(element=>{
    const step=item.steps[Number(element.dataset.journeyStep)-1];
    element.classList.toggle('is-earned',Boolean(step&&isMapStoryMissionEarned(step.missionId,item.story)));
    element.classList.remove('is-new-reward');
  });
}

function renderStoryProgress(){
  const chapter=previewMapChapter();
  if(chapter.id>=12&&chapter.id<=16)renderJourneyStory(chapter.id);
  else if(chapter.id===11)renderChapterElevenStory();
  else if(chapter.id===10)renderChapterTenStory();
  else if(chapter.id===9)renderChapterNineStory();
  else if(chapter.id===8)renderChapterEightStory();
  else if(chapter.id===7)renderChapterSevenStory();
  else if(chapter.id===6)renderChapterSixStory();
  else if(chapter.id===5)renderChapterFiveStory();
  else if(chapter.id===4)renderChapterFourStory();
  else if(chapter.id===3)renderChapterThreeStory();
  else if(chapter.id===2)renderChapterTwoStory();
  else renderChapterOneStory(Math.min(FINAL_MISSION_ID,getMapPreviewMissionId()||completedMissionCount()));
}

function createChapterDivider(chapter){
  const divider=document.createElement('div');
  divider.className=`chapter-divider chapter-divider-${chapter.id}`;
  divider.dataset.chapter=String(chapter.id);
  const fallback=`${chapter.id}. PEATÜKK`;
  divider.innerHTML=`<span>${t(chapter.titleKey,{},fallback)}</span><i aria-hidden="true"></i>`;
  return divider;
}

function createLevelButton(level){
  const button=document.createElement('button');
  const completed=progress.completedLevels.includes(level.id);
  const unlocked=completed||level.id<=progress.unlockedLevel;
  button.type='button';
  const celestialType=PLANET_MISSION_IDS.has(level.id)?'planet':'star';
  button.className=`level-object ${celestialType}${completed?' completed':''}${!unlocked?' locked':''}${level.id===progress.unlockedLevel&&!completed?' current':''}`;
  button.disabled=!unlocked;
  button.dataset.level=String(level.id);
  button.dataset.chapter=String(level.chapterId);
  button.style.setProperty('--level-accent',level.accent);
  button.innerHTML=`<span class="celestial-shape"><span class="celestial-number">${completed?'✓':level.id}</span></span><strong class="level-name">${level.short}</strong>`;
  button.setAttribute('aria-label',t('mission.aria',{
    number:level.id,
    title:level.title,
    completed:completed?t('mission.completedSuffix'):'',
    locked:!unlocked?t('mission.lockedSuffix'):''
  }));
  if(unlocked)button.addEventListener('click',()=>requestLevel(level.id));
  return button;
}

function renderLevelMap(){
  completedLevelCount.textContent=completedMissionCount();
  mapEnergyTotal.textContent=LEVELS.length;
  const activeChapter=activeMapChapter();
  const fallback=activeChapter.id===1?'1. PEATÜKK · ÜKS JA KAKS':activeChapter.id===2?'2. PEATÜKK · KOLM':'3. PEATÜKK · NELI';
  mapEyebrow.textContent=t(activeChapter.titleKey,{},fallback);
  renderStoryProgress();
  syncMapCatVisibility(previewMapChapter().id);
  const nodes=[];
  CHAPTERS.forEach(chapter=>{
    nodes.push(createChapterDivider(chapter));
    LEVELS.filter(level=>level.chapterId===chapter.id).forEach(level=>nodes.push(createLevelButton(level)));
  });
  levelGrid.replaceChildren(...nodes);
}

function focusCurrentMission(){
  const current=levelGrid.querySelector(`[data-level="${progress.unlockedLevel}"]`);
  if(!current||!missionRouteScroll)return;
  const routeRect=missionRouteScroll.getBoundingClientRect();
  const currentRect=current.getBoundingClientRect();
  const currentTop=missionRouteScroll.scrollTop+currentRect.top-routeRect.top;
  const targetTop=currentTop-(missionRouteScroll.clientHeight-currentRect.height)/2;
  const maximumTop=missionRouteScroll.scrollHeight-missionRouteScroll.clientHeight;
  missionRouteScroll.scrollTop=Math.max(0,Math.min(maximumTop,targetTop));
}

// IRON RULE: route focus uses unlockedLevel; top story uses the most recently won mission.
function showMap({historyMode='push'}={}){
  stopRound();
  if(Number.isInteger(lastSuccessfulPlayedMissionId)){
    rememberMapPreviewMission(lastSuccessfulPlayedMissionId);
    saveProgress();
  }
  renderLevelMap();
  showScreen('mapScreen',{historyMode,historyView:'map'});
  requestAnimationFrame(()=>requestAnimationFrame(focusCurrentMission));
}

function requestLevel(levelId){
  startLevel(levelId);
}

function startLevel(levelId,{historyMode='push'}={}){
  const level=LEVELS.find(item=>item.id===levelId);
  if(!level)return;
  clearAutoCheck();
  currentLevel=level;
  questionQueue=buildLevelQuestions(levelId);
  lastQuestionEquationKey='';
  currentQuestion=null;
  currentAnswer='';
  correct=0;
  mistakes=0;
  inputLocked=false;
  roundActive=true;
  roundPaused=false;
  pausedAt=0;
  totalPausedTime=0;
  showerProgress=START_SHOWER_PROGRESS;
  dangerStage=0;
  lastDangerBeat=0;
  clearTimeout(impactTimer);
  impactTimer=null;
  battleFx.stop();
  correctCount.textContent='0';
  mobileCorrectCount.textContent='0';
  mobileProgressPill.setAttribute('aria-label',t('battle.doneAria',{correct:0,total:ROUND_LENGTH}));
  feedback.textContent='';
  feedback.className='feedback visually-hidden';
  answerDisplay.textContent='?';
  answerDisplay.classList.remove('revealed-answer');
  questionCard.className='question-card';
  heroZone.className='hero-zone';
  starCurtain.className='star-curtain';
  battleStage.className='battle-stage';
  battleStage.style.setProperty('--level-accent',level.accent);
  showerMeter.hidden=false;
  levelKicker.textContent=t('battle.mission',{number:level.id,total:LEVELS.length});
  battleTitle.textContent=level.title;
  const choiceMode=level.mode==='choice';
  answerPanel.classList.toggle('choice-mode',choiceMode);
  choiceGrid.hidden=!choiceMode;
  keypad.hidden=choiceMode;
  answerPanelTitle.textContent=choiceMode?t('battle.choose'):t('battle.input');
  setShowerPosition();
  showScreen('battleScreen',{historyMode,historyView:'battle',historyData:{levelId}});
  battleStartedAt=Date.now();
  nextQuestion();
  startShowerMotion();
}

function nextQuestion(){
  if(!roundActive)return;
  if(correct>=ROUND_LENGTH){finishAttempt('complete');return}
  const differentIndex=questionQueue.findIndex(question=>equationKey(question)!==lastQuestionEquationKey);
  currentQuestion=differentIndex>=0?questionQueue.splice(differentIndex,1)[0]:separatorQuestion(currentLevel,lastQuestionEquationKey);
  if(!currentQuestion){finishAttempt('complete');return}
  lastQuestionEquationKey=equationKey(currentQuestion);
  currentAnswer='';
  answerDisplay.textContent='?';
  answerDisplay.classList.remove('revealed-answer');
  feedback.textContent='';
  feedback.className='feedback visually-hidden';
  questionCard.classList.remove('is-correct','is-wrong');
  factorA.textContent=currentQuestion.a;
  factorB.textContent=currentQuestion.b;
  operationSymbol.textContent=currentQuestion.operation==='divide'?'÷':'×';
  if(currentLevel.mode==='choice')renderChoices();
}

function renderChoices(){
  choiceGrid.replaceChildren(...buildChoiceOptions(currentQuestion).map(value=>{
    const button=document.createElement('button');
    button.type='button';
    button.textContent=String(value);
    button.dataset.choice=String(value);
    button.addEventListener('click',()=>submitChoice(value,button));
    return button;
  }));
}

function startShowerMotion(){
  cancelAnimationFrame(motionFrame);
  lastMotionTime=null;
  motionFrame=requestAnimationFrame(moveShower);
}

function moveShower(timestamp){
  if(!roundActive||!currentLevel?.seconds)return;
  if(roundPaused||inputLocked){
    lastMotionTime=null;
    motionFrame=requestAnimationFrame(moveShower);
    return;
  }
  if(lastMotionTime==null)lastMotionTime=timestamp;
  const delta=(timestamp-lastMotionTime)/1000;
  lastMotionTime=timestamp;
  showerProgress+=delta/currentLevel.seconds;
  setShowerPosition();
  if(showerProgress>=1){
    showerProgress=1;
    setShowerPosition();
    triggerImpact();
    return;
  }
  motionFrame=requestAnimationFrame(moveShower);
}

function setShowerPosition(){
  const progressValue=Math.max(0,Math.min(1,showerProgress));
  const top=-39+(progressValue*71);
  starCurtain.style.setProperty('--shower-top',`${top}%`);
  distanceFill.style.height=`${progressValue*100}%`;
  meterStar.style.top=`calc(${progressValue*100}% - 9px)`;
  updateDangerState(progressValue);
}

function updateDangerState(progressValue){
  const nextStage=progressValue>=.94?3:progressValue>=.82?2:progressValue>=.66?1:0;
  battleStage.classList.toggle('danger-near',nextStage>=1);
  battleStage.classList.toggle('danger-high',nextStage>=2);
  battleStage.classList.toggle('danger-critical',nextStage>=3);
  heroZone.classList.toggle('danger-near',nextStage>=1);
  heroZone.classList.toggle('danger-high',nextStage>=2);
  heroZone.classList.toggle('danger-critical',nextStage>=3);
  battleFx.setAmbient(nextStage===0?0:nextStage===1?.18:nextStage===2?.52:.92);

  const now=performance.now();
  if(nextStage>dangerStage&&nextStage>=2)playSound('dangerRise');
  if(nextStage>=2&&now-lastDangerBeat>(nextStage===3?720:1150)){
    lastDangerBeat=now;
    playSound('dangerBeat');
  }
  dangerStage=nextStage;
}

function advanceShowerAfterMistake(){
  mistakes++;
  showerProgress=Math.min(1,showerProgress+WRONG_ANSWER_ADVANCE);
  setShowerPosition();
  if(showerProgress>=1){
    cancelAnimationFrame(motionFrame);
    setTimeout(triggerImpact,420);
  }
}

function queueRetry(question){
  const position=Math.min(2+Math.floor(Math.random()*2),questionQueue.length);
  questionQueue.splice(position,0,{...question});
}

function showCorrectAnimation(){
  questionCard.classList.add('is-correct');
  heroZone.classList.add('celebrate');
  starCurtain.classList.remove('repelled');
  void starCurtain.offsetWidth;
  starCurtain.classList.add('repelled');
}

function finishCorrectQuestion(){
  recordFact(currentQuestion,true);
  correct++;
  correctCount.textContent=correct;
  mobileCorrectCount.textContent=correct;
  mobileProgressPill.setAttribute('aria-label',t('battle.doneAria',{correct,total:ROUND_LENGTH}));
  feedback.textContent=t('feedback.correct');
  playSound('correct');
  showCorrectAnimation();
  if(correct>=ROUND_LENGTH)cancelAnimationFrame(motionFrame);
  setTimeout(()=>{
    starCurtain.classList.remove('repelled');
    heroZone.classList.remove('celebrate');
    questionCard.classList.remove('is-correct');
    inputLocked=false;
    if(correct>=ROUND_LENGTH)finishAttempt('complete');
    else nextQuestion();
  },520);
}

function handleWrongAnswer(clickedButton=null){
  recordFact(currentQuestion,false);
  advanceShowerAfterMistake();
  queueRetry(currentQuestion);
  answerDisplay.textContent=String(currentQuestion.answer);
  answerDisplay.classList.add('revealed-answer');
  feedback.textContent=t('feedback.correctAnswer',{answer:currentQuestion.answer});
  questionCard.classList.add('is-wrong');
  playSound('wrong');
  if(clickedButton)clickedButton.classList.add('wrong-choice');
  setTimeout(()=>{
    if(!roundActive)return;
    questionCard.classList.remove('is-wrong');
    inputLocked=false;
    nextQuestion();
  },780);
}

function submitChoice(value,button){
  if(!roundActive||inputLocked)return;
  inputLocked=true;
  answerDisplay.textContent=String(value);
  if(value===currentQuestion.answer){
    button.classList.add('correct-choice');
    finishCorrectQuestion();
  }else{
    handleWrongAnswer(button);
  }
}

function enterDigit(value){
  if(!roundActive||inputLocked||currentLevel.mode!=='input')return;
  clearAutoCheck();
  feedback.textContent='';
  feedback.className='feedback visually-hidden';
  questionCard.classList.remove('is-wrong');

  if(value==='clear')currentAnswer=currentAnswer.slice(0,-1);
  else if(value==='clearAll')currentAnswer='';
  else if(currentAnswer.length<3){
    currentAnswer+=value;
    playSound('key');
  }

  answerDisplay.textContent=currentAnswer||'?';
  scheduleAnswerCheck();
}

function scheduleAnswerCheck(){
  clearAutoCheck();
  if(!currentAnswer||!currentQuestion)return;
  const expected=String(currentQuestion.answer);
  let delay=ANSWER_DELAYS.wrong;
  if(currentAnswer===expected)delay=ANSWER_DELAYS.exact;
  else if(expected.startsWith(currentAnswer))delay=ANSWER_DELAYS.possiblePrefix;
  autoCheckTimer=setTimeout(submitTypedAnswer,delay);
}

function clearAutoCheck(){
  if(autoCheckTimer!=null){
    clearTimeout(autoCheckTimer);
    autoCheckTimer=null;
  }
}

function submitTypedAnswer(){
  clearAutoCheck();
  if(!roundActive||inputLocked||!currentAnswer)return;
  inputLocked=true;
  if(Number(currentAnswer)===currentQuestion.answer)finishCorrectQuestion();
  else handleWrongAnswer();
}

function triggerImpact(){
  if(!roundActive)return;
  roundActive=false;
  inputLocked=true;
  clearAutoCheck();
  cancelAnimationFrame(motionFrame);
  battleFx.setAmbient(0);
  battleFx.sparkBurst(.5,.72,72,['#fff','#ffd34d','#ff9a3c','#70d9cf'],1.45);
  battleFx.dustBurst(.5,.83,38);
  battleFx.shockwave(.5,.72,'#fff',1.15);
  setTimeout(()=>battleFx.shockwave(.5,.72,'#ffd34d',.92),160);
  starCurtain.classList.add('impact');
  heroZone.classList.add('impact');
  battleStage.classList.add('is-impact');
  playSound('impact');
  if(soundEnabled&&navigator.vibrate)navigator.vibrate([45,35,95,45,150]);
  impactTimer=setTimeout(()=>finishAttempt('impact'),2050);
}

function finishAttempt(reason){
  stopRound();
  const elapsed=Math.round((Date.now()-battleStartedAt-totalPausedTime)/1000);
  const levelPassed=reason==='complete'&&correct===ROUND_LENGTH;
  const gameComplete=levelPassed&&currentLevel.id===LAST_MISSION_ID;
  const firstCompletion=levelPassed&&!progress.completedLevels.includes(currentLevel.id);

  mistakeCount.textContent=mistakes;
  timeCount.textContent=formatTime(elapsed);
  const currentChapter=CHAPTERS.find(item=>currentLevel.id>=item.startMissionId&&currentLevel.id<=item.endMissionId);
  const missionInChapter=currentChapter?currentLevel.id-currentChapter.startMissionId+1:currentLevel.id;
  const missionsInChapter=currentChapter?currentChapter.endMissionId-currentChapter.startMissionId+1:LAST_MISSION_ID;
  resultMissionProgress.textContent=`${missionInChapter}/${missionsInChapter}`;

  if(levelPassed){
    playSound('missionComplete');
    if(!progress.completedLevels.includes(currentLevel.id))progress.completedLevels.push(currentLevel.id);
    progress.completedLevels.sort((a,b)=>a-b);
    progress.unlockedLevel=Math.min(LAST_MISSION_ID,Math.max(progress.unlockedLevel,currentLevel.id+1));
    // IRON RULE: every victory, including a replay, becomes the map story preview.
    rememberMapPreviewMission(currentLevel.id);
    saveProgress();
    configureRewardScene(currentLevel.id,firstCompletion,true);
    resultEyebrow.hidden=true;
    resultEyebrow.textContent='';
    resultTitle.textContent=t('result.done');
    resultTitle.hidden=false;
    resultMessage.textContent='';
    resultMessage.hidden=true;
    resultPrimaryButton.textContent=gameComplete?t('result.missions'):t('result.next');
    resultMapButton.hidden=gameComplete;
    resultAction=gameComplete?'map':'next';
  }else{
    configureRewardScene(currentLevel?.id||1,false,false);
    resultEyebrow.textContent='';
    resultEyebrow.hidden=true;
    resultTitle.textContent=t('result.tryAgainTitle');
    resultTitle.hidden=false;
    resultMessage.textContent='';
    resultMessage.hidden=true;
    resultPrimaryButton.textContent=t('result.tryAgain');
    resultMapButton.hidden=false;
    resultAction='retry';
  }
  const resultNavigation={
    historyMode:'replace',
    historyView:'result',
    historyData:{
      levelId:currentLevel.id,
      resultAction,
      resultEyebrow:resultEyebrow.textContent,
      eyebrowHidden:resultEyebrow.hidden,
      resultTitle:resultTitle.textContent,
      resultMessage:resultMessage.textContent,
      titleHidden:resultTitle.hidden,
      messageHidden:resultMessage.hidden,
      primaryText:resultPrimaryButton.textContent,
      mapHidden:resultMapButton.hidden,
      levelPassed,
      firstCompletion,
      mistakes,
      elapsed
    }
  };
  const revealResult=()=>{
    showScreen('resultScreen',resultNavigation);
    startRewardCinematic(levelPassed,currentLevel.id,firstCompletion);
  };
  if(levelPassed)setTimeout(revealResult,250);
  else revealResult();
}

function setChapterTwoRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_TWO_WORLD_STEP_COUNT,levelId-FINAL_MISSION_ID));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardLivingWorld.dataset.worldStep=String(previous);
  rewardLivingWorld.classList.toggle('world-departed',!showReveal&&step===CHAPTER_TWO_WORLD_STEP_COUNT);
  rewardLivingWorld.querySelectorAll('[data-world-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.worldStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.worldStep=String(step);
}

function setChapterThreeRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_THREE_WORLD_STEP_COUNT,levelId-CHAPTER_THREE_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardWindWorld.dataset.windStep=String(previous);
  rewardWindWorld.classList.toggle('wind-departed',!showReveal&&step===CHAPTER_THREE_WORLD_STEP_COUNT);
  rewardWindWorld.querySelectorAll('[data-wind-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.windStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.windStep=String(step);
}

function setChapterFourRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_FOUR_WORLD_STEP_COUNT,levelId-CHAPTER_FOUR_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardLuminWorld.dataset.luminStep=String(previous);
  rewardLuminWorld.classList.toggle('lumin-departed',!showReveal&&step===CHAPTER_FOUR_WORLD_STEP_COUNT);
  rewardLuminWorld.querySelectorAll('[data-lumin-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.luminStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.luminStep=String(step);
}

function setChapterFiveRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_FIVE_WORLD_STEP_COUNT,levelId-CHAPTER_FIVE_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardNorthWorld.dataset.northStep=String(previous);
  rewardNorthWorld.classList.toggle('north-departed',!showReveal&&step===CHAPTER_FIVE_WORLD_STEP_COUNT);
  rewardNorthWorld.querySelectorAll('[data-north-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.northStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.northStep=String(step);
}

function setChapterSixRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_SIX_WORLD_STEP_COUNT,levelId-CHAPTER_SIX_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardCanopyWorld.dataset.canopyStep=String(previous);
  rewardCanopyWorld.classList.toggle('canopy-departed',!showReveal&&step===CHAPTER_SIX_WORLD_STEP_COUNT);
  rewardCanopyWorld.querySelectorAll('[data-canopy-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.canopyStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.canopyStep=String(step);
}

function setChapterSevenRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_SEVEN_WORLD_STEP_COUNT,levelId-CHAPTER_SEVEN_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardTerraceWorld.dataset.terraceStep=String(previous);
  rewardTerraceWorld.classList.toggle('terrace-departed',!showReveal&&step===CHAPTER_SEVEN_WORLD_STEP_COUNT);
  rewardTerraceWorld.querySelectorAll('[data-terrace-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.terraceStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.terraceStep=String(step);
}

function setChapterEightRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_EIGHT_WORLD_STEP_COUNT,levelId-CHAPTER_EIGHT_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardOceanWorld.dataset.oceanStep=String(previous);
  rewardOceanWorld.classList.toggle('ocean-departed',!showReveal&&step===CHAPTER_EIGHT_WORLD_STEP_COUNT);
  rewardOceanWorld.querySelectorAll('[data-ocean-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.oceanStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.oceanStep=String(step);
}


function setChapterNineRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_NINE_WORLD_STEP_COUNT,levelId-CHAPTER_NINE_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardCanyonWorld.dataset.canyonStep=String(previous);
  rewardCanyonWorld.classList.toggle('canyon-departed',!showReveal&&step===CHAPTER_NINE_WORLD_STEP_COUNT);
  rewardCanyonWorld.querySelectorAll('[data-canyon-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.canyonStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.canyonStep=String(step);
}

function setChapterTenRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_TEN_WORLD_STEP_COUNT,levelId-CHAPTER_TEN_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardDragonWorld.dataset.dragonStep=String(previous);
  rewardDragonWorld.classList.toggle('dragon-departed',!showReveal&&step===CHAPTER_TEN_WORLD_STEP_COUNT);
  rewardDragonWorld.querySelectorAll('[data-dragon-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.dragonStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.dragonStep=String(step);
}
function setChapterElevenRewardProgress(levelId,showReveal){
  const step=Math.max(1,Math.min(CHAPTER_ELEVEN_WORLD_STEP_COUNT,levelId-CHAPTER_ELEVEN_STORY.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  rewardMirrorWorld.dataset.mirrorStep=String(previous);
  rewardMirrorWorld.classList.toggle('mirror-departed',!showReveal&&step===CHAPTER_ELEVEN_WORLD_STEP_COUNT);
  rewardMirrorWorld.querySelectorAll('[data-mirror-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.mirrorStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
  rewardScene.dataset.mirrorStep=String(step);
}
function setJourneyRewardProgress(item,levelId,showReveal){
  const step=Math.max(1,Math.min(item.steps.length,levelId-item.story.startMissionId+1));
  const previous=showReveal?Math.max(0,step-1):step;
  item.reward.classList.toggle('journey-arriving',showReveal&&step===1);
  item.reward.classList.toggle('journey-departing',showReveal&&step===item.steps.length);
  item.reward.querySelectorAll('[data-journey-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.journeyStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
}

function setRewardProgressState(levelId,showReveal=true){
  const shipStep=Math.min(STORY_SEGMENT_LENGTH,levelId);
  const engineStep=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,levelId-SHIP_MISSION_ID));
  const portalStep=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,levelId-ENGINE_MISSION_ID));
  const previousShip=showReveal&&levelId<=SHIP_MISSION_ID?Math.max(0,shipStep-1):shipStep;
  const previousEngine=showReveal&&levelId>SHIP_MISSION_ID&&levelId<=ENGINE_MISSION_ID?Math.max(0,engineStep-1):engineStep;
  const previousPortal=showReveal&&levelId>ENGINE_MISSION_ID?Math.max(0,portalStep-1):portalStep;

  const setState=(selector,previous,current)=>{
    rewardScene.querySelectorAll(selector).forEach(element=>{
      element.classList.remove('is-earned','is-new-reward');
      const step=Number(element.dataset.rewardPart||element.dataset.rewardEngine||element.dataset.rewardPortal);
      if(step<=previous)element.classList.add('is-earned');
      else if(showReveal&&step===current)element.classList.add('is-new-reward');
    });
  };

  setState('[data-reward-part]',levelId>SHIP_MISSION_ID?STORY_SEGMENT_LENGTH:previousShip,shipStep);
  setState('[data-reward-engine]',levelId>ENGINE_MISSION_ID?STORY_SEGMENT_LENGTH:previousEngine,engineStep);
  setState('[data-reward-portal]',previousPortal,portalStep);
  rewardScene.style.setProperty('--portal-before',String(previousPortal));
  rewardScene.style.setProperty('--portal-after',String(portalStep));
}

function setChapterOneStationReward(levelId,showReveal){
  const step=Math.max(1,Math.min(FINAL_MISSION_ID,levelId));
  const previous=showReveal?Math.max(0,step-1):step;
  stationWorldReward?.querySelectorAll('[data-station-step]').forEach(element=>{
    element.classList.remove('is-earned','is-new-reward');
    const itemStep=Number(element.dataset.stationStep);
    if(itemStep<=previous)element.classList.add('is-earned');
    else if(showReveal&&itemStep===step)element.classList.add('is-new-reward');
  });
}

function configureRewardScene(levelId,firstCompletion,levelPassed){
  rewardScene.className='result-animation reward-scene';
  syncRewardCatVisibility(levelId);
  rewardScene.dataset.level=String(levelId);
  rewardScene.classList.toggle('first-completion',Boolean(firstCompletion&&levelPassed));
  rewardScene.classList.toggle('reward-replay',Boolean(!firstCompletion&&levelPassed));
  resultScreen.classList.remove('reward-cinematic-locked','reward-reveal-complete');
  resultPrimaryButton.disabled=false;
  resultMapButton.disabled=false;
  rewardPill.hidden=!levelPassed;
  if(!levelPassed){
    rewardScene.classList.add('reward-failed');
    return;
  }
  rewardPill.textContent=firstCompletion?t('result.rewardFirst'):t('result.rewardCollected');
  const journey=JOURNEY_CHAPTERS.find(item=>levelId>=item.story.startMissionId&&levelId<=item.story.finalMissionId);
  if(journey){
    rewardScene.classList.add(`reward-chapter-${journey.id===12?'twelve':journey.id===13?'thirteen':journey.id===14?'fourteen':journey.id===15?'fifteen':'sixteen'}`);
    setJourneyRewardProgress(journey,levelId,true);
    return;
  }
  if(levelId>=CHAPTER_ELEVEN_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-eleven');
    setChapterElevenRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_ELEVEN_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-mirror-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-mirror-arrival');
    if(chapterStep===12)rewardScene.classList.add('reward-mirror-finale');
    if(chapterStep===13)rewardScene.classList.add('reward-mirror-departure');
    return;
  }
  if(levelId>=CHAPTER_TEN_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-ten');
    setChapterTenRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_TEN_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-dragon-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-dragon-arrival');
    if(chapterStep===12)rewardScene.classList.add('reward-dragon-finale');
    if(chapterStep===13)rewardScene.classList.add('reward-dragon-departure');
    return;
  }
  if(levelId>=CHAPTER_NINE_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-nine');
    setChapterNineRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_NINE_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-canyon-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-canyon-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-canyon-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-canyon-departure');
    return;
  }
  if(levelId>=CHAPTER_EIGHT_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-eight');
    setChapterEightRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_EIGHT_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-ocean-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-ocean-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-ocean-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-ocean-departure');
    return;
  }
  if(levelId>=CHAPTER_SEVEN_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-seven');
    setChapterSevenRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_SEVEN_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-terrace-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-terrace-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-terrace-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-terrace-departure');
    return;
  }
  if(levelId>=CHAPTER_SIX_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-six');
    setChapterSixRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_SIX_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-canopy-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-canopy-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-canopy-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-canopy-departure');
    return;
  }
  if(levelId>=CHAPTER_FIVE_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-five');
    setChapterFiveRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_FIVE_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-north-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-north-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-north-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-north-departure');
    return;
  }
  if(levelId>=CHAPTER_FOUR_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-four');
    setChapterFourRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_FOUR_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-lumin-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-lumin-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-lumin-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-lumin-departure');
    return;
  }
  if(levelId>=CHAPTER_THREE_STORY.startMissionId){
    rewardScene.classList.add('reward-chapter-three');
    setChapterThreeRewardProgress(levelId,true);
    const chapterStep=levelId-CHAPTER_THREE_STORY.startMissionId+1;
    rewardScene.classList.add(`reward-wind-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-wind-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-wind-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-wind-departure');
    return;
  }
  if(levelId>FINAL_MISSION_ID){
    rewardScene.classList.add('reward-chapter-two');
    // The world-changing moment must stay visible even when an already completed
    // mission is replayed. Progress and energy are still awarded only once.
    setChapterTwoRewardProgress(levelId,true);
    const chapterStep=levelId-FINAL_MISSION_ID;
    rewardScene.classList.add(`reward-world-step-${chapterStep}`);
    if(chapterStep===1)rewardScene.classList.add('reward-world-arrival');
    if(chapterStep===17)rewardScene.classList.add('reward-world-finale');
    if(chapterStep===18)rewardScene.classList.add('reward-world-departure');
    return;
  }
  rewardScene.classList.add('reward-chapter-one');
  setChapterOneStationReward(levelId,true);
  setRewardProgressState(levelId,true);
  if(levelId>ENGINE_MISSION_ID)rewardScene.classList.add('reward-state-portal');
  else if(levelId>SHIP_MISSION_ID)rewardScene.classList.add('reward-state-engine');
  else rewardScene.classList.add('reward-state-ship');
  if(levelId===FINAL_MISSION_ID)rewardScene.classList.add('reward-final-launch');
  else if(levelId===ENGINE_MISSION_ID)rewardScene.classList.add('reward-engine-complete');
  else if(levelId===SHIP_MISSION_ID)rewardScene.classList.add('reward-ship-complete');
  else if(levelId>ENGINE_MISSION_ID)rewardScene.classList.add('reward-portal-step');
  else if(levelId>SHIP_MISSION_ID)rewardScene.classList.add('reward-engine-step');
  else rewardScene.classList.add('reward-ship-step');
}

function finishRewardReveal(){
  resultScreen.classList.remove('reward-cinematic-locked');
  resultScreen.classList.add('reward-reveal-complete');
  resultPrimaryButton.disabled=false;
  resultMapButton.disabled=false;
}

function startRewardCinematic(levelPassed,levelId,firstCompletion=true){
  clearCinematicTimers();
  rewardFx.stop();
  rewardScene.classList.remove('is-playing');
  void rewardScene.offsetWidth;
  if(!levelPassed){
    rewardScene.classList.add('is-playing');
    rewardFx.dustBurst(.42,.86,28,['#7355b7','#ff9a3c','#ffd34d']);
    rewardFx.shockwave(.42,.78,'#ffd34d',.7);
    return;
  }

  const journey=JOURNEY_CHAPTERS.find(item=>levelId>=item.story.startMissionId&&levelId<=item.story.finalMissionId);
  const chapterElevenReveal=Boolean(journey)||levelId>=CHAPTER_ELEVEN_STORY.startMissionId;
  const chapterTenReveal=levelId>=CHAPTER_TEN_STORY.startMissionId&&!chapterElevenReveal;
  const chapterNineReveal=levelId>=CHAPTER_NINE_STORY.startMissionId&&!chapterTenReveal&&!chapterElevenReveal;
  const chapterEightReveal=levelId>=CHAPTER_EIGHT_STORY.startMissionId&&!chapterNineReveal&&!chapterTenReveal;
  const chapterSevenReveal=levelId>=CHAPTER_SEVEN_STORY.startMissionId&&!chapterEightReveal&&!chapterNineReveal&&!chapterTenReveal;
  const chapterSixReveal=levelId>=CHAPTER_SIX_STORY.startMissionId&&!chapterSevenReveal&&!chapterEightReveal&&!chapterNineReveal&&!chapterTenReveal;
  const chapterFiveReveal=levelId>=CHAPTER_FIVE_STORY.startMissionId&&!chapterSixReveal&&!chapterSevenReveal&&!chapterEightReveal&&!chapterNineReveal&&!chapterTenReveal;
  const chapterFourReveal=levelId>=CHAPTER_FOUR_STORY.startMissionId&&!chapterFiveReveal&&!chapterSixReveal&&!chapterSevenReveal&&!chapterEightReveal&&!chapterNineReveal&&!chapterTenReveal;
  const chapterThreeReveal=levelId>=CHAPTER_THREE_STORY.startMissionId&&!chapterFourReveal&&!chapterFiveReveal&&!chapterSixReveal&&!chapterSevenReveal&&!chapterEightReveal&&!chapterNineReveal&&!chapterTenReveal;
  const chapterTwoReveal=levelId>FINAL_MISSION_ID&&!chapterThreeReveal&&!chapterFourReveal&&!chapterFiveReveal&&!chapterSixReveal&&!chapterSevenReveal&&!chapterEightReveal&&!chapterNineReveal&&!chapterTenReveal;
  const worldReveal=Boolean(journey)||chapterTwoReveal||chapterThreeReveal||chapterFourReveal||chapterFiveReveal||chapterSixReveal||chapterSevenReveal||chapterEightReveal||chapterNineReveal||chapterTenReveal||chapterElevenReveal;
  const visualReveal=true;
  const changeOffset=visualReveal?REWARD_BEFORE_HOLD:0;
  const cue=(delay,callback)=>scheduleCinematic(changeOffset+delay,callback);
  const beginRewardChange=()=>{
    rewardScene.classList.add('is-playing');
    if(visualReveal)playSound(worldReveal?'worldAwaken':'rewardReveal');
  };

  if(visualReveal){
    resultScreen.classList.add('reward-cinematic-locked');
    resultPrimaryButton.disabled=true;
    resultMapButton.disabled=true;
    scheduleCinematic(REWARD_BEFORE_HOLD,beginRewardChange);
  }else{
    resultScreen.classList.add('reward-reveal-complete');
    beginRewardChange();
  }

  if(worldReveal){
    const chapterStep=journey
      ?levelId-journey.story.startMissionId+1
      :chapterElevenReveal
      ?levelId-CHAPTER_ELEVEN_STORY.startMissionId+1
      :chapterTenReveal
      ?levelId-CHAPTER_TEN_STORY.startMissionId+1
      :chapterNineReveal
      ?levelId-CHAPTER_NINE_STORY.startMissionId+1
      :chapterEightReveal
      ?levelId-CHAPTER_EIGHT_STORY.startMissionId+1
      :chapterSevenReveal
      ?levelId-CHAPTER_SEVEN_STORY.startMissionId+1
      :chapterSixReveal
      ?levelId-CHAPTER_SIX_STORY.startMissionId+1
      :chapterFiveReveal
      ?levelId-CHAPTER_FIVE_STORY.startMissionId+1
      :chapterFourReveal
      ?levelId-CHAPTER_FOUR_STORY.startMissionId+1
      :chapterThreeReveal?levelId-CHAPTER_THREE_STORY.startMissionId+1:levelId-FINAL_MISSION_ID;
    const isDeparture=journey?chapterStep===journey.steps.length:(chapterElevenReveal||chapterTenReveal)?chapterStep===13:chapterStep===18;
    const settleAfter=isDeparture?3800:2850;
    cue(settleAfter,()=>{
      const currentWorld=journey?journey.reward:chapterElevenReveal?rewardMirrorWorld:chapterTenReveal?rewardDragonWorld:chapterNineReveal?rewardCanyonWorld:chapterEightReveal?rewardOceanWorld:chapterSevenReveal?rewardTerraceWorld:chapterSixReveal?rewardCanopyWorld:chapterFiveReveal?rewardNorthWorld:chapterFourReveal?rewardLuminWorld:chapterThreeReveal?rewardWindWorld:rewardLivingWorld;
      currentWorld.querySelectorAll('.is-new-reward').forEach(element=>{
        element.classList.remove('is-new-reward');
        element.classList.add('is-earned');
      });
      if(isDeparture&&!journey)currentWorld.classList.add(chapterElevenReveal?'mirror-departed':chapterTenReveal?'dragon-departed':chapterNineReveal?'canyon-departed':chapterEightReveal?'ocean-departed':chapterSevenReveal?'terrace-departed':chapterSixReveal?'canopy-departed':chapterFiveReveal?'north-departed':chapterFourReveal?'lumin-departed':chapterThreeReveal?'wind-departed':'world-departed');
    });
    if([1,journey?12:(chapterElevenReveal||chapterTenReveal)?12:17].includes(chapterStep))cue(2050,()=>playSound('storyStep'));
    if(isDeparture){
      cue(2550,()=>playSound('launch'));
    }
    if(visualReveal){
      const revealAfterChange=isDeparture?3000:(chapterStep===1?2300:1900);
      scheduleCinematic(REWARD_BEFORE_HOLD+revealAfterChange,finishRewardReveal);
    }
    return;
  }

  if(levelId===FINAL_MISSION_ID){
    cue(2150,()=>playSound('portalOpen'));
    cue(1120,()=>rewardFx.sparkBurst(.84,.22,34,['#70d9cf','#e64e89','#fff'],.82));
    cue(2180,()=>rewardFx.shockwave(.82,.5,'#70d9cf',.92));
    cue(3360,()=>rewardFx.sparkBurst(.82,.5,72,['#fff','#70d9cf','#e64e89','#ffd34d'],1.12));
    cue(4380,()=>rewardFx.sparkBurst(.62,.53,52,['#fff','#ffd34d','#ff9a3c'],1.35));
    cue(4540,()=>rewardFx.shockwave(.75,.5,'#fff',1.15));
  }else if(levelId===ENGINE_MISSION_ID){
    cue(2200,()=>playSound('engineStart'));
    cue(1460,()=>rewardFx.sparkBurst(.695,.73,20,['#ffd34d','#ff9a3c','#fff'],.6));
    cue(3260,()=>{
      rewardFx.sparkBurst(.665,.72,68,['#fff','#ffd34d','#ff9a3c','#e64e89'],1.25);
      rewardFx.shockwave(.665,.7,'#ffd34d',1.05);
      rewardFx.dustBurst(.665,.88,24);
    });
  }else if(levelId===SHIP_MISSION_ID){
    cue(2080,()=>playSound('shipFound'));
    cue(1370,()=>rewardFx.sparkBurst(.66,.17,24,['#fff','#70d9cf','#ffd34d'],.7));
    cue(2820,()=>{
      rewardFx.sparkBurst(.66,.52,66,['#fff','#70d9cf','#ffd34d','#e64e89'],1.2);
      rewardFx.shockwave(.66,.52,'#fff',1);
    });
  }else{
    const target=levelId>ENGINE_MISSION_ID?[.84,.5]:levelId>SHIP_MISSION_ID?[.66,.72]:[.66,.52];
    cue(1320,()=>rewardFx.sparkBurst(target[0],target[1],42,['#fff','#ffd34d','#70d9cf'],.9));
    cue(1480,()=>rewardFx.shockwave(target[0],target[1],'#70d9cf',.74));
  }
  {
    const revealAfterChange=levelId===FINAL_MISSION_ID?6500:(levelId===SHIP_MISSION_ID||levelId===ENGINE_MISSION_ID?5700:3800);
    scheduleCinematic(REWARD_BEFORE_HOLD+revealAfterChange,finishRewardReveal);
  }
}

function runResultAction(){
  if(resultAction==='retry'){
    startLevel(currentLevel.id,{historyMode:'replace'});
    return;
  }
  if(resultAction==='next'){
    const nextLevel=Math.min(LAST_MISSION_ID,currentLevel.id+1);
    startLevel(nextLevel,{historyMode:'replace'});
    return;
  }
  history.back();
}

function restoreResult(state){
  stopRound();
  if(state?.levelPassed!==false&&Number.isInteger(state?.levelId)){
    rememberMapPreviewMission(state.levelId);
    saveProgress();
  }
  currentLevel=LEVELS.find(level=>level.id===state.levelId)||currentLevel;
  resultAction=state.resultAction||'map';
  resultEyebrow.textContent='';
  resultEyebrow.hidden=true;
  resultTitle.textContent=state.resultTitle||t('result.titlePassed');
  resultMessage.textContent=state.resultMessage||'';
  const restoredChapter=CHAPTERS.find(item=>state.levelId>=item.startMissionId&&state.levelId<=item.endMissionId);
  if(restoredChapter){
    resultMissionProgress.textContent=`${state.levelId-restoredChapter.startMissionId+1}/${restoredChapter.endMissionId-restoredChapter.startMissionId+1}`;
  }
  resultTitle.hidden=Boolean(state.titleHidden);
  resultMessage.hidden=state.messageHidden!==false;
  resultPrimaryButton.textContent=state.primaryText||t('result.toMissions');
  resultMapButton.hidden=Boolean(state.mapHidden);
  configureRewardScene(state.levelId,state.firstCompletion!==false,state.levelPassed!==false);
  mistakeCount.textContent=Number.isInteger(state.mistakes)?state.mistakes:0;
  timeCount.textContent=formatTime(Number.isInteger(state.elapsed)?state.elapsed:0);
  showScreen('resultScreen',{historyMode:'none'});
  startRewardCinematic(state.levelPassed!==false,state.levelId,state.firstCompletion!==false);
}

function restoreNavigation(state){
  if(!state||state.marker!==NAVIGATION_MARKER)return;
  if(state.view==='guard'||state.view==='map')showMap({historyMode:'none'});
  else if(state.view==='explanations')showExplanationHub({historyMode:'none'});
  else if(state.view==='lesson')showLesson(state.lessonId||state.mode,state.pendingLevel,{historyMode:'none'});
  else if(state.view==='battle')startLevel(state.levelId,{historyMode:'none'});
  else if(state.view==='result')restoreResult(state);
}

function stopRound(){
  roundActive=false;
  inputLocked=true;
  clearAutoCheck();
  cancelAnimationFrame(motionFrame);
  clearTimeout(impactTimer);
  impactTimer=null;
  battleFx.stop();
}

function formatTime(seconds){
  return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
}

function resetProgress(){
  if(!confirm(t('reset.confirm')))return;
  stopRound();
  progressStore.clear();
  progress=defaultProgress();
  showMap({historyMode:'replace'});
}

function finishIntro(){
  clearTimeout(introExitTimer);
  introScreen.classList.add('is-finished');
  document.body.classList.remove('intro-active');
  introExitTimer=setTimeout(()=>{introScreen.hidden=true},440);
}

function launchIntro(quick=false){
  if(introScreen.hidden||introScreen.classList.contains('is-launching'))return;
  clearTimeout(introReadyTimer);
  introPlayButton.disabled=true;
  introScreen.classList.remove('intro-ready');
  introScreen.classList.add('is-launching');
  introScreen.classList.toggle('is-quick-exit',Boolean(quick));
  localStorage.setItem(INTRO_SEEN_KEY,'true');
  playSound('introIgnition');
  introExitTimer=setTimeout(finishIntro,quick?620:INTRO_EXIT_DELAY);
}

function prepareIntro(){
  const returning=localStorage.getItem(INTRO_SEEN_KEY)==='true';
  const hasProgress=completedMissionCount()>0||progress.unlockedLevel>1;
  introPlayLabel.textContent=hasProgress?t('intro.continue'):t('intro.start');
  introScreen.classList.toggle('is-returning',returning);
  introPlayButton.disabled=!returning;
  if(returning){
    introScreen.classList.add('intro-ready');
  }else{
    introReadyTimer=setTimeout(()=>{
      introScreen.classList.add('intro-ready');
      introPlayButton.disabled=false;
    },INTRO_READY_DELAY);
  }
}

function isSamsungInternet(){
  return /SamsungBrowser/i.test(navigator.userAgent);
}

function isIOS(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;
}

function isStandaloneMode(){
  return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
}

function openInChrome(){
  const target=`intent://${location.host}${location.pathname}${location.search}${location.hash}#Intent;scheme=https;package=com.android.chrome;end`;
  window.location.href=target;
}

function configureInstallDialog(){
  const samsung=isSamsungInternet();
  const ios=isIOS();
  continueInBrowserButton.hidden=false;
  if(samsung){
    installDialogTitle.textContent='AVA MÄNG CHROME’IS';
    installHelpText.textContent='Turvaliseks lisamiseks telefoni ava EDUKASS Google Chrome’i brauseris. Mängida saab kohe ka siin brauseris.';
    confirmInstallButton.textContent='AVA CHROME’IS';
    confirmInstallButton.dataset.action='chrome';
    return;
  }
  if(ios){
    installDialogTitle.textContent='LISA TELEFONI EKRAANILE';
    installHelpText.textContent='Ava mäng Safaris, vajuta jagamise nuppu ja vali „Lisa avakuvale”. Mängida saab kohe ka brauseris.';
    confirmInstallButton.textContent='SELGESTI';
    confirmInstallButton.dataset.action='close';
    return;
  }
  installDialogTitle.textContent='LISA TELEFONI EKRAANILE';
  installHelpText.textContent='Mängu ikoon ilmub sinu telefoni. Kui automaatne lisamine ei avane, vali brauseri menüüst „Lisa avakuvale”.';
  confirmInstallButton.textContent='📲 LISA TELEFONI EKRAANILE';
  confirmInstallButton.dataset.action='install';
}

function openInstallHelp(){
  if(isStandaloneMode())return;
  if(isSamsungInternet()){
    configureInstallDialog();
    if(typeof installDialog.showModal==='function')installDialog.showModal();
    return;
  }
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.finally(()=>{deferredInstallPrompt=null});
    return;
  }
  configureInstallDialog();
  if(typeof installDialog.showModal==='function')installDialog.showModal();
}

function pauseRoundForVisibility(){
  if(!roundActive)return;
  roundPaused=true;
  pausedAt=Date.now();
  clearAutoCheck();
  cancelAnimationFrame(motionFrame);
  lastMotionTime=null;
}

function resumeRoundFromVisibility(){
  if(!roundActive||!roundPaused)return;
  if(pausedAt)totalPausedTime+=Date.now()-pausedAt;
  pausedAt=0;
  roundPaused=false;
  if(currentAnswer&&!inputLocked)scheduleAnswerCheck();
  startShowerMotion();
}

document.querySelectorAll('[data-demo-factor]').forEach(button=>button.addEventListener('click',()=>updateDemo(Number(button.dataset.demoFactor))));
lessonContinueButton.addEventListener('click',()=>{
  markLessonSeen(currentLesson);
  saveProgress();
  if(pendingLevelAfterLesson==='explanations'){
    const level=currentLesson.missionId||1;
    pendingLevelAfterLesson=null;
    startLevel(level,{historyMode:'replace'});
  }else if(pendingLevelAfterLesson==='map'){
    pendingLevelAfterLesson=null;
    history.back();
  }else if(Number.isInteger(pendingLevelAfterLesson)){
    const level=pendingLevelAfterLesson;
    pendingLevelAfterLesson=null;
    startLevel(level,{historyMode:'replace'});
  }else{
    writeNavigationState('map',{},'replace');
    startLevel(currentLesson.missionId||1);
  }
});
document.querySelector('#repeatLessonButton').addEventListener('click',openFactTable);
repeatMultiplicationButton.addEventListener('click',()=>showLesson('multiply-2','explanations'));
repeatDivisionButton.addEventListener('click',()=>showLesson('divide-2','explanations'));
repeatThreeMultiplicationButton.addEventListener('click',()=>showLesson('multiply-3','explanations'));
repeatThreeDivisionButton.addEventListener('click',()=>showLesson('divide-3','explanations'));
repeatFourMultiplicationButton.addEventListener('click',()=>showLesson('multiply-4','explanations'));
repeatFourDivisionButton.addEventListener('click',()=>showLesson('divide-4','explanations'));
repeatFiveMultiplicationButton.addEventListener('click',()=>showLesson('multiply-5','explanations'));
repeatFiveDivisionButton.addEventListener('click',()=>showLesson('divide-5','explanations'));
repeatSixMultiplicationButton.addEventListener('click',()=>showLesson('multiply-6','explanations'));
repeatSixDivisionButton.addEventListener('click',()=>showLesson('divide-6','explanations'));
repeatSevenMultiplicationButton.addEventListener('click',()=>showLesson('multiply-7','explanations'));
repeatSevenDivisionButton.addEventListener('click',()=>showLesson('divide-7','explanations'));
repeatEightMultiplicationButton.addEventListener('click',()=>showLesson('multiply-8','explanations'));
repeatEightDivisionButton.addEventListener('click',()=>showLesson('divide-8','explanations'));
repeatNineMultiplicationButton.addEventListener('click',()=>showLesson('multiply-9','explanations'));
repeatNineDivisionButton.addEventListener('click',()=>showLesson('divide-9','explanations'));
repeatTenMultiplicationButton.addEventListener('click',()=>showLesson('multiply-10','explanations'));
repeatTenDivisionButton.addEventListener('click',()=>showLesson('divide-10','explanations'));
document.querySelector('#explanationBackButton').addEventListener('click',()=>history.back());
document.querySelector('#backToMapButton').addEventListener('click',()=>showMap());
resultMapButton.addEventListener('click',()=>showMap());
resultPrimaryButton.addEventListener('click',runResultAction);
document.querySelector('#resetProgressButton').addEventListener('click',resetProgress);
factTableCloseButton.addEventListener('click',closeFactTable);
factTableGrid.addEventListener('click',event=>{
  const cell=event.target.closest('[data-factor-a],[data-factor-b]');
  if(!cell)return;
  const a=Number(cell.dataset.factorA);
  const b=Number(cell.dataset.factorB);
  if(a)factTableA=a;
  if(b)factTableB=b;
  if(a||b)renderFactTable();
});
factTableDialog.addEventListener('click',event=>{if(event.target===factTableDialog)closeFactTable()});
soundToggleButton.addEventListener('click',toggleSound);
shareGameButton.addEventListener('click',shareGame);
copyShareLinkButton.addEventListener('click',copyShareLink);
shareDialog.addEventListener('click',event=>{
  if(event.target===shareDialog)shareDialog.close();
});
installGameButton.addEventListener('click',openInstallHelp);
confirmInstallButton.addEventListener('click',()=>{
  const action=confirmInstallButton.dataset.action;
  if(action==='chrome'){openInChrome();return;}
  if(action==='close'){installDialog.close();return;}
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.finally(()=>{deferredInstallPrompt=null});
  }
});
continueInBrowserButton.addEventListener('click',()=>installDialog.close());
installDialog.addEventListener('click',event=>{if(event.target===installDialog)installDialog.close()});
window.addEventListener('beforeinstallprompt',event=>{
  if(isSamsungInternet())return;
  event.preventDefault();
  deferredInstallPrompt=event;
  confirmInstallButton.hidden=false;
});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;if(installDialog.open)installDialog.close()});
document.addEventListener('visibilitychange',()=>document.hidden?pauseRoundForVisibility():resumeRoundFromVisibility());
introPlayButton.addEventListener('click',event=>{
  event.stopPropagation();
  launchIntro();
});
introScreen.addEventListener('click',()=>{
  if(introScreen.classList.contains('is-returning'))launchIntro(true);
});
document.querySelectorAll('[data-key]').forEach(button=>button.addEventListener('click',()=>enterDigit(button.dataset.key)));

document.addEventListener('keydown',event=>{
  if(!document.querySelector('#battleScreen').classList.contains('is-active')||currentLevel?.mode!=='input')return;
  if(/^\d$/.test(event.key)){
    event.preventDefault();
    enterDigit(event.key);
  }else if(event.key==='Backspace'){
    event.preventDefault();
    enterDigit('clear');
  }else if(event.key==='Escape'){
    event.preventDefault();
    enterDigit('clearAll');
  }
});

window.addEventListener('popstate',event=>restoreNavigation(event.state));

buildStars();
updateSoundButton();
renderLevelMap();
if(history.state?.marker===NAVIGATION_MARKER)restoreNavigation(history.state);
else{
  showMap({historyMode:'replace'});
}
prepareIntro();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(registration=>registration.update()).catch(()=>{});

window.__EDUKASS_TEST__={
  LEVELS,
  REWARD_BEFORE_HOLD,
  INTRO_READY_DELAY,
  buildLevelQuestions,
  buildChoiceOptions,
  equationKey,
  avoidAdjacentDuplicates,
  requestLevel,
  startLevel,
  showMap,
  showExplanationHub,
  triggerImpact,
  skipIntro:finishIntro,
  setShowerProgress:value=>{
    showerProgress=Math.max(0,Math.min(1,Number(value)||0));
    setShowerPosition();
  },
  getState:()=>({progress:JSON.parse(JSON.stringify(progress)),currentLevel:currentLevel?.id,currentQuestion:{...currentQuestion},correct,mistakes,showerProgress,roundActive}),
  answerCorrect:()=>{
    if(!currentQuestion)return;
    if(currentLevel.mode==='choice')submitChoice(currentQuestion.answer,[...choiceGrid.children].find(button=>Number(button.dataset.choice)===currentQuestion.answer));
    else String(currentQuestion.answer).split('').forEach(digit=>enterDigit(digit));
  },
  answerWrong:()=>{
    if(!currentQuestion||!roundActive||inputLocked)return;
    inputLocked=true;
    handleWrongAnswer();
  }
};
