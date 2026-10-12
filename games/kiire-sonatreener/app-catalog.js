window.EDUKASS_CATALOG=[
  {id:"loodus",label:"Loodus",icon:"🌿",lessons:[
    {kind:"core",lang:"et",topic:"vesi-ja-jogi",extraMeta:"6 вопросов · 🖼"},
    {kind:"custom",handler:"loodusJarvedLesson",title:"Урок 2 — Järved",meta:"6 предложений · перевод · карточки"}
  ]},
  {id:"inimene",label:"Inimene",icon:"👤",lessons:[{kind:"custom",handler:"inimeneTervisLesson",title:"Урок 1 — Tervis · 03.10.26",meta:"4 карточки"}]},
  {id:"eesti-keel",label:"Eesti keel",icon:"📝",lessons:[
    {kind:"core",lang:"et",topic:"eesti-keel-1"},
    {kind:"core",lang:"et",topic:"eesti-keel-2"},
    {kind:"core",lang:"et",topic:"eesti-keel-3"},
    {kind:"core",lang:"et",topic:"eesti-keel-raadio-kolar"}
  ]},
  {id:"english",label:"English",icon:"🇬🇧",lessons:[
    {kind:"core",lang:"en",topic:"present-simple-words",extraMeta:"🔊 озвучка"},
    {kind:"custom",handler:"englishPresentSimple3",title:"Тренировка Present Simple — он, она, оно",meta:"7 глаголов · -s / -es / -ies"}
  ]},
  {id:"deutsch",label:"Deutsch",icon:"🇩🇪",lessons:[
    {kind:"core",lang:"de",topic:"lektion-1",meta:"2 текста"},
    {kind:"custom",handler:"deutschLesson2",title:"Lektion 2 — Reflexive Verben",meta:"3 таблицы"},
    {kind:"custom",handler:"deutschPaulaLesson",title:"Урок 3 — Paula: проверка понимания текста · 03.10.26",meta:"39 слов · 24 предложения · 🔊 озвучка"}
  ]},
  {id:"eesti-kirjandus",label:"Eesti kirjandus",icon:"📖",lessons:[
    {kind:"core",lang:"et",topic:"sonad-1"},
    {kind:"custom",handler:"litHistoryBookLesson",title:"Урок 2 — Исторические тексты о книге",meta:"2 текста · перевод · письменное задание"},
    {kind:"core",lang:"et",topic:"muinasjutud"},
    {kind:"core",lang:"et",topic:"rebane-saba",extraMeta:"7 вопросов · 03.10.26"},
    {kind:"custom",handler:"litOmaOnnLesson",title:"Урок 5 — Igaühel oma õnn · 08.10.26",meta:"4 страницы · письменный план (A1)"}
  ]},
  {id:"muusika",label:"Muusika",icon:"🎵",lessons:[
    {kind:"custom",handler:"musicLesson1",title:"Урок 1 — Kontrolltöö: tämber, dünaamika · 03.10.26",meta:"19 эстонских слов · 13 музыкальных терминов"}
  ]},
  {id:"ajalugu",label:"Ajalugu",icon:"🏺",lessons:[{kind:"custom",handler:"historyAjastud",title:"Ajastud",meta:"12 карточек · 3 тренировки"}]}
];

// Kept in the catalog so installed/cached app shells can open the new lesson.
(function loodusJarvedLesson(){
  if(window.EDUKASS_LOODUS_JARVED_REGISTERED)return;
  window.EDUKASS_LOODUS_JARVED_REGISTERED=true;
  'use strict';
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  const card=document.getElementById('card');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  const counter=document.getElementById('counter');
  const restart=document.getElementById('restart');
  const libraryBtn=document.getElementById('libraryBtn');
  const tabEt=document.getElementById('tabEt');
  const tabDe=document.getElementById('tabDe');
  const reviewBtn=document.getElementById('reviewBtn');
  if(!card||!libraryBtn||!restart)return;

  // Sentences are reproduced from the homework for 13 October 2026.
  const SENTENCES=[
    {et:'Järv on mageda-veeline veekogu.',ru:'Озеро — это пресноводный водоём.'},
    {et:'Eesti suurim järv on Peipsi järv.',ru:'Самое большое озеро Эстонии — Чудское озеро.'},
    {et:'Eesti sügavaim järv on Rõuge Suur-järv.',ru:'Самое глубокое озеро Эстонии — Рыуге-Сууръярв.'},
    {et:'Umbjärv - millest ei voola välja ühtegi jõge.',ru:'Бессточное озеро — озеро, из которого не вытекает ни одна река.'},
    {et:'Läbivoolujärv - kuhu suubub üks või mitu jõge ning kust algab jõgi.',ru:'Проточное озеро — озеро, в которое впадает одна или несколько рек и из которого вытекает река.'},
    {et:'Rannajärv - merelahest tekkinud järv.',ru:'Прибрежное озеро — озеро, образовавшееся из морского залива.'}
  ];
  const css=document.createElement('style');
  css.textContent=`
    .jarved-lesson{display:grid;gap:16px;width:100%;max-width:790px;margin:auto}
    .jarved-lesson h2{font-size:clamp(26px,6vw,34px);color:#2f6f58;margin:0}
    .jarved-pairs{display:grid;gap:11px}
    .jarved-pair{padding:15px 16px;border-radius:15px;border:1px solid #dfe8e2;background:white;line-height:1.5}
    .jarved-et{font-size:clamp(17px,4.5vw,20px);font-weight:800;color:#21352c;overflow-wrap:anywhere}
    .jarved-ru{font-size:clamp(15px,4vw,18px);color:#52675b;margin-top:6px;overflow-wrap:anywhere}
    .jarved-hidden .jarved-ru{display:none}
    .jarved-controls{display:flex;flex-wrap:wrap;gap:10px}
    .jarved-controls button{flex:1 1 180px}
    .jarved-study{background:white;border:1px solid #dfe8e2;border-radius:18px;min-height:185px;padding:22px 16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;text-align:center}
    .jarved-study-front{font-size:clamp(21px,5.8vw,29px);font-weight:850;line-height:1.4;overflow-wrap:anywhere}
    .jarved-study-answer{font-size:clamp(18px,4.8vw,23px);color:#2f6f58;line-height:1.45;overflow-wrap:anywhere;border-top:1px solid #dfe8e2;padding-top:15px;width:100%}
    .jarved-stats{display:flex;gap:20px;justify-content:center;font-weight:800}
  `;
  document.head.appendChild(css);

  let mode='lesson',hideRu=false,direction='et-ru',queue=[],correct=0,errors=0,revealed=false;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#039;'}[c]));
  const shuffle=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function lock(on){
    if(tabEt)tabEt.disabled=on;
    if(tabDe)tabDe.disabled=on;
    libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  }
  function renderLesson(){
    mode='lesson';lock(false);restart.hidden=true;
    if(counter)counter.textContent='';
    if(pill)pill.textContent='🌿 Loodus';
    if(sub)sub.textContent='Урок 2 · Järved · 6 определений';
    card.innerHTML=`
      <div class="jarved-lesson ${hideRu?'jarved-hidden':''}">
        <div class="topic-intro">
          <div class="topic-kicker">🌿 Loodusõpetus · Урок 2</div>
          <h2>Järved</h2>
          <p class="tiny">Озёра · К уроку 13.10.2026</p>
        </div>
        <div class="jarved-controls"><button type="button" class="secondary" id="jarvedToggle">${hideRu?'👁 Показать русский перевод':'🙈 Скрыть русский перевод'}</button></div>
        <div class="jarved-pairs">${SENTENCES.map((x,i)=>`
          <div class="jarved-pair">
            <div class="jarved-et" lang="et">${i+1}. ${esc(x.et)}</div>
            <div class="jarved-ru" lang="ru">${esc(x.ru)}</div>
          </div>`).join('')}</div>
        <div class="jarved-controls">
          <button type="button" class="primary" id="jarvedEtRu">🃏 Eesti → русский</button>
          <button type="button" class="secondary" id="jarvedRuEt">🃏 Русский → Eesti</button>
        </div>
        <button type="button" class="secondary" id="jarvedHome">← К предметам</button>
      </div>`;
    card.querySelector('#jarvedToggle').onclick=()=>{hideRu=!hideRu;renderLesson()};
    card.querySelector('#jarvedEtRu').onclick=()=>startCards('et-ru');
    card.querySelector('#jarvedRuEt').onclick=()=>startCards('ru-et');
    card.querySelector('#jarvedHome').onclick=()=>libraryBtn.click();
  }
  function startCards(dir){
    mode='cards';direction=dir;queue=shuffle(SENTENCES);correct=0;errors=0;revealed=false;lock(true);
    restart.hidden=false;restart.textContent='← К уроку';
    renderCard();
  }
  function renderCard(){
    if(queue.length===0){renderDone();return;}
    mode='cards';
    const x=queue[0],front=direction==='et-ru'?x.et:x.ru,back=direction==='et-ru'?x.ru:x.et;
    if(pill)pill.textContent='🌊 Järved';
    if(sub)sub.textContent=direction==='et-ru'?'Eesti → русский':'Русский → Eesti';
    if(counter)counter.textContent='Осталось: '+queue.length;
    card.innerHTML=`
      <div class="jarved-lesson">
        <div class="tiny" style="text-align:center">Вспомни перевод, затем проверь себя</div>
        <div class="jarved-study">
          <div class="jarved-study-front" lang="${direction==='et-ru'?'et':'ru'}">${esc(front)}</div>
          ${revealed?'<div class="jarved-study-answer" lang="'+(direction==='et-ru'?'ru':'et')+'">'+esc(back)+'</div>':''}
        </div>
        <div class="jarved-stats"><span>✓ ${correct}</span><span>✕ ${errors}</span></div>
        <div class="jarved-controls">${revealed?'<button class="secondary" id="jarvedWrong">✕ Повторить</button><button class="primary" id="jarvedCorrect">✓ Знаю</button>':'<button class="primary" id="jarvedReveal">Показать перевод</button>'}</div>
        <button class="secondary" id="jarvedBack">← Весь текст</button>
      </div>`;
    if(!revealed)card.querySelector('#jarvedReveal').onclick=()=>{revealed=true;renderCard()};
    else{
      card.querySelector('#jarvedCorrect').onclick=()=>decide(true);
      card.querySelector('#jarvedWrong').onclick=()=>decide(false);
    }
    card.querySelector('#jarvedBack').onclick=renderLesson;
  }
  function decide(ok){
    if(!queue.length)return;
    const x=queue.shift();
    if(ok)correct++;
    else{
      errors++;
      // Unlearned material appears again after other cards.
      const pos=Math.min(queue.length,2);
      queue.splice(pos,0,x);
    }
    revealed=false;renderCard();
  }
  function renderDone(){
    mode='done';lock(false);restart.hidden=true;if(counter)counter.textContent='';
    if(pill)pill.textContent='🌊 Järved';
    if(sub)sub.textContent='Все 6 предложений повторены';
    card.innerHTML='<div class="jarved-lesson"><div class="done"><div class="big">🌊</div><h2>Готово!</h2><p>Все предложения выучены. Ошибок при повторении: '+errors+'</p><div class="jarved-controls"><button class="primary" id="jarvedAgain">Ещё раз</button><button class="secondary" id="jarvedDoneBack">К тексту</button></div></div></div>';
    card.querySelector('#jarvedAgain').onclick=()=>startCards(direction);
    card.querySelector('#jarvedDoneBack').onclick=renderLesson;
  }
  restart.addEventListener('click',e=>{
    if(mode!=='cards')return;
    e.preventDefault();e.stopImmediatePropagation();renderLesson();
  },true);
  window.EDUKASS_LESSONS.loodusJarvedLesson=renderLesson;
})();
