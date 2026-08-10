function trackPlausible(eventName){
  if(typeof window.plausible==='function')window.plausible(eventName);
}

const allItems = [
  {id:'vihik', word:'vihik'}, {id:'õpik', word:'õpik'}, {id:'raamat', word:'raamat'},
  {id:'pinal', word:'pinal'}, {id:'pliiats', word:'pliiats'}, {id:'pastakas', word:'pastakas'},
  {id:'kustukumm', word:'kustukumm'}, {id:'joonlaud', word:'joonlaud'},
  {id:'värvipliiatsid', word:'värvipliiatsid'}, {id:'liim', word:'liim'}
];

const board = document.querySelector('#board');
const movesEl = document.querySelector('#moves');
const matchedEl = document.querySelector('#matched');
const totalPairsEl = document.querySelector('#totalPairs');
const timerEl = document.querySelector('#timer');
const bestEl = document.querySelector('#best');
const soundButton = document.querySelector('#soundButton');
const restartButton = document.querySelector('#restartButton');
const learnButton = document.querySelector('#learnButton');
const learnDialog = document.querySelector('#learnDialog');
const winDialog = document.querySelector('#winDialog');
const wordList = document.querySelector('#wordList');
const winSummary = document.querySelector('#winSummary');
const playAgainButton = document.querySelector('#playAgainButton');

let level = 6;
let firstCard = null;
let secondCard = null;
let boardLocked = false;
let moves = 0;
let matches = 0;
let seconds = 0;
let timerId = null;
let started = false;
let soundOn = true;
let audioContext = null;

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function activeItems(){ return allItems.slice(0, level); }
function formatTime(value){ return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`; }
function bestKey(){ return `kiisu-koolikott-best-${level}`; }
function updateBest(){
  const best=JSON.parse(localStorage.getItem(bestKey())||'null');
  bestEl.textContent=best ? `${best.moves} / ${formatTime(best.seconds)}` : '—';
}
function startTimer(){
  if(started) return;
  started=true;
  trackPlausible('Koolikott Start');
  timerId=setInterval(()=>{ seconds++; timerEl.textContent=formatTime(seconds); },1000);
}
function stopTimer(){ clearInterval(timerId); timerId=null; }

function ensureAudio(){
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
  if(audioContext.state==='suspended') audioContext.resume();
}
function ping(kind='flip'){
  if(!soundOn) return;
  ensureAudio();
  const now=audioContext.currentTime;
  const osc=audioContext.createOscillator();
  const gain=audioContext.createGain();
  const freq=kind==='match'?880:kind==='win'?1040:kind==='wrong'?180:520;
  osc.type=kind==='wrong'?'triangle':'sine';
  osc.frequency.setValueAtTime(freq,now);
  if(kind==='match') osc.frequency.exponentialRampToValueAtTime(1320,now+.12);
  if(kind==='win') osc.frequency.exponentialRampToValueAtTime(1560,now+.25);
  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(kind==='win'?.17:.09,now+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,now+(kind==='win'?.35:.16));
  osc.connect(gain); gain.connect(audioContext.destination); osc.start(now); osc.stop(now+(kind==='win'?.36:.18));
}

function makeCard(item,type){
  const button=document.createElement('button');
  button.className='memory-card';
  button.type='button';
  button.dataset.pair=item.id;
  button.dataset.type=type;
  button.setAttribute('aria-label','Suletud kaart');
  button.innerHTML=`<span class="card-face card-back" aria-hidden="true"></span>
    <span class="card-face card-front ${type}">${type==='picture'?`<img src="assets/${item.id}.png" alt="${item.word}">`:`<span>${item.word}</span>`}</span>`;
  button.addEventListener('click',()=>flipCard(button));
  return button;
}

function buildGame(){
  stopTimer(); firstCard=secondCard=null; boardLocked=false; moves=0; matches=0; seconds=0; started=false;
  movesEl.textContent='0'; matchedEl.textContent='0'; totalPairsEl.textContent=level; timerEl.textContent='00:00'; updateBest();
  const cards=[];
  activeItems().forEach((item)=>{cards.push(makeCard(item,'picture'));cards.push(makeCard(item,'word'));});
  shuffle(cards);
  board.replaceChildren(...cards);
  board.style.setProperty('--columns',level===10?10:6);
  board.style.setProperty('--mobile-columns',level===10?4:3);
  buildWordList();
}

function flipCard(card){
  if(boardLocked||card===firstCard||card.classList.contains('is-matched')) return;
  startTimer(); ping('flip');
  card.classList.add('is-flipped');
  card.setAttribute('aria-label',card.dataset.type==='picture'?'Pildikaart':'Sõnakaart');
  if(!firstCard){ firstCard=card; return; }
  secondCard=card; moves++; movesEl.textContent=moves; checkPair();
}
function checkPair(){
  const samePair=firstCard.dataset.pair===secondCard.dataset.pair;
  const differentType=firstCard.dataset.type!==secondCard.dataset.type;
  if(samePair&&differentType){
    boardLocked=true;
    setTimeout(()=>{
      firstCard.classList.add('is-matched');secondCard.classList.add('is-matched');ping('match');
      matches++;matchedEl.textContent=matches;resetTurn();
      if(matches===level) finishGame();
    },340);
  }else{
    boardLocked=true;firstCard.classList.add('is-wrong');secondCard.classList.add('is-wrong');ping('wrong');
    setTimeout(()=>{
      firstCard.classList.remove('is-flipped','is-wrong');secondCard.classList.remove('is-flipped','is-wrong');resetTurn();
    },900);
  }
}
function resetTurn(){ [firstCard,secondCard]=[null,null];boardLocked=false; }
function finishGame(){
  stopTimer();
  trackPlausible('Koolikott Complete');
  ping('win');
  const old=JSON.parse(localStorage.getItem(bestKey())||'null');
  if(!old||moves<old.moves||(moves===old.moves&&seconds<old.seconds)){
    localStorage.setItem(bestKey(),JSON.stringify({moves,seconds}));
  }
  updateBest(); winSummary.textContent=`Leidsid ${level} paari ${moves} käiguga. Aeg: ${formatTime(seconds)}.`;
  createConfetti(); setTimeout(()=>winDialog.showModal(),480);
}
function createConfetti(){
  const box=winDialog.querySelector('.confetti');box.innerHTML='';
  for(let i=0;i<42;i++){
    const piece=document.createElement('i');piece.style.left=`${Math.random()*100}%`;piece.style.animationDelay=`${Math.random()*1.8}s`;piece.style.animationDuration=`${1.7+Math.random()*1.8}s`;piece.style.transform=`rotate(${Math.random()*180}deg)`;box.appendChild(piece);
  }
}
function buildWordList(){
  wordList.innerHTML=activeItems().map(item=>`<div class="word-item"><img src="assets/${item.id}.png" alt=""><strong>${item.word}</strong></div>`).join('');
}

document.querySelectorAll('[data-level]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-level]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');level=Number(btn.dataset.level);buildGame();
}));
restartButton.addEventListener('click',buildGame);
playAgainButton.addEventListener('click',()=>{winDialog.close();buildGame();});
learnButton.addEventListener('click',()=>learnDialog.showModal());
soundButton.addEventListener('click',()=>{
  soundOn=!soundOn;soundButton.setAttribute('aria-pressed',String(soundOn));soundButton.firstChild.textContent=soundOn?'🔊 ':'🔇 ';
});

buildGame();
