#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'source-assets', 'hommikulood-pdf');
const fixedDir = path.join(sourceDir, 'fixed');
const output = path.join(root, 'downloads', 'hommikulood.pdf');
const EXPECTED_PDF_BYTES = 1517541;
const EXPECTED_PDF_SHA256 = 'a591f6db397e92783ae0cbfc17443e59eae4181c0350fd68bc094f102105279a';
const EXPECTED_TEMPLATE_SHA256 = '11312950145a466ad6398cbef2570b9e71b081031c19a9c239ac9e2e1c1ae22c';

const templateParts = [
  path.join(sourceDir, 'part-00.b64'),
  path.join(fixedDir, 'p01-0.b64'),
  path.join(fixedDir, 'p01-1.b64'),
  path.join(fixedDir, 'p01-2.b64'),
  path.join(fixedDir, 'p01-3.b64'),
  path.join(sourceDir, 'part-02.b64'),
  path.join(fixedDir, 'p03-0.b64'),
  path.join(fixedDir, 'p03-1.b64'),
  path.join(fixedDir, 'p03-2.b64'),
  path.join(fixedDir, 'p03-3.b64'),
  path.join(fixedDir, 'p04-0.b64'),
  path.join(fixedDir, 'p04-1.b64'),
  path.join(fixedDir, 'p04-2.b64'),
  path.join(fixedDir, 'p04-3.b64'),
  path.join(fixedDir, 'p05-0.b64'),
  path.join(fixedDir, 'p05-1.b64'),
  path.join(fixedDir, 'p05-2.b64'),
  path.join(fixedDir, 'p05-3.b64'),
  path.join(fixedDir, 'p06.b64')
];

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function ascii85Encode(buffer) {
  let encoded = '';
  for (let offset = 0; offset < buffer.length; offset += 4) {
    const count = Math.min(4, buffer.length - offset);
    let value = 0;
    for (let index = 0; index < 4; index += 1) {
      value = value * 256 + (index < count ? buffer[offset + index] : 0);
    }

    if (count === 4 && value === 0) {
      encoded += 'z';
      continue;
    }

    const chars = new Array(5);
    for (let index = 4; index >= 0; index -= 1) {
      chars[index] = String.fromCharCode((value % 85) + 33);
      value = Math.floor(value / 85);
    }
    encoded += chars.slice(0, count + 1).join('');
  }
  return Buffer.from(`${encoded}~>`, 'ascii');
}

function replaceOnce(source, marker, replacement) {
  const markerBuffer = Buffer.from(marker, 'ascii');
  const first = source.indexOf(markerBuffer);
  if (first < 0) throw new Error(`Missing PDF placeholder: ${marker}`);
  if (source.indexOf(markerBuffer, first + markerBuffer.length) >= 0) {
    throw new Error(`Duplicate PDF placeholder: ${marker}`);
  }
  return Buffer.concat([
    source.subarray(0, first),
    replacement,
    source.subarray(first + markerBuffer.length)
  ]);
}

const packedBase64 = templateParts
  .map(filePath => fs.readFileSync(filePath, 'utf8').trim())
  .join('');

const packedTemplate = Buffer.from(packedBase64, 'base64');
let pdf = zlib.gunzipSync(packedTemplate);

const templateSha256 = sha256(pdf);
if (templateSha256 !== EXPECTED_TEMPLATE_SHA256) {
  throw new Error(`Unexpected Hommikulood PDF template hash: ${templateSha256}`);
}

for (let story = 1; story <= 4; story += 1) {
  const imagePath = path.join(root, 'materials', 'hommikulood', 'assets', `story-${story}.jpg`);
  const image = fs.readFileSync(imagePath);
  pdf = replaceOnce(pdf, `@@EDUKASS_STORY_${story}_A85@@`, ascii85Encode(image));
}

if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
  throw new Error('Restored Hommikulood file is not a PDF');
}

const actualSha256 = sha256(pdf);
if (pdf.length !== EXPECTED_PDF_BYTES || actualSha256 !== EXPECTED_PDF_SHA256) {
  throw new Error(
    `Canonical Hommikulood PDF mismatch: ${pdf.length} bytes, sha256 ${actualSha256}`
  );
}

fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, pdf);
console.log(`Restored exact canonical downloads/hommikulood.pdf (${pdf.length} bytes, sha256 ${actualSha256})`);
