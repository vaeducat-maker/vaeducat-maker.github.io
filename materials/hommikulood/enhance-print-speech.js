const titles=['Kus on mu telefon?','Kadunud sokk','Ma jäin bussist maha','Pusa on tagurpidi'];
const prompts=[
  'Räägi 2–3 lausega: kas oled kunagi midagi otsinud, kuigi see oli sul tegelikult lähedal?',
  'Räägi 2–3 lausega: kuhu võivad sokid sinu kodus kaduma minna?',
  'Räägi 2–3 lausega: mida teed sina, kui jääd bussist maha?',
  'Räägi 2–3 lausega: mis võib juhtuda, kui paned riidesse peaaegu pimedas?'
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function enhance(){
  const intro=document.querySelector('.intro');
  if(intro&&!intro.querySelector('.hommikulood-print-link')){
    const wrap=document.createElement('div');
    wrap.className='result-actions hommikulood-print-link';
    wrap.innerHTML='<a class="secondary" href="print.html">Prinditav versioon →</a>';
    intro.append(wrap);
  }
  const result=document.querySelector('.result');
  if(!result)return;
  const title=result.querySelector('.eyebrow')?.textContent.trim()||'';
  const i=titles.indexOf(title);
  if(i>=0&&!result.querySelector('.speak-prompt')){
    const card=document.createElement('div');
    card.className='teacher-note speak-prompt';
    card.innerHTML=`<strong>Räägi ise</strong><br>${esc(prompts[i])}`;
    const actions=result.querySelector('.result-actions');
    (actions||result).insertAdjacentElement(actions?'beforebegin':'beforeend',card);
  }
  const actions=result.querySelector('.result-actions');
  if(actions&&!actions.querySelector('.result-print-link')){
    const link=document.createElement('a');
    link.className='secondary result-print-link';
    link.href=`print.html${i>=0?`#lugu-${i+1}`:''}`;
    link.textContent='Prinditav versioon';
    actions.append(link);
  }
}
new MutationObserver(enhance).observe(document.querySelector('#main'),{childList:true,subtree:true});
enhance();
