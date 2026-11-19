import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const src = resolve(root, 'src');
const dist = resolve(root, 'dist');
const release = resolve(root, 'release');
const project = resolve(release, 'project');
const assetRoot = await access(resolve(root, 'assets')).then(() => root).catch(() => dist);

const [template, style, script] = await Promise.all([
  readFile(resolve(src, 'index.template.html'), 'utf8'),
  readFile(resolve(src, 'styles.css'), 'utf8'),
  readFile(resolve(src, 'game.js'), 'utf8'),
]);
if (!template.includes('{{STYLE}}') || !template.includes('{{SCRIPT}}')) {
  throw new Error('Build placeholders are missing');
}
const html = template.replace('{{STYLE}}', style.trimEnd()).replace('{{SCRIPT}}', script.trimEnd());
const refs = [...new Set(html.match(/assets\/[A-Za-z0-9._-]+/g) || [])].sort();
if (!refs.length) throw new Error('No game assets found');
for (const ref of refs) await readFile(resolve(assetRoot, ref));

await mkdir(dist, { recursive: true });
await writeFile(resolve(dist, 'index.html'), html);
await mkdir(resolve(project, 'src'), { recursive: true });
await mkdir(resolve(project, 'assets'), { recursive: true });
await mkdir(resolve(project, 'tests'), { recursive: true });
await mkdir(resolve(project, 'tools'), { recursive: true });

const mime = new Map([
  ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'], ['.svg', 'image/svg+xml'],
]);
let standalone = html;
for (const ref of refs) {
  const file = resolve(assetRoot, ref);
  const data = await readFile(file);
  const type = mime.get(extname(file).toLowerCase());
  if (!type) throw new Error(`Unsupported asset type: ${ref}`);
  standalone = standalone.split(ref).join(`data:${type};base64,${data.toString('base64')}`);
  if (assetRoot !== dist) {
    await mkdir(dirname(resolve(dist, ref)), { recursive: true });
    await copyFile(file, resolve(dist, ref));
  }
  await copyFile(file, resolve(project, ref));
}

const standaloneName = 'EDUKASS_Umardamisralli_v44_Offline.html';
await writeFile(resolve(release, standaloneName), standalone);
await writeFile(resolve(project, 'index.html'), html);
for (const name of ['index.template.html', 'styles.css', 'game.js']) {
  await copyFile(resolve(src, name), resolve(project, 'src', name));
}
for (const name of ['independent-math-review.cjs', 'journey.html']) {
  await copyFile(resolve(root, 'tests', name), resolve(project, 'tests', name));
}
for (const name of ['build.mjs']) await copyFile(resolve(root, 'tools', name), resolve(project, 'tools', name));
for (const name of ['README.md', 'CHANGELOG.md', 'QA_REPORT.md']) {
  await copyFile(resolve(root, name), resolve(project, name));
}
await mkdir(resolve(project, 'rules'), { recursive: true });
await copyFile(resolve(root, 'rules/EDUKASS_UMARDAMISRALLI_RULES.md'), resolve(project, 'rules/EDUKASS_UMARDAMISRALLI_RULES.md'));
await mkdir(resolve(dist, 'tests'), { recursive: true });
await copyFile(resolve(root, 'tests/journey.html'), resolve(dist, 'tests/journey.html'));
await writeFile(resolve(release, 'asset-count.txt'), `${refs.length}\n`);

