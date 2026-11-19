# v46 automated smoke test

Date: 2026-11-19.

| Check | Result |
| --- | --- |
| Browser loaded, render at 390×844 | PASS |
| 104 problems submitted with correct answers | PASS |
| Nine distinct worlds and completion | PASS |
| Final worlds collection 9/9 | PASS |
| JavaScript page errors | 0 |
| 83,200 independently checked generated tasks | PASS |
| Wrong-answer reset to beginning of current world | PASS |
| Landscape at 844×390 | PASS; no horizontal scroll |
| Direct hosted URL on GitHub Pages | NOT TESTED |
| Real Android Chrome, visual art signoff | NOT TESTED |

Automated browser examination used Chromium `page.set_content()` because locally hosted URLs are blocked in the test sandbox. The downloadable HTML has no network dependencies.