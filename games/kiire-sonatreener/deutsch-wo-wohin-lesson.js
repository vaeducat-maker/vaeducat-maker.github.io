(function(){
  'use strict';
  const root=document.getElementById('card'),back=document.getElementById('libraryBtn'),
    pill=document.getElementById('pill'),sub=document.getElementById('sub'),
    restart=document.getElementById('restart'),counter=document.getElementById('counter');
  if(!root||!back)return;
  const sentences=[
    ['Лео играет в парке.','Leo spielt ','in dem Park','.'],
    ['Лео идёт в парк.','Leo geht ','in den Park','.'],
    ['Мира плавает в бассейне.','Mira schwimmt ','in dem Schwimmbad','.'],
    ['Анна идёт в библиотеку.','Anna geht ','in die Bibliothek','.'],
    ['Анна читает в библиотеке.','Anna liest ','in der Bibliothek','.'],
    ['Лукас идёт в кино.','Lukas geht ','in das Kino','.'],
    ['Дженни идёт на вечеринку.','Jenny geht ','auf die Party','.'],
    ['Дженни танцует на вечеринке.','Jenny tanzt ','auf der Party','.'],
    ['Папа и Лиза идут на игровую площадку.','Papa und Lisa gehen ','auf den Spielplatz','.'],
    ['Папа и Лиза играют в прятки на игровой площадке.','Papa und Lisa spielen Verstecken ','auf dem Spielplatz','.']
  ];
  const words=[
    ['парк','der Park'],['игровая площадка','der Spielplatz'],
    ['библиотека','die Bibliothek'],['вечеринка','die Party'],
    ['бассейн','das Schwimmbad'],['кино','das Kino'],
    ['где?','Wo?'],['куда?','Wohin?']
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if(!document.getElementById('de-wo-wohin-css')){
    const style=document.createElement('style');
    style.id='de-wo-wohin-css';
    style.textContent=[
      '.dew-wrap{display:grid;gap:14px;max-width:780px;margin:0 auto}',
      '.dew-head h2{margin:5px 0;color:#2f6f58;font-size:clamp(24px,6vw,32px)}',
      '.dew-note{font-size:14px;color:#596c60;line-height:1.45}',
      '.dew-line{background:white;border:1px solid #dce7de;border-radius:13px;padding:12px 13px;display:grid;gap:6px}',
      '.dew-ru{font-size:15px;color:#596a60;line-height:1.45}',
      '.dew-de{font-size:17px;color:#1e3b2b;line-height:1.5;font-weight:650;overflow-wrap:anywhere}',
      '.dew-mark{font-weight:850;color:#16633f;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px}',
      '.dew-actions{display:grid;gap:9px}',
      '.dew-flip{width:100%;min-height:235px;border:2px solid #d2dfd4;border-radius:18px;background:white;color:#1e3b2b;font-size:clamp(27px,7vw,40px);font-weight:850;text-align:center;padding:20px;overflow-wrap:anywhere;cursor:pointer}',
      '.dew-flip:focus-visible{outline:3px solid #2f6f58;outline-offset:3px}',
      '.dew-choices{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
      '.dew-count{text-align:center;color:#69796f;font-size:13px}',
      '.dew-pr-wrap{gap:12px}',
      '.dew-pr-progress{font-size:14px;color:#476957;font-weight:750;margin-top:9px}',
      '.dew-pr-track{height:7px;background:#dfece1;border-radius:50px;overflow:hidden;margin-top:8px}',
      '.dew-pr-track>span{height:100%;display:block;background:#2f8a5d;border-radius:50px}',
      '.dew-pr-panel{background:#fff;border:1px solid #dce7de;border-radius:15px;padding:19px 13px;display:grid;gap:10px}',
      '.dew-pr-ru{font-size:19px;font-weight:750;color:#1e3b2b;line-height:1.42}',
      '.dew-pr-de{font-size:20px;font-weight:800;color:#1c5e41;line-height:1.5;overflow-wrap:anywhere}',
      '.dew-pr-note{font-size:14px;color:#53685d}',
      '.dew-pr-field{display:grid;gap:6px}',
      '.dew-pr-label{font-size:14px;font-weight:750;color:#53685d}',
      '.dew-pr-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:9px}',
      '.dew-pr-option{min-height:54px;border:2px solid #d7e4db;border-radius:13px;background:#fff;color:#1c4431;font-size:18px;font-weight:800;padding:10px 8px;cursor:pointer;line-height:1.3}',
      '.dew-pr-option.dew-pr-selected{border-color:#356f52;background:#eef6f0}',
      '.dew-pr-option.dew-pr-correct{border-color:#16854f;background:#dcf5e4;color:#126639}',
      '.dew-pr-option.dew-pr-wrong{border-color:#c44848;background:#fde9e9;color:#952b2b}',
      '.dew-pr-option:focus-visible{outline:3px solid #28754c;outline-offset:2px}',
      '.dew-pr-option:disabled{cursor:default;opacity:1}',
      '.dew-pr-feedback{padding:13px;border-radius:13px;font-size:16px;line-height:1.4}',
      '.dew-pr-success{background:#e3f6e7;color:#146a40;font-weight:800}',
      '.dew-pr-error{background:#f0f6f0;color:#225a3a}',
      '.dew-pr-explain{font-size:13px;margin-top:7px;font-weight:500}',
      '.dew-pr-wrap .primary:disabled{opacity:.45;cursor:not-allowed}',
      '@media(max-width:390px){.dew-pr-ru{font-size:18px}.dew-pr-de{font-size:18px}.dew-pr-option{font-size:16px;padding:8px 4px}}',
      '@media(max-width:390px){.dew-de{font-size:16px}.dew-line{padding:10px}}'
    ].join('');
    document.head.appendChild(style);
  }
  let queue=[],turned=false;
  function chrome(text){
    if(pill)pill.textContent='🇩🇪 Deutsch';
    if(sub)sub.textContent=text;
    if(restart)restart.hidden=true;
    if(counter)counter.textContent='';
    back.hidden=false;
  }
  function lesson(){
    chrome('Урок 5 · 4 ноября · Wo? / Wohin?');
    root.innerHTML='<div class="dew-wrap">'+
      '<header class="dew-head"><div class="topic-kicker">🇩🇪 Deutsch · 4. November</div>'+
      '<h2>Урок 5 — Wo? / Wohin?</h2><div class="dew-note">1. Аккуратно перепиши предложения. Подчеркни выделенные сочетания.</div></header>'+
      sentences.map((s,i)=>'<div class="dew-line"><div class="dew-ru" lang="ru">'+(i+1)+'. '+esc(s[0])+'</div>'+
        '<div class="dew-de" lang="de">'+esc(s[1])+'<span class="dew-mark">'+esc(s[2])+'</span>'+esc(s[3])+'</div></div>').join('')+
      '<div class="dew-actions"><div class="dew-note">2. Выучи 6 мест с артиклями и вопросы Wo? / Wohin?</div>'+
      '<button type="button" class="primary" id="dewStart">Карточки · 8</button><button type="button" class="primary" id="dewPractice">🎯 Тренажёр · Wo? / Wohin?</button>'+
      '<button type="button" class="secondary" id="dewBack">← К предметам</button></div></div>';
    root.querySelector('#dewStart').onclick=start;
    root.querySelector('#dewPractice').onclick=startPractice;
    root.querySelector('#dewBack').onclick=()=>back.click();
  }
  function start(){
    queue=words.map((_,i)=>i);
    for(let i=queue.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[queue[i],queue[j]]=[queue[j],queue[i]];}
    turned=false;show();
  }
  function show(){
    chrome('Урок 5 · 8 карточек');
    if(!queue.length){
      root.innerHTML='<div class="dew-wrap"><header class="dew-head"><h2>8 / 8</h2></header>'+
        '<div class="dew-actions"><button class="primary" id="dewAgain">Повторить</button>'+
        '<button class="secondary" id="dewLesson">← К предложениям</button></div></div>';
      root.querySelector('#dewAgain').onclick=start;
      root.querySelector('#dewLesson').onclick=lesson;
      return;
    }
    const item=words[queue[0]];
    root.innerHTML='<div class="dew-wrap"><header class="dew-head"><div class="topic-kicker">🇩🇪 Deutsch · Wo? / Wohin?</div><h2>Карточки</h2></header>'+
      '<div class="dew-count">'+(words.length-queue.length+1)+' / '+words.length+'</div>'+
      '<button type="button" class="dew-flip" id="dewFlip" aria-label="Перевернуть карточку" lang="'+(turned?'de':'ru')+'">'+esc(turned?item[1]:item[0])+'</button>'+
      (turned?'<div class="dew-choices"><button class="secondary" id="dewRepeat">Повторить</button><button class="primary" id="dewKnow">Знаю</button></div>':'')+
      '<div class="dew-actions"><button type="button" class="secondary" id="dewLesson">← К предложениям</button></div></div>';
    root.querySelector('#dewFlip').onclick=()=>{turned=!turned;show();};
    const yes=root.querySelector('#dewKnow'),no=root.querySelector('#dewRepeat');
    if(yes)yes.onclick=()=>{queue.shift();turned=false;show();};
    if(no)no.onclick=()=>{queue.push(queue.shift());turned=false;show();};
    root.querySelector('#dewLesson').onclick=lesson;
  }

  // Practice uses only the ten approved sentences above. Metadata is deliberately
  // explicit so that gender, case and preposition cannot drift from the lesson.
  const cases=[
    ['der Park','in','dem','wo'],
    ['der Park','in','den','wohin'],
    ['das Schwimmbad','in','dem','wo'],
    ['die Bibliothek','in','die','wohin'],
    ['die Bibliothek','in','der','wo'],
    ['das Kino','in','das','wohin'],
    ['die Party','auf','die','wohin'],
    ['die Party','auf','der','wo'],
    ['der Spielplatz','auf','den','wohin'],
    ['der Spielplatz','auf','dem','wo']
  ];
  const phases=[
    {title:'Где или куда?',type:'question',ids:[0,1,2,3,6,7,8,9]},
    {title:'Выбери артикль',type:'article',ids:[0,1,2,3,4,5,6,7,8,9]},
    {title:'Предлог + артикль',type:'combine',ids:[0,1,2,3,4,5,6,7,8,9]}
  ];
  const practiceKey='sonatreener-deutsch-wo-wohin-practice-1';
  let practice=null, selected={},feedback=null;
  const shuffled=values=>{
    const result=values.slice();
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  };
  function storageGet(){
    try{
      const p=JSON.parse(localStorage.getItem(practiceKey)||'null');
      if(!p||!Number.isInteger(p.phase)||p.phase<0||p.phase>3||!Array.isArray(p.queue)||!p.queue.every(n=>Number.isInteger(n)&&n>=0&&n<10))return null;
      return {phase:p.phase,queue:p.queue,retries:p.retries&&typeof p.retries==='object'?p.retries:{},done:p.phase===3};
    }catch(e){return null;}
  }
  function storagePut(){
    if(!practice)return;
    try{localStorage.setItem(practiceKey,JSON.stringify(practice));}catch(e){}
  }
  function cleanStart(){
    practice={phase:0,queue:shuffled(phases[0].ids),retries:{},done:false};
    selected={};feedback=null;storagePut();renderPractice();
  }
  function startPractice(){
    const previous=storageGet();
    if(previous&&!previous.done){practice=previous;selected={};feedback=null;renderPractice();}
    else cleanStart();
  }
  function articleChoices(base){
    const gender=base.split(' ')[0];
    return gender==='der'?['der','den','dem']:gender==='die'?['die','der','dem']:['das','den','dem'];
  }
  function answerExpected(item,type){
    return type==='question'?item[3]:type==='article'?item[2]:item[1]+' '+item[2];
  }
  function fullCorrect(item){return item[1]+' '+item[2]+' '+item[0].split(' ').slice(1).join(' ');}
  function makeChoice(group,value,label,correct){
    const chosen=selected[group]===value;
    const ok=!!feedback&&value===correct;
    const bad=!!feedback&&chosen&&value!==correct;
    return '<button type="button" class="dew-pr-option'+(ok?' dew-pr-correct':'')+(bad?' dew-pr-wrong':'')+(chosen?' dew-pr-selected':'')+
      '" data-dew-group="'+group+'" data-dew-val="'+esc(value)+'" '+(feedback?'disabled':'')+'>'+esc(label||value)+'</button>';
  }
  function renderPractice(){
    chrome('Урок 5 · Wo? / Wohin? · тренажёр');
    if(!practice)practice=storageGet();
    if(!practice){cleanStart();return;}
    if(practice.done||practice.phase>=phases.length){
      root.innerHTML='<div class="dew-wrap dew-pr-wrap"><header class="dew-head">'+
        '<div class="topic-kicker">🇩🇪 Deutsch · 4. November</div><h2>Тренировка завершена!</h2></header>'+
        '<p class="dew-note">Три этапа пройдены. Можно повторить ещё раз.</p>'+
        '<div class="dew-actions"><button type="button" class="primary" id="dewPrAgain">Повторить</button>'+
        '<button type="button" class="secondary" id="dewPrBack">← К уроку</button></div></div>';
      root.querySelector('#dewPrAgain').onclick=cleanStart;
      root.querySelector('#dewPrBack').onclick=lesson;
      return;
    }
    const stage=phases[practice.phase],id=practice.queue[0],s=sentences[id],c=cases[id],
      base=c[0],noun=base.split(' ').slice(1).join(' '),kind=stage.type;
    if(!s||!c){root.innerHTML='<p>Не удалось загрузить задание.</p>';return;}
    const prompt=kind==='question'?'':kind==='article'?s[1]+c[1]+' ___ '+noun+'.':s[1]+'___ ___ '+noun+'.';
    let options='';
    if(kind==='question'){
      options='<div class="dew-pr-options">'+
        makeChoice('question','wo','WO? — где?',c[3])+
        makeChoice('question','wohin','WOHIN? — куда?',c[3])+'</div>';
    }else if(kind==='article'){
      options='<div class="dew-pr-options">'+
        articleChoices(base).map(v=>makeChoice('article',v,v,c[2])).join('')+'</div>';
    }else{
      options='<div class="dew-pr-field"><div class="dew-pr-label">Предлог</div><div class="dew-pr-options">'+
        ['in','auf'].map(v=>makeChoice('prep',v,v,c[1])).join('')+'</div></div>'+
        '<div class="dew-pr-field"><div class="dew-pr-label">Артикль</div><div class="dew-pr-options">'+
        articleChoices(base).map(v=>makeChoice('article',v,v,c[2])).join('')+'</div></div>'+
        (!feedback?'<button type="button" class="primary" id="dewPrCheck" '+(selected.prep&&selected.article?'':'disabled')+'>Проверить</button>':'');
    }
    const note=kind==='question'?'Определи, где происходит действие или куда направляются герои.':
      'Начальная форма: <strong lang="de">'+esc(base)+'</strong>';
    const result=feedback?
      '<div class="dew-pr-feedback '+(feedback.ok?'dew-pr-success':'dew-pr-error')+'" aria-live="polite">'+
      (feedback.ok?'✓ Верно!': 'Правильно: <strong lang="de">'+esc(kind==='question'?(c[3]==='wo'?'Wo? — где':'Wohin? — куда?'):kind==='article'?c[2]:fullCorrect(c))+'</strong>')+
      (!feedback.ok&&kind!=='question'?'<div class="dew-pr-explain">'+(c[3]==='wo'?'Wo? — где (Dativ)':'Wohin? — куда (Akkusativ)')+
      ' · '+esc(base)+'</div>':'')+'</div><button type="button" class="primary" id="dewPrNext">Дальше</button>':'';
    root.innerHTML='<div class="dew-wrap dew-pr-wrap">'+
      '<header class="dew-head"><div class="topic-kicker">🇩🇪 Deutsch · 4. November</div>'+
      '<h2>Wo oder Wohin?</h2><div class="dew-pr-progress">Этап '+(practice.phase+1)+' из 3 · '+esc(stage.title)+'</div>'+
      '<div class="dew-pr-track"><span style="width:'+(100*(practice.phase+1)/3)+'%"></span></div></header>'+
      '<div class="dew-pr-panel"><div class="dew-pr-ru" lang="ru">'+esc(s[0])+'</div>'+
      (prompt?'<div class="dew-pr-de" lang="de">'+esc(prompt)+'</div>':'')+
      '<div class="dew-pr-note">'+note+'</div></div>'+
      options+result+
      '<div class="dew-actions"><button type="button" class="secondary" id="dewPrBack">← К уроку</button></div></div>';
    root.querySelectorAll('[data-dew-group]').forEach(b=>b.onclick=()=>{
      if(feedback)return;
      selected[b.dataset.dewGroup]=b.dataset.dewVal;
      if(kind==='combine'){renderPractice();return;}
      submitPractice();
    });
    const check=root.querySelector('#dewPrCheck');
    if(check)check.onclick=submitPractice;
    const next=root.querySelector('#dewPrNext');
    if(next)next.onclick=nextPractice;
    root.querySelector('#dewPrBack').onclick=()=>{storagePut();lesson();};
  }
  function submitPractice(){
    if(!practice||feedback)return;
    const c=cases[practice.queue[0]],kind=phases[practice.phase].type;
    if(kind==='combine'&&(!selected.prep||!selected.article))return;
    const actual=kind==='question'?selected.question:kind==='article'?selected.article:selected.prep+' '+selected.article;
    feedback={ok:actual===answerExpected(c,kind)};
    renderPractice();
  }
  function nextPractice(){
    if(!practice||!feedback)return;
    const id=practice.queue.shift();
    if(!feedback.ok){
      const key=String(id);
      practice.retries[key]=(practice.retries[key]||0)+1;
      // A missed case returns later, at most once per stage; no immediate retry.
      if(practice.retries[key]===1)practice.queue.splice(Math.min(practice.queue.length,2),0,id);
    }
    selected={};feedback=null;
    if(practice.queue.length===0){
      practice.phase++;
      practice.retries={};
      practice.done=practice.phase>=phases.length;
      if(!practice.done)practice.queue=shuffled(phases[practice.phase].ids);
    }
    storagePut();renderPractice();
  }

  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.deutschWoWohinLesson=lesson;
})();