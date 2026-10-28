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
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const style=document.createElement('style');
  style.textContent='.aliceqa-lesson{display:grid;gap:14px;max-width:780px;margin:0 auto}.aliceqa-lesson .topic-intro{margin:0}.aliceqa-lesson h2{font-size:clamp(24px,6vw,34px);color:#2f6f58;margin:4px 0}.aliceqa-note{color:#536e5f;line-height:1.5;font-size:15px;margin:0}.aliceqa-items{display:grid;gap:12px}.aliceqa-item{background:#fff;border:1px solid #dce9df;border-radius:16px;padding:15px;display:grid;gap:5px}.aliceqa-question{font-size:18px;font-weight:850;color:#243e30;line-height:1.45}.aliceqa-answer{background:#eef6f0;border-radius:10px;padding:12px 13px;margin-top:8px;color:#1f5438;font-size:19px;font-weight:850;line-height:1.5;overflow-wrap:anywhere}.aliceqa-ru{font-size:14px;color:#66796b;line-height:1.5}.aliceqa-label{font-size:11px;text-transform:uppercase;letter-spacing:.04em;font-weight:850;color:#5b856c;margin-top:8px}.aliceqa-controls{display:flex;gap:10px;flex-wrap:wrap}.aliceqa-hide-ru .aliceqa-ru{display:none}@media(max-width:540px){.aliceqa-item{padding:12px}.aliceqa-question{font-size:17px}.aliceqa-answer{font-size:18px}}';
  style.textContent += ".aliceqa-ex4{border-top:3px solid #dce9df;padding-top:18px;margin-top:6px;display:grid;gap:14px}.aliceqa-ex4-heading{display:grid;gap:5px}.aliceqa-ex4-heading h3{font-size:23px;margin:0;color:#244b36;font-weight:900}.aliceqa-ex4-heading p{margin:0;font-size:16px;font-weight:700;color:#425e4c}.aliceqa-ex4-note{font-size:14px;color:#536f5f;line-height:1.45;margin:0}.aliceqa-tense-banner{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.aliceqa-tense-heading{background:#e4f1e8;border:2px solid #acd3b6;border-radius:13px;padding:10px 8px;text-align:center;display:grid;gap:4px;align-content:center}.aliceqa-tense-name{display:block;color:#176b3d;font-size:clamp(21px,6vw,27px);font-weight:950;line-height:1.1;letter-spacing:.025em}.aliceqa-tense-heading .aliceqa-ru{font-size:13px;font-weight:700;line-height:1.25;color:#456f55}.aliceqa-pairs{display:grid;gap:8px}.aliceqa-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.aliceqa-pair-col{background:#fff;border:1px solid #dce9df;border-radius:12px;padding:10px;line-height:1.45;font-size:17px;font-weight:750;overflow-wrap:anywhere}.aliceqa-past{background:#edf7ee;color:#1e5837}.aliceqa-pair-no{font-weight:900;color:#6b8373;margin-right:5px}@media(max-width:390px){.aliceqa-pair{gap:7px}.aliceqa-pair-col{padding:9px 7px;font-size:16px}.aliceqa-tense-name{font-size:21px}}";
  document.head.appendChild(style);
  function renderLesson(){
    if(pill)pill.textContent='📖 Eesti kirjandus';
    if(sub)sub.textContent='Урок 8 · Alice ja valge jänes · Ülesanded 3 ja 4';
    card.innerHTML='<div class="aliceqa-lesson" id="aliceqaLesson">'+
      '<div class="topic-intro"><div class="topic-kicker">📖 Eesti kirjandus · Урок 8</div><h2>Alice ja valge jänes</h2><div class="tiny">ÜLESANNE 3 · küsimused ja vastused</div></div>'+
      '<p class="aliceqa-note">Для тетради: переписывай только эстонские ответы. Переводы помогают проверить понимание.</p>'+
      '<div class="aliceqa-controls"><button class="secondary" id="aliceqaToggleRu" type="button" aria-pressed="false">🙈 Скрыть переводы</button></div>'+
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
      '<button class="secondary" type="button" id="aliceqaBack">← К предметам</button></div>';
    const toggle=card.querySelector('#aliceqaToggleRu');
    toggle.onclick=()=>{
      const hidden=card.querySelector('#aliceqaLesson').classList.toggle('aliceqa-hide-ru');
      toggle.textContent=hidden?'🌐 Показать переводы':'🙈 Скрыть переводы';
      toggle.setAttribute('aria-pressed',String(hidden));
    };
    card.querySelector('#aliceqaBack').onclick=()=>libraryBtn.click();
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.litAliceQuestionsLesson=renderLesson;
})();