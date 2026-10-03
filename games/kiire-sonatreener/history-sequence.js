(function enhanceHistoryAjastud(){
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  const original=window.EDUKASS_LESSONS.historyAjastud;
  if(typeof original!=='function')return;

  const ORDER=[
    ['muinasaeg','первобытность','🪨'],
    ['vanaaeg','Древний мир','🏛️'],
    ['keskaeg','Средние века','🏰'],
    ['uusaeg','Новое время','📜'],
    ['lähiaeg','Новейшее время','🏙️']
  ];

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

  let mode='topic';
  let selected=[];
  let qaQueue=[],qaIndex=0,qaGood=0;
  let gapQueue=[],gapIndex=0,gapGood=0;

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

  function lock(on){
    tabEt.disabled=on;
    tabDe.disabled=on;
    libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  }

  function timeline(){
    return '<div class="history-timeline">'+ORDER.map((x,i)=>
      '<div class="history-era"><span class="history-era-icon">'+x[2]+'</span><strong>'+esc(x[0])+'</strong><small>'+esc(x[1])+'</small></div>'+
      (i<ORDER.length-1?'<span class="history-arrow">→</span>':'')
    ).join('')+'</div>';
  }

  function renderTopic(){
    mode='topic';lock(false);restart.hidden=true;if(counter)counter.textContent='';
    pill.textContent='🏺 Ajalugu';
    if(sub)sub.textContent='Ajastud · 7 карточек · 3 тренировки';
    card.innerHTML=
      '<div class="topic-intro">'+
        '<div class="topic-kicker">🏺 Ajalugu</div>'+
        '<h2>Ajastud</h2>'+
        '<p>Исторические эпохи и их порядок.</p>'+
        timeline()+
        '<div class="topic-actions">'+
          '<button class="primary" id="histCardsEtRu">🃏 Eesti → русский</button>'+
          '<button class="secondary" id="histCardsRuEt">🃏 Русский → Eesti</button>'+
          '<button class="secondary" id="histOrder">🕰️ Поставь эпохи по порядку</button>'+
          '<button class="secondary" id="histNext">➡️ Что идёт до / после?</button>'+
          '<button class="secondary" id="histGap">🔗 Пропущенная эпоха</button>'+
        '</div>'+
      '</div>';

    card.querySelector('#histCardsEtRu').onclick=()=>openOriginalCards('historyEtRu');
    card.querySelector('#histCardsRuEt').onclick=()=>openOriginalCards('historyRuEt');
    card.querySelector('#histOrder').onclick=startOrder;
    card.querySelector('#histNext').onclick=startBeforeAfter;
    card.querySelector('#histGap').onclick=startGap;
  }

  function openOriginalCards(buttonId){
    original();
    const b=card.querySelector('#'+buttonId);
    if(b)b.click();
  }

  function startOrder(){
    mode='order';selected=[];lock(true);restart.hidden=false;restart.textContent='← Выйти';
    pill.textContent='🕰️ Порядок эпох';
    if(sub)sub.textContent='Нажимай от самой ранней эпохи к самой поздней';
    renderOrder();
  }

  function renderOrder(message=''){
    const remaining=ORDER.filter(x=>!selected.includes(x[0]));
    const shuffled=shuffle(remaining);
    const chosen=selected.map(id=>{
      const x=ORDER.find(y=>y[0]===id);
      return '<span class="history-choice chosen">'+x[2]+' '+esc(x[0])+'</span>';
    }).join('<span class="history-arrow">→</span>') || '<span class="tiny">Пока ничего не выбрано</span>';
    card.innerHTML=
      '<div class="summary-view">'+
        '<div class="summary-head"><h2>🕰️ Поставь эпохи по порядку</h2><div class="tiny">Нажимай от самой ранней к самой поздней</div></div>'+
        '<div class="history-selected">'+chosen+'</div>'+
        '<div class="history-choice-grid">'+shuffled.map(x=>'<button class="secondary history-pick" data-era="'+esc(x[0])+'">'+x[2]+' '+esc(x[0])+'</button>').join('')+'</div>'+
        (message?'<div class="history-feedback">'+message+'</div>':'')+
        '<button class="secondary" id="histOrderReset">↻ Начать заново</button>'+
      '</div>';
    card.querySelectorAll('[data-era]').forEach(b=>b.onclick=()=>{
      const expected=ORDER[selected.length][0];
      const value=b.dataset.era;
      if(value===expected){
        selected.push(value);
        if(selected.length===ORDER.length){
          card.innerHTML='<div class="done"><div class="big">🕰️</div><h2>Верно!</h2>'+timeline()+'<div class="finish-actions"><button class="primary" id="histOrderAgain">Ещё раз</button><button class="secondary" id="histOrderBack">К уроку</button></div></div>';
          card.querySelector('#histOrderAgain').onclick=startOrder;
          card.querySelector('#histOrderBack').onclick=renderTopic;
        }else renderOrder('<strong>✓ Верно</strong>');
      }else{
        const right=ORDER[selected.length];
        renderOrder('<strong>Не эта.</strong> Сейчас нужна эпоха перед «'+esc(right[1])+'».');
      }
    });
    card.querySelector('#histOrderReset').onclick=startOrder;
  }

  function makeBeforeAfterQuestions(){
    const q=[];
    for(let i=0;i<ORDER.length;i++){
      if(i<ORDER.length-1)q.push({q:'Mis ajastu tuleb pärast «'+ORDER[i][0]+'»?',a:ORDER[i+1][0],ru:'Что идёт после «'+ORDER[i][1]+'»?'});
      if(i>0)q.push({q:'Mis ajastu oli enne «'+ORDER[i][0]+'»?',a:ORDER[i-1][0],ru:'Что было перед «'+ORDER[i][1]+'»?'});
    }
    return shuffle(q);
  }

  function startBeforeAfter(){
    mode='beforeafter';qaQueue=makeBeforeAfterQuestions();qaIndex=0;qaGood=0;
    lock(true);restart.hidden=false;restart.textContent='← Выйти';
    pill.textContent='➡️ До / после';
    renderBeforeAfter();
  }

  function renderBeforeAfter(feedback=''){
    if(qaIndex>=qaQueue.length){
      card.innerHTML='<div class="done"><div class="big">➡️</div><h2>Готово!</h2><p>Правильно: '+qaGood+' из '+qaQueue.length+'</p><div class="finish-actions"><button class="primary" id="histNextAgain">Ещё раз</button><button class="secondary" id="histNextBack">К уроку</button></div></div>';
      card.querySelector('#histNextAgain').onclick=startBeforeAfter;
      card.querySelector('#histNextBack').onclick=renderTopic;
      return;
    }
    const q=qaQueue[qaIndex];
    const opts=shuffle(ORDER.map(x=>x[0])).slice(0,4);
    if(!opts.includes(q.a))opts[0]=q.a;
    const unique=shuffle([...new Set(opts)]);
    if(sub)sub.textContent='Вопрос '+(qaIndex+1)+' из '+qaQueue.length;
    card.innerHTML=
      '<div class="summary-view">'+timeline()+
      '<div class="summary-head"><h2>'+esc(q.q)+'</h2><div class="tiny">'+esc(q.ru)+'</div></div>'+
      '<div class="history-choice-grid">'+unique.map(x=>'<button class="secondary history-answer" data-answer="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>'+
      (feedback?'<div class="history-feedback">'+feedback+'</div>':'')+
      '</div>';
    card.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
      const ok=b.dataset.answer===q.a;
      if(ok)qaGood++;
      const answer=q.a;
      qaIndex++;
      renderBeforeAfter(ok?'<strong>✓ '+esc(answer)+'</strong>':'Правильный ответ: <strong>'+esc(answer)+'</strong>');
    });
  }

  function makeGapQuestions(){
    return shuffle(ORDER.map((x,i)=>({
      index:i,
      answer:x[0]
    })));
  }

  function startGap(){
    mode='gap';gapQueue=makeGapQuestions();gapIndex=0;gapGood=0;
    lock(true);restart.hidden=false;restart.textContent='← Выйти';
    pill.textContent='🔗 Пропущенная эпоха';
    renderGap();
  }

  function renderGap(feedback=''){
    if(gapIndex>=gapQueue.length){
      card.innerHTML='<div class="done"><div class="big">🔗</div><h2>Готово!</h2><p>Правильно: '+gapGood+' из '+gapQueue.length+'</p><div class="finish-actions"><button class="primary" id="histGapAgain">Ещё раз</button><button class="secondary" id="histGapBack">К уроку</button></div></div>';
      card.querySelector('#histGapAgain').onclick=startGap;
      card.querySelector('#histGapBack').onclick=renderTopic;
      return;
    }
    const q=gapQueue[gapIndex];
    const chain=ORDER.map((x,i)=>i===q.index?'____':esc(x[0])).join(' → ');
    const opts=shuffle(ORDER.map(x=>x[0]));
    if(sub)sub.textContent='Задание '+(gapIndex+1)+' из '+gapQueue.length;
    card.innerHTML=
      '<div class="summary-view">'+
        '<div class="summary-head"><h2>🔗 Какая эпоха пропущена?</h2></div>'+
        '<div class="history-gap-chain">'+chain+'</div>'+
        '<div class="history-choice-grid">'+opts.map(x=>'<button class="secondary history-gap-answer" data-gap="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>'+
        (feedback?'<div class="history-feedback">'+feedback+'</div>':'')+
      '</div>';
    card.querySelectorAll('[data-gap]').forEach(b=>b.onclick=()=>{
      const ok=b.dataset.gap===q.answer;
      if(ok)gapGood++;
      const answer=q.answer;
      gapIndex++;
      renderGap(ok?'<strong>✓ '+esc(answer)+'</strong>':'Правильный ответ: <strong>'+esc(answer)+'</strong>');
    });
  }

  restart.addEventListener('click',e=>{
    if(!['order','beforeafter','gap'].includes(mode))return;
    e.preventDefault();e.stopImmediatePropagation();renderTopic();
  },true);

  const style=document.createElement('style');
  style.textContent=`
    .history-timeline{display:flex;align-items:center;gap:7px;overflow-x:auto;padding:12px 4px 16px;margin:8px 0 14px}
    .history-era{min-width:104px;padding:10px 8px;border:1px solid #dfe8e2;border-radius:14px;background:#fff;text-align:center;display:grid;gap:3px}
    .history-era-icon{font-size:25px}.history-era strong{font-size:14px;color:#21352c}.history-era small{font-size:11px;color:#68756e}
    .history-arrow{font-weight:900;color:#6f8178;font-size:20px}
    .history-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .history-selected{display:flex;align-items:center;gap:6px;overflow-x:auto;min-height:64px;padding:10px;border:1px dashed #cbd9d1;border-radius:14px;margin:8px 0 14px}
    .history-choice.chosen{white-space:nowrap;padding:9px 10px;background:#fff;border:1px solid #dfe8e2;border-radius:12px;font-weight:800}
    .history-feedback{padding:12px 14px;border-radius:12px;background:#f4f8f5;text-align:center;margin:12px 0}
    .history-gap-chain{font-size:clamp(17px,4.5vw,24px);font-weight:900;line-height:1.7;text-align:center;padding:18px 10px;margin:8px 0 16px;background:#fff;border:1px solid #dfe8e2;border-radius:14px}
    @media(max-width:560px){.history-choice-grid{grid-template-columns:1fr}.history-era{min-width:96px}}
  `;
  document.head.appendChild(style);

  window.EDUKASS_LESSONS.historyAjastud=renderTopic;
})();