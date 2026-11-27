(function inimeneToitumineLesson(){
  'use strict';
  window.EDUKASS_LESSONS = window.EDUKASS_LESSONS || {};
  const card = document.getElementById('card');
  const libraryBtn = document.getElementById('libraryBtn');
  const pill = document.getElementById('pill');
  const sub = document.getElementById('sub');
  const restart = document.getElementById('restart');
  const counter = document.getElementById('counter');
  const tabEt = document.getElementById('tabEt');
  const tabDe = document.getElementById('tabDe');
  const reviewBtn = document.getElementById('reviewBtn');
  if (!card || !libraryBtn) return;

  const TOPICS = [
  [
    "Toidu kättesaadavus",
    "Koolipuhvetis ostan seda, mis seal müügil on.",
    "Доступность пищи — в школьном буфете я покупаю то, что там есть в продаже."
  ],
  [
    "Maitse-eelistused",
    "Valin šokolaadijäätise, sest mulle meeldib šokolaad.",
    "Вкусовые предпочтения — я выбираю шоколадное мороженое, потому что люблю шоколад."
  ],
  [
    "Teiste inimeste mõju",
    "Kui sõbrad tellivad pitsat, tahan ka mina pitsat süüa.",
    "Влияние других людей — если друзья заказывают пиццу, я тоже хочу поесть пиццу."
  ],
  [
    "Tervis või haigus",
    "Ma ei söö hurmaad, sest mul on selle vastu allergia.",
    "Здоровье или болезнь — я не ем хурму, потому что у меня на неё аллергия."
  ],
  [
    "Sündmused ja traditsioonid",
    "Detsembris söön piparkooke, sest see on jõulutraditsioon.",
    "События и традиции — в декабре я ем имбирное печенье, потому что это рождественская традиция."
  ]
];
  const WORDS = [
  [
    "toiduvalik",
    "выбор пищи"
  ],
  [
    "tegur",
    "фактор"
  ],
  [
    "mõjutama",
    "влиять"
  ],
  [
    "mõju",
    "влияние"
  ],
  [
    "valima",
    "выбирать"
  ],
  [
    "toidu kättesaadavus",
    "доступность пищи"
  ],
  [
    "hind",
    "цена"
  ],
  [
    "koostis",
    "состав"
  ],
  [
    "säilimisaeg",
    "срок хранения"
  ],
  [
    "harjumused",
    "привычки"
  ],
  [
    "maitse-eelistused",
    "вкусовые предпочтения"
  ],
  [
    "teiste inimeste mõju",
    "влияние других людей"
  ],
  [
    "mugavus",
    "удобство"
  ],
  [
    "sündmused",
    "события"
  ],
  [
    "traditsioonid",
    "традиции"
  ],
  [
    "tervis",
    "здоровье"
  ],
  [
    "haigus",
    "болезнь"
  ],
  [
    "koolipuhvet",
    "школьный буфет"
  ],
  [
    "tellima",
    "заказывать"
  ]
];
  const esc = x => String(x).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Preserve the appearance and controls of every other lesson.
  if(!document.getElementById('inimeneToitumineStyle')){
    const style=document.createElement('style');
    style.id='inimeneToitumineStyle';
    style.textContent=
      '.food-summary{display:grid;gap:11px;max-width:780px;margin:0 auto}'+
      '.food-summary h2{font-size:clamp(23px,6vw,30px);color:#2f6f58;margin:4px 0 0}'+
      '.food-summary .food-subtitle{font-size:13px;color:#66776d}'+
      '.food-tools{display:grid;gap:8px}'+
      '.food-section{background:#fff;border:1px solid #dce7de;border-radius:14px;padding:13px 14px;display:grid;gap:8px}'+
      '.food-section h3{margin:0;font-size:17px;line-height:1.3;color:#275b42}'+
      '.food-et{font-size:16px;line-height:1.45;font-weight:600;color:#263a30}'+
      '.food-ru{font-size:14px;line-height:1.45;color:#586a5f;padding-top:4px}'+
      '.food-summary[data-ru="off"] .food-ru{display:none!important}'+
      '.food-line{border-left:3px solid #d8e9df;padding-left:10px}'+
      '.food-label{color:#6b8073;font-size:12px;font-weight:800;letter-spacing:.03em;text-transform:uppercase}'+
      '.food-examples{display:grid;gap:7px}'+
      '.food-back{width:100%;margin-top:3px}'+
      '.food-cards{max-width:650px;margin:0 auto;display:grid;gap:12px}'+
      '.food-flash{display:grid;align-items:center;justify-items:center;min-height:205px;border-radius:18px;background:#fff;border:2px solid #dce7de;padding:20px 12px;width:100%;color:#244c38;box-shadow:0 6px 18px rgba(0,0,0,.04);cursor:pointer;font-weight:800;font-size:clamp(23px,5vw,31px);text-align:center;overflow-wrap:anywhere}'+
      '.food-flash-label{font-weight:600;font-size:13px;color:#718478}'+
      '.food-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}'+
      '.food-card-actions[hidden]{display:none!important}'+
      '.food-card-actions button{min-height:48px}';
    document.head.appendChild(style);
  }

  let mode='inactive', showRu=false, direction='et-ru', queue=[], known=0, mistakes=0, flipped=false;
  const lock=on=>{
    if(tabEt)tabEt.disabled=on;
    if(tabDe)tabDe.disabled=on;
    libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  };
  function pair(et,ru){
    return '<div class="food-line"><div class="food-et" lang="et">'+esc(et)+'</div><div class="food-ru" lang="ru">'+esc(ru)+'</div></div>';
  }
  function renderLesson(){
    mode='lesson';lock(false);
    if(restart)restart.hidden=true;
    if(counter)counter.textContent='';
    if(pill)pill.textContent='👤 Inimeseõpetus';
    if(sub)sub.textContent='Урок 4 · 2.4. Toitumist mõjutavad tegurid';
    const blocks=TOPICS.map((topic,i)=>
      '<section class="food-section"><h3>'+esc((i+1)+'. '+topic[0])+'</h3>'+
      pair(topic[1],topic[2])+'</section>'
    ).join('');
    const vocab='<details class="food-section"><summary>Список слов · '+WORDS.length+'</summary>'+WORDS.map(row=>pair(row[0],row[1])).join('')+'</details>';
    card.innerHTML=
      '<div id="foodSummary" class="food-summary" data-ru="'+(showRu?'on':'off')+'">'+
      '<div class="topic-intro"><div class="topic-kicker">👤 Inimeseõpetus · Урок 4</div>'+
      '<h2>2.4. Toitumist mõjutavad tegurid</h2><div class="food-subtitle">Mis mõjutab toiduvalikut? · Домашняя работа к 4 декабря</div></div>'+
      '<div class="food-tools"><button type="button" class="secondary" id="foodTranslate" aria-expanded="'+String(showRu)+'">'+
      (showRu?'🙈 Скрыть перевод':'🌐 Показать перевод')+'</button></div>'+
      blocks+vocab+
      '<div class="food-tools"><button type="button" class="primary" id="foodVocabulary">🃏 Словарь: '+WORDS.length+' карточек</button>'+
      '<button type="button" class="secondary food-back" id="foodBack">← К предметам</button></div></div>';
    card.querySelector('#foodTranslate').onclick=()=>{
      showRu=!showRu;
      card.querySelector('#foodSummary').dataset.ru=showRu?'on':'off';
      const b=card.querySelector('#foodTranslate');
      b.textContent=showRu?'🙈 Скрыть перевод':'🌐 Показать перевод';
      b.setAttribute('aria-expanded',String(showRu));
    };
    card.querySelector('#foodVocabulary').onclick=()=>startCards('et-ru');
    card.querySelector('#foodBack').onclick=()=>libraryBtn.click();
  }

  function shuffled(a){
    const copy=a.slice();
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=copy[i];copy[i]=copy[j];copy[j]=t;}
    return copy;
  }
  function startCards(next){
    mode='cards';direction=next;queue=shuffled(WORDS);known=0;mistakes=0;flipped=false;lock(true);
    if(restart){restart.hidden=false;restart.textContent='← К конспекту';}
    if(pill)pill.textContent='🃏 Словарь';
    if(sub)sub.textContent='Inimeseõpetus · '+WORDS.length+' карточки';
    renderCard();
  }
  function renderCard(){
    if(!queue.length){finishCards();return;}
    flipped=false;
    if(counter)counter.textContent='Осталось: '+queue.length;
    const item=queue[0],front=direction==='et-ru'?item[0]:item[1],back=direction==='et-ru'?item[1]:item[0];
    card.innerHTML='<div class="food-cards">'+
      '<div class="tiny" style="text-align:center">Словарь · '+(direction==='et-ru'?'Eesti → русский':'Русский → Eesti')+'</div>'+
      '<button type="button" class="food-flash" id="foodFlash" aria-label="Показать обратную сторону">'+
      '<span class="food-flash-label">'+(direction==='et-ru'?'Eesti':'Русский')+'</span>'+
      '<span id="foodCardText">'+esc(front)+'</span>'+
      '<span class="food-flash-label" id="foodTapHelp">Нажми, чтобы увидеть перевод</span></button>'+
      '<div class="food-card-actions" id="foodCardActions" hidden>'+
      '<button type="button" class="secondary" id="foodNo">✕ Повторить</button>'+
      '<button type="button" class="primary" id="foodYes">✓ Знаю</button></div>'+
      '<button type="button" class="secondary" id="foodChangeDirection">↔ Сменить направление</button>'+
      '</div>';
    card.querySelector('#foodFlash').onclick=()=>{
      if(flipped)return;flipped=true;
      card.querySelector('#foodCardText').textContent=back;
      card.querySelector('#foodTapHelp').textContent=direction==='et-ru'?'Русский':'Eesti';
      card.querySelector('#foodCardActions').hidden=false;
    };
    card.querySelector('#foodNo').onclick=()=>answer(false);
    card.querySelector('#foodYes').onclick=()=>answer(true);
    card.querySelector('#foodChangeDirection').onclick=()=>startCards(direction==='et-ru'?'ru-et':'et-ru');
  }
  function answer(ok){
    const item=queue.shift();
    if(ok){known++;}
    else {mistakes++;queue.splice(Math.min(2,queue.length),0,item);}
    renderCard();
  }
  function finishCards(){
    mode='done';lock(false);
    if(restart)restart.hidden=true;
    if(counter)counter.textContent='';
    card.innerHTML='<div class="done"><div class="big">🃏</div><h2>Слова повторены!</h2>'+
      '<p>'+WORDS.length+' слов · повторов: '+mistakes+'</p>'+
      '<div class="finish-actions">'+
      '<button type="button" class="primary" id="foodAgain">Ещё раз</button>'+
      '<button type="button" class="secondary" id="foodToLesson">К конспекту</button>'+
      '</div></div>';
    card.querySelector('#foodAgain').onclick=()=>startCards(direction);
    card.querySelector('#foodToLesson').onclick=renderLesson;
  }
  if(restart)restart.addEventListener('click',event=>{
    if(mode!=='cards'||!card.querySelector('#foodFlash'))return;
    event.preventDefault();event.stopImmediatePropagation();renderLesson();
  },true);
  window.EDUKASS_LESSONS.inimeneToitumineLesson=renderLesson;
})();