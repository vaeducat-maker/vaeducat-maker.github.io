(function literatureAliceQuestions(){
  'use strict';
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;
  const questions=[
  [
    "Kellega Alice jõe ääres istus?",
    "С кем Алиса сидела на берегу реки?",
    "Alice istus koos oma õega.",
    "Алиса сидела со своей сестрой."
  ],
  [
    "Mida valge jänes ütles?",
    "Что сказал белый кролик?",
    "Jänes ütles: „Oh ei! Ma jään hiljaks!”",
    "Кролик сказал: «О нет! Я опаздываю!»"
  ],
  [
    "Miks Alice jänesele järele jooksis?",
    "Почему Алиса побежала за кроликом?",
    "Alice oli väga uudishimulik.",
    "Алиса была очень любопытной."
  ],
  [
    "Mida Alice maa-aluses ruumis nägi?",
    "Что Алиса увидела в подземной комнате?",
    "Alice nägi riiuleid, uksi ja erinevaid esemeid.",
    "Алиса увидела полки, двери и разные предметы."
  ],
  [
    "Mille ta leidis laualt?",
    "Что она нашла на столе?",
    "Ta leidis laualt väikese kuldse võtme.",
    "Она нашла на столе маленький золотой ключ."
  ],
  [
    "Mida ta väikese ukse taga nägi?",
    "Что она увидела за маленькой дверью?",
    "Ta nägi ilusat aeda.",
    "Она увидела красивый сад."
  ],
  [
    "Miks ei saanud Alice kohe aeda minna?",
    "Почему Алиса не могла сразу попасть в сад?",
    "Alice oli liiga suur.",
    "Алиса была слишком большой."
  ],
  [
    "Mis juhtus pärast seda, kui Alice pudelist jõi?",
    "Что произошло после того, как Алиса выпила из бутылочки?",
    "Alice muutus palju väiksemaks.",
    "Алиса стала намного меньше."
  ]
];
  const tensePairs=[["Alice vaatab jänest.","Alice vaatas jänest."],["Jänes jookseb kiiresti.","Jänes jooksis kiiresti."],["Alice läheb jänesele järele.","Alice läks jänesele järele."],["Alice kukub auku.","Alice kukkus auku."],["Ta näeb riiuleid.","Ta nägi riiuleid."],["Alice leiab väikese võtme.","Alice leidis väikese võtme."],["Ta avab ukse.","Ta avas ukse."],["Alice joob pudelist.","Alice jõi pudelist."]];
  // Printed worksheet answers. null means no exact expression exists in the supplied story.
  const worksheet5=[["väga sügav koht, kuhu saab sisse kukkuda","auk",""],["asi, millega saab lukku avada","võti",""],["inimene või loom, kes ei jõua õigeks ajaks","jään hiljaks","Только фраза кролика «Ma jään hiljaks!». В тексте нет названия такого человека или животного."],["millegi ümber vaatama","vaatas ringi",""],["järsku ära kaduma","kadus järsku",""],["ettevaatlikult ja tähelepanelikult midagi tegema",null,"Точного выражения с таким значением в рассказе нет. Не вписывай выдуманное слово."],["järjest väiksemaks muutuma","muutus järjest väiksemaks",""],["millegi alguses olema","alguses",""]];
  const worksheet6=[["Alice vaatas ringi ja märkas valget jänest.","Alice ","vaatas enda ümber"," ja märkas valget jänest."],["Jänes ütles, et ta jääb hiljaks.","Jänes ütles, et ta ","ei jõua õigeks ajaks","."],["Alice läks jänesele järele.","Alice ","järgnes jänesele","."],["Jänes kadus järsku auku.","Jänes ","kadus äkitselt"," auku."],["Alice tõusis püsti ja vaatas ringi.","Alice ","tõusis üles"," ja vaatas ringi."],["Uks oli Alice'i jaoks liiga väike.","Uks ","ei olnud Alice'i jaoks piisavalt suur","."],["Alice jõi pudelist väikese lonksu.","Alice jõi pudelist ","natuke","."],["Alice muutus järjest väiksemaks.","Alice ","muutus üha väiksemaks","."]];
  const worksheet7=[["Alice'il oli igav. Ta otsustas ringi vaadata.","Alice otsustas ringi vaadata, ","sest"," tal oli igav."],["Jänes jooksis kiiresti. Alice läks talle järele.","","Kui"," jänes kiiresti jooksis, läks Alice talle järele."],["Alice ei teadnud, kuhu jänes läheb. Ta järgnes talle ikkagi.","","Kuigi"," Alice ei teadnud, kuhu jänes läheb, järgnes ta talle ikkagi."],["Alice kukkus sügavasse auku. Ta ei saanud enam tagasi minna.","Alice ei saanud enam tagasi minna, ","sest"," ta kukkus sügavasse auku."],["Alice leidis väikese võtme. Ta proovis ust avada.","","Pärast seda, kui"," Alice leidis väikese võtme, proovis ta ust avada."],["Uks läks lahti. Alice nägi ilusat aeda.","","Kui"," uks läks lahti, nägi Alice ilusat aeda."],["Alice tahtis aeda minna. Uks oli tema jaoks liiga väike.","","Kuigi"," Alice tahtis aeda minna, oli uks tema jaoks liiga väike."],["Alice jõi pudelist. Ta muutus väiksemaks.","","Pärast seda, kui"," Alice pudelist jõi, muutus ta väiksemaks."]];
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const style=document.createElement('style');
  style.textContent='.aliceqa-lesson{display:grid;gap:14px;max-width:780px;margin:0 auto}.aliceqa-lesson .topic-intro{margin:0}.aliceqa-lesson h2{font-size:clamp(24px,6vw,34px);color:#2f6f58;margin:4px 0}.aliceqa-note{color:#536e5f;line-height:1.5;font-size:15px;margin:0}.aliceqa-items{display:grid;gap:12px}.aliceqa-item{background:#fff;border:1px solid #dce9df;border-radius:16px;padding:15px;display:grid;gap:5px}.aliceqa-question{font-size:18px;font-weight:850;color:#243e30;line-height:1.45}.aliceqa-answer{background:#eef6f0;border-radius:10px;padding:12px 13px;margin-top:8px;color:#1f5438;font-size:19px;font-weight:850;line-height:1.5;overflow-wrap:anywhere}.aliceqa-ru{font-size:14px;color:#66796b;line-height:1.5}.aliceqa-label{font-size:11px;text-transform:uppercase;letter-spacing:.04em;font-weight:850;color:#5b856c;margin-top:8px}.aliceqa-controls{display:flex;gap:10px;flex-wrap:wrap}.aliceqa-hide-ru .aliceqa-ru{display:none}@media(max-width:540px){.aliceqa-item{padding:12px}.aliceqa-question{font-size:17px}.aliceqa-answer{font-size:18px}}';
  style.textContent += ".aliceqa-ex4{border-top:3px solid #dce9df;padding-top:18px;margin-top:6px;display:grid;gap:14px}.aliceqa-ex4-heading{display:grid;gap:5px}.aliceqa-ex4-heading h3{font-size:23px;margin:0;color:#244b36;font-weight:900}.aliceqa-ex4-heading p{margin:0;font-size:16px;font-weight:700;color:#425e4c}.aliceqa-ex4-note{font-size:14px;color:#536f5f;line-height:1.45;margin:0}.aliceqa-tense-banner{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.aliceqa-tense-heading{background:#e4f1e8;border:2px solid #acd3b6;border-radius:13px;padding:10px 8px;text-align:center;display:grid;gap:4px;align-content:center}.aliceqa-tense-name{display:block;color:#176b3d;font-size:clamp(21px,6vw,27px);font-weight:950;line-height:1.1;letter-spacing:.025em}.aliceqa-tense-heading .aliceqa-ru{font-size:13px;font-weight:700;line-height:1.25;color:#456f55}.aliceqa-pairs{display:grid;gap:8px}.aliceqa-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.aliceqa-pair-col{background:#fff;border:1px solid #dce9df;border-radius:12px;padding:10px;line-height:1.45;font-size:17px;font-weight:750;overflow-wrap:anywhere}.aliceqa-past{background:#edf7ee;color:#1e5837}.aliceqa-pair-no{font-weight:900;color:#6b8373;margin-right:5px}@media(max-width:390px){.aliceqa-pair{gap:7px}.aliceqa-pair-col{padding:9px 7px;font-size:16px}.aliceqa-tense-name{font-size:21px}}";
  style.textContent+="\n.aliceqa-ws{border-top:3px solid #dce9df;padding-top:20px;margin-top:10px;display:grid;gap:12px}\n.aliceqa-ws h3{font-size:24px;font-weight:950;color:#214e35;line-height:1.2;margin:0}\n.aliceqa-ws-desc{color:#587060;font-size:14px;line-height:1.5;margin:0}\n.aliceqa-ws-row{padding:14px 12px;background:#fff;border:1px solid #d4e7da;border-radius:14px;display:grid;gap:9px}\n.aliceqa-ws-prompt{font-size:15px;color:#587060;line-height:1.5}\n.aliceqa-ws-instruction{font-size:12px;font-weight:900;color:#677e6d;letter-spacing:.04em}\n.aliceqa-ws-write{font-size:clamp(23px,6vw,29px);font-weight:900;color:#1c4e32;line-height:1.42;overflow-wrap:anywhere}\n.aliceqa-ws-write strong{font-weight:950;color:#13763b;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}\n.aliceqa-ws-note{font-size:13px;line-height:1.5;color:#78591f}\n.aliceqa-ws-uncertain{border-left:4px solid #b38c36;padding:12px;background:#fbf5e7;font-size:16px;font-weight:850;color:#6d531d;line-height:1.5}\n.aliceqa-quicknav{display:flex;flex-wrap:wrap;gap:8px}.aliceqa-quicknav button{font-size:14px;min-width:60px}\n";
  document.head.appendChild(style);

  function renderWorksheetSections(){
    const e5='<section class="aliceqa-ws" id="aliceqaExercise5"><h3>ÜLESANNE 5</h3>'+
      '<p class="aliceqa-ws-desc">Leia tekstist sõna või väljend. На распечатке вписывай только крупный ответ. Для № 3 и 6 есть замечания.</p>'+
      worksheet5.map(([definition,answer,note],i)=>'<div class="aliceqa-ws-row" data-print5="'+(i+1)+'">'+
        '<div class="aliceqa-ws-prompt">'+(i+1)+'. '+escapeHtml(definition)+'</div>'+
        (answer?'<div class="aliceqa-ws-instruction">ВПИСАТЬ:</div><div class="aliceqa-ws-write" lang="et">'+escapeHtml(answer)+'</div>':
          '<div class="aliceqa-ws-uncertain" data-no-exact-answer="true">⚠️ Точного ответа в тексте нет. Не вписывай наугад.</div>')+
        (note?'<div class="aliceqa-ws-note">'+escapeHtml(note)+'</div>':'')+
        '</div>').join('')+'</section>';
    const rows=(items,which,title,explanation)=>'<section class="aliceqa-ws" id="aliceqaExercise'+which+'"><h3>'+title+'</h3>'+
      '<p class="aliceqa-ws-desc">'+explanation+'</p>'+
      items.map(([original,left,focus,right],i)=>'<div class="aliceqa-ws-row" data-print'+which+'="'+(i+1)+'">'+
        '<div class="aliceqa-ws-instruction">ВПИСАТЬ ЦЕЛИКОМ · № '+(i+1)+'</div>'+
        '<div class="aliceqa-ws-write" lang="et">'+escapeHtml(left)+'<strong>'+escapeHtml(focus)+'</strong>'+escapeHtml(right)+'</div></div>').join('')+'</section>';
    return e5+
      rows(worksheet6,6,'ÜLESANNE 6','Замени выделенное выражение. Перепиши на строку всё крупное предложение; зелёным отмечена замена.')+
      rows(worksheet7,7,'ÜLESANNE 7','Соедини два предложения союзом. Перепиши на строку всё крупное предложение; зелёным отмечен союз.');
  }
  function renderLesson(){
    if(pill)pill.textContent='📖 Eesti kirjandus';
    if(sub)sub.textContent='Урок 8 · Alice ja valge jänes · Ülesanded 3–7';
    card.innerHTML='<div class="aliceqa-lesson" id="aliceqaLesson">'+
      '<div class="topic-intro"><div class="topic-kicker">📖 Eesti kirjandus · Урок 8</div><h2>Alice ja valge jänes</h2><div class="tiny">ÜLESANNE 3 · küsimused ja vastused</div></div>'+
      '<p class="aliceqa-note">Для тетради: переписывай только эстонские ответы. Переводы помогают проверить понимание.</p>'+
      '<div class="aliceqa-controls"><button class="secondary" id="aliceqaToggleRu" type="button" aria-pressed="false">🙈 Скрыть переводы</button></div>'+
      '<div class="aliceqa-quicknav"><button class="secondary" type="button" data-go-ex="5">✍ №5</button><button class="secondary" type="button" data-go-ex="6">✍ №6</button><button class="secondary" type="button" data-go-ex="7">✍ №7</button></div>'+
      '<div class="aliceqa-items">'+questions.map(([q,qr,a,ar],i)=>'<section class="aliceqa-item">'+
        '<div class="aliceqa-question" lang="et">'+(i+1)+'. '+escapeHtml(q)+'</div>'+
        '<div class="aliceqa-ru" lang="ru">'+escapeHtml(qr)+'</div>'+
        '<div class="aliceqa-label">Vastus · ответ</div>'+
        '<div class="aliceqa-answer" lang="et">'+escapeHtml(a)+'</div>'+
        '<div class="aliceqa-ru" lang="ru">'+escapeHtml(ar)+'</div>'+
        '</section>').join('')+'</div>'+
      '<section class="aliceqa-ex4" id="aliceqaExercise4">'+
 '<div class="aliceqa-ex4-heading"><h3>ÜLESANNE 4</h3><p>Muuda laused lihtminevikku.</p></div>'+
 '<p class="aliceqa-ex4-note">В тетради подпиши времена зелёной пастой и перепиши предложения в прошедшем времени.</p>'+
 '<div class="aliceqa-tense-banner">'+
 '<div class="aliceqa-tense-heading"><strong class="aliceqa-tense-name" lang="et">OLEVIK</strong><span class="aliceqa-ru" lang="ru">НАСТОЯЩЕЕ ВРЕМЯ</span></div>'+
 '<div class="aliceqa-tense-heading"><strong class="aliceqa-tense-name" lang="et">LIHTMINEVIK</strong><span class="aliceqa-ru" lang="ru">ПРОШЕДШЕЕ ВРЕМЯ</span></div>'+
 '</div>'+
 '<div class="aliceqa-pairs">'+tensePairs.map(([present,past],i)=>'<div class="aliceqa-pair">'+
 '<div class="aliceqa-pair-col aliceqa-present" lang="et"><span class="aliceqa-pair-no">'+(i+1)+'.</span><span class="aliceqa-tense-text">'+escapeHtml(present)+'</span></div>'+
 '<div class="aliceqa-pair-col aliceqa-past" lang="et"><span class="aliceqa-tense-text">'+escapeHtml(past)+'</span></div>'+
 '</div>').join('')+'</div></section>'+
      renderWorksheetSections()+
      '<button class="secondary" type="button" id="aliceqaBack">← К предметам</button></div>';
    const toggle=card.querySelector('#aliceqaToggleRu');
    toggle.onclick=()=>{
      const hidden=card.querySelector('#aliceqaLesson').classList.toggle('aliceqa-hide-ru');
      toggle.textContent=hidden?'🌐 Показать переводы':'🙈 Скрыть переводы';
      toggle.setAttribute('aria-pressed',String(hidden));
    };
    card.querySelectorAll('[data-go-ex]').forEach(btn=>btn.onclick=()=>card.querySelector('#aliceqaExercise'+btn.dataset.goEx)?.scrollIntoView({block:'start',behavior:'smooth'}));
    card.querySelector('#aliceqaBack').onclick=()=>libraryBtn.click();
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.litAliceQuestionsLesson=renderLesson;
})();