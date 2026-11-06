(function(){
'use strict';
window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
const card=document.getElementById('card'),libraryBtn=document.getElementById('libraryBtn'),
 pill=document.getElementById('pill'),sub=document.getElementById('sub'),restart=document.getElementById('restart'),counter=document.getElementById('counter');
if(!card||!libraryBtn)return;
// Bold text from eKool, 03.11.2026, without adding extra facts.
const TERMS=[
  ['ujunahk – ujunahad','плавательная перепонка — плавательные перепонки'],
  ['ujumislestad','ласты']
];
const FACTS=[
  ['on kohastunud eluks nii vees, kui maismaal;','приспособилась к жизни как в воде, так и на суше;'],
  ['maismaal hingab kopsudega;','на суше дышит лёгкими;'],
  ['vee all hingab naha kaudu;','под водой дышит через кожу;'],
  ['jalad on kujunenud kalade uimedest','ноги сформировались из плавников рыб']
];
const FROG_LINES=TERMS.concat(FACTS);
// Approved vocabulary: only dictionary forms, without inflected duplicates.
const WORDS=[
  ['konn','лягушка'],
  ['ujunahk','плавательная перепонка'],
  ['ujumislest','ласта'],
  ['kohastuma','приспосабливаться'],
  ['maismaa','суша'],
  ['hingama','дышать'],
  ['kops','лёгкое'],
  ['nahk','кожа'],
  ['kujunema','формироваться'],
  ['uim','плавник']
];
// Video lesson “Tunne looma: Kobras” — 06.11.2026. Each sentence has a separate hidden translation.
const KOBRAS_LINES=[
  [
    "Koprad on suured närilised.",
    "Бобры — крупные грызуны."
  ],
  [
    "Nende kehapikkus võib olla kuni 1 meeter ja kaal 30 kilogrammi.",
    "Длина их тела может достигать 1 метра, а вес — 30 килограммов."
  ],
  [
    "Koprad on poolveelise eluviisiga.",
    "Бобры ведут полуводный образ жизни."
  ],
  [
    "Oma kodu rajavad nad järve või jõe kaldale.",
    "Свои жилища они строят на берегу озера или реки."
  ],
  [
    "Suvel eelistavad koprad süüa rohttaimi – vesikupp, valge vesiroos, võhumõõk, pilliroog.",
    "Летом бобры предпочитают питаться травянистыми растениями — кубышкой, белой кувшинкой, болотным ирисом и тростником."
  ],
  [
    "Sügisel langetavad nad puid ja koguvad nende oksi talvevaruks.",
    "Осенью они валят деревья и собирают их ветки в качестве запасов на зиму."
  ],
  [
    "Kui veekogu kaldad on järsud, siis kaevavad koprad endale uru.",
    "Если берега водоёма крутые, то бобры роют себе нору."
  ],
  [
    "Kui madalad ja soised kaldad seda ei võimalda, siis rajavad nad endale hoopis kuhilpesa.",
    "Если низкие и болотистые берега не позволяют этого сделать, то они строят себе вместо норы хатку."
  ],
  [
    "Kuhilpesa on mudaga kokku mätsitud savihunnik, mille kõrgus võib ulatuda kolme ja läbimõõt kümne meetrini.",
    "Бобровая хатка — это куча глины, облепленная грязью, высота которой может достигать трёх метров, а диаметр — десяти метров."
  ],
  [
    "Uruava asub veepinnast allpool.",
    "Вход в нору находится ниже поверхности воды."
  ],
  [
    "Pesas on talvel temperatuur üle nulli, vesi ei külmu ära ja koprad saavad väljuda jääalusesse vette.",
    "Зимой в жилище температура выше нуля, вода не замерзает, и бобры могут выходить в воду подо льдом."
  ],
  [
    "Koprad suudavad vee alla sukelduda kuni 20 minutiks.",
    "Бобры способны погружаться под воду на срок до 20 минут."
  ]
];
const KOBRAS_FACT=[
  [
    "Kas teadsid, et koprad on tuntud oma tammiehitamise oskuse poolest?",
    "А ты знал, что бобры известны своим умением строить плотины?"
  ]
];
const KOBRAS_WORDS=[
  [
    "kobras",
    "бобр"
  ],
  [
    "näriline",
    "грызун"
  ],
  [
    "kallas",
    "берег"
  ],
  [
    "vesiroos",
    "кувшинка"
  ],
  [
    "pilliroog",
    "тростник"
  ],
  [
    "talvevaru",
    "запас на зиму"
  ],
  [
    "urg",
    "нора"
  ],
  [
    "kuhilpesa",
    "бобровая хатка"
  ],
  [
    "muda",
    "грязь, ил"
  ],
  [
    "veepind",
    "поверхность воды"
  ],
  [
    "pesa",
    "гнездо, жилище"
  ],
  [
    "tammiehitamine",
    "строительство плотин"
  ],
  [
    "oskus",
    "умение, навык"
  ],
  [
    "rajama",
    "строить, создавать"
  ],
  [
    "koguma",
    "собирать"
  ],
  [
    "kaevama",
    "копать, рыть"
  ],
  [
    "sukelduma",
    "нырять, погружаться"
  ],
  [
    "poolveeline",
    "полуводный"
  ]
];
const ALL_WORDS=WORDS.concat(KOBRAS_WORDS);
const LINES=FROG_LINES.concat(KOBRAS_LINES,KOBRAS_FACT);
const DECKS={konn:WORDS,kobras:KOBRAS_WORDS,all:ALL_WORDS};
const DECK_NAMES={konn:'Konn',kobras:'Kobras',all:'Konn ja kobras'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!document.getElementById('konnLessonStyles')){
  const style=document.createElement('style');style.id='konnLessonStyles';
  style.textContent=[
    '.konn-lesson{display:grid;gap:13px;width:100%;max-width:780px;margin:auto}',
    '.konn-head h2{color:#2f6f58;font-size:clamp(27px,6.3vw,34px);margin:5px 0 4px}',
    '.konn-meta{color:#64766c;font-size:13px;line-height:1.5}',
    '.konn-section{display:grid;gap:9px}',
    '.konn-section h3{margin:5px 0 0;color:#2f6f58;font-size:18px}',
    '.konn-row{background:#fff;border:1px solid #dce7de;border-radius:13px;padding:12px;display:grid;gap:7px}',
    '.konn-et{font-size:16px;font-weight:750;line-height:1.48;color:#263a30}',
    '.konn-ru{font-size:15px;line-height:1.47;color:#52675d;border-top:1px solid #e7eee8;padding-top:8px}',
    '.konn-row-actions{display:flex;justify-content:flex-end}',
    '.konn-row-actions button{font-size:13px;min-height:36px;padding:6px 10px}',
    '.konn-controls{display:grid;gap:8px}',
    '.konn-controls button{min-height:46px}',
    '.konn-flash{min-height:220px;border:2px solid #dce7de;border-radius:18px;background:#fff;width:100%;padding:20px 16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;cursor:pointer;color:#214c36}',
    '.konn-flash-label{font-size:13px;color:#68796e;font-weight:650}',
    '.konn-flash-word{font-size:clamp(23px,6vw,34px);font-weight:850;text-align:center;overflow-wrap:anywhere;line-height:1.3}',
    '.konn-choices{display:grid;grid-template-columns:1fr 1fr;gap:9px}',
    '.konn-choices button{min-height:48px}',
    '.konn-finish{text-align:center;padding:24px 12px;border-radius:15px;background:#f0f7f1}',
    '@media(max-width:390px){.konn-row{padding:10px}.konn-et{font-size:15px}}'
  ].join('');
  document.head.appendChild(style);
}
const visible=new Set();
let direction='et-ru',queue=[],known=0,repeated=0,flipped=false,deckId='all',activeWords=ALL_WORDS;
function shuffle(a){
  const b=a.slice();
  for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}
  return b;
}
function chrome(p,s){
  if(pill)pill.textContent=p;if(sub)sub.textContent=s;
  if(restart)restart.hidden=true;if(counter)counter.textContent='';
  libraryBtn.hidden=false;
}
function lineHtml(pair,i){
  const shown=visible.has(i);
  return '<article class="konn-row"><div class="konn-et" lang="et">'+esc(pair[0])+'</div>'+
    '<div class="konn-ru" lang="ru"'+(shown?'':' hidden')+'>'+esc(pair[1])+'</div>'+
    '<div class="konn-row-actions"><button type="button" class="secondary" data-konn-translation="'+i+'" aria-expanded="'+shown+'">'+
    (shown?'🙈 Скрыть перевод':'🌐 Перевод')+'</button></div></article>';
}
function renderLesson(){
  chrome('🌿 Loodusõpetus','Урок 4 · Konn ja kobras');
  const all=visible.size===LINES.length;
  card.innerHTML='<div class="konn-lesson">'+
    '<header class="topic-intro konn-head"><div class="topic-kicker">🌿 Loodusõpetus · 03.11.2026 / 06.11.2026</div>'+
    '<h2>Урок 4 — Konn ja kobras</h2><div class="konn-meta">Konn: выучить наизусть · Kobras: текст и словарь</div></header>'+
    '<div class="konn-controls"><button type="button" class="secondary" id="konnAll" aria-expanded="'+all+'">'+
    (all?'🙈 Скрыть все переводы':'🌐 Показать все переводы')+'</button></div>'+
    '<section class="konn-section"><h3>Mõisted</h3>'+TERMS.map((x,i)=>lineHtml(x,i)).join('')+'</section>'+
    '<section class="konn-section"><h3>Konn</h3>'+FACTS.map((x,i)=>lineHtml(x,i+TERMS.length)).join('')+'</section>'+
    '<section class="konn-section"><h3>Kobras · Tunne looma</h3>'+KOBRAS_LINES.map((x,i)=>lineHtml(x,i+FROG_LINES.length)).join('')+'</section>'+
    '<section class="konn-section"><h3>💡 Lõbus fakt!</h3>'+KOBRAS_FACT.map((x,i)=>lineHtml(x,i+FROG_LINES.length+KOBRAS_LINES.length)).join('')+'</section>'+
    '<div class="konn-controls"><button type="button" class="primary" id="konnBeaverCards">🃏 Kobras — '+KOBRAS_WORDS.length+' карточек</button>'+
    '<button type="button" class="secondary" id="konnFrogCards">🃏 Konn — '+WORDS.length+' карточек</button>'+
    '<button type="button" class="secondary" id="konnEtCards">🃏 Все '+ALL_WORDS.length+' слов: эстонский → русский</button>'+
    '<button type="button" class="secondary" id="konnRuCards">🃏 Все '+ALL_WORDS.length+' слов: русский → эстонский</button>'+
    '<button type="button" class="secondary" id="konnBack">← К предметам</button></div></div>';
  card.querySelector('#konnAll').onclick=()=>{
    if(all)visible.clear();else LINES.forEach((_,i)=>visible.add(i));renderLesson();
  };
  card.querySelectorAll('[data-konn-translation]').forEach(b=>b.onclick=()=>{
    const i=Number(b.dataset.konnTranslation);visible.has(i)?visible.delete(i):visible.add(i);renderLesson();
  });
  card.querySelector('#konnBeaverCards').onclick=()=>startCards('et-ru','kobras');
  card.querySelector('#konnFrogCards').onclick=()=>startCards('et-ru','konn');
  card.querySelector('#konnEtCards').onclick=()=>startCards('et-ru','all');
  card.querySelector('#konnRuCards').onclick=()=>startCards('ru-et','all');
  card.querySelector('#konnBack').onclick=()=>libraryBtn.click();
}
function startCards(dir,deck='all'){
  direction=dir;deckId=deck;activeWords=DECKS[deck]||ALL_WORDS;
  queue=shuffle(activeWords);known=0;repeated=0;flipped=false;renderCard();
}
function renderCard(){
  chrome('🃏 '+DECK_NAMES[deckId]+' · sõnad','Loodusõpetus · '+activeWords.length+' слов · '+(direction==='et-ru'?'эстонский → русский':'русский → эстонский'));
  if(!queue.length){renderDone();return;}
  const pair=queue[0],front=direction==='et-ru'?pair[0]:pair[1],back=direction==='et-ru'?pair[1]:pair[0],
    frontLabel=direction==='et-ru'?'Эстонский':'Русский',backLabel=direction==='et-ru'?'Русский':'Эстонский';
  card.innerHTML='<div class="konn-lesson">'+
    '<header class="topic-intro konn-head"><div class="topic-kicker">🌿 Урок 4 — '+DECK_NAMES[deckId]+'</div>'+
    '<h2>Словарные карточки</h2><div class="konn-meta">Выучено: '+known+' / '+activeWords.length+' · Осталось: '+queue.length+'</div></header>'+
    '<button type="button" class="konn-flash" id="konnFlip" aria-label="Перевернуть карточку">'+
    '<span class="konn-flash-label">'+(flipped?backLabel:frontLabel)+'</span>'+
    '<span class="konn-flash-word" lang="'+((direction==='et-ru')!==flipped?'et':'ru')+'">'+esc(flipped?back:front)+'</span>'+
    '<span class="konn-flash-label">'+(flipped?'Нажми, чтобы вернуться':'Нажми, чтобы увидеть перевод')+'</span></button>'+
    (flipped?'<div class="konn-choices"><button type="button" class="secondary" id="konnRepeat">🔁 Повторить</button>'+
    '<button type="button" class="primary" id="konnKnow">✓ Знаю</button></div>':
    '<div class="konn-meta" style="text-align:center">Сначала попробуй вспомнить ответ самостоятельно.</div>')+
    '<div class="konn-controls"><button type="button" class="secondary" id="konnDirection">↔ '+(direction==='et-ru'?'Русский → эстонский':'Эстонский → русский')+'</button>'+
    '<button type="button" class="secondary" id="konnBackToText">← К тексту урока</button></div></div>';
  card.querySelector('#konnFlip').onclick=()=>{flipped=!flipped;renderCard();};
  const yes=card.querySelector('#konnKnow'),no=card.querySelector('#konnRepeat');
  if(yes)yes.onclick=()=>{queue.shift();known++;flipped=false;renderCard();};
  if(no)no.onclick=()=>{const word=queue.shift();repeated++;queue.splice(Math.min(queue.length,3),0,word);flipped=false;renderCard();};
  card.querySelector('#konnDirection').onclick=()=>startCards(direction==='et-ru'?'ru-et':'et-ru',deckId);
  card.querySelector('#konnBackToText').onclick=renderLesson;
}
function renderDone(){
  card.innerHTML='<div class="konn-lesson"><div class="konn-finish"><div style="font-size:38px">🎉</div>'+
    '<h2>Все '+activeWords.length+' слов выучены!</h2><p>Карточек повторено: '+repeated+'</p></div>'+
    '<div class="konn-controls"><button type="button" class="primary" id="konnAgain">🔁 Начать заново</button>'+
    '<button type="button" class="secondary" id="konnSwitch">↔ Поменять направление</button>'+
    '<button type="button" class="secondary" id="konnReturn">← К тексту урока</button></div></div>';
  card.querySelector('#konnAgain').onclick=()=>startCards(direction,deckId);
  card.querySelector('#konnSwitch').onclick=()=>startCards(direction==='et-ru'?'ru-et':'et-ru',deckId);
  card.querySelector('#konnReturn').onclick=renderLesson;
}
window.EDUKASS_LESSONS.konnLesson=renderLesson;
})();