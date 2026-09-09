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
  const nav = document.querySelector('.home-nav');
  if (!nav || nav.querySelector('[data-edukass-socials]')) return;

  const style = document.createElement('style');
  style.textContent = `
    .home-socials{display:inline-flex;align-items:center;gap:7px;margin-left:2px}
    .home-socials a{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;border-radius:50%;color:var(--home-navy);text-decoration:none;transition:transform .15s ease,background .15s ease}
    .home-socials a:hover{transform:translateY(-1px);background:rgba(23,54,95,.08);text-decoration:none}
    .home-socials svg{width:20px;height:20px;display:block}
    @media(max-width:620px){
      .home-nav{gap:8px}
      .home-socials{gap:4px;margin-left:0}
      .home-socials a{width:24px;height:24px}
      .home-socials svg{width:18px;height:18px}
    }
  `;
  document.head.append(style);

  const socials = document.createElement('span');
  socials.className = 'home-socials';
  socials.setAttribute('data-edukass-socials', '');
  socials.setAttribute('aria-label', 'EDUKASS sotsiaalmeedias');
  socials.innerHTML = `
    <a href="https://www.facebook.com/share/1GH4qbcNqL/" target="_blank" rel="noopener noreferrer" aria-label="EDUKASS Facebookis" title="Facebook">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.7 22v-8.5h2.9l.43-3.32H13.7V8.06c0-.96.27-1.62 1.66-1.62h1.78V3.47a23.8 23.8 0 0 0-2.59-.14c-2.56 0-4.31 1.56-4.31 4.42v2.43H7.35v3.32h2.89V22h3.46Z"/></svg>
    </a>
    <a href="https://www.instagram.com/edukass.ee/" target="_blank" rel="noopener noreferrer" aria-label="EDUKASS Instagramis" title="Instagram">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
    </a>`;

  nav.append(socials);
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
