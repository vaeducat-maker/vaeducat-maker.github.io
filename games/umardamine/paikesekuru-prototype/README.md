# EDUKASS Ümardamine — Päikesekuru (World 02)

Playable standalone experimental world 2 (warm orange, amber, crimson neon). The game is derived from the approved Valgussaar continuous-crystal-runner mechanics, with the same automatic input validation, 25%-slower normal/turbo speed, ballistic jump, real spike collisions, and mobile 11-key keypad.

- 12 automatically generated rounding tasks. Progression: two-digit numbers rounded to tens; three-digit numbers rounded to tens; hundreds become increasingly frequent; the last section includes four-digit numbers rounded to hundreds. A new task set is generated after each retry.
- Five neon geometric obstacle families are retained; no realistic road or landscape photos.
- Wrong answers, missing answers, and collisions restart the whole world.
- Completion after 12/12 earns crystal 02 in shared nine-crystal vault under localStorage key `edukass-neon-crystal-vault-v1`. Existing world-one crystal remains preserved within the same browser origin.
- Separate static launch: `EDUKASS_Paikesekuru_World2_Play.html`. No external resources needed.
- Source: `src/app.html`, `src/styles.css`, `src/game.js`. Rebuild using the equivalent of `app.html.replace('/*__CSS__*/', styles.css).replace('/*__JS__*/', game.js)`.
- 9 deterministic game-loop simulated passes verified 12/12, earned prize 02, retry prize persistence, and missing-answer collision at 3 canvas heights × 3 timestep sizes. No real-browser Playwright run was completed in this session.
- This is a prototype branch. The main public site and world-one HTML remain untouched. The full 9-world progression is not finished.

## Revised playable World 02 (24 November 2026)
- Relaxed pace: 47 px/s (43 in the last section) and automatic post-answer turbo at 195 px/s; 12 real jump hazards remain physically passable.
- Curriculum: tasks 1–4 two digits rounded to tens, 5–8 three digits rounded to tens, 9–12 three digits rounded to hundreds. Numbers regenerate for every new attempt.
- Päikesekuru runner avatar and prize are a warm orange-red **fire lotus / flame shard**, visibly unlike the long cool blue faceted Valgussaar crystal.
- World 02 hazards: glowing stepped blocks, fiery sun-wheel, ember wall, double flame fangs and solar ramp, with a single familiar rotor to connect the worlds. Obstacle silhouettes are not all the same as world one.
- Collection displays 9 distinct SVG silhouettes, 1 blue and 2 flame when both collected. World 3 remains unavailable.
- Correct-answer automatic jump, collision feedback with rounded value and explanation, mobile 11-key input, festive two-stage award and shared storage continue to work.
- 18 deterministic combined-world QA scenarios passed across three canvas heights and three frame rates, including award collection, retry persistence and error correction. Real browser visual QA has **not** been executed.
