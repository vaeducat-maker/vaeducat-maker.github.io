'use strict';
/*
 EDUKASS regression lock: preserve already-working product behavior.
 This freeze does NOT assert that any school-notation choice is normative.
 Reference is an actual Git commit from before the unsolicited change.
 Purposeful changes to protected educational code require a separate scope.
*/
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const crypto=require('node:crypto');

const ROOT=path.resolve(__dirname,'..');
const SOURCE_PATH='proov/stolbiki-mosaic-7q4m9k/index.html';
const BASELINE_COMMIT='097e4f8c49754424bc96b7156cbfeb398eb54987';
const SOURCE=fs.readFileSync(path.join(ROOT,SOURCE_PATH),'utf8');
const REFERENCE=cp.execFileSync('git',['show',BASELINE_COMMIT+':'+SOURCE_PATH],{
  cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024
});
const scriptRe=/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
const protectedFunctions=[
  'renderAdd','renderSub','renderMul1','renderMulLong','renderMul','renderDiv',
  'unhelpfulRoutine','generateFreshTask','worldEvidence','saveProto','saveCollection'
];
function inlineScript(page,marker){
  const matches=[...page.matchAll(scriptRe)].map(m=>m[1]).filter(s=>s.includes(marker));
  if(matches.length!==1)throw Error('Missing or ambiguous protected script '+marker+': '+matches.length);
  return matches[0];
}
function sourceFunction(page,name){
  const head=new RegExp('^  function '+name+'\\(','m');
  const match=head.exec(page);
  if(!match)throw Error('Missing protected function '+name);
  const after=page.slice(match.index);
  const end=/\n  function [\w$]+\(/g;
  end.lastIndex=10;
  const next=end.exec(after);
  if(!next)throw Error('Cannot find end of protected function '+name);
  return after.slice(0,next.index).trimEnd();
}
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function compare(candidate,expected=REFERENCE){
  const slices=[
    ['math engine',p=>inlineScript(p,'root.EDUKASS_MATH_ENGINE=api')],
    ['adaptive progression',p=>inlineScript(p,'root.EDUKASS_ADAPTIVE=api')],
    ...protectedFunctions.map(n=>['function '+n,p=>sourceFunction(p,n)])
  ];
  const problems=[],result=[];
  for(const [name,read] of slices){
    try{
      const ref=read(expected),got=read(candidate),pass=ref===got;
      result.push({name,pass,expectedSha256:sha(ref),actualSha256:sha(got)});
      if(!pass)problems.push(name);
    }catch(e){problems.push(name+': '+e.message)}
  }
  return{problems,result};
}
const checked=compare(SOURCE);
const controls=[];
function negative(name,mutant){
  if(mutant===SOURCE)throw Error('Invalid negative control, no source mutation: '+name);
  const rejected=compare(mutant).problems.length>0;
  controls.push({name,rejected});
  if(!rejected)checked.problems.push('NEGATIVE CONTROL FAILED: '+name);
}
negative('Remove written-division subtraction marker',
  SOURCE.replace(/symbol\(g,0,r,'−'\);const ps=String\(s\.prod\)/,
    "symbol(g,0,r,'+');const ps=String(s.prod)"));
negative('Relax the no-round-number mathematics constraint',
  SOURCE.replace('&&(task.a%10===0||task.b%10===0))return false;',
                 '&&(task.a%10===0&&task.b%10===0))return false;'));
negative('Change world save behavior',
  SOURCE.replace('function worldEvidence(p=profile){','function worldEvidence(p=profile){/* MUTATED */'));

const output=path.join(ROOT,'artifacts','edukass-quality');
fs.mkdirSync(output,{recursive:true});
const pass=checked.problems.length===0;
const report={pass,baseline:BASELINE_COMMIT,
  source:SOURCE_PATH,protectedSlices:checked.result,
  negativeControls:controls,problems:checked.problems};
fs.writeFileSync(path.join(output,'stolbiki-regression-lock.json'),JSON.stringify(report,null,2));
console.log((pass?'PASS':'FAIL')+' EDUKASS protected mathematics and progress baseline: '+checked.result.length+' slices');
for(const x of checked.result)console.log('  '+(x.pass?'PASS':'FAIL')+' '+x.name);
for(const x of controls)console.log('  '+(x.rejected?'PASS':'FAIL')+' negative: '+x.name);
if(!pass){
  for(const x of checked.problems)console.error('  BLOCK '+x);
  process.exitCode=1;
}