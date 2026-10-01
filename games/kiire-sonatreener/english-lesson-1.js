(()=>{
  const WORDS=[
    {en:"always",ru:"всегда"},
    {en:"usually",ru:"обычно"},
    {en:"often",ru:"часто"},
    {en:"sometimes",ru:"иногда"},
    {en:"every day",ru:"каждый день"}
  ];

  const card=document.getElementById("card");
  const libraryBtn=document.getElementById("libraryBtn");
  const reviewBtn=document.getElementById("reviewBtn");
  const tabEt=document.getElementById("tabEt");
  const tabDe=document.getElementById("tabDe");
  const restart=document.getElementById("restart");
  const counter=document.getElementById("counter");
  const pill=document.getElementById("pill");
  const sub=document.getElementById("sub");
  if(!card||!libraryBtn||!restart||!counter||!pill||!sub)return;

  let active=false;
  let direction="en-ru";
  let queue=[];
  let good=0;
  let bad=0;
  let flipped=false;

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

  function lock(on){
    if(tabEt)tabEt.disabled=on;
    if(tabDe)tabDe.disabled=on;
    if(reviewBtn)reviewBtn.hidden=true;
    libraryBtn.hidden=on;
  }

  function speak(text){
    if(!("speechSynthesis" in window)){
      alert("На этом устройстве озвучка недоступна.");
      return;
    }
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang="en-GB";
    u.rate=0.82;
    u.pitch=1;
    const voices=window.speechSynthesis.getVoices();
    const voice=voices.find(v=>/^en-GB$/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
    if(voice)u.voice=voice;
    window.speechSynthesis.speak(u);
  }

  function speakAll(){
    if(!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    WORDS.forEach((x,i)=>{
      const u=new SpeechSynthesisUtterance(x.en);
      u.lang="en-GB";
      u.rate=0.78;
      const voices=window.speechSynthesis.getVoices();
      const voice=voices.find(v=>/^en-GB$/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
      if(voice)u.voice=voice;
      if(i<WORDS.length-1)u.text=x.en+".";
      window.speechSynthesis.speak(u);
    });
  }

  function englishFace(text,isEnglish){
    return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;width:100%;height:100%">
      <div class="english-card-word">${esc(text)}</div>
      ${isEnglish?'<button type="button" class="english-speak-btn" aria-label="Послушать произношение">🔊 Послушать</button>':""}
    </div>`;
  }

  function renderTopic(){
    active=false;
    lock(false);
    restart.hidden=true;
    counter.textContent="";
    pill.textContent="🇬🇧 English";
    sub.textContent="Present Simple · 5 карточек · 🔊 озвучка";
    card.innerHTML=`<div class="topic-intro">
      <div class="topic-kicker">🇬🇧 English</div>
      <h2>Present Simple — слова</h2>
      <p>Слова из задания учителя: always, usually, often, sometimes, every day.</p>
      <div class="topic-actions">
        <button class="primary" id="englishEnRu">🃏 English → русский</button>
        <button class="secondary" id="englishRuEn">🃏 Русский → English</button>
        <button class="secondary" id="englishListenAll">🔊 Послушать все слова</button>
      </div>
    </div>`;
    card.querySelector("#englishEnRu").onclick=()=>start("en-ru");
    card.querySelector("#englishRuEn").onclick=()=>start("ru-en");
    card.querySelector("#englishListenAll").onclick=speakAll;
  }

  function start(dir){
    active=true;
    direction=dir;
    queue=shuffle(WORDS);
    good=0;
    bad=0;
    flipped=false;
    lock(true);
    restart.hidden=false;
    restart.textContent="← Выйти";
    pill.textContent="🇬🇧 English";
    sub.textContent="Present Simple · 5 карточек · 🔊 озвучка";
    renderCard();
  }

  function renderCard(){
    if(!active)return;
    if(!queue.length){finish();return}
    const x=queue[0];
    const front=direction==="en-ru"?x.en:x.ru;
    const back=direction==="en-ru"?x.ru:x.en;
    const frontEnglish=direction==="en-ru";
    const backEnglish=direction==="ru-en";
    flipped=false;
    counter.textContent=`Осталось: ${queue.length}`;
    card.innerHTML=`<div class="review-wrap">
      <div class="tiny" style="text-align:center;margin-bottom:10px">${direction==="en-ru"?"🇬🇧 English → русский":"🇷🇺 Русский → English"}</div>
      <div class="flashcard" id="englishFlash">
        <div class="flashcard-inner">
          <div class="flash-face">${englishFace(front,frontEnglish)}</div>
          <div class="flash-face flash-back">${englishFace(back,backEnglish)}</div>
        </div>
      </div>
      <div class="review-stats"><span>✓ ${good}</span><span>✕ ${bad}</span></div>
      <div class="review-actions" id="englishActions" hidden>
        <button class="review-no" id="englishNo">✕</button>
        <button class="review-yes" id="englishYes">✓</button>
      </div>
      <div class="tiny" style="text-align:center">Нажми на карточку, чтобы увидеть перевод</div>
    </div>`;

    const flash=card.querySelector("#englishFlash");
    const actions=card.querySelector("#englishActions");
    flash.onclick=e=>{
      if(e.target.closest(".english-speak-btn"))return;
      if(flipped)return;
      flipped=true;
      flash.classList.add("flipped");
      actions.hidden=false;
    };

    card.querySelectorAll(".english-speak-btn").forEach(btn=>{
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();speak(x.en)};
    });
    card.querySelector("#englishYes").onclick=()=>decide(true);
    card.querySelector("#englishNo").onclick=()=>decide(false);
  }

  function decide(ok){
    if(!queue.length)return;
    const x=queue.shift();
    if(ok){good++;renderCard();return}
    bad++;
    if(queue.length===0){
      const alt=shuffle(WORDS.filter(y=>y.en!==x.en))[0];
      if(alt)queue.push(alt);
    }
    const pos=Math.min(queue.length,Math.max(1,2+Math.floor(Math.random()*2)));
    queue.splice(pos,0,x);
    renderCard();
  }

  function finish(){
    active=false;
    lock(false);
    counter.textContent="";
    pill.textContent="Готово";
    restart.hidden=true;
    sub.textContent="Present Simple · 5 карточек · 🔊 озвучка";
    card.innerHTML=`<div class="done"><div class="big">🇬🇧</div><h2>Готово!</h2>
      <div class="finish-actions">
        <button class="primary" id="englishAgain">Ещё раз карточки</button>
        <button class="secondary" id="englishBack">К уроку</button>
      </div>
    </div>`;
    card.querySelector("#englishAgain").onclick=()=>start(direction);
    card.querySelector("#englishBack").onclick=renderTopic;
  }

  function addSection(){
    const heading=card.querySelector(".library-heading");
    if(!heading||heading.textContent.trim()!=="Предметы")return;
    if(card.querySelector("#englishSubjectSection"))return;

    const section=document.createElement("section");
    section.className="library-section";
    section.id="englishSubjectSection";
    section.innerHTML=`<div class="library-title"><span>🇬🇧</span><strong>English</strong></div>
      <div class="topic-grid">
        <button class="topic-tile" id="englishLesson1">
          <span class="topic-title">Present Simple — слова</span>
          <span class="topic-meta">5 карточек · 🔊 озвучка</span>
        </button>
      </div>`;

    const sections=[...card.querySelectorAll(".library-section")];
    const deutsch=sections.find(s=>s.querySelector(".library-title strong")?.textContent.trim()==="Deutsch");
    if(deutsch)deutsch.before(section);else card.querySelector(".library-heading").parentElement.appendChild(section);
    section.querySelector("#englishLesson1").onclick=renderTopic;
  }

  restart.addEventListener("click",e=>{
    if(!active)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.speechSynthesis?.cancel();
    renderTopic();
  },true);

  if(!document.getElementById("englishLessonStyles")){
    const style=document.createElement("style");
    style.id="englishLessonStyles";
    style.textContent=`
      .english-card-word{font-size:clamp(32px,9vw,52px);font-weight:900;line-height:1.15;text-align:center;overflow-wrap:anywhere}
      .english-speak-btn{border:1px solid #cee0d5;background:#eaf4ee;color:#2f6f58;border-radius:999px;padding:10px 16px;font:inherit;font-weight:850;cursor:pointer}
      .english-speak-btn:active{transform:scale(.98)}
    `;
    document.head.appendChild(style);
  }

  new MutationObserver(addSection).observe(card,{childList:true,subtree:true});
  addSection();
})();