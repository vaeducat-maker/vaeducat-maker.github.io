(()=>{
'use strict';
const $=id=>document.getElementById(id);
const canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NODE=580, ORIGIN=108, TOTAL=8;
const SPEED=86, TURBO_SPEED=340, TURBO_ARC_STRETCH=1.4; // fast traversal after early answers
const JUMP_V=240, JUMP_G=200, JUMP_TOTAL=2*JUMP_V/JUMP_G;
const HAZARD_HALF_WIDTH=58, CLEARANCE=76; // consistent with the rendered spike and crystal hitboxes
const COLORS={cyan:'#67fce9',cyanB:'#37e9dd',violet:'#ae8afe',pink:'#f482ef',gold:'#ffe29b',white:'#f1fff9'};
const names={10:'KÜMNELISTENI',100:'SAJALISTENI'};
const poolDown=[21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54,61,62,63,64,71,72,73,74,81,82,83,84,91,92,93,94];
const poolUp=[16,17,18,19,26,27,28,29,36,37,38,39,46,47,48,49,56,57,58,59,66,67,68,69,76,77,78,79,86,87,88,89];
const templates=[
 {unit:10,kind:'down'}, {unit:10,kind:'up'}, {unit:10,kind:'down'},
 {unit:10,kind:'half'}, {unit:10,kind:'down'}, {unit:10,kind:'three-tens'},
 {unit:10,kind:'carry'}, {unit:100,kind:'three-hundreds'}
];
let tasks=[],step=0,typed='',status='intro',solved=false,crashStart=0,crashReason='',crashElapsed=0,playElapsed=0;
let attempts=0;
let playerX=ORIGIN,clock=0,lastFrame=0,canvasW=0,canvasH=0,dpr=1;
let jumping=false,jumpAge=0,jumpHeight=0,jumpStarted=false,jumpCount=0,wrongLocked=false,turboActive=false,jumpScale=1;
let soundOn=false,audio=null,fxGlow=0,fxBurst=0,shake=0,toastUntil=0,rewardUnlocked=false;
let camera=ORIGIN-110,particleTrail=[],specks=[],stars=[],ambient=[],latestAnswer='';
function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v))}
function lerp(a,b,t){return a+(b-a)*t}
function easeOut(t){return 1-Math.pow(1-t,3)}
function easeBoth(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function random(n){return Math.floor(Math.random()*n)}
function format(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function numberPool(t){
 if(t.kind==='carry')return [95,96,97,98,99];
 if(t.kind==='half')return [15,25,35,45,55,65,75,85];
 if(t.kind==='three-tens'){let a=[];for(let n=111;n<=989;n++)if(n%10>=5)a.push(n);return a}
 if(t.kind==='three-hundreds'){let a=[];for(let n=121;n<=949;n++)if(n%100>0&&n%100<50)a.push(n);return a}
 return (t.kind==='up'?poolUp:poolDown).filter(n=>n<95);
}
function createTasks(){
 let prior=[];try{prior=JSON.parse(localStorage.getItem('edukass-neon-world1-previous')||'[]')}catch(e){}
 const used=new Set();
 const result=templates.map(t=>{
  const pool=numberPool(t);
  let opts=pool.filter(n=>!used.has(n)&&!prior.includes(n));
  if(!opts.length)opts=pool.filter(n=>!used.has(n));
  const n=opts[random(opts.length)];
  used.add(n);
  return {v:n,unit:t.unit,answer:Math.floor((n+t.unit/2)/t.unit)*t.unit,kind:t.kind};
 });
 try{localStorage.setItem('edukass-neon-world1-previous',JSON.stringify(result.map(x=>x.v)))}catch(e){}
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
 $('introHero').hidden=type!=='intro';$('finishHero').hidden=type!=='finish';$('crashHero').hidden=type!=='crash';
}
function hideOverlay(){$('overlay').classList.add('hidden');$('overlay').setAttribute('aria-hidden','true')}
function speedForStep(){return step===7?75:SPEED}
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
function winSound(){tone(540,.14,'sine',.036);tone(790,.19,'triangle',.03,.07);tone(1150,.25,'sine',.019,.16)}
function startGame(retry=false){
 if(!retry||!tasks.length){tasks=createTasks();validateTasks(tasks)}
 attempts++;step=0;typed='';solved=false;playerX=ORIGIN;camera=playerX-canvasW*.30;
 jumping=false;jumpAge=0;jumpHeight=0;jumpStarted=false;wrongLocked=false;turboActive=false;jumpScale=1;jumpCount=0;
 particleTrail=[];status='running';crashElapsed=0;playElapsed=0;rewardUnlocked=false;fxGlow=0;fxBurst=0;shake=0;
 hideOverlay();showTask();updateRushHUD();
 try{localStorage.removeItem('edukass-neon-world1-finished')}catch(e){}
}
function lose(reason){
 if(status!=='running')return;
 status='crashing';crashReason=reason;crashElapsed=0;fxGlow=.4;shake=18;
 $('answerBox').classList.remove('success');$('answerBox').classList.add('wrong');
 note(reason==='wrong'?'VALE VASTUS! KOKKUPÕRGE!':'AEG SAI OTSA! KOKKUPÕRGE!','bad');
 $('sceneCaption').textContent='KOKKUPÕRGE!';
 tone(160,.35,'sawtooth',.065);
 $('crashCount').textContent=`${step} / ${TOTAL}`;
 $('crashDetail').textContent=reason==='wrong'?'Vale vastus! Kristall põrkas vastu takistust.':'Takistus jõudis kohale enne õiget vastust.';
 updateRushHUD();
}
function onKey(key){
 if(status!=='running'||solved||wrongLocked)return;
 if(key==='back'){typed=typed.slice(0,-1);updateAnswer();return}
 if(key==='check'){check(true);return}
 if(!/^\d$/.test(key)||typed.length>=8)return;
 if(!typed&&key==='0')return;
 typed+=key;updateAnswer();
 const answer=String(tasks[step].answer);
 if(typed===answer)check(false);
 else if(typed.length>=answer.length)check(false);
}
function check(manual){
 if(status!=='running'||solved||wrongLocked||!typed)return;
 if(Number(typed)===tasks[step].answer){
  solved=true;turboActive=distanceToObstacle()>180; // late correct answers keep the original safe jump speed
  $('answerBox').classList.add('success');note(turboActive?'ÕIGE! TURBO!':'ÕIGE! HÜPE VALMIS','ok');
  fxGlow=.6;tone(600,.14,'sine',.04);tone(810,.12,'triangle',.022,.08);
  $('sceneCaption').textContent=turboActive?'TURBO · KRISTALL KIHUTAB EDASI':'HÜPE VALMIS · HÜPPA ÜLE TAKISTUSE';updateRushHUD();return;
 }
 if(!manual&&typed.length<String(tasks[step].answer).length)return;
 wrongLocked=true; // The obstacle remains lethal; the crystal physically runs into it.
 $('answerBox').classList.add('wrong');note('VALE VASTUS! TAKISTUS LÄHENEB!','bad');
 $('sceneCaption').textContent='VALE VASTUS · KOKKUPÕRGE LÄHENEB';
 shake=5;tone(230,.15,'sawtooth',.04);updateRushHUD();
}
function finish(){
 status='finished';step=TOTAL;solved=false;updateGems();updateRushHUD();
 $('answerBox').classList.remove('success');note('Kõik takistused ületatud!','ok');fxBurst=1;spawnBurst(playerX,65);winSound();
 try{localStorage.setItem('edukass-neon-world1-finished','1')}catch(e){}
 setTimeout(()=>{if(status==='finished')overlay('finish')},reduced?80:750);
}
function reset(){status='intro';step=0;typed='';solved=false;playerX=ORIGIN;particleTrail=[];jumping=false;jumpAge=0;jumpHeight=0;jumpStarted=false;wrongLocked=false;turboActive=false;jumpScale=1;jumpCount=0;updateGems();updateAnswer();note('Vasta enne takistust!');updateRushHUD();overlay('intro')}
function viewWorld(){hideOverlay();status='showcase';$('sceneCaption').textContent='VALGUSSAARE KRISTALL · 01/09';note('Maailm läbitud · mängi uuesti ülal ↻','ok')}
function advance(dt){
 const delta=clamp(dt,0,100);
 if(status==='running'){
  const dtSeconds=delta/1000;
  const gate=ORIGIN+NODE*(step+1);
  const approach=gate-playerX;
  // A correct answer arms one automatic jump. It starts at the same point relative
  // to the obstacle at every pace, then follows a genuine ballistic arc.
  const takeoffDistance=speedForStep()*JUMP_TOTAL/2*(turboActive?TURBO_ARC_STRETCH:1);
  if(solved&&!jumpStarted&&!jumping&&approach<=takeoffDistance){
   jumping=true;jumpStarted=true;jumpAge=0;jumpHeight=0;jumpCount++;
   // Longer world-space flight during turbo keeps both ends of the solid hazard
   // within a visible, physical arc instead of skipping the collision hitbox.
   jumpScale=(effectiveSpeed()/speedForStep())/(turboActive?TURBO_ARC_STRETCH:1);
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
 if(x<-100||x>canvasW+125)return;
 const open=i<=step; // spikes stay solid even when the rounding answer is correct
 const danger=i===step+1&&!solved&&status==='running';
 ctx.save();ctx.translate(x,ground);
 const active=1+Math.sin(t*.008+i)*.035;
 ctx.scale(active*hazardScale(),active*hazardScale());
 glowCircle(0,-35,77,open?'#35fbe13d':'#ff5aaf42');
 // Original neon hazard: sharply legible double crystalline fangs with laser crossbar.
 const left=[[-43,0],[-36,-41],[-20,-79],[-3,-40],[-9,0]];
 const right=[[9,0],[3,-40],[20,-79],[36,-41],[43,0]];
 const col=open?'#225b70':'#b2429c',rim=open?'#93ffe8':'#ff92d0';
 polygon(left,col,rim,2);polygon(right,col,rim,2);
 polygon([[-24,-73],[-20,-86],[-13,-66],[-20,-73]],open?'#c8fff1':'#ffd1ee');
 polygon([[13,-66],[20,-86],[26,-73],[20,-73]],open?'#c8fff1':'#ffd1ee');
 if(!open){
  const hot=.74+.26*Math.sin(t*.014+i);
  ctx.strokeStyle='#ff8bbd';ctx.lineWidth=5;ctx.globalAlpha=hot;ctx.shadowColor='#ff4da1';ctx.shadowBlur=18;
  line([[-24,-35],[24,-35]],'#ffc0df',4,hot);ctx.shadowBlur=0;ctx.globalAlpha=1;
  polygon([[-10,-35],[0,-62],[10,-35],[0,-11]],'#ff6aab','#ffd4ee',1.6);
 }else{
  // Solved obstacle remains in the scene as two opened neon halves.
  ctx.strokeStyle='#80ffe6';ctx.lineWidth=2;
  line([[-32,-31],[-48,-50]],'#a2ffe5',2,.7);line([[32,-31],[48,-50]],'#a2ffe5',2,.7);
  ctx.save();ctx.globalCompositeOperation='lighter';glowCircle(0,-43,25,'#54ffe733');ctx.restore();
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
 const spin=jumping?Math.PI*2*jumpAge/JUMP_TOTAL:0;
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
  const key=e.key;if(key==='Backspace'){e.preventDefault();onKey('back')}else if(key==='Enter'){e.preventDefault();if(status==='intro')startGame();else if(status==='finished')startGame();else if(status==='crashed')startGame(true);else onKey('check')}else if(/^\d$/.test(key))onKey(key);
 });
 $('begin').addEventListener('click',()=>startGame());$('again').addEventListener('click',()=>startGame());$('retry').addEventListener('click',()=>startGame(true));$('restart').addEventListener('click',reset);$('viewWorld').addEventListener('click',viewWorld);$('sound').addEventListener('click',setSound);
 window.addEventListener('resize',resize);
 document.addEventListener('visibilitychange',()=>{lastFrame=0});
}
function init(){
 stars=[];updateGems();resize();bind();updateRushHUD();overlay('intro');requestAnimationFrame(frame);
}
// Test interface is read-only except for simulated key input; it is not displayed to players.
window.__EDUKASS_TEST__={get:()=>({status,step,typed,tasks:tasks.map(t=>({...t})),playerX,solved,crashReason,attempts,world:'valgussaar',rewardUnlocked:status==='finished'||status==='showcase',jumping,jumpHeight,jumpCount,wrongLocked,turboActive,runningSpeed:effectiveSpeed(),distance:distanceToObstacle()}),press:onKey,start:()=>startGame(),retry:()=>startGame(true),tick:(ms)=>{for(let r=0;r<ms;r+=35)advance(Math.min(35,ms-r))},reset,validateTasks,generate:createTasks};
init();
})();
