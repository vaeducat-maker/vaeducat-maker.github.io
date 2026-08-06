const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const failures=[];
const passes=[];

function pass(message){passes.push(message)}
function fail(message){failures.push(message)}
function check(condition,message){condition?pass(message):fail(message)}

function walk(directory,predicate=()=>true){
  const files=[];
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    const fullPath=path.join(directory,entry.name);
    if(entry.isDirectory())files.push(...walk(fullPath,predicate));
    else if(entry.isFile()&&predicate(fullPath))files.push(fullPath);
  }
  return files;
}

function runNode(relativePath,args=[]){
  const result=spawnSync(process.execPath,[path.join(root,relativePath),...args],{cwd:root,encoding:'utf8'});
  if(result.status===0){
    pass(`${relativePath}: ${result.stdout.trim()||'passed'}`);
    return;
  }
  fail(`${relativePath}: ${(result.stderr||result.stdout).trim()||`exit ${result.status}`}`);
}

const requiredFiles=[
  'AGENTS.md',
  'CNAME',
  'games/korrutamine-test/index.html',
  'games/korrutamine-test/chapter-one.config.js',
  'games/korrutamine-test/question-engine.js',
  'games/korrutamine-test/i18n.js',
  'games/korrutamine-test/progress-store.js',
  'games/korrutamine-test/locales/et.js',
  'games/korrutamine-test/game.js',
  'games/korrutamine-test/game.css',
  'games/korrutamine-test/tests/mission-config.test.js',
  'games/korrutamine-test/tests/system-foundations.test.js',
  'games/korrutamine-test/tests/live-ui-regressions.test.js',
  'docs/PEDAGOGICAL_CONSTITUTION_RU.md',
  'docs/CREATIVE_RULES_RU.md',
  'docs/LANGUAGE_AND_SAVES_RU.md',
  'docs/INDEPENDENT_AUDIT_CYCLE_RU.md'
];
for(const relativePath of requiredFiles)check(fs.existsSync(path.join(root,relativePath)),`required file exists: ${relativePath}`);

check(fs.readFileSync(path.join(root,'CNAME'),'utf8').trim()==='edukass.ee','CNAME is exactly edukass.ee');

const publicTextFiles=walk(root,file=>/\.(?:html|js|css)$/.test(file));
const oldBrandPhrases=[
  ['KIISU','MIISU'].join(' '),
  ['Kiisu','Miisu'].join(' '),
  ['Kisu','Misu'].join(' ')
];
const oldBrandHits=publicTextFiles
  .filter(file=>oldBrandPhrases.some(phrase=>fs.readFileSync(file,'utf8').includes(phrase)))
  .map(file=>path.relative(root,file));
check(oldBrandHits.length===0,`old public brand is absent${oldBrandHits.length?`: ${oldBrandHits.join(', ')}`:''}`);

const htmlFiles=walk(root,file=>file.endsWith('.html'));
const missingLinks=[];
for(const htmlPath of htmlFiles){
  const html=fs.readFileSync(htmlPath,'utf8');
  const references=[...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match=>match[1]);
  for(const reference of references){
    if(/^(?:https?:|mailto:|tel:|data:|#|javascript:)/.test(reference))continue;
    const pathname=decodeURIComponent(reference.split(/[?#]/)[0]);
    if(!pathname)continue;
    const target=pathname.startsWith('/')
      ? path.resolve(root,pathname.replace(/^\/+/,''))
      : path.resolve(path.dirname(htmlPath),pathname);
    const exists=fs.existsSync(target)&&(fs.statSync(target).isFile()||fs.existsSync(path.join(target,'index.html')));
    if(!exists)missingLinks.push(`${path.relative(root,htmlPath)} -> ${reference}`);
  }
}
check(missingLinks.length===0,`all local links exist across ${htmlFiles.length} HTML files${missingLinks.length?`: ${missingLinks.join(', ')}`:''}`);

const gameIndex=fs.readFileSync(path.join(root,'games/korrutamine-test/index.html'),'utf8');
const expectedScripts=['locales/et.js','chapter-one.config.js','i18n.js','question-engine.js','progress-store.js','game.js'];
let previousIndex=-1;
let scriptOrderValid=true;
for(const script of expectedScripts){
  const index=gameIndex.indexOf(script);
  if(index<0||index<=previousIndex)scriptOrderValid=false;
  previousIndex=index;
}
check(scriptOrderValid,'game dependencies load in the required order');
check(gameIndex.includes('data-i18n='),'HTML contains translation keys');
check(gameIndex.includes('id="shareGameButton"')&&gameIndex.includes('id="shareDialog"'),'game contains the share control and fallback dialog');

const gameCode=fs.readFileSync(path.join(root,'games/korrutamine-test/game.js'),'utf8');
const gameCss=fs.readFileSync(path.join(root,'games/korrutamine-test/game.css'),'utf8');
check(!/switch\s*\(\s*levelId\s*\)/.test(gameCode),'game.js contains no mission-number switch');
check(!gameCode.includes("title:'Korrutamise valik'"),'game.js contains no embedded mission list');
check(gameCode.includes('window.__EDUKASS_TEST__'),'test interface remains available');
check(gameCode.includes("const SHARE_URL='https://edukass.ee/games/korrutamine-test/'"),'share control uses the permanent EDUKASS game URL');
check(/\.reward-chapter-nine[^{]*\.result-cat-crop\s*\{display:none\}/.test(gameCss),'chapter Kümme hides the legacy reward cat');
check(/\.canyon-world::before\s*\{left:0\}/.test(gameCss),'chapter Kümme anchors the left canyon cliff');
check(/\.reward-chapter-ten[^{]*\.result-cat-crop\s*\{display:none\}/.test(gameCss),'dragon chapter hides the legacy reward cat');
check(gameCss.includes('.dragon-one i::before')&&gameCss.includes('.dragon-one i::after'),'dragon residents have distinct heads, eyes and wings');
check(gameCss.includes('transform:scale(.52) rotate(-8deg)')&&gameCss.includes('transform:scale(.48) rotate(7deg)'),'large dragon pair uses the reduced scale');
check(gameCode.includes("if(kind==='missionComplete')")&&gameCode.includes("playSound('missionComplete');"),'mission completion has a dedicated victory sound');
const siteShareCode=fs.readFileSync(path.join(root,'site-share.js'),'utf8');
check(gameIndex.includes('shareGameButton')&&siteShareCode.includes('shareMathGameButton'),'share controls are available both on the site and inside the game');

for(const jsFile of walk(root,file=>file.endsWith('.js'))){
  const result=spawnSync(process.execPath,['--check',jsFile],{cwd:root,encoding:'utf8'});
  if(result.status!==0)fail(`JavaScript syntax: ${path.relative(root,jsFile)}: ${result.stderr.trim()}`);
}
if(!failures.some(message=>message.startsWith('JavaScript syntax:')))pass('JavaScript syntax is valid');

runNode('games/korrutamine-test/tests/mission-config.test.js');
runNode('games/korrutamine-test/tests/system-foundations.test.js');
runNode('games/korrutamine-test/tests/live-ui-regressions.test.js');

console.log('EDUKASS project audit');
passes.forEach(message=>console.log(`PASS  ${message}`));
failures.forEach(message=>console.error(`FAIL  ${message}`));
console.log(`Summary: ${passes.length} passed, ${failures.length} failed.`);
if(failures.length)process.exit(1);
