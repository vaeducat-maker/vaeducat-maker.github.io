(function inimeneTervisLesson(){
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  const card=document.getElementById('card');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  const restart=document.getElementById('restart');
  const libraryBtn=document.getElementById('libraryBtn');
  const tabEt=document.getElementById('tabEt');
  const tabDe=document.getElementById('tabDe');
  const reviewBtn=document.getElementById('reviewBtn');
  const counter=document.getElementById('counter');
  if(!card||!pill||!restart||!libraryBtn||!tabEt||!tabDe)return;

  const WORDS=[
    ['tervis','здоровье'],
    ['kehaline ehk füüsiline tervis','физическое здоровье'],
    ['vaimne tervis','психическое здоровье'],
    ['sotsiaalne tervis','социальное здоровье']
  ];

  let mode='lesson',dir='et-ru',queue=[],good=0,bad=0,flipped=false;
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);

  function lock(on){
    tabEt.disabled=on;tabDe.disabled=on;libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  }

  function renderLesson(){
    mode='lesson';lock(false);restart.hidden=true;if(counter)counter.textContent='';
    pill.textContent='👤 Inimene';
    if(sub)sub.textContent='Урок 1 · Tervis · 03.10.26 · 4 карточки';
    card.innerHTML=
      '<div class="topic-intro">'+
        '<div class="topic-kicker">👤 Inimene</div>'+
        '<h2>Урок 1 — Tervis · 03.10.26</h2>'+
        '<p><strong>Olulisemad tervise osad on:</strong></p>'+
        '<div class="summary-words">'+
          WORDS.slice(1).map(x=>'<div class="summary-word"><strong>'+esc(x[0])+'</strong><span>'+esc(x[1])+'</span></div>').join('')+
        '</div>'+
        '<div class="topic-actions">'+
          '<button class="primary" id="healthEtRu">🃏 Eesti → русский</button>'+
          '<button class="secondary" id="healthRuEt">🃏 Русский → Eesti</button>'+
        '</div>'+
      '</div>';
    card.querySelector('#healthEtRu').onclick=()=>start('et-ru');
    card.querySelector('#healthRuEt').onclick=()=>start('ru-et');
  }

  function start(nextDir){
    dir=nextDir;mode='cards';queue=shuffle(WORDS);good=0;bad=0;flipped=false;lock(true);
    restart.hidden=false;restart.textContent='← Выйти';
    pill.textContent='👤 Tervis';
    if(sub)sub.textContent=dir==='et-ru'?'Eesti → русский':'Русский → Eesti';
    renderCard();
  }

  function renderCard(){
    if(!queue.length){finish();return}
    const x=queue[0],front=dir==='et-ru'?x[0]:x[1],back=dir==='et-ru'?x[1]:x[0];
    flipped=false;if(counter)counter.textContent='Осталось: '+queue.length;
    card.innerHTML=
      '<div class="review-wrap">'+
        '<div class="tiny" style="text-align:center;margin-bottom:10px">'+(dir==='et-ru'?'Eesti → русский':'Русский → Eesti')+'</div>'+
        '<div class="flashcard" id="healthFlash"><div class="flashcard-inner">'+
          '<div class="flash-face">'+esc(front)+'</div>'+
          '<div class="flash-face flash-back">'+esc(back)+'</div>'+
        '</div></div>'+
        '<div class="review-stats"><span>✓ '+good+'</span><span>✕ '+bad+'</span></div>'+
        '<div class="review-actions" id="healthActions" hidden><button class="review-no" id="healthNo">✕</button><button class="review-yes" id="healthYes">✓</button></div>'+
        '<div class="tiny" style="text-align:center">Нажми на карточку, чтобы увидеть перевод</div>'+
      '</div>';
    const f=card.querySelector('#healthFlash'),a=card.querySelector('#healthActions');
    f.onclick=()=>{if(flipped)return;flipped=true;f.classList.add('flipped');a.hidden=false};
    card.querySelector('#healthYes').onclick=()=>decide(true);
    card.querySelector('#healthNo').onclick=()=>decide(false);
  }

  function decide(ok){
    const x=queue.shift();
    if(ok){good++;renderCard();return}
    bad++;
    const pos=Math.min(queue.length,Math.max(1,2));
    queue.splice(pos,0,x);
    renderCard();
  }

  function finish(){
    mode='done';lock(false);restart.hidden=true;if(counter)counter.textContent='';pill.textContent='Готово';
    card.innerHTML='<div class="done"><div class="big">👤</div><h2>Готово!</h2><div class="finish-actions"><button class="primary" id="healthAgain">Ещё раз</button><button class="secondary" id="healthBack">К уроку</button></div></div>';
    card.querySelector('#healthAgain').onclick=()=>start(dir);
    card.querySelector('#healthBack').onclick=renderLesson;
  }

  restart.addEventListener('click',e=>{
    if(mode!=='cards')return;
    e.preventDefault();e.stopImmediatePropagation();renderLesson();
  },true);

  window.EDUKASS_LESSONS.inimeneTervisLesson=renderLesson;
})();