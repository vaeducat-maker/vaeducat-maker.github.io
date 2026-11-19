# EDUKASS · Ümardamise maailmad v46

An **independent playable visual prototype** for the EDUKASS rounding trainer. It is not published to the main EDUKASS site, and the approved v45 backup remains unchanged.

## What changed

- No car, highway, obstacles or imposed road-trip imagery.
- Nine originally drawn, dynamically animated portal worlds: star gate, bioluminescent forest, crystal canyon, cloud city, deep sea, lava core, clock city, observatory and sun kingdom.
- Responsive vector/canvas rendering: no missing asset paths, no external image downloads, standalone HTML can run offline.
- 8 problems in world 1, 12 problems in each of worlds 2–9 (104 total), with gradual progression from tens to millions.
- Virtual numeric keypad and physical keyboard support, validation of correct rounding, restart of current world on wrong answer, 9/9 world collection, optional sound.
- Autosave attempts to use localStorage when the browsing context permits; a browser may disable storage on some content:// URLs.

## Launch

Open `index.html` in a browser (Chrome/Chromium, desktop or mobile). This file is fully standalone.

## Testing — 2026-11-19

- Chromium via Playwright `page.set_content()` (because the tool's browser forbids direct file URL navigation).
- Mobile 390×844: nine worlds, 104 correct submitted answers, completion 9/9, no browser JavaScript exceptions.
- Landscape 844×390: rendered without horizontal overflow.
- 83,200 randomized questions across 800 seeds × 9 worlds: unit plans, unique tasks, input ranges, and rounding validated, no failures.
- Wrong answer: current world returns to the first task.
- A physical Android device and end-user visual design approval have **not** been tested or obtained.

## Release constraints

This is an unapproved concept prototype. Do not merge/publish it to edukass.ee without owner review. Keep v45 as the preserved historical version.
