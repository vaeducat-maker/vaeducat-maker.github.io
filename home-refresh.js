(() => {
  const navigation = performance.getEntriesByType?.('navigation')?.[0];
  const isReload = navigation?.type === 'reload';
  const returnToTopState = '__edukassReturnToTop';
  const returnToTopThreshold = 96;
  let returnEntryActive = Boolean(history.state?.[returnToTopState]);
  let returningToTop = false;

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
    if (returnEntryActive || returningToTop || window.scrollY <= returnToTopThreshold) return;
    const currentState = history.state && typeof history.state === 'object' ? history.state : {};
    history.pushState({ ...currentState, [returnToTopState]: true }, '', pageUrl());
    returnEntryActive = true;
  };

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
    window.setTimeout(armReturnToTop, 0);
  });

  window.addEventListener('scroll', armReturnToTop, { passive: true });
  window.addEventListener('pageshow', armReturnToTop);

  window.addEventListener('popstate', (event) => {
    if (!returnEntryActive) {
      returnEntryActive = Boolean(event.state?.[returnToTopState]);
      return;
    }

    returnEntryActive = false;
    returningToTop = true;
    if (location.hash) history.replaceState(event.state, '', pageUrl());
    resetScroll();
    finishReturnToTop();
  });
})();
