(function deutschEliasMeierLesson(){
  "use strict";
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  const card=document.getElementById("card");
  const libraryBtn=document.getElementById("libraryBtn");
  const pill=document.getElementById("pill");
  const sub=document.getElementById("sub");
  if(!card||!libraryBtn)return;

  // Complete text from the school assignment; one German sentence per Russian translation.
  const LINES=[
    ["Ich heiße Elias Meier.","Меня зовут Элиас Майер."],
    ["Mein Vorname ist Elias, mein Nachname ist Meier.","Моё имя — Элиас, моя фамилия — Майер."],
    ["Ich bin 17 Jahre alt und komme aus Österreich.","Мне 17 лет, я из Австрии."],
    ["Ich bin in Salzburg geboren, aber ich wohne jetzt in Wien.","Я родился в Зальцбурге, но сейчас живу в Вене."],
    ["Ich spreche Deutsch und ein bisschen Englisch.","Я говорю по-немецки и немного по-английски."],
    ["In der Schule lerne ich auch Spanisch.","В школе я также учу испанский язык."],
    ["Ich wohne mit meiner Mutter und meinem kleinen Bruder.","Я живу с мамой и младшим братом."],
    ["Mein Vater arbeitet in Linz.","Мой отец работает в Линце."],
    ["Wir haben ein Haustier – eine Katze.","У нас есть домашнее животное — кошка."],
    ["Sie heißt Luna.","Её зовут Луна."],
    ["In meiner Freizeit höre ich gern Musik und gehe mit Freunden ins Kino.","В свободное время я люблю слушать музыку и ходить с друзьями в кино."],
    ["Ich interessiere mich für Fotografie.","Я интересуюсь фотографией."],
    ["Ich mag Pizza und Pasta, aber ich esse keinen Fisch.","Я люблю пиццу и пасту, но не ем рыбу."],
    ["Ich habe zwei gute Freunde: Noah und Julia.","У меня есть два хороших друга: Ноа и Юлия."],
    ["Wir treffen uns oft im Park oder lernen zusammen für die Schule.","Мы часто встречаемся в парке или вместе занимаемся учёбой."]
  ];
  const REPORT=[
    ["Er interessiert sich für Fotografie.","Он интересуется фотографией."],
    ["Er trifft sich oft mit seinen Freunden im Park.","Он часто встречается со своими друзьями в парке."]
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const underlineWords=html=>html
    .replace("interessiere mich",'<span class="elias-reflexive">interessiere</span> <span class="elias-reflexive">mich</span>')
    .replace("treffen uns",'<span class="elias-reflexive">treffen</span> <span class="elias-reflexive">uns</span>')
    .replace("interessiert sich",'<span class="elias-reflexive">interessiert</span> <span class="elias-reflexive">sich</span>')
    .replace("trifft sich",'<span class="elias-reflexive">trifft</span> <span class="elias-reflexive">sich</span>');

  if(!document.getElementById("elias-lesson-style")){
    const style=document.createElement("style");
    style.id="elias-lesson-style";
    style.textContent=`
      .elias-lesson{display:grid;gap:16px}
      .elias-head{text-align:center}
      .elias-head h2{margin:0 0 6px;color:#21352c}
      .elias-sentences{display:grid;gap:9px}
      .elias-sentence{padding:12px 13px;border:1px solid #dfe8e2;border-radius:12px;background:#fff}
      .elias-german{display:flex;gap:8px;align-items:flex-start;font-size:16px;font-weight:750;color:#21352c;line-height:1.5}
      .elias-german-text{flex:1;min-width:0}
      .elias-ru{color:#55645d;margin:7px 0 0;line-height:1.45;font-size:15px}
      .elias-audio{flex:none;border:1px solid #dfe8e2;border-radius:10px;background:#f7faf8;min-width:34px;min-height:34px;cursor:pointer;font-size:16px}
      .elias-reflexive{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:2px}
      .elias-note{font-size:14px;line-height:1.55;color:#4a5f54}
      .elias-lesson h3{margin:5px 0 0;color:#2f6f58;font-size:18px}
      @media(max-width:560px){.elias-sentence{padding:10px 11px}.elias-german{font-size:15px}}
    `;
    document.head.appendChild(style);
  }
  let translationVisible=true;
  function speakGerman(sentence){
    if(!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(sentence);
    u.lang="de-DE";u.rate=.86;
    const voices=window.speechSynthesis.getVoices();
    const german=voices.find(v=>v.lang&&v.lang.toLowerCase()==="de-de")||voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith("de"));
    if(german)u.voice=german;
    window.speechSynthesis.speak(u);
  }
  function sentenceRow(pair,i,report=false){
    return '<div class="elias-sentence"><div class="elias-german">'+
      '<span class="elias-german-text">'+(report?'':(i+1)+'. ')+underlineWords(esc(pair[0]))+'</span>'+
      '<button type="button" class="elias-audio" data-elias-audio="'+(report?"r":"l")+i+'" aria-label="Прослушать предложение на немецком">🔊</button>'+
      '</div><p class="elias-ru">'+esc(pair[1])+'</p></div>';
  }
  function renderLesson(){
    if(pill)pill.textContent="🇩🇪 Deutsch";
    if(sub)sub.textContent="Lektion 4 · Elias Meier · Reflexive Verben";
    card.innerHTML='<div class="elias-lesson">'+
      '<div class="elias-head"><div class="topic-kicker">🇩🇪 Deutsch</div><h2>Lektion 4 — Elias Meier</h2><div class="tiny">15 предложений · Reflexive Verben · построчный перевод</div></div>'+
      '<button type="button" class="secondary" id="eliasToggleTranslation"></button>'+
      '<div class="elias-note">Возвратные глаголы подчёркнуты вместе с местоимениями: <b>sich interessieren</b> — интересоваться; <b>sich treffen</b> — встречаться.</div>'+
      '<div class="elias-sentences">'+LINES.map((p,i)=>sentenceRow(p,i)).join("")+'</div>'+
      '<h3>Как рассказать об Элиасе</h3>'+
      '<div class="elias-note">В рассказе о другом человеке используй <b>er ... sich</b> (он ... себя).</div>'+
      '<div class="elias-sentences">'+REPORT.map((p,i)=>sentenceRow(p,i,true)).join("")+'</div>'+
      '<button type="button" class="secondary" id="eliasBack">← К предметам</button>'+
      '</div>';
    const toggle=card.querySelector("#eliasToggleTranslation");
    const update=()=>{
      toggle.textContent=translationVisible?"🙈 Скрыть перевод":"👁 Показать перевод";
      card.querySelectorAll(".elias-ru").forEach(el=>{el.hidden=!translationVisible;});
    };
    toggle.onclick=()=>{translationVisible=!translationVisible;update();};
    card.querySelectorAll("[data-elias-audio]").forEach(btn=>{
      btn.onclick=()=>{
        const id=btn.dataset.eliasAudio;
        const sentence=(id[0]==="r"?REPORT:LINES)[Number(id.slice(1))][0];
        speakGerman(sentence);
      };
    });
    card.querySelector("#eliasBack").onclick=()=>libraryBtn.click();
    update();
  }
  window.EDUKASS_LESSONS.deutschEliasLesson=renderLesson;
})();