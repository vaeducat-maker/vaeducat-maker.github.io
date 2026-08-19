#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {buildPublicValues, renderMaterialDocument, validateMaterialMetadata} = require('./material-metadata');

const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/catalog.json'), 'utf8'));
const product = catalog.products.find(item => item.id === 'metsloomad');

let result = validateMaterialMetadata(catalog, {rootDirectory: root});
assert.deepEqual(result.errors, [], 'Current generated metadata must match data/catalog.json.');
assert.equal(product.qrUrl, 'https://edukass.ee/metsloomad/', 'The printed QR URL must remain permanent.');

const changedQrProduct = structuredClone(product);
changedQrProduct.qrUrl = 'https://edukass.ee/uus-metsloomad/';
result = validateMaterialMetadata({products: [changedQrProduct]}, {rootDirectory: root});
assert.ok(
  result.errors.some(error => error.includes('püsiv QR URL') || error.includes('постоянный QR URL')),
  'Changing the permanent QR URL must be rejected.'
);

const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const staleHomepage = homepage.replace(
  'EESTI KEEL · TASUTA',
  'EESTI KEEL · A2 · 9–11 AASTAT · TASUTA'
);
assert.notEqual(staleHomepage, homepage, 'The stale-metadata fixture must alter the homepage.');
result = validateMaterialMetadata(catalog, {
  rootDirectory: root,
  fileContents: new Map([['index.html', staleHomepage]])
});
assert.ok(
  result.errors.some(error => error.includes('index.html') && error.includes('не синхронизированы')),
  'A stale public value must be rejected.'
);

const missingFieldHomepage = homepage.replace(
  'data-material-field="meta"',
  'data-material-field="legacy-meta"'
);
result = validateMaterialMetadata(catalog, {
  rootDirectory: root,
  fileContents: new Map([['index.html', missingFieldHomepage]])
});
assert.ok(
  result.errors.some(error => error.includes('отсутствует поле metsloomad.meta')),
  'Removing a generated field marker must be rejected.'
);

const publicValues = buildPublicValues(product, 'index.html');
const productWithDifferentInternalGuidance = structuredClone(product);
productWithDifferentInternalGuidance.internal = {cefr: 'INTERNAL-ONLY', recommendedAge: 'INTERNAL-ONLY'};
assert.deepEqual(
  buildPublicValues(productWithDifferentInternalGuidance, 'index.html'),
  publicValues,
  'Internal pedagogical guidance must not affect public metadata.'
);

const futureProduct = {
  id: 'future-material',
  title: 'Tulevane materjal',
  type: 'material',
  status: 'published',
  priceType: 'free',
  category: 'matemaatika',
  description: 'Ühe tulevase õppematerjali kirjeldus.',
  page: '/materials/tulevane/',
  catalogPage: '/materials/',
  featuredPages: ['/'],
  preview: '/assets/tulevane.png',
  previewAlt: 'Tulevase õppematerjali eelvaade',
  downloads: ['/downloads/tulevane.pdf'],
  metadataSync: true,
  internal: {recommendedAge: 'INTERNAL-ONLY'}
};
const cardTemplate = id => `<article>
  <div data-material-id="${id}" data-material-field="preview"></div>
  <div data-material-id="${id}" data-material-field="meta"></div>
  <h3 data-material-id="${id}" data-material-field="title"></h3>
  <p data-material-id="${id}" data-material-field="description"></p>
  <a data-material-id="${id}" data-material-field="page"></a>
</article>`;
const materialTemplate = id => `<html><head>
  <title data-material-id="${id}" data-material-field="document-title"></title>
  <meta data-material-id="${id}" data-material-field="meta-description">
</head><body>
  <span data-material-id="${id}" data-material-field="breadcrumb-category"></span>
  <span data-material-id="${id}" data-material-field="breadcrumb-title"></span>
  <div data-material-id="${id}" data-material-field="preview"></div>
  <div data-material-id="${id}" data-material-field="meta"></div>
  <h1 data-material-id="${id}" data-material-field="title"></h1>
  <p data-material-id="${id}" data-material-field="description"></p>
  <a data-material-id="${id}" data-material-field="download"></a>
</body></html>`;
const futureFiles = new Map([
  ['index.html', renderMaterialDocument(cardTemplate(futureProduct.id), futureProduct, 'index.html', 'card').html],
  ['materials/index.html', renderMaterialDocument(cardTemplate(futureProduct.id), futureProduct, 'materials/index.html', 'card').html],
  ['materials/tulevane/index.html', renderMaterialDocument(materialTemplate(futureProduct.id), futureProduct, 'materials/tulevane/index.html', 'material').html]
]);
result = validateMaterialMetadata({products: [futureProduct]}, {
  rootDirectory: root,
  fileContents: futureFiles
});
assert.deepEqual(
  result.errors,
  [],
  'The shared mechanism must support a future material without product-specific code.'
);

console.log('Material metadata self-test: PASS (stale values, missing bindings and QR URL changes are blocked; internal metadata stays private; future materials reuse the same mechanism).');
