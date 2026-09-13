export function freshProgress(count=4){return Array.from({length:count},()=>({page:0,answers:Array(5).fill(null),checked:Array(5).fill(false),attempts:Array(5).fill(0),errors:Array(5).fill(0),firstCorrect:Array(5).fill(null)}));}
export function choose(progress,story,question,choice){
  if(!Number.isInteger(story)||story<0||story>=progress.length||!Number.isInteger(question)||question<0||question>=5||!Number.isInteger(choice)||choice<0||choice>3)throw new Error('Invalid choice');
  if(progress[story].answers[question]===choice)return;
  progress[story].answers[question]=choice;progress[story].checked[question]=false;
}
export function check(progress,stories,story,question){
  const p=progress[story];if(!p||!Number.isInteger(question)||question<0||question>=5)throw new Error('Invalid question');
  if(p.answers[question]===null)return {empty:true,correct:false};
  const correct=p.answers[question]===stories[story].questions[question][2].charCodeAt(0)-65;
  if(!p.checked[question]){
    p.attempts[question]++;
    if(!correct)p.errors[question]++;
    if(p.firstCorrect[question]===null)p.firstCorrect[question]=correct;
  }
  p.checked[question]=true;
  return {empty:false,correct,errors:p.errors[question]};
}
export function score(progress,stories,story){return progress[story].answers.reduce((n,a,q)=>n+(progress[story].checked[q]&&a===stories[story].questions[q][2].charCodeAt(0)-65?1:0),0);}
export function isCorrect(progress,stories,story,q){return progress[story].checked[q]&&progress[story].answers[q]===stories[story].questions[q][2].charCodeAt(0)-65;}
export function errorCount(progress,story){return progress[story].errors.reduce((a,b)=>a+b,0);}
export function firstCorrectCount(progress,story){return progress[story].firstCorrect.filter(v=>v===true).length;}

// Keep this key stable. Future schema changes must migrate existing saves.
export const progressKey='edukass-hommikulood-progress';
export function encodeProgress(state){
  const {view,story,page,question,progress}=state;
  return JSON.stringify({version:1,view,story,page,question,progress});
}
export function decodeProgress(raw,pageCounts){
  if(raw===null)return null;
  const saved=JSON.parse(raw),integer=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<max;
  if(!saved||saved.version!==1||!['home','read','quiz','result'].includes(saved.view)||
    !integer(saved.story,pageCounts.length)||!integer(saved.question,5)||
    !Array.isArray(saved.progress)||saved.progress.length!==pageCounts.length)throw Error('Invalid saved progress');
  const progress=saved.progress.map((p,i)=>{
    if(!p||!integer(p.page,pageCounts[i]))throw Error('Invalid saved page');
    const fields=['answers','checked','attempts','errors','firstCorrect'];
    if(fields.some(key=>!Array.isArray(p[key])||p[key].length!==5))throw Error('Invalid saved answers');
    for(let q=0;q<5;q++){
      if(!(p.answers[q]===null||integer(p.answers[q],4))||typeof p.checked[q]!=='boolean'||
        !integer(p.attempts[q],Number.MAX_SAFE_INTEGER)||!integer(p.errors[q],Number.MAX_SAFE_INTEGER)||
        p.errors[q]>p.attempts[q]||!(p.firstCorrect[q]===null||typeof p.firstCorrect[q]==='boolean')||
        (p.checked[q]&&(p.answers[q]===null||p.attempts[q]===0))||
        (p.attempts[q]===0)!==(p.firstCorrect[q]===null))throw Error('Invalid saved statistics');
    }
    return Object.fromEntries([['page',p.page],...fields.map(key=>[key,p[key].slice()])]);
  });
  const page=saved.view==='read'?saved.page:progress[saved.story].page;
  if(!integer(page,pageCounts[saved.story]))throw Error('Invalid saved location');
  return {view:saved.view,story:saved.story,page,question:saved.question,progress,empty:false};
}

if(typeof document!=='undefined')queueMicrotask(()=>{
  const titles=['Kus on mu telefon?','Kadunud sokk','Ma jäin bussist maha','Vale pusa'];
  const prompts=[
    'Räägi 2–3 lausega: kas oled kunagi midagi otsinud, kuigi see oli sul tegelikult lähedal?',
    'Räägi 2–3 lausega: kuhu võivad sokid sinu kodus kaduma minna?',
    'Räägi 2–3 lausega: mida teed sina, kui jääd bussist maha?',
    'Räägi 2–3 lausega: mis võib juhtuda, kui paned riidesse peaaegu pimedas?'
  ];
  const expressions=[
    [
      {word:'Kuhu ma selle panin?',form:'kuhu ... panin?',example:'„Kuhu ma selle panin?” mõtlesin.',alt:'Poiss otsib oma telefoni.',cell:0,sheet:1},
      {word:'taskulampi põlema panema',form:'panin taskulambi põlema',example:'Panin telefonis taskulambi põlema.',alt:'Põlev taskulamp.',cell:1},
      {word:'kogu aeg',form:'',example:'Telefon oli mul kogu aeg käes.',alt:'Telefon poisi käes.',cell:0,sheet:1}
    ],
    [
      {word:'riidesse saama',form:'tahtsin riidesse saada',example:'Hommikul tahtsin kiiresti riidesse saada.',alt:'Poiss paneb riideid selga.',cell:22},
      {word:'teise paari võtma',form:'võtsin teise paari',example:'Võtsin sahtlist teise paari.',alt:'Avatud sahtel sokkidega.',cell:7},
      {word:'pea alt ära võtma',form:'võtsin pea alt ära',example:'Võtsin soki Miisu pea alt ära.',alt:'Sinine sokk kassi pea all.',cell:9}
    ],
    [
      {word:'bussist maha jääma',form:'jäin bussist maha',example:'Seekord oli isegi hea, et ma bussist maha jäin.',alt:'Bussipeatus ja ärasõitev buss.',cell:12},
      {word:'tuli meelde',form:'tuli mulle meelde',example:'Siis tuli mulle korraga meelde: mu spordiriided olid kodus!',alt:'Spordiriided.',cell:13},
      {word:'eri värvi',form:'',example:'Mu sokid olid eri värvi.',alt:'Kaks eri värvi sokki.',cell:17}
    ],
    [
      {word:'tuld põlema panema',form:'panin tule põlema',example:'Järgmisel hommikul panin kõigepealt tule põlema.',alt:'Poiss paneb tule põlema.',cell:33,sheet:1},
      {word:'tagurpidi selga panema',form:'panin pusa tagurpidi selga',example:'Olin pusa tagurpidi selga pannud.',alt:'Pusa on tagurpidi.',cell:34,sheet:1},
      {word:'õigesti selga panema',form:'panin pusa õigesti selga',example:'Läksin tualetti ja panin pusa õigesti selga.',alt:'Pusa on õigesti seljas.',cell:35,sheet:1}
    ]
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=s=>String(s).toLocaleLowerCase('et').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let expressionMode=false;

  function storyIndexFromWords(){
    const label=document.querySelector('#words-story')?.textContent.trim()||'';
    if(label==='Kõigi lugude sõnad')return -1;
    return titles.indexOf(label);
  }
  function activeExpressions(){const i=storyIndexFromWords();return i<0?expressions.flat():expressions[i]||[]}
  function renderExpressions(){
    if(!expressionMode)return;
    const grid=document.querySelector('#words-grid'),count=document.querySelector('#words-count'),search=document.querySelector('#words-search');
    if(!grid||!count||!search)return;
    const source=activeExpressions(),q=norm(search.value.trim());
    const items=source.filter(x=>norm(`${x.word} ${x.form} ${x.example}`).includes(q));
    count.textContent=`${items.length} / ${source.length} väljendikaarti`;
    grid.innerHTML=items.map(x=>`<article class="word-card"><div class="word-picture${x.sheet?' word-picture-extra':''}" role="img" aria-label="${esc(x.alt)}" style="background-position:${x.cell%6*20}% ${Math.floor(x.cell/6)*100/(x.sheet?5:3)}%"></div><div class="word-copy"><h3>${esc(x.word)}</h3>${x.form?`<p class="word-form"><span aria-hidden="true">→ </span>${esc(x.form)}</p>`:''}<p class="word-example">${esc(x.example)}</p></div></article>`).join('')||'<p class="words-empty">Ühtegi väljendit ei leitud.</p>';
  }
  function ensureExpressionButton(){
    const filters=document.querySelector('.word-filters');
    if(!filters||filters.querySelector('[data-expression-filter]'))return;
    const button=document.createElement('button');button.type='button';button.dataset.expressionFilter='true';button.textContent='Väljendid';button.setAttribute('aria-pressed','false');filters.append(button);
    button.addEventListener('click',()=>{expressionMode=true;filters.querySelectorAll('[data-word-filter]').forEach(x=>x.setAttribute('aria-pressed','false'));button.setAttribute('aria-pressed','true');renderExpressions()});
  }
  function resetExpressions(){expressionMode=false;document.querySelector('[data-expression-filter]')?.setAttribute('aria-pressed','false')}

  function enhance(){
    ensureExpressionButton();
    const intro=document.querySelector('.intro');
    if(intro&&!intro.querySelector('.hommikulood-print-link')){
      const wrap=document.createElement('div');wrap.className='result-actions hommikulood-print-link';wrap.innerHTML='<a class="secondary" href="?print=1">Prinditav versioon →</a>';intro.append(wrap);
    }
    const result=document.querySelector('.result');
    if(!result)return;
    const title=result.querySelector('.eyebrow')?.textContent.trim()||'';const i=titles.indexOf(title);
    if(i>=0&&!result.querySelector('.speak-prompt')){
      const card=document.createElement('div');card.className='teacher-note speak-prompt';card.innerHTML=`<strong>Räägi ise</strong><br>${esc(prompts[i])}`;const actions=result.querySelector('.result-actions');(actions||result).insertAdjacentElement(actions?'beforebegin':'beforeend',card);
    }
    const actions=result.querySelector('.result-actions');
    if(actions&&!actions.querySelector('.result-print-link')){const link=document.createElement('a');link.className='secondary result-print-link';link.href='?print=1';link.textContent='Prinditav versioon';actions.append(link)}
  }

  function renderPrint(stories){
    document.body.classList.add('print-mode');
    const main=document.querySelector('#main'),bottom=document.querySelector('#bottom');if(!main)return;
    bottom.innerHTML='';
    const letters=['A','B','C','D'];
    const clean=s=>String(s).replace(/<\/?b>/g,'');
    main.innerHTML=`<nav class="print-toolbar"><a href="./">← Tagasi online-versiooni</a><button type="button" id="print-now">Prindi / salvesta PDF</button></nav>`;
    for(let si=0;si<stories.length;si++){
      const story=stories[si],page=document.createElement('section');page.className='print-sheet';page.id=`lugu-${si+1}`;
      const paras=story.paras.map(p=>`<p>${esc(clean(p))}</p>`).join('');
      const questions=story.questions.map((q,qi)=>`<div class="print-q"><span class="print-n">${qi+1}</span><div><h3>${esc(q[0])}</h3><div class="print-opts">${q[1].map((o,oi)=>`<span>${letters[oi]}. ${esc(o)}</span>`).join('')}</div></div></div>`).join('');
      page.innerHTML=`<h1>${esc(story.title)}</h1><div class="print-story"><div class="print-text">${paras}</div><img src="${story.image}" alt="${esc(story.title)} illustratsioon"></div><section class="print-questions"><h2>VASTA KÜSIMUSTELE.</h2>${questions}</section><footer class="print-footer"><span><img src="assets/kiisu.png" alt=""> edukass.ee</span><span>Online: edukass.ee/materials/hommikulood/</span></footer>`;
      main.append(page);
    }
    const answers=document.createElement('section');answers.className='print-sheet print-answers';answers.innerHTML=`<h1>VASTUSED</h1><div class="print-answer-grid">${stories.map((story,si)=>`<article><h2>${si+1}. ${esc(story.title)}</h2><p>${story.questions.map((q,qi)=>`${qi+1} – ${q[2]}`).join('<br>')}</p></article>`).join('')}</div><footer class="print-footer"><span><img src="assets/kiisu.png" alt=""> edukass.ee</span><span>Õppimine algab uudishimust.</span></footer>`;main.append(answers);
    const style=document.createElement('style');style.textContent=`body.print-mode{background:#eef6fc}.print-mode .topbar{display:none}.print-mode main{width:auto;max-width:none;padding:0}.print-toolbar{position:sticky;top:0;z-index:10;display:flex;justify-content:center;gap:12px;padding:12px;background:white;border-bottom:1px solid #c8dff0}.print-toolbar a,.print-toolbar button{min-height:44px;padding:10px 16px;border-radius:12px;border:1px solid #bdd5eb;background:white;color:#0752b8;font:700 15px Arial;text-decoration:none}.print-toolbar button{background:#0752b8;color:white}.print-sheet{width:210mm;min-height:297mm;margin:14px auto;padding:12mm 12mm 10mm;background:#fff;position:relative;page-break-after:always}.print-sheet>h1{margin:0 0 7mm;padding:4mm 7mm;border-radius:18px;background:#e7f3fd;text-align:center;color:#0a4caf;font-size:25pt}.print-story{display:grid;grid-template-columns:43% 57%;gap:7mm}.print-text{font-size:10.8pt;line-height:1.4}.print-text p{margin:0 0 2.4mm}.print-story img{width:100%;max-height:126mm;object-fit:cover;border-radius:16px}.print-questions{margin-top:7mm;padding:6mm;border:1.4px solid #82c0ef;border-radius:16px;background:#fbfdff}.print-questions h2{margin:0 0 4mm;color:#0752b8;font-size:18pt}.print-q{display:grid;grid-template-columns:9mm 1fr;gap:3mm;padding:3mm 0;border-top:1px solid #d2e8f7}.print-q:first-of-type{border-top:0}.print-n{width:8mm;height:8mm;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#1270d6;color:#fff;font-weight:800}.print-q h3{margin:0 0 2mm;font-size:11pt;color:#163b72}.print-opts{display:grid;grid-template-columns:1fr 1fr;gap:1.5mm 6mm;font-size:9.8pt;line-height:1.28}.print-footer{position:absolute;left:12mm;right:12mm;bottom:5mm;border-top:1px solid #1d67c6;padding-top:2mm;display:flex;justify-content:space-between;align-items:center;font-size:8.5pt;color:#28537f}.print-footer span:first-child{display:flex;align-items:center;gap:2mm;font-weight:800;color:#0752b8}.print-footer img{width:8mm}.print-answer-grid{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin-top:12mm}.print-answer-grid article{padding:8mm;border:1px solid #cae1f2;border-radius:18px;background:#eef7ff}.print-answer-grid h2{font-size:17pt;color:#0752b8}.print-answer-grid p{font-size:15pt;line-height:1.65;font-weight:700}@page{size:A4;margin:0}@media print{body.print-mode{background:#fff}.print-toolbar{display:none}.print-sheet{margin:0}.print-sheet:last-child{page-break-after:auto}}`;document.head.append(style);
    document.querySelector('#print-now')?.addEventListener('click',()=>window.print());
  }

  document.querySelector('#words-search')?.addEventListener('input',()=>{if(expressionMode)queueMicrotask(renderExpressions)});
  document.querySelector('#words-dialog')?.addEventListener('click',e=>{if(e.target.closest('[data-word-filter]'))resetExpressions()});
  document.addEventListener('click',e=>{if(e.target.closest('[data-action="words"]')){resetExpressions();queueMicrotask(ensureExpressionButton)}});
  new MutationObserver(enhance).observe(document.querySelector('#main'),{childList:true,subtree:true});

  if(new URLSearchParams(location.search).get('print')==='1'){
    import('./data.js').then(({stories})=>renderPrint(stories));
  }else enhance();
});
