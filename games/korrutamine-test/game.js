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
const completedLevelCount=document.querySelector('#completedLevelCount');
const levelKicker=document.querySelector('#levelKicker');
const battleTitle=document.querySelector('#battleTitle');
const resultEyebrow=document.querySelector('#resultEyebrow');
const resultTitle=document.querySelector('#resultTitle');
const resultMessage=document.querySelector('#resultMessage');
const resultPrimaryButton=document.querySelector('#resultPrimaryButton');
const resultMapButton=document.querySelector('#resultMapButton');
const lessonEyebrow=document.querySelector('#lessonEyebrow');
const lessonTitle=document.querySelector('#lessonTitle');
const multiplicationLesson=document.querySelector('#multiplicationLesson');
const divisionLesson=document.querySelector('#divisionLesson');
const lessonContinueButton=document.querySelector('#lessonContinueButton');
const lessonSign=document.querySelector('#lessonSign');
const demoMultiplyEquation=document.querySelector('#demoMultiplyEquation');
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
const repeatDivisionButton=document.querySelector('#repeatDivisionButton');
const storyStage=document.querySelector('#storyStage');
const storyPhaseKicker=document.querySelector('#storyPhaseKicker');
const storyPhaseTitle=document.querySelector('#storyPhaseTitle');
const shipGoalCount=document.querySelector('#shipGoalCount');
const engineGoalCount=document.querySelector('#engineGoalCount');
const portalGoalCount=document.querySelector('#portalGoalCount');
const rewardScene=document.querySelector('#rewardScene');
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
const shareGameButton=document.querySelector('#shareGameButton');
const shareDialog=document.querySelector('#shareDialog');
const shareUrlInput=document.querySelector('#shareUrlInput');
const copyShareLinkButton=document.querySelector('#copyShareLinkButton');
const shareStatus=document.querySelector('#shareStatus');

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
const PRACTICE_TABLE=CHAPTER_CONFIG.practiceTable;
const LESSON_CONFIG=CHAPTER_CONFIG.lesson;
const STORY_CONFIG=CHAPTER_CONFIG.story;
const DIVISION_MISSION_ID=LESSON_CONFIG.divisionMissionId;
const STORY_SEGMENT_LENGTH=STORY_CONFIG.segmentLength;
const SHIP_MISSION_ID=STORY_CONFIG.shipMissionId;
const ENGINE_MISSION_ID=STORY_CONFIG.engineMissionId;
const FINAL_MISSION_ID=STORY_CONFIG.finalMissionId;
const PLANET_MISSION_IDS=new Set(STORY_CONFIG.planetMissionIds);
const ANSWER_DELAYS={exact:480,possiblePrefix:2200,wrong:1050};
const START_SHOWER_PROGRESS=.08;
const WRONG_ANSWER_ADVANCE=.105;
const NAVIGATION_MARKER='edukass-game-v28';
const REWARD_BEFORE_HOLD=1500;
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
  accent:mission.accent
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
let currentLessonMode=LESSON_CONFIG.initialMode;
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

function updateDemo(factor){
  const product=factor*PRACTICE_TABLE;
  demoOneEquation.textContent=`1 × ${factor} = ${factor}`;
  demoMultiplyEquation.textContent=`${PRACTICE_TABLE} × ${factor} = ${product}`;
  demoDivisionEquation.textContent=`${product} ÷ ${PRACTICE_TABLE} = ${factor}`;
  document.querySelectorAll('[data-demo-factor]').forEach(button=>button.classList.toggle('active',Number(button.dataset.demoFactor)===factor));

  const buildRows=rowCount=>{
    const rows=[];
    for(let row=0;row<rowCount;row++){
      const group=document.createElement('span');
      group.className='star-row';
      for(let index=0;index<factor;index++){
        const star=document.createElement('i');
        star.textContent='★';
        group.append(star);
      }
      rows.push(group);
    }
    return rows;
  };

  demoOneStars.replaceChildren(...buildRows(1));
  demoStars.replaceChildren(...buildRows(PRACTICE_TABLE));
  const divisionGroups=[];
  for(let groupIndex=0;groupIndex<PRACTICE_TABLE;groupIndex++){
    const group=document.createElement('span');
    group.className='star-row division-group';
    for(let index=0;index<factor;index++){
      const star=document.createElement('i');
      star.textContent='★';
      group.append(star);
    }
    divisionGroups.push(group);
  }
  demoDivisionStars.replaceChildren(...divisionGroups);
}

function configureDemoPicker(division){
  factorPicker.setAttribute('aria-label',division?t('lesson.dividendAria'):t('lesson.factorAria'));
  explorerHint.textContent=division?t('lesson.hintDivide'):t('lesson.hintMultiply');
  document.querySelectorAll('[data-demo-factor]').forEach((button,index)=>{
    const factor=index+1;
    button.dataset.demoFactor=String(factor);
    button.textContent=String(division?factor*PRACTICE_TABLE:factor);
    button.setAttribute('aria-label',division
      ?t('lesson.dividendValueAria',{value:factor*PRACTICE_TABLE})
      :t('lesson.numberAria',{value:factor}));
  });
}

function showLesson(mode=LESSON_CONFIG.initialMode,pendingLevel=null,{historyMode='push'}={}){
  stopRound();
  currentLessonMode=mode;
  pendingLevelAfterLesson=pendingLevel;
  const division=mode===LESSON_CONFIG.divisionMode;
  lessonEyebrow.textContent=division?t('lesson.eyebrowDivide'):t('lesson.eyebrowMultiply');
  lessonTitle.textContent=division?t('lesson.titleDivide'):t('lesson.titleMultiply');
  lessonTitle.hidden=!division;
  multiplicationLesson.hidden=division;
  divisionLesson.hidden=!division;
  lessonSign.textContent=division?`÷${PRACTICE_TABLE}`:`×${PRACTICE_TABLE}`;
  configureDemoPicker(division);
  updateDemo(LESSON_CONFIG.demoFactor);
  if(pendingLevel==='explanations')lessonContinueButton.textContent=t('lesson.toExplanations');
  else if(pendingLevel==='map')lessonContinueButton.textContent=t('lesson.toMissions');
  else if(Number.isInteger(pendingLevel))lessonContinueButton.innerHTML=`<span>${pendingLevel}. MISSIOON</span><strong>ALUSTA!</strong>`;
  else lessonContinueButton.innerHTML='<span>1. MISSIOON</span><strong>ALUSTA!</strong>';
  showScreen('lessonScreen',{historyMode,historyView:'lesson',historyData:{mode,pendingLevel}});
}

function showExplanationHub({historyMode='push'}={}){
  stopRound();
  const divisionUnlocked=progress.divisionLessonSeen||progress.unlockedLevel>=DIVISION_MISSION_ID;
  repeatDivisionButton.disabled=!divisionUnlocked;
  repeatDivisionButton.classList.toggle('locked',!divisionUnlocked);
  repeatDivisionButton.setAttribute('aria-label',divisionUnlocked?t('explanations.repeatDivisionAria'):t('explanations.lockedDivisionAria'));
  showScreen('explanationScreen',{historyMode,historyView:'explanations'});
}

function completedMissionCount(){
  return new Set(progress.completedLevels.filter(levelId=>LEVEL_IDS.has(levelId))).size;
}

function renderStoryProgress(){
  const completed=completedMissionCount();
  const shipProgress=Math.min(STORY_SEGMENT_LENGTH,completed);
  const engineProgress=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,completed-SHIP_MISSION_ID));
  const portalProgress=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,completed-ENGINE_MISSION_ID));
  const phase=completed<SHIP_MISSION_ID?'ship':completed<ENGINE_MISSION_ID?'engine':completed<FINAL_MISSION_ID?'portal':'complete';

  storyStage.dataset.phase=phase;
  storyStage.dataset.completed=String(completed);
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

  document.querySelectorAll('[data-ship-part]').forEach(part=>part.classList.toggle('is-found',Number(part.dataset.shipPart)<=shipProgress));
  document.querySelectorAll('[data-engine-cell]').forEach(cell=>cell.classList.toggle('is-charged',Number(cell.dataset.engineCell)<=engineProgress));
  document.querySelectorAll('[data-portal-spark]').forEach(spark=>spark.classList.toggle('is-lit',Number(spark.dataset.portalSpark)<=portalProgress));
  document.querySelectorAll('[data-story-goal]').forEach(goal=>{
    const goalName=goal.dataset.storyGoal;
    const goalPhase=goalName==='ship'?'ship':goalName==='engine'?'engine':'portal';
    const done=goalName==='ship'?shipProgress===STORY_SEGMENT_LENGTH:goalName==='engine'?engineProgress===STORY_SEGMENT_LENGTH:portalProgress===STORY_SEGMENT_LENGTH;
    goal.classList.toggle('is-done',done);
    goal.classList.toggle('is-active',phase===goalPhase);
    const value=goalName==='ship'?shipProgress:goalName==='engine'?engineProgress:portalProgress;
    const goalLabel=goalName==='ship'?t('story.ship'):goalName==='engine'?t('story.engine'):t('story.portal');
    goal.setAttribute('aria-label',`${goalLabel}: ${value}/${STORY_SEGMENT_LENGTH}`);
  });
}

function renderLevelMap(){
  completedLevelCount.textContent=completedMissionCount();
  renderStoryProgress();
  levelGrid.replaceChildren(...LEVELS.map(level=>{
    const button=document.createElement('button');
    const completed=progress.completedLevels.includes(level.id);
    const unlocked=completed||level.id<=progress.unlockedLevel;
    button.type='button';
    const celestialType=PLANET_MISSION_IDS.has(level.id)?'planet':'star';
    button.className=`level-object ${celestialType}${completed?' completed':''}${!unlocked?' locked':''}${level.id===progress.unlockedLevel&&!completed?' current':''}`;
    button.disabled=!unlocked;
    button.dataset.level=String(level.id);
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
  }));
}

function showMap({historyMode='push'}={}){
  stopRound();
  renderLevelMap();
  showScreen('mapScreen',{historyMode,historyView:'map'});
}

function requestLevel(levelId){
  if(levelId===DIVISION_MISSION_ID&&!progress.divisionLessonSeen){
    showLesson(LESSON_CONFIG.divisionMode,DIVISION_MISSION_ID);
    return;
  }
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
  const chapterComplete=levelPassed&&currentLevel.id===FINAL_MISSION_ID;
  const firstCompletion=levelPassed&&!progress.completedLevels.includes(currentLevel.id);

  mistakeCount.textContent=mistakes;
  timeCount.textContent=formatTime(elapsed);

  if(levelPassed){
    if(!progress.completedLevels.includes(currentLevel.id))progress.completedLevels.push(currentLevel.id);
    progress.completedLevels.sort((a,b)=>a-b);
    progress.unlockedLevel=Math.min(FINAL_MISSION_ID,Math.max(progress.unlockedLevel,currentLevel.id+1));
    saveProgress();
    configureRewardScene(currentLevel.id,firstCompletion,true);
    const milestone=currentLevel.id===SHIP_MISSION_ID||currentLevel.id===ENGINE_MISSION_ID||chapterComplete;
    resultEyebrow.hidden=true;
    resultEyebrow.textContent='';
    resultTitle.textContent=t('result.done');
    resultTitle.hidden=false;
    resultMessage.textContent='';
    resultMessage.hidden=true;
    resultPrimaryButton.textContent=chapterComplete?t('result.missions'):t('result.next');
    resultMapButton.hidden=chapterComplete;
    resultAction=chapterComplete?'map':'next';
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
  showScreen('resultScreen',{
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
  });
  startRewardCinematic(levelPassed,currentLevel.id,firstCompletion);
}

function setRewardProgressState(levelId,firstCompletion){
  const shipStep=Math.min(STORY_SEGMENT_LENGTH,levelId);
  const engineStep=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,levelId-SHIP_MISSION_ID));
  const portalStep=Math.min(STORY_SEGMENT_LENGTH,Math.max(0,levelId-ENGINE_MISSION_ID));
  const previousShip=firstCompletion&&levelId<=SHIP_MISSION_ID?Math.max(0,shipStep-1):shipStep;
  const previousEngine=firstCompletion&&levelId>SHIP_MISSION_ID&&levelId<=ENGINE_MISSION_ID?Math.max(0,engineStep-1):engineStep;
  const previousPortal=firstCompletion&&levelId>ENGINE_MISSION_ID?Math.max(0,portalStep-1):portalStep;

  const setState=(selector,previous,current)=>{
    rewardScene.querySelectorAll(selector).forEach(element=>{
      element.classList.remove('is-earned','is-new-reward');
      const step=Number(element.dataset.rewardPart||element.dataset.rewardEngine||element.dataset.rewardPortal);
      if(step<=previous)element.classList.add('is-earned');
      else if(firstCompletion&&step===current)element.classList.add('is-new-reward');
    });
  };

  setState('[data-reward-part]',levelId>SHIP_MISSION_ID?STORY_SEGMENT_LENGTH:previousShip,shipStep);
  setState('[data-reward-engine]',levelId>ENGINE_MISSION_ID?STORY_SEGMENT_LENGTH:previousEngine,engineStep);
  setState('[data-reward-portal]',previousPortal,portalStep);
  rewardScene.style.setProperty('--portal-before',String(previousPortal));
  rewardScene.style.setProperty('--portal-after',String(portalStep));
}

function configureRewardScene(levelId,firstCompletion,levelPassed){
  rewardScene.className='result-animation reward-scene';
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
  setRewardProgressState(levelId,firstCompletion);
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

  const changeOffset=firstCompletion?REWARD_BEFORE_HOLD:0;
  const cue=(delay,callback)=>scheduleCinematic(changeOffset+delay,callback);
  const beginRewardChange=()=>{
    rewardScene.classList.add('is-playing');
    if(firstCompletion)playSound('rewardReveal');
  };

  if(firstCompletion){
    resultScreen.classList.add('reward-cinematic-locked');
    resultPrimaryButton.disabled=true;
    resultMapButton.disabled=true;
    scheduleCinematic(REWARD_BEFORE_HOLD,beginRewardChange);
  }else{
    resultScreen.classList.add('reward-reveal-complete');
    beginRewardChange();
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
  if(firstCompletion){
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
    const nextLevel=Math.min(FINAL_MISSION_ID,currentLevel.id+1);
    if(nextLevel===DIVISION_MISSION_ID&&!progress.divisionLessonSeen){
      showLesson(LESSON_CONFIG.divisionMode,DIVISION_MISSION_ID,{historyMode:'replace'});
    }else{
      startLevel(nextLevel,{historyMode:'replace'});
    }
    return;
  }
  history.back();
}

function restoreResult(state){
  stopRound();
  currentLevel=LEVELS.find(level=>level.id===state.levelId)||currentLevel;
  resultAction=state.resultAction||'map';
  resultEyebrow.textContent='';
  resultEyebrow.hidden=true;
  resultTitle.textContent=state.resultTitle||t('result.titlePassed');
  resultMessage.textContent=state.resultMessage||'';
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
  if(state.view==='guard'){
    if(progress.multiplicationLessonSeen)showMap({historyMode:'push'});
    else showLesson(LESSON_CONFIG.initialMode,null,{historyMode:'push'});
  }
  else if(state.view==='map')showMap({historyMode:'none'});
  else if(state.view==='explanations')showExplanationHub({historyMode:'none'});
  else if(state.view==='lesson')showLesson(state.mode,state.pendingLevel,{historyMode:'none'});
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
  showLesson(LESSON_CONFIG.initialMode,null,{historyMode:'replace'});
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

function openInstallHelp(){
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.finally(()=>{deferredInstallPrompt=null});
    return;
  }
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
  if(currentLessonMode===LESSON_CONFIG.divisionMode)progress.divisionLessonSeen=true;
  else progress.multiplicationLessonSeen=true;
  saveProgress();
  if(pendingLevelAfterLesson==='explanations'){
    pendingLevelAfterLesson=null;
    history.back();
  }else if(pendingLevelAfterLesson==='map'){
    pendingLevelAfterLesson=null;
    history.back();
  }else if(Number.isInteger(pendingLevelAfterLesson)){
    const level=pendingLevelAfterLesson;
    pendingLevelAfterLesson=null;
    startLevel(level,{historyMode:'replace'});
  }else{
    writeNavigationState('map',{},'replace');
    startLevel(1);
  }
});
document.querySelector('#repeatLessonButton').addEventListener('click',showExplanationHub);
document.querySelector('#repeatMultiplicationButton').addEventListener('click',()=>showLesson(LESSON_CONFIG.initialMode,'explanations'));
repeatDivisionButton.addEventListener('click',()=>showLesson(LESSON_CONFIG.divisionMode,'explanations'));
document.querySelector('#explanationBackButton').addEventListener('click',()=>history.back());
document.querySelector('#backToMapButton').addEventListener('click',()=>showMap());
resultMapButton.addEventListener('click',()=>showMap());
resultPrimaryButton.addEventListener('click',runResultAction);
document.querySelector('#resetProgressButton').addEventListener('click',resetProgress);
soundToggleButton.addEventListener('click',toggleSound);
shareGameButton.addEventListener('click',shareGame);
copyShareLinkButton.addEventListener('click',copyShareLink);
shareDialog.addEventListener('click',event=>{
  if(event.target===shareDialog)shareDialog.close();
});
installGameButton.addEventListener('click',openInstallHelp);
confirmInstallButton.addEventListener('click',openInstallHelp);
installDialog.addEventListener('click',event=>{if(event.target===installDialog)installDialog.close()});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;confirmInstallButton.hidden=false});
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
  history.replaceState(navigationState('guard'),'',`${location.pathname}${location.search}`);
  if(progress.multiplicationLessonSeen)showMap({historyMode:'push'});
  else showLesson(LESSON_CONFIG.initialMode,null,{historyMode:'push'});
}
prepareIntro();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});

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
