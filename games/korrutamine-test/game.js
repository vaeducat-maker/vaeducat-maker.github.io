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

const STORAGE_KEY='edukass-chapter-one-v18';
const SOUND_KEY='edukass-sound-enabled';
const ROUND_LENGTH=15;
const ANSWER_DELAYS={exact:480,possiblePrefix:2200,wrong:1050};
const START_SHOWER_PROGRESS=.08;
const WRONG_ANSWER_ADVANCE=.105;

const LEVELS=[
  {id:1,title:'Карточки умножения',short:'Выбор ×',mode:'choice',operation:'multiply',seconds:175,accent:'#70d9cf'},
  {id:2,title:'Двойка начинается',short:'×2 · 1–5',mode:'input',operation:'multiply',seconds:165,accent:'#70d9cf'},
  {id:3,title:'Продолжаем двойку',short:'×2 · 6–10',mode:'input',operation:'multiply',seconds:150,accent:'#69cde0'},
  {id:4,title:'Вся таблица на 2',short:'×2 · всё',mode:'input',operation:'multiply',seconds:140,accent:'#63bfe4'},
  {id:5,title:'Двойка с другой стороны',short:'число × 2',mode:'input',operation:'multiply',seconds:132,accent:'#6baee5'},
  {id:6,title:'Меняем стороны',short:'×2 ↔ 2×',mode:'input',operation:'multiply',seconds:125,accent:'#779ce2'},
  {id:7,title:'Уверенная двойка',short:'Точность',mode:'input',operation:'multiply',seconds:118,accent:'#858bdd'},
  {id:8,title:'Повторяем трудное',short:'Повтор',mode:'input',operation:'multiply',seconds:112,accent:'#927bd5'},
  {id:9,title:'Подготовка к проверке',short:'Смешиваем',mode:'input',operation:'multiply',seconds:106,accent:'#9d70cd'},
  {id:10,title:'Проверка умножения',short:'Проверка ×',mode:'input',operation:'multiply',seconds:100,accent:'#a966c2'},
  {id:11,title:'Карточки деления',short:'Выбор ÷',mode:'choice',operation:'divide',seconds:175,accent:'#e561a0'},
  {id:12,title:'Делим на 2',short:'÷2 · 1–5',mode:'input',operation:'divide',seconds:165,accent:'#e86f91'},
  {id:13,title:'Деление продолжается',short:'÷2 · 6–10',mode:'input',operation:'divide',seconds:150,accent:'#ed7d80'},
  {id:14,title:'Всё деление на 2',short:'÷2 · всё',mode:'input',operation:'divide',seconds:135,accent:'#ef8d6e'},
  {id:15,title:'Умножение и деление',short:'× и ÷',mode:'input',operation:'mixed',seconds:120,accent:'#f39b60'}
];

let progress=loadProgress();
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
let currentLessonMode='multiply';
let pendingLevelAfterLesson=null;
let resultAction='map';
let soundEnabled=loadSoundPreference();
let audioContext=null;

function defaultProgress(){
  return {unlockedLevel:1,completedLevels:[],multiplicationLessonSeen:false,divisionLessonSeen:false,factStats:{}};
}

function loadProgress(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved&&Number.isInteger(saved.unlockedLevel)&&Array.isArray(saved.completedLevels)){
      return {...defaultProgress(),...saved,unlockedLevel:Math.max(1,Math.min(15,saved.unlockedLevel))};
    }
  }catch(error){/* Start with an empty chapter. */}
  return defaultProgress();
}

function saveProgress(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
}

function loadSoundPreference(){
  return localStorage.getItem(SOUND_KEY)!=='false';
}

function updateSoundButton(){
  soundToggleButton.textContent=soundEnabled?'🔊':'🔇';
  soundToggleButton.setAttribute('aria-pressed',String(soundEnabled));
  soundToggleButton.setAttribute('aria-label',soundEnabled?'Выключить звук':'Включить звук');
}

function toggleSound(){
  soundEnabled=!soundEnabled;
  localStorage.setItem(SOUND_KEY,String(soundEnabled));
  updateSoundButton();
  if(soundEnabled)playSound('key');
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
  if(kind==='impact'){
    playTone(165,0,.22,.045,'triangle');
    playTone(120,.14,.28,.035,'sine');
  }
}

function showScreen(id){
  screens.forEach(screen=>screen.classList.toggle('is-active',screen.id===id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function shuffle(array){
  const copy=[...array];
  for(let index=copy.length-1;index>0;index--){
    const other=Math.floor(Math.random()*(index+1));
    [copy[index],copy[other]]=[copy[other],copy[index]];
  }
  return copy;
}

function mul(a,b){return {a,b,answer:a*b,operation:'multiply',factor:a===2?b:(b===2?a:Math.max(a,b)),table:a===1||b===1?1:2}}
function div(factor,divisor=2){return {a:factor*divisor,b:divisor,answer:factor,operation:'divide',factor,table:divisor}}

function repeatedMultiplication(factors,orientation='forward',copies=1){
  const questions=[];
  for(let copy=0;copy<copies;copy++){
    factors.forEach((factor,index)=>{
      const reverse=orientation==='reverse'||(orientation==='mixed'&&(index+copy)%2===1);
      questions.push(reverse?mul(factor,2):mul(2,factor));
    });
  }
  return questions;
}

function repeatedDivision(factors,copies=1){
  const questions=[];
  for(let copy=0;copy<copies;copy++)factors.forEach(factor=>questions.push(div(factor,2)));
  return questions;
}

function weakestFactors(operation,count=5){
  return [1,2,3,4,5,6,7,8,9,10]
    .map(factor=>{
      const key=`${operation}:${factor}`;
      const stat=progress.factStats[key]||{correct:0,mistakes:0};
      return {factor,score:(stat.mistakes*4)-stat.correct};
    })
    .sort((left,right)=>right.score-left.score||right.factor-left.factor)
    .slice(0,count)
    .map(item=>item.factor);
}

function buildLevelQuestions(levelId){
  let questions=[];
  switch(levelId){
    case 1:
      questions=[mul(3,1),mul(1,7),mul(9,1),...repeatedMultiplication([1,2,3,4,5,6,7,8,9,10]),mul(2,6),mul(2,9)];
      break;
    case 2: questions=repeatedMultiplication([1,2,3,4,5],'forward',3); break;
    case 3: questions=repeatedMultiplication([6,7,8,9,10],'forward',3); break;
    case 4: questions=[...repeatedMultiplication([1,2,3,4,5,6,7,8,9,10]),...repeatedMultiplication([6,7,8,9,10])]; break;
    case 5: questions=[...repeatedMultiplication([1,2,3,4,5,6,7,8,9,10],'reverse'),...repeatedMultiplication([6,7,8,9,10],'reverse')]; break;
    case 6: questions=[...repeatedMultiplication([1,2,3,4,5,6,7,8,9,10],'mixed'),...repeatedMultiplication([6,7,8,9,10],'mixed')]; break;
    case 7:
    case 8: questions=[...repeatedMultiplication([1,2,3,4,5,6,7,8,9,10],'mixed'),...repeatedMultiplication(weakestFactors('multiply'),'mixed')]; break;
    case 9: questions=[...repeatedMultiplication([1,2,3,4,5,6,7,8,9,10],'mixed'),...repeatedMultiplication([5,6,7,8,9],'mixed')]; break;
    case 10: questions=[...repeatedMultiplication([1,2,3,4,5,6,7,8,9,10],'mixed'),mul(2,6),mul(7,2),mul(2,8),mul(9,2),mul(2,10)]; break;
    case 11: questions=[div(3,1),div(8,1),...repeatedDivision([1,2,3,4,5,6,7,8,9,10]),div(6),div(9),div(10)]; break;
    case 12: questions=repeatedDivision([1,2,3,4,5],3); break;
    case 13: questions=repeatedDivision([6,7,8,9,10],3); break;
    case 14: questions=[...repeatedDivision([1,2,3,4,5,6,7,8,9,10]),...repeatedDivision(weakestFactors('divide'))]; break;
    case 15: questions=[
      mul(2,4),mul(5,2),mul(2,6),mul(7,2),mul(2,8),mul(9,2),mul(2,10),
      div(3),div(4),div(5),div(6),div(7),div(8),div(9),div(10)
    ]; break;
    default: questions=repeatedMultiplication([1,2,3,4,5], 'forward',3);
  }
  return shuffle(questions).slice(0,ROUND_LENGTH);
}

function questionKey(question){
  const operation=question.operation==='divide'?'divide':'multiply';
  return `${operation}:${question.factor}`;
}

function recordFact(question,isCorrect){
  const key=questionKey(question);
  const stat=progress.factStats[key]||{correct:0,mistakes:0};
  stat[isCorrect?'correct':'mistakes']++;
  progress.factStats[key]=stat;
  saveProgress();
}

function buildChoiceOptions(question){
  const answer=question.answer;
  const step=question.operation==='multiply'&&question.table===2?2:1;
  const candidates=[answer,answer-step,answer+step,answer-1,answer+1,answer+(step*2),answer-(step*2),answer+3];
  const unique=[];
  candidates.forEach(value=>{
    if(Number.isInteger(value)&&value>=0&&value<=100&&!unique.includes(value))unique.push(value);
  });
  let filler=1;
  while(unique.length<4){
    const value=answer+filler;
    if(value<=100&&!unique.includes(value))unique.push(value);
    filler++;
  }
  const wrong=shuffle(unique.filter(value=>value!==answer)).slice(0,3);
  return shuffle([answer,...wrong]);
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
  const product=factor*2;
  demoOneEquation.textContent=`1 × ${factor} = ${factor}`;
  demoMultiplyEquation.textContent=`2 × ${factor} = ${product}`;
  demoDivisionEquation.textContent=`${product} ÷ 2 = ${factor}`;
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
  demoStars.replaceChildren(...buildRows(2));
  const divisionGroups=[];
  for(let groupIndex=0;groupIndex<2;groupIndex++){
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
  factorPicker.setAttribute('aria-label',division?'Выбери делимое':'Выбери число');
  explorerHint.textContent=division?'Нажми на делимое.':'Нажми на число.';
  document.querySelectorAll('[data-demo-factor]').forEach((button,index)=>{
    const factor=index+1;
    button.dataset.demoFactor=String(factor);
    button.textContent=String(division?factor*2:factor);
    button.setAttribute('aria-label',division?`Делимое ${factor*2}`:`Число ${factor}`);
  });
}

function showLesson(mode='multiply',pendingLevel=null){
  stopRound();
  currentLessonMode=mode;
  pendingLevelAfterLesson=pendingLevel;
  const division=mode==='divide';
  lessonEyebrow.textContent=division?'ГЛАВА 1 · ОБРАТНАЯ СВЯЗЬ':'ГЛАВА 1 · ОДИН И ДВА';
  lessonTitle.textContent=division?'Теперь делим на 2':'Открываем числа 1 и 2';
  multiplicationLesson.hidden=division;
  divisionLesson.hidden=!division;
  lessonSign.textContent=division?'÷2':'×2';
  configureDemoPicker(division);
  updateDemo(4);
  if(pendingLevel==='explanations')lessonContinueButton.textContent='К объяснениям';
  else if(pendingLevel==='map')lessonContinueButton.textContent='К миссиям';
  else if(Number.isInteger(pendingLevel))lessonContinueButton.textContent=`Открыть миссию ${pendingLevel}`;
  else lessonContinueButton.textContent='Открыть миссию 1';
  showScreen('lessonScreen');
}

function showExplanationHub(){
  stopRound();
  const divisionUnlocked=progress.divisionLessonSeen||progress.unlockedLevel>=11;
  repeatDivisionButton.disabled=!divisionUnlocked;
  repeatDivisionButton.classList.toggle('locked',!divisionUnlocked);
  repeatDivisionButton.setAttribute('aria-label',divisionUnlocked?'Повторить объяснение деления на 2':'Объяснение деления откроется после миссии 10');
  showScreen('explanationScreen');
}

function renderLevelMap(){
  completedLevelCount.textContent=progress.completedLevels.length;
  levelGrid.replaceChildren(...LEVELS.map(level=>{
    const button=document.createElement('button');
    const completed=progress.completedLevels.includes(level.id);
    const unlocked=completed||level.id<=progress.unlockedLevel;
    button.type='button';
    const celestialType=level.id%3===0||level.id===10||level.id===15?'planet':'star';
    button.className=`level-object ${celestialType}${completed?' completed':''}${!unlocked?' locked':''}${level.id===progress.unlockedLevel&&!completed?' current':''}`;
    button.disabled=!unlocked;
    button.dataset.level=String(level.id);
    button.style.setProperty('--level-accent',level.accent);
    button.innerHTML=`<span class="celestial-shape"><span class="celestial-number">${completed?'✓':level.id}</span></span><strong class="level-name">${level.short}</strong>`;
    button.setAttribute('aria-label',`Миссия ${level.id}: ${level.title}${completed?', пройдена':''}${!unlocked?', закрыта':''}`);
    if(unlocked)button.addEventListener('click',()=>requestLevel(level.id));
    return button;
  }));
}

function showMap(){
  stopRound();
  renderLevelMap();
  showScreen('mapScreen');
}

function requestLevel(levelId){
  if(levelId===11&&!progress.divisionLessonSeen){
    showLesson('divide',11);
    return;
  }
  startLevel(levelId);
}

function startLevel(levelId){
  const level=LEVELS.find(item=>item.id===levelId);
  if(!level)return;
  clearAutoCheck();
  currentLevel=level;
  questionQueue=buildLevelQuestions(levelId);
  currentQuestion=null;
  currentAnswer='';
  correct=0;
  mistakes=0;
  inputLocked=false;
  roundActive=true;
  showerProgress=START_SHOWER_PROGRESS;
  correctCount.textContent='0';
  mobileCorrectCount.textContent='0';
  mobileProgressPill.setAttribute('aria-label','Выполнено: 0 из 15');
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
  levelKicker.textContent=`МИССИЯ ${level.id} ИЗ 15`;
  battleTitle.textContent=level.title;
  const choiceMode=level.mode==='choice';
  answerPanel.classList.toggle('choice-mode',choiceMode);
  choiceGrid.hidden=!choiceMode;
  keypad.hidden=choiceMode;
  answerPanelTitle.textContent=choiceMode?'Выбери ответ':'Введи число';
  setShowerPosition();
  showScreen('battleScreen');
  battleStartedAt=Date.now();
  nextQuestion();
  startShowerMotion();
}

function nextQuestion(){
  if(!roundActive)return;
  if(correct>=ROUND_LENGTH){finishAttempt('complete');return}
  currentQuestion=questionQueue.shift();
  if(!currentQuestion){finishAttempt('complete');return}
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
  mobileProgressPill.setAttribute('aria-label',`Выполнено: ${correct} из 15`);
  feedback.textContent='Верно';
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
  feedback.textContent=`Правильный ответ ${currentQuestion.answer}`;
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
  starCurtain.classList.add('impact');
  heroZone.classList.add('impact');
  battleStage.classList.add('is-impact');
  playSound('impact');
  setTimeout(()=>finishAttempt('impact'),650);
}

function finishAttempt(reason){
  stopRound();
  const elapsed=Math.round((Date.now()-battleStartedAt)/1000);
  const levelPassed=reason==='complete'&&correct===ROUND_LENGTH;
  const chapterComplete=levelPassed&&currentLevel.id===15;

  mistakeCount.textContent=mistakes;
  timeCount.textContent=formatTime(elapsed);

  if(levelPassed){
    if(!progress.completedLevels.includes(currentLevel.id))progress.completedLevels.push(currentLevel.id);
    progress.completedLevels.sort((a,b)=>a-b);
    progress.unlockedLevel=Math.min(15,Math.max(progress.unlockedLevel,currentLevel.id+1));
    saveProgress();
    resultEyebrow.textContent=chapterComplete?'ПЕРВЫЕ 15 МИССИЙ ГОТОВЫ':'МИССИЯ ПРОЙДЕНА';
    resultTitle.textContent=chapterComplete?'Прототип главы пройден':'Миссия пройдена';
    resultMessage.textContent=chapterComplete?'Первая глава готова.':'15 правильных ответов. Следующая миссия открыта.';
    resultPrimaryButton.textContent=chapterComplete?'Вернуться к карте':currentLevel.id===10?'Перейти к делению':'Следующая миссия';
    resultAction=chapterComplete?'map':'next';
  }else{
    resultEyebrow.textContent='ПОПРОБУЕМ ЕЩЁ РАЗ';
    resultTitle.textContent='Звездопад накрыл киску';
    resultMessage.textContent='Набери 15 правильных ответов раньше звездопада.';
    resultPrimaryButton.textContent='Повторить миссию';
    resultAction='retry';
  }
  showScreen('resultScreen');
}

function runResultAction(){
  if(resultAction==='retry'){
    startLevel(currentLevel.id);
    return;
  }
  if(resultAction==='next'){
    const nextLevel=Math.min(15,currentLevel.id+1);
    if(nextLevel===11&&!progress.divisionLessonSeen){
      showLesson('divide',11);
    }else{
      startLevel(nextLevel);
    }
    return;
  }
  showMap();
}

function stopRound(){
  roundActive=false;
  inputLocked=true;
  clearAutoCheck();
  cancelAnimationFrame(motionFrame);
}

function formatTime(seconds){
  return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
}

function resetProgress(){
  if(!confirm('Начать первую главу заново? Пройденные миссии будут закрыты.'))return;
  stopRound();
  localStorage.removeItem(STORAGE_KEY);
  progress=defaultProgress();
  showLesson('multiply');
}

document.querySelectorAll('[data-demo-factor]').forEach(button=>button.addEventListener('click',()=>updateDemo(Number(button.dataset.demoFactor))));
lessonContinueButton.addEventListener('click',()=>{
  if(currentLessonMode==='divide')progress.divisionLessonSeen=true;
  else progress.multiplicationLessonSeen=true;
  saveProgress();
  if(pendingLevelAfterLesson==='explanations'){
    pendingLevelAfterLesson=null;
    showExplanationHub();
  }else if(pendingLevelAfterLesson==='map'){
    pendingLevelAfterLesson=null;
    showMap();
  }else if(Number.isInteger(pendingLevelAfterLesson)){
    const level=pendingLevelAfterLesson;
    pendingLevelAfterLesson=null;
    startLevel(level);
  }else startLevel(1);
});
document.querySelector('#repeatLessonButton').addEventListener('click',showExplanationHub);
document.querySelector('#repeatMultiplicationButton').addEventListener('click',()=>showLesson('multiply','explanations'));
repeatDivisionButton.addEventListener('click',()=>showLesson('divide','explanations'));
document.querySelector('#explanationBackButton').addEventListener('click',showMap);
document.querySelector('#backToMapButton').addEventListener('click',showMap);
document.querySelector('#resultMapButton').addEventListener('click',showMap);
resultPrimaryButton.addEventListener('click',runResultAction);
document.querySelector('#resetProgressButton').addEventListener('click',resetProgress);
soundToggleButton.addEventListener('click',toggleSound);
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

buildStars();
updateDemo(4);
updateSoundButton();
renderLevelMap();
if(progress.multiplicationLessonSeen)showMap();
else showLesson('multiply');

window.__EDUKASS_TEST__={
  LEVELS,
  buildLevelQuestions,
  buildChoiceOptions,
  requestLevel,
  startLevel,
  showMap,
  showExplanationHub,
  getState:()=>({progress:JSON.parse(JSON.stringify(progress)),currentLevel:currentLevel?.id,currentQuestion:{...currentQuestion},correct,mistakes,showerProgress,roundActive}),
  answerCorrect:()=>{
    if(!currentQuestion)return;
    if(currentLevel.mode==='choice')submitChoice(currentQuestion.answer,[...choiceGrid.children].find(button=>Number(button.dataset.choice)===currentQuestion.answer));
    else String(currentQuestion.answer).split('').forEach(digit=>enterDigit(digit));
  }
};
