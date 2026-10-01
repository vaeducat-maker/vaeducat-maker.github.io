(()=>{
  const card=document.getElementById("card");
  const libraryBtn=document.getElementById("libraryBtn");
  const reviewBtn=document.getElementById("reviewBtn");
  const restart=document.getElementById("restart");
  const counter=document.getElementById("counter");
  const pill=document.getElementById("pill");
  const sub=document.getElementById("sub");
  const tabEt=document.getElementById("tabEt");
  const tabDe=document.getElementById("tabDe");
  if(!card||!libraryBtn||!restart||!counter||!pill||!sub)return;

  const SUBJECTS=["he","she","it"];
  let active=false,queue=[],good=0,bad=0,locked=false,currentSubject="he",timer=null;

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const verbs=()=>window.EDUKASS_TRAINER?.getTopic("en","present-simple-words")?.words?.filter(x=>x.thirdPerson)||[];
  const pickSubject=()=>SUBJECTS[Math.floor(Math.random()*SUBJECTS.length)];

  const style=document.createElement("style");
  style.textContent=`
    .ps3-view{display:grid;gap:20px}
    .ps3-head{text-align:center}
    .ps3-head h2{margin:0 0 6px;color:#21352c;line-height:1.2}
    .ps3-rule-label{text-align:center;font-weight:900;color:#2f6f58;font-size:18px}
    .ps3-table{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
    .ps3-col{border:1px solid #dfe8e2;border-radius:14px;background:#fff;overflow:hidden}
    .ps3-col h3{margin:0;padding:10px 8px;background:#f3f8f5;color:#2f6f58;text-align:center;font-size:17px}
    .ps3-pair{padding:9px 8px;border-top:1px solid #edf1ee;text-align:center;font-weight:800;color:#21352c;line-height:1.3}
    .ps3-arrow{color:#85928b;font-weight:700}
    .ps3-training{display:grid;gap:16px;text-align:center}
    .ps3-prompt{padding:18px 14px;border:1px solid #dfe8e2;border-radius:16px;background:#fff}
    .ps3-subject{font-size:22px;font-weight:900;color:#2f6f58;text-transform:capitalize}
    .ps3-base{font-size:38px;font-weight:950;color:#21352c;margin-top:4px}
    .ps3-input-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px}
    .ps3-input{min-width:0;padding:13px 14px;border:2px solid #cfdad3;border-radius:13px;font:inherit;font-size:20px;font-weight:850;outline:none}
    .ps3-input:focus{border-color:#2f6f58}
    .ps3-input.ok{border-color:#3c9a69;background:#f0faf4}
    .ps3-input.bad{border-color:#d45b5b;background:#fff3f3;color:#b43d3d}
    .ps3-feedback{min-height:58px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;font-size:21px;font-weight:900}
    .ps3-wrong{color:#c44747;text-decoration:line-through}
    .ps3-correct{color:#2f8a5d}
    .ps3-stats{display:flex;justify-content:center;gap:20px;color:#66746c;font-weight:800}
    @media(max-width:560px){
      .ps3-table{grid-template-columns:1fr}
      .ps3-col{display:grid;grid-template-columns:90px 1fr}
      .ps3-col h3{display:flex;align-items:center;justify-content:center}
      .ps3-pair{border-top:0;border-left:1px solid #edf1ee}
      .ps3-input-row{grid-template-columns:1fr}
      .ps3-input{font-size:19px}
    }
  `;
  document.head.appendChild(style);

  function lock(on){
    if(tabEt)tabEt.disabled=on;
    if(tabDe)tabDe.disabled=on;
    if(reviewBtn)reviewBtn.hidden=true;
    libraryBtn.hidden=on;
  }

  function tableColumn(title,items){
    return `<div class="ps3-col"><h3>${esc(title)}</h3><div>${items.map(v=>`<div class="ps3-pair">${esc(v.word)} <span class="ps3-arrow">→</span> ${esc(v.thirdPerson)}</div>`).join("")}</div></div>`;
  }

  function renderLesson(){
    active=false;locked=false;
    if(timer){clearTimeout(timer);timer=null}
    lock(false);restart.hidden=true;counter.textContent="";
    pill.textContent="🇬🇧 English";
    sub.textContent="Present Simple · he / she / it";
    const all=verbs();
    const s=all.filter(v=>v.thirdPersonGroup==="s");
    const es=all.filter(v=>v.thirdPersonGroup==="es");
    const ies=all.filter(v=>v.thirdPersonGroup==="ies");
    card.innerHTML=`<div class="ps3-view">
      <div class="ps3-head"><div class="topic-kicker">🇬🇧 English</div><h2>Тренировка Present Simple — он, она, оно</h2><div class="tiny">He / She / It</div></div>
      <div class="ps3-rule-label">Окончания в 3-м лице</div>
      <div class="ps3-table">
        ${tableColumn("+ s",s)}
        ${tableColumn("+ es",es)}
        ${tableColumn("y → ies",ies)}
      </div>
      <button class="primary" id="ps3Start">✍️ Тренировка</button>
      <button class="secondary" id="ps3Back">← К предметам</button>
    </div>`;
    card.querySelector("#ps3Start").onclick=start;
    card.querySelector("#ps3Back").onclick=()=>libraryBtn.click();
  }

  function start(){
    const all=verbs();
    if(!all.length)return;
    active=true;locked=false;queue=shuffle(all);good=0;bad=0;
    lock(true);restart.hidden=false;restart.textContent="← Выйти";
    pill.textContent="✍️ Present Simple";
    sub.textContent="He / She / It · 7 глаголов";
    render();
  }

  function render(){
    if(!active)return;
    if(!queue.length){finish();return}
    locked=false;
    currentSubject=pickSubject();
    const item=queue[0];
    counter.textContent=`Осталось: ${queue.length}`;
    card.innerHTML=`<div class="ps3-training">
      <div class="tiny">Напиши правильную форму глагола</div>
      <div class="ps3-prompt"><div class="ps3-subject">${currentSubject}</div><div class="ps3-base">${esc(item.word)}</div></div>
      <div class="ps3-input-row">
        <input id="ps3Input" class="ps3-input" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Ответ">
        <button class="primary" id="ps3Check">Проверить</button>
      </div>
      <div class="ps3-stats"><span>✓ ${good}</span><span>✕ ${bad}</span></div>
      <div class="ps3-feedback" id="ps3Feedback"></div>
    </div>`;
    const input=card.querySelector("#ps3Input");
    const check=card.querySelector("#ps3Check");
    input.addEventListener("paste",e=>e.preventDefault());
    input.addEventListener("drop",e=>e.preventDefault());
    input.addEventListener("keydown",e=>{if(e.key==="Enter")checkAnswer()});
    check.onclick=checkAnswer;
    setTimeout(()=>input.focus(),0);
  }

  function checkAnswer(){
    if(locked||!queue.length)return;
    const input=card.querySelector("#ps3Input");
    const button=card.querySelector("#ps3Check");
    const feedback=card.querySelector("#ps3Feedback");
    const item=queue[0];
    if(!input||!feedback)return;
    const typed=input.value.trim().toLowerCase();
    if(!typed){input.focus();return}
    locked=true;input.disabled=true;if(button)button.disabled=true;
    const ok=typed===item.thirdPerson.toLowerCase();
    queue.shift();
    if(ok){
      good++;input.classList.add("ok");
      feedback.innerHTML=`<span class="ps3-correct">✓ ${esc(item.thirdPerson)}</span>`;
      timer=setTimeout(render,650);
    }else{
      bad++;input.classList.add("bad");
      feedback.innerHTML=`<span class="ps3-wrong">${esc(typed)}</span><span>→</span><span class="ps3-correct">${esc(item.thirdPerson)}</span>`;
      const pos=Math.min(queue.length,queue.length>=3?2+Math.floor(Math.random()*2):Math.max(1,queue.length));
      queue.splice(pos,0,item);
      timer=setTimeout(render,1700);
    }
  }

  function finish(){
    active=false;locked=false;lock(false);restart.hidden=true;counter.textContent="";
    pill.textContent="Готово";
    sub.textContent="Present Simple · he / she / it";
    card.innerHTML=`<div class="done"><div class="big">✍️</div><h2>Готово!</h2><div class="review-stats"><span>✓ ${good}</span><span>✕ ${bad}</span></div><div class="finish-actions"><button class="primary" id="ps3Again">Ещё раз</button><button class="secondary" id="ps3Lesson">К таблице</button></div></div>`;
    card.querySelector("#ps3Again").onclick=start;
    card.querySelector("#ps3Lesson").onclick=renderLesson;
  }

  restart.addEventListener("click",e=>{
    if(!active)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(timer){clearTimeout(timer);timer=null}
    renderLesson();
  },true);

  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.englishPresentSimple3=renderLesson;
})();