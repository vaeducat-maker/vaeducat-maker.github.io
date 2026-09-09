(()=>{
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1300" viewBox="0 0 900 1300">
<defs>
  <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fffef9"/><stop offset="1" stop-color="#f8f4e9"/></linearGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dff3fb"/><stop offset=".58" stop-color="#edf6e6"/><stop offset="1" stop-color="#dceacb"/></linearGradient>
  <linearGradient id="river" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8dd9ee"/><stop offset=".45" stop-color="#4cb2d4"/><stop offset="1" stop-color="#2385b4"/></linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#27483d" flood-opacity=".15"/></filter>
  <pattern id="papergrain" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="4" r="1" fill="#d7d3c6" opacity=".12"/><circle cx="11" cy="12" r=".8" fill="#c9c3b3" opacity=".1"/></pattern>
  <style>
    .title{font-family:Georgia,'Times New Roman',serif;font-weight:700;fill:#133e4b}
    .sans{font-family:Arial,Helvetica,sans-serif}
    .label{font-family:Arial,Helvetica,sans-serif;font-weight:700;fill:#163f38}
    .ru{font-family:Arial,Helvetica,sans-serif;font-size:17px;fill:#5d655f}
    .tag{fill:#fffef9;stroke:#d5dfd4;stroke-width:2.5}
  </style>
  <g id="pine"><path d="M0 0 L-10 22 H-4 L-14 40 H-6 L-18 60 H18 L6 40 H14 L4 22 H10Z" fill="#315f43"/><rect x="-2" y="60" width="4" height="10" fill="#7a5c3a"/></g>
  <g id="pine2"><path d="M0 0 L-8 18 H-3 L-12 33 H-5 L-15 50 H15 L5 33 H12 L3 18 H8Z" fill="#48784e"/><rect x="-2" y="50" width="4" height="8" fill="#7a5c3a"/></g>
</defs>
<rect width="900" height="1300" rx="30" fill="url(#paper)"/>
<rect width="900" height="1300" rx="30" fill="url(#papergrain)"/>
<g transform="translate(0 10)">
  <path d="M85 72 q22 -30 44 -5 q20 -24 42 4 q-18 -4 -31 7 q-18 16 -34 12 q-18 -5 -21 -18z" fill="#fff" stroke="#8ea8ad" stroke-width="2.5"/>
  <path d="M95 67 l-32 -15 m34 16 l-26 9" stroke="#718a8e" stroke-width="2" stroke-linecap="round"/>
  <circle cx="775" cy="66" r="28" fill="#f6cc54" opacity=".95"/>
  <g stroke="#f0bf37" stroke-width="4" stroke-linecap="round"><path d="M775 23v-16"/><path d="M775 125v-16"/><path d="M732 66h-17"/><path d="M835 66h-17"/><path d="M744 35l-12-12"/><path d="M806 97l12 12"/><path d="M806 35l12-12"/><path d="M744 97l-12 12"/></g>
  <text x="450" y="74" text-anchor="middle" class="title" font-size="64">Vesi ja jõgi</text>
  <text x="450" y="112" text-anchor="middle" class="sans" font-size="22" fill="#66726d">Loodusõpetus</text>
  <path d="M253 123 C330 142 570 142 648 123" fill="none" stroke="#5f8661" stroke-width="3"/>
</g>
<g filter="url(#shadow)">
  <rect x="42" y="155" width="246" height="220" rx="26" fill="#f8fcf6" stroke="#d4e3d5" stroke-width="2"/>
  <rect x="327" y="155" width="246" height="220" rx="26" fill="#f6fbfd" stroke="#d6e4e9" stroke-width="2"/>
  <rect x="612" y="155" width="246" height="220" rx="26" fill="#fbfcf6" stroke="#dfe4cf" stroke-width="2"/>
</g>
<text x="165" y="194" text-anchor="middle" class="label" font-size="31">veekogu</text>
<text x="450" y="194" text-anchor="middle" class="label" font-size="31">magevesi</text>
<text x="735" y="194" text-anchor="middle" class="label" font-size="31">jõgi</text>
<path d="M72 273 q48 -58 100 -24 q46 -46 88 11 v76 H72z" fill="#9ec7a0"/>
<path d="M78 285 q63 -25 126 -3 q38 13 72 -2 v55 H78z" fill="url(#river)"/>
<path d="M87 298 q43 -11 86 0 q42 10 86 -2" fill="none" stroke="#d7f5ff" stroke-width="5" opacity=".8"/>
<g transform="translate(94 248) scale(.55)"><use href="#pine"/></g><g transform="translate(119 245) scale(.46)"><use href="#pine2"/></g><g transform="translate(246 252) scale(.5)"><use href="#pine"/></g>
<text x="165" y="353" text-anchor="middle" class="ru">водоём</text>
<path d="M450 214 C420 260 395 289 395 320 a55 55 0 0 0 110 0 c0-31-25-60-55-106z" fill="url(#river)" stroke="#2c90b7" stroke-width="3"/>
<path d="M428 288 q20 -20 44 0" fill="none" stroke="#d8f6ff" stroke-width="6" stroke-linecap="round"/>
<path d="M389 331 q61 25 122 0" fill="none" stroke="#8ccfe7" stroke-width="4"/>
<text x="450" y="353" text-anchor="middle" class="ru">пресная вода</text>
<path d="M635 329 C675 277 695 303 716 265 C743 215 781 220 831 194" fill="none" stroke="#56b4d4" stroke-width="34" stroke-linecap="round"/>
<path d="M635 329 C675 277 695 303 716 265 C743 215 781 220 831 194" fill="none" stroke="#d9f6ff" stroke-width="8" stroke-linecap="round" opacity=".9"/>
<g transform="translate(648 236) scale(.55)"><use href="#pine"/></g><g transform="translate(802 258) scale(.5)"><use href="#pine2"/></g><g transform="translate(785 205) scale(.36)"><use href="#pine"/></g>
<text x="735" y="353" text-anchor="middle" class="ru">река</text>
<g filter="url(#shadow)"><rect x="42" y="408" width="816" height="820" rx="30" fill="url(#sky)" stroke="#d3dfd5" stroke-width="2.5"/></g>
<path d="M45 592 L128 495 L186 552 L256 470 L333 555 L405 500 L469 566 L540 507 L607 558 L681 498 L750 553 L858 468 L858 640 L45 640Z" fill="#7693a0" opacity=".85"/>
<path d="M45 615 L128 535 L194 594 L270 520 L338 590 L411 545 L482 607 L560 547 L634 596 L708 548 L775 593 L858 520 L858 666 L45 666Z" fill="#91a9a6" opacity=".9"/>
<path d="M110 516 l18 -21 l17 24 l18 -10 l18 22" fill="none" stroke="#f6f9f7" stroke-width="7" stroke-linejoin="round"/>
<path d="M239 497 l17 -27 l18 31 l19 -12 l18 28" fill="none" stroke="#f6f9f7" stroke-width="7" stroke-linejoin="round"/>
<path d="M45 636 Q160 570 275 635 T505 630 T858 630 V920 H45Z" fill="#82a56f"/>
<path d="M45 700 Q190 620 330 690 T610 680 T858 670 V955 H45Z" fill="#5f8b59" opacity=".8"/>
<path d="M150 600 C250 625 332 572 390 615 C445 656 420 706 487 753 C548 796 604 781 648 829 C687 872 670 920 731 966 C769 994 805 1007 842 1020" fill="none" stroke="#2b83b0" stroke-width="98" stroke-linecap="round"/>
<path d="M150 600 C250 625 332 572 390 615 C445 656 420 706 487 753 C548 796 604 781 648 829 C687 872 670 920 731 966 C769 994 805 1007 842 1020" fill="none" stroke="url(#river)" stroke-width="74" stroke-linecap="round"/>
<path d="M150 600 C250 625 332 572 390 615 C445 656 420 706 487 753 C548 796 604 781 648 829 C687 872 670 920 731 966 C769 994 805 1007 842 1020" fill="none" stroke="#d8f6ff" stroke-width="8" stroke-linecap="round" opacity=".65"/>
<path d="M206 770 C260 746 295 730 337 705 C360 691 379 670 396 650" fill="none" stroke="#3095bd" stroke-width="42" stroke-linecap="round"/>
<path d="M206 770 C260 746 295 730 337 705 C360 691 379 670 396 650" fill="none" stroke="#9de0ef" stroke-width="18" stroke-linecap="round"/>
<g opacity=".96">
<g transform="translate(72 630) scale(.75)"><use href="#pine"/></g><g transform="translate(105 652) scale(.62)"><use href="#pine2"/></g><g transform="translate(132 676) scale(.83)"><use href="#pine"/></g><g transform="translate(171 692) scale(.62)"><use href="#pine2"/></g><g transform="translate(244 635) scale(.72)"><use href="#pine"/></g><g transform="translate(282 654) scale(.62)"><use href="#pine2"/></g><g transform="translate(318 628) scale(.78)"><use href="#pine"/></g><g transform="translate(512 635) scale(.82)"><use href="#pine"/></g><g transform="translate(550 655) scale(.58)"><use href="#pine2"/></g><g transform="translate(585 620) scale(.78)"><use href="#pine"/></g><g transform="translate(625 643) scale(.66)"><use href="#pine2"/></g><g transform="translate(703 632) scale(.72)"><use href="#pine"/></g><g transform="translate(745 650) scale(.61)"><use href="#pine2"/></g><g transform="translate(795 626) scale(.77)"><use href="#pine"/></g><g transform="translate(82 852) scale(.85)"><use href="#pine"/></g><g transform="translate(125 880) scale(.62)"><use href="#pine2"/></g><g transform="translate(166 842) scale(.72)"><use href="#pine"/></g><g transform="translate(278 860) scale(.78)"><use href="#pine"/></g><g transform="translate(330 885) scale(.58)"><use href="#pine2"/></g><g transform="translate(470 900) scale(.82)"><use href="#pine"/></g><g transform="translate(520 928) scale(.58)"><use href="#pine2"/></g>
</g>
<path d="M145 555 q16 14 32 0" fill="none" stroke="#fff" stroke-width="8"/><path d="M150 560 C158 573 158 587 150 602" fill="none" stroke="#d8f6ff" stroke-width="12" stroke-linecap="round"/>
<path d="M785 1000 q50 28 73 20 q-36 21-96 28" fill="#4ba2c3" opacity=".9"/>
<g filter="url(#shadow)"><rect x="74" y="520" width="180" height="70" rx="18" class="tag"/><rect x="168" y="745" width="168" height="70" rx="18" class="tag"/><rect x="350" y="670" width="180" height="70" rx="18" class="tag"/><rect x="596" y="844" width="180" height="70" rx="18" class="tag"/></g>
<text x="164" y="550" text-anchor="middle" class="label" font-size="28">jõelähe</text><text x="164" y="575" text-anchor="middle" class="ru">исток реки</text>
<text x="252" y="775" text-anchor="middle" class="label" font-size="28">lisajõgi</text><text x="252" y="800" text-anchor="middle" class="ru">приток</text>
<text x="440" y="700" text-anchor="middle" class="label" font-size="28">jõesäng</text><text x="440" y="725" text-anchor="middle" class="ru">русло реки</text>
<text x="686" y="874" text-anchor="middle" class="label" font-size="28">jõesuue</text><text x="686" y="899" text-anchor="middle" class="ru">устье реки</text>
<g stroke="#315f58" stroke-width="4" fill="none" stroke-linecap="round"><path d="M152 590 l18 10"/><path d="M284 815 l32 -48"/><path d="M448 740 l8 28"/><path d="M742 915 l36 54"/></g>
<g transform="translate(90 1080)"><ellipse cx="0" cy="0" rx="30" ry="18" fill="#1f6e8c"/><ellipse cx="-18" cy="-10" rx="17" ry="13" fill="#e38d35"/><path d="M12 -2 q22 -18 32 -3 q-17 1-28 12" fill="#174d63"/><circle cx="-24" cy="-14" r="2.7" fill="#fff"/><path d="M-34 -13 l-12 4 l12 4z" fill="#d3a13c"/></g>
<g fill="#fff" stroke="#d8d7cc" stroke-width="1"><circle cx="130" cy="1115" r="6"/><circle cx="150" cy="1135" r="5"/><circle cx="175" cy="1117" r="6"/></g><g fill="#f2c957"><circle cx="130" cy="1115" r="2"/><circle cx="150" cy="1135" r="2"/><circle cx="175" cy="1117" r="2"/></g>
<text x="450" y="1265" text-anchor="middle" class="sans" font-size="18" letter-spacing="3" fill="#668176">EDUKASS</text>
</svg>`;
function fix(){document.querySelectorAll('img[src*="poster-vesi-ja-jogi"]').forEach(img=>{if(img.dataset.inlinePoster)return;const box=document.createElement('div');box.className='poster-inline';box.dataset.inlinePoster='1';box.innerHTML=svg;img.replaceWith(box);});}
const card=document.getElementById('card');if(card)new MutationObserver(fix).observe(card,{childList:true,subtree:true});fix();
})();
