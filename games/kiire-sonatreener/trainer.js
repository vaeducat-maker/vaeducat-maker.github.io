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
let lang="et",mode="home",currentTopic=null,currentCategory=null,reviewQueue=[],reviewGood=0,reviewBad=0,reviewFlipped=false,reviewDirection="ru-et",typingQueue=[],typingGood=0,typingBad=0,typingChecked=false,typingWasCorrect=false,posterReturnMode="topic";
try{const savedDirection=localStorage.getItem("sonatreenerReviewDirection");if(savedDirection==="ru-et"||savedDirection==="et-ru")reviewDirection=savedDirection}catch(e){}
const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
const norm=s=>String(s).toLocaleLowerCase("et").trim().replace(/\s+/g," ");

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
  card.innerHTML=`<div class="topic-intro"><div class="topic-kicker">${topic.category.icon} ${esc(topic.category.label)}</div><h2>${esc(topic.title)}</h2>${poster}<div class="topic-actions">${topic.poster?'<button class="secondary" id="posterBtn">🖼 Смотреть плакат</button>':''}<button class="primary" id="cardsRuEt">🇷🇺 → 🇪🇪 Русский → эстонский</button><button class="secondary" id="cardsEtRu">🇪🇪 → 🇷🇺 Эстонский → русский</button><button class="secondary" id="typingBtn">✍️ Написать по-эстонски</button></div></div>`;
  if(topic.poster){card.querySelector("#posterOpen").onclick=()=>showPoster(topic,"topic");card.querySelector("#posterBtn").onclick=()=>showPoster(topic,"topic")}
  card.querySelector("#cardsRuEt").onclick=()=>startReview(topic,"ru-et");
  card.querySelector("#cardsEtRu").onclick=()=>startReview(topic,"et-ru");
  card.querySelector("#typingBtn").onclick=()=>startTyping(topic);
}

function showPoster(topic,returnMode="topic"){
  if(!topic.poster)return;
  posterReturnMode=returnMode;mode="poster";progress.hidden=true;restart.hidden=false;restart.textContent=returnMode==="review"?"← К карточкам":returnMode==="typing"?"← К письму":"← К уроку";pill.textContent="🖼 Плакат";counter.textContent="";
  const action=returnMode==="review"
    ?'<button class="primary" id="posterBack">← К карточкам</button>'
    :returnMode==="typing"
      ?'<button class="primary" id="posterBackTyping">← К письму</button>'
      :'<button class="primary" id="posterCards">🃏 Учить карточками</button>';
  card.innerHTML=`<div class="poster-view"><img src="${topic.poster}" alt="${esc(topic.title)} — учебный плакат">${action}</div>`;
  if(returnMode==="review")card.querySelector("#posterBack").onclick=resumeReview;
  else if(returnMode==="typing")card.querySelector("#posterBackTyping").onclick=resumeTyping;
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

function startTyping(topic){
  currentTopic=topic;currentCategory=topic.category;mode="typing";posterReturnMode="typing";setNavLocked(true);progress.hidden=true;restart.hidden=false;restart.textContent="← Выйти";pill.textContent="✍️ Письмо";typingQueue=shuffle(topic.words);typingGood=0;typingBad=0;typingChecked=false;typingWasCorrect=false;renderTyping();
}

function resumeTyping(){
  if(!currentTopic)return;
  mode="typing";posterReturnMode="typing";setNavLocked(true);progress.hidden=true;restart.hidden=false;restart.textContent="← Выйти";pill.textContent="✍️ Письмо";renderTyping();
}

function highlightMistakes(typed,expected){
  const a=[...typed],b=[...expected],n=a.length,m=b.length;
  const d=Array.from({length:n+1},()=>Array(m+1).fill(0));
  for(let i=0;i<=n;i++)d[i][0]=i;
  for(let j=0;j<=m;j++)d[0][j]=j;
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){
    const same=a[i-1].toLocaleLowerCase("et")===b[j-1].toLocaleLowerCase("et");
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(same?0:1));
  }
  let i=n,j=m,out=[];
  while(i>0||j>0){
    if(i>0&&j>0&&a[i-1].toLocaleLowerCase("et")===b[j-1].toLocaleLowerCase("et")&&d[i][j]===d[i-1][j-1]){out.push(esc(a[i-1]));i--;j--;continue}
    if(i>0&&j>0&&d[i][j]===d[i-1][j-1]+1){out.push(`<span class="type-bad">${esc(a[i-1])}</span>`);i--;j--;continue}
    if(i>0&&d[i][j]===d[i-1][j]+1){out.push(`<span class="type-bad">${esc(a[i-1])}</span>`);i--;continue}
    if(j>0){out.push('<span class="type-bad type-missing">□</span>');j--;continue}
  }
  return out.reverse().join("");
}

function renderTyping(){
  if(!typingQueue.length){finishTyping();return}
  const item=typingQueue[0];typingChecked=false;typingWasCorrect=false;counter.textContent=`Осталось: ${typingQueue.length}`;updateSub();
  const posterButton=currentTopic&&currentTopic.poster?'<button class="secondary" id="typingPoster" style="width:100%">🖼 Посмотреть плакат</button>':'';
  card.innerHTML=`<div class="typing-wrap">${posterButton}<div class="typing-kicker">Напиши по-эстонски</div><div class="typing-prompt">${esc(item.ru)}</div><div class="input-row"><input id="typeInput" class="typing-input" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Ответ по-эстонски"><button class="primary" id="typeCheck">Проверить</button></div><div class="review-stats"><span>✓ ${typingGood}</span><span>✕ ${typingBad}</span></div><div id="typeFeedback"></div></div>`;
  if(currentTopic&&currentTopic.poster)card.querySelector("#typingPoster").onclick=()=>showPoster(currentTopic,"typing");
  const input=card.querySelector("#typeInput"),check=card.querySelector("#typeCheck");
  input.addEventListener("paste",e=>e.preventDefault());
  input.addEventListener("drop",e=>e.preventDefault());
  input.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="v")e.preventDefault();if(e.key==="Insert"&&e.shiftKey)e.preventDefault();if(e.key==="Enter")checkTyping()});
  check.onclick=checkTyping;
  setTimeout(()=>input.focus(),0);
}

function checkTyping(){
  if(typingChecked||!typingQueue.length)return;
  const input=card.querySelector("#typeInput"),check=card.querySelector("#typeCheck"),feedback=card.querySelector("#typeFeedback"),item=typingQueue[0];
  if(!input||!feedback)return;
  const typed=input.value.trim();
  if(!typed){input.focus();return}
  typingChecked=true;typingWasCorrect=norm(typed)===norm(item.word);input.disabled=true;check.hidden=true;
  if(typingWasCorrect){
    typingGood++;
    input.classList.add("typing-correct");
    feedback.innerHTML=`<div class="typing-feedback ok">✓ Правильно: <strong>${esc(item.word)}</strong></div><button class="primary typing-next" id="typingNext">Дальше</button>`;
  }else{
    typingBad++;
    input.classList.add("typing-wrong");
    feedback.innerHTML=`<div class="typing-feedback bad"><div class="typed-label">Ты написал:</div><div class="typed-line">${highlightMistakes(typed,item.word)}</div><div class="typed-label">Правильно:</div><div class="correct-answer">${esc(item.word)}</div></div><button class="primary typing-next" id="typingNext">Дальше</button>`;
  }
  card.querySelector("#typingNext").onclick=advanceTyping;
}

function advanceTyping(){
  if(!typingChecked||!typingQueue.length)return;
  const item=typingQueue.shift();
  if(!typingWasCorrect){
    if(typingQueue.length===0){const alt=shuffle(currentTopic.words.filter(w=>w.word!==item.word))[0];if(alt)typingQueue.push(alt)}
    const pos=Math.min(typingQueue.length,Math.max(1,2+Math.floor(Math.random()*2)));
    typingQueue.splice(pos,0,item);
  }
  renderTyping();
}

function finishTyping(){
  setNavLocked(false);counter.textContent="";pill.textContent="Valmis";restart.hidden=true;
  card.innerHTML=`<div class="done"><div class="big">✍️</div><h2>Готово!</h2><div class="finish-actions">${currentTopic&&currentTopic.poster?'<button class="secondary" id="typingSeePoster">🖼 Посмотреть плакат</button>':''}<button class="primary" id="typingAgain">Ещё раз написать</button><button class="secondary" id="typingBackTopic">К уроку</button></div></div>`;
  if(currentTopic&&currentTopic.poster)card.querySelector("#typingSeePoster").onclick=()=>showPoster(currentTopic,"topic");
  card.querySelector("#typingAgain").onclick=()=>startTyping(currentTopic);
  card.querySelector("#typingBackTopic").onclick=()=>openTopic(currentTopic.id);
}

reviewBtn.onclick=()=>{const t=currentTopic||activeTopic();if(t)startReview(t,reviewDirection)};
libraryBtn.onclick=renderLibrary;
tabEt.onclick=()=>setLanguage("et");
tabDe.onclick=()=>setLanguage("de");
restart.onclick=()=>{
  if(mode==="poster"&&currentTopic){posterReturnMode==="review"?resumeReview():posterReturnMode==="typing"?resumeTyping():openTopic(currentTopic.id);return}
  if((mode==="review"||mode==="typing")&&currentTopic)openTopic(currentTopic.id);
};

progress.hidden=true;
setLanguage("et");
})();