(function inimeneKontrollLesson(){
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

  // Exactly the four topics specified in the eKool assessment.
  const TOPICS = [
    {title:'1. Mõõdetavad tervisenäitajad',ru:'Измеряемые показатели здоровья',
      defs:[['Mõõdetavaid tervisenäitajaid saab mõõta ja väljendada arvudega.','Измеряемые показатели здоровья можно измерить и выразить числами.']],
      examples:[['Pikkus, kehakaal, pulss ja kehatemperatuur.','Рост, вес, пульс и температура тела.']]},
    {title:'2. Hinnangulised tervisenäitajad',ru:'Оценочные показатели здоровья',
      defs:[['Hinnangulisi tervisenäitajaid hinnatakse inimese enesetunde järgi.','Оценочные показатели здоровья оценивают по самочувствию человека.']],
      examples:[['Enesetunne, meeleolu ja une kvaliteet.','Самочувствие, настроение и качество сна.']]},
    {title:'3. Tervist mõjutavad tegurid',ru:'Факторы, влияющие на здоровье',
      defs:[['Tervist mõjutavad eluviis, pärilikkus, keskkond ja arstiabi.','На здоровье влияют образ жизни, наследственность, окружающая среда и медицинская помощь.']],
      examples:[
        ['Eluviis – tervislik toit ja sport.','Образ жизни — здоровое питание и спорт.'],
        ['Pärilikkus – mul on allergia nagu mu isal.','Наследственность — у меня аллергия, как у папы.'],
        ['Keskkond – puhas õhk ja vesi.','Окружающая среда — чистый воздух и вода.'],
        ['Arstiabi – arst ravib haigusi.','Медицинская помощь — врач лечит болезни.']
      ]},
    {title:'4. Hea ja halb stress',ru:'Хороший и плохой стресс',
      defs:[
        ['Stress on organismi pingeseisund.','Стресс — это состояние напряжения организма.'],
        ['Hea stress on positiivne pinge, mis aitab paremini tegutseda.','Хороший стресс — положительное напряжение, которое помогает действовать лучше.'],
        ['Halb stress on negatiivne pinge, mis võib tervist kahjustada.','Плохой стресс — отрицательное напряжение, которое может вредить здоровью.']
      ],
      examples:[
        ['Hea stress: spordivõistlus.','Хороший стресс: спортивное соревнование.'],
        ['Halb stress: kontrolltöö, palju kodutöid ja tüli sõbraga.','Плохой стресс: контрольная, много домашних заданий и ссора с другом.']
      ]}
  ];

  // Short dictionary in basic forms, intended for two-sided study cards.
  const WORDS = [
    ['tervisenäitaja','показатель здоровья'],
    ['mõõdetav','измеряемый'],
    ['pikkus','рост'],
    ['kehakaal','вес тела'],
    ['pulss','пульс'],
    ['kehatemperatuur','температура тела'],
    ['hinnanguline','оценочный'],
    ['enesetunne','самочувствие'],
    ['meeleolu','настроение'],
    ['eluviis','образ жизни'],
    ['pärilikkus','наследственность'],
    ['keskkond','окружающая среда'],
    ['arstiabi','медицинская помощь'],
    ['allergia','аллергия'],
    ['tervislik toit','здоровое питание'],
    ['stress','стресс'],
    ['pingeseisund','состояние напряжения'],
    ['hea stress','хороший стресс'],
    ['halb stress','плохой стресс'],
    ['kahjustama','вредить'],
    ['spordivõistlus','спортивное соревнование'],
    ['kontrolltöö','контрольная работа'],
    ['tüli','ссора']
  ];
  const esc = x => String(x).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Preserve the appearance and controls of every other lesson.
  if(!document.getElementById('inimeneKontrollStyle')){
    const style=document.createElement('style');
    style.id='inimeneKontrollStyle';
    style.textContent=
      '.hw-summary{display:grid;gap:11px;max-width:780px;margin:0 auto}'+
      '.hw-summary h2{font-size:clamp(23px,6vw,30px);color:#2f6f58;margin:4px 0 0}'+
      '.hw-summary .hw-subtitle{font-size:13px;color:#66776d}'+
      '.hw-tools{display:grid;gap:8px}'+
      '.hw-section{background:#fff;border:1px solid #dce7de;border-radius:14px;padding:13px 14px;display:grid;gap:8px}'+
      '.hw-section h3{margin:0;font-size:17px;line-height:1.3;color:#275b42}'+
      '.hw-et{font-size:16px;line-height:1.45;font-weight:600;color:#263a30}'+
      '.hw-ru{font-size:14px;line-height:1.45;color:#586a5f;padding-top:4px}'+
      '.hw-summary[data-ru="off"] .hw-ru{display:none!important}'+
      '.hw-line{border-left:3px solid #d8e9df;padding-left:10px}'+
      '.hw-label{color:#6b8073;font-size:12px;font-weight:800;letter-spacing:.03em;text-transform:uppercase}'+
      '.hw-examples{display:grid;gap:7px}'+
      '.hw-back{width:100%;margin-top:3px}'+
      '.hw-cards{max-width:650px;margin:0 auto;display:grid;gap:12px}'+
      '.hw-flash{display:grid;align-items:center;justify-items:center;min-height:205px;border-radius:18px;background:#fff;border:2px solid #dce7de;padding:20px 12px;width:100%;color:#244c38;box-shadow:0 6px 18px rgba(0,0,0,.04);cursor:pointer;font-weight:800;font-size:clamp(23px,5vw,31px);text-align:center;overflow-wrap:anywhere}'+
      '.hw-flash-label{font-weight:600;font-size:13px;color:#718478}'+
      '.hw-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}'+
      '.hw-card-actions[hidden]{display:none!important}'+
      '.hw-card-actions button{min-height:48px}';
    document.head.appendChild(style);
  }

  let mode='lesson', showRu=false, direction='et-ru', queue=[], known=0, mistakes=0, flipped=false;
  const lock=on=>{
    if(tabEt)tabEt.disabled=on;
    if(tabDe)tabDe.disabled=on;
    libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  };
  function pair(et,ru){
    return '<div class="hw-line"><div class="hw-et" lang="et">'+esc(et)+'</div><div class="hw-ru" lang="ru">'+esc(ru)+'</div></div>';
  }
  function renderLesson(){
    mode='lesson';lock(false);
    if(restart)restart.hidden=true;
    if(counter)counter.textContent='';
    if(pill)pill.textContent='👤 Inimeseõpetus';
    if(sub)sub.textContent='Урок 3 · Контрольная 6 ноября · 4 темы';
    const blocks=TOPICS.map(topic=>
      '<section class="hw-section"><h3>'+esc(topic.title)+'</h3>'+
      '<div class="hw-ru">'+esc(topic.ru)+'</div>'+
      topic.defs.map(row=>pair(row[0],row[1])).join('')+
      '<div class="hw-label">Näited</div>'+
      '<div class="hw-examples">'+topic.examples.map(row=>pair(row[0],row[1])).join('')+'</div></section>'
    ).join('');
    card.innerHTML=
      '<div id="hwSummary" class="hw-summary" data-ru="'+(showRu?'on':'off')+'">'+
      '<div class="topic-intro"><div class="topic-kicker">👤 Inimeseõpetus · Урок 3</div>'+
      '<h2>Kontrolltöö: tervis ja stress</h2><div class="hw-subtitle">4 темы · определения и примеры</div></div>'+
      '<div class="hw-tools"><button type="button" class="secondary" id="hwTranslate" aria-expanded="'+String(showRu)+'">'+
      (showRu?'🙈 Скрыть перевод':'🌐 Показать перевод')+'</button></div>'+
      blocks+
      '<div class="hw-tools"><button type="button" class="primary" id="hwVocabulary">🃏 Словарь: '+WORDS.length+' карточки</button>'+
      '<button type="button" class="secondary hw-back" id="hwBack">← К предметам</button></div></div>';
    card.querySelector('#hwTranslate').onclick=()=>{
      showRu=!showRu;
      card.querySelector('#hwSummary').dataset.ru=showRu?'on':'off';
      const b=card.querySelector('#hwTranslate');
      b.textContent=showRu?'🙈 Скрыть перевод':'🌐 Показать перевод';
      b.setAttribute('aria-expanded',String(showRu));
    };
    card.querySelector('#hwVocabulary').onclick=()=>startCards('et-ru');
    card.querySelector('#hwBack').onclick=()=>libraryBtn.click();
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
    card.innerHTML='<div class="hw-cards">'+
      '<div class="tiny" style="text-align:center">Словарь · '+(direction==='et-ru'?'Eesti → русский':'Русский → Eesti')+'</div>'+
      '<button type="button" class="hw-flash" id="hwFlash" aria-label="Показать обратную сторону">'+
      '<span class="hw-flash-label">'+(direction==='et-ru'?'Eesti':'Русский')+'</span>'+
      '<span id="hwCardText">'+esc(front)+'</span>'+
      '<span class="hw-flash-label" id="hwTapHelp">Нажми, чтобы увидеть перевод</span></button>'+
      '<div class="hw-card-actions" id="hwCardActions" hidden>'+
      '<button type="button" class="secondary" id="hwNo">✕ Повторить</button>'+
      '<button type="button" class="primary" id="hwYes">✓ Знаю</button></div>'+
      '<button type="button" class="secondary" id="hwChangeDirection">↔ Сменить направление</button>'+
      '</div>';
    card.querySelector('#hwFlash').onclick=()=>{
      if(flipped)return;flipped=true;
      card.querySelector('#hwCardText').textContent=back;
      card.querySelector('#hwTapHelp').textContent=direction==='et-ru'?'Русский':'Eesti';
      card.querySelector('#hwCardActions').hidden=false;
    };
    card.querySelector('#hwNo').onclick=()=>answer(false);
    card.querySelector('#hwYes').onclick=()=>answer(true);
    card.querySelector('#hwChangeDirection').onclick=()=>startCards(direction==='et-ru'?'ru-et':'et-ru');
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
      '<button type="button" class="primary" id="hwAgain">Ещё раз</button>'+
      '<button type="button" class="secondary" id="hwToLesson">К конспекту</button>'+
      '</div></div>';
    card.querySelector('#hwAgain').onclick=()=>startCards(direction);
    card.querySelector('#hwToLesson').onclick=renderLesson;
  }
  if(restart)restart.addEventListener('click',event=>{
    if(mode!=='cards')return;
    event.preventDefault();event.stopImmediatePropagation();renderLesson();
  },true);
  window.EDUKASS_LESSONS.inimeneKontrollLesson=renderLesson;
})();