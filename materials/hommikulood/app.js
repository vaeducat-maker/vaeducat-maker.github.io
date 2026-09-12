import {stories} from './data.js';
import {vocabulary} from './vocabulary.js';
import {freshProgress,choose,check,score,isCorrect,errorCount,firstCorrectCount} from './engine.js';

const main=document.querySelector('#main'),bottom=document.querySelector('#bottom'),dialog=document.querySelector('#text-dialog');
const state={view:'home',story:0,page:0,question:0,progress:freshProgress(stories.length),empty:false};
const plans=[
  [{range:[0,5],crop:[0,0,565,393],alt:'Poiss otsib telefoni voodi alt.'},{range:[5,10],crop:null},{range:[10,13],crop:[0,401,565,341],alt:'Poiss märkab, et telefon on tal käes.'}],
  [{range:[0,4],crop:[0,0,1115,681],alt:'Poiss hoiab käes kahte halli sokki ja ühte sinist sokki.'},{range:[4,8],crop:[0,703,1115,707],alt:'Miisu magab korvis, sinine sokk pea all.'},{range:[8,11],crop:null}],
  [{range:[0,3],crop:[0,820,439,610],alt:'Poisil on jalas musta-valgetriibuline ja roheline täpiline sokk.'},{range:[3,5],crop:[0,0,1100,793],alt:'Buss sõidab ära. Karl lehvitab poisile aknast.'},{range:[5,8],crop:[461,822,639,608],alt:'Poiss vaatab peatuses telefoni. Talle tulevad meelde koju jäänud spordiriided.'},{range:[8,10],crop:null}],
  [{range:[0,4],crop:[0,0,1098,706],alt:'Markus märkab poisi tagurpidi pusa.'},{range:[4,9],crop:[0,729,1098,704],alt:'Pusa on tagurpidi: eesmine tasku on poisi seljal.',caption:'Nii oli pusa enne seljas.'},{range:[9,12],crop:null}]
];
const evidence=[
 ['„Ma ei leidnud oma telefoni.”','„Otsisin telefoni koolikotist, jope taskust ja isegi vannitoast.”','„Siis vaatasin voodi alla. Seal oli liiga pime.”','„Vaata oma kätt,” ütles ema.','„Olin juba mitu minutit telefoni otsinud, kuigi see oli mul kogu aeg käes.”'],
 ['„Leidsin ühe sinise soki, aga teist ei olnud kuskil.”','„Võtsin sahtlist teise paari, aga nüüd oli mul kolm sokki: kaks halli ja üks sinine.”','„Miisu pea all oli midagi sinist. Minu sokk!”','„Võtsin sahtlist teise paari” on tekstis enne nurrumise kuulmist.','„Võtsin soki ettevaatlikult Miisu pea alt ära. Miisu ei olnud üldse rahul.”'],
 ['„Täna hommikul ärkasin liiga hilja.”','„Kui ma bussipeatusesse jõudsin, sõitis mu buss just ära.”','„Võtsin telefoni välja ja vaatasin eKoolist tunniplaani.”','„Alles esikus märkasin, et mu sokid olid eri värvi.”','„Jooksin koju, panin spordiriided kotti ja vahetasin ka sokid ära.”'],
 ['„Ma ei pannud isegi tuld põlema.”','„Mu sõber Markus vaatas mind ja hakkas naerma.”','„Olin pusa tagurpidi selga pannud.”','„Läksin tualetti ja panin pusa õigesti selga.”','„Järgmisel hommikul panin kõigepealt tule põlema.”']
];
const descriptions=['Telefon on kadunud. Või siiski mitte?','Üks sinine sokk on puudu.','Kiire hommik ja üks ununenud asi.','Hämaras võib nii mõndagi juhtuda.'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=s=>esc(s).replace(/&lt;b&gt;/g,'<b>').replace(/&lt;\/b&gt;/g,'</b>');
const text=paras=>paras.map(p=>`<p>${rich(p)}</p>`).join('');
const footer=()=>'<footer class="footer"><img src="assets/kiisu.png" alt=""><span><a href="https://edukass.ee">edukass.ee</a> · Õppimine algab uudishimust.</span></footer>';
function crop(story,rect,alt,thumbnail=false){
  const [x,y,w,h]=rect,[iw]=stories[story].dimensions;
  return `<div class="crop" style="aspect-ratio:${w}/${h}"><img src="${stories[story].image}" alt="${esc(alt)}" ${thumbnail?'loading="lazy"':''} decoding="async" style="width:${iw/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></div>`;
}
function move(view,changes={}){Object.assign(state,{view,empty:false},changes);render(true);}
function frame(){
  const p=state.progress[state.story],steps=plans[state.story].length;
  return `<div class="lesson-nav"><button class="back-link" data-action="home">‹ Kõik lood</button><span class="lesson-label">Lugu ${state.story+1} / 4</span></div><h1>${esc(stories[state.story].title)}</h1><div class="phase" aria-label="${state.view==='read'?'Lugemine':'Küsimused'}">${Array.from({length:steps+5},(_,i)=>`<span class="${state.view==='read'?(i<state.page?'done':i===state.page?'on':''):(i<steps?'done':i===steps+state.question?'on':p.checked[i-steps]?'done':'')}"></span>`).join('')}</div>`;
}
function home(){
  main.innerHTML=`<section class="intro"><p class="eyebrow">Eesti keel · Minilood</p><h1>Hommikulood</h1><p>Loe üks lugu. Vali vastused.<br>Vaata, kuidas sul läks.</p><span class="pill">4 lugu · 5 küsimust igas loos</span></section><div class="story-grid">${stories.map((s,i)=>{
    const p=state.progress[i],done=p.checked.every(Boolean),started=p.page>0||p.answers.some(a=>a!==null);
    return `<article class="story-card">${crop(i,plans[i][0].crop,plans[i][0].alt,true)}<div class="card-copy"><div class="card-meta"><span>Lugu ${i+1}</span><span>${done?`${score(state.progress,stories,i)} / 5 õiget`:'5 küsimust'}</span></div><h2>${esc(s.title)}</h2><p>${descriptions[i]}</p><button class="primary" data-action="start" data-story="${i}">${done?'Vaata tulemust':started?'Jätka lugu':'Loe lugu'} <span aria-hidden="true">→</span></button></div></article>`;
  }).join('')}</div>${footer()}`;
  bottom.innerHTML='';
}
const wordsButton=()=>'<button class="secondary words-button" data-action="words" aria-haspopup="dialog" aria-controls="words-dialog"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z"/><path d="M12 5v15"/></svg>Pildisõnastik</button>';
function reading(){
  const s=stories[state.story],plan=plans[state.story][state.page],last=state.page===plans[state.story].length-1;
  state.progress[state.story].page=state.page;
  main.innerHTML=`<section class="lesson">${frame()}<div class="reading-tools"><div class="read-count"><span>Loe · ${state.page+1} / ${plans[state.story].length}</span>${plans[state.story].map((_,i)=>`<i class="${i===state.page?'on':''}" aria-hidden="true"></i>`).join('')}</div>${wordsButton()}</div><article class="reading">${plan.crop?crop(state.story,plan.crop,plan.alt):''}${plan.caption?`<p class="caption">${plan.caption}</p>`:''}<div class="reading-text">${text(s.paras.slice(...plan.range))}</div></article>${last?'<p class="mini-label">Nüüd saad vastata viiele küsimusele. Teksti saab küsimuste juures uuesti avada.</p>':''}</section>`;
  bottom.innerHTML=`<nav class="fixed-bottom" aria-label="Loo leheküljed"><div class="bottom-inner"><button class="secondary" data-action="prev-read" ${state.page===0?'disabled':''} aria-label="Eelmine lehekülg">←</button><button class="primary" data-action="next-read">${last?'Küsimuste juurde':'Järgmine lehekülg'} <span aria-hidden="true">→</span></button></div></nav>`;
}
function quiz(){
  const s=stories[state.story],p=state.progress[state.story],q=state.question,[question,options]=s.questions[q],checked=p.checked[q],correct=isCorrect(state.progress,stories,state.story,q);
  main.innerHTML=`<section class="lesson">${frame()}<div class="question-head"><span class="question-count">Küsimus ${q+1} / 5</span><div class="study-tools"><button class="secondary" data-action="text">Loe teksti</button>${wordsButton()}</div></div><div class="question-card"><fieldset><legend>${esc(question)}</legend><div class="options">${options.map((o,i)=>`<label class="option ${p.answers[q]===i?'selected '+(checked?(correct?'correct':'wrong'):''):''}" for="option-${i}"><input type="radio" name="answer" id="option-${i}" value="${i}" ${p.answers[q]===i?'checked':''}><span class="letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${esc(o)}</span></label>`).join('')}</div></fieldset>${checked?`<div class="feedback ${correct?'':'wrong'}" role="status"><strong>${correct?'✓ Õige!':'Veel mitte. Proovi uuesti.'}</strong><p>${correct?esc(evidence[state.story][q]):'Ava tekst ja otsi kohta, mis aitab vastata. Seejärel vali teine vastus.'}</p></div>`:state.empty?'<p class="empty-feedback" role="alert">Vali kõigepealt üks vastus.</p>':''}</div><nav class="question-dots" aria-label="Vali küsimus">${s.questions.map((_,i)=>`<button data-action="question" data-q="${i}" class="${i===q?'active ':''}${p.checked[i]?(isCorrect(state.progress,stories,state.story,i)?'correct':'wrong'):''}" aria-label="Küsimus ${i+1}${p.checked[i]?(isCorrect(state.progress,stories,state.story,i)?', õige':', proovi uuesti'):p.answers[i]!==null?', valitud, kontrollimata':''}" ${i===q?'aria-current="step"':''}>${i+1}</button>`).join('')}</nav></section>`;
  bottom.innerHTML=`<nav class="fixed-bottom" aria-label="Küsimuste leheküljed"><div class="bottom-inner"><button class="secondary" data-action="prev-question" aria-label="${q===0?'Tagasi loo juurde':'Eelmine küsimus'}">←</button><button class="primary" data-action="${checked?'next-question':'check'}">${checked?(q===4?'Vaata tulemust':'Järgmine küsimus'):'Kontrolli vastust'}${checked?' <span aria-hidden="true">→</span>':''}</button></div></nav>`;
}
function result(){
  const p=state.progress[state.story],n=score(state.progress,stories,state.story),missing=p.checked.filter(c=>!c).length,errors=errorCount(state.progress,state.story),first=firstCorrectCount(state.progress,state.story);
  main.innerHTML=`<section class="lesson"><div class="lesson-nav"><button class="back-link" data-action="home">‹ Kõik lood</button><span class="lesson-label">Lugu ${state.story+1} / 4</span></div></section><section class="result"><p class="eyebrow">${esc(stories[state.story].title)}</p><div class="score">${n}<small>/ 5</small></div><div class="result-stats"><div><strong>${errors}</strong><span>Eksimusi kokku</span></div><div><strong>${first}<small> / 5</small></strong><span>Õige esimesel katsel</span></div></div><p class="stats-note">Iga kontrollitud vale vastus loeb ühe eksimusena. Parandamine eksimuste arvu ei vähenda.</p><h1>${n===5?(errors?'Kõik vastused on nüüd õiged!':'Kõik vastused on õiged!'):missing?'Lõpeta vastamine':'Vaata vastused üle'}</h1><p>${n===5?'Tubli töö! Oled selle loo läbi lugenud ja küsimustele vastanud.':missing?`${missing} ${missing===1?'vastus on':'vastust on'} veel kontrollimata.`:'Õiged vastused on alles. Saad teisi vastuseid uuesti proovida.'}</p>${stories[state.story].questions.map((_,q)=>`<div class="review-row"><span>Küsimus ${q+1}<small class="question-history">${p.errors[q]} ${p.errors[q]===1?'eksimus':'eksimust'}</small></span><span class="status ${isCorrect(state.progress,stories,state.story,q)?'green':'orange'}">${isCorrect(state.progress,stories,state.story,q)?'✓ Õige':p.checked[q]?'Proovi uuesti':'Kontrollimata'}</span><button data-action="question" data-q="${q}" aria-label="Ava küsimus ${q+1}">Vaata</button></div>`).join('')}<div class="result-actions">${n<5?'<button class="primary" data-action="retry">Proovi ülejäänuid uuesti</button>':state.story<3?`<button class="primary" data-action="start" data-story="${state.story+1}">Järgmine lugu →</button>`:'<button class="primary" data-action="home">Kõik lood</button>'}<button class="secondary" data-action="reread">Loe lugu uuesti</button>${wordsButton()}<button class="text-link" data-action="reset">Alusta seda lugu otsast</button></div></section>${footer()}`;
  bottom.innerHTML='';
}
function render(scroll=false,focusId=null){
  document.querySelector('#all-words-button').hidden=state.view!=='home';
  document.body.classList.toggle('in-lesson',state.view==='read'||state.view==='quiz');
  ({home,read:reading,quiz,result}[state.view])();
  document.title=state.view==='home'?'Hommikulood · EDUKASS':`${stories[state.story].title} · EDUKASS`;
  if(scroll){window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});}
  if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});
}
function openText(i){
  document.querySelector('#dialog-title').textContent=stories[i].title;
  document.querySelector('#dialog-body').innerHTML=wordsButton()+text(stories[i].paras);
  dialog.querySelector('.primary').textContent='Tagasi küsimuse juurde';
  dialog.showModal();dialog.scrollTop=0;
}
const wordsDialog=document.querySelector('#words-dialog');
let wordFilter='all',allWords=false;
const combinedVocabulary=[...new Map(vocabulary.flat().map(entry=>[entry.word,entry])).values()].sort((a,b)=>a.word.localeCompare(b.word,'et'));
const activeVocabulary=()=>allWords?combinedVocabulary:vocabulary[state.story];
const normalizeWord=s=>s.toLocaleLowerCase('et').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function renderWords(){
  const query=normalizeWord(document.querySelector('#words-search').value.trim());
  const entries=activeVocabulary().filter(entry=>(wordFilter==='all'||entry.group===wordFilter)&&normalizeWord(`${entry.word} ${entry.form} ${entry.example}`).includes(query));
  document.querySelector('#words-count').textContent=`${entries.length} / ${activeVocabulary().length} sõnakaarti`;
  document.querySelector('#words-grid').innerHTML=entries.map(entry=>`<article class="word-card"><div class="word-picture${entry.sheet?' word-picture-extra':''}" role="img" aria-label="${esc(entry.alt)}" style="background-position:${entry.cell%6*20}% ${Math.floor(entry.cell/6)*100/(entry.sheet?5:3)}%"></div><div class="word-copy"><h3>${esc(entry.word)}</h3>${entry.form?`<p class="word-form"><span class="sr-only">Tekstis: </span><span aria-hidden="true">→ </span>${esc(entry.form)}</p>`:''}<p class="word-example">${esc(entry.example)}</p></div></article>`).join('')||'<p class="words-empty">Ühtegi sõna ei leitud. Proovi teist sõna või vali „Kõik”.</p>';
  wordsDialog.querySelectorAll('[data-word-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.wordFilter===wordFilter)));
}
function openWords(all=false){
  allWords=all;
  document.querySelector('#words-story').textContent=allWords?'Kõigi lugude sõnad':stories[state.story].title;
  wordFilter='all';document.querySelector('#words-search').value='';renderWords();
  document.querySelector('#words-return').textContent=allWords?'Tagasi avalehele':dialog.open?'Tagasi teksti juurde':state.view==='quiz'?'Tagasi küsimuse juurde':state.view==='result'?'Tagasi tulemuse juurde':'Tagasi loo juurde';
  wordsDialog.showModal();
  wordsDialog.scrollTop=0;
}
document.querySelector('#words-search').addEventListener('input',renderWords);
wordsDialog.addEventListener('click',e=>{
  const button=e.target.closest('[data-word-filter]');if(!button)return;
  wordFilter=button.dataset.wordFilter;renderWords();
});
wordsDialog.addEventListener('click',e=>{
  if(e.target.closest('[data-action="words-close"]'))wordsDialog.close();
  if(e.target===wordsDialog){const r=wordsDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)wordsDialog.close();}
});
function start(i){
  if(!Number.isInteger(i)||i<0||i>=stories.length)throw Error('Unknown story');
  const p=state.progress[i];
  if(p.checked.every(Boolean))move('result',{story:i});
  else if(p.answers.some(a=>a!==null))move('quiz',{story:i,question:Math.max(0,p.checked.findIndex(v=>!v))});
  else move('read',{story:i,page:p.page});
}
function select(q,i){choose(state.progress,state.story,q,i);state.question=q;state.empty=false;render(false,`option-${i}`);}
function checkCurrent(){
  const r=check(state.progress,stories,state.story,state.question);state.empty=r.empty;render();
  document.querySelector('#live').textContent=r.empty?'Vali kõigepealt üks vastus.':r.correct?'Õige vastus!':'Veel mitte. Loe teksti ja proovi uuesti.';
  document.querySelector('#bottom .primary')?.focus({preventScroll:true});
  return r;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
  const action=b.dataset.action;
  if(action==='home')move('home');
  if(action==='start')start(Number(b.dataset.story));
  if(action==='next-read')state.page<plans[state.story].length-1?move('read',{page:state.page+1}):move('quiz',{question:0});
  if(action==='prev-read'&&state.page>0)move('read',{page:state.page-1});
  if(action==='check')checkCurrent();
  if(action==='next-question')state.question<4?move('quiz',{question:state.question+1}):move('result');
  if(action==='prev-question')state.question>0?move('quiz',{question:state.question-1}):move('read',{page:plans[state.story].length-1});
  if(action==='question')move('quiz',{question:Number(b.dataset.q)});
  if(action==='text')openText(state.story);
  if(action==='words')openWords(b.dataset.scope==='all');
  if(action==='close')dialog.close();
  if(action==='reread')move('read',{page:0});
  if(action==='retry'){const q=state.progress[state.story].answers.findIndex((_,q)=>!isCorrect(state.progress,stories,state.story,q));move('quiz',{question:Math.max(q,0)});}
  if(action==='reset'&&window.confirm('Kas alustada seda lugu otsast? Selle loo vastused ja eksimuste arv kustutatakse.')){state.progress[state.story]=freshProgress(1)[0];move('read',{page:0});}
});
document.addEventListener('change',e=>{if(e.target.matches('input[name="answer"]'))select(state.question,Number(e.target.value));});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.addEventListener('keydown',e=>{if(dialog.open||wordsDialog.open||e.target.matches('input,button,a,summary'))return;if(state.view==='read'&&e.key==='ArrowRight'){e.preventDefault();document.querySelector('[data-action="next-read"]')?.click();}if(state.view==='read'&&e.key==='ArrowLeft'&&state.page>0){e.preventDefault();move('read',{page:state.page-1});}});
render();

let touchStart=null;
main.addEventListener('touchstart',e=>{if(state.view==='read'&&e.touches.length===1&&e.target.closest('.reading'))touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};else touchStart=null;},{passive:true});
main.addEventListener('touchend',e=>{if(!touchStart||state.view!=='read')return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>85&&Math.abs(dy)<45){if(dx<0)document.querySelector('[data-action="next-read"]')?.click();else if(state.page>0)move('read',{page:state.page-1});}},{passive:true});

// Expose the same worksheet actions only when the browser supports WebMCP.
if(document.modelContext?.registerTool){
  const controller=new AbortController();
  const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:controller.signal})).catch(()=>{});}catch{}};
  register({name:'get_learning_progress',description:'Read the current story and checked answer counts. Does not reveal answer keys.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({view:state.view,story:state.story+1,results:stories.map((s,i)=>({title:s.title,correct:score(state.progress,stories,i),checked:state.progress[i].checked.filter(Boolean).length,errors:errorCount(state.progress,i),correctOnFirstTry:firstCorrectCount(state.progress,i)}))})});
  register({name:'open_story',description:'Open an EDUKASS story in the reading or current exercise view.',inputSchema:{type:'object',properties:{story:{type:'integer',minimum:1,maximum:4}},required:['story'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!Number.isInteger(input?.story)||input.story<1||input.story>4)throw Error('Story must be 1–4');start(input.story-1);return {view:state.view,story:state.story+1};}});
  register({name:'select_and_check_answer',description:'Select and check one answer in the current story. This updates the visible student worksheet.',inputSchema:{type:'object',properties:{question:{type:'integer',minimum:1,maximum:5},answer:{type:'string',enum:['A','B','C','D']}},required:['question','answer'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!Number.isInteger(input?.question)||input.question<1||input.question>5||!['A','B','C','D'].includes(input.answer))throw Error('Invalid question or answer');if(!['read','quiz','result'].includes(state.view))throw Error('Open a story first');state.view='quiz';select(input.question-1,input.answer.charCodeAt(0)-65);return checkCurrent();}});
  window.addEventListener('pagehide',()=>controller.abort(),{once:true});
}
