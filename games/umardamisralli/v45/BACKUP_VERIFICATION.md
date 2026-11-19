# Ümardamisralli v45 — isolated development copy

This directory is a fully buildable game, based on the owner-tested v44 archive.
All 88 visual assets are the original v44 files; they are copied into the isolated
GitHub development branch, not into the live EDUKASS website.

The five owner-requested fixes cover Android interaction at Mäekuru/Järveäär,
a single nine-postcard gallery, next unfinished route navigation, visibility
of the lighthouse car, and 20% faster *visual* pace with unchanged answer time.

Automated tests: `node tests/independent-math-review.cjs`,
`python tests/v45_regressions.py`, and `python tests/v45_journey.py`.
Build: `node tools/build.mjs`. The bundled standalone HTML can open offline.

A direct live URL and a physical Android test are not claimed here.