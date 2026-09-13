#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'source-assets', 'hommikulood-pdf');
const output = path.join(root, 'downloads', 'hommikulood.pdf');
const parts = ['part-00.b64', 'part-01.b64', 'part-02.b64', 'part-03.b64'];

const packedBase64 = parts
  .map(name => fs.readFileSync(path.join(sourceDir, name), 'utf8').trim())
  .join('');

const packed = Buffer.from(packedBase64, 'base64');
const pdf = zlib.gunzipSync(packed);

if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
  throw new Error('Restored Hommikulood file is not a PDF');
}

fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, pdf);

const sha256 = crypto.createHash('sha256').update(pdf).digest('hex');
console.log(`Restored downloads/hommikulood.pdf (${pdf.length} bytes, sha256 ${sha256})`);
