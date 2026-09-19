(() => {
  const PDF_URL = '/downloads/tunniplaanid-10-varviline.pdf';
  const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll, { once: true });
  } else {
    renderAll();
  }
})();