(function litAliceChapter2(){
  'use strict';
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;
  const questions=[
  [
    "Miks ei saanud Alice alguses kuldset võtit kätte?",
    "Почему Алиса сначала не смогла достать золотой ключ?",
    "Alice oli liiga väike. Võti oli kõrgel laual.",
    "Алиса была слишком маленькой. Ключ лежал на высоком столе."
  ],
  [
    "Miks otsustas Alice siiski kooki süüa, kuigi ta kartis, et midagi võib valesti minna?",
    "Почему Алиса всё-таки решила съесть пирожное, хотя боялась, что что-то может пойти не так?",
    "Ta tahtis oma suurust muuta ja aeda minna.",
    "Она хотела изменить свой размер и попасть в сад."
  ],
  [
    "Mis muutus pärast seda, kui Alice koogi ära sõi? Kirjelda vähemalt kolme muutust.",
    "Что изменилось после того, как Алиса съела пирожное? Опиши хотя бы три изменения.",
    "Alice kasvas väga suureks. Tema pea ulatus laeni. Ta ei mahtunud enam uksest läbi.",
    "Алиса стала очень большой. Её голова доставала до потолка. Она больше не проходила через дверь."
  ],
  [
    "Miks hakkas Alice nutma? Kas tema olukord oli tegelikult lootusetu? Põhjenda.",
    "Почему Алиса заплакала? Была ли её ситуация на самом деле безвыходной? Объясни.",
    "Alice ei saanud aeda minna. Ta oli kurb ja hakkas nutma. Aga ta võis veel lahenduse leida.",
    "Алиса не могла попасть в сад. Ей было грустно, и она заплакала. Но она ещё могла найти выход."
  ],
  [
    "Miks ei märganud valge jänes Alicet, kui ta uuesti ruumi tuli?",
    "Почему белый кролик не заметил Алису, когда снова вошёл в комнату?",
    "Jänes kiirustas ja ei vaadanud ringi.",
    "Кролик спешил и не смотрел по сторонам."
  ],
  [
    "Kuidas aitas lehvik Alicel oma olukorda muuta?",
    "Как веер помог Алисе изменить своё положение?",
    "Lehvik muutis Alice'i väiksemaks.",
    "Веер сделал Алису меньше."
  ],
  [
    "Miks oli Alice lõpuks ikka veel hädas, kuigi uks oli talle sobiva suurusega?",
    "Почему Алиса всё ещё была в затруднении, хотя дверь теперь подходила ей по размеру?",
    "Alice oli nüüd väike, aga võti oli kõrgel laual. Ta ei saanud võtit kätte.",
    "Алиса теперь была маленькой, но ключ лежал на высоком столе. Она не могла его достать."
  ],
  [
    "Miks võis Alice arvata, et teine pudel võib teda aidata?",
    "Почему Алиса могла подумать, что вторая бутылочка ей поможет?",
    "Esimene pudel muutis tema suurust. Ta lootis, et ka teine pudel aitab.",
    "Первая бутылочка изменила её размер. Она надеялась, что и вторая поможет."
  ],
  [
    "Millised sündmused selles loos näitavad, et Alice muutub järjest julgemaks ja iseseisvamaks?",
    "Какие события показывают, что Алиса становится всё смелее и самостоятельнее?",
    "Alice sõi kooki ja proovis lehvikut. Ta otsis ise lahendusi.",
    "Алиса съела пирожное и попробовала веер. Она сама искала решения."
  ],
  [
    "Milline võiks olla loo järgmine sündmus? Paku välja kaks võimalust ja põhjenda oma arvamust.",
    "Что может произойти дальше? Предложи два варианта и объясни своё мнение.",
    "Alice võib leida tee aeda, sest ta tahab sinna minna. Ta võib jälle jänest näha, sest ta otsib teda.",
    "Алиса может найти путь в сад, потому что хочет туда попасть. Она может снова увидеть кролика, потому что ищет его."
  ]
];
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const style=document.createElement('style');
  style.textContent=[
    '.alice2-lesson{display:grid;gap:14px;max-width:780px;margin:0 auto}',
    '.alice2-lesson h2{font-size:clamp(23px,6vw,34px);color:#2f6f58;margin:5px 0}',
    '.alice2-note{font-size:14px;color:#5c7363;line-height:1.5;margin:0}',
    '.alice2-items{display:grid;gap:12px}',
    '.alice2-item{background:#fff;border:1px solid #dce9df;border-radius:16px;padding:16px 15px;display:grid;gap:7px}',
    '.alice2-q{font-size:19px;font-weight:850;line-height:1.45;color:#243e30}',
    '.alice2-a{font-size:19px;font-weight:800;line-height:1.55;color:#24593a;background:#edf7f0;padding:12px 14px;border-radius:12px}',
    '.alice2-ru{font-size:15px;line-height:1.5;color:#65776b}',
    '.alice2-label{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#668a70;margin-top:4px}',
    '.alice2-hide-ru .alice2-ru{display:none}',
    '.alice2-actions{display:flex;gap:10px;flex-wrap:wrap}',
    '@media(max-width:540px){.alice2-item{padding:13px}.alice2-q,.alice2-a{font-size:18px}}'
  ].join('\n');
  document.head.appendChild(style);
  function render(){
    if(pill)pill.textContent='📖 Eesti kirjandus';
    if(sub)sub.textContent='Урок 10 · Alice imedemaal · 2. peatükk · 10 вопросов';
    card.innerHTML='<div class="alice2-lesson" id="alice2Lesson">'+
      '<div class="topic-intro"><div class="topic-kicker">📖 Eesti kirjandus · Урок 10</div>'+
      '<h2>Alice imedemaal. 2. peatükk</h2><div class="tiny">Küsimused ja vastused · 10 вопросов с переводом</div></div>'+
      '<p class="alice2-note">Короткие ответы для устной подготовки. Перевод можно скрыть.</p>'+
      '<div class="alice2-actions"><button class="secondary" type="button" id="alice2ToggleRu">🙈 Скрыть перевод</button></div>'+
      '<div class="alice2-items">'+questions.map(([q,qr,a,ar],i)=>
        '<section class="alice2-item"><div class="alice2-q" lang="et">'+(i+1)+'. '+escapeHtml(q)+'</div>'+
        '<div class="alice2-ru" lang="ru">'+escapeHtml(qr)+'</div>'+
        '<div class="alice2-label">Vastus · ответ</div>'+
        '<div class="alice2-a" lang="et">'+escapeHtml(a)+'</div>'+
        '<div class="alice2-ru" lang="ru">'+escapeHtml(ar)+'</div></section>'
      ).join('')+'</div>'+
      '<button class="secondary" type="button" id="alice2Back">← К предметам</button></div>';
    card.querySelector('#alice2ToggleRu').onclick=()=>{
      const hidden=card.querySelector('#alice2Lesson').classList.toggle('alice2-hide-ru');
      const b=card.querySelector('#alice2ToggleRu');
      b.textContent=hidden?'🌐 Показать перевод':'🙈 Скрыть перевод';
      b.setAttribute('aria-pressed',String(hidden));
    };
    card.querySelector('#alice2Back').onclick=()=>libraryBtn.click();
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.litAliceChapter2=render;
})();