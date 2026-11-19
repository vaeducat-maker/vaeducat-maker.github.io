# EDUKASS Ümardamisralli v44 — independent browser validation

**Date:** 2026-11-19  
**Branch:** `backup/umardamisralli-v44-20261119`  
**Status:** PASS for automated math/build/journey; not a public-site release.

## Source correspondence

- The backup branch's `index.html`, `src/game.js`, `src/styles.css`, `src/index.template.html`, `tools/build.mjs`, `tests/independent-math-review.cjs`, `tests/journey.html` and `README.md` matched the local v44 source by Git blob SHA.
- All **88/88** original artwork paths were confirmed present on the branch in the transfer verification.
- An additional independent sample of 10 assets across the game matched the original files byte-for-byte by Git blob SHA.
- The branch was not merged into `main`, and the public website was not updated.

## Automated checks run

1. `sha256sum -c SHA256SUMS.txt` — PASS (100 source-project files).
2. `node tests/independent-math-review.cjs` — PASS (104,000 generated math answers, nine levels).
3. `node tools/build.mjs` — PASS (standalone v44 HTML generated; 88 image references embedded).
4. Chromium headless mobile viewport **390 × 844** — standalone HTML rendered with the first scene, intro and keypad. No JavaScript runtime errors.
5. Chromium full game journey — **PASS: 104 correct keypad answers, all 9 stations, inspections, cards, transitions and final album count 9/9**. Original `tests/journey.html` play logic was used with an adaptation for the tool environment.
6. Finale inspected at **390 × 844** and **844 × 390**. No JavaScript runtime errors. All image elements with a defined source were loaded without error at initial inspection; inactive elements intentionally had no `src`.

## Methodological limits

- The browser in this tool environment enforces an administrative URL blocklist, so direct GitHub Pages or localhost URL navigation could not be used. The game was loaded into Chromium from the locally rebuilt v44 standalone HTML. The actual game source matched the files stored in GitHub by Git blob SHA, as above.
- Because the browser's `about:blank` origin blocks persistent storage, the test used a per-page in-memory `localStorage/sessionStorage` shim. The original game logic and graphics were unchanged.
- The complete nine-stage journey was run at 390 × 844; the finale was also displayed at 844 × 390. This is not a device-matrix QA of every screen or a visual-art review of each illustration.
- No physical Android or iOS device was tested.
- No public deployment and no actual GitHub Pages live-link launch were verified.

**Conclusion:** The saved v44 project is complete enough to rebuild and run the nine-stage game with 104 problems and nine postcards. Publication remains a separate decision requiring the owner's approval.
