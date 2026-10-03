(function deutschPaulaLesson(){
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
    ['heißen (heißt)','зваться, называться'],
    ['kommen (kommt)','приезжать; быть родом'],
    ['Österreich','Австрия'],
    ['jetzt','сейчас'],
    ['wohnen (wohnt)','жить'],
    ['besuchen (besucht)','посещать; учиться в'],
    ['die Mittelschule','средняя школа'],
    ['die Schule','школа'],
    ['finden (findet)','находить; считать'],
    ['okay','нормально, ОК'],
    ['mögen (mag)','любить, нравиться'],
    ['Englisch','английский язык'],
    ['Deutsch','немецкий язык'],
    ['die Mathematik','математика'],
    ['die Chemie','химия'],
    ['die Musik','музыка'],
    ['können (kann)','мочь, уметь'],
    ['singen','петь'],
    ['das Saxofon','саксофон'],
    ['spielen','играть'],
    ['gut','хорошо'],
    ['der Basketball','баскетбол'],
    ['die Freundin','подруга'],
    ['der Freund','друг; парень'],
    ['lustig','весёлый'],
    ['telefonieren','разговаривать по телефону'],
    ['viel','много'],
    ['lachen','смеяться'],
    ['gern','охотно; с удовольствием'],
    ['zusammen','вместе'],
    ['das Tischtennis','настольный теннис'],
    ['cool','крутой, классный'],
    ['surfen','заниматься сёрфингом'],
    ['tauchen','нырять'],
    ['das Karate','карате'],
    ['nicht','не'],
    ['aber','но'],
    ['aus','из'],
    ['in','в']
  ];

  const SENTENCES=[
    ['Sie heißt Paula.','Её зовут Паула.'],
    ['Sie kommt aus Österreich.','Она из Австрии.'],
    ['Paula kommt aus Innsbruck.','Паула родом из Инсбрука.'],
    ['Jetzt wohnt sie in Graz.','Сейчас она живёт в Граце.'],
    ['Sie besucht die Mittelschule Fröbel.','Она учится в средней школе Фрёбель.'],
    ['Paula findet ihre Schule okay.','Паула считает свою школу нормальной.'],
    ['Sie mag Englisch und Deutsch.','Она любит английский и немецкий.'],
    ['Sie mag Mathematik und Chemie nicht.','Она не любит математику и химию.'],
    ['Paula mag Musik.','Паула любит музыку.'],
    ['Sie kann singen.','Она умеет петь.'],
    ['Sie kann Saxofon spielen.','Она умеет играть на саксофоне.'],
    ['Sie kann nicht gut Basketball spielen.','Она не умеет хорошо играть в баскетбол.'],
    ['Sie mag Basketball.','Она любит баскетбол.'],
    ['Paulas Freundin heißt Jenny.','Подругу Паулы зовут Дженни.'],
    ['Ihre Freundin ist lustig.','Её подруга весёлая.'],
    ['Paula und Jenny telefonieren viel.','Паула и Дженни много разговаривают по телефону.'],
    ['Paula und Jenny lachen viel.','Паула и Дженни много смеются.'],
    ['Sie spielen gern zusammen Tischtennis.','Они любят вместе играть в настольный теннис.'],
    ['Sie finden Tischtennis cool.','Они считают настольный теннис крутым.'],
    ['Jennys Freund heißt Finn.','Друга Дженни зовут Финн.'],
    ['Er kann surfen.','Он умеет заниматься сёрфингом.'],
    ['Er kann tauchen.','Он умеет нырять.'],
    ['Er macht Karate.','Он занимается карате.'],
    ['Er mag Tischtennis nicht.','Он не любит настольный теннис.']
  ];

  let mode='lesson',deck='words',dir='de-ru',queue=[],good=0,bad=0,flipped=false;
  let audioEnabled=true;
  try{audioEnabled=localStorage.getItem('sonatreenerAudioEnabled')!=='0'}catch(e){}
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);

  function saveAudioEnabled(){
    try{localStorage.setItem('sonatreenerAudioEnabled',audioEnabled?'1':'0')}catch(e){}
  }

  function audioToggleLabel(){return audioEnabled?'🔊 Звук включён':'🔇 Звук выключен'}

  function speakGerman(text){
    if(!audioEnabled||!text||!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(String(text).replace(/\s*\(([^)]+)\)/g,', $1'));
    utterance.lang='de-DE';
    utterance.rate=.82;
    const voices=window.speechSynthesis.getVoices();
    const exact=voices.find(v=>v.lang?.toLowerCase()==='de-de');
    const family=voices.find(v=>v.lang?.toLowerCase().startsWith('de'));
    if(exact||family)utterance.voice=exact||family;
    window.speechSynthesis.speak(utterance);
  }

  function toggleAudio(item){
    audioEnabled=!audioEnabled;
    saveAudioEnabled();
    if(!audioEnabled&&'speechSynthesis' in window)window.speechSynthesis.cancel();
    const buttons=card.querySelectorAll('[data-paula-audio]');
    buttons.forEach(b=>b.textContent=audioToggleLabel());
    if(audioEnabled&&item){
      const germanVisible=dir==='de-ru'?!flipped:flipped;
      if(germanVisible)speakGerman(item[0]);
    }
  }

  function lock(on){
    tabEt.disabled=on;tabDe.disabled=on;libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  }

  function renderLesson(){
    mode='lesson';lock(false);restart.hidden=true;if(counter)counter.textContent='';
    pill.textContent='🇩🇪 Deutsch';
    if(sub)sub.textContent='Урок 3 · Paula · 03.10.26 · слова + базовые предложения';
    const wordRows=WORDS.map(x=>'<div class="summary-word"><strong>'+esc(x[0])+'</strong><span>'+esc(x[1])+'</span></div>').join('');
    const sentenceRows=SENTENCES.map(x=>'<div class="summary-qa-item"><strong>'+esc(x[0])+'</strong><p>'+esc(x[1])+'</p></div>').join('');
    card.innerHTML=
      '<div class="summary-view">'+
        '<div class="summary-head"><div class="topic-kicker">🇩🇪 Deutsch</div><h2>Урок 3 — Paula: проверка понимания текста · 03.10.26</h2><div class="tiny">Слова учим отдельно, предложения — как базовые модели</div></div>'+
        '<button class="secondary" data-paula-audio id="paulaLessonAudio">'+audioToggleLabel()+'</button>'+
        '<section class="summary-section"><h3>📖 Текст с построчным переводом</h3>'+
          '<div class="summary-qa">'+
            '<div class="summary-qa-item"><strong>Sie heißt Paula und sie kommt aus Österreich.</strong><p>Её зовут Паула и она из Австрии.</p></div>'+
            '<div class="summary-qa-item"><strong>Paula kommt aus Innsbruck, aber jetzt wohnt sie in Graz.</strong><p>Паула родом из Инсбрука, но сейчас живёт в Граце.</p></div>'+
            '<div class="summary-qa-item"><strong>Sie besucht die Mittelschule Fröbel.</strong><p>Она учится в средней школе Фрёбель.</p></div>'+
            '<div class="summary-qa-item"><strong>Paula findet ihre Schule okay.</strong><p>Паула находит свою школу ОК.</p></div>'+
            '<div class="summary-qa-item"><strong>Sie mag Englisch und Deutsch.</strong><p>Она любит английский и немецкий.</p></div>'+
            '<div class="summary-qa-item"><strong>Sie mag Mathematik und Chemie nicht.</strong><p>Она не любит математику и химию.</p></div>'+
            '<div class="summary-qa-item"><strong>Paula mag Musik.</strong><p>Паула любит музыку.</p></div>'+
            '<div class="summary-qa-item"><strong>Sie kann singen und Saxofon spielen.</strong><p>Она умеет петь и играть на саксофоне.</p></div>'+
            '<div class="summary-qa-item"><strong>Sie kann nicht gut Basketball spielen, aber sie mag Basketball.</strong><p>Она не умеет хорошо играть в баскетбол, но она любит баскетбол.</p></div>'+
            '<div class="summary-qa-item"><strong>Paulas Freundin heißt Jenny.</strong><p>Подругу Паулы зовут Дженни.</p></div>'+
            '<div class="summary-qa-item"><strong>Ihre Freundin ist lustig.</strong><p>Её подруга весёлая.</p></div>'+
            '<div class="summary-qa-item"><strong>Paula und Jenny telefonieren viel und lachen.</strong><p>Паула и Дженни много разговаривают по телефону и смеются.</p></div>'+
            '<div class="summary-qa-item"><strong>Sie spielen gern zusammen Tischtennis.</strong><p>Они любят играть вместе в настольный теннис.</p></div>'+
            '<div class="summary-qa-item"><strong>Sie finden Tischtennis cool.</strong><p>Они находят настольный теннис крутым.</p></div>'+
            '<div class="summary-qa-item"><strong>Jennys Freund heißt Finn.</strong><p>Друга Дженни зовут Финн.</p></div>'+
            '<div class="summary-qa-item"><strong>Er kann surfen und tauchen.</strong><p>Он умеет серфить и нырять.</p></div>'+
            '<div class="summary-qa-item"><strong>Er macht Karate.</strong><p>Он занимается карате.</p></div>'+
            '<div class="summary-qa-item"><strong>Aber er mag Tischtennis nicht.</strong><p>Но он не любит настольный теннис.</p></div>'+
          '</div>'+
        '</section>'+
        '<section class="summary-section"><h3>Wörter · '+WORDS.length+'</h3>'+
          '<div class="topic-actions">'+
            '<button class="primary" id="paulaWordsDeRu">🃏 Deutsch → русский</button>'+
            '<button class="secondary" id="paulaWordsRuDe">🃏 Русский → Deutsch</button>'+
          '</div>'+
          '<div class="summary-words">'+wordRows+'</div>'+
        '</section>'+
        '<section class="summary-section"><h3>Sätze · '+SENTENCES.length+'</h3>'+
          '<div class="topic-actions">'+
            '<button class="primary" id="paulaSentDeRu">💬 Deutsch → русский</button>'+
            '<button class="secondary" id="paulaSentRuDe">💬 Русский → Deutsch</button>'+
          '</div>'+
          '<div class="summary-qa">'+sentenceRows+'</div>'+
        '</section>'+
        '<button class="secondary" id="paulaBack">← К предметам</button>'+
      '</div>';
    card.querySelector('#paulaLessonAudio').onclick=()=>toggleAudio();
    card.querySelector('#paulaWordsDeRu').onclick=()=>start('words','de-ru');
    card.querySelector('#paulaWordsRuDe').onclick=()=>start('words','ru-de');
    card.querySelector('#paulaSentDeRu').onclick=()=>start('sentences','de-ru');
    card.querySelector('#paulaSentRuDe').onclick=()=>start('sentences','ru-de');
    card.querySelector('#paulaBack').onclick=()=>libraryBtn.click();
  }

  function start(nextDeck,nextDir){
    deck=nextDeck;dir=nextDir;mode='cards';good=0;bad=0;flipped=false;
    queue=shuffle(deck==='words'?WORDS:SENTENCES);
    lock(true);restart.hidden=false;restart.textContent='← Выйти';
    pill.textContent=deck==='words'?'📘 Wörter':'💬 Sätze';
    if(sub)sub.textContent=(dir==='de-ru'?'Deutsch → русский':'Русский → Deutsch')+' · '+queue.length+' карточек';
    renderCard();
  }

  function renderCard(){
    if(!queue.length){finish();return}
    const x=queue[0];
    const front=dir==='de-ru'?x[0]:x[1];
    const back=dir==='de-ru'?x[1]:x[0];
    flipped=false;if(counter)counter.textContent='Осталось: '+queue.length;
    card.innerHTML=
      '<div class="review-wrap">'+
        '<div class="tiny" style="text-align:center;margin-bottom:10px">'+(deck==='words'?'Wörter · ':'Sätze · ')+(dir==='de-ru'?'Deutsch → русский':'Русский → Deutsch')+'</div>'+
        '<button class="secondary" data-paula-audio id="paulaAudio" style="width:100%">'+audioToggleLabel()+'</button>'+
        '<div class="flashcard" id="paulaFlash"><div class="flashcard-inner">'+
          '<div class="flash-face">'+esc(front)+'</div>'+
          '<div class="flash-face flash-back">'+esc(back)+'</div>'+
        '</div></div>'+
        '<div class="review-stats"><span>✓ '+good+'</span><span>✕ '+bad+'</span></div>'+
        '<div class="review-actions" id="paulaActions" hidden><button class="review-no" id="paulaNo">✕</button><button class="review-yes" id="paulaYes">✓</button></div>'+
        '<div class="tiny" style="text-align:center">Нажми на карточку, чтобы увидеть ответ</div>'+
      '</div>';
    const f=card.querySelector('#paulaFlash'),a=card.querySelector('#paulaActions');
    card.querySelector('#paulaAudio').onclick=()=>toggleAudio(x);
    f.onclick=()=>{if(flipped)return;flipped=true;f.classList.add('flipped');a.hidden=false;if(dir==='ru-de')speakGerman(x[0])};
    if(dir==='de-ru')setTimeout(()=>speakGerman(x[0]),0);
    card.querySelector('#paulaYes').onclick=()=>decide(true);
    card.querySelector('#paulaNo').onclick=()=>decide(false);
  }

  function decide(ok){
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    const x=queue.shift();
    if(ok){good++;renderCard();return}
    bad++;
    if(queue.length===0){
      const source=deck==='words'?WORDS:SENTENCES;
      const alt=shuffle(source.filter(y=>y[0]!==x[0]))[0];
      if(alt)queue.push(alt);
    }
    const pos=Math.min(queue.length,Math.max(1,2+Math.floor(Math.random()*2)));
    queue.splice(pos,0,x);
    renderCard();
  }

  function finish(){
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    mode='done';lock(false);restart.hidden=true;if(counter)counter.textContent='';pill.textContent='Готово';
    card.innerHTML='<div class="done"><div class="big">🇩🇪</div><h2>Готово!</h2><div class="finish-actions"><button class="primary" id="paulaAgain">Ещё раз</button><button class="secondary" id="paulaLessonBack">К уроку</button></div></div>';
    card.querySelector('#paulaAgain').onclick=()=>start(deck,dir);
    card.querySelector('#paulaLessonBack').onclick=renderLesson;
  }

  restart.addEventListener('click',e=>{
    if(mode!=='cards')return;
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    e.preventDefault();e.stopImmediatePropagation();renderLesson();
  },true);

  window.EDUKASS_LESSONS.deutschPaulaLesson=renderLesson;
})();