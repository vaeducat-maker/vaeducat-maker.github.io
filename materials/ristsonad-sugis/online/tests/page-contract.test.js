'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../crossword-data.js');

const pageDirectory = path.resolve(__dirname, '..');
const projectRoot = path.resolve(__dirname, '../../../..');
const htmlPath = path.join(pageDirectory, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(path.join(pageDirectory, 'crossword.css'), 'utf8');
const app = fs.readFileSync(path.join(pageDirectory, 'app.js'), 'utf8');

assert.match(html, /<html lang="et">/);
assert.match(html, /viewport-fit=cover/);
assert.match(html, /id="soundButton"/);
assert.match(html, /id="shareButton"/);
assert.match(html, /data-letter="Õ"/);
assert.match(html, /data-letter="Ä"/);
assert.match(html, /data-letter="Ö"/);
assert.match(html, /data-letter="Ü"/);
assert.ok(html.indexOf('crossword-data.js') < html.indexOf('crossword-engine.js'));
assert.ok(html.indexOf('crossword-engine.js') < html.indexOf('app.js'));

assert.match(css, /prefers-reduced-motion/);
assert.match(css, /orientation: landscape/);
assert.match(css, /max-width: 740px/);
assert.match(app, /remaining: 2/);
assert.match(app, /localStorage/);
assert.match(app, /navigator\.share/);
assert.doesNotMatch(`${html}\n${css}\n${app}`, /KIISU MIISU|Kiisu Miisu/);

const references = Array.from(html.matchAll(/(?:href|src)="([^"]+)"/g), (match) => match[1]);

references.forEach((reference) => {
  if (/^(?:https?:|mailto:|tel:|data:|#)/.test(reference)) {
    return;
  }

  const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
  let target = pathname.startsWith('/')
    ? path.join(projectRoot, pathname.slice(1))
    : path.resolve(pageDirectory, pathname);

  if (pathname.endsWith('/')) {
    target = path.join(target, 'index.html');
  }

  assert.ok(fs.existsSync(target), `Kohalik viide peab olemas olema: ${reference}`);
});

data.puzzles[0].words.forEach((word) => {
  const imagePath = path.join(pageDirectory, word.image);
  assert.ok(fs.existsSync(imagePath), `Vihje pilt peab olemas olema: ${word.image}`);
  assert.ok(fs.statSync(imagePath).size > 2000, `Vihje pilt ei tohi olla tühi: ${word.image}`);
});

assert.equal(fs.readFileSync(path.join(projectRoot, 'CNAME'), 'utf8').trim(), 'edukass.ee');

console.log('Ristsõna lehe leping korras: viited, mobiilivaated, heli, jagamine ja pildid.');
