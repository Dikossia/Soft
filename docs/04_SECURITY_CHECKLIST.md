# Security checklist (Task #07, links to Lecture #12)

Only our own code and our own Appsmith app are checked. **No scanning of Appsmith, GitHub or any
third-party service** (not authorized).

| # | Check | Code-based — evidence | Low-code (Appsmith) — what to verify |
|---|---|---|---|
| 1 | **Input validation** (injection) | All input goes through `validate()` (regex + real-date check + numeric range). `<script>alert(1)</script>`, `tomorrow`, `2026-02-31`, `abc`, `NaN`, `Infinity` → rejected (test B4/B5). No SQL/DB → SQL injection not applicable. | Same checks in `Checker.evaluate`. Observed: empty Duration → DURATION_INVALID message, no crash; 0 / 121 / past date → clear messages (T4–T6). |
| 2 | **Output handling (XSS)** | UI writes only with `textContent`; no `innerHTML`, `eval`, inline handlers. CSP: `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'`. Messages are built from fixed strings + validated times only. | Text widgets show only `Checker.result` strings built from fixed text + validated numbers; user free text never reaches a Text widget. Do not switch Text widgets to raw HTML/iframe widgets. |
| 3 | **Broken authentication** | No login by scope (fictional data). | Workspace account: strong password + 2FA if offered. Do not share editor access. |
| 4 | **Permissions / public sharing** | Static page, read-only; public hosting exposes only fictional data. | Observed via export: `isPublic: false` (only the owner can open it). Make it public **only** if a demo link is required (fictional data). Workspace has no other members. |
| 5 | **Secrets** | `grep -riE "api[_-]?key|secret|token|password"` → none in `code-based/`. The P11 LLM key is not used here. | Observed: export contains **0 datasources** and no key/password/token strings; no secrets in screenshots. |
| 6 | **Connector access** | None. | No datasources/connectors added (least privilege). |
| 7 | **Sensitive-data exposure** | No personal data. Bookings are client-side and visible to anyone — acceptable only because they are fictional. | Same: `Checker.bookings` is visible in the browser. A real system must keep bookings server-side with access control. |
| 8 | **Dependencies (SCA)** | `package.json` has **0 dependencies**; Node.js only for tests and the demo server → update Node LTS. `npm audit` has nothing to scan. | Platform and its libraries are patched by the **vendor** (cloud). We cannot audit them; if self-hosted, updating the Appsmith image becomes our job. Templates/imported widgets = untrusted. |
| 9 | **Runtime checks (DAST, manual, own app only)** | Local server: `GET /../../etc/passwd` → **404**; unknown extensions → 404; `X-Content-Type-Options: nosniff`. UI run with T1–T7 + mobile width, no console errors except a missing favicon (404). | Done in deployed view: T1–T8 + empty duration; bookings table unchanged after all runs (T8). |
| 10 | **Clickjacking** | ⚠️ `frame-ancestors` cannot be set in a `<meta>` CSP; GitHub Pages cannot add headers. Low risk (no actions, no data). | Controlled by platform. |
| 11 | **AI agent least privilege** | AI agent only had access to the course folder; it did not touch the P11 project files (baseline kept). All AI-generated code was verified by running tests. | The student signed in herself; the agent never saw the password. The agent worked only inside this one app (no workspace/settings changes, nothing shared). |

## Findings
| ID | Severity | Finding | Status |
|---|---|---|---|
| S1 | Low | No `frame-ancestors` protection on static hosting (meta CSP limitation). | Accepted — no actions/data to protect. |
| S2 | Info | Bookings are visible client-side in both tracks. | Accepted for fictional scope; would be a real issue in production. |
| S3 | Info | Low-code security depends on vendor; no own headers/CSP. | Documented; verify sharing settings with screenshot. |
