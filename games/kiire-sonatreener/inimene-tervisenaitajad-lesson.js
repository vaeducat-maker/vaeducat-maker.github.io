(function inimeneTervisenaitajadLesson() {
  window.EDUKASS_LESSONS = window.EDUKASS_LESSONS || {};
  const card = document.getElementById('card');
  const pill = document.getElementById('pill');
  const sub = document.getElementById('sub');
  const restart = document.getElementById('restart');
  const libraryBtn = document.getElementById('libraryBtn');
  if (!card || !libraryBtn) return;

  // Every answer is marked by **...** in both languages.
  const PAIRS = [
    {
      et: 'Mõõdetavad tervisenäitajad, mida saab kodustes tingimustes kontrollida, on **pikkus**, **kehakaal** ja **pulss**.',
      ru: 'Измеряемые показатели здоровья, которые можно проверить дома, — это **рост**, **вес** и **пульс**.'
    },
    {
      et: 'Pulsi alusel on võimalik kontrollida **südame tööd**.',
      ru: 'По пульсу можно проверить **работу сердца**.'
    },
    {
      et: 'Pulssi mõõdetakse tavaliselt **randmelt**.',
      ru: 'Пульс обычно измеряют **на запястье**.'
    },
    {
      et: '10–12-aastase lapse süda lööb puhkeolekus **70–80** korda minutis.',
      ru: 'Сердце ребёнка 10–12 лет в состоянии покоя бьётся **70–80** раз в минуту.'
    },
    {
      et: 'Treenitud inimese süda lööb rahuolekus **vähem** kordi kui treenimata isikul.',
      ru: 'У тренированного человека сердце в покое бьётся **реже**, чем у нетренированного.'
    },
    {
      et: 'Südame löögisagedus rahuolekus on **treenituse** näitaja.',
      ru: 'Частота сердцебиения в покое — показатель **тренированности**.'
    },
    {
      et: 'Südame löögisageduse suurenemine viitab **haigusele** või ebapiisavale **taastumisele** treeningute järel.',
      ru: 'Учащение сердцебиения может указывать на **болезнь** или недостаточное **восстановление** после тренировок.'
    }
  ];

  // Selected vocabulary is shown in dictionary form on flashcards (both directions).
  const WORDS = [
      [
          "tervisenäitaja",
          "показатель здоровья"
      ],
      [
          "tingimus",
          "условие"
      ],
      [
          "pikkus",
          "рост, длина"
      ],
      [
          "kehakaal",
          "вес тела"
      ],
      [
          "pulss",
          "пульс"
      ],
      [
          "süda",
          "сердце"
      ],
      [
          "mõõtma",
          "измерять"
      ],
      [
          "ranne",
          "запястье"
      ],
      [
          "puhkeolek",
          "состояние покоя"
      ],
      [
          "rahuolek",
          "состояние покоя"
      ],
      [
          "treenimata",
          "нетренированный"
      ],
      [
          "näitaja",
          "показатель"
      ],
      [
          "suurenemine",
          "увеличение, повышение"
      ],
      [
          "koormus",
          "нагрузка"
      ],
      [
          "päevakava",
          "режим дня"
      ]
  ];

  const tabEt = document.getElementById('tabEt');
  const tabDe = document.getElementById('tabDe');
  const reviewBtn = document.getElementById('reviewBtn');
  const counter = document.getElementById('counter');
  let mode = 'lesson';
  let direction = 'et-ru';
  let queue = [];
  let correct = 0;
  let retry = 0;
  let flipped = false;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function lock(isLocked) {
    if (tabEt) tabEt.disabled = isLocked;
    if (tabDe) tabDe.disabled = isLocked;
    libraryBtn.hidden = isLocked;
    if (reviewBtn) reviewBtn.hidden = true;
  }

  const style = document.createElement('style');
  style.textContent = `
    .tervis2-lesson{display:grid;gap:16px;max-width:820px;margin:0 auto}
    .tervis2-lesson h2{color:#2f6f58;margin:5px 0 6px}
    .tervis2-lesson p{margin:0}
    .tervis2-list{display:grid;gap:12px}
    .tervis2-pair{padding:15px 16px;background:#fff;border:1px solid #dfe8e2;border-radius:14px;line-height:1.55}
    .tervis2-et{font-size:17px;color:#1f332a}
    .tervis2-ru{font-size:15px;color:#55645d;margin-top:9px!important;padding-top:9px;border-top:1px dashed #e0e8e2}
    .tervis2-answer{font-weight:900;color:#215a41}
    .tervis2-vocab{display:grid;gap:8px}
    .tervis2-word{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:center;padding:11px 13px;background:#fff;border:1px solid #dfe8e2;border-radius:12px}
    .tervis2-word strong{color:#215a41;overflow-wrap:anywhere}
    .tervis2-word span{color:#55645d;overflow-wrap:anywhere}
    .tervis2-section-title{margin:0;color:#2f6f58;font-size:19px}
    .tervis2-flash-text{font-size:clamp(22px,6vw,34px);font-weight:850;text-align:center;overflow-wrap:anywhere}
    .tervis2-flash-note{text-align:center;color:#55645d;font-size:14px}
    @media(max-width:560px){.tervis2-pair{padding:12px}.tervis2-et{font-size:16px}.tervis2-ru{font-size:14px}.tervis2-word{padding:9px 10px;font-size:14px}}
  `;
  document.head.appendChild(style);

  function esc(text) {
    return String(text).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    })[c]);
  }
  function emphasize(text) {
    return text.split(/(\*\*[^*]+\*\*)/g).map(part =>
      part.startsWith('**') && part.endsWith('**')
        ? '<strong class="tervis2-answer">' + esc(part.slice(2, -2)) + '</strong>'
        : esc(part)
    ).join('');
  }
  function renderLesson() {
    mode = 'lesson';
    lock(false);
    if (restart) restart.hidden = true;
    if (counter) counter.textContent = '';
    if (pill) pill.textContent = '👤 Inimeseõpetus';
    if (sub) sub.textContent = 'Урок 2 · Tervisenäitajad · 15 карточек · задание A';
    card.innerHTML = '<div class="tervis2-lesson">' +
      '<div class="topic-intro"><div class="topic-kicker">👤 Inimeseõpetus · Урок 2</div>' +
      '<h2>Tervisenäitajad</h2><p><strong>A. Täida lüngad.</strong> — Заполни пропуски.</p>' +
      '<p class="tiny">Ответы выделены жирным на эстонском и русском языках.</p></div>' +
      '<div class="tervis2-list">' + PAIRS.map((pair, index) =>
        '<section class="tervis2-pair" aria-label="Предложение ' + (index + 1) + '">' +
          '<p class="tervis2-et" lang="et">' + emphasize(pair.et) + '</p>' +
          '<p class="tervis2-ru" lang="ru">' + emphasize(pair.ru) + '</p>' +
        '</section>'
      ).join('') + '</div>' +
      '<section class="tervis2-lesson" aria-label="Словарь"><h3 class="tervis2-section-title">📚 Sõnad · 15 sõna</h3>' +
      '<div class="tervis2-vocab">' + WORDS.map(([et, ru]) =>
        '<div class="tervis2-word"><strong lang="et">' + esc(et) + '</strong><span lang="ru">' + esc(ru) + '</span></div>'
      ).join('') + '</div>' +
      '<div class="topic-actions">' +
        '<button class="primary" id="tervis2EtRu">🃏 Eesti → русский</button>' +
        '<button class="secondary" id="tervis2RuEt">🃏 Русский → Eesti</button>' +
      '</div></section>' +
      '<button class="secondary" type="button" id="tervis2Back">← К предметам</button>' +
      '</div>';
    card.querySelector('#tervis2EtRu').onclick = () => start('et-ru');
    card.querySelector('#tervis2RuEt').onclick = () => start('ru-et');
    const back = card.querySelector('#tervis2Back');
    if (back) back.onclick = () => libraryBtn.click();
  }

  function start(nextDirection) {
    direction = nextDirection;
    mode = 'cards';
    queue = shuffle(WORDS);
    correct = 0;
    retry = 0;
    flipped = false;
    lock(true);
    if (restart) {
      restart.hidden = false;
      restart.textContent = '← К уроку';
    }
    if (pill) pill.textContent = '👤 Tervisenäitajad';
    if (sub) sub.textContent = direction === 'et-ru' ? 'Карточки: Eesti → русский' : 'Карточки: Русский → Eesti';
    renderCard();
  }

  function renderCard() {
    if (!queue.length) { finish(); return; }
    const [et, ru] = queue[0];
    const front = direction === 'et-ru' ? et : ru;
    const back = direction === 'et-ru' ? ru : et;
    flipped = false;
    if (counter) counter.textContent = 'Осталось: ' + queue.length;
    card.innerHTML =
      '<div class="review-wrap">' +
        '<p class="tervis2-flash-note">' + (direction === 'et-ru' ? 'Eesti → русский' : 'Русский → Eesti') + '</p>' +
        '<div class="flashcard" id="tervis2Flash" role="button" tabindex="0" aria-label="Показать перевод">' +
          '<div class="flashcard-inner">' +
            '<div class="flash-face"><div class="tervis2-flash-text">' + esc(front) + '</div></div>' +
            '<div class="flash-face flash-back"><div class="tervis2-flash-text">' + esc(back) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="review-stats"><span>✓ ' + correct + '</span><span>✕ ' + retry + '</span></div>' +
        '<div class="review-actions" id="tervis2Actions" hidden>' +
          '<button class="review-no" id="tervis2No" aria-label="Повторить">✕</button>' +
          '<button class="review-yes" id="tervis2Yes" aria-label="Знаю">✓</button>' +
        '</div>' +
        '<p class="tervis2-flash-note">Нажми на карточку, чтобы открыть перевод</p>' +
      '</div>';
    const flash = card.querySelector('#tervis2Flash');
    const actions = card.querySelector('#tervis2Actions');
    function flip() {
      if (flipped) return;
      flipped = true;
      flash.classList.add('flipped');
      actions.hidden = false;
    }
    flash.onclick = flip;
    flash.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    };
    card.querySelector('#tervis2Yes').onclick = () => decide(true);
    card.querySelector('#tervis2No').onclick = () => decide(false);
  }

  function decide(known) {
    const word = queue.shift();
    if (!word) return;
    if (known) correct++;
    else {
      retry++;
      queue.splice(Math.min(2, queue.length), 0, word);
    }
    renderCard();
  }

  function finish() {
    mode = 'done';
    lock(false);
    if (restart) restart.hidden = true;
    if (counter) counter.textContent = '';
    if (pill) pill.textContent = 'Готово';
    if (sub) sub.textContent = 'Tervisenäitajad · 15 карточек';
    card.innerHTML =
      '<div class="done"><div class="big">🃏</div><h2>Готово!</h2>' +
      '<p>Все 15 слов повторены. Возвратов к карточкам: ' + retry + '</p>' +
      '<div class="finish-actions">' +
      '<button class="primary" id="tervis2Again">Ещё раз</button>' +
      '<button class="secondary" id="tervis2ToLesson">К уроку</button>' +
      '</div></div>';
    card.querySelector('#tervis2Again').onclick = () => start(direction);
    card.querySelector('#tervis2ToLesson').onclick = renderLesson;
  }

  if (restart) restart.addEventListener('click', event => {
    if (mode !== 'cards') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    renderLesson();
  }, true);

  window.EDUKASS_LESSONS.inimeneTervisenaitajadLesson = renderLesson;
})();
