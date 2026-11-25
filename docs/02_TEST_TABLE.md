# Eight-case test table — expected vs observed (Task #05)

Legend: ✅ observed as expected · ❌ observed differently · ⚠️ SIMULATED (not run in the platform) · ⬜ not yet run

## Code-based track (observed)
Automated: `cd code-based && npm test` → **16 tests, 16 pass, 0 fail** (T1–T8 + 8 boundary checks), fixed clock 1 Dec 2026 09:00.
Manual UI: Chrome, real clock 25 Nov 2026, desktop 1000 px and mobile 390 px (`screenshots/11…17_code_*.png`).

| ID | Input | Expected | Observed — automated | Observed — UI (message shown) |
|---|---|---|---|---|
| T1 | 15 Dec 12:00, 60 min, open | Available · AVAILABLE | ✅ | ✅ "Available: the room is free from 12:00–13:00." |
| T2 | 15 Dec 11:00, 60 min, open | Unavailable · OVERLAP | ✅ (conflict BK-1) | ✅ "Unavailable: 11:00–12:00 overlaps an existing booking from 10:00 to 11:30." |
| T3 | 15 Dec 12:00, 60 min, **blocked** | Unavailable · ROOM_BLOCKED | ✅ | ✅ "Unavailable: the room is blocked (closed) for this time." |
| T4 | duration **0** | validation error · DURATION_INVALID | ✅ | ✅ "Duration must be a number greater than 0 minutes." |
| T5 | duration **121** | validation error · DURATION_TOO_LONG | ✅ | ✅ "Duration can be at most 120 minutes." |
| T6 | **20 Nov 2026** 10:00 | validation error · START_IN_PAST | ✅ | ✅ "Start time must be in the future." |
| T7 | 15 Dec **11:30**, 30 min | Available · AVAILABLE | ✅ | ✅ "Available: the room is free from 11:30–12:00." |
| T8 | after all checks | bookings unchanged | ✅ JSON snapshot identical, arrays frozen | ✅ bookings table still BK-1, BK-2 |

**Code-based: 8 / 8.** Unresolved defects: 0.

Extra boundary checks (code-based only): 120 and 1 min accepted; 09:00+60 (ends at 10:00) available;
09:00+61 overlaps; empty / "tomorrow" / 2026-02-31 / `<script>` start rejected; −5, "", "abc", NaN, ∞ duration rejected;
start = now rejected; blocked beats overlap; past beats blocked; two errors reported together.

## Low-code track (Appsmith) — observed in the platform
Built and run in **Appsmith Cloud, free plan**, 25 Nov 2026 10:42–10:48 (UTC+5), deployed (view) mode, real clock.
Screenshots: `screenshots/31…37_lowcode_*.jpg` (editor: `30_lowcode_editor.jpg`).

| ID | Input | Expected | ⚠️ SIMULATED logic (Node) | Observed in Appsmith |
|---|---|---|---|---|
| T1 | 15 Dec 12:00, 60, off | Available · AVAILABLE | PASS | ✅ "Available: the room is free from 12:00–13:00." |
| T2 | 15 Dec 11:00, 60, off | Unavailable · OVERLAP | PASS | ✅ "Unavailable: 11:00–12:00 overlaps an existing booking from 10:00 to 11:30." |
| T3 | 15 Dec 12:00, 60, **on** | Unavailable · ROOM_BLOCKED | PASS | ✅ "Unavailable: the room is blocked (closed) for this time." |
| T4 | duration 0 | DURATION_INVALID | PASS | ✅ "Duration must be a number greater than 0 minutes." |
| T5 | duration 121 | DURATION_TOO_LONG | PASS | ✅ "Duration can be at most 120 minutes." |
| T6 | 20 Nov 10:00 | START_IN_PAST | PASS | ✅ "Start time must be in the future." |
| T7 | 15 Dec 11:30, 30 | Available · AVAILABLE | PASS | ✅ "Available: the room is free from 11:30–12:00." |
| T8 | after T1–T7 | bookings unchanged | PASS | ✅ BookingsTable still shows exactly BK-1 and BK-2 (page text read after all runs; screenshot `37_lowcode_T7_T8.jpg`) |

**Low-code: 8 / 8 observed in Appsmith.** Unresolved defects: 0.
Extra check: empty Duration → "Check your input · DURATION_INVALID" (Appsmith's Number input does not crash on empty value).
Datepicker: typed values like `2026-12-15 11:00` were interpreted in the browser's local time (UTC+5) — results match the code-based track.
