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
  de:{label:"Deutsch",langName:"Deutsch",locale:"de",categories:[
    {id:"verben",label:"Verben",icon:"🔄",topics:[
      {id:"e-i-ie",title:"E → I / IE",subtitle:"Verben mit Vokalwechsel",active:true,poster:null,typingInstruction:"Напиши формы du / er",words:[
        {word:"geben — du gibst · er gibt",base:"geben",ru:"давать",typingPrompt:"geben — давать",typingAnswer:"du gibst er gibt"},
        {word:"nehmen — du nimmst · er nimmt",base:"nehmen",ru:"брать",typingPrompt:"nehmen — брать",typingAnswer:"du nimmst er nimmt"},
        {word:"sprechen — du sprichst · er spricht",base:"sprechen",ru:"говорить",typingPrompt:"sprechen — говорить",typingAnswer:"du sprichst er spricht"},
        {word:"sehen — du siehst · er sieht",base:"sehen",ru:"видеть",typingPrompt:"sehen — видеть",typingAnswer:"du siehst er sieht"},
        {word:"lesen — du liest · er liest",base:"lesen",ru:"читать",typingPrompt:"lesen — читать",typingAnswer:"du liest er liest"},
        {word:"helfen — du hilfst · er hilft",base:"helfen",ru:"помогать",typingPrompt:"helfen — помогать",typingAnswer:"du hilfst er hilft"},
        {word:"essen — du isst · er isst",base:"essen",ru:"есть, кушать",typingPrompt:"essen — есть, кушать",typingAnswer:"du isst er isst"},
        {word:"treffen — du triffst · er trifft",base:"treffen",ru:"встречать",typingPrompt:"treffen — встречать",typingAnswer:"du triffst er trifft"},
        {word:"vergessen — du vergisst · er vergisst",base:"vergessen",ru:"забывать",typingPrompt:"vergessen — забывать",typingAnswer:"du vergisst er vergisst"},
        {word:"empfehlen — du empfiehlst · er empfiehlt",base:"empfehlen",ru:"рекомендовать",typingPrompt:"empfehlen — рекомендовать",typingAnswer:"du empfiehlst er empfiehlt"},
        {word:"sterben — du stirbst · er stirbt",base:"sterben",ru:"умирать",typingPrompt:"sterben — умирать",typingAnswer:"du stirbst er stirbt"},
        {word:"werfen — du wirfst · er wirft",base:"werfen",ru:"бросать",typingPrompt:"werfen — бросать",typingAnswer:"du wirfst er wirft"}
      ]},
      {id:"a-ae-au-aeu",title:"A → Ä / AU → ÄU",subtitle:"Verben mit Vokalwechsel",active:false,poster:null,typingInstruction:"Напиши формы du / er",words:[
        {word:"fahren — du fährst · er fährt",base:"fahren",ru:"ехать",typingPrompt:"fahren — ехать",typingAnswer:"du fährst er fährt"},
        {word:"laufen — du läufst · er läuft",base:"laufen",ru:"бежать",typingPrompt:"laufen — бежать",typingAnswer:"du läufst er läuft"},
        {word:"schlafen — du schläfst · er schläft",base:"schlafen",ru:"спать",typingPrompt:"schlafen — спать",typingAnswer:"du schläfst er schläft"},
        {word:"lassen — du lässt · er lässt",base:"lassen",ru:"оставлять",typingPrompt:"lassen — оставлять",typingAnswer:"du lässt er lässt"},
        {word:"tragen — du trägst · er trägt",base:"tragen",ru:"носить, нести",typingPrompt:"tragen — носить, нести",typingAnswer:"du trägst er trägt"},
        {word:"waschen — du wäschst · er wäscht",base:"waschen",ru:"мыть",typingPrompt:"waschen — мыть",typingAnswer:"du wäschst er wäscht"},
        {word:"fangen — du fängst · er fängt",base:"fangen",ru:"ловить",typingPrompt:"fangen — ловить",typingAnswer:"du fängst er fängt"},
        {word:"halten — du hältst · er hält",base:"halten",ru:"держать, останавливаться",typingPrompt:"halten — держать, останавливаться",typingAnswer:"du hältst er hält"},
        {word:"fallen — du fällst · er fällt",base:"fallen",ru:"падать",typingPrompt:"fallen — падать",typingAnswer:"du fällst er fällt"},
        {word:"einladen — du lädst ein · er lädt ein",base:"einladen",ru:"приглашать",typingPrompt:"einladen — приглашать",typingAnswer:"du lädst ein er lädt ein"},
        {word:"schlagen — du schlägst · er schlägt",base:"schlagen",ru:"бить",typingPrompt:"schlagen — бить",typingAnswer:"du schlägst er schlägt"},
        {word:"wachsen — du wächst · er wächst",base:"wachsen",ru:"расти",typingPrompt:"wachsen — расти",typingAnswer:"du wächst er wächst"}
      ]}
    ]}
  ]}
};

const card=document.getElementById("card"),pill=document.getElementById("pill"),counter=document.getElementById("counter"),progress=document.getElementById("progress"),restart=document.getElementById("restart"),reviewBtn=document.getElementById("reviewBtn"),libraryBtn=document.getElementById("libraryBtn"),sub=document.getElementById("sub"),tabEt=document.getElementById("tabEt"),tabDe=document.getElementById("tabDe");
let lang="et",mode="home",currentTopic=null,currentCategory=null,reviewQueue=[],reviewGood=0,reviewBad=0,reviewFlipped=false,reviewDirection="ru-et",typingQueue=[],typingGood=0,typingBad=0,typingChecked=false,typingWasCorrect=false,posterReturnMode="topic";
try{const savedDirection=localStorage.getItem("sonatreenerReviewDirection");if(savedDirection==="ru-et"||savedDirection==="et-ru")reviewDirection=savedDirection}catch(e){}
const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
const locale=()=>DATA[lang]?.locale||"et";
const norm=s=>String(s).toLocaleLowerCase(locale()).trim().replace(/[.,;:·]+/g," ").replace(/\s+/g," ");

document.addEventListener("copy",e=>e.preventDefault());
document.addEventListener("cut",e=>e.preventDefault());
document.addEventListener("contextmenu",e=>e.preventDefault());
try{localStorage.removeItem("sonatreenerPosterLocksV2");localStorage.removeItem("sonatreenerLessonLockV1")}catch(e){}

function allTopics(l=lang){return (DATA[l].categories||[]).flatMap(c=>c.topics.map(t=>({...t,category:c})))}
function activeTopic(){return allTopics().find(t=>t.active)||allTopics()[0]||null}
function findTopic(id){return allTopics().find(t=>t.id===id)||null}
function setNavLocked(on){tabEt.disabled=on;tabDe.disabled=on;libraryBtn.hidden=on;reviewBtn.hidden=on}
function updateSub(){if(currentTopic)sub.textContent=`${currentTopic.subtitle} · ${currentTopic.words.length} карточек`;else sub.textContent=DATA[lang].langName}
function saveReviewDirection(){try{localStorage.setItem("sonatreenerReviewDirection",reviewDirection)}catch(e){}}
function targetName(){return lang==="de"?"немецкий":"эстонский"}
function targetFlag(){return lang==="de"?"🇩🇪":"🇪🇪"}
function typingExpected(item){return item.typingAnswer||item.word}
function typingPrompt(item){return item.typingPrompt||item.ru}

function setLanguage(next){lang=next;tabEt.classList.toggle("active",lang==="et");tabDe.classList.toggle("active",lang==="de");currentTopic=null;currentCategory=null;renderHome()}

function renderHome(){
  mode="home";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent=DATA[lang].label;currentTopic=null;updateSub();
  if(lang==="de"){renderLibrary();return}
  const topic=activeTopic();if(!topic){renderLibrary();return}openTopic(topic.id);
}

function openTopic(id){
  const topic=findTopic(id);if(!topic)return;
  currentTopic=topic;currentCategory=topic.category;mode="topic";posterReturnMode="topic";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent=topic.category.label;updateSub();
  const poster=topic.poster
    ?`<button class="poster-preview" id="posterOpen" aria-label="Открыть плакат"><img src="${topic.poster}" alt="${esc(topic.title)} — учебный плакат"></button>`
    :`<div class="topic-no-poster">${topic.category.icon}</div>`;
  const typingLabel=lang==="de"?"✍️ Написать формы du / er":`✍️ Написать по-${targetName()}`;
  card.innerHTML=`<div class="topic-intro"><div class="topic-kicker">${topic.category.icon} ${esc(topic.category.label)}</div><h2>${esc(topic.title)}</h2>${poster}<div class="topic-actions">${topic.poster?'<button class="secondary" id="posterBtn">🖼 Смотреть плакат</button>':''}<button class="primary" id="cardsRuEt">🇷🇺 → ${targetFlag()} Русский → ${targetName()}</button><button class="secondary" id="cardsEtRu">${targetFlag()} → 🇷🇺 ${targetName()[0].toUpperCase()+targetName().slice(1)} → русский</button><button class="secondary" id="typingBtn">${typingLabel}</button></div></div>`;
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
  mode="library";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent=lang==="de"?"🇩🇪 Deutsch":"📚 Teemad";currentTopic=null;updateSub();
  const categories=DATA[lang].categories||[];
  if(!categories.length){card.innerHTML=`<div class="empty"><div class="big">${targetFlag()}</div><h2>${esc(DATA[lang].label)}</h2><p>Пока нет уроков.</p></div>`;return}
  const html=categories.map(c=>`<section class="library-section"><div class="library-title"><span>${c.icon}</span><strong>${esc(c.label)}</strong></div>${c.topics.length?`<div class="topic-grid">${c.topics.map(t=>`<button class="topic-tile" data-topic="${t.id}"><span class="topic-title">${esc(t.title)}</span><span class="topic-meta">${t.words.length} карточек${t.poster?' · 🖼':''}</span></button>`).join("")}</div>`:`<div class="library-empty">Пока нет уроков</div>`}</section>`).join("");
  card.innerHTML=`<div><div class="library-heading">${lang==="de"?"Deutsch":"Все уроки"}</div><p class="chest-note">${lang==="de"?"Немецкие темы и карточки для повторения.":"Здесь постепенно будет собираться его личная библиотека тем, понятий и карточек."}</p>${html}</div>`;
  card.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>openTopic(b.dataset.topic));
}

function startReview(topic,direction=reviewDirection){
  currentTopic=topic;currentCategory=topic.category;reviewDirection=direction;saveReviewDirection();mode="review";posterReturnMode="review";setNavLocked(true);progress.hidden=true;restart.hidden=false;restart.textContent="← Выйти";pill.textContent="🃏 Карточки";reviewQueue=shuffle(topic.words);reviewGood=0;reviewBad=0;reviewFlipped=false;renderReview();
}

function resumeReview(){
  if(!currentTopic)return;
  mode="review";posterReturnMode="review";setNavLocked(true);progress.hidden=true;restart.hidden=false;restart.textContent="← Выйти";pill.textContent="🃏 Карточки";renderReview();
}

function switchReviewDirection(){reviewDirection=reviewDirection==="ru-et"?"et-ru":"ru-et";saveReviewDirection();renderReview()}

function renderReview(){
  if(!reviewQueue.length){finishReview();return}
  const item=reviewQueue[0];reviewFlipped=false;counter.textContent=`Осталось: ${reviewQueue.length}`;updateSub();
  const front=reviewDirection==="ru-et"?item.ru:item.word;
  const back=reviewDirection==="ru-et"?item.word:item.ru;
  const directionLabel=reviewDirection==="ru-et"?`🇷🇺 → ${targetFlag()} Русский → ${targetName()}`:`${targetFlag()} → 🇷🇺 ${targetName()[0].toUpperCase()+targetName().slice(1)} → русский`;
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
  reviewQueue.splice(pos,0,item);renderReview();
}

function finishReview(){
  setNavLocked(false);counter.textContent="";pill.textContent="Готово";restart.hidden=true;
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
  const loc=locale(),a=[...typed],b=[...expected],n=a.length,m=b.length;
  const d=Array.from({length:n+1},()=>Array(m+1).fill(0));
  for(let i=0;i<=n;i++)d[i][0]=i;
  for(let j=0;j<=m;j++)d[0][j]=j;
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){
    const same=a[i-1].toLocaleLowerCase(loc)===b[j-1].toLocaleLowerCase(loc);
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(same?0:1));
  }
  let i=n,j=m,out=[];
  while(i>0||j>0){
    if(i>0&&j>0&&a[i-1].toLocaleLowerCase(loc)===b[j-1].toLocaleLowerCase(loc)&&d[i][j]===d[i-1][j-1]){out.push(esc(a[i-1]));i--;j--;continue}
    if(i>0&&j>0&&d[i][j]===d[i-1][j-1]+1){out.push(`<span class="type-bad">${esc(a[i-1])}</span>`);i--;j--;continue}
    if(i>0&&d[i][j]===d[i-1][j]+1){out.push(`<span class="type-bad">${esc(a[i-1])}</span>`);i--;continue}
    if(j>0){out.push('<span class="type-bad type-missing">□</span>');j--;continue}
  }
  return out.reverse().join("");
}

function renderTyping(){
  if(!typingQueue.length){finishTyping();return}
  const item=typingQueue[0];typingChecked=false;typingWasCorrect=false;counter.textContent=`Осталось: ${typingQueue.length}`;updateSub();
  const expected=typingExpected(item),instruction=currentTopic.typingInstruction||(lang==="de"?"Напиши формы du / er":"Напиши по-эстонски");
  const posterButton=currentTopic&&currentTopic.poster?'<button class="secondary" id="typingPoster" style="width:100%">🖼 Посмотреть плакат</button>':'';
  card.innerHTML=`<div class="typing-wrap">${posterButton}<div class="typing-kicker">${esc(instruction)}</div><div class="typing-prompt">${esc(typingPrompt(item))}</div>${lang==="de"?'<div class="tiny" style="text-align:center">Например: du gibst · er gibt</div>':''}<div class="input-row"><input id="typeInput" class="typing-input" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Ответ"><button class="primary" id="typeCheck">Проверить</button></div><div class="review-stats"><span>✓ ${typingGood}</span><span>✕ ${typingBad}</span></div><div id="typeFeedback"></div></div>`;
  if(currentTopic&&currentTopic.poster)card.querySelector("#typingPoster").onclick=()=>showPoster(currentTopic,"typing");
  const input=card.querySelector("#typeInput"),check=card.querySelector("#typeCheck");
  input.addEventListener("paste",e=>e.preventDefault());
  input.addEventListener("drop",e=>e.preventDefault());
  input.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="v")e.preventDefault();if(e.key==="Insert"&&e.shiftKey)e.preventDefault();if(e.key==="Enter")checkTyping()});
  check.onclick=checkTyping;setTimeout(()=>input.focus(),0);
}

function checkTyping(){
  if(typingChecked||!typingQueue.length)return;
  const input=card.querySelector("#typeInput"),check=card.querySelector("#typeCheck"),feedback=card.querySelector("#typeFeedback"),item=typingQueue[0];
  if(!input||!feedback)return;
  const typed=input.value.trim(),expected=typingExpected(item);
  if(!typed){input.focus();return}
  typingChecked=true;typingWasCorrect=norm(typed)===norm(expected);input.disabled=true;check.hidden=true;
  if(typingWasCorrect){
    typingGood++;input.classList.add("typing-correct");
    feedback.innerHTML=`<div class="typing-feedback ok">✓ Правильно: <strong>${esc(expected)}</strong></div><button class="primary typing-next" id="typingNext">Дальше</button>`;
  }else{
    typingBad++;input.classList.add("typing-wrong");
    feedback.innerHTML=`<div class="typing-feedback bad"><div class="typed-label">Ты написал:</div><div class="typed-line">${highlightMistakes(typed,expected)}</div><div class="typed-label">Правильно:</div><div class="correct-answer">${esc(expected)}</div></div><button class="primary typing-next" id="typingNext">Дальше</button>`;
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
  setNavLocked(false);counter.textContent="";pill.textContent="Готово";restart.hidden=true;
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