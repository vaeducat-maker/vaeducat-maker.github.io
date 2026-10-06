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
        {word:"lisajõgi",ru:"приток"},
        {word:"imavus",ru:"впитываемость"},
        {word:"värvitu",ru:"бесцветный"},
        {word:"lõhnatu",ru:"без запаха"},
        {word:"läbipaistev",ru:"прозрачный"},
        {word:"voolavus",ru:"текучесть"},
        {word:"maitsetu",ru:"без вкуса"},
        {word:"suubuma",ru:"впадать"}
      ]}
    ]},
    {id:"inimene",label:"Inimene",icon:"👤",topics:[]},
    {id:"eesti-keel",label:"Eesti keel",icon:"📝",showWordList:true,topics:[
      {id:"eesti-keel-1",title:"Sõnad 1",subtitle:"Eesti keel",active:false,poster:null,words:[
        {word:"uudised",ru:"новости"},
        {word:"põnev",ru:"интересный, увлекательный"},
        {word:"kõigepealt",ru:"сначала, прежде всего"},
        {word:"valima",ru:"выбирать, избирать"},
        {word:"klassivanem",ru:"староста класса"},
        {word:"jagama",ru:"делиться, распределять"},
        {word:"tähtis",ru:"важный"},
        {word:"juba",ru:"уже"},
        {word:"valimised",ru:"выборы"},
        {word:"tõesti",ru:"действительно, правда"},
        {word:"nüüd",ru:"сейчас, теперь"},
        {word:"kujutama ette",ru:"представлять себе"},
        {word:"raadiosaated",ru:"радиопередачи"},
        {word:"ees",ru:"впереди, перед"},
        {word:"kaasa lööma",ru:"принимать участие"}
      ]},
      {id:"eesti-keel-2",title:"Sõnad 2",subtitle:"Eesti keel",active:false,poster:null,words:[
        {word:"otsustama",ru:"решать"},
        {word:"täis",ru:"полный"},
        {word:"üllatus",ru:"сюрприз"},
        {word:"lootma",ru:"надеяться"},
        {word:"tema arvates",ru:"по его мнению"},
        {word:"võib-olla",ru:"возможно"},
        {word:"kõige rohkem",ru:"больше всего"},
        {word:"vahepeal",ru:"иногда"},
        {word:"imestama",ru:"удивляться"},
        {word:"keset päeva",ru:"посреди дня"},
        {word:"mõlemad",ru:"оба"},
        {word:"lärmakas",ru:"шумный"},
        {word:"ei ole harjunud",ru:"не привык"},
        {word:"meie ümber",ru:"вокруг нас"},
        {word:"ma loodan",ru:"я надеюсь"},
        {word:"emal on õigus",ru:"мама права"},
        {word:"haigutama",ru:"зевать"},
        {word:"kontrast",ru:"контраст"},
        {word:"kummaline",ru:"странный"},
        {word:"rütm",ru:"ритм"},
        {word:"sipelgapesa",ru:"муравейник"}
      ]},
      {id:"eesti-keel-3",title:"Sõnad 3 — koolivorm",subtitle:"Eesti keel",active:false,poster:null,words:[
        {word:"eelistama",ru:"предпочитать"},
        {word:"koolivorm",ru:"школьная форма"},
        {word:"kandma",ru:"носить"},
        {word:"riideese",ru:"предмет одежды"},
        {word:"särk",ru:"рубашка"},
        {word:"seelik",ru:"юбка"},
        {word:"vest",ru:"жилет"},
        {word:"lips",ru:"галстук"},
        {word:"püksid",ru:"брюки"},
        {word:"disainima",ru:"проектировать"},
        {word:"nõu küsima",ru:"спрашивать совета"},
        {word:"solvuma",ru:"обижаться"},
        {word:"vastutus",ru:"ответственность"},
        {word:"tulemus",ru:"результат"},
        {word:"põnev",ru:"интересный"},
        {word:"isegi",ru:"даже"},
        {word:"kindlasti",ru:"обязательно"},
        {word:"hääletus",ru:"голосование"},
        {word:"hääl",ru:"голос"},
        {word:"eriline päev",ru:"особенный день"},
        {word:"lisaks sellele",ru:"кроме того"},
        {word:"meie arvamus",ru:"наше мнение"},
        {word:"vähemalt",ru:"по крайней мере"},
        {word:"ilmus pilt",ru:"появилась картинка"}
      ]},
      {id:"eesti-keel-raadio-kolar",title:"Raadio kõlar",subtitle:"Eesti keel",active:false,poster:null,words:[
        {word:"eeter",ru:"эфир"},
        {word:"ehmatama",ru:"испугаться"},
        {word:"kiljatama",ru:"вскрикнуть"},
        {word:"kosmos",ru:"космос"},
        {word:"sahisema",ru:"шуршать, шелестеть"},
        {word:"võpatama",ru:"вздрогнуть"}
      ]}
    ]},
    {id:"eesti-kirjandus",label:"Eesti kirjandus",icon:"📖",showWordList:true,topics:[
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
      ]},
      {id:"muinasjutud",title:"Урок 3 — Сказки",subtitle:"Eesti kirjandus",active:false,poster:null,words:[
        {word:"loomamuinasjutud",ru:"сказки о животных"},
        {word:"imemuinasjutud",ru:"волшебные сказки"},
        {word:"tõsielulised muinasjutud",ru:"сказки о реальной жизни"},
        {word:"kunstmuinasjutud",ru:"литературные сказки"}
      ]},
      {id:"rebane-saba",title:"Урок 4 — Kuidas rebane oma saba karistas · 03.10.26",subtitle:"Eesti kirjandus",active:false,poster:null,words:[
        {word:"karistama",ru:"наказывать"},
        {word:"kütt",ru:"охотник"},
        {word:"küti koer",ru:"охотничья собака"},
        {word:"põgenema",ru:"убегать, спасаться бегством"},
        {word:"koobas",ru:"нора, пещера"},
        {word:"sihtima",ru:"целиться; высматривать"},
        {word:"haisu vedama",ru:"принюхиваться, чуять запах"},
        {word:"eest tõmbama",ru:"тянуть вперёд"},
        {word:"tagumised jalad",ru:"задние лапы"},
        {word:"esimesed jalad",ru:"передние лапы"},
        {word:"pikale venitama",ru:"вытягивать в длину"},
        {word:"august välja pistma",ru:"высовывать из норы"},
        {word:"rebast taga ajama",ru:"гнаться за лисой"},
        {word:"aru pärima",ru:"расспрашивать, допытываться, требовать объяснений"},
        {word:"takka hoogu andma",ru:"подталкивать сзади, придавать ускорение"},
        {word:"vints ja võnts",ru:"туда-сюда, из стороны в сторону"},
        {word:"mehemoodi sasida saama",ru:"получить хорошую взбучку, быть крепко потрёпанным"}
      ]}
    ]}
  ]},
  de:{label:"Deutsch",langName:"Deutsch",locale:"de",categories:[
    {id:"texte",label:"Texte",icon:"📘",topics:[
      {id:"lektion-1",title:"Lektion 1",subtitle:"Deutsch",active:false,poster:null,textLesson:true,pairs:[
        {ru:"Её зовут Лина.",de:"Sie heißt Lina."},
        {ru:"Ей 16 лет.",de:"Sie ist 16 Jahre alt."},
        {ru:"Она из Германии.",de:"Sie kommt aus Deutschland."},
        {ru:"Она живёт в Берлине.",de:"Sie wohnt in Berlin."},
        {ru:"Она говорит по-немецки и немного по-французски.",de:"Sie spricht Deutsch und ein bisschen Französisch."},
        {ru:"Она живёт со своими родителями и сестрой.",de:"Sie wohnt mit ihren Eltern und ihrer Schwester."},
        {ru:"Её мама — домохозяйка.",de:"Ihre Mutter ist Hausfrau."},
        {ru:"Лина охотно слушает музыку и читает книги.",de:"Lina hört gern Musik und liest Bücher."},
        {ru:"Лина занимается спортом.",de:"Lina macht Sport."},
        {ru:"Лина интересуется искусством и модой.",de:"Lina interessiert sich für Kunst und Mode."},
        {ru:"У Лины есть две подруги.",de:"Lina hat zwei Freundinnen."},
        {ru:"Их зовут Сина и Клара.",de:"Sie heißen Sina und Klara."},
        {ru:"На выходных они встречаются в кафе.",de:"Am Wochenende treffen sie sich im Café."}
      ],german:[
        "Sie heißt Lina.",
        "Sie ist 16 Jahre alt.",
        "Sie kommt aus Deutschland.",
        "Sie wohnt in Berlin.",
        "Sie spricht Deutsch und ein bisschen Französisch.",
        "Sie wohnt mit ihren Eltern und ihrer Schwester.",
        "Ihre Mutter ist Hausfrau.",
        "Lina hört gern Musik und liest Bücher.",
        "Lina macht Sport.",
        "Lina interessiert sich für Kunst und Mode.",
        "Lina hat zwei Freundinnen.",
        "Sie heißen Sina und Klara.",
        "Am Wochenende treffen sie sich im Café."
      ]}
    ]},
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

  ]},
  en:{label:"English",langName:"English",locale:"en",categories:[
    {id:"english",label:"English",icon:"🇬🇧",showWordList:true,topics:[
      {id:"present-simple-words",title:"Present Simple — слова",subtitle:"English",active:false,poster:null,audio:true,audioLang:"en-GB",typingInstruction:"Напиши по-английски",words:[
        {word:"always",ru:"всегда"},
        {word:"usually",ru:"обычно"},
        {word:"often",ru:"часто"},
        {word:"sometimes",ru:"иногда"},
        {word:"every day",ru:"каждый день"},
        {word:"play",ru:"играть",thirdPerson:"plays",thirdPersonGroup:"s"},
        {word:"eat",ru:"есть",thirdPerson:"eats",thirdPersonGroup:"s"},
        {word:"drink",ru:"пить",thirdPerson:"drinks",thirdPersonGroup:"s"},
        {word:"wash",ru:"мыть",thirdPerson:"washes",thirdPersonGroup:"es"},
        {word:"watch",ru:"смотреть",thirdPerson:"watches",thirdPersonGroup:"es"},
        {word:"go",ru:"идти, ходить",thirdPerson:"goes",thirdPersonGroup:"es"},
        {word:"study",ru:"учиться",thirdPerson:"studies",thirdPersonGroup:"ies"},
        {word:"hospital",ru:"больница"},
        {word:"school",ru:"школа"},
        {word:"airport",ru:"аэропорт"},
        {word:"police station",ru:"полицейский участок"},
        {word:"fire station",ru:"пожарная часть"},
        {word:"shop",ru:"магазин"},
        {word:"station",ru:"станция"},
        {word:"zoo",ru:"зоопарк"},
        {word:"supermarket",ru:"супермаркет"},
        {word:"bank",ru:"банк"},
        {word:"garage",ru:"гараж"},
        {word:"like",ru:"нравиться"}
      ]}
    ]}
  ]}
};

const card=document.getElementById("card"),pill=document.getElementById("pill"),counter=document.getElementById("counter"),progress=document.getElementById("progress"),restart=document.getElementById("restart"),reviewBtn=document.getElementById("reviewBtn"),libraryBtn=document.getElementById("libraryBtn"),sub=document.getElementById("sub"),tabEt=document.getElementById("tabEt"),tabDe=document.getElementById("tabDe");
let lang="et",mode="home",currentTopic=null,currentCategory=null,reviewQueue=[],reviewGood=0,reviewBad=0,reviewFlipped=false,reviewDirection="ru-et",typingQueue=[],typingGood=0,typingBad=0,typingChecked=false,typingWasCorrect=false,posterReturnMode="topic",audioEnabled=true;
try{const savedDirection=localStorage.getItem("sonatreenerReviewDirection");if(savedDirection==="ru-et"||savedDirection==="et-ru")reviewDirection=savedDirection;const savedAudio=localStorage.getItem("sonatreenerAudioEnabled");if(savedAudio==="0")audioEnabled=false}catch(e){}
const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
const locale=()=>DATA[lang]?.locale||"et";
const norm=s=>String(s).toLocaleLowerCase(locale()).trim().replace(/[.,;:·]+/g," ").replace(/\s+/g," ");

document.addEventListener("copy",e=>e.preventDefault());
document.addEventListener("cut",e=>e.preventDefault());
document.addEventListener("contextmenu",e=>e.preventDefault());
try{localStorage.removeItem("sonatreenerPosterLocksV2");localStorage.removeItem("sonatreenerLessonLockV1")}catch(e){}

function allTopics(l=lang){return ((DATA[l]||{}).categories||[]).flatMap(c=>c.topics.map(t=>({...t,category:c})))}
function activeTopic(){return allTopics().find(t=>t.active)||allTopics()[0]||null}
function findTopic(id){return allTopics().find(t=>t.id===id)||null}
function setNavLocked(on){tabEt.disabled=on;tabDe.disabled=on;libraryBtn.hidden=on;reviewBtn.hidden=on}
function updateSub(){if(currentTopic)sub.textContent=currentTopic.textLesson?`${currentTopic.subtitle} · 2 текста`:`${currentTopic.subtitle} · ${currentTopic.words.length} карточек`;else sub.textContent=DATA[lang].langName}
function saveReviewDirection(){try{localStorage.setItem("sonatreenerReviewDirection",reviewDirection)}catch(e){}}
function targetName(){return lang==="de"?"немецкий":lang==="en"?"английский":"эстонский"}
function targetFlag(){return lang==="de"?"🇩🇪":lang==="en"?"🇬🇧":"🇪🇪"}
function typingExpected(item){return item.typingAnswer||item.word}
function typingPrompt(item){return item.typingPrompt||item.ru}

function wordListHtml(topic){
  if(!topic?.category?.showWordList||!Array.isArray(topic.words)||!topic.words.length)return "";
  const rows=topic.words.map((item,index)=>`
    <div class="word-list-row">
      <span class="word-list-number">${index+1}</span>
      <strong class="word-list-target">${esc(item.word)}</strong>
      <span class="word-list-ru">${esc(item.ru)}</span>
    </div>`).join("");
  return `<section class="word-list-section" aria-label="Список слов">
    <div class="word-list-heading"><h3>Список слов</h3><span>${topic.words.length}</span></div>
    <div class="word-list-grid">${rows}</div>
  </section>`;
}

function saveAudioEnabled(){
  try{localStorage.setItem("sonatreenerAudioEnabled",audioEnabled?"1":"0")}catch(e){}
}
function speakTarget(text,topic=currentTopic){
  if(!audioEnabled||!topic?.audio||!text||!("speechSynthesis" in window))return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=topic.audioLang||"en-GB";
  utterance.rate=.82;
  const voices=window.speechSynthesis.getVoices();
  const exact=voices.find(v=>v.lang?.toLowerCase()===utterance.lang.toLowerCase());
  const family=voices.find(v=>v.lang?.toLowerCase().startsWith(utterance.lang.slice(0,2).toLowerCase()));
  if(exact||family)utterance.voice=exact||family;
  window.speechSynthesis.speak(utterance);
}
function audioToggleLabel(){return audioEnabled?"🔊 Звук включён":"🔇 Звук выключен"}
function toggleAudio(item){
  audioEnabled=!audioEnabled;
  saveAudioEnabled();
  if(!audioEnabled&&"speechSynthesis" in window)window.speechSynthesis.cancel();
  const button=card.querySelector("#audioToggle");
  if(button)button.textContent=audioToggleLabel();
  if(audioEnabled&&currentTopic?.audio&&item){
    const englishVisible=reviewDirection==="et-ru"?!reviewFlipped:reviewFlipped;
    if(englishVisible)speakTarget(item.word,currentTopic);
  }
}

function setLanguage(next){lang=next;tabEt.classList.toggle("active",lang==="et");tabDe.classList.toggle("active",lang==="de");currentTopic=null;currentCategory=null;renderHome()}

function renderHome(){
  mode="home";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent=DATA[lang].label;currentTopic=null;updateSub();
  if(lang==="de"){renderLibrary();return}
  const topic=activeTopic();if(!topic){renderLibrary();return}openTopic(topic.id);
}

function openTopic(id){
  const topic=findTopic(id);if(!topic)return;
  currentTopic=topic;currentCategory=topic.category;mode="topic";posterReturnMode="topic";setNavLocked(false);progress.hidden=true;restart.hidden=true;counter.textContent="";pill.textContent=topic.category.label;updateSub();
  if(topic.textLesson){renderTextLesson(topic);return}
  const poster=topic.poster
    ?`<button class="poster-preview" id="posterOpen" aria-label="Открыть плакат"><img src="${topic.poster}" alt="${esc(topic.title)} — учебный плакат"></button>`
    :`<div class="topic-no-poster">${topic.category.icon}</div>`;
  const typingLabel=topic.typingInstruction?`✍️ ${topic.typingInstruction}`:lang==="de"?"✍️ Написать формы du / er":`✍️ Написать по-${targetName()}`;
  const soundSetting=topic.audio?`<button class="secondary" id="topicAudioToggle">${audioToggleLabel()}</button>`:'';
  const wordList=wordListHtml(topic);
  card.innerHTML=`<div class="topic-intro"><div class="topic-kicker">${topic.category.icon} ${esc(topic.category.label)}</div><h2>${esc(topic.title)}</h2>${poster}<div class="topic-actions">${topic.poster?'<button class="secondary" id="posterBtn">🖼 Смотреть плакат</button>':''}<button class="primary" id="cardsRuEt">🇷🇺 → ${targetFlag()} Русский → ${targetName()}</button><button class="secondary" id="cardsEtRu">${targetFlag()} → 🇷🇺 ${targetName()[0].toUpperCase()+targetName().slice(1)} → русский</button>${soundSetting}<button class="secondary" id="typingBtn">${typingLabel}</button></div>${wordList}</div>`;
  if(topic.poster){card.querySelector("#posterOpen").onclick=()=>showPoster(topic,"topic");card.querySelector("#posterBtn").onclick=()=>showPoster(topic,"topic")}
  if(topic.audio)card.querySelector("#topicAudioToggle").onclick=()=>{audioEnabled=!audioEnabled;saveAudioEnabled();if(!audioEnabled&&"speechSynthesis" in window)window.speechSynthesis.cancel();card.querySelector("#topicAudioToggle").textContent=audioToggleLabel()};
  card.querySelector("#cardsRuEt").onclick=()=>startReview(topic,"ru-et");
  card.querySelector("#cardsEtRu").onclick=()=>startReview(topic,"et-ru");
  card.querySelector("#typingBtn").onclick=()=>startTyping(topic);
}

function renderTextLesson(topic){
  const pairs=(topic.pairs||[]).map(x=>`<div class="lesson-pair"><div class="lesson-ru">${esc(x.ru)}</div><div class="lesson-de">${esc(x.de)}</div></div>`).join("");
  const german=(topic.german||[]).map(x=>`<div class="lesson-de-line">${esc(x)}</div>`).join("");
  card.innerHTML=`<div class="text-lesson"><div class="topic-intro text-lesson-head"><div class="topic-kicker">${topic.category.icon} ${esc(topic.category.label)}</div><h2>${esc(topic.title)}</h2></div><section class="text-lesson-section"><h3>Русский + Deutsch</h3><div class="lesson-pairs">${pairs}</div></section><section class="text-lesson-section"><h3>Nur Deutsch</h3><div class="lesson-german-only">${german}</div></section></div>`;
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
  const html=categories.map(c=>`<section class="library-section"><div class="library-title"><span>${c.icon}</span><strong>${esc(c.label)}</strong></div>${c.topics.length?`<div class="topic-grid">${c.topics.map(t=>`<button class="topic-tile" data-topic="${t.id}"><span class="topic-title">${esc(t.title)}</span><span class="topic-meta">${t.textLesson?'2 текста':`${t.words.length} карточек`}${t.poster?' · 🖼':''}</span></button>`).join("")}</div>`:`<div class="library-empty">Пока нет уроков</div>`}</section>`).join("");
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
  const compact=s=>!String(s).includes(" ")&&String(s).length>=15?" flash-long":"";
  const directionLabel=reviewDirection==="ru-et"?`🇷🇺 → ${targetFlag()} Русский → ${targetName()}`:`${targetFlag()} → 🇷🇺 ${targetName()[0].toUpperCase()+targetName().slice(1)} → русский`;
  const posterButton=currentTopic&&currentTopic.poster?'<button class="secondary" id="reviewPoster" style="width:100%">🖼 Посмотреть плакат</button>':'';
  const audioToggle=currentTopic&&currentTopic.audio?`<button class="secondary" id="audioToggle" style="width:100%">${audioToggleLabel()}</button>`:'';
  card.innerHTML=`<div class="review-wrap"><button class="secondary" id="directionBtn" style="width:100%">↔ ${directionLabel}</button>${posterButton}${audioToggle}<div class="flashcard" id="flash"><div class="flashcard-inner"><div class="flash-face${compact(front)}">${esc(front)}</div><div class="flash-face flash-back${compact(back)}">${esc(back)}</div></div></div><div class="review-stats"><span>✓ ${reviewGood}</span><span>✕ ${reviewBad}</span></div><div class="review-actions" id="reviewActions" hidden><button class="review-no" id="reviewNo">✕</button><button class="review-yes" id="reviewYes">✓</button></div><div class="tiny" style="text-align:center">Нажми на карточку, чтобы перевернуть</div></div>`;
  card.querySelector("#directionBtn").onclick=switchReviewDirection;
  if(currentTopic&&currentTopic.poster)card.querySelector("#reviewPoster").onclick=()=>showPoster(currentTopic,"review");
  if(currentTopic&&currentTopic.audio)card.querySelector("#audioToggle").onclick=()=>toggleAudio(item);
  const flash=card.querySelector("#flash"),actions=card.querySelector("#reviewActions");
  flash.onclick=()=>{if(reviewFlipped)return;reviewFlipped=true;flash.classList.add("flipped");actions.hidden=false;if(currentTopic?.audio&&reviewDirection==="ru-et")speakTarget(item.word,currentTopic)};
  if(currentTopic?.audio&&reviewDirection==="et-ru")setTimeout(()=>speakTarget(item.word,currentTopic),0);
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
  if("speechSynthesis" in window)window.speechSynthesis.cancel();
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
  const expected=typingExpected(item),instruction=currentTopic.typingInstruction||(lang==="de"?"Напиши формы du / er":`Напиши по-${targetName()}`);
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
  if("speechSynthesis" in window)window.speechSynthesis.cancel();
  if(mode==="poster"&&currentTopic){posterReturnMode==="review"?resumeReview():posterReturnMode==="typing"?resumeTyping():openTopic(currentTopic.id);return}
  if((mode==="review"||mode==="typing")&&currentTopic)openTopic(currentTopic.id);
};

window.EDUKASS_TRAINER={
  open(next,id){
    if(!DATA[next])return false;
    lang=next;
    tabEt.classList.toggle("active",lang==="et");
    tabDe.classList.toggle("active",lang==="de");
    currentTopic=null;currentCategory=null;
    const topic=allTopics(next).find(t=>t.id===id);
    if(!topic)return false;
    openTopic(id);
    return true;
  },
  getTopic(next,id){return allTopics(next).find(t=>t.id===id)||null;}
};

progress.hidden=true;
setLanguage("et");

})();