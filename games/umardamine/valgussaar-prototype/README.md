# EDUKASS Ümardamine — Valgussaar / Neon Runner

Experimental first world: automatic side-scrolling crystal runner. The art direction is reused from the approved Valgussaar prototype. There are no cars or road barriers. Five distinctive neon hazards rotate through the course: crystalline fangs, spinning rotor, three spikes, electric pylons, and a prism wall.

- The crystal moves continuously along a neon track.
- Eight rounding exercises, with tens and an introductory hundreds task, preserve the previous first-world mathematical progression.
- A correct answer arms a real, automatic ballistic jump with gravity and a full rotation. If the child answers early (more than 180 world pixels before the hazard), the crystal automatically enters a fast 255-pixel/s turbo run, takes a longer ballistic leap, and immediately continues to the next rounding task after clearing the spikes. No waiting and no teleporting. Late correct answers retain a normal 64.5-pixel/s pace (56.25 at the final obstacle). The whole game is 25% slower than the previously approved prototype.
- A fully incorrect answer or manual confirmation locks the answer; the crystal visibly rushes into the next obstacle and crashes. Reaching an obstacle without a correct answer also crashes. The spikes never teleport or open simply because the answer is correct.
- Retrying restarts at obstacle 1 with a new randomly generated mathematical round; all eight obstacles must be cleared in one attempt.
- The finished crystal reward is awarded only after passing 8/8 obstacles.

## Build and test

`python build.py`

`python tests/test_runner.py`

Browser test targets 390×844, 360×740, and 844×390 viewports. The deterministic clock checks wrong-answer collisions, timeouts, retry, eight ballistic jumps, and the finish reward; screenshots are written to the project directory. Re-run the test after these physics changes before calling them browser-verified.

This is a **single-world prototype**, not the complete nine-world game. It is saved in a separate branch and does not change public EDUKASS pages.

## Physics revision (19 November 2026)

The first-world visuals, typography, task order, colors, and reward are preserved. The running crystal now follows a real timed jump arc, rotates in air, and clears each persistent spike only when high enough. Hazards have position-based collision tests. The standalone HTML is rebuilt from `src/` and stays separate from the public website. This prototype borrows the continuous-platformer gameplay principle; it does not use any Geometry Dash game assets.

## Fast-answer handling (19 November 2026)

- Before a correct answer: original relaxed running speed; pupils keep the same thinking time.
- After an early correct answer: auto turbo (~4× faster) until the obstacle is cleared, with real position-based obstacle checks and a properly scaled jump arc.
- After a late correct answer: no sudden speed boost, so the answer remains safe.
- Progression is immediate after the collision box is cleared; maths sequence and visuals are unchanged.
- Synthetic game-loop checks: 27 combinations of viewport height, initial answer delay, and tick interval passed; Playwright integration test updated, but not executed in this chat environment.

## Variety and progression (19 November 2026)

- Every restart (even after collision) generates fresh 8-exercise problems. The first five are 2-digit rounding to tens, the sixth is 3-digit rounding to tens, the seventh returns to 2-digit tens, and the eighth introduces 3-digit rounding to hundreds.
- The engine randomly samples hundreds of suitable values, excludes the recently used numbers when feasible, and retains the last eight round signatures to avoid immediate repetitions. The number of distinct combinations is extremely large, not literally infinite.
- Five visually different hazards are rendered and their starting offset changes between attempts. All use the same tested physical collision clearance; the reward, world art and colors remain in the originally approved style.
- Speed changed from 86 to 64.5 pixels/s, from 75 to 56.25 on the final obstacle, and from 340 to 255 in turbo. The jump physics have been rescaled so clearing the collision hitbox remains possible at all speeds.
- Completing this first-world prototype currently grants the Valgussaar crystal and offers replay or looking at the world. It does **not** yet load the next world. The intended full game will unlock world 2 (12 rounds) after a successful 8/8 world 1.
- 36 deterministic simulation combinations of view size, answer delay and timestep passed; 100 regenerations produced distinct entire rounds. Integration browser tests were updated, not yet executed here.

## Victory and crystal reward ceremony

The first world now ends with two consecutive celebration stages rather than the old static modal. The world flashes, then **VÕRRATU! / 8 / 8 TAKISTUST LÄBITUD / MAAILM 01 VÕIDETUD** appears for ~1.5 seconds, followed by **KRISTALL SAADUD! / VALGUSSAARE KRISTALL**.

- The full-screen ceremony uses original SVG crystal art, rotating luminous rings, light rays, 56 confetti pieces, sparks and starbursts, plus a short synthetic victory fanfare only if sound is switched on.
- The award screen displays a nine-crystal collection with slot 1 illuminated. Winning writes persistent `edukass-neon-world1-crystal-unlocked=1`; replay and retry never delete this earned award.
- Controls: `MÄNGI UUESTI`, `VAATA MAAILMA`; `JÄRGMINE MAAILM · VARSTI` is deliberately disabled until world 2 actually exists.
- Reduced-motion mode skips timed effects and reveals the award immediately.
- The artwork is responsive for portrait phones and compact landscape phone screens, with internal award-panel scrolling as a fallback.
- 27 deterministic game-loop simulations checked victory sequence, stage timers, stored award, return to gameplay, and timer cancellation. Browser acceptance tests were updated for victory/reward, but real browser screenshots still need to be inspected before calling this release production-ready.
- This branch remains private to prototype development in the **public GitHub repository**, and is not merged to the public site. 

## Two-world release updates (24 November 2026)
- World 01 retains its approved cyan prism avatar, 8 rounds, and five hazard families.
- A successful 8/8 awards the long blue faceted Valgussaar crystal and enables the **JÄRGMINE MAAILM** button linking to the real World 02 HTML on this same static host.
- All nine slots in the crystal vault now have distinct SVG outlines, even while locked. World 02 specifically has a warm fire-lotus silhouette.
- Existing collected crystal flags remain shared in the browser's localStorage. Correct-answer jumps, collision feedback, auto-check, keypad layout and festive ending remain intact.
- JS simulations verified first and second worlds combined; real-browser visual QA is not claimed.
