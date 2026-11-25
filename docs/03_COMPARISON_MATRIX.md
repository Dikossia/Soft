# Comparison matrix + engineering effort (Task #06)

## Effort — measured (25 Nov 2026, UTC+5; both tracks built by the same AI agent)
| Phase | Code-based (10:21–10:26) | Low-code / Appsmith (10:42–10:48) |
|---|---|---|
| Setup | ~1 min — folders, reuse P11 structure | ~1 min — sign-in (by the student), skip datasource wizard |
| Implementation | ~2 min — rules, data, UI, tests | ~2 min — JS Object, 9 widgets, bindings |
| Debugging | <1 min — 1 defect: `npm test` script pointed at a folder → fixed | ~1 min — 2 issues: (1) a comment line above `export default` broke the JS Object (Appsmith requires it to start with `export default`) → removed; (2) widgets could not be placed by drag-and-drop in the narrow browser pane, and auto-height reflow pushed widgets down → widgets added through the editor's own "add widget" action and positions re-set |
| Testing + evidence | ~2 min — 16 automated tests + 14 UI screenshots | ~2 min — 8 manual runs in deployed view + screenshots |
| **Total build + repair** | **≈ 5 min** | **≈ 6 min** |
| Acceptance tests passed | **8 / 8** (automated + manual) | **8 / 8** (manual only) |
| Unresolved defects | 0 | 0 |

**Measured vs impression.** Times are an AI agent's wall-clock, not a student's; they show *relative* effort only.
Measured fact: low-code took about the same time **and still needed the same JavaScript rule code**.
Impression (not measured): for a person without coding skills Appsmith's visual editor would be faster for layout;
for someone who can code, the plain HTML/JS version is at least as fast and easier to test.

## Comparison matrix (complete with evidence)
| Criterion | Code-based | Low-code (Appsmith) |
|---|---|---|
| **Functional tests** | **8 / 8** — `npm test` 16/16 + UI screenshots `11–17_code_*` | **8 / 8** — manual, deployed app, screenshots `31–37_lowcode_*` |
| **Build and repair time** | **≈5 min** | **≈6 min** |
| **Customization** | Full control: own responsive CSS (2-col → 1-col at 520 px), accessible labels, CSP, exact messages and colours. | Layout/colours through widget properties; responsive by platform. Core rule (interval overlap) **had to be JavaScript** in a JS Object — no visual rule builder for it. Text colour needed a JS expression. |
| **Testing** | Automated, repeatable (`node:test`), runs in seconds, fixed clock. | We used no automated tests inside Appsmith → tests were manual clicks; repeat cost every change. |
| **Security controls** | Developer-controlled: `textContent` only, CSP, zero dependencies, no secrets, path-safe local server. | Platform-controlled hosting/auth/headers/patching. Verified: app **not public** (`isPublic:false`), **0 datasources**, no secret-like strings in export. |
| **Versioning / portability** | Plain files in Git; any static host (GitHub Pages); rules module reused by UI and tests. | "Connect Git" is offered in the editor (not connected yet). Export = Appsmith JSON (4 actions + JS Object `Checker`, schema 2/13) → imports only into Appsmith (**lock-in**). JS Object logic is portable; widgets/layout are not. |
| **Ongoing cost** | $0 — static files, GitHub Pages free. | $0 on free plan today; limits/pricing controlled by vendor. |

## Recommendation (brief)
**Keep the code-based solution as the main implementation for this feature.** Both tracks pass 8/8 in similar time,
but the code-based one has automated, repeatable tests, normal Git history, no vendor lock-in and full control of
security headers. The low-code version still needed hand-written JavaScript for the key rule, so it did not save
the hard part; it added platform dependence and manual-only testing.
Low-code is the better fit for **forms and tables over an existing database** for internal staff (e.g. an admin
screen to manage bookings), where built-in auth, widgets and datasource connectors save real effort.
