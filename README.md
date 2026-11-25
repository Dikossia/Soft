# Smart Campus Room Availability Checker — Practice #12
**Compare code-based and low-code solutions** (AI-Driven Software Engineering)

Same feature, same 6 acceptance criteria, same fictional data, same 8 tests — built two ways.

| Track | Where | Status |
|---|---|---|
| Code-based | `code-based/` — static HTML/JS, zero dependencies | ✅ built, 8/8 observed (16/16 automated tests) |
| Low-code | Appsmith Cloud app "Smart Campus Room Checker (low-code)" (JS Object + 9 widgets); source in `low-code/appsmith/` | ✅ built, 8/8 observed in Appsmith (+ logic SIMULATED 8/8 in Node) |

## Run the code-based track
```bash
cd code-based
npm test            # T1–T8 + boundary checks (node:test)
npm start           # http://localhost:8080   (or just double-click index.html)
node ../low-code/appsmith/simulate.js   # SIMULATED check of the Appsmith logic
```
Live demo: publish the repo with GitHub Pages and open `/code-based/` — link: ___

## Structure
```
code-based/src/rules.js       validation + availability calculation + message (pure, no DOM)
code-based/src/bookings.js    fictional read-only bookings (frozen)
code-based/public/ui.js       presentation only (textContent)
code-based/test/              acceptance tests T1–T8 + boundaries
low-code/test-inputs.json     shared test inputs used by BOTH tracks
low-code/appsmith/            JS Object, build guide, simulation
docs/00_BASELINE.md           Task #01 frozen P11 baseline
docs/01_REQUIREMENTS_SHEET.md Task #02 user story, AC1–AC6, inputs/outputs, test inputs
docs/02_TEST_TABLE.md         Task #05 eight-case table, expected vs observed
docs/03_COMPARISON_MATRIX.md  Task #06 effort + matrix + recommendation
docs/04_SECURITY_CHECKLIST.md Task #07 security review
docs/05_AI_REFLECTION.md      AI-use reflection
docs/screenshots/             evidence
```

## Screenshots
| File | Shows |
|---|---|
| `00_baseline_p11_tests.png`, `00_baseline_p11_ui.png` | frozen P11 baseline (29/29) |
| `10_code_npm_test.png` | code-based automated tests 16/16 |
| `11…17_code_T1…T7.png` (+ `_mobile`) | code-based UI for every test, desktop + 390 px |
| `20_lowcode_SIMULATED_logic.png` | **SIMULATED** low-code logic run — not Appsmith |
| `30_lowcode_editor.jpg` | Appsmith editor with all widgets |
| `31…37_lowcode_T1…T8.jpg` | Appsmith deployed app, every test |


Body: class time and day · AI tool: Claude, model Claude Opus 5.5 (claude-opus-5-5) · live demo link ·
public GitHub repo link · Appsmith app link + JSON export · screenshots · note "both tracks 8/8; the extra Node check of the low-code logic is marked SIMULATED".
No OneDrive links, no ZIP/RAR.
