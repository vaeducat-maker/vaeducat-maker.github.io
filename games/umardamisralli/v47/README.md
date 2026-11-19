# EDUKASS Ümardamise arkaad · v47

An independent offline-ready prototype of the 9-world Estonian-language rounding game.

## Gameplay
- A glowing runner keeps moving through an endlessly scrolling neon environment.
- Each math problem controls the next arcade obstacle: **correct answer = jump and clear**, **wrong answer = visible collision and restart the current world**.
- A response deadline is preserved and scales with the length of the rounded answer; hitting it also causes a collision.
- The first world has 8 questions; the remaining 8 worlds have 12 each (104 total). Nine worlds have their own palettes and animated scenery.
- Progress through completed worlds persists locally. The visual and mathematical baseline is v46, kept unchanged in its own branch.

## Files
- `index.html` — standalone game; open locally in Chrome; no internet required.
- `test_v47.py` — automated browser tests for valid/invalid answers, jump, collision, timeout, 104 questions, 9 worlds, 9 rewards, mobile/landscape.
- `TEST_RESULTS.md` — results and limitations.

**NOT published on edukass.ee.** This is a prototype for review.