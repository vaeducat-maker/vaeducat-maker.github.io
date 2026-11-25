# EDUKASS Ümardamine — 9 kristallimaailma
**Preview / work-in-progress QA branch; not merged into EDUKASS's public site.**

## Launch
Open `index.html` in a browser or through an HTTPS static preview. There are no CDN images, external audio hosts or external runtime dependencies. The HTML inlines the JavaScript, CSS and QR encoder, while its two approved MP3 sound files are served from the local `assets/` folder. Enter the correct rounded number; the runner automatically jumps. An incorrect full answer or missing the deadline causes a physical collision, followed by a lesson showing the exact correct answer, the incorrectly entered digits if any, and the rounding rule. Replay generates fresh numbers.

## Maths curriculum — approved 24 November 2026

The mathematics engine uses **three independent dimensions** for each example: (1) magnitude / digit count of the starting number, (2) requested rounding unit, and (3) the mathematical situation (up/down, threshold 4/5, carry, internal zero). **Never generate an input already divisible by the requested unit.** Example 3 400 rounded to hundreds = 3 400 is intentionally excluded, following the EDUKASS owner's decision.

### Spiral progression: exact per-world quotas
| World | Tens (10) | Hundreds (100) | Thousands (1,000) | Ten-thousands (10,000) | Hundred-thousands (100,000) | Millions | Ten-millions | Hundred-millions |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1. Valgussaar (8) | 7 | 1 | – | – | – | – | – | – |
| 2. Päikesekuru (12) | 7 | 5 | – | – | – | – | – | – |
| 3. Mäevardjad (12) | 3 | 4 | 5 | – | – | – | – | – |
| 4. Tormitasandik (12) | 2 | 3 | 4 | 3 | – | – | – | – |
| 5. Kaksikorg (12) | 2 | 1 | 2 | 4 | 3 | – | – | – |
| 6. Keeriseorg (12) | 2 | – | 1 | 2 | 4 | 3 | – | – |
| 7. Täheväli (12) | 2 | – | – | 1 | 2 | 4 | 3 | – |
| 8. Prismakants (12) | 2 | – | – | – | 1 | 2 | 4 | 3 |
| 9. Meteoritorm (12) | 2 | 1 | 2 | 2 | 1 | 1 | 1 | 2 |

The final world comprehensively rechecks **all eight studied rounding units**, mixing small tens review with large numbers. Rounding unit does **not** mechanically follow the leading number magnitude: four-, five-, or nine-digit input numbers can be rounded to tens or hundreds if the world has introduced those units.

World 1 preserves two-digit introductory tasks and one final hundreds task. World 2 begins with two approachable two-digit tens examples, then mixes tens and hundreds. In worlds 3–9, the first two positions revise earlier units. Two two-digit tens tasks (one up and one down) are guaranteed in positions 4–7 and 9–11, randomly mixed with ten other tasks. For worlds 2–9, the engine rejects any four consecutive identical rounding units.

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
Approved sound: **Solar Spark #2** at 136 BPM, an original electronic track that loops across the game, and **Soft Oops #1** at collision. Both are shipped from local MP3 assets. Music begins only after the user explicitly presses the sound control and pauses when the game is interrupted or a transfer dialog opens. The other generative electronic beat prototype remains in source only as historical fallback logic but is not called during gameplay.

## Approved music, cinematic title, sharing and progress transfer · November 2026

**Approved selections:** Solar Spark #2 (136 BPM, original EDM-inspired arcade track) and Soft Oops #1 (brief friendly three-tone collision sound). Audio files are shipped locally with the game in `assets/02_solar_spark.mp3` and `assets/01_soft_oops.mp3`, generated by `scripts/generate_approved_audio.py`, so there is no third-party streaming, tracking or music licensing requirement. User turns sound on explicitly; volume is set to 32% (music) and 53% (loss). Music pauses during collision, celebrations and dialogs; the chosen gentle loss sound replaces the previous harsh sawtooth impact.

**Opening screen:** cinematic title "ÜMARDAMISE KRISTALLIRÄNNAK", a dynamically rendered row of nine distinct crystals, current world preview, crystal vault, "ALUSTA MÄNGU", "JAGA MÄNGU", and "MINU EDUSAMMUD · TEINE SEADE". Compact mobile top bar repeats both share and save actions. Reward and vault screens include save buttons.

**Sharing** has two separate intentions, matching earlier EDUKASS games:
- **Public game link / JAGA MÄNGU:** an ordinary URL without personal data. Copy, native share, or a locally generated SVG QR code.
- **Personal progress / MINU EDUSAMMUD:** a portable `#ekpass=` link with a versioned small JSON passport (only earned crystal IDs, last world and completion of the ultimate crystal), encoded base64url. Show a local QR code and copy/native-share actions. No cloud account and no external QR request. On a new phone/browser, reading QR or opening the personal link gives a preview; the child/parent must **explicitly confirm restore**. The dialog warns that restore replaces existing crystals on that device. Invalid or irrelevant passports are rejected. The hash is removed from the displayed URL after parsing, but remains in the saved link. The passport can also be pasted manually.
- **Automatic local progress:** completed crystals continue to be persisted by the existing EDUKASS localStorage keys. On reopening the game, the player automatically lands in the first not-yet-finished world, and may choose to replay any completed world. Saved progress links are created on demand; links are not silently synced or sent to a server.
- **No accidental loss while sharing:** game movement timer and keyboard input are paused while either dialog is open.

**Implementation:** `src/passport.js` and vendored offline MIT-licensed `src/qrcode-vendor.js`, integrated in `src/app.html` and self-contained `index.html`. The audio file generator and workflow are recorded under `scripts/` and `.github/workflows/umardamine-approved-audio.yml`. Functional Chromium tests include QR generation, share URL without passport data, explicit progress import in a separate clean browser context and MP3 network asset checks.

## Source and reproducibility
- `src/app.html` — template with `/*__CSS__*/` and `/*__JS__*/` placeholders
- `src/styles.css` — responsive layout, themes, effects and fusion cinematic
- `src/game.js` — all nine worlds, input/physics, rounding generator and crystal award collection
- `src/passport.js` — public sharing and confirmed private cross-device progress transfer
- `src/qrcode-vendor.js` — offline MIT-licensed QR generator
- `assets/*.mp3` — approved music and defeat audio, stored in the repository
- `index.html` — HTML/CSS/JS/QR combined playable build; local MP3 assets remain separate files

Rebuild:
```python
from pathlib import Path
p=Path('games/umardamine/nine-worlds')
html=(p/'src/app.html').read_text(encoding='utf8')
html=html.replace('/*__CSS__*/',(p/'src/styles.css').read_text(encoding='utf8'))
html=html.replace('/*__JS__*/',(p/'src/game.js').read_text(encoding='utf8'))
html=html.replace('/*__QR__*/',(p/'src/qrcode-vendor.js').read_text(encoding='utf8'))
html=html.replace('/*__PASSPORT__*/',(p/'src/passport.js').read_text(encoding='utf8'))
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

## QR scan reliability · 25 November 2026
The previous Chromium suite verified transfer by URL and SVG presence. QR images now include the standard four-module white quiet zone and larger responsive dimensions, including on compact screens. The browser suite additionally decodes actual screenshots of the public and private QR images with ZXing, comparing the decoded value with the original URL in each tested viewport. This is automated image decoding, not a substitute for real phone-camera testing. No game-world, arithmetic, physics, music, crystal or passport-consent behavior was changed.

## Child-first interface · 25 November 2026
One large MÄNGI! button, enlarged animated crystal, collection row and quiet utility icons. World selection and vault remain accessible. Long intro instructions and duplicated gameplay/reward labels are removed. Mathematical feedback retains the task, answer, correct answer and place-value rule. Generator, worlds, physics, audio and transfer consent remain unchanged. Automated tests check title controls at three viewports; manual visual QA remains required.

## Mixed difficulty and final title refinement · 25 November 2026
At the owner's request, remove both lower title buttons. The existing nine-crystal strip opens the collection, whose available crystals can be selected to replay a world; sound, share and QR remain in the top toolbar. Worlds 1 and 2 are unchanged. In worlds 3–9, two genuinely easy two-digit tasks to tens are interspersed with the main curriculum. All advanced target units remain present, the world count and scenario quotas are unchanged, and already-rounded inputs remain excluded. Browser tests validate the new quotas and placement.
