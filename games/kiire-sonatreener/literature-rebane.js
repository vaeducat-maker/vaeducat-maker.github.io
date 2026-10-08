(function rebaneLessonQuestions(){
  const TOPIC_ID='rebane-saba';
  const TOPIC_TITLE='Урок 4 — Kuidas rebane oma saba karistas · 03.10.26';
  const QUESTIONS=[
    {q:'Kes hakkas rebast taga ajama?',a:'Küti koer.'},
    {q:'Kuhu rebane lõpuks varjule sai?',a:'Oma koopasse.'},
    {q:'Mida ütlesid silmad, kui rebane neilt aru päris?',a:'Ikka sihtisime.'},
    {q:'Mille järgi sai nina aru, kas koer on kaugel?',a:'Haisu järgi.'},
    {q:'Kuidas aitasid tagumised jalad põgenemisele kaasa?',a:'Andsid takka hoogu.'},
    {q:'Mida tegi saba põgenemise ajal?',a:'Liikus vints ja võnts ja segas põgenemist.'},
    {q:'Mis juhtus siis, kui rebane saba koopast välja pistis?',a:'Koer tõmbas rebase välja ja nad said mehemoodi sasida.'}
  ];

  const RETELLING=[
    'Rebane jalutas.',
    'Jahimehe koer hakkas rebast taga ajama.',
    'Rebane jooksis kiiresti oma koopasse.',
    'Rebane küsis silmadelt: „Mida te tegite?”',
    'Silmad vastasid: „Me otsisime koobast.”',
    'Rebane küsis kõrvadelt: „Mida te tegite?”',
    'Kõrvad vastasid: „Me kuulasime koera.”',
    'Rebane küsis ninalt: „Mida sina tegid?”',
    'Nina vastas: „Ma tundsin koera lõhna.”',
    'Rebane küsis jalgadelt: „Mida te tegite?”',
    'Jalad vastasid: „Me aitasime joosta.”',
    'Rebane küsis sabalt: „Mida sina tegid?”',
    'Saba vastas: „Ma aitasin koera.”',
    'Rebane sai vihaseks.',
    'Ta pani saba koopast välja.',
    'Koer haaras sabast ja tõmbas rebase välja.',
    'Rebane ja saba said koera käest mehemoodi sasida.'
  ];

  const card=document.getElementById('card');
  const restart=document.getElementById('restart');
  const counter=document.getElementById('counter');
  const pill=document.getElementById('pill');
  const reviewBtn=document.getElementById('reviewBtn');
  const libraryBtn=document.getElementById('libraryBtn');
  const tabEt=document.getElementById('tabEt');
  const tabDe=document.getElementById('tabDe');
  const sub=document.getElementById('sub');
  if(!card||!restart||!counter||!pill||!libraryBtn||!tabEt||!tabDe)return;

  let active=false,retellingOpen=false,queue=[],good=0,bad=0,flipped=false;
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);

  function lock(on){
    tabEt.disabled=on;
    tabDe.disabled=on;
    if(reviewBtn)reviewBtn.hidden=true;
    libraryBtn.hidden=on;
  }

  function isLesson(){
    const h=card.querySelector('.topic-intro h2');
    return !!h&&h.textContent.trim()===TOPIC_TITLE;
  }

  function setLessonMeta(){
    if(sub)sub.textContent='Eesti kirjandus · 17 карточек · 7 вопросов';
  }

  function addButton(){
    if(active||retellingOpen||!isLesson())return;
    const actions=card.querySelector('.topic-actions');
    if(!actions)return;
    if(!actions.querySelector('#rebaneQuestionsBtn')){
      const b=document.createElement('button');
      b.type='button';
      b.id='rebaneQuestionsBtn';
      b.className='secondary';
      b.textContent='❓ Küsimused';
      b.onclick=start;
      actions.appendChild(b);
    }
    if(!actions.querySelector('#rebaneRetellingBtn')){
      const b=document.createElement('button');
      b.type='button';
      b.id='rebaneRetellingBtn';
      b.className='secondary';
      b.textContent='📖 Ümberjutustus';
      b.onclick=showRetelling;
      actions.appendChild(b);
    }
    if(!actions.querySelector('#rebaneSourceBtn')){
      const a=document.createElement('a');
      a.id='rebaneSourceBtn';
      a.className='secondary';
      a.href='./rebane-lesson-source.html';
      a.target='_blank';
      a.rel='noopener';
      a.textContent='📄 Файл урока';
      a.style.textDecoration='none';
      a.style.textAlign='center';
      actions.appendChild(a);
    }
    setLessonMeta();
  }

  function showRetelling(){
    if(active)return;
    retellingOpen=true;
    lock(true);
    restart.hidden=false;
    restart.textContent='← К уроку';
    counter.textContent='';
    pill.textContent='📖 Ümberjutustus';
    if(sub)sub.textContent='Eesti kirjandus · Ümberjutustus';
    card.innerHTML='<div style="display:grid;gap:18px;width:100%;max-width:760px;margin:0 auto">'+
      '<div style="text-align:center"><h2 style="margin:0 0 6px">Kuidas rebane oma saba karistas</h2><div class="tiny">Ümberjutustus</div></div>'+
      '<div style="display:grid;gap:12px;padding:18px 16px;border:1px solid #dfe8e2;border-radius:16px;background:#fff;font-size:17px;line-height:1.6">'+
      RETELLING.map(line=>'<p style="margin:0">'+esc(line)+'</p>').join('')+
      '</div><button class="secondary" type="button" id="rebaneRetellingBack">← К уроку</button></div>';
    card.querySelector('#rebaneRetellingBack').onclick=back;
  }

  function start(){
    active=true;
    queue=shuffle(QUESTIONS);
    good=0;
    bad=0;
    flipped=false;
    lock(true);
    restart.hidden=false;
    restart.textContent='← Выйти';
    pill.textContent='❓ Küsimused';
    if(sub)sub.textContent='Eesti kirjandus · 7 вопросов';
    render();
  }

  function render(){
    if(!active)return;
    if(!queue.length){finish();return}
    const x=queue[0];
    flipped=false;
    counter.textContent=`Осталось: ${queue.length}`;
    card.innerHTML=`<div class="review-wrap"><div class="tiny" style="text-align:center;margin-bottom:10px">Küsimus → vastus</div><div class="flashcard" id="rebaneQFlash"><div class="flashcard-inner"><div class="flash-face">${esc(x.q)}</div><div class="flash-face flash-back">${esc(x.a)}</div></div></div><div class="review-stats"><span>✓ ${good}</span><span>✕ ${bad}</span></div><div class="review-actions" id="rebaneQActions" hidden><button class="review-no" id="rebaneQNo">✕</button><button class="review-yes" id="rebaneQYes">✓</button></div><div class="tiny" style="text-align:center">Нажми на карточку, чтобы увидеть ответ</div></div>`;
    const f=card.querySelector('#rebaneQFlash');
    const actions=card.querySelector('#rebaneQActions');
    f.onclick=()=>{if(flipped)return;flipped=true;f.classList.add('flipped');actions.hidden=false};
    card.querySelector('#rebaneQYes').onclick=()=>decide(true);
    card.querySelector('#rebaneQNo').onclick=()=>decide(false);
  }

  function decide(ok){
    if(!queue.length)return;
    const x=queue.shift();
    if(ok){good++;render();return}
    bad++;
    if(queue.length===0){
      const alt=shuffle(QUESTIONS.filter(y=>y.q!==x.q))[0];
      if(alt)queue.push(alt);
    }
    const pos=Math.min(queue.length,Math.max(1,2+Math.floor(Math.random()*2)));
    queue.splice(pos,0,x);
    render();
  }

  function finish(){
    active=false;
    lock(false);
    counter.textContent='';
    pill.textContent='Готово';
    restart.hidden=true;
    setLessonMeta();
    card.innerHTML='<div class="done"><div class="big">❓</div><h2>Готово!</h2><div class="finish-actions"><button class="primary" id="rebaneQAgain">Ещё раз вопросы</button><button class="secondary" id="rebaneQBack">К уроку</button></div></div>';
    card.querySelector('#rebaneQAgain').onclick=start;
    card.querySelector('#rebaneQBack').onclick=back;
  }

  function back(){
    active=false;
    retellingOpen=false;
    lock(false);
    restart.hidden=true;
    counter.textContent='';
    if(window.EDUKASS_TRAINER?.open('et',TOPIC_ID))return;
    tabEt.click();
  }

  restart.addEventListener('click',e=>{
    if(!active&&!retellingOpen)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    back();
  },true);

  new MutationObserver(addButton).observe(card,{childList:true,subtree:true});
  addButton();
})();