'use strict';

const assert = require('node:assert/strict');
const data = require('../crossword-data.js');
const { buildCrossword } = require('../crossword-engine.js');

const puzzle = data.puzzles[0];
const crossword = buildCrossword(puzzle);

assert.equal(data.puzzles.length, 1, 'Prototüübis peab olema täpselt üks ristsõna.');
assert.equal(puzzle.id, 'sugis-on-kaes');
assert.equal(crossword.words.length, 10);
assert.equal(crossword.cells.size, 33);
assert.equal(crossword.intersections.length, 9);
assert.deepEqual(
  crossword.words.map((word) => word.answer),
  ['TUUL', 'OKS', 'SALL', 'LOMP', 'PILV', 'KUMMIKUD', 'VIHM', 'MÜTS', 'ÕUN', 'SEEN']
);

assert.deepEqual(
  crossword.words.map((word) => word.number),
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
);

const visitedWords = new Set([crossword.words[0].id]);
const pendingWords = [crossword.words[0].id];

while (pendingWords.length > 0) {
  const currentWordId = pendingWords.shift();
  const currentWord = crossword.wordsById.get(currentWordId);

  currentWord.cellKeys.forEach((key) => {
    crossword.cells.get(key).wordIds.forEach((connectedWordId) => {
      if (!visitedWords.has(connectedWordId)) {
        visitedWords.add(connectedWordId);
        pendingWords.push(connectedWordId);
      }
    });
  });
}

assert.equal(visitedWords.size, crossword.words.length, 'Kõik sõnad peavad kuuluma ühte võrku.');

console.log('Ristsõna andmed korras: 10 sõna, 33 ruutu, 9 ristumist.');
