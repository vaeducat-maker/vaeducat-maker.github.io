(function litCarrollLesson(){
  'use strict';
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;

  // Nine-sentence connected biography agreed for memorisation.
  const sentences=[
    ['Ta sündis 27. jaanuaril 1832. aastal Inglismaal Daresburys.','Он родился 27 января 1832 года в Дарсбери, Англия.'],
    ['Ta suri 14. jaanuaril 1898. aastal Guildfordis, Inglismaal.','Он умер 14 января 1898 года в Гилфорде, Англия.'],
    ['Ta oli inglise kirjanik, kelle kõige kuulsam teos on „Alice\'i seiklused Imedemaal“, mis ilmus 1865. aastal.','Он был английским писателем, самое известное произведение которого — «Приключения Алисы в Стране чудес», вышедшее в 1865 году.'],
    ['Tema pärisnimi oli Charles Lutwidge Dodgson.','Его настоящее имя было Чарльз Лютвидж Доджсон.'],
    ['Lisaks kirjanikule oli ta ka matemaatik, loogik ja fotograaf.','Помимо того что он был писателем, он также был математиком, логиком и фотографом.'],
    ['Tema raamatud on tuntud fantaasiarikaste maailmade, naljakate tegelaste ja sõnamängude poolest.','Его книги известны фантастическими мирами, забавными персонажами и игрой слов.'],
    ['Lewis Carroll õppis Oxfordi ülikoolis matemaatikat ning töötas seal õppejõuna.','Льюис Кэрролл изучал математику в Оксфордском университете и работал там преподавателем.'],
    ['Ta armastas mõistatusi, mänge ja lugude jutustamist.','Он любил загадки, игры и рассказывать истории.'],
    ['1862. aastal rääkis ta tüdrukule nimega Alice Liddell ja tema õdedele loo tüdrukust, kes satub imelikku maailma.','В 1862 году он рассказал девочке по имени Алиса Лидделл и её сёстрам историю о девочке, которая попадает в странный мир.']
  ];

  const style=document.createElement('style');
  style.textContent='.carroll-lesson{display:grid;gap:15px;max-width:780px;margin:0 auto}.carroll-lesson h2{font-size:clamp(25px,6vw,34px);color:#2f6f58;margin:3px 0}.carroll-lesson h3{font-size:19px;color:#2f6f58;margin:0 0 12px}.carroll-panel{padding:15px;background:#fff;border:1px solid #dfe8e2;border-radius:15px}.carroll-lines{display:grid;gap:10px}.carroll-row{padding:13px;background:#f4f8f5;border-radius:11px}.carroll-et{font-weight:760;font-size:18px;line-height:1.55;color:#214b36}.carroll-ru{font-size:15px;color:#55695e;line-height:1.55;padding:7px 0 0 0}.carroll-date{font-weight:600;color:#64796d;font-size:.88em}.carroll-date-reading{font-weight:850;color:#1d5137;font-size:1em}.carroll-row-no{font-size:12px;color:#7c9083;font-weight:700;margin-bottom:5px}.carroll-controls{display:flex;flex-wrap:wrap;gap:8px}.carroll-small{font-size:13px;margin-top:8px;padding:6px 10px;border-radius:8px;border:1px solid #d3e4d9;color:#2f6f58;background:#fff;font-weight:700;cursor:pointer}.carroll-row[data-hidden="true"] .carroll-ru{display:none}.carroll-note{color:#61786a;font-size:14px;line-height:1.5;margin:0}.carroll-lesson .carroll-back{justify-self:start}@media(max-width:560px){.carroll-panel{padding:12px}.carroll-et{font-size:17px}}';
  document.head.appendChild(style);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Dates are one reading only: print the numeral and its spoken Estonian form.
  const spokenDates={
    '27.':'kahekümne seitsmendal',
    '14.':'neljateistkümnendal',
    '1832.':'ühe tuhande kaheksasaja kolmekümne teisel',
    '1898.':'ühe tuhande kaheksasaja üheksakümne kaheksandal',
    '1865.':'ühe tuhande kaheksasaja kuuekümne viiendal',
    '1862.':'ühe tuhande kaheksasaja kuuekümne teisel'
  };
  const etWithDates=et=>esc(et).replace(/\b(?:27|14|1832|1898|1865|1862)\./g,number=>
    '<span class="carroll-date">'+number+'</span><span class="carroll-date-reading" aria-label="Чтение даты по-эстонски"> ('+esc(spokenDates[number])+')</span>'
  );
  const rows=(items,offset)=>items.map(([et,ru],i)=>
    '<div class="carroll-row" data-hidden="false"><div class="carroll-row-no">'+(offset+i+1)+'</div>'+
    '<div class="carroll-et" lang="et">'+etWithDates(et)+'</div>'+
    '<div class="carroll-ru" lang="ru">'+esc(ru)+'</div>'+
    '<button type="button" class="carroll-small" data-toggle-row aria-expanded="true">🙈 Скрыть перевод</button></div>'
  ).join('');

  function renderLesson(){
    if(pill)pill.textContent='📖 Eesti kirjandus';
    if(sub)sub.textContent='Урок 7 · Lewis Carroll – elulugu';
    card.innerHTML='<div class="carroll-lesson" id="carrollLesson">'+
      '<div class="topic-intro"><div class="topic-kicker">📖 Eesti kirjandus · Урок 7</div>'+
      '<h2>Lewis Carroll – elulugu</h2><div class="tiny">Биография · учим текст по предложениям</div></div>'+
      '<p class="carroll-note">Цифры — только подсказка. Произноси один раз выделенные зелёным слова, а не цифры и слова подряд. Русский перевод можно скрыть или показать.</p>'+
      '<div class="carroll-controls"><button type="button" class="secondary" id="carrollHideAll">🙈 Скрыть все переводы</button>'+
      '<button type="button" class="secondary" id="carrollShowAll">🌐 Показать все переводы</button></div>'+
      '<section class="carroll-panel"><h3>Elulugu</h3><div class="carroll-lines">'+rows(sentences,0)+'</div></section>'+
      '<button type="button" class="secondary carroll-back" id="carrollBack">← К предметам</button></div>';
    const root=card.querySelector('#carrollLesson');
    function setRow(row,hidden){
      row.dataset.hidden=hidden?'true':'false';
      const b=row.querySelector('[data-toggle-row]');
      b.textContent=hidden?'🌐 Показать перевод':'🙈 Скрыть перевод';
      b.setAttribute('aria-expanded',String(!hidden));
    }
    root.querySelectorAll('[data-toggle-row]').forEach(b=>b.addEventListener('click',()=>{
      const row=b.closest('.carroll-row');
      setRow(row,row.dataset.hidden!=='true');
    }));
    root.querySelector('#carrollHideAll').addEventListener('click',()=>root.querySelectorAll('.carroll-row').forEach(row=>setRow(row,true)));
    root.querySelector('#carrollShowAll').addEventListener('click',()=>root.querySelectorAll('.carroll-row').forEach(row=>setRow(row,false)));
    root.querySelector('#carrollBack').addEventListener('click',()=>libraryBtn.click());
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.litCarrollLesson=renderLesson;
})();