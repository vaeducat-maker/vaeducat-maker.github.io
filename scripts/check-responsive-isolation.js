const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const game = path.join(root, 'games', 'korrutamine-test');
const html = fs.readFileSync(path.join(game, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(game, 'game.css'), 'utf8');
const sw = fs.readFileSync(path.join(game, 'service-worker.js'), 'utf8');

const checks = [
  ['mobile cat remains the approved transparent asset', html.includes('src="assets/edukass-cat-transparent.png"')],
  ['desktop cat is isolated behind a desktop media source', html.includes('media="(min-width: 1101px)" srcset="assets/edukass-cat-battle.png"')],
  ['mobile layout guard exists', css.includes('@media(max-width:700px)') && css.includes('v104: responsive isolation guard')],
  ['desktop source is not the default image', !html.includes('<img class="hero-cat hero-cat-neutral" src="assets/edukass-cat-battle.png"')],
  ['v110 stylesheet is loaded', html.includes('game.css?v=110')],
  ['v110 script is loaded', html.includes('game.js?v=110')],
  ['v110 service-worker cache is active', sw.includes('edukass-korrutustabel-v110-education-design')],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
  if (!ok) failed = true;
}
process.exit(failed ? 1 : 0);
