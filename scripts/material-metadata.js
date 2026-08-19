#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'data/catalog.json');
const PUBLIC_ORIGIN = 'https://edukass.ee';

const CATEGORY_LABELS = Object.freeze({
  'eesti-keel': 'EESTI KEEL',
  'kaelised-oskused': 'KÄELISED OSKUSED',
  'korraldus-ja-planeerimine': 'KORRALDUS JA PLANEERIMINE',
  matemaatika: 'MATEMAATIKA',
  muu: 'MUU'
});

const CATEGORY_TITLES = Object.freeze({
  'eesti-keel': 'Eesti keel',
  'kaelised-oskused': 'Käelised oskused',
  'korraldus-ja-planeerimine': 'Korraldus ja planeerimine',
  matemaatika: 'Matemaatika',
  muu: 'Muu'
});

const CATEGORY_SEO = Object.freeze({
  'eesti-keel': 'eesti keele',
  'kaelised-oskused': 'käeliste oskuste',
  'korraldus-ja-planeerimine': 'korralduse ja planeerimise',
  matemaatika: 'matemaatika',
  muu: 'õppe'
});

const PRICE_LABELS = Object.freeze({
  free: 'TASUTA'
});

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

function pageDocument(siteUrl) {
  const url = new URL(String(siteUrl), `${PUBLIC_ORIGIN}/`);
  let relative = url.pathname.replace(/^\/+/, '');
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  return relative;
}

function relativePublicUrl(documentFile, publicUrl) {
  const sourceDirectory = path.posix.dirname(documentFile.replace(/\\/g, '/'));
  const url = new URL(String(publicUrl), `${PUBLIC_ORIGIN}/`);
  if (url.origin !== PUBLIC_ORIGIN) return url.href;
  const pathname = url.pathname;
  const suffix = url.search + url.hash;
  const target = pathname.replace(/^\/+/, '');
  let relative = path.posix.relative(sourceDirectory === '.' ? '' : sourceDirectory, target);
  if (!relative) relative = './';
  if (pathname.endsWith('/') && !relative.endsWith('/')) relative += '/';
  return relative + suffix;
}

function buildPublicValues(product, documentFile) {
  const categoryLabel = CATEGORY_LABELS[product.category];
  const categoryTitle = CATEGORY_TITLES[product.category];
  const priceLabel = PRICE_LABELS[product.priceType];
  const page = relativePublicUrl(documentFile, product.page);
  const values = {
    title: product.title,
    description: product.description,
    meta: [categoryLabel, priceLabel].filter(Boolean).join(' · '),
    'document-title': `${product.title} — EDUKASS`,
    'meta-description': `${product.priceType === 'free' ? 'Tasuta ' : ''}${CATEGORY_SEO[product.category] || ''} õppematerjal: ${product.description}`.trim(),
    'breadcrumb-category': categoryTitle,
    'breadcrumb-title': product.title,
    page,
    canonical: new URL(product.page, `${PUBLIC_ORIGIN}/`).href,
    redirect: `0; url=${page}`,
    'redirect-script': `window.location.replace(${JSON.stringify(page)});`,
    preview: relativePublicUrl(documentFile, product.preview),
    'preview-alt': product.previewAlt
  };
  if (product.game) values.game = relativePublicUrl(documentFile, product.game);
  if (product.workbook) values.workbook = relativePublicUrl(documentFile, product.workbook);
  if (product.downloads?.[0]) values.download = relativePublicUrl(documentFile, product.downloads[0]);
  return values;
}

function fieldLookaheads(productId, field) {
  const id = productId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const name = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `(?=[^>]*\\bdata-material-id=["']${id}["'])(?=[^>]*\\bdata-material-field=["']${name}["'])`;
}

function replaceTextField(html, productId, field, value) {
  const lookaheads = fieldLookaheads(productId, field);
  const expression = new RegExp(`<([a-z][\\w:-]*)${lookaheads}([^>]*)>[\\s\\S]*?<\\/\\1>`, 'gi');
  let count = 0;
  const output = html.replace(expression, (match, tag, attributes) => {
    count += 1;
    return `<${tag}${attributes}>${escapeText(value)}</${tag}>`;
  });
  return {html: output, count};
}

function setAttribute(attributes, name, value) {
  const expression = new RegExp(`(\\s${name}=)(["'])([\\s\\S]*?)\\2`, 'i');
  const escaped = escapeAttribute(value);
  if (expression.test(attributes)) return attributes.replace(expression, `$1"${escaped}"`);
  return `${attributes} ${name}="${escaped}"`;
}

function replaceAttributeField(html, productId, field, attributes) {
  const lookaheads = fieldLookaheads(productId, field);
  const expression = new RegExp(`<([a-z][\\w:-]*)${lookaheads}([^>]*)>`, 'gi');
  let count = 0;
  const output = html.replace(expression, (match, tag, currentAttributes) => {
    count += 1;
    let nextAttributes = currentAttributes;
    for (const [name, value] of Object.entries(attributes)) {
      nextAttributes = setAttribute(nextAttributes, name, value);
    }
    return `<${tag}${nextAttributes}>`;
  });
  return {html: output, count};
}

function renderMaterialDocument(html, product, documentFile, surface) {
  const values = buildPublicValues(product, documentFile);
  const required = surface === 'material'
    ? ['document-title', 'meta-description', 'breadcrumb-category', 'breadcrumb-title', 'preview', 'meta', 'title', 'description']
    : surface === 'redirect'
      ? ['document-title', 'canonical', 'redirect', 'redirect-script', 'page']
      : ['preview', 'meta', 'title', 'description', 'page'];
  if (surface === 'material' && product.game) required.push('game');
  if (surface === 'material' && product.workbook) required.push('workbook');
  if (surface === 'material' && product.downloads?.[0]) required.push('download');

  const textFields = new Set([
    'title', 'description', 'meta', 'document-title', 'breadcrumb-category', 'breadcrumb-title', 'redirect-script'
  ]);
  const counts = {};
  let output = html;

  for (const field of required) {
    let result;
    if (field === 'preview') {
      result = replaceAttributeField(output, product.id, field, {
        style: `--material-preview: url("${values.preview}")`,
        'aria-label': values['preview-alt']
      });
    } else if (field === 'meta-description' || field === 'redirect') {
      result = replaceAttributeField(output, product.id, field, {content: values[field]});
    } else if (field === 'canonical') {
      result = replaceAttributeField(output, product.id, field, {href: values[field]});
    } else if (textFields.has(field)) {
      result = replaceTextField(output, product.id, field, values[field]);
    } else {
      result = replaceAttributeField(output, product.id, field, {href: values[field]});
    }
    counts[field] = result.count;
    output = result.html;
  }

  return {html: output, counts, required};
}

function materialDocuments(product) {
  const documents = new Map();
  documents.set(pageDocument(product.page), 'material');
  if (product.qrUrl) documents.set(pageDocument(product.qrUrl), 'redirect');
  documents.set(pageDocument(product.catalogPage), 'card');
  for (const page of product.featuredPages || []) documents.set(pageDocument(page), 'card');
  return documents;
}

function validateProductSource(product) {
  const errors = [];
  for (const field of ['id', 'title', 'description', 'category', 'priceType', 'page', 'catalogPage', 'preview', 'previewAlt']) {
    if (!product[field]) errors.push(`${product.id || 'material'}: отсутствует каноническое поле ${field}`);
  }
  if (!CATEGORY_LABELS[product.category]) errors.push(`${product.id}: неизвестная публичная категория ${product.category}`);
  if (!PRICE_LABELS[product.priceType]) errors.push(`${product.id}: неизвестный публичный тип цены ${product.priceType}`);
  if (product.qrUrl) {
    const expectedQrUrl = new URL(`/${product.id}/`, `${PUBLIC_ORIGIN}/`).href;
    if (product.qrUrl !== expectedQrUrl) {
      errors.push(`${product.id}: постоянный QR URL должен оставаться ${expectedQrUrl}`);
    }
  }
  return errors;
}

function validateMaterialMetadata(catalog, options = {}) {
  const rootDirectory = options.rootDirectory || root;
  const fileContents = options.fileContents || new Map();
  const errors = [];
  const changed = [];

  for (const product of catalog.products.filter(item => item.metadataSync === true)) {
    const sourceErrors = validateProductSource(product);
    errors.push(...sourceErrors);
    if (sourceErrors.length) continue;

    for (const [documentFile, surface] of materialDocuments(product)) {
      const absolutePath = path.join(rootDirectory, documentFile);
      let original;
      if (fileContents.has(documentFile)) original = fileContents.get(documentFile);
      else if (fs.existsSync(absolutePath)) original = fs.readFileSync(absolutePath, 'utf8');
      else {
        errors.push(`${product.id}: отсутствует публичное представление ${documentFile}`);
        continue;
      }

      const rendered = renderMaterialDocument(original, product, documentFile, surface);
      for (const field of rendered.required) {
        if (!rendered.counts[field]) errors.push(`${documentFile}: отсутствует поле ${product.id}.${field}`);
      }
      if (rendered.html !== original) {
        changed.push({documentFile, html: rendered.html});
        errors.push(`${documentFile}: публичные метаданные ${product.id} не синхронизированы с data/catalog.json`);
      }
    }
  }

  return {errors, changed};
}

function syncMaterialMetadata(catalog, options = {}) {
  const rootDirectory = options.rootDirectory || root;
  const validation = validateMaterialMetadata(catalog, {rootDirectory});
  const syncErrors = validation.errors.filter(error => !error.includes('не синхронизированы с data/catalog.json'));
  if (syncErrors.length) return {errors: syncErrors, changed: []};
  for (const change of validation.changed) {
    fs.writeFileSync(path.join(rootDirectory, change.documentFile), change.html, 'utf8');
  }
  return {errors: [], changed: validation.changed.map(change => change.documentFile)};
}

if (require.main === module) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  if (process.argv.includes('--write')) {
    const result = syncMaterialMetadata(catalog);
    for (const error of result.errors) console.error('ERROR:', error);
    if (result.errors.length) process.exit(1);
    console.log(`Material metadata sync: ${result.changed.length ? `updated ${result.changed.join(', ')}` : 'already current'}`);
  } else {
    const result = validateMaterialMetadata(catalog);
    for (const error of result.errors) console.error('ERROR:', error);
    if (result.errors.length) process.exit(1);
    console.log('Material metadata check: PASS');
  }
}

module.exports = {
  buildPublicValues,
  pageDocument,
  relativePublicUrl,
  renderMaterialDocument,
  validateMaterialMetadata,
  syncMaterialMetadata
};
