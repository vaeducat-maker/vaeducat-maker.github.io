(function aliceReadingDiary(){
  'use strict';
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;
  const css=document.createElement('style');
  css.textContent='.alice-lesson{display:grid;gap:16px;max-width:780px;margin:0 auto}.alice-lesson h2{font-size:clamp(24px,6vw,34px);color:#2f6f58;margin:4px 0}.alice-lesson h3{font-size:19px;color:#2f6f58;margin:0 0 12px}.alice-box{background:white;border:1px solid #dfe8e2;border-radius:15px;padding:16px}.alice-line{padding:11px 12px;background:#f4f8f5;border-radius:10px;margin-top:8px}.alice-et{font-size:17px;font-weight:750;line-height:1.55;color:#244b36}.alice-ru{font-size:14px;line-height:1.5;color:#64746a;margin-top:5px}.alice-label{font-size:15px;font-weight:850;color:#3b7155;margin-bottom:4px}.alice-enum{list-style:none;padding:0;margin:0;display:grid;gap:9px}.alice-enum li{border-radius:10px;background:#f4f8f5;padding:11px 12px}.alice-number{color:#658a72;margin-right:8px}.alice-control{display:flex;gap:10px;flex-wrap:wrap;margin:4px 0}.alice-hide-ru .alice-ru,.alice-hide-ru .alice-label-ru{display:none}.alice-label-ru{font-size:13px;color:#78867e}.alice-note{font-size:14px;line-height:1.5;color:#657a6d}@media(max-width:560px){.alice-box{padding:13px}}';
  document.head.appendChild(css);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields=[
    ['Autor','Автор','Lewis Carroll','Льюис Кэрролл'],
    ['Pealkiri','Название','Alice imedemaal','Алиса в Стране чудес'],
    ['Alustasin lugemist','Начал читать','__________','Дата — впиши сам'],
    ['Lõpetasin lugemise','Закончил читать','__________','Дата — впиши сам'],
    ['Peategelane','Главный герой','Alice','Алиса']
  ];
  const characters=[
    ['Valge Küülik','Белый Кролик'],
    ['Irvik Kass','Чеширский кот'],
    ['Kübarsepp','Шляпник'],
    ['Ärtuemand','Червонная Королева']
  ];
  const events=[
    ['Alice nägi valget küülikut.','Алиса увидела белого кролика.'],
    ['Ta jooksis küülikule järele ja kukkus auku.','Она побежала за кроликом и упала в нору.'],
    ['Alice jõudis Imedemaale.','Алиса попала в Страну чудес.'],
    ['Ta sai suureks ja väikeseks.','Она становилась большой и маленькой.'],
    ['Ta kohtus Irvik Kassiga ja Kübarsepaga.','Она встретила Чеширского кота и Шляпника.'],
    ['Ta kohtus kurja kuningannaga. Lõpus ta ärkas üles.','Она встретила злую королеву. В конце она проснулась.']
  ];
  const impressions=[
    ['Kõige huvitavam koht','Самый интересный момент','Alice kukkus auku ja jõudis Imedemaale.','Алиса упала в нору и попала в Страну чудес.'],
    ['Kõige naljakam või kummalisem koht','Самый смешной или странный момент','Irvik Kass kadus ära. Ainult tema naeratus jäi alles.','Чеширский кот исчез. Осталась только его улыбка.'],
    ['Minu lemmiktegelane','Мой любимый герой','Irvik Kass.','Чеширский кот.'],
    ['Miks?','Почему?','Ta on naljakas ja oskab ära kaduda.','Он смешной и умеет исчезать.'],
    ['Minu arvamus raamatust','Моё мнение о книге','Raamat on imelik, aga huvitav. Mulle meeldib Irvik Kass.','Книга странная, но интересная. Мне нравится Чеширский кот.']
  ];
  function renderFields(){
    return fields.map(([label,labelRu,et,ru])=>'<div class="alice-line"><div class="alice-label">'+esc(label)+' <span class="alice-label-ru">· '+esc(labelRu)+'</span></div><div class="alice-et">'+esc(et)+'</div><div class="alice-ru">'+esc(ru)+'</div></div>').join('');
  }
  function renderNumbered(items){
    return '<ol class="alice-enum">'+items.map(([et,ru],i)=>'<li><div class="alice-et"><span class="alice-number">'+(i+1)+'.</span>'+esc(et)+'</div><div class="alice-ru">'+esc(ru)+'</div></li>').join('')+'</ol>';
  }
  function renderImpressions(){
    return impressions.map(([label,labelRu,et,ru])=>'<div class="alice-line"><div class="alice-label">'+esc(label)+' <span class="alice-label-ru">· '+esc(labelRu)+'</span></div><div class="alice-et">'+esc(et)+'</div><div class="alice-ru">'+esc(ru)+'</div></div>').join('');
  }
  function renderLesson(){
    if(pill)pill.textContent='📖 Eesti kirjandus';
    if(sub)sub.textContent='Урок 6 · Alice imedemaal · читательский дневник';
    card.innerHTML='<div class="alice-lesson" id="aliceLesson">'+
      '<div class="topic-intro"><div class="topic-kicker">📖 Eesti kirjandus · Урок 6</div><h2>Alice imedemaal</h2><div class="tiny">Алиса в Стране чудес · Lugemispäevik · A1</div></div>'+
      '<p class="alice-note">Готовый текст читательского дневника по форме учителя. Эстонский — крупно, русский перевод — под ним. Даты впиши самостоятельно.</p>'+
      '<div class="alice-control"><button class="secondary" type="button" id="aliceToggleRu" aria-pressed="false">🙈 Скрыть перевод</button></div>'+
      '<div class="alice-box"><h3>📝 Lugemispäevik — читательский дневник</h3>'+renderFields()+'</div>'+
      '<div class="alice-box"><h3>👥 3–5 tähtsat tegelast <span class="alice-label-ru">— важные герои</span></h3>'+renderNumbered(characters)+'</div>'+
      '<div class="alice-box"><h3>📖 Mis juhtus loos? <span class="alice-label-ru">— что произошло?</span></h3>'+renderNumbered(events)+'</div>'+
      '<div class="alice-box"><h3>⭐ Minu vastused <span class="alice-label-ru">— мои ответы</span></h3>'+renderImpressions()+'</div>'+
      '<button class="secondary" type="button" id="aliceBack">← К предметам</button></div>';
    const toggle=card.querySelector('#aliceToggleRu');
    if(toggle)toggle.onclick=()=>{
      const hide=card.querySelector('#aliceLesson').classList.toggle('alice-hide-ru');
      toggle.textContent=hide?'🌐 Показать перевод':'🙈 Скрыть перевод';
      toggle.setAttribute('aria-pressed',String(hide));
    };
    const back=card.querySelector('#aliceBack');
    if(back)back.onclick=()=>libraryBtn.click();
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.litAliceDiaryLesson=renderLesson;
})();
