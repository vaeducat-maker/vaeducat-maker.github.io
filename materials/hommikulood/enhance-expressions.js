const storyTitles=['Kus on mu telefon?','Kadunud sokk','Ma jäin bussist maha','Pusa on tagurpidi'];
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
let mode=false;
function currentEntries(){
  const label=document.querySelector('#words-story')?.textContent.trim()||'';
  if(label==='Kõigi lugude sõnad')return expressions.flat();
  const i=storyTitles.indexOf(label);
  return i>=0?expressions[i]:[];
}
function render(){
  if(!mode)return;
  const grid=document.querySelector('#words-grid'),count=document.querySelector('#words-count'),search=document.querySelector('#words-search');
  if(!grid||!count||!search)return;
  const source=currentEntries(),q=norm(search.value.trim());
  const items=source.filter(x=>norm(`${x.word} ${x.form} ${x.example}`).includes(q));
  count.textContent=`${items.length} / ${source.length} väljendikaarti`;
  grid.innerHTML=items.map(x=>`<article class="word-card"><div class="word-picture${x.sheet?' word-picture-extra':''}" role="img" aria-label="${esc(x.alt)}" style="background-position:${x.cell%6*20}% ${Math.floor(x.cell/6)*100/(x.sheet?5:3)}%"></div><div class="word-copy"><h3>${esc(x.word)}</h3>${x.form?`<p class="word-form"><span aria-hidden="true">→ </span>${esc(x.form)}</p>`:''}<p class="word-example">${esc(x.example)}</p></div></article>`).join('')||'<p class="words-empty">Ühtegi väljendit ei leitud.</p>';
}
function ensureButton(){
  const filters=document.querySelector('.word-filters');
  if(!filters||filters.querySelector('[data-expression-filter]'))return;
  filters.setAttribute('aria-label','Sõnade ja väljendite rühmad');
  const b=document.createElement('button');
  b.type='button';b.dataset.expressionFilter='true';b.textContent='Väljendid';b.setAttribute('aria-pressed','false');
  filters.append(b);
  b.addEventListener('click',()=>{
    mode=true;
    filters.querySelectorAll('[data-word-filter]').forEach(x=>x.setAttribute('aria-pressed','false'));
    b.setAttribute('aria-pressed','true');
    render();
  });
}
function reset(){mode=false;document.querySelector('[data-expression-filter]')?.setAttribute('aria-pressed','false')}
const dialog=document.querySelector('#words-dialog');
if(dialog)dialog.addEventListener('click',e=>{if(e.target.closest('[data-word-filter]'))reset()});
document.querySelector('#words-search')?.addEventListener('input',()=>{if(mode)queueMicrotask(render)});
document.addEventListener('click',e=>{if(e.target.closest('[data-action="words"]')){reset();queueMicrotask(ensureButton)}});
ensureButton();
