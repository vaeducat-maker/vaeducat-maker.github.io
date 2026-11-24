(()=>{
'use strict';
const $=id=>document.getElementById(id);
const canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NODE=580, ORIGIN=108;let TOTAL=8;
const SPEED=47, FINAL_SPEED=43, TURBO_SPEED=850, TURBO_ARC_STRETCH=1.4; // 25% slower
const ORIGINAL_SPEED=86, ORIGINAL_FINAL_SPEED=75; // maintain original physical jump curves
const JUMP_V=240, JUMP_G=200, JUMP_TOTAL=2*JUMP_V/JUMP_G;
const HAZARD_HALF_WIDTH=58, CLEARANCE=76; // consistent with the rendered spike and crystal hitboxes
const COLORS={cyan:'#ffc26e',cyanB:'#ffa34b',violet:'#ff6879',pink:'#ff8a55',gold:'#ffe29b',white:'#f1fff9'};
const names={10:'KÜMNELISTENI',100:'SAJALISTENI',1000:'TUHANDELISTENI',10000:'KÜMNETUHANDELISTENI',100000:'SAJATUHANDELISTENI',1000000:'MILJONILISTENI',10000000:'KÜMNETE MILJONITENI',100000000:'SAJA MILJONITENI'};
const HAZARD_TYPES=['fire-steps','sun-wheel','ember-wall','flame-fangs','solar-ramp','fire-steps','sun-wheel','ember-wall','flame-fangs','rotor','solar-ramp','fire-steps'];
const templates=[
 {unit:10,kind:'two-tens'}, {unit:10,kind:'two-tens'},
 {unit:10,kind:'two-tens'}, {unit:10,kind:'two-tens'},
 {unit:10,kind:'three-tens'}, {unit:10,kind:'three-tens'},
 {unit:10,kind:'three-tens'}, {unit:10,kind:'three-tens'},
 {unit:100,kind:'three-hundreds'}, {unit:100,kind:'three-hundreds'},
 {unit:100,kind:'three-hundreds'}, {unit:100,kind:'three-hundreds'}
];
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

const WORLDS=[{"id":1,"name":"Valgussaar","main":"#66ffe9","accent":"#367feb","dark":"#0b224b","bpm":124,"obstacles":["fangs","rotor","tri-spikes","lightning","prism"],"total":8},{"id":2,"name":"Päikesekuru","main":"#ffbe61","accent":"#f84b44","dark":"#3c1026","bpm":132,"obstacles":["fire-steps","sun-wheel","ember-wall","flame-fangs","solar-ramp"],"total":12},{"id":3,"name":"Mäevardjad","main":"#dfb3ff","accent":"#9255ee","dark":"#201045","bpm":136,"obstacles":["prism","violet-obelisk","arc-gate","rotor","violet-obelisk"],"total":12},{"id":4,"name":"Tormitasandik","main":"#80dcff","accent":"#468aff","dark":"#0c2250","bpm":140,"obstacles":["lightning","ion-block","storm-rotor","tri-spikes","ion-block"],"total":12},{"id":5,"name":"Kaksikorg","main":"#8effc0","accent":"#19bd95","dark":"#083c33","bpm":144,"obstacles":["twin-shards","jade-steps","prism","rotor","jade-steps"],"total":12},{"id":6,"name":"Keeriseorg","main":"#ff96e0","accent":"#d33cbd","dark":"#41134a","bpm":146,"obstacles":["spiral-barrier","orbit-ring","arc-gate","prism","orbit-ring"],"total":12},{"id":7,"name":"Täheväli","main":"#ffe69b","accent":"#e5ad3f","dark":"#422442","bpm":150,"obstacles":["star-burst","golden-saw","fire-steps","solar-ramp","golden-saw"],"total":12},{"id":8,"name":"Prismakants","main":"#a6bbff","accent":"#6770ff","dark":"#151947","bpm":154,"obstacles":["crystal-labyrinth","color-wall","prism","tri-spikes","color-wall"],"total":12},{"id":9,"name":"Meteoritorm","main":"#ffa38e","accent":"#fd4774","dark":"#42112c","bpm":158,"obstacles":["meteor-slab","impact-ring","star-burst","rotor","meteor-slab"],"total":12}];
let worldId=1;
function world(){return WORLDS[worldId-1]}
function updateWorldUI(){
 const w=world(),nn=String(worldId).padStart(2,'0');
 $('worldPill').innerHTML='<span class="world-dot"></span> <b>'+nn+'</b> / 09 · '+w.name.toUpperCase();
 $('sceneWorld').textContent='MAAILM '+nn;$('sceneName').textContent=w.name;
 $('introName').textContent=w.name;$('victoryWorld').textContent='MAAILM '+nn+' VÕIDETUD';
 $('victoryScore').textContent=TOTAL+' / '+TOTAL;
 $('rewardWorld').textContent='MAAILM '+nn+' · '+w.name.toUpperCase();
 $('rewardName').textContent=w.name.toUpperCase()+' KRISTALL';
 $('rewardCaption').textContent='SA SAID '+w.name.toUpperCase()+' KRISTALLI!';
 $('crashWorld').textContent='MAAILM '+nn+' · KATSE LÄBI';
 $('nextWorld').disabled=false;
 $('nextWorld').innerHTML=worldId===9?'ÜLIM KRISTALL <span>9 / 9</span>':'JÄRGMINE MAAILM <span>'+String(worldId+1).padStart(2,'0')+'</span>';
 document.documentElement.style.setProperty('--world-main',w.main);
 document.documentElement.style.setProperty('--world-accent',w.accent);
 document.documentElement.style.setProperty('--world-dark',w.dark);
 document.body.style.background='radial-gradient(ellipse at 50% 0%,'+w.accent+'77,'+w.dark+' 66%,#090719)';
 $('awardCrystalArt').innerHTML=collectibleSVG(worldId,'awardWorld'+worldId);
 $('worldMenu').innerHTML=WORLDS.map(z=>{
  const have=collectedCrystals(),owned=have.includes(z.id),allowed=z.id===1||owned||have.includes(z.id-1);
  return '<button type="button" data-world="'+z.id+'" class="world-choice'+(worldId===z.id?' active':'')+'" '+(allowed?'':'disabled')+' style="--choice-color:'+z.main+'">'
   +String(z.id).padStart(2,'0')+' · '+z.name+(owned?' ◆':'')+'</button>';
 }).join('');
 updateCrystalVault();updateGems();
}
function switchWorld(id){
 const have=collectedCrystals();
 if(!Number.isInteger(id)||id<1||id>9||(id>1&&!have.includes(id)&&!have.includes(id-1)))return false;
 worldId=id;TOTAL=world().total;reset();updateWorldUI();return true;
}

const VAULT_STORAGE='edukass-neon-crystal-vault-v1';
function collectedCrystals(){
 let ids=[];try{
  const parsed=JSON.parse(localStorage.getItem(VAULT_STORAGE)||'[]');
  if(Array.isArray(parsed))ids=parsed.filter(n=>Number.isInteger(n)&&n>=1&&n<=9);
  if(localStorage.getItem('edukass-neon-world1-crystal-unlocked')==='1'||localStorage.getItem('edukass-neon-world1-finished')==='1')ids.push(1);
  if(localStorage.getItem('edukass-neon-world2-crystal-unlocked')==='1'||localStorage.getItem('edukass-neon-world2-finished')==='1')ids.push(2);
  for(let n=3;n<=9;n++)if(localStorage.getItem('edukass-neon-world'+n+'-crystal-unlocked')==='1')ids.push(n);
 }catch(e){}
 return [...new Set(ids)].sort((a,b)=>a-b);
}
function awardCrystal(number){
 const ids=collectedCrystals();
 if(!ids.includes(number))ids.push(number);
 try{
  localStorage.setItem(VAULT_STORAGE,JSON.stringify(ids.sort((a,b)=>a-b)));
  localStorage.setItem('edukass-neon-world'+number+'-crystal-unlocked','1');
 }catch(e){}
 updateCrystalVault();
}
function collectibleSVG(id,identifier){
 // Every world has its own collectible silhouette, not merely a recolor.
 if(id===2)return "<svg viewBox=\"0 0 82 104\" aria-hidden=\"true\"><defs><linearGradient id=\"___GRAD___\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#fff6b0\"/><stop offset=\".35\" stop-color=\"#ffb642\"/><stop offset=\".73\" stop-color=\"#ff563b\"/><stop offset=\"1\" stop-color=\"#b5124b\"/></linearGradient></defs><path d=\"M41 95C17 84 11 66 18 44c7 11 12 17 20 19C22 46 26 23 42 6c14 18 20 38 6 57 11-4 15-12 20-21 9 22-1 41-27 53Z\" fill=\"url(#___GRAD___)\" stroke=\"#ffe5a2\" stroke-width=\"2.2\"/><path d=\"M41 97C29 87 22 72 29 51c4 8 9 14 12 16 9-12 14-20 12-30 10 22 1 45-12 60Z\" fill=\"#ffcc5a\" opacity=\".8\"/><path d=\"M41 22 50 48 42 76 33 48Z\" fill=\"#fff4af\" opacity=\".82\"/><path d=\"M18 60 35 74 41 95 46 74 66 60\" fill=\"none\" stroke=\"#fff2ab\" stroke-width=\"1.7\"/><path d=\"M41 12v77M30 52l11 14 11-14\" fill=\"none\" stroke=\"#fff3b8\" stroke-opacity=\".72\" stroke-width=\"1.2\"/></svg>".replaceAll('___GRAD___',identifier);
 if(id>=3){
  // Distinct silhouettes reserved for the seven still-locked future worlds:
  // spire, orbit, twin shards, spiral, star, crown cluster, meteor.
  const shapes={
   3:'M41 2 56 28 50 90 41 103 31 90 26 28Z',
   4:'M41 6A35 35 0 1 1 40.9 6Z M41 17A24 24 0 1 0 41 65A24 24 0 1 0 41 17Z',
   5:'M24 5 40 35 30 86 15 102 5 65Z M58 5 76 65 66 102 51 86 42 35Z',
   6:'M41 6C72 6 78 26 64 40C45 58 29 34 38 29C52 22 62 45 48 61C31 84 12 70 14 51C15 77 34 103 41 103C58 97 72 75 72 55C72 39 57 22 41 6Z',
   7:'M41 1 52 35 79 28 61 52 79 79 50 72 41 103 30 72 3 79 21 52 3 28 30 35Z',
   8:'M8 37 20 61 21 8 41 44 61 8 62 61 74 37 70 92 41 103 12 92Z',
   9:'M59 4 71 17 64 34 79 60 51 99 23 103 12 74 24 43 14 30 38 34Z'
  };
  const gradient='<defs><linearGradient id="'+identifier+'" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#d3d3ff"/><stop offset=".55" stop-color="#9bbcef"/><stop offset="1" stop-color="#6d569c"/></linearGradient></defs>';
  return '<svg viewBox="0 0 82 104" aria-hidden="true">'+gradient+
   '<path d="'+shapes[id]+'" fill="url(#'+identifier+')" stroke="#ecf2ff" stroke-width="2" fill-rule="evenodd"/>'
   +'<path d="M41 12 41 87" stroke="#ffffff" opacity=".43" stroke-width="1.5"/></svg>';
 }
 return "<svg viewBox=\"0 0 82 104\" aria-hidden=\"true\"><defs><linearGradient id=\"___GRAD___\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#fffde3\"/><stop offset=\".25\" stop-color=\"#9effff\"/><stop offset=\".65\" stop-color=\"#4ac7f8\"/><stop offset=\"1\" stop-color=\"#4354e8\"/></linearGradient></defs><path d=\"M41 2 64 25 75 49 56 81 41 102 20 81 7 49 17 24Z\" fill=\"url(#___GRAD___)\" stroke=\"#f8ffff\" stroke-width=\"2\"/><path d=\"M41 2 17 24 7 49 41 45Z\" fill=\"#d9ffff\" opacity=\".74\"/><path d=\"M41 45 75 49 56 81 41 102Z\" fill=\"#377fc4\" opacity=\".60\"/><path d=\"M17 24 41 45 64 25M7 49l34-4 34 4M20 81l21-36 15 36M41 2v100\" stroke=\"#fff\" stroke-opacity=\".62\" fill=\"none\" stroke-width=\"1.3\"/></svg>".replaceAll('___GRAD___',identifier);
}
function updateAwardArt(){
 const id=2;
 $('awardCrystalArt').innerHTML=collectibleSVG(id,'awardWorld'+id);
}

function updateCrystalVault(){
 const ids=collectedCrystals(),count=ids.length;
 $('introCollectionCount').textContent=count+' / 9';
 if(count===9){try{localStorage.setItem('edukass-ultimate-crystal','1')}catch(e){}}
 $('rewardCollectionCount').textContent=count+' / 9';
 $('vaultProgress').textContent='KOGUTUD '+count+' / 9';
 const views=Array.from({length:9},(_,k)=>{
  const id=k+1,got=ids.includes(id),name=WORLDS[id-1].name.toUpperCase();
  const title=got?(WORLDS[id-1].name.toUpperCase()+' KRISTALL'):'LUKUS';
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

function taskSpec(w,i){
 if(w===1)return i===7?[100,101,999]:i===5?[10,101,999]:[10,11,99];
 if(w===2)return i<4?[10,11,99]:i<8?[10,101,999]:[100,101,999];
 const specs={
 3:[[100,101,999],[1000,1001,9999]],
 4:[[100,1001,9999],[1000,1001,99999],[10000,10001,99999]],
 5:[[1000,1001,99999],[10000,10001,999999],[100000,100001,999999]],
 6:[[1000,10001,999999],[10000,10001,999999],[100000,100001,9999999],[1000000,1000001,9999999]],
 7:[[10000,100001,9999999],[100000,100001,9999999],[1000000,1000001,99999999],[10000000,10000001,99999999]],
 8:[[100000,1000001,99999999],[1000000,1000001,99999999],[10000000,10000001,999999999],[100000000,100000001,999999999]],
 9:[[1000000,10000001,999999999],[10000000,10000001,999999999],[100000000,100000001,999999999]]
 }[w];return specs[Math.min(specs.length-1,Math.floor(i*specs.length/TOTAL))];
}
function createTasks(){
 const key='edukass-nine-world-math-v1-'+worldId;let history=[];
 try{const h=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(h))history=h.slice(-4)}catch(e){}
 const recent=new Set(history.flat()),used=new Set(),out=[];
 for(let i=0;i<TOTAL;i++){
  const [unit,min,max]=taskSpec(worldId,i);let n=0;
  for(let j=0;j<200;j++){const v=min+random(max-min+1);if(v%unit!==0&&!used.has(v)&&!recent.has(v)){n=v;break}}
  if(!n)for(let v=min;v<=Math.min(max,min+5000);v++)if(v%unit!==0&&!used.has(v)){n=v;break}
  if(!n)throw Error('Task pool exhausted');
  const answer=Math.floor((n+unit/2)/unit)*unit;
  if(!Number.isSafeInteger(answer))throw Error('Unsafe answer');
  used.add(n);out.push({v:n,unit,answer});
 }
 try{history.push(out.map(x=>x.v));localStorage.setItem(key,JSON.stringify(history.slice(-4)))}catch(e){}
 return out;
}
function validateTasks(ts){
 if(ts.length!==TOTAL)throw Error('Incorrect task count');
 const seen=new Set();
 ts.forEach((t,i)=>{
  const [unit,min,max]=taskSpec(worldId,i);
  if(t.unit!==unit||t.v<min||t.v>max||seen.has(t.v)||t.answer!==Math.floor((t.v+t.unit/2)/t.unit)*t.unit)throw Error('Bad task '+i);
  seen.add(t.v);
 });return true;
}
function updateGems(){
 $('gems').innerHTML=Array.from({length:TOTAL},(_,i)=>`<span class="gem ${i<step?'done':i===step&&status!=='finished'?'now':''}" aria-hidden="true"></span>`).join('');
 $('step').textContent=`${step}/${TOTAL}`;
 $('answerStep').textContent=step<TOTAL?`${String(step+1).padStart(2,'0')} / ${TOTAL}`:`${TOTAL} / ${TOTAL}`;
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
function showFusion(){
 if(collectedCrystals().length!==9)return;
 $('fusionPieces').innerHTML=WORLDS.map((w,i)=>'<div class="fusion-piece" style="--a:'+(i*40)+'deg;--c:'+w.main+'">'+collectibleSVG(w.id,'fusionPiece'+w.id)+'</div>').join('');
 $('ultimateGem').innerHTML='<svg viewBox="0 0 220 270" role="img" aria-label="Ülim Kristall"><defs><linearGradient id="ultimateRay" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffacc"/><stop offset=".24" stop-color="#88ffff"/><stop offset=".48" stop-color="#b88fff"/><stop offset=".72" stop-color="#ff9ac1"/><stop offset="1" stop-color="#ffcf74"/></linearGradient></defs><path d="M110 8 160 60 206 100 190 164 160 221 110 263 60 221 30 164 14 100 60 60Z" fill="url(#ultimateRay)" stroke="#ffffff" stroke-width="4"/><path d="M110 8 110 134 30 164Z" fill="#c1fff6" opacity=".60"/><path d="M110 8 110 134 190 164Z" fill="#fca7db" opacity=".59"/><path d="M110 134 60 221 110 263 160 221Z" fill="#ffe48e" opacity=".70"/><path d="M110 8V263 M14 100l96 34 96-34 M30 164l80-30 80 30" fill="none" stroke="#ffffff" stroke-width="2" opacity=".73"/></svg>';
 try{localStorage.setItem('edukass-ultimate-crystal','1')}catch(e){}
 overlay('fusion');winSound();
}
function overlay(type){
 $('overlay').classList.remove('hidden');$('overlay').setAttribute('aria-hidden','false');
 $('overlay').classList.toggle('is-celebrating',type==='victory'||type==='finish'||type==='vault'||type==='fusion');
 $('introHero').hidden=type!=='intro';
 $('victoryHero').hidden=type!=='victory';
 $('finishHero').hidden=type!=='finish';
 $('vaultHero').hidden=type!=='vault';
 $('fusionHero').hidden=type!=='fusion';
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
function speedForStep(){if(worldId===1)return step===TOTAL-1?56.25:64.5;if(worldId===2)return step===TOTAL-1?43:47;const t=tasks[step];if(!t)return 40;const digits=String(t.answer).length,unitDigits=String(t.unit).length;const seconds=11.8+1.72*Math.max(0,digits-3)+.88*Math.max(0,unitDigits-3)+.7*(t.answer>=Math.pow(10,digits-1)&&t.v<Math.pow(10,digits-1));return Math.max(19,Math.min(47,500/seconds))}
function jumpReferenceSpeed(){return step===TOTAL-1?ORIGINAL_FINAL_SPEED:ORIGINAL_SPEED}
function obstacleKind(i){const o=world().obstacles;return o[(i-1)%o.length]}
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
let musicNextTime=0,musicStep=0;
function setSound(){
 soundOn=!soundOn;$('sound').classList.toggle('enabled',soundOn);
 $('sound').setAttribute('aria-label',soundOn?'Lülita heli välja':'Lülita heli sisse');
 if(soundOn){tone(510,.07,'triangle',.035);musicNextTime=0;musicStep=0}
}
function electronicBeat(){
 if(!soundOn||status!=='running')return;
 try{
  audio=audio||new(window.AudioContext||window.webkitAudioContext)();
  if(audio.state==='suspended'){audio.resume();return}
  const beat=60/world().bpm/2;
  if(!musicNextTime||musicNextTime<audio.currentTime-.5)musicNextTime=audio.currentTime+.045;
  let count=0;
  while(musicNextTime<audio.currentTime+.14&&count++<5){
   const q=musicStep%16,now=musicNextTime,root=[110,123.47,98,130.81,116.54,103.83,146.83,130.81,110][worldId-1];
   function play(freq,length,type,amp,attack=.009){
    const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,now);
    g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(Math.max(.0002,amp),now+attack);
    g.gain.exponentialRampToValueAtTime(.0001,now+length);
    o.connect(g);g.connect(audio.destination);o.start(now);o.stop(now+length+.012);
   }
   if(q%4===0)play(70,.17,'sine',.085); // original four-on-floor kick
   if(q===4||q===12)play(195,.11,'triangle',.028);
   if(q%2===0)play(1150,.045,'square',.008);
   const degrees=[0,3,7,10,7,3,5,7,12,10,7,5,3,0,5,7];
   const semitone=degrees[q];play(root*4*Math.pow(2,semitone/12),beat*.82,'triangle',.017);
   if(q%4===0)play(root*(q<8?1:1.5),beat*3.4,'sine',.016,.035);
   musicNextTime+=beat;musicStep++;
  }
 }catch(e){}
}

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
 const digit=Math.floor(task.v/(task.unit/10))%10;
 const place={10:'üheliste',100:'kümneliste',1000:'sajaliste',10000:'tuhandeliste',100000:'kümnetuhandeliste',1000000:'sajatuhandeliste',10000000:'miljoniliste',100000000:'kümnemiljoniliste'}[task.unit];
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
 if(!/^\d$/.test(key)||typed.length>=12)return;
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
 try{localStorage.setItem('edukass-neon-world'+worldId+'-finished','1')}catch(e){}
 awardCrystal(worldId);
 const token=++ceremonyToken;
 makeConfetti();
 if(reduced){overlay('finish');return}
 // First show the in-world flash, then the victory burst, then award the crystal.
 setTimeout(()=>{if(status==='finished'&&token===ceremonyToken)overlay('victory')},180);
 setTimeout(()=>{if(status==='finished'&&token===ceremonyToken)overlay('finish')},1670);
 if(worldId===9)setTimeout(()=>{if(status==='finished'&&token===ceremonyToken)showFusion()},6200);
}
function reset(){ceremonyToken++;status='intro';step=0;typed='';solved=false;playerX=ORIGIN;particleTrail=[];jumping=false;jumpAge=0;jumpHeight=0;jumpStarted=false;wrongLocked=false;turboActive=false;jumpScale=1;jumpCount=0;updateGems();updateAnswer();note('Vasta enne takistust!');updateRushHUD();overlay('intro')}
function advance(dt){
 let remaining=clamp(dt,0,100);
 while(remaining>0){
  const d=Math.min(8,remaining);
  advanceSubstep(d);
  remaining-=d;
 }
}
function advanceSubstep(dt){
 const delta=dt;
 if(status==='running'){
  const dtSeconds=delta/1000;
  const gate=ORIGIN+NODE*(step+1);
  const approach=gate-playerX;
  // A correct answer arms one automatic jump. It starts at the same point relative
  // to the obstacle at every pace, then follows a genuine ballistic arc.
  const takeoffDistance=jumpReferenceSpeed()*JUMP_TOTAL/2*(turboActive?TURBO_ARC_STRETCH:1);
  if(solved&&!jumpStarted&&approach<=takeoffDistance){
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
 const w=canvasW,h=canvasH,g=ctx.createLinearGradient(0,0,0,h);
 g.addColorStop(0,'#2b081c');g.addColorStop(.5,'#771a35');g.addColorStop(1,'#210719');
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const x=w*.65-camera*.002,y=h*.4;
 glowCircle(x,y,w*.48,'#ff982c3f');circle(x,y,Math.min(w*.20,h*.32),'#ee6135');circle(x,y,Math.min(w*.17,h*.27),'#ffb94f');
 for(let layer=0;layer<3;layer++){
  const y0=h*(.61+layer*.08),offset=camera*(.01+layer*.045);
  ctx.beginPath();ctx.moveTo(-15,h);
  for(let n=-3;n<w/50+5;n++){const x0=n*50-offset%50;ctx.lineTo(x0,y0+(n%3)*15);ctx.lineTo(x0+24,y0-28-(n%4)*12)}
  ctx.lineTo(w+15,h);ctx.closePath();ctx.fillStyle=['#771936','#52112b','#390b23'][layer];ctx.fill();
 }
 for(let k=0;k<24;k++){let x0=((k*83-camera*.12)%(w+50)+w+50)%(w+50);circle(x0,(k*39)%Math.max(25,h*.54),k%3+1,'#ffd893')}
}
function drawTrack(t){
 const w=canvasW,h=canvasH,y=h*.76;
 const grad=ctx.createLinearGradient(0,y-4,0,h);grad.addColorStop(0,'#72213d');grad.addColorStop(.35,'#4f152e');grad.addColorStop(1,'#28091b');
 ctx.fillStyle=grad;ctx.fillRect(0,y,w,h-y);
 glowCircle(w*.5,y,w*.9,'#2ffff01a');
 ctx.fillStyle='#5c1734';ctx.fillRect(0,y+6,w,6);
 ctx.fillStyle='#ffaf4d';ctx.fillRect(0,y,w,3);
 ctx.fillStyle='#ff9a4c85';ctx.fillRect(0,y+17,w,1);
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
 const col=past?'#225b70':'#a83147',rim=past?'#93ffe8':'#ffd485';
 if(type==='fire-steps'){
  // A staggered stack of glowing hot blocks.
  polygon([[-48,0],[-48,-35],[-18,-35],[-18,-63],[10,-63],[10,-82],[45,-82],[45,0]],'#8b2335','#ffd77c',2.5);
  polygon([[-46,-34],[-18,-34],[-18,-28],[-46,-28]],'#ff9a3d');
  polygon([[-18,-62],[10,-62],[10,-56],[-18,-56]],'#ffae53');
  polygon([[10,-81],[44,-81],[44,-75],[10,-75]],'#ffe6a2');
 }else if(type==='sun-wheel'){
  ctx.save();ctx.translate(0,-40);ctx.rotate(t*.0016+i);
  const rays=[];for(let n=0;n<20;n++){const a=n*Math.PI/10,rad=n%2===0?42:30;rays.push([Math.cos(a)*rad,Math.sin(a)*rad])}
  polygon(rays,'#b42a35','#ffbc58',2);
  circle(0,0,24,'#f67a33');circle(0,0,11,'#fff2bd');circle(0,0,5,'#ad2333');
  ctx.restore();
 }else if(type==='ember-wall'){
  polygon([[-39,0],[-39,-76],[39,-76],[39,0]],'#9b283a','#ffb64d',2.5);
  for(let n=0;n<3;n++){
   polygon([[-29+n*20,-20],[-21+n*20,-62],[-10+n*20,-37],[-15+n*20,-19]],n%2?'#ffdf7d':'#ff843c','#fff0b2',.8);
  }
 }else if(type==='flame-fangs'){
  polygon([[-48,0],[-41,-46],[-25,-81],[-5,-44],[-8,0]],'#ae2d39','#ffc264',2);
  polygon([[8,0],[5,-44],[25,-81],[41,-46],[48,0]],'#ae2d39','#ffc264',2);
  polygon([[-16,-15],[0,-65],[16,-15],[0,-29]],'#ffad44','#ffe7a3',2);
 }else if(type==='solar-ramp'){
  polygon([[-49,0],[-9,-70],[19,-70],[49,0]],'#9b293b','#ffcb6e',2.3);
  line([[-29,-8],[-3,-50],[13,-50],[31,-8]],'#ffeda1',3);
  polygon([[-6,-49],[8,-49],[0,-61]],'#ffea92');
 }else if(type==='fangs'){
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
 glowCircle(x,y,59*scale,'#ffae634c');glowCircle(x,y,27*scale,'#ffda8a72');
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.rotate(spin+Math.sin(t*.011)*.025);
 ctx.shadowColor='#ffab5d';ctx.shadowBlur=19;
 // A fire-lotus crystal: five pointed facets, no blue diamond body.
 polygon([[0,-34],[14,-13],[23,-19],[23,4],[15,23],[0,34],[-15,23],[-23,4],[-23,-19],[-14,-13]],'#ff762f','#ffec9e',2);
 polygon([[0,-34],[14,-13],[0,-4],[-14,-13]],'#fff5b5','#fff8d9',1.1);
 polygon([[-23,-19],[-9,0],[-15,23],[-23,4]],'#ff4c43','#ffd175',1);
 polygon([[23,-19],[9,0],[15,23],[23,4]],'#ee3560','#ffd175',1);
 polygon([[0,-4],[15,23],[0,34],[-15,23]],'#ffba49','#fff1a5',1);
 polygon([[0,-28],[7,-9],[0,16],[-7,-9]],'#fff8c0');
 line([[0,-29],[0,29]],'#fff8cd',1.1);
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
 advance(dt);electronicBeat();
 const wanted=playerX-canvasW*.30;camera=lerp(camera,wanted,reduced?1:clamp(dt*.032,0,1));
 ctx.save();if(status==='crashing'&&shake>0)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake*.45);
 ctx.clearRect(-25,-25,canvasW+50,canvasH+50);
 paintBackground(t);
 const finalX=ORIGIN+NODE*TOTAL-camera;
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
 $('worldMenu').addEventListener('click',e=>{const item=e.target.closest('[data-world]');if(item&&!item.disabled)switchWorld(Number(item.dataset.world))});
 $('nextWorld').addEventListener('click',()=>{if(worldId<9)switchWorld(worldId+1);else showFusion()});
 $('fusionClose').addEventListener('click',()=>overlay('finish'));

 window.addEventListener('resize',resize);
 document.addEventListener('visibilitychange',()=>{lastFrame=0});
}
function init(){
 stars=[];TOTAL=world().total;resize();bind();updateWorldUI();updateRushHUD();overlay('intro');requestAnimationFrame(frame);
}
// Test interface is read-only except for simulated key input; it is not displayed to players.
window.__EDUKASS_TEST__={get:()=>({status,step,typed,tasks:tasks.map(t=>({...t})),playerX,solved,crashReason,attempts,world:world().name.toLowerCase(),rewardUnlocked:rewardUnlocked||status==='finished',victoryStage,worldId,crystalCollected:collectedCrystals().includes(worldId),vaultCount:collectedCrystals().length,jumping,jumpHeight,jumpCount,wrongLocked,turboActive,runningSpeed:effectiveSpeed(),distance:distanceToObstacle(),obstacles:Array.from({length:TOTAL},(_,j)=>obstacleKind(j+1))}),press:onKey,start:()=>startGame(),retry:()=>startGame(true),tick:(ms)=>{for(let r=0;r<ms;r+=35)advance(Math.min(35,ms-r))},reset,validateTasks,generate:createTasks};
init();
})();
