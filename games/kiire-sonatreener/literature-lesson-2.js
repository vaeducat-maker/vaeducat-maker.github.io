(function lesson2Module(){
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  if(!card||!libraryBtn)return;

  const TEXT1=[
    ['Loe juhendit, mis on pärit ühe vana raamatu sisekaanelt.','Прочитай инструкцию, которая взята с внутренней стороны обложки одной старой книги.'],
    ['Raamatu palve','Просьба книги'],
    ['(juhatused, kuidas raamatut hoida)','(указания, как обращаться с книгой)'],
    ['Palun, ära võta ega puuduta mind märja või pesemata kätega: minul oleks häbi näidata end määrituna teistele kodanikkudele, kes mind ka lugeda tahavad.','Пожалуйста, не бери и не трогай меня мокрыми или немытыми руками: мне было бы стыдно показываться испачканной другим гражданам, которые тоже хотят меня читать.'],
    ['Ära vii mind vihmase või lumise ilma kätte katmatult.','Не выноси меня без защиты под дождь или снег.'],
    ['Raamatud on õrnad ega suuda pahale ilmale vastu panna.','Книги нежные и не могут противостоять плохой погоде.'],
    ['Ära määri mu lehti, ära kriipsuta neid ega joonista neile pliiatsi ega tindiga: see teeks ilutuks mu välimuse.','Не пачкай мои страницы, не черкай на них и не рисуй на них карандашом или чернилами: это испортило бы мой внешний вид.'],
    ['Ära vajuta lugemise ajal mind oma küünarnukkidega, see teeks mulle haiget.','Не дави на меня локтями во время чтения — мне было бы больно.'],
    ['Ära kääna mind iialgi pahurpidi ega pane mu lehtede vahele pliiatsit või midagi muud, mis paksem oleks kui õhukesed paberilehed; see murraks mu selja.','Никогда не выворачивай меня и не клади между моими страницами карандаш или что-либо другое, что толще тонких листов бумаги; это сломало бы мне спину.'],
    ['Pea meeles, et ma käin ka paljude teiste kodanikkude juures, kui oled mind läbi lugenud.','Помни, что после того, как ты меня прочитаешь, я побываю ещё у многих других граждан.'],
    ['Sellepärast võime mõnel päeval veel teineteist kohata, ja siis pahandaksid sa, kui näeksid, et olen vana, kulunud-määrdunud.','Поэтому когда-нибудь мы можем снова встретиться, и тогда ты бы расстроился, увидев меня старой, изношенной и испачканной.'],
    ['Aita mind püsida tervena ja puhtana, siis aitan sind püsida õnnelikuna ja rõõmsana.','Помоги мне оставаться целой и чистой, тогда я помогу тебе оставаться счастливым и радостным.'],
    ['Pea meeles, et ma olen suur haridus- ja kasvatustempel, et ma tahan kõigile ainult head teha, kõigile elutarkust anda, kõiki kõrgete ja kaunite aadete poole juhtida.','Помни, что я — великий храм образования и воспитания, что я хочу всем делать только добро, давать всем житейскую мудрость и вести всех к высоким и прекрасным идеалам.'],
    ['Seda võin ma teha, kui minu palvet täidad.','Я могу это делать, если ты выполнишь мою просьбу.']
  ];

  const TEXT2=[
    ['65. Loe tekst läbi ja täida lüngad.','65. Прочитай текст и заполни пропуски.'],
    ['Sellest ajast kui Madis lugema õppis, on vahel teda raske Vanatarest raamatute juurest tulema saada.','С тех пор как Мадис научился читать, иногда его трудно заставить оторваться от книг в Ванатаре.'],
    ['Muuseumi raamatukogus saab ülevaate eestikeelse raamatu ajaloost, esimestest raamatutest ja nende saatusest.','В библиотеке музея можно познакомиться с историей книги на эстонском языке, первыми книгами и их судьбой.'],
    ['Esimene eestikeelne raamat trükiti aastal 1525, hävitati aga viimseni kui ketserlik väljaanne ja lugejateni see ei jõudnudki.','Первая книга на эстонском языке была напечатана в 1525 году, но была полностью уничтожена как еретическое издание и до читателей так и не дошла.'],
    ['Wanradti ja Koelli katekismusest aastast 1535 on säilinud vaid üksikud lehed ja need leiti tänu sellele, et olid köitekojas ühe raamatu kaane täiteks kleebitud.','От катехизиса Ванрадта и Коэлля 1535 года сохранились только отдельные листы, и нашли их благодаря тому, что в переплётной мастерской они были вклеены в обложку другой книги в качестве наполнителя.'],
    ['Piibli esimene eestikeelne trükk ilmus aastal 1739, seega pärast Põhjasõda, sõjast ja katkust laastatud maal.','Первое издание Библии на эстонском языке вышло в 1739 году, то есть после Северной войны, в стране, разорённой войной и чумой.'],
    ['Piiblit loeti talus pühapäeviti ja pühade ajal.','Библию в крестьянских домах читали по воскресеньям и во время праздников.'],
    ['Madis ei saanud aga kuidagi uskuda, kui kuulis, et paksust piiblist õppisid lapsed veerima ja lugema.','Однако Мадис никак не мог поверить, когда услышал, что по толстой Библии дети учились складывать слова по буквам и читать.'],
    ['See võis väga raske olla, aga vanaisa-vanaema olid piibli järgi, mis oli majas ainuke raamat, veerima õpetatud.','Наверное, это было очень трудно, но дедушку и бабушку учили читать по слогам именно по Библии, которая была единственной книгой в доме.'],
    ['19. sajandi jooksul edenes maarahva kirjaoskus sedavõrd, et tõusis nende rahvaste tasemele, kellel juba sajandeid enne seda oli kirjakeel olemas.','В течение XIX века грамотность простого народа развилась настолько, что достигла уровня тех народов, у которых письменный язык существовал уже за несколько столетий до этого.'],
    ['Esimesed raamatud, mis trükiti ja rahvale lugeda anti, olid enamasti vaimuliku sisuga ja ilmusid kiriku ning riigivõimu valvsa silma all.','Первые книги, которые печатали и давали народу для чтения, были в основном религиозного содержания и выходили под бдительным надзором церкви и государственной власти.'],
    ['Trükiti ka ilmalikke raamatuid.','Печатались также светские книги.'],
    ['Säilinud ja muuseumis on olemas „Ma-ilm ja monda, mis seal sees leida on” 1849. aastast, mitu kalendrit ja käsiraamatut põllumeestele, „Naljajutud” ning „Uus laste pildiraamat”.','Сохранились и находятся в музее книга 1849 года «Ma-ilm ja monda, mis seal sees leida on» («Мир и кое-что, что в нём можно найти»), несколько календарей и руководств для земледельцев, «Забавные рассказы» и «Новая детская книжка с картинками».'],
    ['ketserlik – kiriku arvates väärusuline, usust taganev','ketserlik — еретический; с точки зрения церкви придерживающийся неправильной веры, отступивший от веры.'],
    ['katekismus – lühike usuõpetuse käsiraamat','katekismus — краткое руководство по основам вероучения.']
  ];

  const WRITTEN=[
    ['Esimene osaliselt säilinud eestikeelne trükitud raamat on ','WANRADTI JA KOELLI KATEKISMUS',', see ilmus ','1535','. aastal.'],
    ['Esimene teadaolev eestikeelne raamat trükiti ','1525','. aastal, kuid see ','HÄVITATI','.'],
    ['1739. aastal ilmus ','PIIBLI ESIMENE EESTIKEELNE TRÜKK','.'],
    ['Sellest raamatust õppisid lapsed ','VEERIMA JA LUGEMA',' ja talus loeti seda enamasti ','PÜHAPÄEVITI',' ja ','PÜHADE',' ajal.'],
    ['Eesti maarahva lugemisoskus edenes jõudsalt ','19.',' sajandil.'],
    ['Raamatud, mida rahvas tollal luges, olid nii vaimuliku kui ka ','ILMALIKU',' sisuga.'],
    ['Viimastest loeti näiteks kalendreid ja ','PÕLLUMEESTE',' käsiraamatuid.']
  ];

  const WRITTEN_RU=[
    'Первая частично сохранившаяся печатная книга на эстонском языке — катехизис Ванрадта и Коэлля, она вышла в 1535 году.',
    'Первая известная книга на эстонском языке была напечатана в 1525 году, но она была уничтожена.',
    'В 1739 году вышло первое издание Библии на эстонском языке.',
    'По этой книге дети учились читать по слогам и читать, а в крестьянских домах её читали в основном по воскресеньям и во время праздников.',
    'Грамотность эстонского простого народа быстро развивалась в XIX веке.',
    'Книги, которые тогда читал народ, были как религиозного, так и светского содержания.',
    'Из светских книг читали, например, календари и руководства для земледельцев.'
  ];

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);

  const style=document.createElement('style');
  style.textContent=`
    .lit2-view{display:grid;gap:22px}
    .lit2-head{text-align:center}
    .lit2-head h2{margin:0 0 6px;color:#21352c}
    .lit2-section{display:grid;gap:10px}
    .lit2-section h3{margin:0;color:#2f6f58;font-size:19px}
    .lit2-pairs{display:grid;gap:9px}
    .lit2-pair{padding:12px 14px;border:1px solid #dfe8e2;border-radius:13px;background:#fff;line-height:1.48}
    .lit2-et{font-weight:800;color:#21352c;margin-bottom:5px}
    .lit2-ru{color:#59675f}
    .lit2-written{display:grid;gap:10px}
    .lit2-written-item{padding:13px 14px;border:1px solid #dfe8e2;border-radius:13px;background:#fff;line-height:1.55}
    .lit2-written-item .et{color:#21352c}
    .lit2-written-item .ru{color:#59675f;margin-top:6px}
    .lit2-answer{font-weight:950;text-transform:uppercase;color:#163f2f;letter-spacing:.02em}
    @media(max-width:560px){
      .lit2-pair,.lit2-written-item{padding:11px 12px}
      .lit2-et,.lit2-ru,.lit2-written-item{font-size:15px}
    }
  `;
  document.head.appendChild(style);

  function pairHtml(pair){
    const et=pair[0],ru=pair[1];
    return '<div class="lit2-pair"><div class="lit2-et">'+esc(et)+'</div><div class="lit2-ru">'+esc(ru)+'</div></div>';
  }
  function writtenHtml(parts,i){
    let et='<div class="et">';
    for(let p=0;p<parts.length;p++){
      et+=(p%2===1)?'<strong class="lit2-answer">'+esc(parts[p])+'</strong>':esc(parts[p]);
    }
    et+='</div><div class="ru">'+esc(WRITTEN_RU[i])+'</div>';
    return '<div class="lit2-written-item">'+et+'</div>';
  }

  function renderLesson(){
    if(pill)pill.textContent='📖 Eesti kirjandus';
    if(sub)sub.textContent='Урок 2 · Исторические тексты о книге';
    card.innerHTML=
      '<div class="lit2-view">'+
        '<div class="lit2-head"><div class="topic-kicker">📖 Eesti kirjandus</div><h2>Урок 2 — Исторические тексты о книге</h2><div class="tiny">Два текста · построчный перевод · письменное задание</div></div>'+
        '<section class="lit2-section"><h3>Текст 1 · Raamatu palve</h3><div class="lit2-pairs">'+TEXT1.map(pairHtml).join('')+'</div></section>'+
        '<section class="lit2-section"><h3>Текст 2 · Eesti raamatu ajaloost</h3><div class="lit2-pairs">'+TEXT2.map(pairHtml).join('')+'</div></section>'+
        '<section class="lit2-section"><h3>✍️ Письменное задание</h3><div class="tiny">То, что нужно вписать в пропуски, выделено ЖИРНЫМ КАПСЛОКОМ.</div><div class="lit2-written">'+WRITTEN.map(writtenHtml).join('')+'</div></section>'+
        '<button class="secondary" id="lit2Back">← К предметам</button>'+
      '</div>';
    const b=card.querySelector('#lit2Back');
    if(b)b.onclick=()=>libraryBtn.click();
  }

  function ensureTile(){
    const sections=[...card.querySelectorAll('.library-section')];
    const section=sections.find(s=>s.querySelector('.library-title strong')?.textContent.trim()==='Eesti kirjandus');
    if(!section)return;
    let grid=section.querySelector('.topic-grid');
    if(!grid){
      const empty=section.querySelector('.library-empty');
      if(empty)empty.remove();
      grid=document.createElement('div');
      grid.className='topic-grid';
      section.appendChild(grid);
    }
    const existing=grid.querySelector('#litHistoryBookLesson');if(existing){existing.onclick=renderLesson;return;}
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='topic-tile';
    btn.id='litHistoryBookLesson';
    btn.innerHTML='<span class="topic-title">Урок 2 — Исторические тексты о книге</span><span class="topic-meta">2 текста · перевод · письменное задание</span>';
    btn.onclick=renderLesson;
    grid.appendChild(btn);
  }

  new MutationObserver(ensureTile).observe(card,{childList:true,subtree:true});
  ensureTile();
})();
