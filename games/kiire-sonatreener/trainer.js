(()=>{
const DATA={
  et:{label:"Eesti",langName:"eesti keel",locale:"et",categories:[
    {id:"loodus",label:"Loodus",icon:"🌿",topics:[
      {id:"vesi-ja-jogi",title:"Vesi ja jõgi",subtitle:"Loodusõpetus",active:true,poster:"./poster-vesi-ja-jogi.svg?v=20260909-simple",words:[
        {word:"veekogu",ru:"водоём"},
        {word:"uurimisobjekt",ru:"объект исследования"},
        {word:"mõiste",ru:"понятие"},
        {word:"magevesi",ru:"пресная вода"},
        {word:"jõgi",ru:"река"},
        {word:"jõesäng",ru:"русло реки"},
        {word:"jõelähe",ru:"исток реки"},
        {word:"jõesuue",ru:"устье реки"},
        {word:"lisajõgi",ru:"приток"}
      ]}
    ]},
    {id:"inimene",label:"Inimene",icon:"👤",topics:[]},
    {id:"eesti-keel",label:"Eesti keel",icon:"💬",topics:[
      {id:"sonad-1",title:"Sõnad 1",subtitle:"Kordamine",active:false,poster:null,words:[
        {word:"tee kokkuvõte",ru:"подведи итог"},
        {word:"lugeja",ru:"читатель"},
        {word:"minu meelest",ru:"по-моему"},
        {word:"mõnus",ru:"приятный"},
        {word:"toovad vanemad",ru:"родители приносят"},
        {word:"soovitama",ru:"рекомендовать"},
        {word:"meelt lahutama",ru:"развлекаться"},
        {word:"paremini aru saama",ru:"лучше понимать"},
        {word:"enamasti",ru:"в основном"},
        {word:"valima",ru:"выбирать"}
      ]}
    ]}
  ]},
  de:{label:"Deutsch",langName:"saksa keel",locale:"de",categories:[]}
};

const card=document.getElementById("card"),pill=document.getElementById("pill"),counter=document.getElementById("counter"),progress=document.getElementById("progress"),restart=document.getElementById("restart"),reviewBtn=document.getElementById("reviewBtn"),libraryBtn=document.getElementById("libraryBtn"),sub=document.getElementById("sub"),tabEt=document.getElementById("tabEt"),tabDe=document.getElementById("tabDe");
let lang="et",mode="home",currentTopic=null,currentCategory=null,reviewQueue=[],reviewGood=0,reviewBad=0,reviewFlipped=false,reviewDirection="ru-et",posterReturnMode="topic";
try{const savedDirection=localStorage.getItem("sonatreenerReviewDirection");if(savedDirection==="ru-et"||savedDirection==="et-ru")reviewDirection=savedDirection}catch(e){}
const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);

document.addEventListener("copy",e=>e.preventDefault());
document.addEventListener("cut",e=>e.preventDefault());
document.addEventListener("contextmenu",e=>e.preventDefault());
try{localStorage.removeItem("sonatreenerPosterLocksV2");localStorage.removeItem("sonatreenerLessonLockV1")}catch(e){}

function allTopics(l=lang){return (DATA[l].categories||[]).flatMap(c=>c.topics.map(t=>({...t,category:c})))}
function activeTopic(){return allTopics().find(t=>t.active)||allTopics()[0]||null}
function findTopic(id){return allTopics().find(t=>t.id===id)||null}
function setNavLocked(on){tabEt.disabled=on;tabDe.disabled=on;libraryBtn.hidden=on;reviewBtn.hidden=on}
function updateSub(){if(currentTopic)sub.textContent=`${currentTopic.subtitle} · ${currentTopic.words.length} слов`;else sub.textContent=DATA[lang].langName}
function saveReviewDirection(){try{localStorage.setItem("sonatreenerReviewDirection",reviewDirection)}catch(e){}}

function setLanguage(next){lang=next;tabEt.classList.toggle("active",lang==="et");tabDe.classList.toggle("active",lang==="de");currentTopic=null;currentCategory=null;renderHome()}

function renderHome(){mode="home";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent=DATA[lang].label;currentTopic=null;updateSub();if(lang==="de"){card.innerHTML=`<div class="empty"><div class="big">🇩🇪</div><h2>Deutsch</h2><p>Немецкая вкладка готова. Сюда будем добавлять отдельные наборы карточек.</p></div>`;return}const topic=activeTopic();if(!topic){renderLibrary();return}openTopic(topic.id)}

function openTopic(id){
  const topic=findTopic(id);if(!topic)return;
  currentTopic=topic;currentCategory=topic.category;mode="topic";posterReturnMode="topic";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent=topic.category.label;updateSub();
  const poster=topic.poster
    ?`<button class="poster-preview" id="posterOpen" aria-label="Открыть плакат"><img src="${topic.poster}" alt="${esc(topic.title)} — учебный плакат"></button>`
    :`<div class="topic-no-poster">🃏</div>`;
  card.innerHTML=`<div class="topic-intro"><div class="topic-kicker">${topic.category.icon} ${esc(topic.category.label)}</div><h2>${esc(topic.title)}</h2>${poster}<div class="topic-actions">${topic.poster?'<button class="secondary" id="posterBtn">🖼 Смотреть плакат</button>':''}<button class="primary" id="cardsRuEt">🇷🇺 → 🇪🇪 Русский → эстонский</button><button class="secondary" id="cardsEtRu">🇪🇪 → 🇷🇺 Эстонский → русский</button></div></div>`;
  if(topic.poster){card.querySelector("#posterOpen").onclick=()=>showPoster(topic,"topic");card.querySelector("#posterBtn").onclick=()=>showPoster(topic,"topic")}
  card.querySelector("#cardsRuEt").onclick=()=>startReview(topic,"ru-et");
  card.querySelector("#cardsEtRu").onclick=()=>startReview(topic,"et-ru");
}

function showPoster(topic,returnMode="topic"){
  if(!topic.poster)return;
  posterReturnMode=returnMode;mode="poster";progress.hidden=true;restart.hidden=false;restart.textContent=returnMode==="review"?"← К карточкам":"← К уроку";pill.textContent="🖼 Плакат";counter.textContent="";
  const action=returnMode==="review"
    ?'<button class="primary" id="posterBack">← К карточкам</button>'
    :'<button class="primary" id="posterCards">🃏 Учить карточками</button>';
  card.innerHTML=`<div class="poster-view"><img src="${topic.poster}" alt="${esc(topic.title)} — учебный плакат">${action}</div>`;
  if(returnMode==="review")card.querySelector("#posterBack").onclick=resumeReview;
  else card.querySelector("#posterCards").onclick=()=>startReview(topic,reviewDirection);
}

function renderLibrary(){
  mode="library";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent="📚 Teemad";currentTopic=null;updateSub();
  if(lang==="de"){renderHome();return}
  const html=DATA.et.categories.map(c=>`<section class="library-section"><div class="library-title"><span>${c.icon}</span><strong>${esc(c.label)}</strong></div>${c.topics.length?`<div class="topic-grid">${c.topics.map(t=>`<button class="topic-tile" data-topic="${t.id}"><span class="topic-title">${esc(t.title)}</span><span class="topic-meta">${t.words.length} слов${t.poster?' · 🖼':''}</span></button>`).join("")}</div>`:`<div class="library-empty">Пока нет уроков</div>`}</section>`).join("");
  card.innerHTML=`<div><div class="library-heading">Все уроки</div><p class="chest-note">Здесь постепенно будет собираться его личная библиотека тем, понятий и карточек.</p>${html}</div>`;
  card.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>openTopic(b.dataset.topic));
}

function startReview(topic,direction=reviewDirection){
  currentTopic=topic;currentCategory=topic.category;reviewDirection=direction;saveReviewDirection();mode="review";posterReturnMode="review";setNavLocked(true);progress.hidden=true;restart.hidden=false;restart.textContent="← Выйти";pill.textContent="🃏 Карточки";reviewQueue=shuffle(topic.words);reviewGood=0;reviewBad=0;reviewFlipped=false;renderReview();
}

function resumeReview(){
  if(!currentTopic)return;
  mode="review";posterReturnMode="review";setNavLocked(true);progress.hidden=true;restart.hidden=false;restart.textContent="← Выйти";pill.textContent="🃏 Карточки";renderReview();
}

function switchReviewDirection(){
  reviewDirection=reviewDirection==="ru-et"?"et-ru":"ru-et";saveReviewDirection();renderReview();
}

function renderReview(){
  if(!reviewQueue.length){finishReview();return}
  const item=reviewQueue[0];reviewFlipped=false;counter.textContent=`Осталось: ${reviewQueue.length}`;updateSub();
  const front=reviewDirection==="ru-et"?item.ru:item.word;
  const back=reviewDirection==="ru-et"?item.word:item.ru;
  const directionLabel=reviewDirection==="ru-et"?"🇷🇺 → 🇪🇪 Русский → эстонский":"🇪🇪 → 🇷🇺 Эстонский → русский";
  const posterButton=currentTopic&&currentTopic.poster?'<button class="secondary" id="reviewPoster" style="width:100%">🖼 Посмотреть плакат</button>':'';
  card.innerHTML=`<div class="review-wrap"><button class="secondary" id="directionBtn" style="width:100%">↔ ${directionLabel}</button>${posterButton}<div class="flashcard" id="flash"><div class="flashcard-inner"><div class="flash-face">${esc(front)}</div><div class="flash-face flash-back">${esc(back)}</div></div></div><div class="review-stats"><span>✓ ${reviewGood}</span><span>✕ ${reviewBad}</span></div><div class="review-actions" id="reviewActions" hidden><button class="review-no" id="reviewNo">✕</button><button class="review-yes" id="reviewYes">✓</button></div><div class="tiny" style="text-align:center">Нажми на карточку, чтобы перевернуть</div></div>`;
  card.querySelector("#directionBtn").onclick=switchReviewDirection;
  if(currentTopic&&currentTopic.poster)card.querySelector("#reviewPoster").onclick=()=>showPoster(currentTopic,"review");
  const flash=card.querySelector("#flash"),actions=card.querySelector("#reviewActions");
  flash.onclick=()=>{if(reviewFlipped)return;reviewFlipped=true;flash.classList.add("flipped");actions.hidden=false};
  card.querySelector("#reviewYes").onclick=()=>decideReview(true);
  card.querySelector("#reviewNo").onclick=()=>decideReview(false);
  let startX=null,startY=null;
  flash.addEventListener("touchstart",e=>{const t=e.changedTouches[0];startX=t.clientX;startY=t.clientY},{passive:true});
  flash.addEventListener("touchend",e=>{if(!reviewFlipped||startX===null)return;const t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;startX=startY=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.2)decideReview(dx>0)},{passive:true});
}

function decideReview(ok){
  if(!reviewQueue.length)return;
  const item=reviewQueue.shift();
  if(ok){reviewGood++;renderReview();return}
  reviewBad++;
  if(reviewQueue.length===0){const alt=shuffle(currentTopic.words.filter(w=>w.word!==item.word))[0];if(alt)reviewQueue.push(alt)}
  const pos=Math.min(reviewQueue.length,Math.max(1,2+Math.floor(Math.random()*2)));
  reviewQueue.splice(pos,0,item);
  renderReview();
}

function finishReview(){
  setNavLocked(false);counter.textContent="";pill.textContent="Valmis";restart.hidden=true;
  card.innerHTML=`<div class="done"><div class="big">🃏</div><h2>Готово!</h2><div class="finish-actions">${currentTopic&&currentTopic.poster?'<button class="secondary" id="seePoster">🖼 Посмотреть плакат</button>':''}<button class="primary" id="again">Ещё раз карточки</button><button class="secondary" id="backTopic">К уроку</button></div></div>`;
  if(currentTopic&&currentTopic.poster)card.querySelector("#seePoster").onclick=()=>showPoster(currentTopic,"topic");
  card.querySelector("#again").onclick=()=>startReview(currentTopic,reviewDirection);
  card.querySelector("#backTopic").onclick=()=>openTopic(currentTopic.id);
}

reviewBtn.onclick=()=>{const t=currentTopic||activeTopic();if(t)startReview(t,reviewDirection)};
libraryBtn.onclick=renderLibrary;
tabEt.onclick=()=>setLanguage("et");
tabDe.onclick=()=>setLanguage("de");
restart.onclick=()=>{
  if(mode==="poster"&&currentTopic){posterReturnMode==="review"?resumeReview():openTopic(currentTopic.id);return}
  if(mode==="review"&&currentTopic)openTopic(currentTopic.id);
};

progress.hidden=true;
setLanguage("et");
})();
