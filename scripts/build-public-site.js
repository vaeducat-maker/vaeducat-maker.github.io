const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.resolve(root, 'dist');
const MAX_STATIC_ASSET_BYTES = 25 * 1024 * 1024;
const MAX_FREE_PLAN_FILES = 20_000;

const publicFiles = [
  'apple-touch-icon.png',
  'favicon-192.png',
  'favicon-32.png',
  'favicon.ico',
  'home-refresh.js',
  'home.css',
  'index.html',
  'styles.css',

  'assets/korrutustabel.png',
  'assets/loika-kosmoserada.png',
  'assets/metsloomad-preview.png',
  'assets/metsloomad-social-preview.jpg',
  'assets/metsloomad-social-preview-v2.jpg',
  'assets/minu-tanased-ulesanded.jpg',
  'assets/minu-tunniplaan.png',
  'assets/mis-on-koolikotis-edukass.png',
  'assets/ristsonad-sugis-preview.png',
  'assets/umbermoot-pindala.png',

  'data/catalog.json',

  'downloads/korrutustabel-A4.pdf',
  'downloads/korrutustabel.pdf',
  'downloads/loika-kosmoserada.pdf',
  'downloads/metsloomad.pdf',
  'downloads/minu-tanased-ulesanded.pdf',
  'downloads/minu-tunniplaan.pdf',
  'downloads/ristsonad-sugis.pdf',
  'downloads/umbermoot-pindala-A4-4-kaarti.pdf',
  'downloads/umbermoot-pindala-A7.pdf',

  'games/koolikott/assets/joonlaud.png',
  'games/koolikott/assets/kustukumm.png',
  'games/koolikott/assets/liim.png',
  'games/koolikott/assets/pastakas.png',
  'games/koolikott/assets/pinal.png',
  'games/koolikott/assets/pliiats.png',
  'games/koolikott/assets/raamat.png',
  'games/koolikott/assets/vihik.png',
  'games/koolikott/assets/värvipliiatsid.png',
  'games/koolikott/assets/õpik.png',
  'games/koolikott/game-v12.css',
  'games/koolikott/game.js',
  'games/koolikott/index.html',

  'games/korrutamine-test/assets/edukass-cat-battle-mobile.png',
  'games/korrutamine-test/assets/edukass-cat-battle.png',
  'games/korrutamine-test/assets/edukass-cat-reward-joy-crop.png',
  'games/korrutamine-test/assets/edukass-cat-reward-joy.png',
  'games/korrutamine-test/assets/edukass-cat-reward-neutral-crop.png',
  'games/korrutamine-test/assets/edukass-cat-reward-surprise-crop.png',
  'games/korrutamine-test/assets/edukass-cat-reward-surprise.png',
  'games/korrutamine-test/assets/edukass-cat-transparent.png',
  'games/korrutamine-test/assets/edukass-cat.png',
  'games/korrutamine-test/assets/edukass-kolm-world.png',
  'games/korrutamine-test/assets/edukass-world-rocket.png',
  'games/korrutamine-test/assets/icon-192.png',
  'games/korrutamine-test/assets/icon-512.png',
  'games/korrutamine-test/assets/share-korrutustabel.png',
  'games/korrutamine-test/chapter-one.config.js',
  'games/korrutamine-test/game.css',
  'games/korrutamine-test/game.js',
  'games/korrutamine-test/i18n.js',
  'games/korrutamine-test/index.html',
  'games/korrutamine-test/locales/et.js',
  'games/korrutamine-test/manifest.webmanifest',
  'games/korrutamine-test/progress-store.js',
  'games/korrutamine-test/question-engine.js',
  'games/korrutamine-test/service-worker.js',

  'games/metsarada/index.html',

  'materials/index.html',
  'materials/koolikott/index.html',
  'materials/korrutustabel/index.html',
  'materials/loika-kosmoserada/index.html',
  'materials/matemaatika/index.html',
  'materials/metsloomad/index.html',
  'materials/metsloomad/mobiilne-toovihik/index.html',
  'materials/ristsonad-sugis/index.html',
  'materials/tanased-ulesanded/index.html',
  'materials/tunniplaan/index.html',
  'materials/umbermoot-pindala/index.html',

  'metsloomad/index.html',
  'privaatsus/index.html',
  'teemad/ajalugu-ja-kultuur/index.html',
  'teemad/loodus/index.html'
].sort(comparePaths);

const forbiddenOutputPrefixes = [
  '.git/',
  '.github/',
  'brand/',
  'docs/',
  'EDUKASS-site-v55-living-world-kolm/',
  'games/umbermoot-pindala/',
  'releases/',
  'scripts/',
  'tmp/'
];

const forbiddenOutputFiles = new Set([
  'AGENTS.md',
  'CATALOG_PROTECTION_RU.md',
  'CNAME',
  'README_RU.md',
  'RELEASE_REPORT_RU.md'
]);

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function platformPath(relativePath) {
  return path.join(...relativePath.split('/'));
}

function resolveInside(base, relativePath) {
  const resolved = path.resolve(base, platformPath(relativePath));
  assert(
    resolved === base || resolved.startsWith(`${base}${path.sep}`),
    `Path escapes its root: ${relativePath}`
  );
  return resolved;
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function relativeToOutput(filePath) {
  return path.relative(output, filePath).split(path.sep).join('/');
}

function targetExists(reference, sourceFile) {
  reference = reference
    .replaceAll('&quot;', '"')
    .replaceAll('&#34;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&#39;', "'")
    .replace(/^["']|["']$/g, '');
  if (
    !reference ||
    reference.includes('${') ||
    /^(?:https?:|mailto:|tel:|data:|blob:|javascript:|#)/i.test(reference)
  ) return true;

  let pathname = reference.split(/[?#]/, 1)[0];
  if (!pathname) return true;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const target = pathname.startsWith('/')
    ? resolveInside(output, pathname.replace(/^\/+/, ''))
    : path.resolve(path.dirname(sourceFile), platformPath(pathname));

  if (!(target === output || target.startsWith(`${output}${path.sep}`))) return false;
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return true;
  return fs.existsSync(path.join(target, 'index.html'));
}

function collectHtmlReferences(content) {
  const references = [];
  for (const match of content.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    references.push(match[1]);
  }
  for (const match of content.matchAll(/srcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(',')) {
      references.push(candidate.trim().split(/\s+/, 1)[0]);
    }
  }
  for (const match of content.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
    references.push(match[1]);
  }
  return references;
}

function collectCssReferences(content) {
  return [...content.matchAll(/url\(["']?([^"')]+)["']?\)/gi)].map(match => match[1]);
}

function verifyReferences(files) {
  const failures = [];
  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    if (!['.html', '.css'].includes(extension)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const references = extension === '.html'
      ? collectHtmlReferences(content)
      : collectCssReferences(content);
    for (const reference of references) {
      if (!targetExists(reference, filePath)) {
        failures.push(`${relativeToOutput(filePath)} -> ${reference}`);
      }
    }
  }
  assert.equal(failures.length, 0, `Missing local references:\n${failures.join('\n')}`);
}

function catalogPaths(product) {
  return [
    product.page,
    product.catalogPage,
    product.preview,
    product.game,
    product.workbook,
    ...(product.downloads || []),
    ...(product.related || []),
    ...(product.featuredPages || []),
    product.qrUrl && new URL(product.qrUrl).pathname
  ].filter(Boolean);
}

function verifyCatalog() {
  const catalogPath = path.join(output, 'data', 'catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const failures = [];
  for (const product of catalog.products) {
    for (const publicPath of catalogPaths(product)) {
      if (!targetExists(publicPath, catalogPath)) {
        failures.push(`${product.id} -> ${publicPath}`);
      }
    }
  }
  assert.equal(failures.length, 0, `Catalog paths missing from dist:\n${failures.join('\n')}`);
}

function verifyServiceWorker() {
  const serviceWorkerPath = path.join(output, 'games', 'korrutamine-test', 'service-worker.js');
  const content = fs.readFileSync(serviceWorkerPath, 'utf8');
  const assetList = content.match(/const ASSETS=\[(.*?)\];/s);
  assert(assetList, 'Unable to read the service worker asset list');
  const references = [...assetList[1].matchAll(/["']([^"']+)["']/g)].map(match => match[1]);
  const failures = references.filter(reference => !targetExists(reference, serviceWorkerPath));
  assert.equal(failures.length, 0, `Service worker assets missing from dist:\n${failures.join('\n')}`);
}

function verifyManifest() {
  const manifestPath = path.join(output, 'games', 'korrutamine-test', 'manifest.webmanifest');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const failures = (manifest.icons || [])
    .map(icon => icon.src)
    .filter(reference => !targetExists(reference, manifestPath));
  assert.equal(failures.length, 0, `Manifest icons missing from dist:\n${failures.join('\n')}`);
}

function build() {
  assert.equal(path.dirname(output), root, 'dist must be a direct child of the repository root');
  assert.equal(path.basename(output), 'dist', 'Unexpected output directory');
  assert.equal(new Set(publicFiles).size, publicFiles.length, 'Public whitelist contains duplicates');

  fs.rmSync(output, {recursive: true, force: true});
  fs.mkdirSync(output, {recursive: true});

  for (const relativePath of publicFiles) {
    const source = resolveInside(root, relativePath);
    assert(fs.existsSync(source), `Whitelisted source file is missing: ${relativePath}`);
    assert(fs.statSync(source).isFile(), `Whitelisted source is not a file: ${relativePath}`);
    const destination = resolveInside(output, relativePath);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.copyFileSync(source, destination);
  }

  const outputFiles = walk(output).sort((left, right) => comparePaths(relativeToOutput(left), relativeToOutput(right)));
  const outputRelativePaths = outputFiles.map(relativeToOutput);
  assert.deepEqual(outputRelativePaths, publicFiles, 'dist differs from the public whitelist');
  assert(outputFiles.length <= MAX_FREE_PLAN_FILES, 'dist exceeds the Workers Free static asset file limit');

  for (const filePath of outputFiles) {
    const relativePath = relativeToOutput(filePath);
    assert(!forbiddenOutputFiles.has(relativePath), `Forbidden internal file in dist: ${relativePath}`);
    assert(
      !forbiddenOutputPrefixes.some(prefix => relativePath.startsWith(prefix)),
      `Forbidden internal path in dist: ${relativePath}`
    );
    assert(
      fs.statSync(filePath).size <= MAX_STATIC_ASSET_BYTES,
      `Static asset exceeds 25 MiB: ${relativePath}`
    );
  }

  verifyReferences(outputFiles);
  verifyCatalog();
  verifyManifest();
  verifyServiceWorker();

  const digest = crypto.createHash('sha256');
  for (const relativePath of outputRelativePaths) {
    digest.update(`${relativePath}\0`);
    digest.update(fs.readFileSync(resolveInside(output, relativePath)));
    digest.update('\0');
  }

  const totalBytes = outputFiles.reduce((sum, filePath) => sum + fs.statSync(filePath).size, 0);
  const largest = outputFiles
    .map(filePath => ({path: relativeToOutput(filePath), size: fs.statSync(filePath).size}))
    .sort((left, right) => right.size - left.size)[0];

  console.log('EDUKASS public build');
  console.log(`Files: ${outputFiles.length}`);
  console.log(`Bytes: ${totalBytes}`);
  console.log(`Largest: ${largest.path} (${largest.size} bytes)`);
  console.log(`SHA-256: ${digest.digest('hex')}`);
  console.log('Checks: whitelist, internal exclusions, local links, catalog, manifest and service worker passed.');
}

build();
