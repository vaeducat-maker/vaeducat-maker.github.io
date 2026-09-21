(() => {
  const PDF_URL = '/downloads/tunniplaanid-10-varviline.pdf';
  const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  function publishKosmos() {
    const newGrid = document.querySelector('.home-new-grid');
    if (newGrid && !newGrid.querySelector('[data-kosmos-material]')) {
      const card = document.createElement('article');
      card.className = 'home-new-card home-new-material';
      card.setAttribute('data-kosmos-material', '');
      card.innerHTML = `<div class="home-new-card-visual"><img src="/materials/loikamine-kosmos-preview/leht-12.webp" alt="30 päeva lõikamist: Kosmos — töölehekomplekti eelvaade"></div><div class="home-new-card-copy"><div class="home-card-meta">KÄELISED OSKUSED · 30 TÖÖLEHTE · TASUTA</div><h3>30 päeva lõikamist: Kosmos</h3><p>30 kosmoseteemalist A4-töölehte mööda punktiirjoont lõikamise harjutamiseks.</p><a class="home-text-link" href="/materials/loikamine-kosmos/">Vaata materjali <span aria-hidden="true">→</span></a></div>`;
      newGrid.prepend(card);
      while (newGrid.children.length > 5) newGrid.lastElementChild.remove();
    }

    const skillsGrid = document.querySelector('#kaelised-oskused .category-material-grid');
    if (skillsGrid && !skillsGrid.querySelector('[data-kosmos-material]')) {
      const tile = document.createElement('article');
      tile.className = 'material-tile catalog-tile';
      tile.setAttribute('data-kosmos-material', '');
      tile.innerHTML = `<a class="catalog-image-link" href="loikamine-kosmos/"><img src="loikamine-kosmos-preview/leht-12.webp" alt="30 päeva lõikamist: Kosmos — töölehekomplekti eelvaade"></a><div class="material-tile-body"><div class="meta skills-meta">KÄELISED OSKUSED · 30 TÖÖLEHTE · TASUTA</div><h3>30 päeva lõikamist: Kosmos</h3><p>30 kosmoseteemalist A4-töölehte mööda punktiirjoont lõikamise harjutamiseks.</p><a class="text-link" href="loikamine-kosmos/">Vaata materjali →</a></div>`;
      skillsGrid.prepend(tile);
    }
  }

  async function renderAll() {
    const roots = [...document.querySelectorAll('[data-timetable-pdf-preview]')];
    if (!roots.length) return;

    if (!window.pdfjsLib) {
      roots.forEach(root => root.classList.add('timetable-preview-fallback'));
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

    let pdf;
    try {
      pdf = await pdfjsLib.getDocument({ url: PDF_URL }).promise;
    } catch (error) {
      console.error('EDUKASS timetable preview: PDF load failed', error);
      roots.forEach(root => root.classList.add('timetable-preview-fallback'));
      return;
    }

    for (const root of roots) {
      const wanted = (root.dataset.pages || '1,2,3,4,5,6,7,8,9,10')
        .split(',')
        .map(v => Number(v.trim()))
        .filter(v => Number.isInteger(v) && v > 0 && v <= pdf.numPages);

      root.innerHTML = '';

      for (const pageNumber of wanted) {
        const frame = document.createElement('span');
        frame.className = 'timetable-pdf-sheet';
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-label', `Tunniplaani kujundus ${pageNumber}`);
        frame.appendChild(canvas);
        root.appendChild(frame);

        try {
          const page = await pdf.getPage(pageNumber);
          const base = page.getViewport({ scale: 1 });
          const targetWidth = root.classList.contains('timetable-preview-large') ? 260 : 180;
          const scale = targetWidth / base.width;
          const viewport = page.getViewport({ scale });
          const ratio = Math.min(window.devicePixelRatio || 1, 2);

          canvas.width = Math.round(viewport.width * ratio);
          canvas.height = Math.round(viewport.height * ratio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          const ctx = canvas.getContext('2d', { alpha: false });
          await page.render({
            canvasContext: ctx,
            viewport,
            transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null
          }).promise;
        } catch (error) {
          console.error('EDUKASS timetable preview: page render failed', pageNumber, error);
          frame.classList.add('timetable-pdf-sheet-error');
        }
      }

      root.classList.add('is-ready');
    }
  }

  function init() {
    publishKosmos();
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();