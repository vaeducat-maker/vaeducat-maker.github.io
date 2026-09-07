(() => {
  'use strict';

  const TOTAL = 15;
  const root = document.getElementById('app');
  const installButton = document.getElementById('installButton');
  const installDialog = document.getElementById('installDialog');
  const installText = document.getElementById('installText');
  const closeInstall = document.getElementById('closeInstall');
  let deferredInstallPrompt = null;

  let screen = 'welcome';
  let level = Number(localStorage.getItem('edukass-liitmine-level') || 1);
  let problems = [];
  let problemIndex = 0;
  let problem = null;
  let pos = 0;
  let carryIn = 0;
  let phase = 'answer';
  let locked = false;
  let answers = [];
  let carries = [];
  let states = [];
  let carryStates = [];
  let demoTimer = null;
  let demoStep = 0;

  const LEVELS = {
    1: {title: 'Kahekohalised', note: 'ilma ülekandeta', digits: 2},
    2: {title: 'Kahekohalised', note: 'ülekandega', digits: 2},
    3: {title: 'Kolmekohalised', note: 'ülekandega', digits: 3}
  };

  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const digit = (n, p) => Math.floor(n / (10 ** p)) % 10;

  function uniqueProblems(make) {
    const list = [];
    const seen = new Set();
    let guard = 0;
    while (list.length < TOTAL && guard < 5000) {
      guard += 1;
      const candidate = make();
      const key = `${candidate.a}+${candidate.b}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push(candidate);
      }
    }
    return list;
  }

  function makeProblems(selectedLevel) {
    if (selectedLevel === 1) {
      return uniqueProblems(() => {
        let a, b;
        do {
          a = rnd(11, 88);
          b = rnd(11, 88);
        } while (
          digit(a, 0) + digit(b, 0) >= 10 ||
          digit(a, 1) + digit(b, 1) >= 10
        );
        return {a, b, digits: 2};
      });
    }

    if (selectedLevel === 2) {
      return uniqueProblems(() => {
        let a, b;
        do {
          a = rnd(12, 78);
          b = rnd(12, 78);
        } while (
          digit(a, 0) + digit(b, 0) < 10 ||
          digit(a, 1) + digit(b, 1) + 1 >= 10 ||
          a + b > 99
        );
        return {a, b, digits: 2};
      });
    }

    return uniqueProblems(() => {
      let a, b, hasCarry;
      do {
        a = rnd(101, 699);
        b = rnd(101, 699);
        let carry = 0;
        hasCarry = false;
        for (let p = 0; p < 2; p += 1) {
          const sum = digit(a, p) + digit(b, p) + carry;
          carry = sum >= 10 ? 1 : 0;
          if (carry) hasCarry = true;
        }
      } while (!hasCarry || a + b > 999);
      return {a, b, digits: 3};
    });
  }

  function clearDemo() {
    if (demoTimer) {
      clearInterval(demoTimer);
      demoTimer = null;
    }
  }

  function startDemo() {
    clearDemo();
    demoStep = 0;
    const advance = () => {
      demoStep = (demoStep + 1) % 5;
      renderDemo();
    };
    demoTimer = setInterval(advance, 1050);
  }

  function renderDemo() {
    const carry = demoStep >= 2 ? '1' : '';
    const ones = demoStep >= 1 ? '5' : '';
    const tens = demoStep >= 3 ? '7' : '';
    const activeOnes = demoStep === 0;
    const activeCarry = demoStep === 1;
    const activeTens = demoStep === 2;
    const complete = demoStep >= 3;

    const el = document.getElementById('demoBoard');
    if (!el) return;
    el.innerHTML = `
      <div class="demo-grid" aria-label="28 pluss 47">
        <div class="demo-row carry-row"><span></span><span class="${activeCarry ? 'active' : ''}">${carry}</span><span></span></div>
        <div class="demo-row"><span></span><span>2</span><span>8</span></div>
        <div class="demo-row"><span class="plus">+</span><span>4</span><span>7</span></div>
        <div class="demo-line"></div>
        <div class="demo-row answer-row ${complete ? 'complete' : ''}"><span></span><span class="${activeTens ? 'active' : ''}">${tens}</span><span class="${activeOnes ? 'active' : ''}">${ones}</span></div>
      </div>
    `;
  }

  function welcome() {
    screen = 'welcome';
    root.innerHTML = `
      <section class="welcome-card">
        <div class="eyebrow">MATEMAATIKA</div>
        <h1>Liitmise treener</h1>
        <p class="lead">Liida arvud kirjalikult. Üks veerg korraga.</p>
        <div id="demoBoard" class="demo-board"></div>
        <button class="primary big" id="playButton">MÄNGI!</button>
      </section>
    `;
    renderDemo();
    startDemo();
    document.getElementById('playButton').addEventListener('click', showLevels);
  }

  function showLevels() {
    clearDemo();
    screen = 'levels';
    root.innerHTML = `
      <section class="level-card">
        <button class="back" id="backWelcome" aria-label="Tagasi">←</button>
        <div class="eyebrow">VALI TASE</div>
        <h2>Millest alustame?</h2>
        <div class="level-list">
          ${Object.entries(LEVELS).map(([id, item]) => `
            <button class="level-option ${Number(id) === level ? 'selected' : ''}" data-level="${id}">
              <strong>${id}. tase · ${item.title}</strong>
              <span>${item.note}</span>
            </button>
          `).join('')}
        </div>
      </section>
    `;
    document.getElementById('backWelcome').addEventListener('click', welcome);
    root.querySelectorAll('[data-level]').forEach(button => {
      button.addEventListener('click', () => startLevel(Number(button.dataset.level)));
    });
  }

  function startLevel(selectedLevel) {
    clearDemo();
    level = selectedLevel;
    localStorage.setItem('edukass-liitmine-level', String(level));
    problems = makeProblems(level);
    problemIndex = 0;
    startProblem();
  }

  function startProblem() {
    screen = 'game';
    problem = problems[problemIndex];
    pos = 0;
    carryIn = 0;
    phase = 'answer';
    locked = false;
    answers = Array(problem.digits).fill('');
    carries = Array(problem.digits).fill('');
    states = Array(problem.digits).fill(null);
    carryStates = Array(problem.digits).fill(null);
    renderGame();
  }

  function sumAt(position) {
    return digit(problem.a, position) + digit(problem.b, position) + carryIn;
  }

  function renderGame() {
    const meta = LEVELS[level];
    root.innerHTML = `
      <section class="game-shell">
        <div class="game-top">
          <button class="back" id="backLevels" aria-label="Tasemed">←</button>
          <div>
            <div class="eyebrow">${level}. TASE · ${meta.title.toUpperCase()}</div>
            <div class="progress-text">Näide ${problemIndex + 1} / ${TOTAL}</div>
          </div>
          <button class="restart" id="restartLevel" aria-label="Alusta taset uuesti">↻</button>
        </div>

        <div class="math-wrap">
          ${boardHtml()}
          <div class="hint" id="hint">${hintText()}</div>
        </div>

        <div class="keypad" aria-label="Numbriklahvid">
          ${[1,2,3,4,5,6,7,8,9,0].map(n => `<button class="key" data-key="${n}">${n}</button>`).join('')}
        </div>
      </section>
    `;

    document.getElementById('backLevels').addEventListener('click', showLevels);
    document.getElementById('restartLevel').addEventListener('click', () => startLevel(level));
    root.querySelectorAll('[data-key]').forEach(button => {
      button.addEventListener('click', () => handleDigit(Number(button.dataset.key)));
    });
  }

  function boardHtml() {
    const columns = problem.digits;
    const topCarry = [];
    const first = [];
    const second = [];
    const answer = [];
    const status = [];

    for (let display = columns - 1; display >= 0; display -= 1) {
      const activeCarry = phase === 'carry' && display === pos + 1;
      const carryState = carryStates[display];
      topCarry.push(`
        <div class="carry-cell ${activeCarry ? 'active' : ''} ${carryState === 'ok' ? 'ok' : ''} ${carryState === 'bad' ? 'bad' : ''}">
          ${carries[display] === '' ? '&nbsp;' : carries[display]}
          ${carryState === 'bad' ? '<span class="correct-mini">1</span>' : ''}
        </div>
      `);
      first.push(`<div class="number-cell">${digit(problem.a, display)}</div>`);
      second.push(`<div class="number-cell">${digit(problem.b, display)}</div>`);

      const activeAnswer = phase === 'answer' && display === pos;
      const state = states[display];
      const expected = state === 'bad' ? expectedAnswer(display) : null;
      answer.push(`
        <div class="answer-cell ${activeAnswer ? 'active' : ''} ${state === 'ok' ? 'ok' : ''} ${state === 'bad' ? 'bad' : ''}">
          ${answers[display] === '' ? '&nbsp;' : answers[display]}
          ${state === 'bad' ? `<span class="correct-mini">${expected}</span>` : ''}
        </div>
      `);
      const statusKind = state === 'bad' || carryState === 'bad'
        ? 'bad'
        : state === 'ok' || carryState === 'ok'
          ? 'ok'
          : '';
      status.push(`
        <div class="column-status ${statusKind}">
          ${statusText(display)}
        </div>
      `);
    }

    return `
      <div class="addition-board" style="--cols:${columns}">
        <div class="operator-space"></div><div class="row-grid carry-grid">${topCarry.join('')}</div>
        <div class="operator-space"></div><div class="row-grid">${first.join('')}</div>
        <div class="operator">+</div><div class="row-grid">${second.join('')}</div>
        <div class="operator-space"></div><div class="sum-line"></div>
        <div class="operator-space"></div><div class="row-grid">${answer.join('')}</div>
        <div class="operator-space"></div><div class="row-grid status-grid">${status.join('')}</div>
      </div>
    `;
  }

  function expectedAnswer(position) {
    let incoming = 0;
    for (let p = 0; p < position; p += 1) {
      const s = digit(problem.a, p) + digit(problem.b, p) + incoming;
      incoming = s >= 10 ? 1 : 0;
    }
    const s = digit(problem.a, position) + digit(problem.b, position) + incoming;
    return s % 10;
  }

  function statusText(display) {
    if (states[display] === 'bad' || carryStates[display] === 'bad') return 'VALE';
    if (states[display] === 'ok' || carryStates[display] === 'ok') return 'ÕIGE';
    return '&nbsp;';
  }

  function hintText() {
    if (phase === 'carry') return 'Kirjuta meelespea ülemisse aknasse.';
    const ones = digit(problem.a, pos);
    const twos = digit(problem.b, pos);
    return carryIn
      ? `${ones} + ${twos} + ${carryIn}`
      : `${ones} + ${twos}`;
  }

  function handleDigit(value) {
    if (locked || screen !== 'game') return;
    if (phase === 'carry') {
      checkCarry(value);
    } else {
      checkAnswer(value);
    }
  }

  function checkAnswer(value) {
    const sum = sumAt(pos);
    const expected = sum % 10;
    const carryOut = sum >= 10 ? 1 : 0;
    answers[pos] = value;

    if (value === expected) {
      states[pos] = 'ok';
      renderGame();
      locked = true;
      setTimeout(() => afterAnswer(carryOut), 520);
    } else {
      states[pos] = 'bad';
      renderGame();
      locked = true;
      setTimeout(() => {
        answers[pos] = expected;
        renderGame();
        setTimeout(() => afterAnswer(carryOut), 850);
      }, 1000);
    }
  }

  function afterAnswer(carryOut) {
    locked = false;
    if (carryOut && pos + 1 < problem.digits) {
      phase = 'carry';
      renderGame();
      return;
    }
    carryIn = 0;
    moveLeft();
  }

  function checkCarry(value) {
    const target = pos + 1;
    carries[target] = value;

    if (value === 1) {
      carryStates[target] = 'ok';
      renderGame();
      locked = true;
      setTimeout(() => {
        carryIn = 1;
        pos += 1;
        phase = 'answer';
        locked = false;
        renderGame();
      }, 520);
    } else {
      carryStates[target] = 'bad';
      renderGame();
      locked = true;
      setTimeout(() => {
        carries[target] = 1;
        renderGame();
        setTimeout(() => {
          carryIn = 1;
          pos += 1;
          phase = 'answer';
          locked = false;
          renderGame();
        }, 850);
      }, 1000);
    }
  }

  function moveLeft() {
    pos += 1;
    if (pos >= problem.digits) {
      completeProblem();
      return;
    }
    phase = 'answer';
    renderGame();
  }

  function completeProblem() {
    locked = true;
    const hint = document.getElementById('hint');
    const nextLabel = problemIndex + 1 >= TOTAL ? 'VALMIS' : 'EDASI';
    hint.innerHTML = `<button class="primary next-button" id="nextProblem">${nextLabel}</button>`;
    document.getElementById('nextProblem').addEventListener('click', () => {
      if (problemIndex + 1 >= TOTAL) {
        finishLevel();
      } else {
        problemIndex += 1;
        startProblem();
      }
    });
  }

  function finishLevel() {
    screen = 'done';
    root.innerHTML = `
      <section class="done-card">
        <div class="done-mark">✓</div>
        <div class="eyebrow">${level}. TASE</div>
        <h2>Valmis!</h2>
        <p>15 näidet on tehtud.</p>
        <div class="done-actions">
          <button class="primary" id="again">TEE UUESTI</button>
          <button class="secondary" id="levels">VALI TASE</button>
        </div>
      </section>
    `;
    document.getElementById('again').addEventListener('click', () => startLevel(level));
    document.getElementById('levels').addEventListener('click', showLevels);
  }

  function openInstallHelp() {
    const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    installText.innerHTML = isiOS
      ? 'Ava see leht Safaris → vajuta <strong>Jaga</strong> → <strong>Lisa avakuvale</strong>.'
      : isAndroid
        ? 'Ava brauseri menüü ⋮ → vali <strong>Installi rakendus</strong> või <strong>Lisa avakuvale</strong>.'
        : 'Ava brauseri menüü ja vali <strong>Installi rakendus</strong> või <strong>Lisa avakuvale</strong>.';
    installDialog.showModal();
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });

  installButton.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return;
    }
    openInstallHelp();
  });

  closeInstall.addEventListener('click', () => installDialog.close());

  document.addEventListener('keydown', event => {
    if (/^\d$/.test(event.key)) handleDigit(Number(event.key));
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
  }

  welcome();
})();
