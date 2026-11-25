'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('games/umardamine/index.html','utf8');
const begin=html.indexOf('const WORLD_UNITS='),end=html.indexOf('function updateGems()',begin);
assert(begin>0&&end>begin);
const ctx=vm.createContext({Math,localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext('let worldId=1,TOTAL=8;function random(n){return Math.floor(Math.random()*n)}\n'+html.slice(begin,end),ctx);
const units=[10,100,1000,10000,100000,1000000,10000000,100000000],observed=new Set();
function audit(ts,w){assert.equal(ts.length,w===1?8:12);const seen=new Set();for(const t of ts){assert(Number.isSafeInteger(t.v)&&t.v>0&&t.v<1e9);assert(units.includes(t.unit));assert(t.v%t.unit!==0);assert(!seen.has(t.v));seen.add(t.v);const n=BigInt(t.v),u=BigInt(t.unit);const expected=Number((n/u+(2n*(n%u)>=u?1n:0n))*u);assert.equal(t.answer,expected);observed.add(t.unit);}
assert(ts.some(t=>t.answer>t.v)&&ts.some(t=>t.answer<t.v));if(w>2){assert.equal(ts.filter(t=>t.review).length,2);assert.notEqual(ts.filter(t=>t.review)[0].unit,ts.filter(t=>t.review)[1].unit);}}
let count=0;for(let w=1;w<=9;w++){vm.runInContext('worldId='+w+';TOTAL='+ (w===1?8:12),ctx);for(let i=0;i<100;i++){const ts=vm.runInContext('createTasks()',ctx);audit(ts,w);count+=ts.length;}}
assert.equal(observed.size,8);let ts=vm.runInContext('createTasks()',ctx);assert.throws(()=>audit(ts.map((t,i)=>i===0?{...t,answer:t.answer+1}:t),9));assert.throws(()=>audit(ts.map((t,i)=>i===0?{...t,v:t.answer}:t),9));assert.throws(()=>audit(ts.slice(1),9));console.log('PASS independent rounding audit: '+count+' tasks; negative controls passed');
