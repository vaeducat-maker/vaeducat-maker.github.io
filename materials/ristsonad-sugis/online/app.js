(function startCrosswordApp() {
  'use strict';

  const pack = window.EDUKASS_CROSSWORD_DATA;
  const engine = window.EDUKASS_CROSSWORD_ENGINE;

  if (!pack || !engine) {
    throw new Error('Ristsõna andmed või mootor ei laadinud.');
  }

  const puzzle = pack.puzzles[0];
  const crossword = engine.buildCrossword(puzzle);
  const STORAGE_KEY = 'edukass-ristsonad-sugis-online-v1';
  const SOUND_KEY = 'edukass-ristsonad-sound-enabled';

  const elements = {
    puzzleScreen: document.getElementById('puzzleScreen'),
    finishScreen: document.getElementById('finishScreen'),
    puzzleTheme: document.getElementById('puzzleTheme'),
    puzzleTitle: document.getElementById('puzzleTitle'),
    clueNumber: document.getElementById('clueNumber'),
    clueDirection: document.getElementById('clueDirection'),
    clueText: document.getElementById('clueText'),
    clueImage: document.getElementById('clueImage'),
    entryLabel: document.getElementById('entryLabel'),
    wordEntry: document.getElementById('wordEntry'),
    letterKeyboard: document.getElementById('letterKeyboard'),
    feedback: document.getElementById('feedback'),
    crosswordGrid: document.getElementById('crosswordGrid'),
    progressDots: document.getElementById('progressDots'),
    previousWordButton: document.getElementById('previousWordButton'),
    nextWordButton: document.getElementById('nextWordButton'),
    soundButton: document.getElementById('soundButton'),
    shareButton: document.getElementById('shareButton'),
    restartButton: document.getElementById('restartButton'),
    restartDialog: document.getElementById('restartDialog'),
    playAgainButton: document.getElementById('playAgainButton'),
    toast: document.getElementById('toast')
  };

  let state = loadState();
  let soundEnabled = loadSoundPreference();
  let feedbackState = null;
  let checkTimer = null;
  let toastTimer = null;
  let audioContext = null;
  let activeLetterIndex = 0;
  let lastGridKey = null;

  function createEmptyState() {
    return {
      version: 1,
      values: {},
      sources: {},
      solvedWordIds: [],
      activeWordId: crossword.words[0].id,
      retryQueue: []
    };
  }

  function loadState() {
    const fallback = createEmptyState();

    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (!parsed || parsed.version !== 1) {
        return fallback;
      }

      const validWordIds = new Set(crossword.words.map((word) => word.id));
      const values = {};
      const sources = {};

      Object.entries(parsed.values || {}).forEach(([key, value]) => {
        const letter = engine.normalizeAnswer(value).slice(0, 1);
        if (crossword.cells.has(key) && letter) {
          values[key] = letter;
        }
      });

      Object.entries(parsed.sources || {}).forEach(([key, wordId]) => {
        if (crossword.cells.has(key) && validWordIds.has(wordId)) {
          sources[key] = wordId;
        }
      });

      const solvedWordIds = Array.from(new Set(parsed.solvedWordIds || []))
        .filter((wordId) => validWordIds.has(wordId));

      solvedWordIds.forEach((wordId) => {
        const word = crossword.wordsById.get(wordId);
        word.cellKeys.forEach((key, index) => {
          values[key] = Array.from(word.answer)[index];
          sources[key] = wordId;
        });
      });

      const retryQueue = Array.isArray(parsed.retryQueue)
        ? parsed.retryQueue
          .filter((item) => item && validWordIds.has(item.id) && !solvedWordIds.includes(item.id))
          .map((item) => ({ id: item.id, remaining: Math.max(0, Number(item.remaining) || 0) }))
        : [];

      const requestedActiveWordId = validWordIds.has(parsed.activeWordId)
        ? parsed.activeWordId
        : crossword.words[0].id;
      const firstUnsolvedWord = crossword.words.find((word) => !solvedWordIds.includes(word.id));

      return {
        version: 1,
        values,
        sources,
        solvedWordIds,
        activeWordId: solvedWordIds.includes(requestedActiveWordId) && firstUnsolvedWord
          ? firstUnsolvedWord.id
          : requestedActiveWordId,
        retryQueue
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // The crossword remains usable when private browsing blocks storage.
    }
  }

  function loadSoundPreference() {
    try {
      return localStorage.getItem(SOUND_KEY) !== 'false';
    } catch (error) {
      return true;
    }
  }

  function saveSoundPreference() {
    try {
      localStorage.setItem(SOUND_KEY, String(soundEnabled));
    } catch (error) {
      // Sound preference is optional when storage is unavailable.
    }
  }

  function solvedSet() {
    return new Set(state.solvedWordIds);
  }

  function lockedCellKeys() {
    const locked = new Set();

    state.solvedWordIds.forEach((wordId) => {
      const word = crossword.wordsById.get(wordId);
      if (word) {
        word.cellKeys.forEach((key) => locked.add(key));
      }
    });

    return locked;
  }

  function activeWord() {
    return crossword.wordsById.get(state.activeWordId) || crossword.words[0];
  }

  function directionArrow(direction) {
    return direction === 'down' ? '↓' : '→';
  }

  function directionName(direction) {
    return direction === 'down' ? 'alla' : 'paremale';
  }

  function renderGridSkeleton() {
    const fragment = document.createDocumentFragment();

    Array.from(crossword.cells.values())
      .sort((a, b) => a.row - b.row || a.column - b.column)
      .forEach((cell) => {
        const button = document.createElement('button');
        const number = document.createElement('span');
        const letter = document.createElement('span');

        button.type = 'button';
        button.className = 'grid-cell';
        button.dataset.key = cell.key;
        button.style.gridRow = String(cell.row + 1);
        button.style.gridColumn = String(cell.column + 1);
        button.setAttribute('role', 'gridcell');

        number.className = 'cell-number';
        number.textContent = cell.number === null ? '' : String(cell.number);
        number.setAttribute('aria-hidden', 'true');

        letter.className = 'cell-letter';
        letter.setAttribute('aria-hidden', 'true');

        button.append(number, letter);
        button.addEventListener('click', () => selectCell(cell));
        fragment.append(button);
      });

    elements.crosswordGrid.replaceChildren(fragment);
  }

  function renderProgress() {
    const solved = solvedSet();
    const fragment = document.createDocumentFragment();

    crossword.words.forEach((word) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'progress-dot';
      button.textContent = String(word.number);
      button.classList.toggle('is-active', word.id === state.activeWordId);
      button.classList.toggle('is-solved', solved.has(word.id));
      button.setAttribute(
        'aria-label',
        `${word.number}. vihje, ${directionName(word.direction)}, ${solved.has(word.id) ? 'lahendatud' : 'lahendamata'}`
      );
      button.setAttribute('aria-current', word.id === state.activeWordId ? 'step' : 'false');
      button.addEventListener('click', () => setActiveWord(word.id, firstEditableIndex(word)));
      fragment.append(button);
    });

    elements.progressDots.replaceChildren(fragment);
  }

  function renderActiveWord(focusIndex = null) {
    const word = activeWord();
    const locked = lockedCellKeys();
    const solved = solvedSet();
    const answerLetters = Array.from(word.answer);
    const fragment = document.createDocumentFragment();

    if (focusIndex !== null) {
      activeLetterIndex = focusIndex;
    }

    if (
      !Number.isInteger(activeLetterIndex)
      || activeLetterIndex < 0
      || activeLetterIndex >= word.cellKeys.length
      || locked.has(word.cellKeys[activeLetterIndex])
    ) {
      activeLetterIndex = firstEditableIndex(word);
    }

    elements.clueNumber.textContent = String(word.number);
    elements.clueDirection.textContent = directionArrow(word.direction);
    elements.clueText.textContent = word.clue;
    elements.clueImage.src = word.image;
    elements.clueImage.alt = word.imageAlt;
    elements.entryLabel.textContent = `SÕNA ${word.number} / ${crossword.words.length}`;

    word.cellKeys.forEach((key, index) => {
      const cellButton = document.createElement('button');
      const isLocked = locked.has(key) || solved.has(word.id);
      const revealLetter = feedbackState && feedbackState.wordId === word.id
        && ['reveal', 'correct'].includes(feedbackState.type);
      const visibleValue = revealLetter ? answerLetters[index] : (state.values[key] || '');

      cellButton.className = 'letter-cell';
      cellButton.type = 'button';
      cellButton.textContent = visibleValue;
      cellButton.dataset.index = String(index);
      cellButton.dataset.key = key;
      cellButton.disabled = isLocked || Boolean(feedbackState);
      cellButton.classList.toggle('is-locked', isLocked);
      cellButton.classList.toggle('is-current', !isLocked && index === activeLetterIndex);
      cellButton.classList.toggle(
        'is-wrong',
        Boolean(feedbackState && feedbackState.type === 'wrong' && feedbackState.wrongKeys.has(key))
      );
      cellButton.setAttribute(
        'aria-label',
        `${word.number}. sõna, ${index + 1}. täht${visibleValue ? `, ${visibleValue}` : ''}`
      );
      cellButton.setAttribute('aria-current', index === activeLetterIndex ? 'true' : 'false');
      cellButton.addEventListener('click', () => selectEntryCell(index));
      fragment.append(cellButton);
    });

    elements.wordEntry.replaceChildren(fragment);
    elements.wordEntry.className = 'word-entry';

    if (feedbackState && feedbackState.wordId === word.id) {
      elements.wordEntry.classList.add(`is-${feedbackState.type}`);
    }

    const keyboardDisabled = Boolean(feedbackState) || solved.has(word.id);
    elements.letterKeyboard.classList.toggle('is-disabled', keyboardDisabled);
    elements.letterKeyboard.querySelectorAll('button').forEach((button) => {
      button.disabled = keyboardDisabled;
    });

    renderFeedback();
  }

  function renderFeedback() {
    elements.feedback.className = 'feedback';
    elements.feedback.textContent = '';

    if (!feedbackState) {
      return;
    }

    if (feedbackState.type === 'wrong') {
      elements.feedback.classList.add('is-wrong');
      elements.feedback.textContent = 'VAATA';
    } else if (feedbackState.type === 'reveal') {
      elements.feedback.textContent = 'ÕIGE VASTUS';
    } else if (feedbackState.type === 'correct') {
      elements.feedback.textContent = '✓ ÕIGE';
    }
  }

  function updateGrid() {
    const word = activeWord();
    const activeKeys = new Set(word.cellKeys);
    const locked = lockedCellKeys();

    elements.crosswordGrid.querySelectorAll('.grid-cell').forEach((button) => {
      const key = button.dataset.key;
      const cell = crossword.cells.get(key);
      const letterElement = button.querySelector('.cell-letter');
      const showsAnswer = feedbackState && feedbackState.wordId === word.id
        && ['reveal', 'correct'].includes(feedbackState.type)
        && activeKeys.has(key);
      const shownLetter = showsAnswer ? cell.letter : (state.values[key] || '');
      const isWrong = feedbackState && feedbackState.wordId === word.id
        && feedbackState.type === 'wrong'
        && feedbackState.wrongKeys.has(key);

      letterElement.textContent = shownLetter;
      button.classList.toggle('is-active', activeKeys.has(key));
      button.classList.toggle(
        'is-current',
        activeKeys.has(key) && key === word.cellKeys[activeLetterIndex] && !feedbackState
      );
      button.classList.toggle('is-locked', locked.has(key));
      button.classList.toggle('is-wrong', Boolean(isWrong));
      button.classList.toggle(
        'is-reveal',
        Boolean(feedbackState && feedbackState.type === 'reveal' && activeKeys.has(key))
      );
      button.classList.toggle(
        'is-correct',
        Boolean(feedbackState && feedbackState.type === 'correct' && activeKeys.has(key))
      );

      const numberText = cell.number === null ? '' : `, number ${cell.number}`;
      const letterText = shownLetter ? `, täht ${shownLetter}` : ', tühi';
      button.setAttribute(
        'aria-label',
        `${cell.row + 1}. rida, ${cell.column + 1}. veerg${numberText}${letterText}`
      );
    });
  }

  function renderAll(focusIndex = null) {
    elements.puzzleTheme.textContent = `RISTSÕNAD · ${puzzle.theme}`;
    elements.puzzleTitle.textContent = puzzle.title;
    renderProgress();
    renderActiveWord(focusIndex);
    updateGrid();
    updateSoundButton();
  }

  function setActiveWord(wordId, focusIndex = null) {
    if (feedbackState || !crossword.wordsById.has(wordId)) {
      return;
    }

    clearTimeout(checkTimer);
    state.activeWordId = wordId;
    activeLetterIndex = focusIndex === null ? firstEditableIndex(crossword.wordsById.get(wordId)) : focusIndex;
    saveState();
    renderAll(focusIndex);
  }

  function selectCell(cell) {
    if (feedbackState) {
      return;
    }

    const solved = solvedSet();
    const unsolvedCandidates = cell.wordIds.filter((wordId) => !solved.has(wordId));
    const candidates = unsolvedCandidates.length > 0 ? unsolvedCandidates : cell.wordIds;
    let targetWordId;

    if (lastGridKey === cell.key && candidates.length > 1 && candidates.includes(state.activeWordId)) {
      const currentIndex = candidates.indexOf(state.activeWordId);
      targetWordId = candidates[(currentIndex + 1) % candidates.length];
    } else if (candidates.includes(state.activeWordId)) {
      targetWordId = state.activeWordId;
    } else {
      targetWordId = candidates[0];
    }

    lastGridKey = cell.key;
    const word = crossword.wordsById.get(targetWordId);
    const inputIndex = word.cellKeys.indexOf(cell.key);
    setActiveWord(targetWordId, inputIndex);
  }

  function wordIndex(wordId) {
    return crossword.words.findIndex((word) => word.id === wordId);
  }

  function moveWord(offset) {
    if (feedbackState) {
      return;
    }

    const currentIndex = wordIndex(state.activeWordId);
    const nextIndex = (currentIndex + offset + crossword.words.length) % crossword.words.length;
    const nextWord = crossword.words[nextIndex];
    setActiveWord(nextWord.id, firstEditableIndex(nextWord));
  }

  function firstEditableIndex(word) {
    const locked = lockedCellKeys();
    const firstEmpty = word.cellKeys.findIndex((key) => !locked.has(key) && !state.values[key]);

    if (firstEmpty >= 0) {
      return firstEmpty;
    }

    const firstUnlocked = word.cellKeys.findIndex((key) => !locked.has(key));
    return firstUnlocked >= 0 ? firstUnlocked : 0;
  }

  function selectEntryCell(index) {
    if (feedbackState) {
      return;
    }

    const word = activeWord();
    const locked = lockedCellKeys();

    if (!word.cellKeys[index] || locked.has(word.cellKeys[index])) {
      return;
    }

    activeLetterIndex = index;
    renderActiveWord(index);
    updateGrid();
  }

  function nextEditableIndex(word, startIndex, includeFilled = false) {
    const locked = lockedCellKeys();

    for (let index = startIndex + 1; index < word.cellKeys.length; index += 1) {
      const key = word.cellKeys[index];
      if (!locked.has(key) && (includeFilled || !state.values[key])) {
        return index;
      }
    }

    for (let index = 0; index <= startIndex; index += 1) {
      const key = word.cellKeys[index];
      if (!locked.has(key) && (includeFilled || !state.values[key])) {
        return index;
      }
    }

    return -1;
  }

  function previousEditableIndex(word, startIndex) {
    const locked = lockedCellKeys();

    for (let index = startIndex - 1; index >= 0; index -= 1) {
      if (!locked.has(word.cellKeys[index])) {
        return index;
      }
    }

    return -1;
  }

  function setCellValue(word, index, letter) {
    const key = word.cellKeys[index];
    const locked = lockedCellKeys();

    if (locked.has(key)) {
      return;
    }

    if (letter) {
      state.values[key] = letter;
      state.sources[key] = word.id;
    } else {
      delete state.values[key];
      delete state.sources[key];
    }
  }

  function insertLetter(letter) {
    if (feedbackState) {
      return;
    }

    const normalizedLetter = engine.normalizeAnswer(letter).slice(0, 1);
    if (!normalizedLetter) {
      return;
    }

    clearTimeout(checkTimer);
    unlockAudio();
    const word = activeWord();
    const currentIndex = activeLetterIndex;
    setCellValue(word, currentIndex, normalizedLetter);

    const nextIndex = nextEditableIndex(word, currentIndex);
    if (nextIndex >= 0) {
      activeLetterIndex = nextIndex;
    }

    renderActiveWord(activeLetterIndex);
    updateGrid();
    saveState();

    if (isWordComplete(word)) {
      scheduleWordCheck();
    }
  }

  function deleteLetter() {
    if (feedbackState) {
      return;
    }

    clearTimeout(checkTimer);
    unlockAudio();
    const word = activeWord();
    const currentKey = word.cellKeys[activeLetterIndex];

    if (state.values[currentKey]) {
      setCellValue(word, activeLetterIndex, '');
    } else {
      const previousIndex = previousEditableIndex(word, activeLetterIndex);
      if (previousIndex >= 0) {
        activeLetterIndex = previousIndex;
        setCellValue(word, activeLetterIndex, '');
      }
    }

    renderActiveWord(activeLetterIndex);
    updateGrid();
    saveState();
  }

  function moveActiveLetter(offset) {
    const word = activeWord();
    const targetIndex = offset < 0
      ? previousEditableIndex(word, activeLetterIndex)
      : nextEditableIndex(word, activeLetterIndex, true);

    if (targetIndex < 0) {
      return;
    }

    activeLetterIndex = targetIndex;
    renderActiveWord(activeLetterIndex);
    updateGrid();
  }

  function handleHardwareKeyboard(event) {
    if (
      feedbackState
      || elements.puzzleScreen.hidden
      || elements.restartDialog.open
      || event.ctrlKey
      || event.metaKey
      || event.altKey
    ) {
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      deleteLetter();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveLetter(-1);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveLetter(1);
      return;
    }

    if (event.key === 'Enter' && isWordComplete(activeWord())) {
      event.preventDefault();
      checkWord(activeWord());
      return;
    }

    if (event.key.length === 1) {
      const letter = engine.normalizeAnswer(event.key);
      if (letter.length === 1) {
        event.preventDefault();
        insertLetter(letter);
      }
    }
  }

  function isWordComplete(word) {
    return word.cellKeys.every((key) => Boolean(state.values[key]));
  }

  function scheduleWordCheck() {
    clearTimeout(checkTimer);
    checkTimer = window.setTimeout(() => checkWord(activeWord()), 180);
  }

  function checkWord(word) {
    if (feedbackState || word.id !== state.activeWordId || !isWordComplete(word)) {
      return;
    }

    clearTimeout(checkTimer);
    const answerLetters = Array.from(word.answer);
    const enteredLetters = word.cellKeys.map((key) => state.values[key] || '');
    const isCorrect = enteredLetters.every((letter, index) => letter === answerLetters[index]);

    if (isCorrect) {
      acceptCorrectWord(word);
    } else {
      revealCorrectWord(word, enteredLetters, answerLetters);
    }
  }

  function acceptCorrectWord(word) {
    const answerLetters = Array.from(word.answer);
    word.cellKeys.forEach((key, index) => {
      state.values[key] = answerLetters[index];
      state.sources[key] = word.id;
    });

    if (!state.solvedWordIds.includes(word.id)) {
      state.solvedWordIds.push(word.id);
    }

    state.retryQueue = state.retryQueue.filter((item) => item.id !== word.id);
    feedbackState = { type: 'correct', wordId: word.id, wrongKeys: new Set() };
    renderAll();
    playFeedbackSound('correct');
    saveState();

    window.setTimeout(() => {
      feedbackState = null;
      ageRetryQueue();

      if (state.solvedWordIds.length === crossword.words.length) {
        saveState();
        showFinishScreen();
        return;
      }

      const nextWordId = chooseNextWord(word.id);
      state.activeWordId = nextWordId;
      saveState();
      renderAll(firstEditableIndex(crossword.wordsById.get(nextWordId)));
    }, 680);
  }

  function revealCorrectWord(word, enteredLetters, answerLetters) {
    const wrongKeys = new Set(
      word.cellKeys.filter((key, index) => enteredLetters[index] !== answerLetters[index])
    );

    feedbackState = { type: 'wrong', wordId: word.id, wrongKeys };
    renderActiveWord();
    updateGrid();
    playFeedbackSound('wrong');

    window.setTimeout(() => {
      feedbackState = { type: 'reveal', wordId: word.id, wrongKeys };
      renderActiveWord();
      updateGrid();
    }, 330);

    window.setTimeout(() => {
      word.cellKeys.forEach((key) => {
        if (state.sources[key] === word.id && !lockedCellKeys().has(key)) {
          delete state.values[key];
          delete state.sources[key];
        }
      });

      ageRetryQueue();
      state.retryQueue = state.retryQueue.filter((item) => item.id !== word.id);
      state.retryQueue.push({ id: word.id, remaining: 2 });
      feedbackState = null;
      const nextWordId = chooseNextWord(word.id);
      state.activeWordId = nextWordId;
      saveState();
      renderAll(firstEditableIndex(crossword.wordsById.get(nextWordId)));
    }, 1500);
  }

  function ageRetryQueue() {
    state.retryQueue = state.retryQueue
      .filter((item) => !state.solvedWordIds.includes(item.id))
      .map((item) => ({ ...item, remaining: Math.max(0, item.remaining - 1) }));
  }

  function chooseNextWord(currentWordId) {
    const solved = solvedSet();
    const dueIndex = state.retryQueue.findIndex((item) => item.remaining <= 0 && !solved.has(item.id));

    if (dueIndex >= 0) {
      const [dueItem] = state.retryQueue.splice(dueIndex, 1);
      return dueItem.id;
    }

    const deferred = new Set(state.retryQueue.map((item) => item.id));
    const currentIndex = wordIndex(currentWordId);

    for (let offset = 1; offset <= crossword.words.length; offset += 1) {
      const candidate = crossword.words[(currentIndex + offset) % crossword.words.length];
      if (!solved.has(candidate.id) && !deferred.has(candidate.id)) {
        return candidate.id;
      }
    }

    const queued = state.retryQueue.find((item) => !solved.has(item.id));
    if (queued) {
      state.retryQueue = state.retryQueue.filter((item) => item.id !== queued.id);
      return queued.id;
    }

    const firstUnsolved = crossword.words.find((word) => !solved.has(word.id));
    return firstUnsolved ? firstUnsolved.id : crossword.words[0].id;
  }

  function showFinishScreen() {
    const activeElement = document.activeElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    elements.puzzleScreen.hidden = true;
    elements.finishScreen.hidden = false;
  }

  function resetPuzzle() {
    clearTimeout(checkTimer);
    feedbackState = null;
    state = createEmptyState();

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Reset still works in memory when storage is unavailable.
    }

    elements.finishScreen.hidden = true;
    elements.puzzleScreen.hidden = false;
    renderAll(0);
  }

  function updateSoundButton() {
    elements.soundButton.setAttribute('aria-pressed', String(soundEnabled));
    elements.soundButton.setAttribute('aria-label', soundEnabled ? 'Lülita heli välja' : 'Lülita heli sisse');
    elements.soundButton.title = soundEnabled ? 'Heli sees' : 'Heli väljas';
  }

  function unlockAudio() {
    if (!soundEnabled || audioContext) {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioContext = new AudioContext();
    }
  }

  function playTone(frequency, startsAt, duration, volume) {
    if (!audioContext) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + startsAt;
    const end = start + duration;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }

  function playFeedbackSound(type) {
    if (!soundEnabled) {
      return;
    }

    unlockAudio();
    if (!audioContext) {
      return;
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    if (type === 'correct') {
      playTone(520, 0, 0.12, 0.06);
      playTone(660, 0.1, 0.16, 0.055);
    } else {
      playTone(220, 0, 0.16, 0.035);
    }
  }

  async function shareCrossword() {
    const shareData = {
      title: 'Ristsõnad: Sügis · EDUKASS',
      text: 'Lahenda sügisteemalist pildiristsõna veebis.',
      url: pack.canonicalUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') {
          return;
        }
      }
    }

    const copied = await copyText(pack.canonicalUrl);
    showToast(copied ? 'LINK KOPEERITUD' : 'LINKI EI SAANUD KOPEERIDA');
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (error) {
        // Use the local fallback below.
      }
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }

    textarea.remove();
    return copied;
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => elements.toast.classList.remove('is-visible'), 1800);
  }

  function openRestartDialog() {
    const activeElement = document.activeElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }

    if (typeof elements.restartDialog.showModal === 'function') {
      elements.restartDialog.returnValue = '';
      elements.restartDialog.showModal();
    } else {
      resetPuzzle();
    }
  }

  elements.previousWordButton.addEventListener('click', () => moveWord(-1));
  elements.nextWordButton.addEventListener('click', () => moveWord(1));

  document.querySelectorAll('[data-letter]').forEach((button) => {
    button.addEventListener('click', () => insertLetter(button.dataset.letter));
  });

  document.querySelector('[data-action="backspace"]').addEventListener('click', deleteLetter);
  document.addEventListener('keydown', handleHardwareKeyboard);

  elements.soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    saveSoundPreference();
    updateSoundButton();
    if (soundEnabled) {
      unlockAudio();
      playTone(540, 0, 0.09, 0.045);
    }
  });

  elements.shareButton.addEventListener('click', shareCrossword);
  elements.restartButton.addEventListener('click', openRestartDialog);
  elements.playAgainButton.addEventListener('click', resetPuzzle);

  elements.restartDialog.addEventListener('close', () => {
    if (elements.restartDialog.returnValue === 'restart') {
      resetPuzzle();
    }
  });

  renderGridSkeleton();

  if (state.solvedWordIds.length === crossword.words.length) {
    showFinishScreen();
  } else {
    renderAll();
  }
})();
