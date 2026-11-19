# EDUKASS Ümardamine — Valgussaar / Neon Runner

Experimental first world: automatic side-scrolling crystal runner. The art direction is reused from the approved Valgussaar prototype. There are no cars or road barriers.

- The crystal moves continuously along a neon track.
- Eight rounding exercises, with tens and an introductory hundreds task, preserve the previous first-world mathematical progression.
- A correct answer arms an automatic jump through the next crystal obstacle; the movement never pauses while typing.
- A fully incorrect answer, manual confirmation of an incorrect answer, or reaching an obstacle without a correct answer causes a collision and **fails the level**.
- Retrying restarts at obstacle 1 with the same generated round; all eight obstacles must be cleared in one attempt.
- The finished crystal reward is awarded only after passing 8/8 obstacles.

## Build and test

`python build.py`

`python tests/test_runner.py`

Tested in headless Chromium on 390×844, 360×740, and 844×390 viewports. The test uses a deterministic simulation clock to verify collision, retry, timeouts and all eight correct answers; visual screenshots are produced in the project directory.

This is a **single-world prototype**, not the complete nine-world game. It is saved in a separate branch and does not change public EDUKASS pages.