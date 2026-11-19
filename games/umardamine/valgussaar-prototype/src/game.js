(()=>{
'use strict';
const $=id=>document.getElementById(id);
const canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NODE=205, ORIGIN=108, TOTAL=8;
const COLORS={cyan:'#67fce9',cyanB:'#37e9dd',violet:'#ae8afe',pink:'#f482ef',gold:'#ffe29b',white:'#f1fff9'};
const names={10:'KÜMNELISTENI',100:'SAJALISTENI'};
const poolDown=[21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54,61,62,63,64,71,72,73,74,81,82,83,84,91,92,93,94];
const poolUp=[16,17,18,19,26,27,28,29,36,37,38,39,46,47,48,49,56,57,58,59,66,67,68,69,76,77,78,79,86,87,88,89];
const templates=[
 {unit:10,kind:'down'}, {unit:10,kind:'up'}, {unit:10,kind:'down'},
 {unit:10,kind:'half'}, {unit:10,kind:'down'}, {unit:10,kind:'three-tens'},
 {unit:10,kind:'carry'}, {unit:100,kind:'three-hundreds'}
];
let tasks=[],step=0,typed='',status='intro',wrongTimer=0,moveStart=0,moveFrom=ORIGIN,moveTo=ORIGIN,moveEnd=0;
let playerX=ORIGIN,clock=0,lastFrame=0,canvasW=0,canvasH=0,dpr=1;
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
 typed='';updateAnswer();$('answerBox').classList.remove('wrong','success');
 note('Sisesta vastus');updateGems();
 $('sceneCaption').textContent=step===TOTAL-1?'Viimane värav · kristall ootab sind':'Iga õige vastus avab uue värava';
}
function overlay(type){
 $('overlay').classList.remove('hidden');$('overlay').setAttribute('aria-hidden','false');
 $('introHero').hidden=type!=='intro';$('finishHero').hidden=type!=='finish';
}
function hideOverlay(){$('overlay').classList.add('hidden');$('overlay').setAttribute('aria-hidden','true')}
function setSound(){soundOn=!soundOn;$('sound').classList.toggle('enabled',soundOn);$('sound').setAttribute('aria-label',soundOn?'Lülita heli välja':'Lülita heli sisse');if(soundOn)tone(510,.07,'triangle',.035)}
function tone(frequency,duration,type='sine',volume=.045,delay=0){
 if(!soundOn)return;
 try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();
 const t=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(frequency*.83,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.012);}catch(e){}
}
function winSound(){tone(540,.14,'sine',.036);tone(790,.19,'triangle',.03,.07);tone(1150,.25,'sine',.019,.16)}
function startGame(){
 clearTimeout(wrongTimer);tasks=createTasks();validateTasks(tasks);step=0;typed='';playerX=ORIGIN;camera=playerX-canvasW*.29;
 particleTrail=[];status='active';rewardUnlocked=false;fxGlow=0;fxBurst=0;shake=0;
 hideOverlay();showTask();
 try{localStorage.removeItem('edukass-neon-world1-finished')}catch(e){}
}
function onKey(key){
 if(status!=='active')return;
 if(key==='back'){typed=typed.slice(0,-1);$('answerBox').classList.remove('wrong');note('Sisesta vastus');updateAnswer();return}
 if(key==='check'){check(true);return}
 if(!/^\d$/.test(key)||typed.length>=8)return;
 if(!typed&&key==='0')return;
 typed+=key;updateAnswer();$('answerBox').classList.remove('wrong');note('Sisesta vastus');
 if(typed===String(tasks[step].answer))check(false);
 else if(typed.length>=String(tasks[step].answer).length)check(false);
}
function check(manual){
 if(status!=='active'||!typed)return;
 if(Number(typed)===tasks[step].answer){
  status='moving';latestAnswer=typed;$('answerBox').classList.add('success');note('ÕIGE! Värav avaneb','ok');
  moveStart=performance.now();moveEnd=moveStart+(reduced?90:780);moveFrom=playerX;moveTo=ORIGIN+NODE*(step+1);
  fxGlow=1;fxBurst=1;spawnBurst(moveTo,28);winSound();
  $('sceneCaption').textContent='VÄRAV AVATUD';
  return;
 }
 // Do not penalize an unfinished prefix while the learner is typing.
 if(!manual&&typed.length<String(tasks[step].answer).length)return;
 $('answerBox').classList.add('wrong');note('Proovi uuesti','bad');tone(210,.16,'triangle',.024);
 clearTimeout(wrongTimer);wrongTimer=setTimeout(()=>{if(status==='active'){$('answerBox').classList.remove('wrong');typed='';updateAnswer();note('Sisesta vastus')}},reduced?100:670);
}
function finish(){
 status='finished';step=TOTAL;updateGems();$('answerBox').classList.remove('success');note('Kõik väravad avatud!','ok');fxBurst=1;spawnBurst(playerX,65);winSound();
 try{localStorage.setItem('edukass-neon-world1-finished','1')}catch(e){}
 setTimeout(()=>overlay('finish'),reduced?80:1050);
}
function reset(){status='intro';step=0;typed='';playerX=ORIGIN;particleTrail=[];updateGems();updateAnswer();note('Sisesta vastus');overlay('intro')}
function viewWorld(){hideOverlay();status='showcase';$('sceneCaption').textContent='VALGUSSAARE KRISTALL · 01/09';note('Maailm läbitud · mängi uuesti ülal ↻','ok')}
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
function drawPlatform(worldX,t){
 const x=worldX-camera,y=canvasH*.76,w=148;
 if(x+w< -40||x-w>canvasW+40)return;
 glowCircle(x,y+7,84,'#24ddc22b');
 polygon([[x-74,y-2],[x+57,y-2],[x+74,y+13],[x-57,y+13]],'#213965','#7bc9cf90',1.4);
 polygon([[x-57,y+13],[x+74,y+13],[x+53,y+32],[x-69,y+29]],'#10284c','#4b75c25e',1);
 polygon([[x-69,y+29],[x+53,y+32],[x+33,y+42],[x-47,y+39]],'#0b1b37');
 line([[x-63,y-3],[x+45,y-3]],'#7effee',2.5,.8);
 line([[x-40,y+6],[x-22,y+6],[x-15,y+3],[x+18,y+3],[x+27,y+7],[x+46,y+7]],'#58e8de',1,.66);
 for(let j=0;j<3;j++){
  let bx=x-40+j*38;ctx.fillStyle='#5bf0e1';ctx.globalAlpha=.18+.13*Math.sin(t*.002+j+worldX*.01);ctx.fillRect(bx,y+19,18,2);ctx.globalAlpha=1;
 }
 // A clean luminous landing pad, no street/road/obstacle assets.
 ctx.save();ctx.translate(x,y-7);ctx.scale(1,.32);ctx.strokeStyle='#81fcdf';ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#9b99ff8f';ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,22,Math.PI*.14,Math.PI*.86);ctx.stroke();ctx.restore();
}
function drawGate(worldX,i,t){
 const x=worldX-camera,y=canvasH*.515,opened=i<=step;
 if(x<-100||x>canvasW+100)return;
 const portalActive=(i===step+1&&status!=='finished'),final=i===8;
 const scale=final?1.25:.87;ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const brightness=portalActive?1:opened?.6:.37;
 ctx.globalAlpha=brightness;
 glowCircle(0,0,68,final?'#fed37a45':'#5ff0ef3d');
 ctx.save();ctx.globalCompositeOperation='lighter';
 // Two tall arc rings and segmented tech ribs.
 for(let layer=0;layer<2;layer++){
  ctx.beginPath();ctx.ellipse(0,0,38+layer*7,58+layer*7,0,0,Math.PI*2);
  ctx.strokeStyle=layer?'#9b79ff':final?'#ffdda0':'#70ffee';ctx.lineWidth=layer?2:4;
  ctx.shadowColor=layer?'#c08aff':'#67fff0';ctx.shadowBlur=layer?13:22;ctx.stroke();
 }
 ctx.shadowBlur=0;
 ctx.strokeStyle='#defef1';ctx.lineWidth=2.1;
 ctx.beginPath();ctx.ellipse(0,0,29,47,0,(-.5+t*.00013)%6.28,Math.PI*1.25+t*.00013);ctx.stroke();
 const glow=ctx.createRadialGradient(0,0,3,0,0,50);glow.addColorStop(0,final?'#ffeab154':'#91fee84e');glow.addColorStop(1,'#84ffe000');ctx.fillStyle=glow;ctx.beginPath();ctx.ellipse(0,0,37,56,0,0,Math.PI*2);ctx.fill();
 ctx.restore();
 for(let j=0;j<10;j++){
  const a=j*Math.PI*2/10+t*.00014*(j%2?1:-1);
  const rx=Math.cos(a)*42,ry=Math.sin(a)*65;
  ctx.save();ctx.translate(rx,ry);ctx.rotate(a);ctx.fillStyle=j%2?'#ab94ff':'#92fff0';ctx.fillRect(-3,-2,6,4);ctx.restore();
 }
 ctx.globalAlpha=1;ctx.restore();
 if(portalActive){glowCircle(x,y,17+3*Math.sin(t*.004),'#e2ffff38');}
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
function drawPlayer(t,moving=false){
 let x=playerX-camera;
 const pulse=Math.sin(t*.0038),hover=3*Math.sin(t*.004);
 const p=moving?clamp((t-moveStart)/(moveEnd-moveStart),0,1):0;
 const jump=moving?Math.sin(p*Math.PI)*canvasH*.18:0;
 let y=canvasH*.76-51-jump+hover;
 // Soft particle trail follows movement.
 if(Math.random()<.5){particleTrail.push({x,y:y+random(17)-8,birth:t,size:1.2+Math.random()*3});}
 particleTrail=particleTrail.filter(s=>t-s.birth<900).slice(-70);
 ctx.save();particleTrail.forEach(s=>{const age=(t-s.birth)/900,dx=moving?(t-s.birth)*.065:0;circle(s.x-dx,s.y,s.size*(1-age),'rgba(88,255,226,'+(.56*(1-age))+')')});ctx.restore();
 glowCircle(x,y,59,'#54ffe43c');glowCircle(x,y,27,'#cfffee72');
 ctx.save();ctx.translate(x,y);ctx.rotate(moving?p*Math.PI*1.4+Math.sin(t*.007)*.07:Math.sin(t*.0025)*.06);
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
  const a=t*.001+i*Math.PI*2/3;circle(x+Math.cos(a)*35,y+Math.sin(a)*18,1.5+i%2,'#dcffed');
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
 if(status==='moving'){
  const q=clamp((t-moveStart)/(moveEnd-moveStart),0,1);playerX=lerp(moveFrom,moveTo,easeBoth(q));
  if(q===1){playerX=moveTo;step++;if(step>=TOTAL)finish();else{status='active';showTask()}}
 }
 const wanted=playerX-canvasW*.28;camera=lerp(camera,wanted,reduced?1:clamp(dt*.009,0,1));
 ctx.clearRect(0,0,canvasW,canvasH);
 paintBackground(t);
 // A luminous final tower appears in the distance; gets closer as progress grows.
 const finalX=ORIGIN+NODE*8-camera;
 drawSpire(finalX,canvasH*.49,.8+step*.035,t,true);
 const first=Math.max(0,Math.floor((camera-110-ORIGIN)/NODE));
 const last=Math.min(8,first+6);
 for(let i=first;i<=last;i++)drawPlatform(ORIGIN+NODE*i,t);
 for(let i=Math.max(1,first);i<=last;i++)drawGate(ORIGIN+NODE*i,i,t);
 drawPlayer(t,status==='moving');
 drawFX(dt);
 requestAnimationFrame(frame);
}
function bind(){
 $('keypad').addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(!b)return;onKey(b.dataset.key)});
 document.addEventListener('keydown',e=>{
  const key=e.key;if(key==='Backspace'){e.preventDefault();onKey('back')}else if(key==='Enter'){e.preventDefault();if(status==='intro')startGame();else if(status==='finished')startGame();else onKey('check')}else if(/^\d$/.test(key))onKey(key);
 });
 $('begin').addEventListener('click',startGame);$('again').addEventListener('click',startGame);$('restart').addEventListener('click',reset);$('viewWorld').addEventListener('click',viewWorld);$('sound').addEventListener('click',setSound);
 window.addEventListener('resize',resize);
 document.addEventListener('visibilitychange',()=>{lastFrame=0});
}
function init(){
 stars=[];updateGems();resize();bind();overlay('intro');requestAnimationFrame(frame);
}
// Test interface is read-only except for simulated key input; it is not displayed to players.
window.__EDUKASS_TEST__={get:()=>({status,step,typed,tasks:tasks.map(t=>({...t})),playerX,world:'valgussaar',rewardUnlocked:status==='finished'||status==='showcase'}),press:onKey,start:startGame,reset,validateTasks,generate:createTasks};
init();
})();