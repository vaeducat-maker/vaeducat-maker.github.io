#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const buildPath = path.join(__dirname, 'build-public-site.js');
let source = fs.readFileSync(buildPath, 'utf8');

const anchor = "  'games/metsarada/index.html',";
const extraFiles = [
  'favicon-512.png',
  'assets/minu-suvi-preview.svg',
  'games/kiire-sonatreener/icon-192.png',
  'games/kiire-sonatreener/icon-512.png',
  'games/kiire-sonatreener/icon.svg',
  'games/kiire-sonatreener/index.html',
  'games/kiire-sonatreener/lesson-library.css',
  'games/kiire-sonatreener/manifest.webmanifest',
  'games/kiire-sonatreener/poster-fix.js',
  'games/kiire-sonatreener/poster-vesi-ja-jogi.webp',
  'games/kiire-sonatreener/poster-vesi-ja-jogi-v3.jpg',
  'games/kiire-sonatreener/trainer.css',
  'games/kiire-sonatreener/trainer.js',
  'games/liitmine/app.js',
  'games/liitmine/index.html',
  'games/liitmine/manifest.webmanifest',
  'games/liitmine/service-worker.js',
  'games/minu-suvi/index.html'
];

if (!source.includes(anchor)) {
  throw new Error('Cloudflare build anchor not found in build-public-site.js');
}

const injection = extraFiles.map(file => `  '${file}',`).join('\n');
source = source.replace(anchor, `${injection}\n\n${anchor}`);

const compiled = new Module(buildPath, module);
compiled.filename = buildPath;
compiled.paths = module.paths;
compiled._compile(source, buildPath);

const FACEBOOK_URL = 'https://www.facebook.com/share/1GH4qbcNqL/';
const INSTAGRAM_URL = 'https://www.instagram.com/edukass.ee/';
const STYLE_MARKER = 'edukass-cloudflare-chrome';
const SOCIAL_MARKER = 'edukass-social-links';
const BACK_MARKER = 'edukass-game-back';
const SHORTCUT_MARKER = 'edukass-shortcut-only';
const SHORTCUT_ONLY_PAGES = new Set([
  'games/kiire-sonatreener/index.html',
  'games/korrutamine-test/index.html'
]);

const sharedStyle = `
<style id="${STYLE_MARKER}">
.edukass-social-links{display:flex;align-items:center;gap:7px;margin-left:auto;flex:0 0 auto}
.edukass-social-link{width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--line,#d7e9ee);border-radius:50%;background:#fff;color:var(--ink,#18395f);text-decoration:none;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
.edukass-social-link:hover{transform:translateY(-1px);border-color:currentColor;box-shadow:0 5px 14px rgba(24,57,95,.10)}
.edukass-social-link:focus-visible{outline:3px solid rgba(57,170,152,.35);outline-offset:2px}
.edukass-social-link svg{width:19px;height:19px;display:block}
.edukass-game-back{display:inline-flex;align-items:center;gap:7px;margin:0 0 10px;padding:9px 13px;border:2px solid var(--blue,#1237b8);border-radius:999px;background:#fff;color:var(--blue,#1237b8);font-weight:900;font-size:14px;text-decoration:none;box-shadow:0 3px 0 rgba(18,55,184,.08)}
.edukass-game-back:active{transform:translateY(1px)}
.edukass-game-back:focus-visible{outline:4px solid rgba(244,183,31,.55);outline-offset:3px}
@media(max-width:520px){.edukass-social-link{width:36px;height:36px}.edukass-social-link svg{width:18px;height:18px}.edukass-game-back{font-size:13px;padding:8px 11px}}
</style>`;

const socialMarkup = `
    <div class="${SOCIAL_MARKER}" aria-label="EDUKASS sotsiaalmeedias">
      <a class="edukass-social-link" href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" aria-label="EDUKASS Facebookis" title="Facebook">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.2 8H17V4.2c-.5-.1-2-.2-3.5-.2C10.4 4 8.3 5.9 8.3 9.4V12H5v4h3.3v8h4V16h3.3l.5-4h-3.8V9.8c0-1.2.3-1.8 1.9-1.8Z"/></svg>
      </a>
      <a class="edukass-social-link" href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="EDUKASS Instagramis" title="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>
      </a>
    </div>`;

const shortcutOnlyScript = `
<script id="${SHORTCUT_MARKER}">
(() => {
  const button = document.getElementById('installGameButton');
  const dialog = document.getElementById('installDialog');
  const title = document.getElementById('installDialogTitle');
  const help = document.getElementById('installHelpText');
  const confirm = document.getElementById('confirmInstallButton');
  const continueButton = document.getElementById('continueInBrowserButton');
  if (!button || !dialog || !title || !help || !confirm) return;

  const safeButton = button.cloneNode(true);
  button.replaceWith(safeButton);

  safeButton.addEventListener('click', () => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    title.textContent = 'LISA TELEFONI AVAKUVALE';
    help.textContent = ios
      ? 'Ava Safari jagamise menüü ja vali „Lisa avakuvale“. See loob EDUKASSi veebilehe otsetee.'
      : 'Ava brauseri menüü (⋮) ja vali „Lisa avakuvale“ või „Loo otsetee“. See loob EDUKASSi veebilehe otsetee, mitte Androidi rakendust.';
    confirm.textContent = 'SELGE';
    confirm.dataset.action = 'shortcut-close';
    confirm.hidden = false;
    if (continueButton) continueButton.hidden = true;
    if (typeof dialog.showModal === 'function') dialog.showModal();
  });

  confirm.addEventListener('click', event => {
    if (confirm.dataset.action !== 'shortcut-close') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    dialog.close();
  }, true);
})();
</script>`;

function injectSharedStyle(html) {
  if (html.includes(`id="${STYLE_MARKER}"`)) return html;
  if (!html.includes('</head>')) throw new Error('Unable to inject EDUKASS shared chrome styles: </head> missing');
  return html.replace('</head>', `${sharedStyle}\n</head>`);
}

function walkHtmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkHtmlFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

let socialPages = 0;
let minuSuviBackLinks = 0;
let shortcutOnlyPages = 0;

for (const filePath of walkHtmlFiles(output)) {
  const relativePath = path.relative(output, filePath).split(path.sep).join('/');
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (SHORTCUT_ONLY_PAGES.has(relativePath)) {
    html = html.replace(/\s*<link\b[^>]*\brel=(['"])manifest\1[^>]*>\s*/i, '\n');

    if (relativePath === 'games/kiire-sonatreener/index.html') {
      html = html.replace(/\s*<meta\s+name=(['"])mobile-web-app-capable\1\s+content=(['"])yes\2\s*>\s*/i, '\n');
      if (!html.includes('icon-192.png')) {
        html = html.replace(
          '<link rel="icon" href="./icon.svg" type="image/svg+xml">',
          '<link rel="icon" href="./icon.svg" type="image/svg+xml">\n<link rel="icon" href="./icon-192.png" sizes="192x192" type="image/png">'
        );
      }
    }

    if (relativePath === 'games/korrutamine-test/index.html' && !html.includes(`id="${SHORTCUT_MARKER}"`)) {
      if (!html.includes('</body>')) throw new Error('Unable to add shortcut-only helper to Korrutustabel');
      html = html.replace('</body>', `${shortcutOnlyScript}\n</body>`);
    }

    if (/\brel=(['"])manifest\1/i.test(html)) {
      throw new Error(`PWA manifest link still present on shortcut-only page: ${relativePath}`);
    }

    shortcutOnlyPages += 1;
    changed = true;
  }

  if (html.includes('class="site-header"') && !html.includes(`class="${SOCIAL_MARKER}"`)) {
    const headerNav = /(<header class="site-header">[\s\S]*?<nav\b[^>]*>[\s\S]*?<\/nav>)/;
    if (!headerNav.test(html)) {
      throw new Error(`Unable to add social links to site header: ${relativePath}`);
    }
    html = html.replace(headerNav, `$1${socialMarkup}`);
    html = injectSharedStyle(html);
    socialPages += 1;
    changed = true;
  }

  if (relativePath === 'games/minu-suvi/index.html' && !html.includes(`class="${BACK_MARKER}"`)) {
    if (!html.includes('<div class="app">')) {
      throw new Error('Unable to add EDUKASS back link to Minu suvi');
    }
    html = html.replace(
      '<div class="app">',
      `<div class="app">\n  <a class="${BACK_MARKER}" href="/" aria-label="Tagasi EDUKASSi avalehele">← EDUKASS</a>`
    );
    html = injectSharedStyle(html);
    minuSuviBackLinks += 1;
    changed = true;
  }

  if (changed) fs.writeFileSync(filePath, html, 'utf8');
}

const multiplicationJsPath = path.join(output, 'games/korrutamine-test/game.js');
let multiplicationJs = fs.readFileSync(multiplicationJsPath, 'utf8');
const serviceWorkerRegistration = "if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(registration=>registration.update()).catch(()=>{});";
const serviceWorkerCleanup = "if('serviceWorker' in navigator)navigator.serviceWorker.getRegistrations().then(registrations=>Promise.all(registrations.filter(registration=>registration.scope.includes('/games/korrutamine-test/')).map(registration=>registration.unregister()))).catch(()=>{});if('caches' in window)caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('edukass-korrutustabel-')).map(key=>caches.delete(key)))).catch(()=>{});";
if (!multiplicationJs.includes(serviceWorkerRegistration)) {
  throw new Error('Unable to disable Korrutustabel service worker registration');
}
multiplicationJs = multiplicationJs.replace(serviceWorkerRegistration, serviceWorkerCleanup);
fs.writeFileSync(multiplicationJsPath, multiplicationJs, 'utf8');

if (socialPages === 0) throw new Error('No EDUKASS site-header pages were decorated with social links');
if (minuSuviBackLinks !== 1) throw new Error(`Expected one Minu suvi back link, got ${minuSuviBackLinks}`);
if (shortcutOnlyPages !== SHORTCUT_ONLY_PAGES.size) throw new Error(`Expected ${SHORTCUT_ONLY_PAGES.size} shortcut-only pages, got ${shortcutOnlyPages}`);

console.log(`Cloudflare chrome: social links added to ${socialPages} site pages; Minu suvi back link added; ${shortcutOnlyPages} trainers switched to shortcut-only mode.`);
