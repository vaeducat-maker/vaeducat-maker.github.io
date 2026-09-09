#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

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
