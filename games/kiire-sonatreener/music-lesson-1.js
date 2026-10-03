(function musicLesson1(){
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const restart=document.getElementById('restart');
  const counter=document.getElementById('counter');
  const pill=document.getElementById('pill');
  const tabEt=document.getElementById('tabEt');
  const tabDe=document.getElementById('tabDe');
  const reviewBtn=document.getElementById('reviewBtn');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn||!restart||!counter||!pill||!tabEt||!tabDe)return;

  const TITLE='Урок 1 — Kontrolltöö: tämber, dünaamika · 03.10.26';

  const ESTONIAN=[
    ['aeglaselt','медленно'],
    ['laialt','широко, протяжно'],
    ['rahulikult','спокойно'],
    ['jalutades','гуляя, прогулочным шагом'],
    ['mõõdukalt','умеренно'],
    ['liikuvalt','подвижно'],
    ['kiiresti','быстро'],
    ['elavalt','оживлённо'],
    ['väga kiiresti','очень быстро'],
    ['vaikselt','тихо'],
    ['valjusti','громко'],
    ['seade','устройство'],
    ['tempo kiirus','скорость темпа'],
    ['mõõtmiseks','для измерения'],
    ['aeglustades','замедляя'],
    ['kiirenedes','ускоряясь'],
    ['esialgne tempo','первоначальный темп'],
    ['juurde tagasi pöördumine','возвращение к'],
    ['vaba valik','свободный выбор']
  ];

  const TERMS=[
    ['GRAVE, LARGO','aeglaselt, laialt','медленно, широко / протяжно'],
    ['ADAGIO, ANDANTE','rahulikult jalutades','спокойно, прогулочным шагом'],
    ['MODERATO','mõõdukalt','умеренно'],
    ['ALLEGRETTO, ALLEGRO','liikuvalt, kiiresti','подвижно, быстро'],
    ['VIVO, VIVACE','elavalt','оживлённо'],
    ['PRESTO','väga kiiresti','очень быстро'],
    ['PIANO','vaikselt','тихо'],
    ['FORTE','valjusti','громко'],
    ['METRONOOM','seade tempo kiiruse mõõtmiseks, esitamiseks','устройство для измерения и задания темпа'],
    ['RITENUTO','aeglustades','замедляя'],
    ['ACCELERANDO','kiirenedes','ускоряясь'],
    ['A TEMPO','esialgse tempo juurde tagasi pöördumine','возвращение к первоначальному темпу'],
    ['RUBATO','tempo vaba valik','свободный выбор темпа']
  ];

  let mode='lesson',queue=[],good=0,bad=0,flipped=false,deck='estonian-et-ru';
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);

  function lock(on){
    tabEt.disabled=on;
    tabDe.disabled=on;
    libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  }

  function renderLesson(){
    mode='lesson';lock(false);restart.hidden=true;counter.textContent='';pill.textContent='🎵 Muusika';
    if(sub)sub.textContent='Урок 1 · 03.10.26 · эстонские слова + музыкальные термины';
    const etRows=ESTONIAN.map(([et,ru])=>'<div class="summary-word"><strong>'+esc(et)+'</strong><span>'+esc(ru)+'</span></div>').join('');
    const termRows=TERMS.map(([term,et,ru])=>'<div class="summary-qa-item"><strong>'+esc(term)+'</strong><p>'+esc(et)+' — '+esc(ru)+'</p></div>').join('');
    card.innerHTML=
      '<div class="summary-view">'+
        '<div class="summary-head"><div class="topic-kicker">🎵 Muusika</div><h2>'+esc(TITLE)+'</h2><div class="tiny">Сначала эстонские слова, затем музыкальные термины</div></div>'+
        '<div class="topic-actions">'+
          '<button class="primary" id="musicEtCards">🇪🇪 Eesti → русский</button>'+
          '<button class="secondary" id="musicRuEtCards">🇷🇺 Русский → Eesti</button>'+
          '<button class="secondary" id="musicTermCards">🎵 Muusikaterminid</button>'+
        '</div>'+
        '<section class="summary-section"><h3>Eesti sõnad · '+ESTONIAN.length+'</h3><div class="summary-words">'+etRows+'</div></section>'+
        '<section class="summary-section"><h3>Muusikaterminid · '+TERMS.length+'</h3><div class="summary-qa">'+termRows+'</div></section>'+
        '<button class="secondary" id="musicBack">← К предметам</button>'+
      '</div>';
    card.querySelector('#musicEtCards').onclick=()=>start('estonian-et-ru');
    card.querySelector('#musicRuEtCards').onclick=()=>start('estonian-ru-et');
    card.querySelector('#musicTermCards').onclick=()=>start('terms');
    card.querySelector('#musicBack').onclick=()=>libraryBtn.click();
  }

  function start(which){
    deck=which;mode='cards';good=0;bad=0;flipped=false;
    queue=shuffle(which==='terms'?TERMS:ESTONIAN);
    lock(true);restart.hidden=false;restart.textContent='← Выйти';
    if(which==='estonian-et-ru'){
      pill.textContent='🇪🇪 Eesti → русский';
      if(sub)sub.textContent='Эстонское слово → русский';
    }else if(which==='estonian-ru-et'){
      pill.textContent='🇷🇺 Русский → Eesti';
      if(sub)sub.textContent='Русский → эстонское слово';
    }else{
      pill.textContent='🎵 Muusikaterminid';
      if(sub)sub.textContent='Термин → эстонское объяснение → русский';
    }
    renderCard();
  }

  function renderCard(){
    if(!queue.length){finish();return}
    const x=queue[0];flipped=false;counter.textContent='Осталось: '+queue.length;
    let front,back,label;
    if(deck==='estonian-et-ru'){
      front=x[0];back=esc(x[1]);label='Eesti → русский';
    }else if(deck==='estonian-ru-et'){
      front=x[1];back=esc(x[0]);label='Русский → Eesti';
    }else{
      front=x[0];
      back=esc(x[1])+'<br><span class="tiny" style="display:block;margin-top:8px">'+esc(x[2])+'</span>';
      label='Термин → значение';
    }
    card.innerHTML=
      '<div class="review-wrap">'+
        '<div class="tiny" style="text-align:center;margin-bottom:10px">'+label+'</div>'+
        '<div class="flashcard" id="musicFlash"><div class="flashcard-inner">'+
          '<div class="flash-face">'+esc(front)+'</div>'+
          '<div class="flash-face flash-back">'+back+'</div>'+
        '</div></div>'+
        '<div class="review-stats"><span>✓ '+good+'</span><span>✕ '+bad+'</span></div>'+
        '<div class="review-actions" id="musicActions" hidden><button class="review-no" id="musicNo">✕</button><button class="review-yes" id="musicYes">✓</button></div>'+
        '<div class="tiny" style="text-align:center">Нажми на карточку, чтобы увидеть ответ</div>'+
      '</div>';
    const f=card.querySelector('#musicFlash'),a=card.querySelector('#musicActions');
    f.onclick=()=>{if(flipped)return;flipped=true;f.classList.add('flipped');a.hidden=false};
    card.querySelector('#musicYes').onclick=()=>decide(true);
    card.querySelector('#musicNo').onclick=()=>decide(false);
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
    mode='done';lock(false);counter.textContent='';restart.hidden=true;pill.textContent='Готово';
    card.innerHTML='<div class="done"><div class="big">🎵</div><h2>Готово!</h2><div class="finish-actions"><button class="primary" id="musicAgain">Ещё раз</button><button class="secondary" id="musicLessonBack">К уроку</button></div></div>';
    card.querySelector('#musicAgain').onclick=()=>start(deck);
    card.querySelector('#musicLessonBack').onclick=renderLesson;
  }

  restart.addEventListener('click',e=>{
    if(mode!=='cards')return;
    e.preventDefault();e.stopImmediatePropagation();renderLesson();
  },true);

  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.musicLesson1=renderLesson;
})();