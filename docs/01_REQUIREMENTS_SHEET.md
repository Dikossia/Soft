# Shared requirement / acceptance-criteria sheet (Task #02)

**Used unchanged by BOTH tracks** — code-based (`code-based/`) and low-code (`low-code/appsmith/`).

## User story
As a **student**, I want to choose a **future start time and a duration** for seminar room **B-204**
so that I immediately see whether the room is **Available or Unavailable, with a clear reason**,
without changing any existing booking.

Scope: one fictional room, fixed fictional bookings, no login, no payment, no personal data, no production database.
The optional "Explain availability" (LLM) feature from Practice #11 is **not** part of this practice.

## Acceptance criteria
| ID | Criterion |
|---|---|
| AC1 | Start time must be in the future (start ≤ now → validation error). |
| AC2 | Duration must be > 0 and ≤ 120 minutes. |
| AC3 | An interval that overlaps an existing booking is **Unavailable**. Intervals are half-open `[start, end)`: touching (end = next start) is **not** an overlap. |
| AC4 | If the room is blocked (closed), the result is **Unavailable**. |
| AC5 | A clear decision is displayed; checks never create, edit or delete bookings. |
| AC6 | Invalid input receives understandable feedback (what is wrong + what is allowed). |

Rule priority: **validation (AC1, AC2, AC6) → blocked (AC4) → overlap (AC3) → available**.

## Inputs
| Input | Type | Notes |
|---|---|---|
| `start` | local date-time `YYYY-MM-DDTHH:mm` | required, must be a real date, must be in the future |
| `durationMinutes` | number | required, 0 < d ≤ 120 |
| `roomBlocked` | boolean | room-status control (Open / Blocked) |
| `bookings` | fixed fictional list (read-only) | B-204: **15 Dec 2026 10:00–11:30** (BK-1), **15 Dec 2026 14:00–15:00** (BK-2) |

## Outputs
| Output | Type | Values |
|---|---|---|
| `isAvailable` | boolean | `true` only for AVAILABLE |
| `reasonCode` | string | `AVAILABLE`, `OVERLAP`, `ROOM_BLOCKED`, `START_REQUIRED`, `START_INVALID`, `START_IN_PAST`, `DURATION_INVALID`, `DURATION_TOO_LONG` |
| visible message | text | e.g. "Unavailable: 11:00–12:00 overlaps an existing booking from 10:00 to 11:30." |
| `valid` | boolean | `false` for validation errors (AC6) |

## Common test inputs (prepared before implementation)
Machine-readable copy: `low-code/test-inputs.json` (the code-based tests read the same file).
Fixed clock for automated runs: **1 Dec 2026 09:00**. Manual UI runs use the real clock (25 Nov 2026), which gives the same results because every "future" case is in December.

| ID | start | duration | blocked | Expected |
|---|---|---|---|---|
| T1 | 2026-12-15 12:00 | 60 | no | Available · `AVAILABLE` |
| T2 | 2026-12-15 11:00 | 60 | no | Unavailable · `OVERLAP` (BK-1 10:00–11:30) |
| T3 | 2026-12-15 12:00 | 60 | yes | Unavailable · `ROOM_BLOCKED` |
| T4 | 2026-12-15 12:00 | 0 | no | validation error · `DURATION_INVALID` |
| T5 | 2026-12-15 12:00 | 121 | no | validation error · `DURATION_TOO_LONG` |
| T6 | 2026-11-20 10:00 | 60 | no | validation error · `START_IN_PAST` |
| T7 | 2026-12-15 11:30 | 30 | no | Available · `AVAILABLE` (starts exactly when BK-1 ends) |
| T8 | — after T1–T7 | | | booking data identical to before |

## Change vs. Practice #11 (recorded, applied to both tracks)
* Booking **dates** moved 20 Nov 2026 → 15 Dec 2026, because 20 Nov is now in the past (see `00_BASELINE.md`). Times and overlap rule unchanged.
* Input changed from *start + end + room label* to *start + duration + blocked flag*, as required by the Practice #12 scenario.
* Past start is now a **validation error with a message** (AC1/AC6) instead of the P11 result `PAST_TIME / not available`.
