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
      '<button type="button" class="primary" id="dewStart">Карточки · 8</button>'+
      '<button type="button" class="secondary" id="dewBack">← К предметам</button></div></div>';
    root.querySelector('#dewStart').onclick=start;
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
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.deutschWoWohinLesson=lesson;
})();