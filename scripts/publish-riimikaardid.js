#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function read(relativePath) {
  return fs.readFileSync(path.join(dist, relativePath), 'utf8');
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(dist, relativePath), content, 'utf8');
}

// Add Riimikaardid to the public materials catalogue.
{
  const file = 'materials/index.html';
  let html = read(file);
  if (!html.includes('data-edukass-riimikaardid')) {
    const anchor = '<div class="material-grid category-material-grid">';
    if (!html.includes(anchor)) throw new Error('Riimikaardid catalogue anchor not found');
    const card = `<article class="material-tile catalog-tile" data-edukass-riimikaardid><a class="catalog-image-link" href="riimid-preview/"><img src="riimid-preview/files/riimikaardid-preview.jpg" alt="Riimikaardid — 18 pildikaarti riimuvate sõnade ja sõnavara harjutamiseks"></a><div class="material-tile-body"><div class="meta">EESTI KEEL · ONLINE + PRINDITAV · TASUTA</div><h3>Riimikaardid</h3><p>18 pildikaarti, millega harjutada riimuvaid sõnu, kinnistada sõnavara ja õppida mänguliselt.</p><a class="text-link" href="riimid-preview/">Vaata materjali →</a></div></article>`;
    html = html.replace(anchor, `${anchor}${card}`);
    write(file, html);
  }
}

// Put Riimikaardid first in the homepage “Värskelt lisatud” section.
{
  const file = 'home-refresh.js';
  let js = read(file);
  if (!js.includes('data-edukass-riimikaardid')) {
    js += `\n\n(() => {\n  const grid = document.querySelector('.home-new-grid');\n  if (!grid || grid.querySelector('[data-edukass-riimikaardid]')) return;\n\n  const card = document.createElement('article');\n  card.className = 'home-new-card home-new-material';\n  card.setAttribute('data-edukass-riimikaardid', '');\n  card.innerHTML = \`\n    <div class="home-new-card-visual">\n      <img src="materials/riimid-preview/files/riimikaardid-preview.jpg" alt="Riimikaardid — 18 pildikaarti riimuvate sõnade ja sõnavara harjutamiseks">\n    </div>\n    <div class="home-new-card-copy">\n      <div class="home-card-meta">EESTI KEEL · ONLINE + PRINDITAV · TASUTA</div>\n      <h3>Riimikaardid</h3>\n      <p>18 pildikaarti, millega harjutada riimuvaid sõnu, kinnistada sõnavara ja õppida mänguliselt.</p>\n      <a class="home-text-link" href="materials/riimid-preview/">Vaata materjali <span aria-hidden="true">→</span></a>\n    </div>\`;\n\n  grid.prepend(card);\n})();\n`;
    write(file, js);
  }

  const indexFile = 'index.html';
  let html = read(indexFile);
  html = html.replace(/home-refresh\.js\?v=\d+/, 'home-refresh.js?v=117');
  write(indexFile, html);
}

console.log('Riimikaardid published in Materials and Värskelt lisatud.');
