(() => {
  const navigation = performance.getEntriesByType?.('navigation')?.[0];
  const isReload = navigation?.type === 'reload';
  const returnToTopState = '__edukassReturnToTop';
  const returnToTopBase = '__edukassReturnToTopBase';
  const returnToTopThreshold = 96;
  let returningToTop = false;
  let leavingPage = false;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const pageUrl = () => `${location.pathname}${location.search}`;
  const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  const finishReturnToTop = () => {
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(() => {
        resetScroll();
        returningToTop = false;
      });
    });
    window.setTimeout(() => {
      resetScroll();
      returningToTop = false;
    }, 120);
  };

  if (isReload) {
    // A manual browser refresh should reopen the homepage from the beginning.
    returningToTop = true;
    if (location.hash) {
      history.replaceState(history.state, '', pageUrl());
    }
    resetScroll();
    finishReturnToTop();
    window.addEventListener('pageshow', resetScroll, { once: true });
  }

  const armReturnToTop = () => {
    if (returningToTop || leavingPage || history.state?.[returnToTopState]) return;
    const currentState = history.state && typeof history.state === 'object' ? history.state : {};
    history.replaceState({ ...currentState, [returnToTopBase]: true }, '', pageUrl());
    history.pushState({ ...currentState, [returnToTopState]: true }, '', pageUrl());
  };

  // The guard is present before the first scroll event. Android can therefore
  // always turn the first Back press below the fold into a return to the top.
  armReturnToTop();

  // Same-page menu links scroll without adding an extra hash-history step.
  // This keeps Android Back predictable: section -> top -> leave the site.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    if (location.hash) history.replaceState(history.state, '', pageUrl());
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  window.addEventListener('pageshow', armReturnToTop);

  window.addEventListener('popstate', (event) => {
    if (leavingPage) return;

    if (window.scrollY <= returnToTopThreshold) {
      leavingPage = true;
      history.back();
      return;
    }

    returningToTop = true;
    if (location.hash) history.replaceState(event.state, '', pageUrl());
    resetScroll();
    finishReturnToTop();
    window.setTimeout(armReturnToTop, 140);
  });
})();

(() => {
  const grid = document.querySelector('.home-new-grid');
  if (!grid || grid.querySelector('[data-edukass-minu-suvi]')) return;

  const card = document.createElement('article');
  card.className = 'home-new-card home-new-game';
  card.setAttribute('data-edukass-minu-suvi', '');
  card.innerHTML = `
    <div class="home-new-card-visual home-memory-visual" aria-hidden="true">
      <span class="home-memory-card memory-blue" style="font-size:3rem">🍉</span>
      <span class="home-memory-card memory-white" style="font-size:2.8rem">☀️</span>
      <span class="home-memory-card memory-word">MINU<br>SUVI</span>
    </div>
    <div class="home-new-card-copy">
      <div class="home-card-meta">EESTI KEEL · TASUTA</div>
      <h3>Minu suvi</h3>
      <p>Ava kaart ja vasta suvistele küsimustele eesti keeles. Võid valida kaardi ise või lasta mängul üllatada.</p>
      <a class="home-text-link" href="games/minu-suvi/">Mängi kohe <span aria-hidden="true">→</span></a>
    </div>`;

  grid.prepend(card);
})();

(() => {
  const grid = document.querySelector('.home-category-grid');
  if (!grid || grid.querySelector('[data-edukass-math-category]')) return;

  const language = grid.querySelector('a[href="materials/#eesti-keel"]');
  const planning = grid.querySelector('a[href="materials/#korraldus"]');
  const skills = grid.querySelector('a[href="materials/#kaelised-oskused"]');
  const more = grid.querySelector('a[href="materials/#veel-materjale"]');
  if (!language || !planning || !skills || !more) return;

  const math = document.createElement('a');
  math.className = 'home-category-card category-math';
  math.href = 'materials/matemaatika/';
  math.setAttribute('data-edukass-math-category', '');
  math.innerHTML = `
    <span class="home-category-icon" aria-hidden="true">6 × 4</span>
    <h3>Matemaatika</h3>
    <p>Arvutamine, korrutamine ja geomeetria.</p>`;

  skills.remove();
  more.href = 'materials/';
  more.querySelector('p').textContent = 'Käelised oskused, loovus, loodusõpetus, ajalugu ja uued teemad.';

  grid.insertBefore(math, planning);
})();

(() => {
  const freshMaterials = document.querySelector('.home-new');
  const newsletter = document.querySelector('section[aria-label="EDUKASSi uudiskiri"]');
  if (!freshMaterials || !newsletter) return;

  freshMaterials.insertAdjacentElement('afterend', newsletter);
})();

(() => {
  const style = document.createElement('style');
  style.setAttribute('data-edukass-newsletter-style', '');
  style.textContent = `
    .home-page section[aria-label="EDUKASSi uudiskiri"]{
      padding:46px 0 58px!important;
      background:#fff!important;
      border-top:0!important;
    }
    .home-page section[aria-label="EDUKASSi uudiskiri"] > .container{
      position:relative;
      min-height:430px;
      display:flex;
      align-items:center;
      overflow:hidden;
      padding:34px 42px 34px 310px;
      border:1px solid #d8e7eb;
      border-radius:34px;
      background:
        radial-gradient(circle at 14% 22%,rgba(115,217,207,.42),transparent 30%),
        radial-gradient(circle at 18% 82%,rgba(255,214,92,.34),transparent 26%),
        linear-gradient(135deg,#eefaf8 0%,#f6f2ff 62%,#fff8df 100%);
      box-shadow:0 18px 44px rgba(23,54,95,.09);
    }
    .home-page section[aria-label="EDUKASSi uudiskiri"] > .container::before{
      content:"";
      position:absolute;
      z-index:1;
      left:54px;
      bottom:-12px;
      width:218px;
      height:300px;
      background:url('games/korrutamine-test/assets/edukass-cat-transparent.png') center bottom/contain no-repeat;
      filter:drop-shadow(0 14px 12px rgba(23,54,95,.18));
      pointer-events:none;
    }
    .home-page section[aria-label="EDUKASSi uudiskiri"] > .container::after{
      content:"UUDISED!";
      position:absolute;
      z-index:2;
      left:64px;
      top:42px;
      padding:8px 14px;
      border-radius:999px;
      background:#fff;
      color:#bd356c;
      font-size:.78rem;
      font-weight:900;
      letter-spacing:.1em;
      box-shadow:0 8px 18px rgba(23,54,95,.10);
      transform:rotate(-4deg);
      pointer-events:none;
    }
    .home-page section[aria-label="EDUKASSi uudiskiri"] > .container > div{
      position:relative;
      z-index:3;
      width:min(100%,640px);
      max-width:640px!important;
      margin-left:auto!important;
      margin-right:0!important;
    }
    .home-page section[aria-label="EDUKASSi uudiskiri"] .ml-form-embedWrapper{
      border:1px solid rgba(23,54,95,.08)!important;
      border-radius:26px!important;
      box-shadow:0 12px 28px rgba(23,54,95,.08)!important;
    }
    .home-page section[aria-label="EDUKASSi uudiskiri"] > .container > div > p{
      margin:14px auto 0!important;
      max-width:560px!important;
      color:#627685!important;
      font-size:.78rem!important;
      line-height:1.5!important;
      text-align:center!important;
    }
    .home-page section[aria-label="EDUKASSi uudiskiri"] > .container > div > p a{
      color:#17365f;
      font-weight:800;
    }
    @media(max-width:900px){
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container{
        min-height:0;
        padding:34px 28px;
      }
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container::before{
        left:22px;
        bottom:-8px;
        width:122px;
        height:165px;
        opacity:.20;
      }
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container::after{
        left:28px;
        top:24px;
      }
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container > div{
        margin:42px auto 0!important;
      }
    }
    @media(max-width:620px){
      .home-page section[aria-label="EDUKASSi uudiskiri"]{
        padding:30px 0 38px!important;
      }
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container{
        padding:24px 14px 20px;
        border-radius:26px;
      }
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container::before{
        display:none;
      }
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container::after{
        left:22px;
        top:20px;
      }
      .home-page section[aria-label="EDUKASSi uudiskiri"] > .container > div{
        margin-top:42px!important;
      }
    }
  `;
  document.head.appendChild(style);
})();
