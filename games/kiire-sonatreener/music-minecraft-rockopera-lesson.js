(function musicMinecraftRockOperaLesson(){
  'use strict';
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const restart=document.getElementById('restart');
  const counter=document.getElementById('counter');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  const tabEt=document.getElementById('tabEt');
  const tabDe=document.getElementById('tabDe');
  const reviewBtn=document.getElementById('reviewBtn');
  if(!card||!libraryBtn||!restart||!counter||!pill||!tabEt||!tabDe)return;

  const acts=[
    {title:"I vaatus — Uus maailm",ru:"Первое действие — Новый мир",
      et:"Esimeses vaatuses satub Minecrafti kangelane uude maailma. Ta näeb vaenlasi, kellel on väga tugevad relvad.",
      translation:"В первом действии герой Minecraft попадает в новый мир. Он видит врагов, у которых очень мощное оружие.",
      music:"Klaver — kiire ja põnev muusika.",musicRu:"Фортепиано — быстрая, напряжённая музыка."},
    {title:"II vaatus — Ettevalmistus",ru:"Второе действие — Подготовка",
      et:"Teises vaatuses otsib kangelane materjale ja meisterdab endale kõige tugevama mõõga ja soomusrüü. Ta valmistub suureks lahinguks.",
      translation:"Во втором действии герой ищет материалы и создаёт себе самый мощный меч и доспехи. Он готовится к большой битве.",
      music:"Trummid — tugev rütm meisterdamise ajal.",musicRu:"Барабаны — чёткий ритм во время крафта."},
    {title:"III vaatus — Suur lahing",ru:"Третье действие — Большая битва",
      et:"Kolmandas vaatuses algab suur lahing. Kangelane võitleb vaenlastega, võidab ja tähistab oma võitu.",
      translation:"В третьем действии начинается большая битва. Герой сражается с врагами, побеждает и празднует победу.",
      music:"Basskitarr — võimas ja rõõmus lõpumuusika.",musicRu:"Бас-гитара — мощная и радостная финальная музыка."}
  ];
  const roles=[
    ["Helilooja","kirjutab ooperile muusika.","Композитор пишет музыку для оперы."],
    ["Kostüümikunstnik","teeb Minecrafti tegelaste kostüümid.","Художник по костюмам создаёт костюмы героев Minecraft."],
    ["Lavakunstnik","loob lavale Minecrafti maailma ja lahingupaiga.","Художник сцены создаёт мир Minecraft и место битвы."]
  ];
  const words=[
    ["lavastus","постановка"],["rokk-ooper","рок-опера"],["vaatus","действие спектакля"],
    ["kangelane","герой"],["maailm","мир"],["vaenlane","враг"],
    ["relv","оружие"],["materjal","материал"],["meisterdama","создавать, крафтить"],
    ["mõõk","меч"],["soomusrüü","доспехи"],["lahing","битва"],
    ["võitlema","сражаться"],["võit","победа"],["klaver","фортепиано"],
    ["trummid","барабаны"],["basskitarr","бас-гитара"],
    ["helilooja","композитор"],["kostüümikunstnik","художник по костюмам"],
    ["lavakunstnik","художник сцены"]
  ];
  const questions=[
    ["Mis on lavastuse pealkiri?","Minecraft: Viimane lahing.","Как называется постановка? — Minecraft: Последняя битва."],
    ["Mis liiki lavastus see on?","See on rokk-ooper.","Какой это вид постановки? — Это рок-опера."],
    ["Mida näeb kangelane esimeses vaatuses?","Ta näeb tugevate relvadega vaenlasi.","Что герой видит в первом действии? — Врагов с мощным оружием."],
    ["Mida teeb kangelane teises vaatuses?","Ta meisterdab mõõga ja soomusrüü.","Что герой делает во втором действии? — Крафтит меч и доспехи."],
    ["Mis toimub kolmandas vaatuses?","Kangelane võidab suure lahingu.","Что происходит в третьем действии? — Герой побеждает в большой битве."],
    ["Milliseid pille kasutatakse?","Klaverit, trumme ja basskitarri.","Какие инструменты используются? — Фортепиано, барабаны и бас-гитара."],
    ["Milline on muusikavorm?","Kolmeosaline vorm (ABA).","Какая музыкальная форма? — Трёхчастная форма ABA."],
    ["Kes kirjutab muusika?","Helilooja.","Кто пишет музыку? — Композитор."]
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  let mode="lesson",translations=false,queue=[],direction="et-ru",good=0,bad=0,flipped=false;
  function lock(on){
    tabEt.disabled=on;tabDe.disabled=on;libraryBtn.hidden=on;
    if(reviewBtn)reviewBtn.hidden=true;
  }
  function renderLesson(){
    mode="lesson";lock(false);restart.hidden=true;counter.textContent="";
    pill.textContent="🎵 Muusika";
    if(sub)sub.textContent="Урок 2 · Рок-опера Minecraft · 21.11.2026";
    const tr=translations;
    const actHtml=acts.map(a=>
      '<div class="summary-qa-item">'+
        '<strong>'+esc(a.title)+'</strong>'+
        (tr?'<p class="tiny">'+esc(a.ru)+'</p>':'')+
        '<p>'+esc(a.et)+'</p>'+
        (tr?'<p class="tiny">'+esc(a.translation)+'</p>':'')+
        '<p style="margin-top:8px"><strong>🎼 '+esc(a.music)+'</strong></p>'+
        (tr?'<p class="tiny">'+esc(a.musicRu)+'</p>':'')+
      '</div>').join('');
    const roleHtml=roles.map(r=>'<div class="summary-qa-item"><strong>'+esc(r[0])+'</strong><p>'+esc(r[1])+'</p>'+(tr?'<p class="tiny">'+esc(r[2])+'</p>':'')+'</div>').join('');
    const wordHtml=words.map(w=>'<div class="summary-word"><strong>'+esc(w[0])+'</strong>'+(tr?'<span>'+esc(w[1])+'</span>':'')+'</div>').join('');
    card.innerHTML=
      '<div class="summary-view">'+
        '<div class="summary-head"><div class="topic-kicker">🎵 Muusika · 21.11.2026</div>'+
        '<h2>Minecraft: Viimane lahing</h2><p class="tiny">Костина постановка · рок-опера в трёх действиях</p></div>'+
        '<div class="topic-actions">'+
          '<button class="primary" id="rockTranslations">'+(tr?'🙈 Скрыть русский перевод':'🌐 Показать русский перевод')+'</button>'+
          '<button class="secondary" id="rockCardsEt">🇪🇪 Карточки Eesti → русский</button>'+
          '<button class="secondary" id="rockCardsRu">🇷🇺 Карточки Русский → Eesti</button>'+
          '<button class="secondary" id="rockQuestions">❓ Проверить понимание</button>'+
        '</div>'+
        '<section class="summary-section"><h3>1. Lavastuse pealkiri ja liik</h3>'+
          '<div class="summary-qa"><div class="summary-qa-item"><strong>Lavastuse pealkiri:</strong>'+
          '<p>Minecraft: Viimane lahing</p><strong>Lavastuse liik:</strong><p>Ooper (rokk-ooper)</p>'+
          (tr?'<p class="tiny">Название — «Minecraft: Последняя битва». Вид постановки — опера (рок-опера).</p>':'')+
          '</div></div></section>'+
        '<section class="summary-section"><h3>2. Millest minu lavastus räägib?</h3><div class="summary-qa">'+actHtml+'</div></section>'+
        '<section class="summary-section"><h3>3. Kolm muusikainstrumenti</h3>'+
          '<div class="summary-qa"><div class="summary-qa-item"><p>Klaver, trummid ja basskitarr.</p>'+
          (tr?'<p class="tiny">Фортепиано, барабаны и бас-гитара.</p>':'')+'</div></div></section>'+
        '<section class="summary-section"><h3>4. Muusikavorm</h3><div class="summary-qa"><div class="summary-qa-item">'+
          '<p><strong>Kolmeosaline vorm (ABA).</strong></p>'+
          '<p>Alguses on kiire ja põnev muusika. Keskel on teistsugune, rütmiline muusika. Lõpus tuleb alguse meloodia tagasi, aga kõlab nüüd võimsalt ja rõõmsalt.</p>'+
          (tr?'<p class="tiny">Трёхчастная форма (ABA): сначала быстрая, напряжённая музыка, затем другая ритмичная музыка. В конце начальная мелодия возвращается, но звучит мощно и радостно.</p>':'')+
          '</div></div></section>'+
        '<section class="summary-section"><h3>5. Kes aitavad ooperit teha?</h3><div class="summary-qa">'+roleHtml+'</div></section>'+
        '<section class="summary-section"><h3>6. Miks see on ooper?</h3><div class="summary-qa"><div class="summary-qa-item">'+
          '<p>Kangelane ja vaenlased laulavad. Lõpus laulab koor võidulaulu.</p>'+
          (tr?'<p class="tiny">Герой и враги поют. В финале хор исполняет песню победы.</p>':'')+
          '</div></div></section>'+
        '<section class="summary-section"><h3>Õpi sõnu · '+words.length+' sõna</h3><div class="summary-words">'+wordHtml+'</div></section>'+
        '<button class="secondary" id="rockBack">← К предметам</button>'+
      '</div>';
    card.querySelector('#rockTranslations').onclick=()=>{translations=!translations;renderLesson()};
    card.querySelector('#rockCardsEt').onclick=()=>startCards("et-ru");
    card.querySelector('#rockCardsRu').onclick=()=>startCards("ru-et");
    card.querySelector('#rockQuestions').onclick=()=>startCards("questions");
    card.querySelector('#rockBack').onclick=()=>libraryBtn.click();
  }
  function startCards(which){
    mode="cards";direction=which;good=0;bad=0;
    queue=shuffle(which==="questions"?questions:words);
    lock(true);restart.hidden=false;restart.textContent="← К уроку";
    pill.textContent=which==="questions"?"❓ Minecraft: küsimused":"🎵 Minecraft: sõnad";
    if(sub)sub.textContent=which==="questions"?"Проверь понимание сюжета":which==="et-ru"?"Эстонский → русский":"Русский → эстонский";
    renderCard();
  }
  function renderCard(){
    if(!queue.length){finish();return}
    const w=queue[0],isQuestion=direction==="questions";
    const front=isQuestion?w[0]:(direction==="et-ru"?w[0]:w[1]);
    const back=isQuestion?w[1]:direction==="et-ru"?w[1]:w[0];
    flipped=false;counter.textContent="Осталось: "+queue.length;
    card.innerHTML='<div class="review-wrap">'+
      '<div class="tiny" style="text-align:center;margin-bottom:10px">'+
      (isQuestion?'Вопрос → ответ':direction==="et-ru"?'Eesti → русский':'Русский → Eesti')+'</div>'+
      '<div class="flashcard" id="rockFlash"><div class="flashcard-inner">'+
      '<div class="flash-face">'+esc(front)+'</div>'+
      '<div class="flash-face flash-back">'+esc(back)+(isQuestion?'<p class="tiny">'+esc(w[2])+'</p>':'')+'</div>'+
      '</div></div>'+
      '<div class="review-stats"><span>✓ '+good+'</span><span>✕ '+bad+'</span></div>'+
      '<div class="review-actions" id="rockActions" hidden>'+
      '<button class="review-no" id="rockNo">✕</button>'+
      '<button class="review-yes" id="rockYes">✓</button></div>'+
      '<div class="tiny" style="text-align:center">Нажми на карточку, чтобы увидеть ответ</div></div>';
    const f=card.querySelector('#rockFlash');
    f.onclick=()=>{if(flipped)return;flipped=true;f.classList.add("flipped");card.querySelector('#rockActions').hidden=false};
    card.querySelector('#rockYes').onclick=()=>decide(true);
    card.querySelector('#rockNo').onclick=()=>decide(false);
  }
  function decide(ok){
    const w=queue.shift();
    if(ok)good++;else{bad++;queue.splice(Math.min(queue.length,2),0,w)}
    renderCard();
  }
  function finish(){
    mode="done";lock(false);restart.hidden=true;counter.textContent="";pill.textContent="Готово";
    card.innerHTML='<div class="done"><div class="big">🏆</div><h2>Готово!</h2>'+
      '<div class="finish-actions"><button class="primary" id="rockAgain">Ещё раз</button>'+
      '<button class="secondary" id="rockFinishBack">К уроку</button></div></div>';
    card.querySelector('#rockAgain').onclick=()=>startCards(direction);
    card.querySelector('#rockFinishBack').onclick=renderLesson;
  }
  restart.addEventListener('click',e=>{
    if(mode!=="cards")return;
    e.preventDefault();e.stopImmediatePropagation();renderLesson();
  },true);
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.musicMinecraftRockOperaLesson=renderLesson;
})();
