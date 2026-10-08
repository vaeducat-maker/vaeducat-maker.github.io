(function litOmaOnn(){
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;
  const css=document.createElement('style');
  css.textContent='.onn-lesson{display:grid;gap:18px;max-width:780px;margin:0 auto}.onn-lesson h2{font-size:clamp(24px,6vw,34px);color:#2f6f58;margin:4px 0}.onn-lesson h3{font-size:18px;margin:0 0 10px;color:#2f6f58}.onn-lesson p{margin:0}.onn-box{padding:16px;border:1px solid #dfe8e2;background:#fff;border-radius:15px}.onn-group{margin-top:16px}.onn-group:first-child{margin-top:0}.onn-list{padding-left:25px;margin:0;line-height:1.8}.onn-main{font-weight:800}.onn-actions{display:grid;gap:10px}.onn-actions a{display:block;padding:13px 14px;text-align:center;border:1px solid #cee0d5;border-radius:12px;text-decoration:none;font-weight:850;background:#eaf4ee;color:#2f6f58}@media(max-width:560px){.onn-box{padding:13px}}';
  document.head.appendChild(css);
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
     '<div class="onn-box"><h3>Peamine mõte</h3><p class="onn-main">Igaühel on oma õnn. Vaene mees leidis oma õnne tänu tööle.</p></div>'+
     '<div class="tiny">Lähtefaili leheküljed: 7, 8, 9 ja 12. Lehekülgi 10–11 ei saadetud.</div>'+
     '<button class="secondary" type="button" id="onnBack">← К предметам</button></div>';
    const b=card.querySelector('#onnBack');if(b)b.onclick=()=>libraryBtn.click();
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.litOmaOnnLesson=renderLesson;
})();