(function litOmaOnn(){
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;
  const css=document.createElement('style');
  css.textContent='.onn-lesson{display:grid;gap:18px;max-width:780px;margin:0 auto}.onn-lesson h2{font-size:clamp(24px,6vw,34px);color:#2f6f58;margin:4px 0}.onn-lesson h3{font-size:18px;margin:0 0 10px;color:#2f6f58}.onn-lesson p{margin:0}.onn-box{padding:16px;border:1px solid #dfe8e2;background:#fff;border-radius:15px}.onn-group{margin-top:16px}.onn-group:first-child{margin-top:0}.onn-list{padding-left:25px;margin:0;line-height:1.8}.onn-main{font-weight:800}.onn-retell-desc{color:#60756a;font-size:14px;line-height:1.5}.onn-retell-list{display:grid;gap:9px;margin-top:14px}.onn-retell-row{background:#f4f8f5;border-radius:10px;padding:12px}.onn-retell-et{color:#214d37;font-weight:750;line-height:1.5}.onn-retell-num{display:inline-block;min-width:25px;color:#708779}.onn-retell-ru{color:#586960;line-height:1.5;font-size:14px;margin:5px 0 0 25px}.onn-hide-ru .onn-retell-ru{display:none}.onn-retell-toggle{margin-top:12px}.onn-actions{display:grid;gap:10px}.onn-actions a{display:block;padding:13px 14px;text-align:center;border:1px solid #cee0d5;border-radius:12px;text-decoration:none;font-weight:850;background:#eaf4ee;color:#2f6f58}@media(max-width:560px){.onn-box{padding:13px}}';
  document.head.appendChild(css);
  const retelling = [
    [
      "Ühes külas elasid kaks meest.",
      "В одной деревне жили два мужчины."
    ],
    [
      "Üks mees oli rikas ja teine vaene.",
      "Один был богатым, а другой бедным."
    ],
    [
      "Vaesel mehel ei olnud raha.",
      "У бедного мужчины не было денег."
    ],
    [
      "Ühel ööl läks vaene mees õue.",
      "Однажды ночью бедный мужчина вышел во двор."
    ],
    [
      "Ta nägi, et rikka mehe põllul töötasid inimesed.",
      "Он увидел, что на поле богатого мужчины работают люди."
    ],
    [
      "Need inimesed olid rikka mehe õnn.",
      "Эти люди были счастьем богатого мужчины."
    ],
    [
      "Vaene mees küsis: „Kus on minu õnn?”",
      "Бедный мужчина спросил: «Где моё счастье?»"
    ],
    [
      "Töölised ütlesid: „Sinu õnn on pajupuhmas.”",
      "Работники сказали: «Твоё счастье находится в ивовом кусте»."
    ],
    [
      "Mees läks metsa ja otsis oma õnne.",
      "Мужчина пошёл в лес и искал своё счастье."
    ],
    [
      "Aga ta ei leidnud seda.",
      "Но он его не нашёл."
    ],
    [
      "Ta käis metsas mitu päeva.",
      "Он ходил в лес много дней."
    ],
    [
      "Siis ta korjas pajukoort.",
      "Потом он собирал ивовую кору."
    ],
    [
      "Ta tegi pajukoorest viiske.",
      "Он делал из ивовой коры лапти."
    ],
    [
      "Mees läks linna turule ja müüs viisud ära.",
      "Мужчина пошёл на городской рынок и продал лапти."
    ],
    [
      "Sõdurid ostsid kõik viisud.",
      "Солдаты купили все лапти."
    ],
    [
      "Kuningas kutsus mehe lossi tööle.",
      "Король пригласил мужчину работать во дворец."
    ],
    [
      "Vaene mees sai väga rikkaks.",
      "Бедный мужчина стал очень богатым."
    ],
    [
      "Nii leidis ta oma õnne.",
      "Так он нашёл своё счастье."
    ]
  ];
  function renderLesson(){
    if(pill)pill.textContent='📖 Eesti kirjandus';
    if(sub)sub.textContent='Урок 5 · Igaühel oma õnn · 08.10.26';
    card.innerHTML='<div class="onn-lesson">'+
     '<div class="topic-intro"><div class="topic-kicker">📖 Eesti kirjandus · Урок 5</div><h2>Igaühel oma õnn</h2><div class="tiny">У каждого своё счастье · письменное задание</div></div>'+
     '<div class="onn-actions"><a href="./igauehel-oma-onn.pdf" target="_blank" rel="noopener">📄 Открыть исходный текст (PDF, 4 стр.)</a><a href="./igauehel-oma-onn-source.html" target="_blank" rel="noopener">📖 Читать на телефоне</a></div>'+
     '<div class="onn-box"><h3>✍️ Teksti plaan</h3>'+
     '<section class="onn-group"><strong>Sissejuhatus</strong><ol class="onn-list" start="1"><li>Kõik inimesed otsivad oma õnne.</li><li>Ühes külas elavad rikas ja vaene mees.</li></ol></section>'+
     '<section class="onn-group"><strong>Põhiosa</strong><ol class="onn-list" start="3"><li>Vaene mees näeb öösel naabri põllul töölisi.</li><li>Töölised ütlevad, et tema õnn on pajupuhmas.</li><li>Mees otsib metsas oma õnne, aga ei leia seda.</li><li>Mees toob metsast pajukoort ja teeb viiske.</li><li>Sõdurid ostavad turul kõik tema viisud ära.</li></ol></section>'+
     '<section class="onn-group"><strong>Kokkuvõte</strong><ol class="onn-list" start="8"><li>Kuningas kutsub mehe tööle ja mees saab rikkaks.</li></ol></section></div>'+
     '<div class="onn-box" id="onnRetelling"><h3>🗣️ Ümberjutustus — пересказ</h3><p class="onn-retell-desc">Короткий пересказ. Сначала прочитай предложение по-эстонски, потом проверь перевод.</p><button type="button" class="secondary onn-retell-toggle" id="onnRuToggle" aria-pressed="false">🙈 Скрыть перевод</button><div class="onn-retell-list">'+retelling.map((pair,i)=>'<div class="onn-retell-row"><div class="onn-retell-et"><span class="onn-retell-num">'+(i+1)+'.</span>'+pair[0]+'</div><div class="onn-retell-ru">'+pair[1]+'</div></div>').join('')+'</div></div>'+ 
     '<div class="onn-box"><h3>Peamine mõte</h3><p class="onn-main">Igaühel on oma õnn. Vaene mees leidis oma õnne tänu tööle.</p></div>'+
     '<div class="tiny">Lähtefaili leheküljed: 7, 8, 9 ja 12. Lehekülgi 10–11 ei saadetud.</div>'+
     '<button class="secondary" type="button" id="onnBack">← К предметам</button></div>';
    const toggle=card.querySelector('#onnRuToggle');
    if(toggle)toggle.onclick=()=>{
      const hidden=card.querySelector('#onnRetelling').classList.toggle('onn-hide-ru');
      toggle.textContent=hidden?'🌐 Показать перевод':'🙈 Скрыть перевод';
      toggle.setAttribute('aria-pressed',String(hidden));
    };
    const b=card.querySelector('#onnBack');if(b)b.onclick=()=>libraryBtn.click();
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.litOmaOnnLesson=renderLesson;
})();