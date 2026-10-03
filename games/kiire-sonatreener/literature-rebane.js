(function rebaneLessonQuestions(){
  const TOPIC_ID='rebane-saba';
  const TOPIC_TITLE='Kuidas rebane oma saba karistas';
  const QUESTIONS=[
    {q:'Kes hakkas rebast taga ajama?',a:'Küti koer.'},
    {q:'Kuhu rebane lõpuks varjule sai?',a:'Oma koopasse.'},
    {q:'Mida ütlesid silmad, kui rebane neilt aru päris?',a:'Ikka sihtisime.'},
    {q:'Mille järgi sai nina aru, kas koer on kaugel?',a:'Haisu järgi.'},
    {q:'Kuidas aitasid tagumised jalad põgenemisele kaasa?',a:'Andsid takka hoogu.'},
    {q:'Mida tegi saba põgenemise ajal?',a:'Liikus vints ja võnts ja segas põgenemist.'},
    {q:'Mis juhtus siis, kui rebane saba koopast välja pistis?',a:'Koer tõmbas rebase välja ja nad said mehemoodi sasida.'}
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

  let active=false,queue=[],good=0,bad=0,flipped=false;
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
    if(active||!isLesson())return;
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
    setLessonMeta();
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
    lock(false);
    restart.hidden=true;
    counter.textContent='';
    if(window.EDUKASS_TRAINER?.open('et',TOPIC_ID))return;
    tabEt.click();
  }

  restart.addEventListener('click',e=>{
    if(!active)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    back();
  },true);

  new MutationObserver(addButton).observe(card,{childList:true,subtree:true});
  addButton();
})();