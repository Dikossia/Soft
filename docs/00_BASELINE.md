# Task #01 — Frozen baseline (Practice #11 code-based checker)

| Item | Value |
|---|---|
| Project | `smart-campus-practice11/` (left **unmodified**) |
| Version | `package.json` → `smart-campus-room-checker@1.1.0` |
| Runtime | Node.js v22.23.5, zero runtime dependencies |
| Date frozen | 25 Nov 2026, 10:23 (UTC+5) |
| Booking data | Room B-204: 20 Nov 2026 10:00–11:30, 20 Nov 2026 14:00–15:00. Room B-205 = blocked. |
| Expected behaviour | Half-open interval overlap → `OVERLAP`; blocked room → `ROOM_BLOCKED`; past start → `PAST_TIME`; end ≤ start → `INVALID_TIME`; unknown room → `UNKNOWN_ROOM`; otherwise `AVAILABLE`. |

## Existing checks (re-run today)
```
npm test       → tests 29, pass 29, fail 0
npm run lint   → Linted 17 files, 0 problem(s).
```
Screenshots: `screenshots/00_baseline_p11_tests.png`, `screenshots/00_baseline_p11_ui.png`.

## Observation from the baseline run
The default demo slot in the P11 UI (20 Nov 2026 09:00–10:00) now returns
**"B-204 is not available — PAST_TIME"**, because 20 Nov 2026 is in the past.
This is correct behaviour of the frozen rules, not a defect. For Practice #12 the
booking **dates** were moved to 15 Dec 2026 for *both* tracks; the booking **rules**
were not changed to favour either approach.
