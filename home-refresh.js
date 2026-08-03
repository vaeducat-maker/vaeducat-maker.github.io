(() => {
  const navigation = performance.getEntriesByType?.('navigation')?.[0];
  const isReload = navigation?.type === 'reload';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (!isReload) return;

  // A manual browser refresh should reopen the homepage from the beginning.
  if (location.hash) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }

  const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  resetScroll();
  requestAnimationFrame(() => {
    resetScroll();
    requestAnimationFrame(resetScroll);
  });
  window.addEventListener('pageshow', resetScroll, { once: true });
  window.setTimeout(resetScroll, 120);
})();
