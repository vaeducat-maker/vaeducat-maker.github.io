# EDUKASS Ümardamine — Valgussaar / Neon Runner

Experimental first world: automatic side-scrolling crystal runner. The art direction is reused from the approved Valgussaar prototype. There are no cars or road barriers.

- The crystal moves continuously along a neon track.
- Eight rounding exercises, with tens and an introductory hundreds task, preserve the previous first-world mathematical progression.
- A correct answer arms a real, automatic ballistic jump with gravity and a full rotation. The crystal must physically clear the fixed spike hitbox; the movement never pauses while typing.
- A fully incorrect answer or manual confirmation locks the answer; the crystal visibly rushes into the next obstacle and crashes. Reaching an obstacle without a correct answer also crashes. The spikes never teleport or open simply because the answer is correct.
- Retrying restarts at obstacle 1 with the same generated round; all eight obstacles must be cleared in one attempt.
- The finished crystal reward is awarded only after passing 8/8 obstacles.

## Build and test

`python build.py`

`python tests/test_runner.py`

Browser test targets 390×844, 360×740, and 844×390 viewports. The deterministic clock checks wrong-answer collisions, timeouts, retry, eight ballistic jumps, and the finish reward; screenshots are written to the project directory. Re-run the test after these physics changes before calling them browser-verified.

This is a **single-world prototype**, not the complete nine-world game. It is saved in a separate branch and does not change public EDUKASS pages.

## Physics revision (19 November 2026)

The first-world visuals, typography, task order, colors, and reward are preserved. The running crystal now follows a real timed jump arc, rotates in air, and clears each persistent spike only when high enough. Hazards have position-based collision tests. The standalone HTML is rebuilt from `src/` and stays separate from the public website. This prototype borrows the continuous-platformer gameplay principle; it does not use any Geometry Dash game assets.
