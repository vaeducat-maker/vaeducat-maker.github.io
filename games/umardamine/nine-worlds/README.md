# EDUKASS Ümardamine — 9 kristallimaailma
**Preview / work-in-progress QA branch; not merged into EDUKASS's public site.**

## Launch
Open `index.html` in a browser or through an HTTPS static preview. There are no CDN images, music files or external library dependencies. Everything is inline in the standalone HTML. Enter the correct rounded number; the runner automatically jumps. An incorrect full answer or missing the deadline causes a physical collision, followed by a lesson showing the exact correct answer, the incorrectly entered digits if any, and the rounding rule. Replay generates fresh numbers.

## Maths curriculum — approved 24 November 2026

The mathematics engine uses **three independent dimensions** for each example: (1) magnitude / digit count of the starting number, (2) requested rounding unit, and (3) the mathematical situation (up/down, threshold 4/5, carry, internal zero). **Never generate an input already divisible by the requested unit.** Example 3 400 rounded to hundreds = 3 400 is intentionally excluded, following the EDUKASS owner's decision.

### Spiral progression: exact per-world quotas
| World | Tens (10) | Hundreds (100) | Thousands (1,000) | Ten-thousands (10,000) | Hundred-thousands (100,000) | Millions | Ten-millions | Hundred-millions |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1. Valgussaar (8) | 7 | 1 | – | – | – | – | – | – |
| 2. Päikesekuru (12) | 7 | 5 | – | – | – | – | – | – |
| 3. Mäevardjad (12) | 3 | 4 | 5 | – | – | – | – | – |
| 4. Tormitasandik (12) | 2 | 3 | 4 | 3 | – | – | – | – |
| 5. Kaksikorg (12) | – | 2 | 3 | 4 | 3 | – | – | – |
| 6. Keeriseorg (12) | – | – | 2 | 3 | 4 | 3 | – | – |
| 7. Täheväli (12) | – | – | – | 2 | 3 | 4 | 3 | – |
| 8. Prismakants (12) | – | – | – | – | 2 | 3 | 4 | 3 |
| 9. Meteoritorm (12) | 1 | 2 | 2 | 2 | 1 | 1 | 1 | 2 |

The final world comprehensively rechecks **all eight studied rounding units** on large numbers. Rounding unit does **not** mechanically follow the leading number magnitude: four-, five-, or nine-digit input numbers can be rounded to tens or hundreds if the world has introduced those units.

World 1 preserves two-digit introductory tasks and one final hundreds task. World 2 begins with two approachable two-digit tens examples, then mixes tens and hundreds. In worlds 3–8, the first two positions revise simpler units; other task-unit combinations and situations are shuffled. For worlds 2–9, the engine rejects any four consecutive identical rounding units.

### Each world deliberately includes essential situations
- **World 1, eight tasks:** 4 downward and 4 upward outcomes including one exact 4, one exact 5, one carry across a place, one interior zero and ordinary mixed cases.
- **Worlds 2–9, twelve tasks:** 6 downward, 6 upward outcomes including one exact 4, one exact 5, two carry cases, one internal-zero/down and one internal-zero/up, alongside regular varied examples.
- Carry means the rounded answer crosses the next power-of-ten place (e.g. `9 950 → 10 000` when rounding to hundreds), not an arbitrary input whose first digit changes.
- Internal zeros are *within* the original numeral, not merely a trailing zero (e.g. `406 → 400` to hundreds, `105 → 110` to tens).
- Already-round inputs are categorically excluded for this exercise (e.g. no `3 400 → 3 400` when rounding to hundreds).
- Numbers and task order change between attempts, avoiding recently used inputs when possible. All values are safely represented in integer JavaScript arithmetic.

### Example of place-awareness
`3 482` rounded to tens → `3 480`, to hundreds → `3 500`, to thousands → `3 000`. These are illustrative *types*, not three mandatory consecutive questions. The generator chooses the rounding unit separately from the length of the displayed number.

Total: **104 tasks** per complete nine-world pass (8 + 8 × 12), from large independent random integer ranges. Highest inputs are nine digits; carry can yield a ten-digit correct result. Input supports up to 12 digits, for comfortable handling of all supported cases.

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
- **Math curriculum verified (24 November 2026):** 900 independently generated rounds (100 per world), **10,400 examples**, checked for unit quotas, 4/5 boundary cases, the two carry cases, internal zeros, 6 down/6 up for 12-exercise worlds, no already-rounded inputs, and mixed unit ordering. Nine complete simulated journeys after the rewrite produced another **936 correctly answered and jumped obstacles**.
- **Headless Chromium browser QA PASSED:** GitHub Actions run [45487954982](https://github.com/vaeducat-maker/vaeducat-maker.github.io/actions/runs/45487954982) passed all nine worlds, 104 tasks, math distribution checks (20 freshly randomized practice rounds per world), navigation, touchscreen-style keypad clicks, nine rewards and the final fusion. Zero page errors in this run. Portrait screenshots were archived by GitHub Actions. This is a functional browser test, not a guarantee of polished visuals.
- **Not yet verified:** manual visual examination of each screenshot and every scene, real Android handheld input, real audio listening, Safari compatibility and public preview host access. Run manual QA before production release.
- **Release status:** **prototype only**; do **not** merge automatically into `main` or expose as the production EDUKASS game until browser QA is complete.

The older car-based rally rules in `EDUKASS_UMARDAMISRALLI_RULES.md` are a historical standard for a different design. The later approved Geometry-Dash-like crystal runner supersedes its roads/postcards/car gameplay; maths accuracy and explicit browser QA remain mandatory.
