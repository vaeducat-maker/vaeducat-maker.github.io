(()=>{
'use strict';
const $=id=>document.getElementById(id);
const canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NODE=580, ORIGIN=108, TOTAL=8;
const SPEED=64.5, FINAL_SPEED=56.25, TURBO_SPEED=255, TURBO_ARC_STRETCH=1.4; // 25% slower
const ORIGINAL_SPEED=86, ORIGINAL_FINAL_SPEED=75; // maintain original physical jump curves
const JUMP_V=240, JUMP_G=200, JUMP_TOTAL=2*JUMP_V/JUMP_G;
const HAZARD_HALF_WIDTH=58, CLEARANCE=76; // consistent with the rendered spike and crystal hitboxes
const COLORS={cyan:'#67fce9',cyanB:'#37e9dd',violet:'#ae8afe',pink:'#f482ef',gold:'#ffe29b',white:'#f1fff9'};
const names={10:'KÜMNELISTENI',100:'SAJALISTENI'};
const HAZARD_TYPES=['fangs','rotor','tri-spikes','lightning','prism'];
const templates=Array.from({length:8},(_,i)=>({
 unit:i===7?100:10,
 kind:i===7?'three-hundreds':i===5?'three-tens':'two-tens'
}));
let tasks=[],step=0,typed='',status='intro',solved=false,crashStart=0,crashReason='',crashElapsed=0,playElapsed=0;
let attempts=0,ceremonyToken=0,victoryStage='hidden',vaultReturn='intro';
let playerX=ORIGIN,clock=0,lastFrame=0,canvasW=0,canvasH=0,dpr=1;
let jumping=false,jumpAge=0,jumpHeight=0,jumpStarted=false,jumpCount=0,wrongLocked=false,turboActive=false,jumpScale=1;
let soundOn=false,audio=null,fxGlow=0,fxBurst=0,shake=0,toastUntil=0,rewardUnlocked=false;
let camera=ORIGIN-110,particleTrail=[],specks=[],stars=[],ambient=[],latestAnswer='',obstacleOffset=0;
function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v))}
function lerp(a,b,t){return a+(b-a)*t}
function easeOut(t){return 1-Math.pow(1-t,3)}
function easeBoth(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function random(n){return Math.floor(Math.random()*n)}
function format(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}

const VAULT_STORAGE='edukass-neon-crystal-vault-v1';
function collectedCrystals(){
 let ids=[];try{
  const parsed=JSON.parse(localStorage.getItem(VAULT_STORAGE)||'[]');
  if(Array.isArray(parsed))ids=parsed.filter(n=>Number.isInteger(n)&&n>=1&&n<=9);
  if(localStorage.getItem('edukass-neon-world1-crystal-unlocked')==='1'||localStorage.getItem('edukass-neon-world1-finished')==='1')ids.push(1);
 }catch(e){}
 return [...new Set(ids)].sort((a,b)=>a-b);
}
function awardCrystal(number){
 const ids=collectedCrystals();
 if(!ids.includes(number))ids.push(number);
 try{
  localStorage.setItem(VAULT_STORAGE,JSON.stringify(ids.sort((a,b)=>a-b)));
  if(number===1)localStorage.setItem('edukass-neon-world1-crystal-unlocked','1');
 }catch(e){}
 updateCrystalVault();
}
function collectibleSVG(id,identifier){
 // Every world has its own collectible silhouette, not merely a recolor.
 if(id===2)return "<svg viewBox=\"0 0 82 104\" aria-hidden=\"true\"><defs><linearGradient id=\"___GRAD___\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#fff6b0\"/><stop offset=\".35\" stop-color=\"#ffb642\"/><stop offset=\".73\" stop-color=\"#ff563b\"/><stop offset=\"1\" stop-color=\"#b5124b\"/></linearGradient></defs><path d=\"M41 95C17 84 11 66 18 44c7 11 12 17 20 19C22 46 26 23 42 6c14 18 20 38 6 57 11-4 15-12 20-21 9 22-1 41-27 53Z\" fill=\"url(#___GRAD___)\" stroke=\"#ffe5a2\" stroke-width=\"2.2\"/><path d=\"M41 97C29 87 22 72 29 51c4 8 9 14 12 16 9-12 14-20 12-30 10 22 1 45-12 60Z\" fill=\"#ffcc5a\" opacity=\".8\"/><path d=\"M41 22 50 48 42 76 33 48Z\" fill=\"#fff4af\" opacity=\".82\"/><path d=\"M18 60 35 74 41 95 46 74 66 60\" fill=\"none\" stroke=\"#fff2ab\" stroke-width=\"1.7\"/><path d=\"M41 12v77M30 52l11 14 11-14\" fill=\"none\" stroke=\"#fff3b8\" stroke-opacity=\".72\" stroke-width=\"1.2\"/></svg>".replaceAll('___GRAD___',identifier);
 return "<svg viewBox=\"0 0 82 104\" aria-hidden=\"true\"><defs><linearGradient id=\"___GRAD___\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#fffde3\"/><stop offset=\".25\" stop-color=\"#9effff\"/><stop offset=\".65\" stop-color=\"#4ac7f8\"/><stop offset=\"1\" stop-color=\"#4354e8\"/></linearGradient></defs><path d=\"M41 2 64 25 75 49 56 81 41 102 20 81 7 49 17 24Z\" fill=\"url(#___GRAD___)\" stroke=\"#f8ffff\" stroke-width=\"2\"/><path d=\"M41 2 17 24 7 49 41 45Z\" fill=\"#d9ffff\" opacity=\".74\"/><path d=\"M41 45 75 49 56 81 41 102Z\" fill=\"#377fc4\" opacity=\".60\"/><path d=\"M17 24 41 45 64 25M7 49l34-4 34 4M20 81l21-36 15 36M41 2v100\" stroke=\"#fff\" stroke-opacity=\".62\" fill=\"none\" stroke-width=\"1.3\"/></svg>".replaceAll('___GRAD___',identifier);
}
function updateAwardArt(){
 const id=1;
 $('awardCrystalArt').innerHTML=collectibleSVG(id,'awardWorld'+id);
}

function updateCrystalVault(){
 const ids=collectedCrystals(),count=ids.length;
 $('introCollectionCount').textContent=count+' / 9';
 $('rewardCollectionCount').textContent=count+' / 9';
 $('vaultProgress').textContent='KOGUTUD '+count+' / 9';
 const views=Array.from({length:9},(_,k)=>{
  const id=k+1,got=ids.includes(id),name=id===1?'VALGUSSAAR':id===2?'PÄIKESEKURU':'MAAILM '+String(id).padStart(2,'0');
  const title=got?(id===1?'VALGUSSAARE KRISTALL':id===2?'PÄIKESEKURU KRISTALL':'KRISTALL '+id):'LUKUS';
  return '<div class="vault-card '+(got?'unlocked':'locked')+'" style="--slot:'+(id-1)+'" aria-label="'+name+': '+title+'">'
  +'<div class="vault-card-number">'+String(id).padStart(2,'0')+'</div>'
  +'<div class="vault-card-gem">'+collectibleSVG(id,'vaultShape'+id)+'</div>'
  +'<div class="vault-card-name">'+name+'</div>'
  +'<div class="vault-card-status">'+(got?'KOGUTUD':'LUKUS')+'</div></div>';
 });
 $('vaultGrid').innerHTML=views.join('');
 $('vaultDescription').textContent=count===9?'Kõik üheksa kristalli on kogutud!':count===0?'Läbi maailmad ja kogu kõik üheksa kristalli!':'Sul on '+count+' kristall'+(count===1?'':'i')+'! Järgmine maailm toob uue auhinna.';
}
function openCrystalVault(from){
 vaultReturn=from==='finish'?'finish':'intro';
 updateCrystalVault();
 overlay('vault');
}
function closeCrystalVault(){overlay(vaultReturn)}

function numberPool(t){
 const lo=t.kind==='two-tens'?11:101,hi=t.kind==='two-tens'?99:999,nums=[];
 for(let n=lo;n<=hi;n++)if(n%t.unit!==0)nums.push(n);
 return nums;
}
function createTasks(){
 let history=[];
 try{const old=JSON.parse(localStorage.getItem('edukass-neon-world1-history-v2')||'[]');if(Array.isArray(old))history=old.filter(Array.isArray).slice(-8)}catch(e){}
 const recentlyUsed=new Set(history.slice(-3).flat());
 const usedSignatures=new Set(history.map(h=>h.join('/')));
 let result=[];
 for(let attempt=0;attempt<100;attempt++){
  const used=new Set(),answers=new Set();
  result=templates.map(t=>{
   const pool=numberPool(t);
   let options=pool.filter(n=>!used.has(n)&&!recentlyUsed.has(n)&&!answers.has(Math.floor((n+t.unit/2)/t.unit)*t.unit));
   if(!options.length)options=pool.filter(n=>!used.has(n)&&!recentlyUsed.has(n));
   if(!options.length)options=pool.filter(n=>!used.has(n));
   const v=options[random(options.length)];
   if(v===undefined)throw Error('Empty rounding pool');
   const answer=Math.floor((v+t.unit/2)/t.unit)*t.unit;
   used.add(v);answers.add(answer);
   return {v,unit:t.unit,answer,kind:t.kind};
  });
  if(!usedSignatures.has(result.map(t=>t.v).join('/')))break;
 }
 try{history.push(result.map(t=>t.v));localStorage.setItem('edukass-neon-world1-history-v2',JSON.stringify(history.slice(-8)))}catch(e){}
 return result;
}
function validateTasks(ts){
 if(ts.length!==8)throw Error('First world must have eight tasks');
 ts.forEach((t,i)=>{
  const correct=Math.floor((t.v+t.unit/2)/t.unit)*t.unit;
  if(t.answer!==correct||!Number.isSafeInteger(t.v)||!Number.isSafeInteger(t.answer))throw Error('Bad rounding task '+i);
  if(i<5&&!(t.unit===10&&t.v>=10&&t.v<=99))throw Error('Unexpected early difficulty '+i);
 });
 if(ts[5].v<100||ts[5].unit!==10||ts[6].unit!==10||ts[7].v<100||ts[7].unit!==100)throw Error('Level progression changed');
 return true;
}
function updateGems(){
 $('gems').innerHTML=Array.from({length:TOTAL},(_,i)=>`<span class="gem ${i<step?'done':i===step&&status!=='finished'?'now':''}" aria-hidden="true"></span>`).join('');
 $('step').textContent=`${step}/${TOTAL}`;
 $('answerStep').textContent=step<TOTAL?`${String(step+1).padStart(2,'0')} / 08`:'08 / 08';
}
function updateAnswer(){
 $('answerValue').textContent=typed?format(typed):'';
 $('answerValue').classList.toggle('empty',!typed);
}
function note(t='',kind=''){$('note').textContent=t;$('note').className='note '+kind}
function showTask(){
 if(step>=TOTAL)return;
 const t=tasks[step];
 $('unit').textContent=names[t.unit];$('number').textContent=format(t.v);
 $('number').classList.remove('bump');void $('number').offsetWidth;$('number').classList.add('bump');
 typed='';solved=false;jumpStarted=false;wrongLocked=false;turboActive=false;updateAnswer();$('answerBox').classList.remove('wrong','success');
 note('Vasta enne takistust!');updateGems();
 $('sceneCaption').textContent=step===TOTAL-1?'VIIMANE TAKISTUS · ÄRA PEATU':'KIIRUSTA! TAKISTUS LÄHENEB';
}
function overlay(type){
 $('overlay').classList.remove('hidden');$('overlay').setAttribute('aria-hidden','false');
 $('overlay').classList.toggle('is-celebrating',type==='victory'||type==='finish'||type==='vault');
 $('introHero').hidden=type!=='intro';
 $('victoryHero').hidden=type!=='victory';
 $('finishHero').hidden=type!=='finish';
 $('vaultHero').hidden=type!=='vault';
 $('crashHero').hidden=type!=='crash';
 victoryStage=type;
}
function hideOverlay(){
 $('overlay').classList.add('hidden');
 $('overlay').classList.remove('is-celebrating');
 $('overlay').setAttribute('aria-hidden','true');
 victoryStage='hidden';
}
function makeConfetti(){
 if(reduced){$('celebrateParticles').innerHTML='';return}
 const colors=['#8effe9','#ffe99e','#c8a5ff','#ffffff','#77bcff','#ff9bcf'];
 const list=[];
 for(let i=0;i<56;i++){
  const x=(i*79.7+Math.random()*11)%100;
  const delay=(i%12)*.085;
  const dur=2.1+(i%7)*.21;
  const w=4+i%5,h=8+i%8;
  const angle=30+i*13%180,dx=(i%2?-1:1)*(24+i%9*9);
  list.push('<span class="confetti" style="--x:'+x+'%;--delay:'+delay+'s;--duration:'+dur+'s;--w:'+w+'px;--h:'+h+'px;--col:'+colors[i%colors.length]+';--rot:'+angle+'deg;--dx:'+dx+'px"></span>');
 }
 for(let i=0;i<20;i++){
  const x=6+(i*31.9)%88,y=11+(i*28.7)%76;
  list.push('<span class="spark" style="--x:'+x+'%;--y:'+y+'%;--size:'+(3+i%5)+'px;--duration:'+(1.2+(i%6)*.29)+'s;--delay:'+(i%7)*.22+'s"></span>');
 }
 for(let i=0;i<4;i++){
  const x=22+i*19,y=20+(i%2)*50;
  list.push('<span class="flare" style="--x:'+x+'%;--y:'+y+'%;--delay:'+(i*.45)+'s"></span>');
 }
 $('celebrateParticles').innerHTML=list.join('');
}
function speedForStep(){return step===7?FINAL_SPEED:SPEED}
function jumpReferenceSpeed(){return step===7?ORIGINAL_FINAL_SPEED:ORIGINAL_SPEED}
function obstacleKind(i){return HAZARD_TYPES[(i-1+obstacleOffset)%HAZARD_TYPES.length]}
function distanceToObstacle(){return ORIGIN+NODE*(step+1)-playerX}
function hazardScale(){return clamp(canvasH/310,.42,1)}
function effectiveSpeed(){
 if(wrongLocked)return Math.max(speedForStep()*1.65,distanceToObstacle()/1.12);
 return solved&&turboActive?TURBO_SPEED:speedForStep();
}
function updateRushHUD(){
 const secs=Math.max(0,distanceToObstacle()/effectiveSpeed());
 $('rushClock').textContent=status==='running' ? `${secs.toFixed(1)} s` : status==='crashing'||status==='crashed'?'0.0 s':'—';
 $('rushFill').style.width= `${clamp(distanceToObstacle()/NODE,0,1)*100}%`;
 $('rushHud').classList.toggle('danger',secs<2&&!solved&&status==='running');
 $('rushHud').classList.toggle('safe',solved&&status==='running');
 $('rushLabel').textContent=wrongLocked?'VALE VASTUS':solved?(turboActive?'TURBO · HÜPE VALMIS':'HÜPE VALMIS'):status==='crashing'||status==='crashed'?'KOKKUPÕRGE!':'TAKISTUSENI';
}
function setSound(){soundOn=!soundOn;$('sound').classList.toggle('enabled',soundOn);$('sound').setAttribute('aria-label',soundOn?'Lülita heli välja':'Lülita heli sisse');if(soundOn)tone(510,.07,'triangle',.035)}
function tone(frequency,duration,type='sine',volume=.045,delay=0){
 if(!soundOn)return;
 try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();
 const t=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(frequency*.83,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.012);}catch(e){}
}
function winSound(){
 // Short original synthesized award fanfare; only plays when the user enabled audio.
 tone(392,.18,'triangle',.045);
 tone(523,.18,'triangle',.047,.11);
 tone(659,.22,'triangle',.043,.23);
 tone(784,.27,'triangle',.042,.38);
 tone(1046,.41,'sine',.037,.56);
 tone(1318,.46,'sine',.022,.67);
}
function startGame(retry=false){
 ceremonyToken++; // cancel delayed celebration steps if the player restarts
 tasks=createTasks();validateTasks(tasks);obstacleOffset=random(HAZARD_TYPES.length);
 attempts++;step=0;typed='';solved=false;playerX=ORIGIN;camera=playerX-canvasW*.30;
 jumping=false;jumpAge=0;jumpHeight=0;jumpStarted=false;wrongLocked=false;turboActive=false;jumpScale=1;jumpCount=0;
 particleTrail=[];status='running';crashElapsed=0;playElapsed=0;rewardUnlocked=false;fxGlow=0;fxBurst=0;shake=0;
 hideOverlay();showTask();updateRushHUD();
 // Earned crystal is permanent: replay must never remove the collection record.
}
function showLearningFeedback(reason){
 const task=tasks[step];
 if(!task)return;
 const digit=task.unit===10?task.v%10:Math.floor(task.v/10)%10;
 const place=task.unit===10?'üheliste':'kümneliste';
 const action=digit>=5?'üles':'alla';
 const decision=digit>=5?'5 või suurem':'väiksem kui 5';
 $('learningPrompt').textContent='ÜMARDA '+names[task.unit];
 $('learningNumber').textContent=format(task.v);
 const actual=typed?format(typed):'—';
 $('learningYourAnswer').textContent=reason==='wrong'?'SINU VASTUS: '+actual
  :typed?'POOLELI JÄI: '+actual:'SINU VASTUS: EI VASTANUD';
 $('learningCorrect').textContent=format(task.answer);
 $('learningRule').textContent='Vaata '+place+' numbrit: '+digit+'. See on '+decision
  +', seega ümardame '+action+'. '+format(task.v)+' → '+format(task.answer)+'.';
}
function lose(reason){
 if(status!=='running')return;
 status='crashing';crashReason=reason;crashElapsed=0;fxGlow=.4;shake=18;
 $('answerBox').classList.remove('success');$('answerBox').classList.add('wrong');
 note(reason==='wrong'?'VALE VASTUS! KOKKUPÕRGE!':'AEG SAI OTSA! KOKKUPÕRGE!','bad');
 $('sceneCaption').textContent='KOKKUPÕRGE!';
 tone(160,.35,'sawtooth',.065);
 $('crashCount').textContent=`${step} / ${TOTAL}`;
 $('crashDetail').textContent=reason==='wrong'?'Vastus oli vale. Vaata, kuidas õigesti ümardada!':'Aeg sai otsa. Vaata õiget vastust enne uut katset!';
 showLearningFeedback(reason);
 updateRushHUD();
}
function onKey(key){
 if(status!=='running'||solved||wrongLocked)return;
 if(key==='back'){typed=typed.slice(0,-1);updateAnswer();return}
 if(!/^\d$/.test(key)||typed.length>=8)return;
 if(!typed&&key==='0')return;
 typed+=key;updateAnswer();
 const answer=String(tasks[step].answer);
 if(typed===answer)check();
 else if(typed.length>=answer.length)check();
}
function check(){
 if(status!=='running'||solved||wrongLocked||!typed)return;
 if(Number(typed)===tasks[step].answer){
  solved=true;turboActive=distanceToObstacle()>180; // late correct answers keep the original safe jump speed
  $('answerBox').classList.add('success');note(turboActive?'ÕIGE! TURBO!':'ÕIGE! HÜPE VALMIS','ok');
  fxGlow=.6;tone(600,.14,'sine',.04);tone(810,.12,'triangle',.022,.08);
  $('sceneCaption').textContent=turboActive?'TURBO · KRISTALL KIHUTAB EDASI':'HÜPE VALMIS · HÜPPA ÜLE TAKISTUSE';updateRushHUD();return;
 }
 if(typed.length<String(tasks[step].answer).length)return;
 wrongLocked=true; // The obstacle remains lethal; the crystal physically runs into it.
 $('answerBox').classList.add('wrong');note('VALE VASTUS! TAKISTUS LÄHENEB!','bad');
 $('sceneCaption').textContent='VALE VASTUS · KOKKUPÕRGE LÄHENEB';
 shake=5;tone(230,.15,'sawtooth',.04);updateRushHUD();
}
function finish(){
 status='finished';step=TOTAL;solved=false;rewardUnlocked=true;
 updateGems();updateRushHUD();
 $('answerBox').classList.remove('success');
 note('Kristall saadud!','ok');fxBurst=1;spawnBurst(playerX,96);winSound();
 try{localStorage.setItem('edukass-neon-world1-finished','1')}catch(e){}
 awardCrystal(1);
 const token=++ceremonyToken;
 makeConfetti();
 if(reduced){overlay('finish');return}
 // First show the in-world flash, then the victory burst, then award the crystal.
 setTimeout(()=>{if(status==='finished'&&token===ceremonyToken)overlay('victory')},180);
 setTimeout(()=>{if(status==='finished'&&token===ceremonyToken)overlay('finish')},1670);
}
function reset(){ceremonyToken++;status='intro';step=0;typed='';solved=false;playerX=ORIGIN;particleTrail=[];jumping=false;jumpAge=0;jumpHeight=0;jumpStarted=false;wrongLocked=false;turboActive=false;jumpScale=1;jumpCount=0;updateGems();updateAnswer();note('Vasta enne takistust!');updateRushHUD();overlay('intro')}
function advance(dt){
 const delta=clamp(dt,0,100);
 if(status==='running'){
  const dtSeconds=delta/1000;
  const gate=ORIGIN+NODE*(step+1);
  const approach=gate-playerX;
  // A correct answer arms one automatic jump. It starts at the same point relative
  // to the obstacle at every pace, then follows a genuine ballistic arc.
  const takeoffDistance=jumpReferenceSpeed()*JUMP_TOTAL/2*(turboActive?TURBO_ARC_STRETCH:1);
  if(solved&&!jumpStarted&&!jumping&&approach<=takeoffDistance){
   jumping=true;jumpStarted=true;jumpAge=0;jumpHeight=0;jumpCount++;
   // Longer world-space flight during turbo keeps both ends of the solid hazard
   // within a visible, physical arc instead of skipping the collision hitbox.
   jumpScale=(effectiveSpeed()/jumpReferenceSpeed())/(turboActive?TURBO_ARC_STRETCH:1);
   tone(420,.10,'triangle',.035);
  }
  if(jumping){
   jumpAge+=dtSeconds;
   jumpHeight=Math.max(0,JUMP_V*jumpScale*jumpAge-.5*JUMP_G*jumpScale*jumpScale*jumpAge*jumpAge);
   if(jumpAge>=JUMP_TOTAL/jumpScale){jumping=false;jumpAge=0;jumpHeight=0}
  }
  playerX+=effectiveSpeed()*dtSeconds;
  playElapsed+=delta;
  // No gate toggling or teleport: the hitbox must actually clear the spikes.
  const inHazard=Math.abs(gate-playerX)<=HAZARD_HALF_WIDTH*hazardScale();
  if(inHazard&&jumpHeight<CLEARANCE){
   lose(wrongLocked?'wrong':'timeout');
  }else if(playerX>=gate+HAZARD_HALF_WIDTH*hazardScale()+8){
   step++;
   if(step>=TOTAL)finish();else{showTask();winSound()}
  }
  if(status==='running')updateRushHUD();
 }
 if(status==='crashing'){
  const previousCrashElapsed=crashElapsed;
  crashElapsed+=delta;shake=Math.max(0,18*(1-crashElapsed/650));
  if(previousCrashElapsed<190&&crashElapsed>=190)spawnBurst(playerX,65);
  if(crashElapsed>=650){status='crashed';overlay('crash')}
 }
}
const skyStars=Array.from({length:125},(_,i)=>({x:Math.random(),y:Math.random()*.72,r:.45+Math.random()*1.15,a:.2+Math.random()*.7,p:Math.random()*6.28,layer:Math.random()}));
const snowStars=Array.from({length:22},()=>({x:Math.random(),y:Math.random(),size:.4+Math.random()*1.6,offset:Math.random()*6.28}));
function resize(){
 const r=canvas.getBoundingClientRect();if(r.width<10||r.height<10)return;
 dpr=Math.min(window.devicePixelRatio||1,2);canvasW=r.width;canvasH=r.height;
 const width=Math.round(canvasW*dpr),height=Math.round(canvasH*dpr);
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
 ctx.setTransform(dpr,0,0,dpr,0,0);
}
function line(points,stroke,width=1,alpha=1){
 ctx.globalAlpha=alpha;ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.globalAlpha=1;
}
function polygon(points,fill,stroke='',lw=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke()}}
function circle(x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function glowCircle(x,y,r,color1,color2='transparent'){
 if(r<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color1);g.addColorStop(1,color2);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
}
function paintBackground(t){
 const w=canvasW,h=canvasH;
 const base=ctx.createLinearGradient(0,0,w*.6,h);base.addColorStop(0,'#0a1039');base.addColorStop(.5,'#172558');base.addColorStop(1,'#0a1639');ctx.fillStyle=base;ctx.fillRect(0,0,w,h);
 glowCircle(w*.64,h*.15,w*.68,'#5659c85a');glowCircle(w*.11,h*.46,w*.5,'#1fe2e326');glowCircle(w*.91,h*.37,w*.38,'#a660c931');
 // Angular aurora: atmospheric, not a stock illustration.
 ctx.save();ctx.globalCompositeOperation='screen';ctx.translate(w*.5,0);ctx.rotate(-.31);
 for(let i=0;i<5;i++){
  let a=(i-2)*w*.18+Math.sin(t*.00019+i)*10;
  const g=ctx.createLinearGradient(a,0,a+w*.25,0);g.addColorStop(0,'#5ddaf800');g.addColorStop(.46,i%2?'#7562ff17':'#29ebc91e');g.addColorStop(1,'#5ddaf800');ctx.fillStyle=g;ctx.fillRect(a,-h*.1,w*.25,h*.8);
 }
 ctx.restore();ctx.globalCompositeOperation='source-over';
 skyStars.forEach((s,i)=>{const x=((s.x*w-camera*.013*(.2+s.layer))%w+w)%w;const y=s.y*h;const a=s.a*(.75+.25*Math.sin(t*.0018+s.p));ctx.globalAlpha=a;circle(x,y,s.r,i%8===0?'#a2fff1':'#d5e3ff',s.r);});ctx.globalAlpha=1;
 // Crescent and concentric luminous atmospheric rings.
 const moonX=w*.78-camera*.009,moonY=h*.21;
 glowCircle(moonX,moonY,42,'#a6a9fa38');
 ctx.lineWidth=1.4;ctx.strokeStyle='#a1b8ff53';ctx.beginPath();ctx.arc(moonX,moonY,23,0,Math.PI*2);ctx.stroke();
 ctx.lineWidth=2;ctx.strokeStyle='#e2d3ff8a';ctx.beginPath();ctx.arc(moonX,moonY,15,0,Math.PI*2);ctx.stroke();
 // Mountain parallax: hand-built vector silhouettes, layered depth.
 for(let layer=0;layer<3;layer++){
  const y=h*(.53+layer*.07);const scale=.45+layer*.25;const off=camera*(.014+layer*.047);
  const col=['#253766','#192e60','#142a58'][layer];ctx.beginPath();ctx.moveTo(-10,h);
  for(let x=-100;x<w+160;x+=9){const xx=x+off,shape=Math.sin(xx*.014*scale+layer*.8)*13+Math.sin(xx*.036*scale-layer)*16+Math.sin(xx*.067*scale+layer*.27)*6;ctx.lineTo(x,y+shape)}ctx.lineTo(w+10,h);ctx.closePath();ctx.fillStyle=col;ctx.fill();
  ctx.strokeStyle=['#5989cb28','#588fc04b','#5f91bb30'][layer];ctx.lineWidth=1;ctx.stroke();
 }
 // Woven horizontal horizon light, intentionally limited to background.
 ctx.fillStyle='#0cf3d008';ctx.fillRect(0,h*.68,w,h*.04);
}
function drawTrack(t){
 const w=canvasW,h=canvasH,y=h*.76;
 const grad=ctx.createLinearGradient(0,y-4,0,h);grad.addColorStop(0,'#193c6a');grad.addColorStop(.35,'#152c53');grad.addColorStop(1,'#081428');
 ctx.fillStyle=grad;ctx.fillRect(0,y,w,h-y);
 glowCircle(w*.5,y,w*.9,'#2ffff01a');
 ctx.fillStyle='#092645';ctx.fillRect(0,y+6,w,6);
 ctx.fillStyle='#76ffe2';ctx.fillRect(0,y,w,3);
 ctx.fillStyle='#37bce885';ctx.fillRect(0,y+17,w,1);
 // Track tiles and light patterns move continuously: always a runner, never a static station.
 const pitch=94,start=Math.floor(camera/pitch)-1,end=Math.ceil((camera+w)/pitch)+1;
 for(let n=start;n<=end;n++){
  let x=n*pitch-camera;
  polygon([[x+7,y+15],[x+75,y+15],[x+65,y+25],[x-3,y+25]],n%2?'#22446c':'#1a3864','#8afae33d',.8);
  line([[x+14,y+37],[x+47,y+37]],'#4e92c8',2,.35);
  polygon([[x+20,y+3],[x+27,y+3],[x+34,y+11],[x+27,y+11]],'#68e4dd69');
 }
 // Camera streaks add arcade speed without shortening mathematical thinking time.
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(let i=0;i<11;i++){
  let x=(i*79-camera*(.85+i%3*.2))%(w+100);if(x<0)x+=w+100;
  const yy=y*.63+i*9%Math.max(30,y*.29);const alpha=.08+Math.sin(t*.003+i)*.025;
  line([[x-62,yy],[x,yy]],i%3?'#5deff2':'#bd9eff',i%4?1:2,alpha);
 }
 ctx.restore();
}
function drawGate(worldX,i,t){
 const x=worldX-camera,ground=canvasH*.76;
 if(x<-130||x>canvasW+130)return;
 const past=i<=step,danger=i===step+1&&!solved&&status==='running',type=obstacleKind(i);
 ctx.save();ctx.translate(x,ground);
 ctx.scale((1+Math.sin(t*.008+i)*.012)*hazardScale(),(1+Math.sin(t*.008+i)*.012)*hazardScale());
 ctx.globalAlpha=past?.57:1;
 glowCircle(0,-36,77,past?'#35fbe121':'#ff5aaf35');
 const col=past?'#225b70':'#963d9d',rim=past?'#93ffe8':'#ff9cdb';
 if(type==='fangs'){
  polygon([[-43,0],[-36,-41],[-20,-79],[-3,-40],[-9,0]],col,rim,2);
  polygon([[9,0],[3,-40],[20,-79],[36,-41],[43,0]],col,rim,2);
  polygon([[-26,-71],[-20,-86],[-13,-66],[-20,-71]],past?'#adf3e4':'#ffd1ee');
  polygon([[13,-66],[20,-86],[26,-71],[20,-71]],past?'#adf3e4':'#ffd1ee');
  polygon([[-10,-36],[0,-60],[10,-36],[0,-13]],past?'#64c5bd':'#ff6aab',rim,1.4);
 }else if(type==='rotor'){
  // Rotating crystalline saw mounted on a low pivot.
  ctx.save();ctx.translate(0,-38);ctx.rotate(t*.0012+(i*.7));
  const teeth=[];
  for(let n=0;n<24;n++){const a=n*Math.PI/12-Math.PI/2,rad=n%2===0?39:29;teeth.push([Math.cos(a)*rad,Math.sin(a)*rad]);}
  polygon(teeth,col,rim,2);
  circle(0,0,19,past?'#7fdccf':'#ffb1da');
  polygon([[0,-15],[14,0],[0,15],[-14,0]],past?'#245977':'#473974','#ecfffa',1.5);
  circle(0,0,5,'#ebfff9');ctx.restore();
  line([[-6,0],[-6,-5]],rim,2);
 }else if(type==='tri-spikes'){
  // Three separate jagged spears, staggered in height.
  polygon([[-49,0],[-35,-63],[-16,0]],col,rim,2);
  polygon([[-25,0],[0,-77],[25,0]],past?'#376b79':'#a64bba',rim,2);
  polygon([[16,0],[35,-63],[49,0]],col,rim,2);
  polygon([[-35,-63],[-31,-50],[-40,-41]],past?'#bdf9e6':'#ffd1e9');
  polygon([[0,-77],[7,-53],[-7,-53]],past?'#c3f5e6':'#ffeff9');
  polygon([[35,-63],[40,-41],[30,-50]],past?'#bdf9e6':'#ffd1e9');
 }else if(type==='lightning'){
  // Electric pylons with a zig-zag voltage beam between them.
  polygon([[-46,0],[-42,-70],[-22,-70],[-18,0]],col,rim,2);
  polygon([[18,0],[22,-70],[42,-70],[46,0]],col,rim,2);
  polygon([[-45,-71],[-32,-83],[-19,-71]],past?'#94e4d1':'#ffcfdf',rim,1.1);
  polygon([[19,-71],[32,-83],[45,-71]],past?'#94e4d1':'#ffcfdf',rim,1.1);
  line([[-28,-49],[-5,-32],[-11,-48],[14,-34],[29,-50]],past?'#8fe8ce':'#ffe1a6',past?2:4);
  glowCircle(0,-43,24,past?'#56ffe322':'#ffd7683e');
 }else if(type==='prism'){
  // Thick angular prism wall and its internal glowing facet.
  polygon([[-42,0],[-40,-47],[-22,-76],[20,-76],[41,-48],[43,0]],col,rim,2);
  polygon([[-22,-76],[0,-62],[20,-76],[7,-43],[-7,-43]],past?'#58989d':'#e78aca',rim,1);
  polygon([[-31,-21],[0,-45],[31,-21],[0,-9]],past?'#2a6577':'#59377e',rim,1);
  line([[0,-62],[0,-44]],past?'#b2f9e8':'#fff3dc',2);
  circle(0,-28,7,past?'#b3fff0':'#ffd6f4');
 }
 ctx.restore();
 if(danger&&x<canvasW*.62){glowCircle(x,ground-52,92,'#ff577e15')}
}
function drawSpire(x,y,scale,t,final=false){
 if(x< -140||x>canvasW+140)return;
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 glowCircle(0,0,95,final?'#ffd97634':'#7fa2ff29');
 polygon([[-70,60],[-48,-5],[-21,-9],[-12,-74],[0,-100],[12,-74],[21,-9],[48,-5],[70,60]],'#23386a','#84c9ec6a',1.2);
 polygon([[-12,-74],[0,-100],[12,-74],[21,-9],[0,16],[-21,-9]],'#526bb3','#92acff76',1);
 polygon([[-6,-78],[0,-92],[6,-78],[0,-62]],final?'#f9d184':'#7ffff1','#d9ffee',1);
 line([[0,-70],[0,30]],final?'#ffe7a2':'#92e7fa',1.5,.7);
 ctx.restore();
}
function drawPlayer(t){
 let x=playerX-camera;
 const scale=hazardScale();
 const hover=jumping?0:1.3*Math.sin(t*.010);
 // Position and rotation are driven by physical jump state, not proximity animation.
 const spin=jumping?Math.PI*2*jumpAge*jumpScale/JUMP_TOTAL:0;
 const y=canvasH*.76-43*scale-jumpHeight*scale+hover;
 if(status==='crashing'&&crashElapsed>190)return;
 // Soft particle trail follows movement.
 if(status==='running'&&Math.random()<.94){particleTrail.push({x,y:y+random(17)-8,birth:t,size:1.2+Math.random()*3});}
 particleTrail=particleTrail.filter(s=>t-s.birth<900).slice(-70);
 ctx.save();particleTrail.forEach(s=>{const age=(t-s.birth)/900,dx=(t-s.birth)*.085;circle(s.x-dx,s.y,s.size*(1-age),'rgba(88,255,226,'+(.56*(1-age))+')')});ctx.restore();
 glowCircle(x,y,59*scale,'#54ffe43c');glowCircle(x,y,27*scale,'#cfffee72');
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.rotate(spin+Math.sin(t*.011)*.025);
 ctx.shadowColor='#70ffe7';ctx.shadowBlur=19;
 // Original asymmetric prism avatar: no cube, car, vehicle, or iconography from reference games.
 polygon([[0,-26],[19,-7],[13,16],[0,28],[-18,11],[-15,-9]],'#79e9ed','#ddfff1',2);
 ctx.shadowBlur=0;
 polygon([[0,-26],[19,-7],[0,1],[-15,-9]],'#e9fff0');
 polygon([[-15,-9],[0,1],[0,28],[-18,11]],'#69c3f9');
 polygon([[0,1],[19,-7],[13,16],[0,28]],'#3189df');
 line([[0,-23],[0,24]],'#ffffff9c',1.2,.67);
 // Geometric bright fins, like a comet but not a vehicle.
 polygon([[-16,1],[-32,9],[-24,16],[-14,13]],'#c48dff','#f0d5ff70',.8);
 polygon([[16,1],[31,9],[23,15],[14,12]],'#7adcf6','#d9ffff80',.8);
 ctx.restore();
 for(let i=0;i<3;i++){
  const a=t*.001+i*Math.PI*2/3;circle(x+Math.cos(a)*35*scale,y+Math.sin(a)*18*scale,(1.5+i%2)*scale,'#dcffed');
 }
}
function spawnBurst(worldX,count){
 const x=worldX-camera,y=canvasH*.52;
 for(let i=0;i<count;i++){
  const a=Math.PI*2*i/count+Math.random()*.3;
  specks.push({x,y,dx:Math.cos(a)*(1.4+Math.random()*2.8),dy:Math.sin(a)*(1.2+Math.random()*3),s:2+Math.random()*3,c:i%5===0?'#ffdd96':i%3===0?'#b18aff':'#91ffdd',life:1});
 }
}
function drawFX(dt){
 specks=specks.filter(p=>p.life>0);ctx.globalCompositeOperation='lighter';
 specks.forEach(p=>{p.x+=p.dx*dt*.07;p.y+=p.dy*dt*.07;p.dy+=.017*dt*.05;p.life-=dt*.0013;ctx.globalAlpha=clamp(p.life,0,1);if(p.life>0)circle(p.x,p.y,p.s*p.life,p.c)});
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 if(fxGlow>0){glowCircle(canvasW*.50,canvasH*.46,canvasW*.65,`rgba(97,255,226,${fxGlow*.20})`);fxGlow=Math.max(0,fxGlow-dt*.0017)}
}
function frame(t){
 if(!canvasW||!canvasH)resize();const dt=lastFrame?clamp(t-lastFrame,0,45):16;lastFrame=t;clock=t;
 advance(dt);
 const wanted=playerX-canvasW*.30;camera=lerp(camera,wanted,reduced?1:clamp(dt*.032,0,1));
 ctx.save();if(status==='crashing'&&shake>0)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake*.45);
 ctx.clearRect(-25,-25,canvasW+50,canvasH+50);
 paintBackground(t);
 const finalX=ORIGIN+NODE*8-camera;
 drawSpire(finalX,canvasH*.49,.8+step*.03,t,true);
 drawTrack(t);
 for(let i=1;i<=TOTAL;i++){
  const wx=ORIGIN+NODE*i;
  drawGate(wx,i,t);
 }
 if(status!=='crashed')drawPlayer(t);
 drawFX(dt);
 if(status==='crashing')glowCircle(playerX-camera,canvasH*.72,95,'#ff4da981');
 ctx.restore();
 requestAnimationFrame(frame);
}
function bind(){
 $('keypad').addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(!b)return;onKey(b.dataset.key)});
 document.addEventListener('keydown',e=>{
  const key=e.key;if(key==='Backspace'){e.preventDefault();onKey('back')}else if(key==='Enter'){e.preventDefault();if(victoryStage==='vault')closeCrystalVault();else if(status==='intro')startGame();else if(status==='finished'&&victoryStage==='finish')startGame();else if(status==='crashed')startGame(true)}else if(/^\d$/.test(key))onKey(key);
 });
 $('begin').addEventListener('click',()=>startGame());$('again').addEventListener('click',()=>startGame());$('retry').addEventListener('click',()=>startGame(true));$('restart').addEventListener('click',reset);$('sound').addEventListener('click',setSound);
 $('openVaultIntro').addEventListener('click',()=>openCrystalVault('intro'));
 $('openVaultReward').addEventListener('click',()=>openCrystalVault('finish'));
 $('closeVault').addEventListener('click',closeCrystalVault);
 $('nextWorld').addEventListener('click',()=>{window.location.href='../paikesekuru-prototype/EDUKASS_Paikesekuru_World2_Play.html'});
 window.addEventListener('resize',resize);
 document.addEventListener('visibilitychange',()=>{lastFrame=0});
}
function init(){
 stars=[];updateGems();resize();bind();updateCrystalVault();updateAwardArt();updateRushHUD();overlay('intro');requestAnimationFrame(frame);
}
// Test interface is read-only except for simulated key input; it is not displayed to players.
window.__EDUKASS_TEST__={get:()=>({status,step,typed,tasks:tasks.map(t=>({...t})),playerX,solved,crashReason,attempts,world:'valgussaar',rewardUnlocked:rewardUnlocked||status==='finished',victoryStage,crystalCollected:collectedCrystals().includes(1),vaultCount:collectedCrystals().length,jumping,jumpHeight,jumpCount,wrongLocked,turboActive,runningSpeed:effectiveSpeed(),distance:distanceToObstacle(),obstacles:Array.from({length:TOTAL},(_,j)=>obstacleKind(j+1))}),press:onKey,start:()=>startGame(),retry:()=>startGame(true),tick:(ms)=>{for(let r=0;r<ms;r+=35)advance(Math.min(35,ms-r))},reset,validateTasks,generate:createTasks};
init();
})();
