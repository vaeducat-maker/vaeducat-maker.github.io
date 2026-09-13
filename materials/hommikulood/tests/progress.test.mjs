import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const code=['data.js','vocabulary.js','engine.js','app.js'].map(name=>source(name).replace(/^import .*;\n/gm,'').replace(/export /g,'')).join('\n');
const storage=new Map();
let blocked=false,confirmed=true;
function boot(){
  const nodes=new Map(),handlers={};
  const node=key=>{
    if(!nodes.has(key))nodes.set(key,{innerHTML:'',value:'',textContent:'',open:false,
      addEventListener(){},insertAdjacentHTML(_,html){this.innerHTML+=html;},focus(){},
      querySelector:node,querySelectorAll:()=>[],showModal(){this.open=true;},close(){this.open=false;}});
    return nodes.get(key);
  };
  const context=vm.createContext({console,AbortController,document:{querySelector:node,getElementById:node,
    body:{classList:{toggle(){}}},addEventListener:(event,fn)=>{handlers[event]=fn;}},
    window:{localStorage:{getItem:key=>{if(blocked)throw Error('blocked');return storage.get(key)??null;},
      setItem:(key,value)=>{if(blocked)throw Error('blocked');storage.set(key,value);}},
      confirm:()=>confirmed,scrollTo(){},addEventListener:(event,fn)=>{handlers["window:"+event]=fn;}}});
  vm.runInContext(code,context);
  return {run:s=>vm.runInContext(s,context),click:action=>handlers.click({target:{closest:()=>({dataset:{action}})}}),node,storageEvent:value=>handlers['window:storage']({key:'edukass-hommikulood-progress',newValue:value,storageArea:vm.runInContext('window.localStorage',context)})};
}
let app=boot();
app.run("start(2);move('read',{page:3})");
app=boot();assert.equal(app.run('state.story'),2);assert.equal(app.run('state.page'),3);
app.run("move('quiz',{question:2});select(2,0);checkCurrent()"); // story 3 Q3 key B
app=boot();assert.equal(app.run('state.question'),2);assert.equal(app.run('errorCount(state.progress,2)'),1);
app.run('checkCurrent()');assert.equal(app.run('errorCount(state.progress,2)'),1);
app.run('select(2,1);checkCurrent()');
app=boot();assert.equal(app.run('errorCount(state.progress,2)'),1);assert.equal(app.run('firstCorrectCount(state.progress,2)'),0);
assert.equal(app.run('score(state.progress,stories,2)'),1);
app.run('select(3,2)');app=boot();assert.equal(app.run('state.progress[2].answers[3]'),2);assert.equal(app.run('state.progress[2].checked[3]'),false);
const before=storage.values().next().value;
app.run('openWords(true);openText(2)');assert.equal(storage.values().next().value,before);
app.run("start(0);move('quiz',{question:0});select(0,1);checkCurrent()");
confirmed=false;app.click('reset');app=boot();assert.equal(app.run('score(state.progress,stories,0)'),1);
confirmed=true;app.click('reset');app=boot();assert.equal(app.run('score(state.progress,stories,0)'),0);assert.equal(app.run('errorCount(state.progress,2)'),1);
app.click('reset-all');app=boot();assert.equal(app.run('state.view'),'home');assert.equal(app.run('state.progress.flatMap(p=>p.attempts).reduce((a,b)=>a+b,0)'),0);
app.run("start(2);move('read',{page:3});move('home');start(0);move('quiz',{question:0})");app=boot();assert.equal(app.run('state.view'),'quiz');
const stale=boot();app.click('reset-all');stale.storageEvent(storage.get('edukass-hommikulood-progress'));
assert.equal(stale.run('state.view'),'home');assert.equal(stale.run('state.progress[2].page'),0);
stale.storageEvent(null);assert.equal(stale.run('state.view'),'home');
// Invalid saves and denied storage must never prevent reading or answering.
for(const raw of ['{broken','null','{"version":99}',JSON.stringify({version:1,view:'read',story:99})]){
  storage.set('edukass-hommikulood-progress',raw);app=boot();assert.equal(app.run('state.view'),'home');app.run('start(0)');
}
blocked=true;app=boot();app.run("start(0);move('quiz',{question:0});select(0,1);checkCurrent()");assert.equal(app.run('score(state.progress,stories,0)'),1);
assert.match(app.node('#save-status').textContent,/ei saa/);
console.log('PASS: reload location, unchecked answers, errors, first tries, duplicate checks, dictionary, confirmed/cancelled resets, corrupt and blocked storage. DOM mock only; no browser layout check.');
