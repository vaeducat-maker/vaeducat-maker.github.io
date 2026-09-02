(function exposeCrosswordData(root, factory) {
  const data = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = data;
  }

  root.EDUKASS_CROSSWORD_DATA = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createCrosswordData() {
  'use strict';

  return {
    packId: 'ristsonad-sugis',
    title: 'Ristsõnad: Sügis',
    canonicalUrl: 'https://edukass.ee/materials/ristsonad-sugis/online/',
    puzzles: [
      {
        id: 'sugis-on-kaes',
        theme: 'SÜGIS',
        title: 'SÜGIS ON KÄES!',
        instruction: 'Vaata pilti ja loe vihjet. Kirjuta sõna ruutudesse.',
        rows: 11,
        columns: 11,
        words: [
          {
            id: '1',
            number: 1,
            direction: 'down',
            row: 0,
            column: 3,
            answer: 'TUUL',
            clue: 'See puhub ja liigutab lehti.',
            image: 'assets/01-tuul.webp',
            imageAlt: 'Tuul puhub sügislehti'
          },
          {
            id: '2',
            number: 2,
            direction: 'down',
            row: 1,
            column: 0,
            answer: 'OKS',
            clue: 'See on puu osa. Selle küljes kasvavad lehed.',
            image: 'assets/02-oks.webp',
            imageAlt: 'Tammeoks lehtede ja tõruga'
          },
          {
            id: '3',
            number: 3,
            direction: 'across',
            row: 3,
            column: 0,
            answer: 'SALL',
            clue: 'Paneme selle kaela ümber, kui ilm on jahe.',
            image: 'assets/03-sall.webp',
            imageAlt: 'Punane ruuduline sall'
          },
          {
            id: '4',
            number: 4,
            direction: 'down',
            row: 3,
            column: 2,
            answer: 'LOMP',
            clue: 'See tekib pärast vihma. Seal on vesi.',
            image: 'assets/04-lomp.webp',
            imageAlt: 'Veeloik pärast vihma'
          },
          {
            id: '5',
            number: 5,
            direction: 'down',
            row: 4,
            column: 4,
            answer: 'PILV',
            clue: 'See on taevas. See võib olla valge või hall.',
            image: 'assets/05-pilv.webp',
            imageAlt: 'Valge pilv'
          },
          {
            id: '6',
            number: 6,
            direction: 'across',
            row: 5,
            column: 0,
            answer: 'KUMMIKUD',
            clue: 'Paneme need jalga, kui õues on märg.',
            image: 'assets/06-kummikud.webp',
            imageAlt: 'Kollased kummikud'
          },
          {
            id: '7',
            number: 7,
            direction: 'across',
            row: 7,
            column: 4,
            answer: 'VIHM',
            clue: 'See tuleb pilvedest. Pärast on maa märg.',
            image: 'assets/07-vihm.webp',
            imageAlt: 'Tume vihmapilv ja vihmapiisad'
          },
          {
            id: '8',
            number: 8,
            direction: 'down',
            row: 7,
            column: 7,
            answer: 'MÜTS',
            clue: 'See hoiab pead soojas.',
            image: 'assets/08-muts.webp',
            imageAlt: 'Sinine kootud müts'
          },
          {
            id: '9',
            number: 9,
            direction: 'down',
            row: 8,
            column: 10,
            answer: 'ÕUN',
            clue: 'Punane või roheline puuvili.',
            image: 'assets/09-oun.webp',
            imageAlt: 'Punane õun'
          },
          {
            id: '10',
            number: 10,
            direction: 'across',
            row: 10,
            column: 7,
            answer: 'SEEN',
            clue: 'Seda võib leida metsast. Sellel on jalg ja kübar.',
            image: 'assets/10-seen.webp',
            imageAlt: 'Pruuni kübaraga seen'
          }
        ]
      }
    ]
  };
});
