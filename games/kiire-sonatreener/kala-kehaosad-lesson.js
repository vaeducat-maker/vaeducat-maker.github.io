(function kalaKehaosadLesson(){
  'use strict';
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const pill=document.getElementById('pill');
  const sub=document.getElementById('sub');
  const restart=document.getElementById('restart');
  const counter=document.getElementById('counter');
  if(!card || !libraryBtn) return;
  const WORDS=[
    {et:'Kere',ru:'Туловище'},
    {et:'Lõpused',ru:'Жабры'},
    {et:'Seljauim',ru:'Спинной плавник'},
    {et:'Rinnauim',ru:'Грудной плавник'},
    {et:'Kõhuuim',ru:'Брюшной плавник'},
    {et:'Pärakuuim',ru:'Анальный плавник'},
    {et:'Sabauim',ru:'Хвостовой плавник'}
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let view='diagram', languageMode='et', chosen=-1, revealed=new Set();
  let direction='et-ru', deck=[], place=0, flipped=false, learned=new Set();

  const css=document.createElement('style');
  css.textContent=[
    '.fish-lesson{display:grid;gap:14px;width:100%;max-width:800px;margin:0 auto}',
    '.fish-lesson h2{color:#2f6f58;font-size:clamp(26px,7vw,35px);line-height:1.13;margin:4px 0}',
    '.fish-kicker{color:#518369;font-size:13px;font-weight:850;letter-spacing:.04em}',
    '.fish-sub{color:#64766c;font-size:14px;line-height:1.4}',
    '.fish-toolbar,.fish-deck-tools,.fish-actions{display:flex;gap:8px;flex-wrap:wrap}',
    '.fish-toolbar button,.fish-deck-tools button{min-height:43px;padding:10px 12px;font-size:13px;flex:1 1 145px}',
    '.fish-toolbar button.is-active,.fish-deck-tools button.is-active{background:#2f6f58;color:#fff;border-color:#2f6f58}',
    '.fish-picture{padding:6px;border-radius:17px;border:1px solid #dce8e1;background:linear-gradient(135deg,#f1f9fa,#fffdf5);overflow:hidden}',
    '.fish-picture svg{width:100%;height:auto;display:block;max-height:350px}',
    '.fish-picture.fish-poster{background:#fff;padding:0;border-color:#e0e6dd}',
    '.fish-picture.fish-poster svg{max-height:none}',
    '.fish-callout{cursor:pointer}',
    '.fish-callout:focus-visible .fish-callout-bg{stroke:#d99a22;stroke-width:4}',
    '.fish-picture .fish-zone{pointer-events:all;cursor:pointer}',
    '.fish-hint{font-size:13px;line-height:1.5;color:#5b7065;margin:0}',
    '.fish-words{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
    '.fish-word{min-height:75px;padding:11px 10px;border-radius:13px;border:1px solid #dce7df;background:#fff;text-align:left;display:flex;flex-direction:column;justify-content:center;gap:6px}',
    '.fish-word.is-selected{border:2px solid #70aa88;background:#eef8f0;padding:10px 9px}',
    '.fish-word-line{display:flex;align-items:center;gap:8px;font-size:clamp(14px,3.5vw,17px);font-weight:850;color:#27543a;line-height:1.3;overflow-wrap:anywhere}',
    '.fish-word-number{flex:0 0 24px;height:24px;border-radius:99px;background:#e5f1e9;color:#2f6f58;font-size:12px;display:inline-flex;align-items:center;justify-content:center}',
    '.fish-word-ru{font-size:clamp(12px,3.3vw,15px);font-weight:600;color:#52675b;padding-left:32px;line-height:1.35}',
    '.fish-card-shell{display:grid;gap:10px}',
    '.fish-flashcard{border-radius:19px;border:2px solid #d7e7da;background:#fff;min-height:260px;padding:26px 18px;text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%}',
    '.fish-flashcard:focus-visible,.fish-word:focus-visible{outline:3px solid #f0b84d;outline-offset:2px}',
    '.fish-flashcard .fish-card-word{font-size:clamp(31px,9vw,48px)}',
    '.fish-card-question{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#668071}',
    '.fish-card-word{font-size:clamp(26px,7vw,39px);font-weight:900;color:#23553a;overflow-wrap:anywhere}',
    '.fish-card-answer{font-size:clamp(21px,6vw,30px);font-weight:850;color:#a66027}',
    '.fish-card-prompt{font-size:13px;color:#718178}',
    '.fish-card-counter{font-size:13px;font-weight:700;color:#61786a;display:flex;justify-content:space-between}',
    '.fish-actions button{flex:1 1 125px;min-height:50px}',
    '.fish-done{padding:30px 12px;text-align:center;border-radius:17px;background:#eef7f0}',
    '.fish-done h3{color:#2f6f58;font-size:25px}',
    '@media(max-width:390px){.fish-words{gap:6px}.fish-word{padding:9px 7px}.fish-word.is-selected{padding:8px 6px}.fish-word-number{flex-basis:21px;height:21px}.fish-word-line{gap:5px}.fish-word-ru{padding-left:26px}.fish-flashcard{min-height:240px}}'
  ].join('');
  document.head.appendChild(css);

  // Hand-drawn European perch (ahven), all image parts are native inline SVG.
  // Interactive poster highlights each fish part; vocabulary cards remain text-only.
  const regions=[
    'M346 226 Q485 207 620 257 Q690 275 721 286 Q680 342 563 359 Q422 377 335 345 Z',
    'M247 236 Q300 244 314 294 Q311 329 268 348 Q244 318 247 236 Z',
    'M283 217 L286 124 L302 167 L324 104 L341 167 L365 98 L387 160 L411 112 L434 181 L455 143 L483 211 L501 227 Z',
    'M310 318 Q340 317 403 368 Q351 399 306 349 Z',
    'M373 358 Q398 397 414 426 Q370 432 339 390 Z',
    'M530 354 Q562 400 620 421 Q628 385 598 350 Z',
    'M723 280 Q796 239 852 197 Q835 273 844 292 Q844 321 865 373 Q787 343 723 311 Z'
  ];
  const labelLocations=[
    {x:898,y:169,w:274,start:[945,245],target:[749,507]},
    {x:39,y:169,w:289,start:[251,245],target:[385,504]},
    {x:667,y:37,w:332,start:[689,112],target:[486,347]},
    {x:29,y:627,w:323,start:[262,643],target:[475,591]},
    {x:261,y:728,w:302,start:[385,742],target:[506,646]},
    {x:647,y:730,w:319,start:[761,743],target:[720,647]},
    {x:945,y:651,w:245,start:[1041,671],target:[1012,548]}
  ];
  function posterCallouts(selected){
    const guide=labelLocations.map((l,i)=>{
      const sel=selected===i;
      return '<path d="M'+l.start.join(' ')+' L'+l.target.join(' ')+'" fill="none" stroke="'+(sel?'#2f8060':'#343c37')+'" stroke-width="'+(sel?'4':'2.7')+'" stroke-linecap="round"/>'+
        '<circle cx="'+l.target[0]+'" cy="'+l.target[1]+'" r="'+(sel?8:6)+'" fill="'+(sel?'#e5aa32':'#273a2d')+'" stroke="#fff" stroke-width="3"/>';
    }).join('');
    const captions=labelLocations.map((l,i)=>{
      const w=WORDS[i],sel=selected===i,show=languageMode==='both'||revealed.has(i);
      return '<g class="fish-callout" data-fish-word="'+i+'" role="button" tabindex="0" aria-label="'+esc(w.et+' — нажми для перевода')+'" aria-pressed="'+String(show)+'">'+
        '<rect class="fish-callout-bg" x="'+l.x+'" y="'+l.y+'" width="'+l.w+'" height="96" rx="16" fill="'+(sel?'#edf7ee':'#ffffff')+'" fill-opacity="'+(sel?'.97':'.02')+'" stroke="'+(sel?'#b7dac2':'transparent')+'"/>'+
        '<text x="'+(l.x+14)+'" y="'+(l.y+45)+'" font-family="Arial, sans-serif" font-size="35" font-weight="800" fill="#1a241d">'+esc(w.et)+'</text>'+
        (show?'<text x="'+(l.x+14)+'" y="'+(l.y+79)+'" font-family="Arial, sans-serif" font-size="25" font-weight="650" fill="#597366">'+esc(w.ru)+'</text>':'')+
        '</g>';
    }).join('');
    return guide+captions;
  }
  function fishSvg(selected, interactive, poster=false){
    const zonePaths=regions.map((d,i)=>{
      const isOn=i===selected;
      return '<path class="fish-zone" data-fish-part="'+i+'" d="'+d+'" fill="'+(isOn?'rgba(255,202,65,.56)':'transparent')+'" stroke="'+(isOn?'#f8b342':'transparent')+'" stroke-width="'+(isOn?'5':'1')+'" stroke-linejoin="round" '+(interactive?'role="button" tabindex="0" aria-label="'+esc(WORDS[i].et)+'"':'aria-hidden="true"')+'/>';
    }).join('');
    return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+(poster?'0 0 1200 840':'0 0 920 490')+'" role="img" aria-label="Ahven: kala kehaosad. Окунь: части тела рыбы">',
    '<defs>',
    '<linearGradient id="fishBodyG" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#243f31"/><stop offset=".42" stop-color="#708c42"/><stop offset=".75" stop-color="#d8c589"/><stop offset="1" stop-color="#e5d9b0"/></linearGradient>',
    '<linearGradient id="fishTailG" x1="0" x2=".8" y1="0" y2=".7"><stop stop-color="#697452"/><stop offset="1" stop-color="#ad5e45"/></linearGradient>',
    '<pattern id="fishScale" width="19" height="12" patternUnits="userSpaceOnUse"><path d="M0 4 Q9 15 19 4" stroke="#776d4d" stroke-width="1.35" fill="none" opacity=".27"/></pattern>',
    '<clipPath id="fishBodyClip"><path d="M132 275 Q155 230 241 217 Q390 185 526 220 Q665 243 747 283 L747 306 Q653 371 505 373 Q334 393 237 350 Q159 333 132 296 Z"/></clipPath>',
    '</defs>',
    (poster?'<g transform="translate(90 205) scale(1.1)">':''),
    '<g opacity=".24" fill="none" stroke="#9abec1" stroke-width="3"><path d="M30 98 Q85 79 142 98 M749 93 Q813 80 875 97 M41 408 Q118 388 176 404 M697 432 Q807 413 875 427"/></g>',
    // Tail and fin membranes are behind the body.
    '<path d="M709 278 Q787 234 852 197 Q838 266 845 291 Q844 328 866 374 Q783 341 709 314 Z" fill="url(#fishTailG)" stroke="#334b3b" stroke-width="6" stroke-linejoin="round"/>',
    '<g stroke="#614b42" stroke-width="2.6" opacity=".75"><path d="M731 294 L848 209 M732 296 L847 246 M732 296 L841 287 M733 300 L851 343 M730 301 L854 368"/></g>',
    '<path d="M277 223 L285 124 L300 169 L324 104 L342 166 L365 98 L385 160 L413 112 L433 181 L455 144 L484 214 L501 232 Z" fill="#475849" stroke="#293f36" stroke-width="5" stroke-linejoin="round"/>',
    '<g stroke="#a6af93" opacity=".66" stroke-width="3"><path d="M299 219 L288 144 M322 214 L324 118 M349 215 L364 118 M378 219 L410 129 M412 226 L453 161"/></g>',
    '<path d="M483 218 Q504 166 570 177 Q597 186 608 235 L598 249 Z" fill="#657b68" stroke="#33473b" stroke-width="5"/>',
    '<g stroke="#bfbd9e" opacity=".72" stroke-width="2.3"><path d="M510 228 L516 181 M527 234 L545 181 M544 237 L570 190 M566 241 L591 209"/></g>',
    '<path d="M369 358 Q394 399 415 426 Q371 432 337 390 Z" fill="#c77f4a" stroke="#996849" stroke-width="5"/>',
    '<g stroke="#f4bd79" opacity=".72" stroke-width="2"><path d="M370 367 L395 415 M384 362 L408 415 M358 383 L399 421"/></g>',
    '<path d="M525 358 Q555 401 619 421 Q626 381 595 354 Z" fill="#bb8048" stroke="#78543b" stroke-width="5"/>',
    '<g stroke="#e5b279" opacity=".7" stroke-width="2"><path d="M549 368 L610 413 M570 365 L616 404 M585 362 L620 392"/></g>',
    // Body, scales, dark bars, yellow belly.
    '<path d="M132 275 Q155 230 241 217 Q390 185 526 220 Q665 243 747 283 L747 306 Q653 371 505 373 Q334 393 237 350 Q159 333 132 296 Z" fill="url(#fishBodyG)" stroke="#334a36" stroke-width="6"/>',
    '<g clip-path="url(#fishBodyClip)">',
    '<rect x="130" y="198" width="635" height="205" fill="url(#fishScale)"/>',
    '<path d="M314 204 Q336 278 335 381 L365 388 Q360 298 353 198Z M406 202 Q424 286 414 381 L449 386 Q460 303 449 207Z M499 214 Q516 283 504 374 L538 378 Q555 309 543 219Z M594 235 Q601 281 587 358 L619 355 Q633 298 627 243Z" fill="#244e39" opacity=".55"/>',
    '<path d="M130 305 Q340 329 514 340 Q652 344 748 296 L747 395 L130 390Z" fill="#f3e2bd" opacity=".26"/>',
    '<path d="M327 263 Q430 283 590 283" fill="none" stroke="#e7d88a" stroke-width="3" opacity=".6"/>',
    '</g>',
    // Head, mouth, eye, gill cover.
    '<path d="M138 287 Q159 273 173 281 Q177 296 147 303" fill="#ceb98a" stroke="#485a3f" stroke-width="4"/>',
    '<path d="M139 292 L169 296" stroke="#334139" stroke-width="3"/>',
    '<path d="M248 219 Q291 264 296 309 Q296 335 266 350" fill="none" stroke="#375241" stroke-width="5"/>',
    '<path d="M263 241 Q286 278 280 315" fill="none" stroke="#86945e" stroke-width="3"/>',
    '<circle cx="208" cy="261" r="16" fill="#c6915b" stroke="#304537" stroke-width="5"/>',
    '<circle cx="211" cy="260" r="9" fill="#242a23"/><circle cx="214" cy="255" r="3" fill="#fff"/>',
    '<path d="M165 306 Q187 321 201 315" fill="none" stroke="#655f44" stroke-width="3"/>',
    // The pectoral fin lies over the body.
    '<path d="M307 318 Q341 316 404 368 Q355 399 307 347 Z" fill="#c9854b" stroke="#80543b" stroke-width="5"/>',
    '<g stroke="#edb070" stroke-width="2.5"><path d="M312 326 L386 370 M317 334 L378 381 M315 345 L349 385 M319 328 L361 377"/></g>',
    // Highlight and hit regions are the topmost layer.
    '<g>'+zonePaths+'</g>',
    (poster?'</g>'+posterCallouts(selected):''),
    '</svg>'
    ].join('');
  }
  const shuffle=arr=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;};
  function intro(){return '<header class="topic-intro"><div class="fish-kicker">🌿 Loodusõpetus · Урок 3</div><h2>Kala kehaosad</h2><div class="fish-sub">Ahven — окунь · 7 частей тела рыбы</div></header>';}
  function backButton(){return '<button type="button" class="secondary" id="fishBack">← К предметам</button>';}
  function diagram(){
    card.innerHTML='<div class="fish-lesson" id="fishLesson">'+intro()+
      '<div class="fish-toolbar"><button type="button" data-fish-mode="et" class="'+(languageMode==='et'?'is-active':'')+'">🇪🇪 Только эстонский</button>'+
      '<button type="button" data-fish-mode="both" class="'+(languageMode==='both'?'is-active':'')+'">🇪🇪 + 🇷🇺 С переводом</button></div>'+
      '<div class="fish-picture fish-poster">'+fishSvg(chosen,true,true)+'</div>'+
      '<p class="fish-hint">Нажми на подпись около рыбы — русский перевод появится прямо под ней. Нажми ещё раз, чтобы скрыть его.</p>'+
      '<div class="fish-actions"><button class="primary" id="fishEtCards">🃏 Карточки: Eesti → русский</button><button class="secondary" id="fishRuCards">🃏 Карточки: русский → Eesti</button></div>'+
      backButton()+'</div>';
    card.querySelectorAll('[data-fish-word], [data-fish-part]').forEach(el=>{
      const idx=Number(el.dataset.fishWord!==undefined?el.dataset.fishWord:el.dataset.fishPart);
      const choose=()=>{
        if(languageMode==='et'){
          if(el.hasAttribute('data-fish-word')&&revealed.has(idx))revealed.delete(idx);
          else revealed.add(idx);
        }
        chosen=idx;diagram();
      };
      el.addEventListener('click',choose);
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
    });
    card.querySelectorAll('[data-fish-mode]').forEach(btn=>btn.onclick=()=>{
      languageMode=btn.dataset.fishMode;
      if(languageMode==='et')revealed.clear();
      diagram();
    });
    card.querySelector('#fishEtCards').onclick=()=>startCards('et-ru');
    card.querySelector('#fishRuCards').onclick=()=>startCards('ru-et');
    card.querySelector('#fishBack').onclick=()=>libraryBtn.click();
  }
  function startCards(dir){
    view='cards';direction=dir;deck=shuffle([0,1,2,3,4,5,6]);place=0;flipped=false;learned=new Set();cards();
  }
  function cards(){
    if(place>=deck.length){finish();return;}
    const i=deck[place],w=WORDS[i];
    const front=direction==='et-ru'?w.et:w.ru;
    const answer=direction==='et-ru'?w.ru:w.et;
    card.innerHTML='<div class="fish-lesson" id="fishLesson">'+intro()+
      '<div class="fish-deck-tools"><button type="button" id="fishChangeDir" class="secondary">'+(direction==='et-ru'?'🇪🇪 → 🇷🇺':'🇷🇺 → 🇪🇪')+' · Сменить направление</button>'+
      '<button type="button" id="fishToDiagram">🐟 К рисунку</button></div>'+
      '<div class="fish-card-counter"><span>Карточка '+(place+1)+' из '+deck.length+'</span><span>✓ Выучено: '+learned.size+' / 7</span></div>'+
      '<div class="fish-card-shell"><button type="button" class="fish-flashcard" id="fishFlip" aria-label="Перевернуть карточку">'+
      '<div class="fish-card-question">'+(direction==='et-ru'?'Переведи на русский':'Назови по-эстонски')+'</div>'+

      '<div class="fish-card-word">'+esc(front)+'</div>'+
      (flipped?'<div class="fish-card-answer">'+esc(answer)+'</div>':'<div class="fish-card-prompt">Нажми, чтобы увидеть перевод ↻</div>')+
      '</button></div>'+
      (flipped?'<div class="fish-actions"><button type="button" class="secondary" id="fishRepeat">↻ Повторить позже</button><button type="button" class="primary" id="fishKnow">✓ Знаю</button></div>':
        '<div class="fish-actions"><button type="button" class="primary" id="fishShow">Показать перевод</button></div>')+
      backButton()+'</div>';
    card.querySelector('#fishFlip').onclick=()=>{flipped=!flipped;cards();};
    if(flipped){
      card.querySelector('#fishRepeat').onclick=()=>{learned.delete(i);deck.push(i);place++;flipped=false;cards();};
      card.querySelector('#fishKnow').onclick=()=>{learned.add(i);place++;flipped=false;cards();};
    }else{
      card.querySelector('#fishShow').onclick=()=>{flipped=true;cards();};
    }
    card.querySelector('#fishChangeDir').onclick=()=>startCards(direction==='et-ru'?'ru-et':'et-ru');
    card.querySelector('#fishToDiagram').onclick=()=>{view='diagram';diagram();};
    card.querySelector('#fishBack').onclick=()=>libraryBtn.click();
  }
  function finish(){
    card.innerHTML='<div class="fish-lesson" id="fishLesson">'+intro()+
      '<div class="fish-done"><div style="font-size:48px">🐟</div><h3>Väga tubli!</h3><p>Все 7 частей рыбы пройдены.</p></div>'+
      '<div class="fish-actions"><button type="button" class="primary" id="fishAgain">🃏 Повторить карточки</button>'+
      '<button type="button" class="secondary" id="fishDiagram">🐟 К рисунку</button></div>'+
      backButton()+'</div>';
    card.querySelector('#fishAgain').onclick=()=>startCards(direction);
    card.querySelector('#fishDiagram').onclick=()=>{view='diagram';diagram();};
    card.querySelector('#fishBack').onclick=()=>libraryBtn.click();
  }
  function openLesson(){
    view='diagram';chosen=-1;revealed.clear();languageMode='et';
    if(pill)pill.textContent='🌿 Loodusõpetus';
    if(sub)sub.textContent='Урок 3 · Kala kehaosad';
    if(restart)restart.hidden=true;
    if(counter)counter.textContent='';
    diagram();
  }
  window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
  window.EDUKASS_LESSONS.kalaKehaosadLesson=openLesson;
})();