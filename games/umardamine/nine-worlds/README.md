# EDUKASS Ümardamine — 9 kristallimaailma
**Preview / work-in-progress QA branch; not merged into EDUKASS's public site.**

## Launch
Open `index.html` in a browser or through an HTTPS static preview. There are no CDN images, music files or external library dependencies. Everything is inline in the standalone HTML. Enter the correct rounded number; the runner automatically jumps. An incorrect full answer or missing the deadline causes a physical collision, followed by a lesson showing the exact correct answer, the incorrectly entered digits if any, and the rounding rule. Replay generates fresh numbers.

## Worlds and curricula
1. **Valgussaar** — eight exercises, tens and an introduction to hundreds. Cyan long faceted crystal.
2. **Päikesekuru** — twelve exercises: 4 two-digit tens, 4 three-digit tens, 4 three-digit hundreds. Amber fire-lotus crystal.
3. **Mäevardjad** — twelve exercises; hundreds and first thousands. Purple obelisk crystal.
4. **Tormitasandik** — twelve exercises; mixed hundreds, thousands and ten-thousands. Electric orbit crystal.
5. **Kaksikorg** — twelve exercises; thousands, ten-thousands and hundred-thousands. Twin jade shards.
6. **Keeriseorg** — twelve exercises; up to millions. Pink spiral crystal.
7. **Täheväli** — twelve exercises; up to ten millions. Golden star crystal.
8. **Prismakants** — twelve exercises; up to hundred millions. Prism-crown crystal.
9. **Meteoritorm** — twelve exercises; large 8–9-digit input numbers and mixed millions / ten / hundred millions. Meteor crystal.

Total: **104 tasks per complete pass** (8 + 8 × 12), infinitely re-generating in practice from broad valid integer pools. The generator avoids exactly recent input numbers where feasible and tests the full expected round result. Correctly rounded answers at carry boundaries can be 10 digits; input accepts up to 12 digits.

## Maths-paced movement
The ordinary speed is deliberately separate from the **instant 850 world-pixel/s turbo** on an early correct answer. Worlds 1 and 2 preserve tested 64.5 and 47 normal speed (and safer 56.25 and 43 for their final tasks).

From world 3 onward, time is based on the length of the **correctly rounded answer**, not just the difficulty label. Let:
- `d` = decimal digit length of answer;
- `u` = decimal digit length of rounding unit (e.g. 4 for `1000`);
- `c` = 1 if carrying to a new most-significant digit, else 0.

The target response time is `T = 11.8 + 1.72 max(0,d-3) + 0.88 max(0,u-3) + 0.7c` seconds. Gameplay velocity = `clamp(500/T, 19, 47)` pixels/s. Because each new task begins around 514–580 world pixels before collision, the effective remaining time is approximately **11–30 seconds**, including longer time for 7–10 digit input.

| Typical answer | Rounding unit | Pace, approximate | Time to obstacle, approximate |
|---|---:|---:|---:|
| 3 digits | 100 | 42 px/s | 12–14 s |
| 4 digits | 1,000 | 35 px/s | 15–17 s |
| 5 digits | 10,000 | 29 px/s | 18–20 s |
| 6 digits | 100,000 | 26 px/s | 20–23 s |
| 7 digits | 1,000,000 | 23 px/s | 23–26 s |
| 8 digits | 10,000,000 | 20 px/s | 26–29 s |
| 9–10 digits | 100,000,000 | 19 px/s minimum | around 27–31 s |

Input and obstacles remain synchronized by 8-ms maximum physics substeps so fast turbo can neither tunnel through a hazard nor unfairly collide after a correct answer. A correct answer in the very last moments intentionally does **not** trigger an unfair turbo acceleration.

## Visual design / crystals
Each world has a distinct palette, abstract dynamic geometric scene, unique runner avatar and themed hazard sequence. Obstacle types may recur nonconsecutively several worlds later but should never all be the same as the previous world. The nine-slot vault uses separate SVG shapes and world-specific hues, persisted under `edukass-neon-crystal-vault-v1`. Winning world 9 invokes a **fusion cinematic**, assembling the nine collected gems into one **ÜLIM KRISTALL**. The ultimate reward is stored under `edukass-ultimate-crystal` and can be revisited from the full vault.

## Sound
Original generative electro-arcade / synth beat, not an existing copyrighted Geometry Dash song. Nine tempos from **124 to 158 BPM**, synthesized per beat with four-on-the-floor kick, high tick, bass and a melodic arpeggiator by Web Audio API. Music is muted by default; the player explicitly taps the sound button to activate. No external licensing or network fetch is necessary. This is a generated in-game loop rather than a professionally produced studio recording.

## Source and reproducibility
- `src/app.html` — template with `/*__CSS__*/` and `/*__JS__*/` placeholders
- `src/styles.css` — responsive layout, themes, effects and fusion cinematic
- `src/game.js` — all nine worlds, input/physics, rounding generator, audio and award collection
- `index.html` — combined playable self-contained build

Rebuild:
```python
from pathlib import Path
p=Path('games/umardamine/nine-worlds')
html=(p/'src/app.html').read_text(encoding='utf8')
html=html.replace('/*__CSS__*/',(p/'src/styles.css').read_text(encoding='utf8'))
html=html.replace('/*__JS__*/',(p/'src/game.js').read_text(encoding='utf8'))
(p/'index.html').write_text(html,encoding='utf8')
```

## QA record · 24 November 2026
- **Verified:** 9 complete automatically simulated runs, 104 correct steps each = **936 successful input+obstacle checks**; nine rewards and final fusion persisted. Tested at 145/230/360 px scene heights and 16/35/100 ms physics tick. At each stage correct arithmetic and large-digit input sizes were checked. Reroll uniqueness tested over multiple fresh rounds per world.
- **Verified:** no input longer than 12 digits and no JS source syntax errors; every JS-referenced HTML element exists in the build. Autonomous jump and acceleration use actual hitbox physics.
- **Not yet verified:** real browser visuals and responsiveness of *every* scene, audio listening test in browser, handheld input, full Chrome and Safari QA; preview links may be blocked by external static hosting. Before production release, complete manual browser QA and fix anything found.
- **Release status:** **prototype only**; do **not** merge automatically into `main` or expose as the production EDUKASS game until browser QA is complete.

The older car-based rally rules in `EDUKASS_UMARDAMISRALLI_RULES.md` are a historical standard for a different design. The later approved Geometry-Dash-like crystal runner supersedes its roads/postcards/car gameplay; maths accuracy and explicit browser QA remain mandatory.
