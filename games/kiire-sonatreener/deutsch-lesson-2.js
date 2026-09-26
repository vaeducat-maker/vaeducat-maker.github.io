(function deutschLesson2Module(){
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;

  const VERBS=[
    {
      title:'sich beschäftigen',
      pronunciation:'зих бешЭфтиген',
      translation:'заниматься',
      rows:[
        ['ich beschäftige mich','я занимаюсь'],
        ['du beschäftigst dich','ты занимаешься'],
        ['er / sie / es beschäftigt sich','он / она / оно занимается'],
        ['wir beschäftigen uns','мы занимаемся'],
        ['ihr beschäftigt euch','вы занимаетесь'],
        ['sie beschäftigen sich','они занимаются']
      ]
    },
    {
      title:'sich interessieren',
      pronunciation:'зих интерэси́рен',
      translation:'интересоваться',
      rows:[
        ['ich interessiere mich','я интересуюсь'],
        ['du interessierst dich','ты интересуешься'],
        ['er / sie / es interessiert sich','он / она / оно интересуется'],
        ['wir interessieren uns','мы интересуемся'],
        ['ihr interessiert euch','вы интересуетесь'],
        ['sie interessieren sich','они интересуются']
      ]
    },
    {
      title:'sich treffen',
      pronunciation:'зих трэ́фен',
      translation:'встречаться',
      rows:[
        ['ich treffe mich','я встречаюсь'],
        ['du triffst dich','ты встречаешься'],
        ['er / sie / es trifft sich','он / она / оно встречается'],
        ['wir treffen uns','мы встречаемся'],
        ['ihr trefft euch','вы встречаетесь'],
        ['sie treffen sich','они встречаются']
      ]
    }
  ];

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);

  const style=document.createElement('style');
  style.textContent=`
    .de2-view{display:grid;gap:22px}
    .de2-head{text-align:center}
    .de2-head h2{margin:0 0 5px;color:#21352c}
    .de2-verb{display:grid;gap:9px}
    .de2-verb h3{margin:0;color:#2f6f58;font-size:18px;line-height:1.35}
    .de2-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #dfe8e2;border-radius:14px;overflow:hidden;background:#fff;table-layout:fixed}
    .de2-table th,.de2-table td{padding:10px 11px;border-bottom:1px solid #e8eeea;text-align:left;vertical-align:top;overflow-wrap:anywhere;word-break:normal}
    .de2-table th{font-size:13px;color:#66746c;background:#f7faf8}
    .de2-table td:first-child{font-weight:800;color:#21352c;width:58%}
    .de2-table td:last-child{color:#55645d;width:42%}
    .de2-table tr:last-child td{border-bottom:0}
    @media(max-width:560px){
      .de2-table th,.de2-table td{padding:9px 8px;font-size:14px}
      .de2-verb h3{font-size:17px}
    }
  `;
  document.head.appendChild(style);

  function renderLesson(){
    if(pill)pill.textContent='🇩🇪 Deutsch';
    if(sub)sub.textContent='Lektion 2 · Возвратные глаголы';
    const sections=VERBS.map(v=>`
      <section class="de2-verb">
        <h3>${esc(v.title)} <span style="font-weight:600;color:#68736d">(${esc(v.pronunciation)})</span> — ${esc(v.translation)}</h3>
        <table class="de2-table">
          <thead><tr><th>Deutsch</th><th>Перевод</th></tr></thead>
          <tbody>${v.rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody>
        </table>
      </section>
    `).join('');
    card.innerHTML=`
      <div class="de2-view">
        <div class="de2-head"><div class="topic-kicker">🇩🇪 Deutsch</div><h2>Lektion 2 — Reflexive Verben</h2><div class="tiny">3 возвратных глагола</div></div>
        ${sections}
        <button class="secondary" id="de2Back">← К предметам</button>
      </div>
    `;
    const back=card.querySelector('#de2Back');
    if(back)back.onclick=()=>libraryBtn.click();
  }

  function ensureTile(){
    const section=[...card.querySelectorAll('.library-section')].find(s=>s.querySelector('.library-title strong')?.textContent.trim()==='Deutsch');
    if(!section)return;
    let grid=section.querySelector('.topic-grid');
    if(!grid){
      grid=document.createElement('div');
      grid.className='topic-grid';
      section.appendChild(grid);
    }
    let btn=grid.querySelector('#deutschLesson2');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='topic-tile';
      btn.id='deutschLesson2';
      btn.innerHTML='<span class="topic-title">Lektion 2 — Reflexive Verben</span><span class="topic-meta">3 таблицы</span>';
      grid.appendChild(btn);
    }
    btn.onclick=renderLesson;
  }

  new MutationObserver(ensureTile).observe(card,{childList:true,subtree:true});
  ensureTile();
})();