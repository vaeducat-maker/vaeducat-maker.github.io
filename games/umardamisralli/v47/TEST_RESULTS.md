# EDUKASS rounding runner v47 — automated test report

Test platform: Chromium headless, viewport 390×844 and 844×390. Layout spot-check at 320×680.

**Passed**
- Valid answer: runner jumps over a prominent obstacle and advances by one question.
- Wrong answer: visible collision, 1.15-second crash animation, attempt counter increases, current world's tasks restart at step 0; previously completed worlds are retained.
- Timer expiration: collision and world restart.
- 104 answers across all 9 worlds, final 9/9 completion collection.
- No JavaScript uncaught runtime errors.
- No horizontal overflow at 320×680, 390×844, or 844×390.

**Not tested**: real Android device, audio on actual speakers, live hosted URL, manual visual review of every frame. This branch does not affect the public EDUKASS site.