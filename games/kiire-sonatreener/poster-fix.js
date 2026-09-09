(()=>{
  const POSTER=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1260" role="img" aria-label="Vesi ja jõgi — учебный плакат" style="display:block;width:100%;height:auto;max-width:100%;border-radius:22px;background:#fffdf7">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e6f6ff"/><stop offset="1" stop-color="#f7fbef"/></linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#82d7ee"/><stop offset="1" stop-color="#2c91bd"/></linearGradient>
  </defs>
  <rect width="900" height="1260" rx="28" fill="#fffdf7"/>
  <text x="450" y="85" text-anchor="middle" font-family="Georgia,serif" font-size="64" font-weight="700" fill="#234f48">Vesi ja jõgi</text>
  <text x="450" y="125" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="#6d756f">Loodusõpetus</text>

  <g font-family="Arial,sans-serif">
    <g transform="translate(45 165)"><rect width="250" height="220" rx="24" fill="#fff" stroke="#d5e2d8" stroke-width="3"/><text x="125" y="48" text-anchor="middle" font-size="34" font-weight="700" fill="#2f6f58">veekogu</text><text x="125" y="80" text-anchor="middle" font-size="20" fill="#6d756f">водоём</text><ellipse cx="125" cy="150" rx="82" ry="40" fill="url(#water)"/><path d="M35 170 Q75 120 115 150 T215 145" fill="#5d8d55" opacity=".8"/></g>
    <g transform="translate(325 165)"><rect width="250" height="220" rx="24" fill="#fff" stroke="#d5e2d8" stroke-width="3"/><text x="125" y="48" text-anchor="middle" font-size="34" font-weight="700" fill="#2f6f58">magevesi</text><text x="125" y="80" text-anchor="middle" font-size="20" fill="#6d756f">пресная вода</text><path d="M125 105 C92 151 80 173 80 191 C80 217 99 235 125 235 C151 235 170 217 170 191 C170 173 158 151 125 105Z" fill="#bceeff" stroke="#42a8cf" stroke-width="5"/></g>
    <g transform="translate(605 165)"><rect width="250" height="220" rx="24" fill="#fff" stroke="#d5e2d8" stroke-width="3"/><text x="125" y="48" text-anchor="middle" font-size="34" font-weight="700" fill="#2f6f58">jõgi</text><text x="125" y="80" text-anchor="middle" font-size="20" fill="#6d756f">река</text><path d="M105 103 C155 140 92 165 132 190 C158 205 178 216 190 220 L80 220 C89 198 107 180 95 163 C78 140 83 120 105 103Z" fill="url(#water)"/><path d="M30 210 Q70 150 110 180 T220 160 V220 H30Z" fill="#679458" opacity=".75"/></g>
  </g>

  <g transform="translate(45 430)">
    <rect width="810" height="760" rx="30" fill="url(#sky)" stroke="#d5e2d8" stroke-width="3"/>
    <path d="M0 250 L115 105 L220 210 L350 75 L470 205 L600 110 L710 200 L810 95 V350 H0Z" fill="#92a8a0"/>
    <path d="M0 315 Q140 260 280 305 T540 295 T810 270 V760 H0Z" fill="#56824f"/>
    <path d="M350 110 C315 175 385 205 345 260 C300 320 245 330 270 390 C296 450 430 430 400 500 C365 570 315 605 350 665 C385 720 510 700 565 760 L760 760 C720 650 575 615 510 565 C455 525 550 475 545 420 C540 360 430 350 450 295 C468 245 520 215 495 170 C470 125 420 115 420 110Z" fill="url(#water)" stroke="#d9f8ff" stroke-width="8"/>
    <path d="M675 315 C625 330 585 355 540 395" stroke="#50afd1" stroke-width="34" fill="none" stroke-linecap="round"/>

    <g font-family="Arial,sans-serif">
      <g transform="translate(245 115)"><rect width="190" height="82" rx="18" fill="#fffdf8" stroke="#cbdad0" stroke-width="2"/><text x="95" y="34" text-anchor="middle" font-size="29" font-weight="700" fill="#2f6f58">jõelähe</text><text x="95" y="62" text-anchor="middle" font-size="18" fill="#6d756f">исток реки</text></g>
      <path d="M340 197 L345 240" stroke="#315f58" stroke-width="4"/>

      <g transform="translate(570 285)"><rect width="175" height="82" rx="18" fill="#fffdf8" stroke="#cbdad0" stroke-width="2"/><text x="88" y="34" text-anchor="middle" font-size="29" font-weight="700" fill="#2f6f58">lisajõgi</text><text x="88" y="62" text-anchor="middle" font-size="18" fill="#6d756f">приток</text></g>
      <path d="M590 368 L552 400" stroke="#315f58" stroke-width="4"/>

      <g transform="translate(245 425)"><rect width="185" height="82" rx="18" fill="#fffdf8" stroke="#cbdad0" stroke-width="2"/><text x="92" y="34" text-anchor="middle" font-size="29" font-weight="700" fill="#2f6f58">jõesäng</text><text x="92" y="62" text-anchor="middle" font-size="18" fill="#6d756f">русло реки</text></g>
      <path d="M360 507 L405 545" stroke="#315f58" stroke-width="4"/>

      <g transform="translate(570 610)"><rect width="185" height="82" rx="18" fill="#fffdf8" stroke="#cbdad0" stroke-width="2"/><text x="92" y="34" text-anchor="middle" font-size="29" font-weight="700" fill="#2f6f58">jõesuue</text><text x="92" y="62" text-anchor="middle" font-size="18" fill="#6d756f">устье реки</text></g>
      <path d="M610 692 L580 735" stroke="#315f58" stroke-width="4"/>
    </g>
  </g>
</svg>`;

  async function clearOld(){
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r=>r.unregister()));
      }
      if(window.caches){
        const keys=await caches.keys();
        await Promise.all(keys.filter(k=>k.startsWith('edukass-sonatreener')).map(k=>caches.delete(k)));
      }
    }catch(e){}
  }

  function apply(){
    document.querySelectorAll('img[src*="poster-"]').forEach(img=>{
      if(img.dataset.inlinePoster==='1')return;
      const wrap=document.createElement('div');
      wrap.className='inline-simple-poster';
      wrap.style.width='100%';
      wrap.style.maxWidth='100%';
      wrap.style.overflow='hidden';
      wrap.innerHTML=POSTER;
      img.dataset.inlinePoster='1';
      img.replaceWith(wrap);
    });
  }

  clearOld().then(apply);
  const card=document.getElementById('card');
  if(card)new MutationObserver(apply).observe(card,{childList:true,subtree:true});
  apply();
})();
