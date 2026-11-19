const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const projectIndex = path.join(__dirname, '../index.html');
const file = process.argv[2] || (fs.existsSync(projectIndex) ? projectIndex : path.join(__dirname, '../dist/index.html'));
const source = fs.readFileSync(file, 'utf8');
function section(start, end) {
  const a=source.indexOf(start), b=source.indexOf(end,a);
  assert(a>=0 && b>a, 'Missing audit section '+start);
  return source.slice(a,b);
}
const storage = new Map();
const elements = {fwMap:{innerHTML:'',querySelectorAll:()=>[]}};
let seed = 0x54321;
const random = () => {seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const math = Object.create(Math); math.random=random;
const c = {performance, Math:math, progressStore:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}, rand:a=>a[Math.floor(random()*a.length)], $:id=>elements[id]};
vm.createContext(c);
const extracted = section('const options=','function updateStageLandmark')+'\n'+section('function makeTasks(){','function setPhase(')+'\n'+section('const adventureNames=','function adventureGoal')+'\n'+section('function earnedCards(){','function showSavedCard')+'\n'+section('function renderCanonicalMap(','function rewardSetTimeout');
vm.runInContext(extracted+`\nconst rewardStorageKey='edukass-majakas-postkaart-v1';const originalPostcardImage='one',forestPostcardV21='two',bridgePostcardV22='three',mountainPostcardV28='four';`, c);
const results=vm.runInContext(`(()=>{
 const results={};
 for(const route of ['majakas','forest','bridge','mountain','lake','mill','town','observatory','castle']){
  currentRoute=route;let count=0,max=0;const units=new Set(),unitCounts={};
  for(let repeat=0;repeat<1000;repeat++){
   makeTasks();
   if(tasks.length!==(route==='majakas'?8:12))throw Error('Incorrect count');
   if(new Set(tasks.map(t=>t.v)).size!==tasks.length)throw Error('Duplicate source');
   if(obstacles.length!==tasks.length)throw Error('Obstacle count '+route);
   const upper={majakas:999,forest:2999,bridge:9499,mountain:39999,lake:99999,mill:399999,town:999999,observatory:3999999,castle:9999999}[route];
   if(tasks.some(t=>t.v>upper))throw Error('Source range '+route);
   const expectedPhases=route==='majakas'?'00111222':['forest','bridge','mountain'].includes(route)?'000011112222':'000111222333';
   if(tasks.map((t,i)=>phaseFor(i)).join('')!==expectedPhases)throw Error('Missing driving phase '+route);
   const introductions={majakas:[100,'8'],bridge:[1000,'9,11,12'],lake:[10000,'11,12'],town:[100000,'11,12'],castle:[1000000,'10,11,12']};
   if(introductions[route]){
    const [unit,positions]=introductions[route];
    const selected=tasks.map((t,i)=>t.unit===unit?i+1:0).filter(Boolean).join(',');
    if(selected!==positions)throw Error('Premature introduction '+route);
    if(['lake','town','castle'].includes(route)&&tasks.some(t=>t.unit===unit&&(t.v<unit||t.v>=4*unit)))throw Error('Oversized introductory example '+route);
   }
   for(const t of tasks){
    const n=BigInt(t.v),u=BigInt(t.unit);const answer=n/u*u+(n%u*2n>=u?u:0n);
    if(answer!==BigInt(t.a))throw Error('Wrong arithmetic');
    if(t.dir==='half'&&n%u*2n!==u)throw Error('Not halfway');
    if(t.dir==='down'&&n%u*2n>=u)throw Error('Not downward');
    if(t.dir==='up'&&n%u*2n<u)throw Error('Not upward');
    if(t.dir==='carry'&&(n/u+1n)%10n!==0n)throw Error('No carry');
    count++;max=Math.max(max,t.v);units.add(t.unit);unitCounts[t.unit]=(unitCounts[t.unit]||0)+1;
   }
  }
  results[route]={count,max,units:[...units].sort((a,b)=>a-b),unitCounts};
 }
 return results;
})()`,c);
const expectedUnits={
 majakas:{10:7,100:1}, forest:{10:4,100:8}, bridge:{10:2,100:7,1000:3},
 mountain:{100:4,1000:8}, lake:{100:2,1000:8,10000:2}, mill:{1000:4,10000:8},
 town:{1000:2,10000:8,100000:2}, observatory:{10000:4,100000:8},
 castle:{10000:2,100000:7,1000000:3}
};
for(const [route,expected] of Object.entries(expectedUnits)){
 assert.equal(Object.keys(results[route].unitCounts).length,Object.keys(expected).length,route+' unexpected rounding place');
 for(const [unit,count] of Object.entries(expected))assert.equal(results[route].unitCounts[unit],count*1000,route+' distribution '+unit);
}
for(const [before,after] of [['mountain','lake'],['lake','mill'],['mill','town'],['town','observatory'],['observatory','castle']]) assert(Math.max(...results[after].units)>=Math.max(...results[before].units), 'Rounding place regressed');
const getCards=()=>JSON.parse(JSON.stringify(vm.runInContext('earnedCards()',c)));
storage.clear(); assert.deepEqual(getCards(),[]);
storage.set('edukass-rounding-postcards-v1',JSON.stringify(['metsajaam','joesild','maekuru','forest','unknown']));
storage.set('edukass-majakas-postkaart-v1','1');
assert.deepEqual(new Set(getCards()),new Set(['forest','bridge','mountain','majakas']));
assert.equal(vm.runInContext('nextSavedRoute()',c),'lake');
storage.clear();vm.runInContext("earnCard('castle');renderCanonicalMap(9)",c);
assert.deepEqual(getCards(),['castle']);
assert(elements.fwMap.innerHTML.includes('1 / 9'));
assert.equal((elements.fwMap.innerHTML.match(/fw-map-stop done/g)||[]).length,1,'Falsely awarded earlier stations');
assert.equal(vm.runInContext('nextSavedRoute()',c),'majakas');
storage.clear();vm.runInContext('adventureSlugs.forEach(earnCard);renderCanonicalMap(9)',c);
assert.equal(getCards().length,9); assert(elements.fwMap.innerHTML.includes('9 / 9'));
assert.equal((elements.fwMap.innerHTML.match(/fw-map-stop done/g)||[]).length,9);
storage.clear(); storage.set('edukass-metsajaam-complete-v12','1');storage.set('edukass-joesild-complete-v1','1');storage.set('edukass-maekuru-complete-v1','1');
assert.deepEqual(new Set(getCards()),new Set(['forest','bridge','mountain']));
const input={clearTimeout(){},updateAnswer(){},feedback(){},correct(){input.state='dodging'},wrong(){input.wrongMarked=true},state:'driving',typed:'',wrongMarked:false,wrongCandidate:'',wrongFlashTimer:0,checkTimeout:0,index:0,tasks:[{a:728630}]};
vm.createContext(input);vm.runInContext(section('function enter(k){','function correct()'),input);
for(const digit of '72863'){input.enter(digit);assert.equal(input.wrongMarked,false);assert.equal(input.state,'driving');}input.enter('0');assert.equal(input.state,'dodging');
input.state='driving';input.typed='';input.tasks=[{a:0}];input.enter('0');assert.equal(input.state,'dodging');
input.state='driving';input.typed='';input.tasks=[{a:730}];for(const digit of '729')input.enter(digit);assert.equal(input.wrongMarked,true);input.enter('7');assert.equal(input.wrongMarked,false);assert.equal(input.typed,'7');
assert(source.includes('qaMode?sessionStorage:localStorage'),'QA storage not isolated');
const exercises=Object.values(results).reduce((sum,route)=>sum+route.count,0);
console.log(JSON.stringify({status:'PASS',exercises,results,persistence:'legacy aliases, individual cards, map counts, resume, complete collection',input:'long prefixes, zero, wrong-answer recovery'},null,2));