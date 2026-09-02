(function exposeCrosswordEngine(root, factory) {
  const engine = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = engine;
  }

  root.EDUKASS_CROSSWORD_ENGINE = engine;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createCrosswordEngine() {
  'use strict';

  function cellKey(row, column) {
    return `${row}:${column}`;
  }

  function normalizeAnswer(value) {
    return String(value || '')
      .normalize('NFC')
      .toLocaleUpperCase('et-EE')
      .replace(/[^A-ZÕÄÖÜŠŽ]/g, '');
  }

  function buildCrossword(puzzle) {
    if (!puzzle || !Array.isArray(puzzle.words) || puzzle.words.length === 0) {
      throw new Error('Ristsõnal peab olema vähemalt üks sõna.');
    }

    const wordIds = new Set();
    const cells = new Map();
    const words = puzzle.words.map((sourceWord) => {
      const word = {
        ...sourceWord,
        answer: normalizeAnswer(sourceWord.answer)
      };

      if (!word.id || wordIds.has(word.id)) {
        throw new Error(`Sõna id peab olema unikaalne: ${word.id || '(puudub)'}.`);
      }

      if (!Number.isInteger(word.row) || !Number.isInteger(word.column)) {
        throw new Error(`Sõnal ${word.id} puudub korrektne alguskoordinaat.`);
      }

      if (!['across', 'down'].includes(word.direction) || !word.answer) {
        throw new Error(`Sõnal ${word.id} on vigane suund või vastus.`);
      }

      wordIds.add(word.id);
      word.cellKeys = [];

      Array.from(word.answer).forEach((letter, index) => {
        const row = word.row + (word.direction === 'down' ? index : 0);
        const column = word.column + (word.direction === 'across' ? index : 0);

        if (row < 0 || row >= puzzle.rows || column < 0 || column >= puzzle.columns) {
          throw new Error(`Sõna ${word.id} väljub ruudustikust.`);
        }

        const key = cellKey(row, column);
        const existing = cells.get(key);

        if (existing && existing.letter !== letter) {
          throw new Error(
            `Sõnade ristumisel ${key} on erinevad tähed: ${existing.letter} ja ${letter}.`
          );
        }

        const cell = existing || {
          key,
          row,
          column,
          letter,
          wordIds: [],
          number: null
        };

        if (index === 0) {
          if (cell.number !== null && cell.number !== word.number) {
            throw new Error(`Ruudul ${key} on kaks erinevat numbrit.`);
          }
          cell.number = word.number;
        }

        cell.wordIds.push(word.id);
        cells.set(key, cell);
        word.cellKeys.push(key);
      });

      return word;
    });

    const intersections = Array.from(cells.values()).filter((cell) => cell.wordIds.length > 1);

    return {
      puzzle,
      words,
      wordsById: new Map(words.map((word) => [word.id, word])),
      cells,
      intersections,
      cellKey
    };
  }

  return {
    buildCrossword,
    cellKey,
    normalizeAnswer
  };
});
