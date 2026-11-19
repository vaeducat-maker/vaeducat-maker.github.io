(()=>{
const qaMode=new URLSearchParams(location.search).has('qa');
const progressStore=qaMode?sessionStorage:localStorage;'use strict';
const $=s=>document.getElementById(s),stage=$('stage'),car=$('car'),barrier=$('hazard'),canvas=$('roadLines'),ctx=canvas.getContext('2d'),landmark=$('landmark'),landmarkImg=$('landmarkImg');
const scenes=[$('sceneStart'),$('sceneCliff'),$('sceneHarbor'),$('sceneExtra')];
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const rand=(a)=>a[Math.floor(Math.random()*a.length)];
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
// Each obstacle belongs to its part of the coastal route, rather than random unrelated objects.
const options=[['cones','barricade'],['barricade','cones'],['rocks'],['truck'],['rocks','truck'],['water'],['barricade','gate'],['gate']];
const eventLabels=['TEEÄÄR!','KITSAS TEE!','KIVID TEEL!','TEETÖÖD!','KURV!','MÄRG TEE!','SADAMA TEE!','VIIMANE TÕKE!'];
const timeWindows=[18,17,15,14,13,12,11,10.5];
// 2026-11-12 v11: another 20% slower than v10 (0.75 × 0.80 = 0.60 of original).
// Applies equally to obstacle approach and animated road markings.
const DRIVE_PACE=0.60;
let obstacles=[];
const pools={down:[21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54,61,62,63,64,71,72,73,74,81,82,83,84,91,92,93,94],up:[16,17,18,19,26,27,28,29,36,37,38,39,46,47,48,49,56,57,58,59,66,67,68,69,76,77,78,79,86,87,88,89],half:[15,25,35,45,55,65,75,85],carry:[95,96,97,98,99]};
let wrongFlashTimer=0;let tasks=[],index=0,typed='',state='intro',hazard=.02,speed=40,velocity=40,risk=1,wrongMarked=false,wrongCandidate='',last=performance.now(),goal=18,swerveEnd=0,swerveDir=1,scenePhase=0,toastEnd=0,checkTimeout=0,transitionTimeout=0,soundOn=false,audioCtx=null,savedSequence=[];
let currentRoute='majakas';
const forestOptions=[['logs','rocks'],['rocks'],['logs'],['gate'],['rocks','logs'],['logs','rocks'],['water'],['rocks','gate'],['gate','logs'],['logs'],['gate'],['gate']];
const forestMessages=['METSATEE!','KITSAS RADA!','PUUD TEE ÄÄRES!','ESIMENE SILD!','SÜGAV METS!','PALJU PUUD!','OJA!','KIVINE RADA!','METSA VÄRAV!','LÕPU SIRGE!','METSAJAAM PAISTAB!','VIIMANE TAKISTUS!'];
// Level 2: twelve tasks that consolidate tens and hundreds only.
// Four tens keep the earlier skill active; eight hundreds build confidence.
const forestPlan=[
 {u:10,d:2,dir:'down'},   {u:100,d:3,dir:'down'}, {u:10,d:2,dir:'up'},      {u:100,d:3,dir:'up'},
 {u:10,d:3,dir:'half'},   {u:100,d:3,dir:'half'}, {u:100,d:3,dir:'carry'}, {u:10,d:3,dir:'carry'},
 {u:100,d:3,dir:'down'},  {u:100,d:4,dir:'up'},   {u:100,d:4,dir:'half'},  {u:100,d:4,dir:'carry'}
];

// Level 3: tens and hundreds still dominate; thousands appear only near the end.
const riverPlan=[
 {u:100,d:3,dir:'down'},  {u:10,d:3,dir:'up'},       {u:100,d:3,dir:'half'},  {u:100,d:3,dir:'up'},
 {u:10,d:3,dir:'down'},   {u:100,d:4,dir:'down'},    {u:100,d:4,dir:'carry'}, {u:100,d:4,dir:'up'},
 {u:1000,d:4,dir:'down'}, {u:100,d:4,dir:'half'},    {u:1000,d:4,dir:'half'}, {u:1000,d:4,dir:'up'}
];
const riverOptions=[['rocks','water'],['logs','rocks'],['water'],['gate','rocks'],['rocks'],['water','logs'],['gate'],['rocks'],['water'],['water','rocks'],['rocks','water'],['gate','water']];
const riverMessages=['JÕERADA!','JÕE KALDAL!','VÄIKE KURV!','KIVID TEEL!','JÕGI PAISTAB!','KITSAS TEE!','VEE ÄÄRES!','KIVINE RADA!','JÕEÄÄR!','MÄED PAISTAVAD!','VIIMANE KURV!','JÕESILD!'];

// Level 4: hundreds remain familiar support while thousands become the main skill.
const mountainPlan=[
 {u:100,d:4,dir:'down'},     {u:1000,d:4,dir:'down'}, {u:100,d:4,dir:'up'},       {u:1000,d:4,dir:'up'},
 {u:1000,d:4,dir:'half'},    {u:100,d:4,dir:'half'},  {u:1000,d:4,dir:'carry'},  {u:1000,d:5,dir:'down'},
 {u:100,d:4,dir:'carry'},    {u:1000,d:5,dir:'up'},   {u:1000,d:5,dir:'half'},   {u:1000,d:5,dir:'carry'}
];
const mountainOptions=[['rocks','gate'],['water','rocks'],['logs'],['gate'],['rocks'],['gate','rocks'],['water'],['gate'],['logs'],['rocks'],['gate'],['water','gate']];
const mountainMessages=['MÄGITEE!','KÕRGEL TEE!','PÖÖRDEKS VALMIS!','MÄED PAISTAVAD!','JÄRSEM KURV!','KALJUD TEE ÄÄRES!','TUUL TÕUSEB!','VAATEPLATVORM POLE KAUGEL!','VIIMANE TÕUS!','PEAAEGU KOHAL!','MÄEKURU PAISTAB!','MÄEKURU!'];
function makeMountainTasks(){
 let previous=[];try{previous=JSON.parse(progressStore.getItem('edukass-maekuru-last-v1')||'[]')}catch(e){}
 const used=new Set();
 tasks=mountainPlan.map(t=>{
  const lo=10**(t.d-1),hi=Math.min(10**t.d-1,39999);
  let v=null;
  for(let tries=0;tries<3200;tries++){
   const n=Math.floor(lo+Math.random()*(hi-lo+1));const rem=n%t.u;const half=t.u/2;
   const valid=rem!==0&&(t.dir==='down'?rem<half:t.dir==='up'?rem>=half:t.dir==='half'?rem===half:(rem>=half&&(Math.floor(n/t.u)+1)%10===0));
   if(valid && (t.d!==5 || Math.round(n/t.u)*t.u<100000) && !used.has(n) && !previous.includes(n)){v=n;break}
  }
  if(v===null){for(let n=lo;n<=hi;n++){
    const rem=n%t.u,half=t.u/2;
    const valid=rem!==0&&(t.dir==='down'?rem<half:t.dir==='up'?rem>=half:t.dir==='half'?rem===half:(rem>=half&&(Math.floor(n/t.u)+1)%10===0));
    if(valid && (t.d!==5 || Math.round(n/t.u)*t.u<100000) && !used.has(n)){v=n;break}
  }}
  if(v===null)throw Error('Missing rounding number for Mäekuru');
  used.add(v);return {v,a:Math.round(v/t.u)*t.u,unit:t.u,type:t.dir,dir:t.dir};
 });
 obstacles=mountainOptions.map(rand);
 for(let i=1;i<obstacles.length;i++)if(obstacles[i]===obstacles[i-1])obstacles[i]=mountainOptions[i].find(x=>x!==obstacles[i-1])||obstacles[i];
 try{progressStore.setItem('edukass-maekuru-last-v1',JSON.stringify(tasks.map(t=>t.v)))}catch(e){}
 return tasks;
}
function mountainGoal(t,i){const digits=String(t.a).length;return 19.5+Math.max(0,digits-4)*5.5+(i>=9?1.8:0)}
function startMountainRoute(){chooseRoute('mountain')}
function makeRiverTasks(){
 let previous=[];try{previous=JSON.parse(progressStore.getItem('edukass-joesild-last-v1')||'[]')}catch(e){}
 const used=new Set();
 tasks=riverPlan.map(t=>{
  const lo=10**(t.d-1),hi=Math.min(10**t.d-1,9499);
  let v=null;
  for(let tries=0;tries<2500;tries++){
   const n=Math.floor(lo+Math.random()*(hi-lo+1));const rem=n%t.u;const half=t.u/2;
   const valid=rem!==0&&(t.dir==='down'?rem<half:t.dir==='up'?rem>=half:t.dir==='half'?rem===half:(rem>=half&&(Math.floor(n/t.u)+1)%10===0));
   if(valid&&!used.has(n)&&!previous.includes(n)){v=n;break}
  }
  if(v===null){for(let n=lo;n<=hi;n++){
    const rem=n%t.u,half=t.u/2;
    const valid=rem!==0&&(t.dir==='down'?rem<half:t.dir==='up'?rem>=half:t.dir==='half'?rem===half:(rem>=half&&(Math.floor(n/t.u)+1)%10===0));
    if(valid&&!used.has(n)){v=n;break}
  }}
  if(v===null)throw Error('Missing rounding number for Jõesild');
  used.add(v);return {v,a:Math.round(v/t.u)*t.u,unit:t.u,type:t.dir,dir:t.dir};
 });
 obstacles=riverOptions.map(rand);
 for(let i=1;i<obstacles.length;i++)if(obstacles[i]===obstacles[i-1])obstacles[i]=riverOptions[i].find(x=>x!==obstacles[i-1])||obstacles[i];
 try{progressStore.setItem('edukass-joesild-last-v1',JSON.stringify(tasks.map(t=>t.v)))}catch(e){}
 return tasks;
}
function riverGoal(t,i){const digits=String(t.a).length;return 18.5+Math.max(0,digits-3)*5.1+(i>=9?1.5:0)}
function startBridgeRoute(){chooseRoute('bridge')}

function makeForestTasks(){
 const key='edukass-metsajaam-last-v12';
 let previous=[];try{previous=JSON.parse(progressStore.getItem(key)||'[]')}catch(e){}
 const used=new Set();
 tasks=forestPlan.map(t=>{
   const lo=10**(t.d-1),hi=Math.min(10**t.d-1,2999);
   let v=null;
   for(let tries=0;tries<900;tries++){
     const n=Math.floor(lo+Math.random()*(hi-lo+1));
     const rem=n%t.u; if(rem===0)continue;
     if(t.dir==='down'&&rem>=t.u/2)continue;
     if(t.dir==='up'&&rem<t.u/2)continue;
     if(t.dir==='half'&&rem!==t.u/2)continue;
     if(t.dir==='carry' && (rem<t.u/2 || (Math.floor(n/t.u)+1)%10!==0))continue;
     if(used.has(n)||previous.includes(n))continue;
     v=n;break;
   }
   // Fallback for a rare exhausted pool: maintain the requested direction.
   if(v===null){const half=t.u/2;for(let n=lo;n<=hi;n++){
      const rem=n%t.u,valid=rem!==0&&(t.dir==='down'?rem<half:t.dir==='up'?rem>=half:t.dir==='half'?rem===half:(rem>=half && (Math.floor(n/t.u)+1)%10===0));
      if(valid&&!used.has(n)){v=n;break}
   }}
   if(v===null)throw Error('No values available for Metsajaam task');
   used.add(v);
   return {v,a:Math.round(v/t.u)*t.u,unit:t.u,type:t.dir,dir:t.dir};
 });
 obstacles=forestOptions.map(rand);
 for(let i=1;i<obstacles.length;i++)if(obstacles[i]===obstacles[i-1])obstacles[i]=forestOptions[i].find(x=>x!==obstacles[i-1])||obstacles[i];
 try{progressStore.setItem(key,JSON.stringify(tasks.map(t=>t.v)))}catch(e){}
 return tasks;
}
function forestGoal(t,i){
 // 0.60 movement multiplier -> plenty of thinking time even with 5 digit answers.
 const digits=String(t.a).length;
 return 17 + Math.max(0,digits-2)*5 + (i>=9?1.5:0);
}
function updateStageLandmark(){
 if(!landmark||!landmarkImg)return;
 const src=currentRoute==='bridge'?bridgePostcardV22:currentRoute==='mountain'?mountainGateV28:'';
 landmark.classList.toggle('bridge',currentRoute==='bridge');
 landmark.classList.toggle('mountain',currentRoute==='mountain');
 landmark.classList.remove('phase-0','phase-1','phase-2');
 landmark.classList.add(`phase-${scenePhase}`);
 if(src){landmarkImg.src=src;landmarkImg.alt=currentRoute==='bridge'?'Jõesild':'Mäekuru';}
 landmark.classList.toggle('show',!!src&&state!=='reward');
}

function applyRouteScenes(which){
 $('app').classList.toggle('route-bridge',which==='bridge');
 $('app').classList.toggle('route-mountain',which==='mountain');
 for(const name of ['lake','mill','town','observatory','castle'])$('app').classList.toggle('route-'+name,which===name);
}

function chooseRoute(which){
 currentRoute=which;
 $('app').classList.toggle('forest-route',which==='forest');
 $('app').classList.toggle('river-route',which==='bridge'||which==='mountain'||!!adventureStages[which]);
 applyRouteScenes(which);
 document.querySelector('.place').innerHTML=adventureStages[which]?'<span class="pin">📍</span> '+adventureStages[which].name:which==='mountain'?'<span class="pin">📍</span> MÄEKURU':which==='bridge'?'<span class="pin">📍</span> JÕESILD':which==='forest'?'<span class="pin">📍</span> METSAJAAM':'<span class="pin">📍</span> MAJAKAS';
 stage.setAttribute('aria-label',adventureStages[which]?'Tee '+adventureStages[which].name+' juurde':which==='mountain'?'Mägitee ja lähenev takistus':which==='bridge'?'Jõerada ja lähenev takistus':which==='forest'?'Metsatee ja lähenev takistus':'Rannikutee ja lähenev takistus');
 updateStageLandmark();
 intro();
}
function startForestRoute(){chooseRoute('forest')}
function returnToMajakas(){chooseRoute('majakas')}

function makeTasks(){
 if(adventureStages[currentRoute])return makeAdventureTasks(currentRoute);
 if(currentRoute==='forest')return makeForestTasks();
 if(currentRoute==='bridge')return makeRiverTasks();
 if(currentRoute==='mountain')return makeMountainTasks();
 // Route 1 = exactly eight tasks: 6 two-digit -> tens, one 3-digit -> tens,
 // one 3-digit -> hundreds. The two new cases are deliberately in the second half.
 const key='edukass-majakas-last-numbers-v9';
 let previous=[];try{previous=JSON.parse(progressStore.getItem(key)||'[]')}catch(e){}
 const used=new Set(),answer=[];
 const templates=[
  {u:10,dir:'down',two:true,kind:'down'},
  {u:10,dir:'up',two:true,kind:'up'},
  {u:10,dir:'down',two:true,kind:'down'},
  {u:10,dir:'up',two:true,kind:'half'},
  {u:10,dir:'down',two:true,kind:'down'},
  {u:10,dir:'up',three:true,kind:'three-tens'},
  {u:10,dir:'up',two:true,kind:'carry'},
  {u:100,dir:'down',three:true,kind:'three-hundreds'}
 ];
 function pick(t){
  let pool=[];
  if(t.kind==='carry')pool=[95,96,97,98,99];
  else if(t.kind==='half')pool=[15,25,35,45,55,65,75,85];
  else if(t.kind==='three-tens'){
    for(let v=111;v<=989;v++)if(v%10>=5&&v%10!==0)pool.push(v);
  }else if(t.kind==='three-hundreds'){
    for(let v=121;v<=949;v++)if(v%100>0&&v%100<50)pool.push(v);
  }else pool=pools[t.kind].filter(v=>v<95);
  let choices=pool.filter(v=>!used.has(v)&&!previous.includes(v));
  if(!choices.length)choices=pool.filter(v=>!used.has(v));
  const v=rand(choices),a=Math.round(v/t.u)*t.u;
  used.add(v);return {v,a,type:t.kind,unit:t.u,dir:t.dir};
 }
 templates.forEach(t=>answer.push(pick(t)));
 tasks=answer;
 obstacles=options.map((opts,i)=>rand(opts));for(let i=1;i<obstacles.length;i++){if(obstacles[i]===obstacles[i-1])obstacles[i]=options[i].find(o=>o!==obstacles[i-1])||obstacles[i]}
 try{progressStore.setItem(key,JSON.stringify(tasks.map(t=>t.v)))}catch(e){}
 return tasks;
}
const phaseFor=i=>{
 if(currentRoute==='majakas')return i<2?0:i<5?1:2;
 const drivingPhases=adventureStages[currentRoute]?4:3;
 return Math.min(drivingPhases-1,Math.floor(i*drivingPhases/tasks.length));
};
function setPhase(which,force=false){
 scenePhase=which;
 stage.dataset.phase=String(which);
 scenes.forEach((s,i)=>s.classList.toggle('active',i===which));
 updateStageLandmark();
 if(force)return;
 if(which===1)message(adventureStages[currentRoute]?'TEE JÄTKUB!':currentRoute==='mountain'?'MÄED PAISTAVAD!':currentRoute==='bridge'?'JÕGI PAISTAB!':currentRoute==='forest'?'SÜGAV METS!':'KALJUTEE!','neutral',1350);
 if(which>=2)message(adventureStages[currentRoute]?'SIHTKOHT LÄHENEB!':currentRoute==='mountain'?'MÄEKURU ON LÄHEDAL!':currentRoute==='bridge'?'JÕESILD ON LÄHEDAL!':currentRoute==='forest'?'METSAJAAM ON LÄHEDAL!':'MAJAKAS ON LÄHEDAL!','ok',1550);
}
function route(){ $('route').innerHTML=tasks.map((_,i)=>`<span class="dot ${i<index?'done':i===index?'current':''}" aria-hidden="true"></span>`).join(''); $('route').setAttribute('aria-label',`${Math.min(index+1,tasks.length)} / ${tasks.length}`)}
function feedback(t='',c=''){$('feedback').textContent=t;$('feedback').className='feedback '+c}
function message(t='',kind='',ms=1000){$('toast').textContent=t;$('toast').className='toast '+kind;toastEnd=t?performance.now()+ms:0}
function sound(f=600,secs=.1,vol=.017){if(!soundOn)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+secs);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+secs)}catch{}}
function showModal(html){$('modal').innerHTML=html;$('overlay').classList.add('open')}
function hideModal(){$('overlay').classList.remove('open')}
function cardSvg(type){
 const head=`<svg viewBox="0 0 260 166" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="orange" x2="0.2" y2="1"><stop stop-color="#ffe9ac"/><stop offset=".55" stop-color="#ff9c39"/><stop offset="1" stop-color="#d85b25"/></linearGradient><linearGradient id="stone" x2=".3" y2="1"><stop stop-color="#dfdccd"/><stop offset="1" stop-color="#6c7989"/></linearGradient><linearGradient id="truck" x2="0" y2="1"><stop stop-color="#ffe96f"/><stop offset="1" stop-color="#d87919"/></linearGradient></defs>`;
 const cone=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="29" rx="25" ry="7" fill="#1a3558" opacity=".3"/><path d="M-21 26L-9 -30Q0 -37 9 -30L21 26Z" fill="url(#orange)" stroke="#fff" stroke-width="2"/><path d="M-14 8H14L9 -2H-9Z" fill="#fff6e3"/><rect x="-26" y="22" width="52" height="12" rx="3" fill="#dd6926"/></g>`;
 if(type==='cones')return head+cone(60,97,1.05)+cone(132,77,1.3)+cone(207,107,.88)+'</svg>';
 if(type==='barricade')return `<img src="assets/asset-054.png" alt="">`;
 if(type==='rocks')return head+`<ellipse cx="130" cy="140" rx="118" ry="15" fill="#243248" opacity=".32"/><path d="M15 130L38 64 78 50 118 85 132 129Z" fill="url(#stone)" stroke="#edf2ed" stroke-width="3"/><path d="M83 133L109 41 155 27 206 74 220 132Z" fill="url(#stone)" stroke="#f7f4e1" stroke-width="4"/><path d="M184 140L211 93 246 105 256 141Z" fill="#8991a0"/><path d="M109 41L155 27 145 83Z" fill="#fcf6dc" opacity=".65"/>`+cone(25,111,.54)+'</svg>';
 if(type==='truck')return head+`<ellipse cx="133" cy="137" rx="108" ry="13" fill="#162e4d" opacity=".4"/><rect x="40" y="62" width="166" height="67" rx="13" fill="url(#truck)" stroke="#ffeec0" stroke-width="4"/><rect x="58" y="78" width="122" height="38" rx="3" fill="#ffede1"/><path d="M58 78L95 116H123L86 78M122 78L159 116H179L143 78" fill="#ee4e32"/><rect x="20" y="47" width="31" height="49" rx="8" fill="#ffcf58"/><circle cx="31" cy="137" r="14" fill="#20324e"/><circle cx="189" cy="137" r="14" fill="#20324e"/><circle cx="31" cy="137" r="6" fill="#a8cadb"/><circle cx="189" cy="137" r="6" fill="#a8cadb"/><circle cx="60" cy="58" r="10" fill="#ffea67"/><circle cx="191" cy="58" r="10" fill="#ffea67"/>`+'</svg>';
 if(type==='logs')return head+`<ellipse cx="127" cy="132" rx="117" ry="19" fill="#183750" opacity=".3"/><g stroke="#82401e" stroke-width="5"><rect x="22" y="85" width="221" height="36" rx="18" fill="#b16f34" transform="rotate(-7 130 103)"/><rect x="18" y="100" width="212" height="33" rx="16" fill="#d28a44" transform="rotate(6 118 117)"/><rect x="42" y="73" width="204" height="31" rx="15" fill="#e0a25a" transform="rotate(2 145 88)"/></g><circle cx="221" cy="90" r="16" fill="#e3ae6c" stroke="#83451f" stroke-width="4"/><circle cx="221" cy="90" r="7" fill="#d28941" stroke="#894a1e"/>`+'</svg>';
 if(type==='water')return head+`<ellipse cx="130" cy="123" rx="118" ry="32" fill="#167dbe" opacity=".88" stroke="#b9faff" stroke-width="4"/><path d="M33 121Q61 98 92 117T155 113T223 118" fill="none" stroke="#d9f9ff" stroke-width="8" stroke-linecap="round"/><path d="M69 137Q102 125 141 137T203 135" fill="none" stroke="#71e7ff" stroke-width="6"/><path d="M85 99l14 -16 12 18M166 102l10 -20 13 22" fill="#9af6ff"/>`+'</svg>';
 if(type==='gate')return head+`<rect x="25" y="35" width="19" height="112" rx="7" fill="#dbe6eb" stroke="#6e7c8e" stroke-width="4"/><rect x="220" y="35" width="19" height="112" rx="7" fill="#dbe6eb" stroke="#6e7c8e" stroke-width="4"/><rect x="26" y="49" width="211" height="36" rx="8" fill="#f4f5eb" stroke="#d7a94a" stroke-width="4"/><path d="M28 80L56 49H89L60 85M110 84L140 49H173L144 84M190 84L219 49H238L211 84" fill="#ef4b37"/><circle cx="35" cy="28" r="12" fill="#ffde52"/><circle cx="230" cy="28" r="12" fill="#ffde52"/>`+'</svg>';
 return head+'</svg>';
}
function obstacle(){barrier.innerHTML=cardSvg(obstacles[index]);barrier.setAttribute('data-type',obstacles[index]);}
function updateAnswer(){ $('typed').textContent=fmt(typed);$('answer').classList.toggle('iswrong',wrongMarked);$('answer').classList.toggle('isright',state==='dodging');$('caret').style.display=state==='driving'?'inline-block':'none'}


/* Lighthouse reward v7 – auto-run cinematic sequence, separate from approved race. */
const rewardShell=$('rewardShell'),rewardArt=$('rewardArt');
let rewardStep='none',rewardTimer=0,pan=.06,seenPan=false,dragging=false,dragStartX=0,panStart=0,cinemaPrev=null;
const rewardStorageKey='edukass-majakas-postkaart-v1';
const forestFinishImage='assets/asset-013.jpeg';
const forestFrontScene='assets/asset-014.jpeg';
const forestSideScene='assets/asset-015.jpeg';
const forestBridgeScene='assets/asset-016.jpeg';
const forestCleanPanorama='assets/asset-055.jpeg';
const forestPostcardV21='assets/asset-056.jpeg';
const forestBridgeCleanV21='assets/asset-057.jpeg';
const bridgePostcardV22='assets/asset-058.jpeg';
const bridgeMountainV22='assets/asset-059.jpeg';
const bridgeBinocularV22='assets/asset-060.png';
const originalPostcardImage=document.querySelector('.reward-postcard-frame img').src;

const v21MapPics=document.querySelectorAll('#fwMap .fw-map-stop .pic');
if(v21MapPics.length>=3){
  for(const [i,source] of [[0,originalPostcardImage],[1,forestPostcardV21],[2,forestBridgeCleanV21]]){
    const image=document.createElement('img');image.src=source;image.alt='';
    v21MapPics[i].replaceChildren(image);
  }
}


const mountainGateV28='assets/asset-061.jpeg';
const mountainVisitV28='assets/asset-062.jpeg';
const mountainScopeV28='assets/asset-063.jpeg';
const mountainRevealV28='assets/asset-064.jpeg';
const mountainPostcardV28='assets/asset-065.jpeg';

const adventureNames=['MAJAKAS','METSAJAAM','JÕESILD','MÄEKURU','JÄRVEÄÄR','VESIVESKI','VANALINN','TÄHETORN','PÄIKESELOSS'];
const adventureSlugs=['majakas','forest','bridge','mountain','lake','mill','town','observatory','castle'];
const adventureStages={
 lake:{index:5,name:'JÄRVEÄÄR',next:'mill',views:['assets/original-19.webp', 'assets/original-29.webp', 'assets/original-13.webp'],postcard:'assets/original-32.webp'},
 mill:{index:6,name:'VESIVESKI',next:'town',views:['assets/original-01.webp', 'assets/original-41.webp', 'assets/original-28.webp'],postcard:'assets/original-31.webp'},
 town:{index:7,name:'VANALINN',next:'observatory',views:['assets/original-39.webp', 'assets/original-37.webp', 'assets/original-38.webp'],postcard:'assets/original-40.webp'},
 observatory:{index:8,name:'TÄHETORN',next:'castle',views:['assets/observatory-entrance.webp','assets/observatory-interior.webp','assets/observatory-terrace.webp'],postcard:'assets/observatory-garden.webp'},
 castle:{index:9,name:'PÄIKESELOSS',next:null,views:['assets/original-10.webp', 'assets/original-30.webp', 'assets/original-06.webp'],postcard:'assets/original-08.webp'},
};

// Methodical progression: each new place value is introduced in only a few
// tasks, then consolidated at the next station. Number length still varies.
const adventureUnitPlans={
 // Level 5: hundreds and thousands; ten-thousands appear only in the final two tasks.
 lake:[100,1000,1000,100,1000,1000,1000,1000,1000,1000,10000,10000],
 // Level 6: thousands support the new main skill — ten-thousands.
 mill:[1000,10000,1000,10000,10000,1000,10000,10000,1000,10000,10000,10000],
 // Level 7: hundred-thousands are introduced only in the final two tasks.
 town:[1000,10000,10000,1000,10000,10000,10000,10000,10000,10000,100000,100000],
 // Level 8: ten-thousands remain in the mix while hundred-thousands become the focus.
 observatory:[10000,100000,10000,100000,100000,10000,100000,100000,10000,100000,100000,100000],
 // Level 9: a short, gentle introduction to rounding to one million at the end.
 castle:[10000,100000,100000,10000,100000,100000,100000,100000,100000,1000000,1000000,1000000]
};
const routeNumberLimits={lake:99999,mill:399999,town:999999,observatory:3999999,castle:9999999};
const newRoundingUnits={lake:10000,town:100000,castle:1000000};
function makeAdventureTasks(slug){
 const units=adventureUnitPlans[slug];if(!units||units.length!==12)throw Error('No 12-task plan: '+slug);
 const key='edukass-v33-last-'+slug;let previous=[];
 try{previous=JSON.parse(progressStore.getItem(key)||'[]')}catch(e){}
 const used=new Set();
 const dirs=['down','up','half','down','up','carry','down','up','half','down','up','carry'];
 const introductoryUnit=newRoundingUnits[slug];
 const firstIntroduction=units.indexOf(introductoryUnit);
 tasks=units.map((u,i)=>{
  const place=Math.round(Math.log10(u));
  const variation=(i+adventureStages[slug].index)%units.length;
  const extraDigits=[1,2,1,3,2,1,2,3,1,2,3,2][variation];
  let ceiling=routeNumberLimits[slug];
  if(i<3&&slug==='mill')ceiling=99999;
  if(i<3&&slug==='observatory')ceiling=999999;
  let dir=dirs[variation];
  if(u===introductoryUnit){
   ceiling=4*u-1;
   dir=['down','up','half'][i-firstIntroduction];
  }
  const digits=Math.min(String(ceiling).length,Math.max(3,place+extraDigits,slug==='lake'&&i===0?4:3));
  const lo=10**(digits-1),hi=Math.min(10**digits-1,ceiling);
  // Construct a valid residue directly: avoids near-impossible random hits
  // for halfway values at large rounding units and slow billion-step scans.
  let v=null;
  const minQ=Math.ceil((lo-(u-1))/u), maxQ=Math.floor(hi/u);
  for(let t=0;t<500;t++){
   const q=minQ+Math.floor(Math.random()*(maxQ-minQ+1));
   const half=u/2;
   let residue;
   if(dir==='half')residue=half;
   else if(dir==='down')residue=1+Math.floor(Math.random()*Math.max(1,half-1));
   else residue=half+Math.floor(Math.random()*half);
   if(dir==='carry' && (q+1)%10!==0)continue;
   const n=q*u+residue;
   if(n>=lo&&n<=hi&&!used.has(n)&&!previous.includes(n)){v=n;break}
  }
  if(v===null){
   for(let q=minQ;q<=maxQ;q++){
    if(dir==='carry'&&(q+1)%10!==0)continue;
    const residue=dir==='half'?u/2:dir==='down'?1:u/2;
    const n=q*u+residue;
    if(n>=lo&&n<=hi&&!used.has(n)){v=n;break}
   }
  }
  if(v===null)throw Error('Unable to generate '+slug+' exercise '+i);
  used.add(v);
  return {v,a:Math.floor((v+u/2)/u)*u,unit:u,type:dir,dir};
 });
 const kinds=['rocks','logs','gate','water','rocks','gate','logs','rocks','gate','water','logs','rocks'];
 obstacles=kinds.slice(0,tasks.length);
 try{progressStore.setItem(key,JSON.stringify(tasks.map(t=>t.v)))}catch(e){}
 return tasks;
}
function adventureGoal(task,i){return 17.5+Math.max(0,String(task.a).length-3)*5.7+(i>=9?1.5:0)}
function startAdventureRoute(slug){if(!adventureStages[slug])throw Error('Unknown destination '+slug);chooseRoute(slug)}
let advIndex=0,advGrab=null;
function advDraw(){
 const s=adventureStages[currentRoute];if(!s)return;
 const src=s.views[Math.max(0,Math.min(s.views.length-1,advIndex))];
 $('advScene').src=src;$('advGallery').style.setProperty('--adv-photo',`url('${src}')`);
 $('advAtmosphere').style.backgroundImage=`url('${src}')`;
 $('advSign').textContent=s.name;
 $('advLeft').disabled=advIndex===0;$('advRight').disabled=advIndex===s.views.length-1;
 $('advDots').innerHTML=s.views.map((_,i)=>`<span class="${i<advIndex?'seen':i===advIndex?'active':''}"></span>`).join('');
 $('advSpy').hidden=advIndex!==s.views.length-1;
 // Preview the NEXT station through binoculars; final stop shows its own postcard.
 $('advSpyImage').src=bridgeBinocularV22;
 $('advSpyImage').alt='Binokkel';
 $('advReveal').hidden=true;
}
function advSetIndex(next){advIndex=Math.max(0,Math.min(adventureStages[currentRoute].views.length-1,next));advDraw()}
function advWorldEnter(step){
 const s=adventureStages[currentRoute];if(!s)return;
 if(step==='adventure-visit'){advIndex=0;advDraw()}
 else if(step==='adventure-reveal'){
  $('advSpy').hidden=true;
  const isFinal=s.index===9;
  $('advSign').textContent=s.name;
  $('advRevealTitle').textContent=isFinal?'PÄIKESELOSS':adventureStages[s.next].name;
  $('advNextImage').src=isFinal?s.postcard:adventureStages[s.next].postcard;
  $('advReveal').hidden=false;
 }
}
function earnedCards(){
 const aliases={metsajaam:'forest',joesild:'bridge',maekuru:'mountain'};let cards=[];
 try{cards=JSON.parse(progressStore.getItem('edukass-rounding-postcards-v1')||'[]');if(!Array.isArray(cards))cards=[];
 if(progressStore.getItem(rewardStorageKey)==='1')cards.push('majakas');
 for(const [key,id] of [['edukass-metsajaam-complete-v12','forest'],['edukass-joesild-complete-v1','bridge'],['edukass-maekuru-complete-v1','mountain']])if(progressStore.getItem(key)==='1')cards.push(id);
 }catch(e){}
 return [...new Set(cards.map(id=>aliases[id]||id).filter(id=>adventureSlugs.includes(id)))];
}
function earnCard(id){try{progressStore.setItem('edukass-rounding-postcards-v1',JSON.stringify([...new Set([...earnedCards(),id])]))}catch(e){}}
function nextSavedRoute(){const cards=earnedCards();return adventureSlugs.find(id=>!cards.includes(id))||'majakas'}
function showSavedCard(src,name){let d=$('savedCardDialog');if(!d){d=document.createElement('dialog');d.id='savedCardDialog';document.body.appendChild(d)}d.innerHTML=`<h2>${name}</h2><img src="${src}" alt="${name}"><button type="button">SULGE</button>`;d.querySelector('button').onclick=()=>d.close();d.showModal()}
function saveAdventurePostcard(){
 const s=adventureStages[currentRoute];
 earnCard(currentRoute);
 document.querySelector('.postcard-name').textContent=s.name;
 document.querySelector('.reward-postcard-frame img').src=s.postcard;
}
$('advLeft').onclick=()=>advSetIndex(advIndex-1);
$('advRight').onclick=()=>advSetIndex(advIndex+1);
// The binoculars show the actual next destination, never a reused bridge.
$('advSpyImage').src=bridgeBinocularV22;
$('advSpy').onclick=()=>rewardOpen('adventure-reveal');
let scopeDrag=null;
const scopePhoto=document.querySelector('.adv-reveal-photo');
scopePhoto.onpointerdown=e=>{scopeDrag=e.clientX;scopePhoto.setPointerCapture(e.pointerId)};
scopePhoto.onpointermove=e=>{if(scopeDrag===null)return;const delta=e.clientX-scopeDrag;scopePhoto.style.setProperty('--scope-x',Math.max(-30,Math.min(0,-16+delta/8))+'%')};
scopePhoto.onpointerup=scopePhoto.onpointercancel=()=>scopeDrag=null;
$('advTakeCard').onclick=()=>rewardOpen('adventure-postcard');
$('advGallery').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;advGrab={id:e.pointerId,x:e.clientX};try{$('advGallery').setPointerCapture(e.pointerId)}catch(e){}});
$('advGallery').addEventListener('pointerup',e=>{if(!advGrab||advGrab.id!==e.pointerId)return;const dx=e.clientX-advGrab.x;advGrab=null;if(Math.abs(dx)>35)advSetIndex(advIndex+(dx<0?1:-1))});
$('advGallery').addEventListener('pointercancel',()=>advGrab=null);
document.addEventListener('keydown',e=>{if(rewardStep==='adventure-visit'&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();advSetIndex(advIndex+(e.key==='ArrowRight'?1:-1))}});

function renderCanonicalMap(step){
 const earned=earnedCards(),count=earned.length,next=nextSavedRoute();
 const thumbs=[originalPostcardImage,forestPostcardV21,bridgePostcardV22,mountainPostcardV28,...['lake','mill','town','observatory','castle'].map(s=>adventureStages[s].postcard)];
 const blocks=adventureNames.map((name,i)=>`<div class="fw-map-stop ${earned.includes(adventureSlugs[i])?'done':adventureSlugs[i]===next?'next':'locked'}"><span class="pic"><img src="${thumbs[i]}" alt="${name}"></span><b>${name}${earned.includes(adventureSlugs[i])?' ✓':''}</b></div>`);
 const cards=thumbs.map((src,i)=>`<button type="button" data-card="${i}" ${earned.includes(adventureSlugs[i])?'':'disabled'} class="fw-mini-card ${earned.includes(adventureSlugs[i])?'done':'locked'}">${earned.includes(adventureSlugs[i])?`<img src="${src}" alt="${adventureNames[i]}">`:'<div class="fw-card-locked">✦</div>'}<span>${String(i+1).padStart(2,'0')}/09</span></button>`);
 $('fwMap').innerHTML=`<div class="fw-map-head">MINU TEEKOND</div><div class="fw-map-count">${count} / 9</div><div class="fw-map-track">${blocks.join('')}</div><div class="fw-album"><div class="fw-album-head">POSTKAARDID · ${count} / 9</div><div class="fw-card-strip">${cards.join('')}</div></div><div class="fw-map-lock">${count<9?adventureNames[adventureSlugs.indexOf(next)]+' · järgmine peatus':'KÕIK 9 PEATUST LÄBITUD!'}</div>`;
 $('fwMap').querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>showSavedCard(thumbs[+b.dataset.card],adventureNames[+b.dataset.card]));
}

function rewardSetTimeout(fn,delay){clearTimeout(rewardTimer);rewardTimer=setTimeout(fn,reduced?90:delay)}
function rewardClean(){
 forestSeenFront=false;forestSeenSide=false;forestPan=50;forestPointer=null;fwReset();bwReset();mwReset();
 if(currentRoute==='majakas'){document.querySelector('.postcard-name').textContent='MAJAKAS';document.querySelector('.reward-postcard-frame img').src=originalPostcardImage;}
 clearTimeout(rewardTimer);rewardTimer=0;rewardStep='none';rewardShell.hidden=true;rewardShell.style.display='';
 document.querySelector('.layout').classList.remove('reward-mode');rewardArt.className='reward-art arrival';
 document.querySelectorAll('.cinema-shot').forEach(el=>el.classList.remove('on','out'));
 cinemaPrev=null;$('rewardSecondary').hidden=true;
 updateStageLandmark();
}
function rewardShot(step){
 const next=document.querySelector('.cinema-shot.'+step);if(!next)return;
 if(cinemaPrev&&cinemaPrev!==next){const old=cinemaPrev;old.classList.remove('on');old.classList.add('out');setTimeout(()=>old.classList.remove('out'),900)}
 next.classList.remove('out');next.classList.add('on');cinemaPrev=next;
}
function rewardOpen(step){
 const stationName=adventureNames[adventureSlugs.indexOf(currentRoute)];
 rewardShell.setAttribute('aria-label',stationName+' · avastamine');
 document.querySelector('.reward-postcard-frame img').alt=stationName+' · postkaart';
 clearTimeout(checkTimeout);clearTimeout(transitionTimeout);clearTimeout(rewardTimer);clearTimeout(wrongFlashTimer);
 state='reward';rewardStep=step;dragging=false;updateStageLandmark();
 document.querySelector('.layout').classList.add('reward-mode');rewardShell.hidden=false;rewardShell.style.display='flex';
 rewardArt.className='reward-art '+step;rewardShot(step);
 if(step.startsWith('forest-'))fwWorldEnter(step);
 if(step.startsWith('bridge-'))bwWorldEnter(step);
 if(step.startsWith('mountain-'))mwWorldEnter(step);
 if(step==='adventure-visit'||step==='adventure-reveal')advWorldEnter(step);
 const title=$('rewardTitle'),desc=$('rewardDesc'),primary=$('rewardPrimary'),secondary=$('rewardSecondary'),skip=$('rewardSkip');
 title.textContent='';desc.textContent='';primary.hidden=true;primary.disabled=false;secondary.hidden=true;skip.hidden=true;
 if(step==='panorama'){
   title.textContent='JÕUDSID MAJAKANI!';desc.textContent='Vaata, milline meri!';
   pan=.47;rewardPanTo(pan);
   // A short landing moment, followed by free look-around and an automatic reward.
   rewardSetTimeout(()=>{if(rewardStep==='panorama'){
     title.textContent='VAADE MERELE';desc.textContent='Vaata ringi — kus on Metsajaam?';
     rewardSetTimeout(()=>{if(rewardStep==='panorama'){
       rewardPanTo(.87);rewardArt.classList.add('found');
       rewardSetTimeout(()=>rewardOpen('teaser'),1600);
     }},6500);
   }},1650);
 }else if(step==='teaser'){
   title.textContent='🌲 METSAJAAM';desc.textContent='Mis peitub metsa sees?';
   rewardSetTimeout(()=>rewardPhoto(),3300);
 }else if(step==='postcard'){
   earnCard('majakas');
   try{progressStore.setItem(rewardStorageKey,'1')}catch(e){}
   title.textContent='SINU POSTKAART!';desc.textContent='Majaka mälestus on sinu kogus.';
   primary.hidden=false;primary.textContent='VAATA KAARTI ›';primary.onclick=()=>rewardOpen('map');
   rewardSetTimeout(()=>rewardOpen('map'),6500);
 }else if(step==='map'){
   title.textContent='MAJAKAS AVASTATUD!';desc.textContent='Järgmine peatus on Metsajaam.';
   primary.hidden=false;primary.textContent='🌲 ALUSTA METSAJAAMA SÕITU';primary.onclick=startForestRoute;
   secondary.hidden=false;secondary.textContent='SÕIDA UUESTI';secondary.onclick=()=>intro();
 }else if(step==='teaser-map'){
   title.textContent='🌲 METSAJAAM';desc.textContent='Oled valmis uueks teekonnaks?';
   primary.hidden=false;primary.textContent='🌲 ALUSTA METSAJAAMA SÕITU';primary.onclick=startForestRoute;
   secondary.hidden=false;secondary.textContent='SÕIDA UUESTI';secondary.onclick=()=>intro();
   rewardArt.className='reward-art teaser';rewardShot('teaser');
 }else if(step==='forest-front'||step==='forest-side'){
   if(step==='forest-front')forestSeenFront=true;else forestSeenSide=true;
   forestPan=50;
   const img=document.querySelector('.cinema-shot.'+step+' .film-img');
   img.style.backgroundPosition='50% 50%';
   forestUpdateControls();
 }else if(step==='forest-reveal'){
   title.textContent='🔭 KOLMAS SIHT LEITUD!';
   desc.textContent='JÕESILD — järgmine peatus!';
   primary.hidden=false;primary.textContent='SALVESTA METSAJAAM ›';primary.onclick=()=>rewardOpen('forest-finish');
   secondary.hidden=false;secondary.textContent='VAATA MAJA VEEL';secondary.onclick=()=>rewardOpen('forest-side');
 }else if(step==='forest-finish'){
   try{progressStore.setItem('edukass-metsajaam-complete-v12','1');let a=JSON.parse(progressStore.getItem('edukass-rounding-postcards-v1')||'[]');a=[...new Set([...a,'forest'])];progressStore.setItem('edukass-rounding-postcards-v1',JSON.stringify(a))}catch(e){}
   document.querySelector('.postcard-name').textContent='METSAJAAM';
   document.querySelector('.reward-postcard-frame img').src=forestPostcardV21;
   title.textContent='';desc.textContent='';
   primary.hidden=false;primary.textContent='🗺️ KAART ›';primary.onclick=()=>rewardOpen('forest-map');
   secondary.hidden=true;secondary.onclick=()=>intro();
 }else if(step==='forest-map'){
   title.textContent='';desc.textContent='';renderCanonicalMap(2);
   primary.hidden=false;primary.textContent='🌉 SÕIDA JÕESILLANI ›';primary.onclick=startBridgeRoute;
   secondary.hidden=false;secondary.textContent='✉️ POSTKAART';secondary.onclick=()=>rewardOpen('forest-finish');
 }else if(step==='bridge-visit'){
   // The bridge station is an interactive panoramic world; all controls are in the picture.
 }else if(step==='bridge-reveal'){
   // Only the distant next target is revealed here; the Jõesild postcard is earned afterward.
 }else if(step==='bridge-postcard'){
   try{progressStore.setItem('edukass-joesild-complete-v1','1');let a=JSON.parse(progressStore.getItem('edukass-rounding-postcards-v1')||'[]');a=[...new Set([...a,'bridge'])];progressStore.setItem('edukass-rounding-postcards-v1',JSON.stringify(a))}catch(e){}
   document.querySelector('.postcard-name').textContent='JÕESILD';
   document.querySelector('.reward-postcard-frame img').src=bridgePostcardV22;
   primary.hidden=false;primary.textContent='🗺️ KAART ›';primary.onclick=()=>rewardOpen('bridge-map');
 }else if(step==='bridge-map'){
   renderCanonicalMap(3);
   primary.hidden=false;primary.textContent='🏔️ SÕIDA MÄEKURUSSE ›';primary.onclick=startMountainRoute;
   secondary.hidden=false;secondary.textContent='✉️ POSTKAART';secondary.onclick=()=>rewardOpen('bridge-postcard');
 }else if(step==='mountain-visit'){
 }else if(step==='mountain-scope'){
 }else if(step==='mountain-reveal'){
 }else if(step==='mountain-postcard'){
   try{progressStore.setItem('edukass-maekuru-complete-v1','1');let a=JSON.parse(progressStore.getItem('edukass-rounding-postcards-v1')||'[]');a=[...new Set([...a,'mountain'])];progressStore.setItem('edukass-rounding-postcards-v1',JSON.stringify(a))}catch(e){}
   document.querySelector('.postcard-name').textContent='MÄEKURU';
   document.querySelector('.reward-postcard-frame img').src=mountainPostcardV28;
   primary.hidden=false;primary.textContent='🗺️ KAART ›';primary.onclick=()=>rewardOpen('mountain-map');
 }else if(step==='mountain-map'){
   renderCanonicalMap(4);
   primary.hidden=false;primary.textContent='SÕIDA JÄRVEÄÄRDE ›';primary.onclick=()=>startAdventureRoute('lake');
   secondary.hidden=false;secondary.textContent='✉️ POSTKAART';secondary.onclick=()=>rewardOpen('mountain-postcard');
 }else if(step==='adventure-visit'||step==='adventure-reveal'){
   // All controls are on the interactive station scene.
 }else if(step==='adventure-postcard'){
   saveAdventurePostcard();
   primary.hidden=false;primary.textContent='KAART ›';primary.onclick=()=>rewardOpen(adventureStages[currentRoute].index===9?'adventure-finale':'adventure-map');
 }else if(step==='adventure-map'||step==='adventure-finale'){
   const s=adventureStages[currentRoute];renderCanonicalMap(s.index);
   if(s.next){primary.hidden=false;primary.textContent='SÕIDA EDASI ›';primary.onclick=()=>startAdventureRoute(s.next)}
   else{primary.hidden=false;primary.textContent='ALUSTA UUESTI ↻';primary.onclick=returnToMajakas}
   secondary.hidden=false;secondary.textContent='POSTKAART';secondary.onclick=()=>rewardOpen('adventure-postcard');
 }
 if(['panorama','teaser'].includes(step)){
   skip.hidden=false;skip.textContent='JÄTA VAHELE ›';skip.onclick=()=>rewardPhoto();
 }
}
function rewardPhoto(){try{progressStore.setItem(rewardStorageKey,'1')}catch(e){}rewardOpen('postcard')}
function rewardPanTo(next){
 pan=Math.min(1,Math.max(0,next));const el=$('cinemaPan'),area=rewardArt;
 const h=area.clientHeight||500,w=area.clientWidth||340;
 const natural=el.naturalWidth&&el.naturalHeight?el.naturalWidth/el.naturalHeight:1.78;
 const width=Math.max(h*natural*1.05,w*2.45);
 el.style.width=width+'px';el.style.height='100%';el.style.transform='translate3d('+(-Math.max(0,width-w)*pan)+'px,0,0)';
 seenPan=pan>.60;rewardArt.classList.toggle('found',seenPan);
}
function rewardLook(diff){if(rewardStep==='panorama'){rewardPanTo(pan+diff);rewardSetTimeout(()=>rewardOpen('teaser'),3300)}}
$('lookLeft').onclick=()=>rewardLook(-.16);$('lookRight').onclick=()=>rewardLook(.16);
$('cinemaTelescope').onclick=()=>{if(rewardStep==='panorama'){rewardPanTo(.9);rewardSetTimeout(()=>rewardOpen('teaser'),1500)}};
$('cinemaNext').onclick=()=>{if(rewardStep==='panorama')rewardOpen('teaser')};
$('rewardNext').onclick=()=>{if(rewardStep==='panorama')rewardOpen('teaser')};
$('rewardMapGo').onclick=()=>{if(rewardStep==='map'||rewardStep==='teaser-map')startForestRoute()};
rewardArt.addEventListener('pointerdown',e=>{if(rewardStep!=='panorama'||e.target.closest('button'))return;dragging=true;dragStartX=e.clientX;panStart=pan;rewardArt.setPointerCapture(e.pointerId)});
rewardArt.addEventListener('pointermove',e=>{if(dragging)rewardPanTo(panStart+(dragStartX-e.clientX)/Math.max(200,rewardArt.clientWidth*1.65))});
rewardArt.addEventListener('pointerup',()=>{if(dragging){dragging=false;rewardSetTimeout(()=>rewardOpen('teaser'),2800)}});
rewardArt.addEventListener('pointercancel',()=>dragging=false);
document.addEventListener('keydown',e=>{if(rewardStep==='panorama'&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();rewardLook(e.key==='ArrowRight'?.14:-.14)}});
window.addEventListener('resize',()=>{if(rewardStep==='panorama')rewardPanTo(pan)});


/* Forest station: two genuinely selectable viewpoints, draggable look-around,
   and a third destination only once BOTH viewpoints have been visited. */
let forestSeenFront=false,forestSeenSide=false,forestPan=50,forestPointer=null;
function forestUpdateControls(){
 const front=rewardStep==='forest-front';
 $('forestLookFront').setAttribute('aria-pressed',String(front));
 $('forestLookSide').setAttribute('aria-pressed',String(!front));
 $('forestLookFront').innerHTML='‹ VAATA EEST <small>Maja esikülg</small>';
 $('forestLookSide').innerHTML='VAATA KÕRVALT › <small>Maja teine külg</small>';
 $('forestSeenFront').textContent=(forestSeenFront?'✓ ':'○ ')+'EEST';
 $('forestSeenSide').textContent=(forestSeenSide?'✓ ':'○ ')+'KÕRVALT';
 $('forestSeenFront').classList.toggle('visited',forestSeenFront);
 $('forestSeenSide').classList.toggle('visited',forestSeenSide);
 $('forestDiscover').classList.toggle('unlocked',forestSeenFront&&forestSeenSide);
 const title=$('rewardTitle'),desc=$('rewardDesc');
 title.textContent=front?'🌲 METSAJAAM · EEST':'🌲 METSAJAAM · KÕRVALT';
 desc.textContent=forestSeenFront&&forestSeenSide?'Mõlemad küljed vaadatud! Otsi nüüd kolmas siht.':
   'Vaata maja mõlemalt poolt — vajuta nuppe või libista pilti.';
}
function forestLookPan(n){
 forestPan=Math.max(16,Math.min(84,n));
 const shot=document.querySelector('.cinema-shot.'+rewardStep+' .film-img');
 if(shot)shot.style.backgroundPosition=forestPan+'% 50%';
}
function forestVisit(side){
 if(!['forest-front','forest-side'].includes(rewardStep))return;
 if(side==='front')rewardOpen('forest-front');else rewardOpen('forest-side');
}
$('forestLookFront').onclick=()=>forestVisit('front');
$('forestLookSide').onclick=()=>forestVisit('side');
$('forestDiscover').onclick=()=>{if(forestSeenFront&&forestSeenSide&&['forest-front','forest-side'].includes(rewardStep))rewardOpen('forest-reveal')};
rewardArt.addEventListener('pointerdown',e=>{
 if(!['forest-front','forest-side'].includes(rewardStep)||e.target.closest('#forestWorld')||e.target.closest('button'))return;
 forestPointer={id:e.pointerId,x:e.clientX,pan:forestPan,moved:false};
 try{rewardArt.setPointerCapture(e.pointerId)}catch(_){}
});
rewardArt.addEventListener('pointermove',e=>{
 if(!forestPointer||e.pointerId!==forestPointer.id)return;
 const dx=e.clientX-forestPointer.x;
 forestPointer.moved=forestPointer.moved||Math.abs(dx)>7;
 if(forestPointer.moved)forestLookPan(forestPointer.pan-dx/Math.max(4,rewardArt.clientWidth/31));
});
rewardArt.addEventListener('pointerup',e=>{
 if(!forestPointer||forestPointer.id!==e.pointerId)return;
 const dx=e.clientX-forestPointer.x,moved=forestPointer.moved;
 forestPointer=null;
 // A broad swipe walks around the cabin; a small drag pans the camera.
 if(Math.abs(dx)>65){forestVisit(rewardStep==='forest-front'?'side':'front')}
 else if(!moved&&e.target.closest('.cinema-shot')){forestVisit(rewardStep==='forest-front'?'side':'front')}
});
rewardArt.addEventListener('pointercancel',()=>forestPointer=null);
/* old forest key navigation replaced by cinematic panorama v18 */


// v18 scenic camera for Metsajaam. The driving, arithmetic and lighthouse code are untouched.
let fwIndex=0,fwScopePan=0,fwDragging=null,fwScopeDragging=null,fwIsOn=false;
const fwScenes=[
  {source:'front',pan:.08,tag:'METSAJAAM'},
  {source:'front',pan:.34,tag:'METSAJAAM'},
  {source:'front',pan:.88,tag:'METSAJAAM'},
  {source:'front',pan:.51,tag:'METSAJAAM'}
];
function fwReset(){fwIsOn=false;fwIndex=0;fwScopePan=0;$('fwScope').hidden=true;$('fwFinish').hidden=true;}
function fwWorldEnter(step){
 const world=$('forestWorld');
 if(!['forest-front','forest-side','forest-reveal'].includes(step)){world.hidden=true;return;}
 world.hidden=false;
 if(!fwIsOn){
   $('fwFrontImg').src=forestCleanPanorama;
   $('fwSideImg').src=forestSideScene;
   $('fwBridgeImg').src=forestBridgeCleanV21;
   $('fwLensImage').src=forestBridgeCleanV21;
   $('fwAmbient').style.backgroundImage='url('+forestCleanPanorama+')';
   fwIsOn=true;fwIndex=0;
 }
 if(step==='forest-reveal')fwDrawFinish();else fwDrawScene(true);
}
function fwPlaceImage(img,pan,view){
 if(!img||!view)return;
 const w=view.clientWidth,h=view.clientHeight;
 // Scenery is a carefully cleaned 1440×516 panorama: never enlarge the blurry side image.
 const ratio=img.id==='fwFrontImg'?1440/516:img.id==='fwBridgeImg'?1440/816:1440/940;
 const ih=img.id==='fwFrontImg'?h*.96:h*1.05;
 const iw=ih*ratio;
 const max=Math.max(0,iw-w);
 img.style.height=ih+'px';img.style.width=iw+'px';img.style.top=(h-ih)*.5+'px';
 img.style.transform='translate3d('+(-max*pan)+'px,0,0)';
}
function fwDrawScene(force){
 if(!$('forestWorld')||!fwIsOn)return;
 const scene=fwScenes[fwIndex],view=$('fwPhoto');
 if(!view.clientHeight)return;
 fwPlaceImage($('fwFrontImg'),scene.pan,view);
 fwPlaceImage($('fwSideImg'),.04,view);
 $('fwFrontImg').style.opacity='1';
 $('fwSideImg').style.opacity='0';
 $('fwBridgeImg').style.opacity='0';
 $('fwPhotoTag').textContent=scene.tag;
 $('fwTrailTitle').textContent='';
 $('fwNarration').textContent='';
 $('fwPrev').disabled=fwIndex===0;$('fwPrev').style.visibility='visible';
 $('fwNext').disabled=fwIndex===fwScenes.length-1;$('fwNext').style.visibility='visible';
 Array.from($('fwTimeline').children).forEach((el,i)=>{el.classList.toggle('seen',i<fwIndex);el.classList.toggle('active',i===fwIndex)});
 $('fwTelescope').hidden=true; // Physical binocular is now directly tappable in the picture.
 $('fwSoftHint').hidden=true;
 $('forestWorld').classList.toggle('scope-ready',fwIndex===fwScenes.length-1);
 fwPlaceHotspot();
 $('fwScope').hidden=true;$('fwFinish').hidden=true;
}
function fwPlaceHotspot(){
 const spot=$('fwHotspot'),view=$('fwPhoto');if(!spot||!view)return;
 const h=view.clientHeight,w=view.clientWidth,ih=h*.96,iw=ih*(1440/516),max=Math.max(0,iw-w);
 const x=680*(iw/1440)-max*fwScenes[fwIndex].pan;
 const y=(511-166)*(ih/516)+(h-ih)*.5;
 spot.style.left=x+'px';spot.style.top=y+'px';
}
$('fwHotspot').onclick=()=>{if(fwIndex===fwScenes.length-1)fwOpenScope()};
function fwSetIndex(index){if(!fwIsOn)return;fwIndex=Math.max(0,Math.min(fwScenes.length-1,index));fwDrawScene();}
$('fwPrev').onclick=()=>fwSetIndex(fwIndex-1);
$('fwNext').onclick=()=>fwSetIndex(fwIndex+1);
function fwStartPointer(e){
 if(e.target.closest('button')||$('fwScope').hidden===false)return;
 fwDragging={id:e.pointerId,x:e.clientX,y:e.clientY};
 try{$('fwPhoto').setPointerCapture(e.pointerId)}catch(_){}
}
$('fwPhoto').addEventListener('pointerdown',fwStartPointer);
$('fwPhoto').addEventListener('pointermove',e=>{
 if(!fwDragging||e.pointerId!==fwDragging.id)return;
 const dx=e.clientX-fwDragging.x;
 if(Math.abs(dx)<5)return;
 const current=fwScenes[fwIndex];
 const img=$('fwFrontImg');
 const view=$('fwPhoto'),ih=view.clientHeight*.96,iw=ih*(1440/516),max=Math.max(0,iw-view.clientWidth);
 const temporary=Math.max(0,Math.min(1,current.pan-dx/Math.max(max,160)));
 img.style.transition='none';
 fwPlaceImage(img,temporary,view);
});
$('fwPhoto').addEventListener('pointerup',e=>{
 if(!fwDragging||e.pointerId!==fwDragging.id)return;
 const dx=e.clientX-fwDragging.x;
 fwDragging=null;
 $('fwFrontImg').style.transition='';$('fwSideImg').style.transition='';
 if(Math.abs(dx)>35)fwSetIndex(fwIndex+(dx<0?1:-1));else fwDrawScene();
});
$('fwPhoto').addEventListener('pointercancel',()=>{fwDragging=null});
function fwOpenScope(){
 $('fwScope').hidden=false;fwScopePan=.18;
 fwLensPosition();$('fwFound').hidden=true;$('fwScopeControls').hidden=false;
 $('fwScopeLabel').textContent='';
}
$('fwTelescope').onclick=fwOpenScope;
$('fwCloseScope').onclick=()=>{$('fwScope').hidden=true};
function fwLensPosition(){
 const lens=$('fwLens'),img=$('fwLensImage');if(!lens.clientWidth)return;
 const h=lens.clientHeight,ih=h*1.54,iw=ih*(1440/940),max=Math.max(0,iw-lens.clientWidth);
 img.style.height=ih+'px';img.style.width=iw+'px';img.style.top=(-.23*h)+'px';
 img.style.transform='translate3d('+(-max*fwScopePan)+'px,0,0)';
 const found=fwScopePan>.60;
 img.style.filter=found?'saturate(1.17) contrast(1.07)':'saturate(.89) contrast(.95) blur(1.3px)';
 if(found){
   $('fwScopeLabel').textContent='';
   $('fwFound').hidden=false;
   $('fwScopeControls').hidden=true;
 }else{
   $('fwScopeLabel').textContent='';
   $('fwFound').hidden=true;
 }
}
function fwScopeMove(dx){fwScopePan=Math.min(1,Math.max(0,fwScopePan+dx));fwLensPosition()}
$('fwScopeLeft').onclick=()=>fwScopeMove(-.16);
$('fwScopeRight').onclick=()=>fwScopeMove(.19);
$('fwLens').addEventListener('pointerdown',e=>{
 fwScopeDragging={id:e.pointerId,x:e.clientX,start:fwScopePan};
 try{$('fwLens').setPointerCapture(e.pointerId)}catch(_){}
});
$('fwLens').addEventListener('pointermove',e=>{
 if(!fwScopeDragging||e.pointerId!==fwScopeDragging.id)return;
 const dx=fwScopeDragging.x-e.clientX;
 fwScopePan=Math.min(1,Math.max(0,fwScopeDragging.start+dx/($('fwLens').clientWidth*1.1)));
 fwLensPosition();
});
$('fwLens').addEventListener('pointerup',()=>fwScopeDragging=null);
$('fwLens').addEventListener('pointercancel',()=>fwScopeDragging=null);
$('fwFound').onclick=()=>rewardOpen('forest-reveal');
function fwDrawFinish(){
 $('fwScope').hidden=true;$('fwFinish').hidden=false;
 const view=$('fwPhoto');
 fwPlaceImage($('fwBridgeImg'),.54,view);
 $('fwBridgeImg').style.opacity='1';
 $('fwFrontImg').style.opacity='0';$('fwSideImg').style.opacity='0';
 $('fwPhotoTag').textContent='JÕESILD';
 $('fwPrev').disabled=true;$('fwNext').disabled=true;
 $('fwPrev').style.visibility='hidden';$('fwNext').style.visibility='hidden';
}
$('fwSave').onclick=()=>rewardOpen('forest-finish');
$('fwExploreAgain').onclick=()=>{fwIndex=0;rewardOpen('forest-front')};
window.addEventListener('resize',()=>{if(fwIsOn&&['forest-front','forest-side'].includes(rewardStep)&&$('fwScope').hidden)fwDrawScene(true);if(fwIsOn&&!$('fwScope').hidden)fwLensPosition()});
document.addEventListener('keydown',e=>{
 if(!fwIsOn||!['forest-front','forest-side'].includes(rewardStep))return;
 if(!$('fwScope').hidden){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();fwScopeMove(e.key==='ArrowRight'?.18:-.18)}return}
 if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();fwSetIndex(fwIndex+(e.key==='ArrowRight'?1:-1))}
});
window.__FW_TEST__={get:()=>({step:rewardStep,index:fwIndex,scopeOpen:!$('fwScope').hidden,scopePan:fwScopePan,found:!$('fwFound').hidden,finish:!$('fwFinish').hidden}),setIndex:fwSetIndex,openScope:fwOpenScope,scopeMove:fwScopeMove};


/* v22: Jõesild panoramic exploration, binocular discovery of Mäekuru, postcard and map. */
let bwIsOn=false,bwIndex=0,bwPan=.1,bwGrab=null,bwScopePan=.08,bwLensGrab=null;
const bwViews=[.05,.35,.66,.95];
function bwReset(){bwIsOn=false;bwIndex=0;bwPan=.05;bwScopePan=.08;bwGrab=null;bwLensGrab=null;const w=$('bridgeWorld');if(w){w.classList.remove('scope-ready');$('bwScope').hidden=true;$('bwReveal').hidden=true;w.hidden=true}}
function bwWorldEnter(step){
 const w=$('bridgeWorld');w.hidden=false;
 if(!bwIsOn){$('bwVista').src=forestBridgeCleanV21;$('bwScopeImage').src=bridgeMountainV22;$('bwBinocular').src=bridgeBinocularV22;bwIsOn=true;bwIndex=0}
 if(step==='bridge-reveal'){bwReveal();return}
 bwRender();
}
function bwImagePlace(pan){
 const view=$('bwPhoto'),img=$('bwVista');if(!view.clientHeight)return;
 const h=view.clientHeight,w=view.clientWidth,ih=h*.99,iw=ih*(1440/816),max=Math.max(0,iw-w);
 img.style.height=ih+'px';img.style.width=iw+'px';img.style.top=(h-ih)*.5+'px';img.style.transform='translate3d('+(-max*pan)+'px,0,0)';
}
function bwRender(){
 $('bridgeWorld').classList.toggle('scope-ready',bwIndex===bwViews.length-1);
 bwImagePlace(bwViews[bwIndex]);
 $('bwPrev').disabled=bwIndex===0;$('bwNext').disabled=bwIndex===bwViews.length-1;
 $('bwProgress').hidden=false;
 [...$('bwProgress').children].forEach((el,i)=>{el.classList.toggle('done',i<bwIndex);el.classList.toggle('active',i===bwIndex)});
 $('bwScope').hidden=true;$('bwReveal').hidden=true;
}
function bwSetIndex(i){if(!bwIsOn||rewardStep!=='bridge-visit')return;bwIndex=Math.max(0,Math.min(bwViews.length-1,i));bwRender()}
$('bwPrev').onclick=()=>bwSetIndex(bwIndex-1);
$('bwNext').onclick=()=>bwSetIndex(bwIndex+1);
$('bwPhoto').addEventListener('pointerdown',e=>{if(e.target.closest('button')||rewardStep!=='bridge-visit')return;bwGrab={id:e.pointerId,x:e.clientX,y:e.clientY};try{$('bwPhoto').setPointerCapture(e.pointerId)}catch(_){}});
$('bwPhoto').addEventListener('pointermove',e=>{if(!bwGrab||bwGrab.id!==e.pointerId)return;const dx=e.clientX-bwGrab.x;if(Math.abs(dx)<7)return;const h=$('bwPhoto').clientHeight,w=$('bwPhoto').clientWidth,max=Math.max(0,h*.99*1440/816-w);bwImagePlace(Math.min(1,Math.max(0,bwViews[bwIndex]-dx/Math.max(160,max))))});
$('bwPhoto').addEventListener('pointerup',e=>{if(!bwGrab||bwGrab.id!==e.pointerId)return;const dx=e.clientX-bwGrab.x;bwGrab=null;if(Math.abs(dx)>35)bwSetIndex(bwIndex+(dx<0?1:-1));else bwRender()});
$('bwPhoto').addEventListener('pointercancel',()=>bwGrab=null);
function bwOpenScope(){if(rewardStep!=='bridge-visit')return;$('bwScope').hidden=false;$('bwReveal').hidden=true;bwScopePan=.05;bwDrawScope()}
$('bwLook').onclick=bwOpenScope;
$('bwClose').onclick=()=>{$('bwScope').hidden=true};
function bwDrawScope(){
 const lens=$('bwLens'),img=$('bwScopeImage');if(!lens.clientHeight)return;
 const h=lens.clientHeight,w=lens.clientWidth,ih=h*1.15,iw=ih*(1600/850),max=Math.max(0,iw-w);
 img.style.height=ih+'px';img.style.width=iw+'px';img.style.top=(h-ih)*.5+'px';img.style.transform='translate3d('+(-max*bwScopePan)+'px,0,0)';
 const found=bwScopePan>.66;$('bwScope').classList.toggle('found',found);
}
function bwScopeMove(delta){bwScopePan=Math.max(0,Math.min(1,bwScopePan+delta));bwDrawScope()}
$('bwLeft').onclick=()=>bwScopeMove(-.16);
$('bwRight').onclick=()=>bwScopeMove(.18);
$('bwLens').addEventListener('pointerdown',e=>{bwLensGrab={id:e.pointerId,x:e.clientX,pan:bwScopePan};try{$('bwLens').setPointerCapture(e.pointerId)}catch(_){}});
$('bwLens').addEventListener('pointermove',e=>{if(!bwLensGrab||bwLensGrab.id!==e.pointerId)return;bwScopePan=Math.max(0,Math.min(1,bwLensGrab.pan+(bwLensGrab.x-e.clientX)/Math.max(160,$('bwLens').clientWidth)));bwDrawScope()});
$('bwLens').addEventListener('pointerup',()=>bwLensGrab=null);
$('bwLens').addEventListener('pointercancel',()=>bwLensGrab=null);
$('bwDiscovered').onclick=()=>{if($('bwScope').classList.contains('found'))rewardOpen('bridge-reveal')};
function bwReveal(){
 $('bwScope').hidden=true;$('bwReveal').hidden=false;$('bridgeWorld').classList.remove('scope-ready');$('bwProgress').hidden=true;
 $('bwPrev').disabled=true;$('bwNext').disabled=true;
 $('bwVista').src=bridgeMountainV22;
 const view=$('bwPhoto'),img=$('bwVista'),h=view.clientHeight,w=view.clientWidth,iw=h*(1600/850),max=Math.max(0,iw-w);
 img.style.height=h+'px';img.style.width=iw+'px';img.style.top='0';img.style.transform='translate3d('+(-max*.78)+'px,0,0)';
}
$('bwSave').onclick=()=>rewardOpen('bridge-postcard');
window.addEventListener('resize',()=>{if(!bwIsOn)return;if(rewardStep==='bridge-visit'&&$('bwScope').hidden)bwRender();if(rewardStep==='bridge-visit'&&!$('bwScope').hidden)bwDrawScope();if(rewardStep==='bridge-reveal')bwReveal()});
document.addEventListener('keydown',e=>{if(rewardStep!=='bridge-visit')return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();if($('bwScope').hidden)bwSetIndex(bwIndex+(e.key==='ArrowRight'?1:-1));else bwScopeMove(e.key==='ArrowRight'?.18:-.18)}});
window.__BRIDGE_TEST__={get:()=>({route:currentRoute,step:rewardStep,index:bwIndex,scopeOpen:!$('bwScope').hidden,found:$('bwScope').classList.contains('found')}),setIndex:bwSetIndex,openScope:bwOpenScope,moveScope:bwScopeMove};


let mwIndex=0,mwDrag=null;
const mwScenes=[mountainGateV28,mountainVisitV28,mountainVisitV28];
function mwReset(){
 const w=$('mountainWorld');if(w)w.hidden=true;
 for(const id of ['mwScopeBtn','mwRevealBtn','mwSaveBtn'])$(id).hidden=true;
 mwIndex=0;mwDrag=null;
}
function mwRender(){
 const step=rewardStep;
 const visit=step==='mountain-visit';
 const scope=step==='mountain-scope';
 const reveal=step==='mountain-reveal';
 if(!visit&&!scope&&!reveal){mwReset();return}
 $('mountainWorld').hidden=false;
 let src=visit?mwScenes[mwIndex]:(scope?mountainScopeV28:mountainRevealV28);
 $('mwScreen').src=src;
 $('mwBackdrop').style.backgroundImage='url("'+src+'")';
 $('mwTitle').textContent=visit?'MÄEKURU':scope?'':'JÄRVEÄÄR';
 $('mwPrev').hidden=!visit;$('mwNext').hidden=!visit;
 $('mwProgress').hidden=!visit;
 $('mwPrev').disabled=mwIndex===0;$('mwNext').disabled=mwIndex===mwScenes.length-1;
 Array.from($('mwProgress').children).forEach((el,i)=>{el.classList.toggle('seen',i<mwIndex);el.classList.toggle('active',i===mwIndex)});
 $('mwScopeBtn').hidden=!(visit&&mwIndex===mwScenes.length-1);
 $('mwRevealBtn').hidden=!scope;
 $('mwSaveBtn').hidden=!reveal;
}
function mwWorldEnter(step){if(step==='mountain-visit')mwIndex=0;mwRender()}
function mwSetIndex(n){if(rewardStep!=='mountain-visit')return;mwIndex=Math.max(0,Math.min(mwScenes.length-1,n));mwRender()}
$('mwPrev').onclick=()=>mwSetIndex(mwIndex-1);
$('mwNext').onclick=()=>mwSetIndex(mwIndex+1);
$('mwPhoto').addEventListener('pointerdown',e=>{if(rewardStep!=='mountain-visit')return;mwDrag={x:e.clientX,id:e.pointerId};try{$('mwPhoto').setPointerCapture(e.pointerId)}catch(_){}});
$('mwPhoto').addEventListener('pointerup',e=>{if(!mwDrag||mwDrag.id!==e.pointerId)return;const dx=e.clientX-mwDrag.x;mwDrag=null;if(Math.abs(dx)>42)mwSetIndex(mwIndex+(dx<0?1:-1))});
$('mwPhoto').addEventListener('pointercancel',()=>mwDrag=null);
$('mwScopeBtn').onclick=()=>rewardOpen('mountain-scope');
$('mwRevealBtn').onclick=()=>rewardOpen('mountain-reveal');
$('mwSaveBtn').onclick=()=>rewardOpen('mountain-postcard');
document.addEventListener('keydown',e=>{if(rewardStep==='mountain-visit'&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();mwSetIndex(mwIndex+(e.key==='ArrowRight'?1:-1))}});
window.__MOUNTAIN_TEST__={get:()=>({step:rewardStep,index:mwIndex,srcOK:$('mwScreen').naturalWidth>0}),setIndex:mwSetIndex};

function assertTaskMath(task){
 const u=task.unit,v=task.v,a=task.a;
 if(!Number.isSafeInteger(v)||!Number.isSafeInteger(a)||!Number.isSafeInteger(u)||u<10||u>1000000||Math.log10(u)%1!==0)throw Error('Invalid rounding task: '+JSON.stringify(task));
 const lower=Math.floor(v/u)*u, rem=v-lower;
 const expected=rem<u/2?lower:lower+u;
 if(a!==expected || a%u!==0)throw Error('Rounding mismatch: '+JSON.stringify(task));
 return true;
}
function assertAllTasks(){if(!Array.isArray(tasks)||!tasks.length)throw Error('No tasks');tasks.forEach(assertTaskMath)}
function setInstruction(unit){
 const target=$('roundTarget'),instruction=$('instruction');
 const names={10:'KÜMNELISTENI',100:'SAJALISTENI',1000:'TUHANDELISTENI',10000:'KÜMNETUHANDELISTENI',100000:'SAJATUHANDELISTENI',1000000:'MILJONITENI'};
 if(!Object.prototype.hasOwnProperty.call(names,unit))throw new Error('Unknown rounding unit: '+unit);
 target.textContent=names[unit];
 instruction.dataset.unit=String(unit);
 instruction.setAttribute('aria-label','ÜMARDA '+target.textContent);
}
function intro(){rewardClean();clearTimeout(checkTimeout);clearTimeout(transitionTimeout);clearTimeout(wrongFlashTimer);makeTasks();assertAllTasks();index=0;typed='';state='intro';hazard=.03;speed=40;wrongMarked=false;setPhase(0,true);route();obstacle();$('number').textContent=tasks[0].v;setInstruction(tasks[0].unit);feedback('');updateAnswer();stage.className='stage';
 const forest=currentRoute==='forest',bridge=currentRoute==='bridge',mountain=currentRoute==='mountain',adventure=adventureStages[currentRoute];
 const routeLabel=adventure?adventure.index+'/9':mountain?'4/9':bridge?'3/9':forest?'2/9':'1/9';
 const title=adventure?'Sõit '+adventure.name+'!':mountain?'Sõit Mäekurusse!':bridge?'Sõit Jõesillani!':forest?'Sõit metsajaama!':'Sõit majakani!';
 const emoji=adventure?'🏎️':mountain?'🏔️':bridge?'🌉':forest?'🌲':'🌊';
 showModal(`<div class="small">EDUKASS · ÜMARDAMISRALLI · ${routeLabel}</div><div class="intro-icon" aria-hidden="true">🏎️ <span>${emoji}</span> <span>🏁</span></div><h1>${title}</h1><p>${tasks.length} ümardamisülesannet</p><button id="begin" class="intro-begin">ALUSTA SÕITU!</button>${currentRoute==='majakas'?'<button id="jumpForest" class="intro-prize">🌲 2. TEE · METSAJAAM</button>':''}${currentRoute==='majakas'||currentRoute==='forest'?'<button id="jumpBridge" class="intro-prize">🌉 3. TEE · JÕESILD</button>':''}${currentRoute==='majakas'||currentRoute==='forest'||currentRoute==='bridge'?'<button id="jumpMountain" class="intro-prize">🏔️ 4. TEE · MÄEKURU</button>':''}${currentRoute==='majakas'?'<button id="viewPrize" class="intro-prize">✉️ MAJAKA POSTKAART</button>':''}${currentRoute!=='majakas'?'<button id="backMajakas" class="intro-prize">‹ MAJAKAS</button>':''}${currentRoute==='mountain'?'<button id="testMountainStation" class="intro-prize">🏔️ TESTI MÄEKURU VAATAMIST</button><button id="testMountainPrize" class="intro-prize">✉️ TESTI MÄEKURU POSTKAARTI</button>':currentRoute==='bridge'?'<button id="testBridgeStation" class="intro-prize">🌉 TESTI JÕESILLA VAATAMIST</button>':'<button id="testForestStation" class="intro-prize">🌲 TESTI METSAJAAMA VAATAMIST</button>'}<details class="dev-shortcuts"><summary>TESTI ETAPPE 5–9</summary>${Object.entries(adventureStages).map(([id,s])=>`<button type="button" data-adventure="${id}">${s.index}. ${s.name}</button>`).join('')}${adventure?'<button type="button" id="testAdventureScene">VAATA JAAMA</button>':''}</details>`);
 if(!qaMode)document.querySelectorAll('[id^="test"],.dev-shortcuts,#jumpForest,#jumpBridge,#jumpMountain,#viewPrize').forEach(el=>el.remove());
 if(earnedCards().length){const b=document.createElement('button');b.textContent='JÄTKA TEEKONDA ›';b.className='intro-prize';b.id='resumeRoute';b.onclick=()=>chooseRoute(nextSavedRoute());$('begin').after(b)}
 $('begin').onclick=start;
 if($('viewPrize'))$('viewPrize').onclick=()=>rewardOpen('postcard');
 if($('jumpForest'))$('jumpForest').onclick=startForestRoute;
 if($('jumpBridge'))$('jumpBridge').onclick=startBridgeRoute;
 if($('jumpMountain'))$('jumpMountain').onclick=startMountainRoute;
 if($('backMajakas'))$('backMajakas').onclick=returnToMajakas;
 if($('testForestStation'))$('testForestStation').onclick=()=>{
   currentRoute='forest';$('app').classList.remove('river-route');$('app').classList.add('forest-route');document.querySelector('.place').innerHTML='<span class="pin">📍</span> METSAJAAM';
   hideModal();forestSeenFront=false;forestSeenSide=false;rewardOpen('forest-front');
 };
 if($('testBridgeStation'))$('testBridgeStation').onclick=()=>{hideModal();rewardOpen('bridge-visit')};
 if($('testMountainStation'))$('testMountainStation').onclick=()=>{hideModal();rewardOpen('mountain-visit')};
 if($('testMountainPrize'))$('testMountainPrize').onclick=()=>{hideModal();rewardOpen('mountain-postcard')};
 document.querySelectorAll('[data-adventure]').forEach(b=>b.onclick=()=>startAdventureRoute(b.dataset.adventure));
 if($('testAdventureScene'))$('testAdventureScene').onclick=()=>{hideModal();rewardOpen('adventure-visit')};
}
function start(){hideModal();index=0;speed=40;prepare(true)}
function prepare(first=false){clearTimeout(checkTimeout);clearTimeout(transitionTimeout);clearTimeout(wrongFlashTimer);wrongFlashTimer=0;state='driving';typed='';wrongMarked=false;wrongCandidate='';risk=1;hazard=.04;goal=adventureStages[currentRoute]?adventureGoal(tasks[index],index):currentRoute==='mountain'?mountainGoal(tasks[index],index):currentRoute==='bridge'?riverGoal(tasks[index],index):currentRoute==='forest'?forestGoal(tasks[index],index):timeWindows[index];speed=Math.max(40,Math.min(speed*.94,160));route();const nextPhase=phaseFor(index);if(nextPhase!==scenePhase)setPhase(nextPhase);else if(first)setPhase(0,true);obstacle();$('number').textContent=tasks[index].v;setInstruction(tasks[index].unit);feedback('Sisesta vastus');updateAnswer();stage.classList.remove('alert','crashing','dodging','arriving');message(index===0?'RAHULIK START!':(adventureStages[currentRoute]?'TEE JÄTKUB!':currentRoute==='mountain'?mountainMessages[index]:currentRoute==='bridge'?riverMessages[index]:currentRoute==='forest'?forestMessages[index]:eventLabels[index]),'neutral',900);}
function wrong(){
 if(state!=='driving'||!typed||Number(typed)===tasks[index].a)return;
 clearTimeout(wrongFlashTimer);wrongMarked=true;wrongCandidate=typed;
 risk=Math.min(3.3,risk+((currentRoute==='forest'||currentRoute==='bridge'||currentRoute==='mountain'||!!adventureStages[currentRoute])?.32:1.05));hazard=Math.min(.9,hazard+.045);
 stage.classList.add('alert');feedback('VALE!','red');message('VALE!','warn',380);sound(230,.09,.009);updateAnswer();
 wrongFlashTimer=setTimeout(()=>{wrongFlashTimer=0;if(state!=='driving')return;typed='';wrongMarked=false;wrongCandidate='';updateAnswer();feedback('');},340);
}
function enter(k){
 if(state!=='driving')return;
 clearTimeout(checkTimeout);
 // An immediate new digit after red feedback begins a clean new attempt.
 if(wrongMarked){clearTimeout(wrongFlashTimer);wrongFlashTimer=0;typed='';wrongMarked=false;wrongCandidate='';}
 if(k==='back')typed=typed.slice(0,-1);
 else if(k==='clear')typed='';
 else if(/^\d$/.test(k)&&typed.length<10){if(!typed&&k==='0'&&tasks[index].a!==0)return;typed+=k}
 else return;
 const target=String(tasks[index].a);
 if(typed===target){correct();return}
 updateAnswer();feedback('');
 // Never judge an unfinished number: 72 may be the beginning of 728630.
 // Only check once enough digits for the complete rounded answer have been typed.
 if(typed.length>=target.length){wrong();return}
}
function correct(){if(state!=='driving')return;clearTimeout(wrongFlashTimer);wrongFlashTimer=0;state='dodging';wrongMarked=false;stage.classList.remove('alert');stage.classList.add('dodging');speed=Math.min(195,speed+42);hazard=Math.max(hazard,.66);swerveEnd=performance.now()+1150;swerveDir=index%2?1:-1;message(index===tasks.length-1?(adventureStages[currentRoute]?adventureStages[currentRoute].name+'!':currentRoute==='mountain'?'MÄEKURU!':currentRoute==='bridge'?'JÕESILD!':currentRoute==='forest'?'METSAJAAM!':'MAJAKAS!'):'ÕIGE!','ok',1000);feedback('ÕIGE!','green');updateAnswer();sound(820,.12,.014);transitionTimeout=setTimeout(()=>{index++;if(index>=tasks.length)arrive();else prepare()},1170)}
function crash(){if(state!=='driving')return;clearTimeout(wrongFlashTimer);wrongFlashTimer=0;state='crash';clearTimeout(checkTimeout);stage.classList.add('crashing');message('TAKISTUS!','warn',1300);feedback('Takistus!','red');sound(120,.27,.014);transitionTimeout=setTimeout(()=>fail(),1000)}
function fail(){state='failed';stage.classList.remove('crashing');showModal(`<div class="small">${adventureStages[currentRoute]?adventureStages[currentRoute].name:currentRoute==='mountain'?'MÄEKURU':currentRoute==='bridge'?'JÕESILD':currentRoute==='forest'?'METSAJAAM':'MAJAKAS'} · ${index+1}/${tasks.length}</div><div class="bigemoji">🚧</div><h1>Sõit peatus</h1><p>Takistus jõudis autoni. Proovi uuesti, uus tee ootab!</p><p>${tasks[index].v} → ${$('roundTarget').textContent} ≈ <strong class="answerReveal">${fmt(tasks[index].a)}</strong></p><button id="again">PROOVI UUESTI ↻</button>`);$('again').onclick=intro}
function arrive(){state='arriving';stage.classList.remove('dodging');stage.classList.add('arriving');setPhase(currentRoute==='majakas'?2:3,true);barrier.style.opacity='0';route();
 if(adventureStages[currentRoute]){
   message(adventureStages[currentRoute].name+' ON KÄES!','ok',1300);
   transitionTimeout=setTimeout(()=>rewardOpen('adventure-visit'),reduced?100:1350);
 }else if(currentRoute==='mountain'){
   message('MÄEKURU ON KÄES!','ok',1300);
   transitionTimeout=setTimeout(()=>rewardOpen('mountain-visit'),reduced?100:1350);
 }else if(currentRoute==='bridge'){
   message('JÕESILD ON KÄES!','ok',1300);
   transitionTimeout=setTimeout(()=>rewardOpen('bridge-visit'),reduced?100:1350);
 }else if(currentRoute==='forest'){
   forestSeenFront=false;forestSeenSide=false;forestPan=50;
   message('METSAJAAM ON KÄES!','ok',1300);
   transitionTimeout=setTimeout(()=>rewardOpen('forest-front'),reduced?100:1350);
 }else{
   message('MAJAKAS ON KÄES!','ok',1300);
   try{progressStore.setItem('edukass-umardamisralli-majakas-complete-v3','1')}catch(e){}
   transitionTimeout=setTimeout(()=>rewardOpen('panorama'),reduced?100:1350);
 }
}
function finish(){rewardOpen('panorama')}
function tick(now){if(state==='reward'){last=now;requestAnimationFrame(tick);return;}const dt=Math.min(.04,Math.max(0,(now-last)/1000));last=now;const active=state==='driving';if(active){hazard=Math.min(1,hazard+dt/goal*DRIVE_PACE*(risk>1?Math.min(2.6,risk):1));speed=Math.min(190,speed+dt*(index<2?3.2:5.8));if(hazard>=1)crash()}
 const dodging=state==='dodging',jump=dodging?Math.max(0,Math.min(1,(swerveEnd-now)/1150)):0;
 const sway=reduced?0:Math.sin(now/1350)*3,side=dodging?swerveDir*75*Math.sin(Math.PI*(1-jump)):0;
 const phaseShift=reduced?0:Math.sin(now/980)*(speed/170)*1.2;
 scenes.forEach((el,i)=>{const z=1.035+(index%3)*.022+hazard*.025+(i===scenePhase?.003*Math.sin(now/700):0)+(state==='arriving'?.12:0);if(state!=='arriving'||i!==(currentRoute==='majakas'?2:3))el.style.transform=`scale(${z}) translateX(${phaseShift*(i+1)}%)`});
 // During a successful dodge the obstacle sweeps past the car, rather than receding.
 const p=dodging?Math.min(1.2,Math.max(.66,hazard)+(1-jump)*.54):hazard;
 barrier.style.top=((currentRoute==='majakas'?36:52)+Math.pow(p,1.25)*(currentRoute==='majakas'?49:33))+'%';barrier.style.width=(9+Math.pow(p,.87)*52)+'%';barrier.style.left=(48+Math.sin(index*2.7)*7)+'%';barrier.style.opacity=state==='arriving'?'0':dodging?String(Math.min(1,Math.max(0,jump*1.5))):'1';
 if(state!=='arriving')car.style.transform=`translateX(calc(-50% + ${side+sway}px)) rotate(${dodging?swerveDir*9*Math.sin(Math.PI*(1-jump)):0}deg)`;
 stage.classList.toggle('fast',(active&&speed>57)||dodging);stage.classList.toggle('alert',active&&risk>1);
 if(toastEnd&&now>toastEnd){$('toast').className='toast';toastEnd=0}
 roadLines(now);requestAnimationFrame(tick)}
function roadLines(now){const w=canvas.clientWidth,h=canvas.clientHeight;if(w<=0||h<=0)return;const dpr=Math.min(devicePixelRatio||1,2),pw=Math.round(w*dpr),ph=Math.round(h*dpr);if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(reduced)return;const active=state==='driving'||state==='dodging',power=active?Math.max(.8,Math.min(3.5,speed/52))*DRIVE_PACE:0;if(!power)return;let horizon=h*.49,roadH=h*.49;for(let i=0;i<12;i++){const t=(i/12+now*.00016*power)%1,yp=t*t;ctx.globalAlpha=.09+t*.17;ctx.strokeStyle='#fff8d8';ctx.lineWidth=1+t*3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(w*.50,horizon+roadH*yp);ctx.lineTo(w*.50,horizon+roadH*Math.min(1,yp+.01+t*.025));ctx.stroke()};ctx.globalAlpha=1;if(speed>55){for(let i=0;i<13;i++){const t=(i/13+now*.00016*power)%1,side=i%2?1:-1,xx=w*.5+side*w*(.26+t*.24);ctx.globalAlpha=.07+t*.23;ctx.strokeStyle='#faffff';ctx.lineWidth=1+t*2;ctx.beginPath();ctx.moveTo(xx,horizon+t*roadH);ctx.lineTo(xx+side*10*t,horizon+(t+.04)*roadH);ctx.stroke()}ctx.globalAlpha=1}}
$('keyboard').addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(b)enter(b.dataset.key)});
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;if(/^\d$/.test(e.key)){e.preventDefault();enter(e.key)}else if(e.key==='Backspace'){e.preventDefault();enter('back')}else if(e.key==='Delete'){e.preventDefault();enter('clear')}});
$('mute').onclick=()=>{soundOn=!soundOn;$('mute').textContent=soundOn?'🔊':'🔇';if(soundOn)sound(700,.06,.009)};
$('home').onclick=()=>{clearTimeout(checkTimeout);clearTimeout(transitionTimeout);intro()};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)last=performance.now()});
intro();requestAnimationFrame(tick);
window.__ADVENTURE_TEST__={earnedCards,nextSavedRoute,startAdventureRoute,makeAdventureTasks,adventureStages,adventureUnitPlans,advSetIndex,renderCanonicalMap,get:()=>({currentRoute,step:rewardStep,advIndex,state,index,tasks})};
window.__RALLI_TEST__={snapshot:(mode,i)=>{if(!qaMode)return;const still=document.createElement('style');still.textContent='*,*::before,*::after{animation:none!important;transition:none!important}';document.head.appendChild(still);document.querySelectorAll('.scene').forEach(e=>e.style.setProperty('transition','none','important'));if(mode==='road'){rewardClean();hideModal();setPhase(i,true);state='paused'}else if(mode==='forest-scope'){rewardOpen('forest-front');fwSetIndex(2);fwOpenScope()}else if(mode==='bridge-scope'){rewardOpen('bridge-visit');bwSetIndex(2);bwOpenScope()}else if(mode==='mountain-scope'){rewardOpen('mountain-scope')}else{rewardOpen(mode);if(mode==='forest-front')fwSetIndex(i);if(mode==='bridge-visit')bwSetIndex(i);if(mode==='mountain-visit')mwSetIndex(i);if(mode==='adventure-visit')advSetIndex(i)}clearTimeout(rewardTimer);},assertTaskMath,assertAllTasks,startMountainRoute,makeMountainTasks,makeTasks,setInstruction,get:()=>({tasks,index,typed,state,hazard,risk,wrongMarked,goal,phase:scenePhase,obstacle:obstacles[index],currentRoute}),enter,intro,start,crash,correct,prepare,wrong,finish,rewardOpen,startForestRoute,returnToMajakas,startBridgeRoute,makeForestTasks,makeRiverTasks,rewardLook,rewardPhoto,forestVisit,forestLookPan,forestState:()=>({step:rewardStep,front:forestSeenFront,side:forestSeenSide,pan:forestPan}),rewardState:()=>({step:rewardStep,pan,seenPan})};
})();
