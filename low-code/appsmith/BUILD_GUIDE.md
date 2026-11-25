# Low-code track — build it in Appsmith (Task #04)

> **Status: BUILT and TESTED in Appsmith Cloud (free plan) on 25 Nov 2026** — app
> "Smart Campus Room Checker (low-code)", 8/8 observed (see `docs/02_TEST_TABLE.md`).
> This guide documents how it was built so it can be rebuilt by hand.
> Use the **free** plan — do not buy anything.

Start a timer. Write down **setup / implementation / debugging / testing** minutes separately
(they go into `docs/03_COMPARISON_MATRIX.md`).

## 1. Setup (timer: setup)
1. Open app.appsmith.com, sign in / sign up yourself (free plan).
2. **+ New → Application**, name it `Smart Campus Room Checker (low-code)`.
3. Do **not** add any datasource, API or connector — the scenario uses fictional in-app data only.

## 2. Widgets (timer: implementation)
Drag these from the widget panel and rename them **exactly** (top of the property pane):

| Widget type | Name | Properties |
|---|---|---|
| Text | `TitleText` | "Smart Campus — Room B-204 (low-code track)" |
| Datepicker | `StartPicker` | Date format with time (`YYYY-MM-DD HH:mm`), time precision **minute**, Required ✓ |
| Input | `DurationInput` | Data type **Number**, Label "Duration (minutes)", Default value `60`, Min `1`, Max `120` |
| Switch | `BlockedSwitch` | Label "Room blocked (closed)", Default **off** |
| Button | `CheckBtn` | Label "Check availability", onClick → JS → `{{Checker.run()}}` |
| Text | `ResultText` | Text `{{Checker.result.title}}`, font size large; Text colour `{{Checker.result.isAvailable ? '#1f7a45' : '#b42318'}}` |
| Text | `MessageText` | Text `{{Checker.result.message}}` |
| Text | `ReasonText` | Text `{{"Reason code: " + Checker.result.reasonCode}}` |
| Table | `BookingsTable` | Table data `{{Checker.bookings}}`, **no** inline editing, no add-row |

## 3. Logic
1. **Queries/JS → + New JS Object**, rename it to `Checker`.
2. Replace its content with `Checker.jsobject.js` (copy everything).
3. Tip: the Datepicker/Input min/max settings alone do **not** implement AC1–AC6 —
   keep the checks in the JS Object so wrong values still get a clear message (AC6).

## 4. Run the 8 tests (timer: testing)
Use **Preview** (or the deployed view). For each row of `docs/01_REQUIREMENTS_SHEET.md`
(T1–T7) set the inputs, press **Check availability**, take a screenshot named
`3x_lowcode_Tn.png`. For **T8**, screenshot `BookingsTable` after T7 and confirm it still
shows BK-1 and BK-2 unchanged.

Note: in Appsmith the "now" is the real clock (25 Nov 2026 or later); all T1–T7 inputs
still give the expected result because the "future" cases are in December 2026.

Fill the **Observed (Appsmith)** column of `docs/02_TEST_TABLE.md`. Write down any test
that fails — do **not** change the rules to make it pass, record it as a defect.

## 5. Publish / export (Task #06 evidence)
* **Deploy** → **Share** → toggle "Make application public" only for the demo link
  (data is fictional); keep the workspace itself private, do not invite editors.
* **Export**: application menu → *Export* → saves a `.json` file. Put it in
  `low-code/appsmith/export/`.
* Version control: check whether *Connect to Git* is offered on your free plan.
  If yes, connect to the same GitHub repo (branch `lowcode`). If not, write
  "Git sync not available on free plan — versioning = manual JSON export" in the matrix.

## Requirements the platform could not implement visually (record here)
| Requirement | Observed in Appsmith | How solved |
|---|---|---|
| AC3 interval overlap | *(fill in)* — expected: no visual rule block for interval overlap | JS Object `Checker.evaluate` |
| AC1 "strictly in the future" | *(fill in)* — Datepicker min-date is not a full validation with message | JS Object |
| AC5 read-only bookings | *(fill in)* | Table editing off; JS Object never writes `bookings` |
