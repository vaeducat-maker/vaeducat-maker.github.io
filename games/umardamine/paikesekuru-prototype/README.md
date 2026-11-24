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
