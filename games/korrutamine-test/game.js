const translations={
  ru:{
    reset:'Сбросить тест',prototype:'ТЕСТОВАЯ ВЕРСИЯ',storyTitle:'Звёздный вызов',
    storyText:'Над EDUKASS начался волшебный звездопад. Решай примеры, отталкивай звёзды правильными ответами и собери энергию для ракеты.',
    chooseSpeed:'Выбери скорость звездопада',slow:'Медленно',normal:'Обычно',fast:'Быстро',openMap:'К уровням',
    journey:'ЗВЁЗДНЫЙ МАРШРУТ EDUKASS',mapTitle:'Карта уровней',mapText:'Пройди три уровня и собери три звезды для запуска ракеты.',
    energy:'Звёзды',orbit:'Орбита',nebula:'Туманность',spaceport:'Космодром',mapTip:'Начни с уровня ×2.',
    locked:'Сначала пройди предыдущий уровень.',mapBack:'← Карта',answers:'Примеры',solve:'Реши пример',
    keyboardTip:'Ответ проверится сам — Enter нажимать не нужно.',wellDone:'ОТЛИЧНО!',levelDone:'Уровень пройден',
    resultText:'Ты оттолкнул звездопад и получил звезду энергии.',mistakes:'Ошибки',time:'Время',continue:'Продолжить путь',
    almost:'Почти получилось!',retryText:'Звёздный дождь добрался до EDUKASS. Начнём уровень сначала.',retry:'Повторить',
    slower:'Сделать медленнее',testComplete:'ТЕСТ ПРОЙДЕН',rocketReady:'Ракета EDUKASS готова!',
    finalText:'Ты собрал три звезды на уровнях ×2, ×5 и ×10. Ракета готова к полёту!',backMap:'Вернуться на карту',
    correct:'Верно! Звёзды отступают.',wrong:'Пока неверно — попробуй ещё.',done:'Звездопад побеждён!',
    location0:'Орбита',location1:'Туманность',location2:'Космодром'
  },
  et:{
    reset:'Lähtesta test',prototype:'TESTVERSIOON',storyTitle:'Täheväljakutse',
    storyText:'EDUKASSi kohal algas võlutud tähesadu. Lahenda tehted, lükka tähed õigete vastustega tagasi ja kogu raketile energiat.',
    chooseSpeed:'Vali tähesaju kiirus',slow:'Aeglane',normal:'Tavaline',fast:'Kiire',openMap:'Tasemetesse',
    journey:'EDUKASSI TÄHERADA',mapTitle:'Taseme kaart',mapText:'Läbi kolm taset ja kogu raketi stardiks kolm tähte.',
    energy:'Tähed',orbit:'Orbiit',nebula:'Udukogu',spaceport:'Kosmodroom',mapTip:'Alusta ×2 tasemest.',
    locked:'Läbi kõigepealt eelmine tase.',mapBack:'← Kaart',answers:'Tehted',solve:'Lahenda tehe',
    keyboardTip:'Vastus kontrollitakse ise — Enterit pole vaja.',wellDone:'VÄGA TUBLI!',levelDone:'Tase on läbitud',
    resultText:'Lükkasid tähesaju tagasi ja said energiatähe.',mistakes:'Vead',time:'Aeg',continue:'Jätka teekonda',
    almost:'Peaaegu!',retryText:'Tähesadu jõudis EDUKASSini. Alustame taset uuesti.',retry:'Proovi uuesti',
    slower:'Tee aeglasemaks',testComplete:'TEST LÄBITUD',rocketReady:'EDUKASSi rakett on valmis!',
    finalText:'Kogusid ×2, ×5 ja ×10 tasemel kolm tähte. Rakett on lennuks valmis!',backMap:'Tagasi kaardile',
    correct:'Õige! Tähed taanduvad.',wrong:'Veel mitte — proovi uuesti.',done:'Tähesadu on võidetud!',
    location0:'Orbiit',location1:'Udukogu',location2:'Kosmodroom'
  }
};

const screens=[...document.querySelectorAll('.screen')];
const levelNodes=[...document.querySelectorAll('.level-node')];
const speedButtons=[...document.querySelectorAll('.speed-button')];
const answerDisplay=document.querySelector('#answerDisplay');
const feedback=document.querySelector('#feedback');
const factorA=document.querySelector('#factorA');
const factorB=document.querySelector('#factorB');
const correctCount=document.querySelector('#correctCount');
const mistakeCount=document.querySelector('#mistakeCount');
const timeCount=document.querySelector('#timeCount');
const locationName=document.querySelector('#locationName');
const battleTitle=document.querySelector('#battleTitle');
const energyCount=document.querySelector('#energyCount');
const mapTip=document.querySelector('#mapTip');
const retryDialog=document.querySelector('#retryDialog');
const finalDialog=document.querySelector('#finalDialog');
const distanceFill=document.querySelector('#distanceFill');
const meterStar=document.querySelector('.shower-meter i');
const starCurtain=document.querySelector('#starCurtain');
const battleStage=document.querySelector('#battleStage');
const questionCard=document.querySelector('#questionCard');
const heroZone=document.querySelector('#heroZone');

const levelData=[
  {table:2,color:'#7f68d9'},
  {table:5,color:'#e561a0'},
  {table:10,color:'#ff9a3c'}
];
const speeds={
  slow:{seconds:18,back:.24},
  normal:{seconds:13,back:.21},
  fast:{seconds:9,back:.18}
};
const AUTO_CHECK_DELAY=650;

let language=localStorage.getItem('edukass-math-lang')||'ru';
let selectedSpeed=localStorage.getItem('edukass-math-speed')||'slow';
let unlocked=Number(localStorage.getItem('edukass-math-unlocked')||0);
let completed=JSON.parse(localStorage.getItem('edukass-math-completed')||'[false,false,false]');
let currentLevel=0;
let currentAnswer='';
let currentQuestion=null;
let correct=0;
let mistakes=0;
let showerProgress=0;
let motionFrame=null;
let lastMotionTime=null;
let battleStartedAt=0;
let roundActive=false;
let inputLocked=false;
let questionQueue=[];
let autoCheckTimer=null;

function t(key){return translations[language][key]??key}

function applyLanguage(){
  document.documentElement.lang=language==='ru'?'ru':'et';
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
  document.querySelector('#languageButton').textContent=language==='ru'?'ET':'RU';
  updateMap();
  if(document.querySelector('#battleScreen').classList.contains('is-active'))updateBattleLabels();
}

function showScreen(id){
  screens.forEach(screen=>screen.classList.toggle('is-active',screen.id===id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function updateSpeedUI(){
  speedButtons.forEach(button=>button.classList.toggle('active',button.dataset.speed===selectedSpeed));
}

function updateMap(){
  const done=completed.filter(Boolean).length;
  energyCount.textContent=`${done}/3`;
  levelNodes.forEach((node,index)=>{
    node.classList.toggle('locked',index>unlocked);
    node.classList.toggle('completed',Boolean(completed[index]));
    node.disabled=index>unlocked;
    node.querySelector('small').textContent=t(['orbit','nebula','spaceport'][index]);
  });
  mapTip.textContent=done===3?t('rocketReady'):(unlocked===0?t('mapTip'):`${t('continue')}: ×${levelData[Math.min(unlocked,2)].table}`);
}

function updateBattleLabels(){
  locationName.textContent=t(`location${currentLevel}`);
  battleTitle.textContent=`×${levelData[currentLevel].table}`;
}

function prepareQuestions(){
  const table=levelData[currentLevel].table;
  questionQueue=shuffle([1,2,3,4,5,6,7,8,9,10]).map(number=>({a:table,b:number,answer:table*number,retryQueued:false}));
}

function shuffle(array){
  for(let index=array.length-1;index>0;index--){
    const other=Math.floor(Math.random()*(index+1));
    [array[index],array[other]]=[array[other],array[index]];
  }
  return array;
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

function startLevel(index){
  if(index>unlocked){mapTip.textContent=t('locked');return}
  clearAutoCheck();
  currentLevel=index;
  correct=0;
  mistakes=0;
  showerProgress=0;
  currentAnswer='';
  inputLocked=false;
  roundActive=true;
  correctCount.textContent='0';
  feedback.textContent='';
  feedback.className='feedback';
  answerDisplay.textContent='?';
  questionCard.className='question-card';
  heroZone.className='hero-zone';
  starCurtain.className='star-curtain';
  battleStage.className='battle-stage';
  battleStage.style.setProperty('--level-accent',levelData[index].color);
  prepareQuestions();
  updateBattleLabels();
  setShowerPosition();
  showScreen('battleScreen');
  battleStartedAt=Date.now();
  nextQuestion();
  startShowerMotion();
}

function nextQuestion(){
  if(correct>=10){finishLevel();return}
  if(questionQueue.length===0)prepareQuestions();
  currentQuestion=questionQueue.shift();
  currentAnswer='';
  answerDisplay.textContent='?';
  feedback.textContent='';
  feedback.className='feedback';
  questionCard.classList.remove('is-correct','is-wrong');
  factorA.textContent=currentQuestion.a;
  factorB.textContent=currentQuestion.b;
}

function startShowerMotion(){
  cancelAnimationFrame(motionFrame);
  lastMotionTime=null;
  motionFrame=requestAnimationFrame(moveShower);
}

function moveShower(timestamp){
  if(!roundActive)return;
  if(lastMotionTime==null)lastMotionTime=timestamp;
  const delta=(timestamp-lastMotionTime)/1000;
  lastMotionTime=timestamp;
  showerProgress+=delta/speeds[selectedSpeed].seconds;
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
  const progress=Math.max(0,Math.min(1,showerProgress));
  const top=-39+(progress*71);
  starCurtain.style.setProperty('--shower-top',`${top}%`);
  distanceFill.style.height=`${progress*100}%`;
  meterStar.style.top=`calc(${progress*100}% - 9px)`;
}

function enterDigit(value){
  if(!roundActive||inputLocked)return;
  clearAutoCheck();
  feedback.textContent='';
  feedback.className='feedback';
  questionCard.classList.remove('is-wrong');

  if(value==='clear'){
    currentAnswer=currentAnswer.slice(0,-1);
  }else if(value==='clearAll'){
    currentAnswer='';
  }else if(currentAnswer.length<3){
    currentAnswer+=value;
  }

  answerDisplay.textContent=currentAnswer||'?';
  if(currentAnswer)autoCheckTimer=setTimeout(submitAnswer,AUTO_CHECK_DELAY);
}

function clearAutoCheck(){
  if(autoCheckTimer!=null){
    clearTimeout(autoCheckTimer);
    autoCheckTimer=null;
  }
}

function submitAnswer(){
  clearAutoCheck();
  if(!roundActive||inputLocked||!currentAnswer)return;
  const value=Number(currentAnswer);

  if(value===currentQuestion.answer){
    inputLocked=true;
    correct++;
    correctCount.textContent=correct;
    feedback.textContent=t('correct');
    feedback.className='feedback good';
    questionCard.classList.add('is-correct');
    heroZone.classList.add('celebrate');
    starCurtain.classList.remove('repelled');
    void starCurtain.offsetWidth;
    starCurtain.classList.add('repelled');
    showerProgress=Math.max(0,showerProgress-speeds[selectedSpeed].back);
    setShowerPosition();

    if(correct>=10){
      roundActive=false;
      cancelAnimationFrame(motionFrame);
    }

    setTimeout(()=>{
      starCurtain.classList.remove('repelled');
      heroZone.classList.remove('celebrate');
      questionCard.classList.remove('is-correct');
      inputLocked=false;
      nextQuestion();
    },520);
    return;
  }

  inputLocked=true;
  mistakes++;
  feedback.textContent=t('wrong');
  feedback.className='feedback bad';
  questionCard.classList.add('is-wrong');
  if(!currentQuestion.retryQueued){
    currentQuestion.retryQueued=true;
    questionQueue.splice(Math.min(2,questionQueue.length),0,{...currentQuestion,retryQueued:false});
  }

  setTimeout(()=>{
    currentAnswer='';
    answerDisplay.textContent='?';
    questionCard.classList.remove('is-wrong');
    inputLocked=false;
  },430);
}

function triggerImpact(){
  roundActive=false;
  inputLocked=true;
  clearAutoCheck();
  cancelAnimationFrame(motionFrame);
  starCurtain.classList.add('impact');
  heroZone.classList.add('impact');
  battleStage.classList.add('is-impact');
  setTimeout(()=>{
    if(!retryDialog.open)retryDialog.showModal();
  },650);
}

function finishLevel(){
  roundActive=false;
  inputLocked=true;
  clearAutoCheck();
  cancelAnimationFrame(motionFrame);
  feedback.textContent=t('done');
  feedback.className='feedback good';
  heroZone.classList.add('celebrate');
  const elapsed=Math.round((Date.now()-battleStartedAt)/1000);
  mistakeCount.textContent=mistakes;
  timeCount.textContent=formatTime(elapsed);
  document.querySelector('#resultText').textContent=t('resultText');
  completed[currentLevel]=true;
  unlocked=Math.max(unlocked,Math.min(2,currentLevel+1));
  saveProgress();
  setTimeout(()=>showScreen('resultScreen'),720);
}

function formatTime(seconds){
  return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
}

function saveProgress(){
  localStorage.setItem('edukass-math-unlocked',String(unlocked));
  localStorage.setItem('edukass-math-completed',JSON.stringify(completed));
}

function lowerSpeed(){
  selectedSpeed=selectedSpeed==='fast'?'normal':'slow';
  localStorage.setItem('edukass-math-speed',selectedSpeed);
  updateSpeedUI();
}

function stopRound(){
  roundActive=false;
  inputLocked=true;
  clearAutoCheck();
  cancelAnimationFrame(motionFrame);
}

function resetAll(){
  if(!confirm(language==='ru'?'Сбросить весь тестовый прогресс?':'Kas lähtestada kogu testprogress?'))return;
  stopRound();
  unlocked=0;
  completed=[false,false,false];
  saveProgress();
  showScreen('storyScreen');
  updateMap();
}

speedButtons.forEach(button=>button.addEventListener('click',()=>{
  selectedSpeed=button.dataset.speed;
  localStorage.setItem('edukass-math-speed',selectedSpeed);
  updateSpeedUI();
}));

document.querySelector('#languageButton').addEventListener('click',()=>{
  language=language==='ru'?'et':'ru';
  localStorage.setItem('edukass-math-lang',language);
  applyLanguage();
});

document.querySelector('#resetButton').addEventListener('click',resetAll);
document.querySelector('#openMapButton').addEventListener('click',()=>{updateMap();showScreen('mapScreen')});
levelNodes.forEach(node=>node.addEventListener('click',()=>startLevel(Number(node.dataset.level))));
document.querySelector('#backToMapButton').addEventListener('click',()=>{stopRound();updateMap();showScreen('mapScreen')});
document.querySelectorAll('[data-key]').forEach(button=>button.addEventListener('click',()=>enterDigit(button.dataset.key)));

document.addEventListener('keydown',event=>{
  if(!document.querySelector('#battleScreen').classList.contains('is-active'))return;
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

document.querySelector('#retryButton').addEventListener('click',()=>{retryDialog.close();startLevel(currentLevel)});
document.querySelector('#slowerButton').addEventListener('click',()=>{retryDialog.close();lowerSpeed();startLevel(currentLevel)});
document.querySelector('#continueButton').addEventListener('click',()=>{
  updateMap();
  showScreen('mapScreen');
  if(completed.every(Boolean))setTimeout(()=>finalDialog.showModal(),350);
});
document.querySelector('#closeFinalButton').addEventListener('click',()=>{finalDialog.close();updateMap();showScreen('mapScreen')});
retryDialog.addEventListener('cancel',event=>{event.preventDefault();retryDialog.close();updateMap();showScreen('mapScreen')});

buildStars();
updateSpeedUI();
applyLanguage();
updateMap();
