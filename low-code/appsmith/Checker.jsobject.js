export default {
  // Appsmith JS Object — name it "Checker" (JS → + New JS Object, paste this whole file).
  // Appsmith requires the text to start with "export default": keep all comments inside the braces.
  // Low-code track, Practice #12. Same contract, same fictional bookings, same 6 ACs as the code-based track.
  // Widgets it reads (create them with these exact names):
  //   StartPicker   (Datepicker, time precision = minute)        -> StartPicker.selectedDate
  //   DurationInput (Input, Data type = Number)                   -> DurationInput.text
  //   BlockedSwitch (Switch, label "Room blocked (closed)")       -> BlockedSwitch.isSwitchedOn
  //   CheckBtn      (Button, onClick = {{Checker.run()}})
  //   ResultText    (Text, Text = {{Checker.result.title}})
  //   MessageText   (Text, Text = {{Checker.result.message}})
  //   ReasonText    (Text, Text = {{"Reason code: " + Checker.result.reasonCode}})
  //   BookingsTable (Table, Table data = {{Checker.bookings}}, editing disabled)
  maxDuration: 120,

  // Fictional, read-only. Never written to (AC5 / T8).
  bookings: [
    { id: 'BK-1', start: '2026-12-15T10:00', end: '2026-12-15T11:30', title: 'Fictional lecture' },
    { id: 'BK-2', start: '2026-12-15T14:00', end: '2026-12-15T15:00', title: 'Fictional study group' },
  ],

  result: { title: '—', message: 'Choose a start time and duration, then press Check.', reasonCode: '—', valid: true, isAvailable: false },

  toDate(v) {
    if (v === undefined || v === null || String(v).trim() === '') return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/.exec(String(v).trim());
    const d = m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  },

  hhmm(d) { return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); },

  // Pure rule function: (start, duration, blocked, now) -> decision. No widget access, no writes.
  evaluate(startValue, durationValue, blocked, now) {
    const errors = [];
    const start = this.toDate(startValue);
    if (startValue === undefined || startValue === null || String(startValue).trim() === '') {
      errors.push({ code: 'START_REQUIRED', message: 'Please choose a start date and time.' });
    } else if (!start) {
      errors.push({ code: 'START_INVALID', message: 'Start time must be a real date and time.' });
    } else if (start.getTime() <= now.getTime()) {
      errors.push({ code: 'START_IN_PAST', message: 'Start time must be in the future.' });
    }
    const duration = (typeof durationValue === 'string' && durationValue.trim() !== '') ? Number(durationValue) : durationValue;
    if (typeof duration !== 'number' || !isFinite(duration) || duration <= 0) {
      errors.push({ code: 'DURATION_INVALID', message: 'Duration must be a number greater than 0 minutes.' });
    } else if (duration > this.maxDuration) {
      errors.push({ code: 'DURATION_TOO_LONG', message: 'Duration can be at most ' + this.maxDuration + ' minutes.' });
    }
    if (errors.length) {
      return { valid: false, isAvailable: false, reasonCode: errors[0].code, title: 'Check your input',
        message: errors.map(e => e.message).join(' ') };
    }
    const end = new Date(start.getTime() + duration * 60000);
    const span = this.hhmm(start) + '–' + this.hhmm(end);
    if (blocked === true) {
      return { valid: true, isAvailable: false, reasonCode: 'ROOM_BLOCKED', title: 'Unavailable',
        message: 'Unavailable: the room is blocked (closed) for this time.' };
    }
    const hit = this.bookings.find(b => start < this.toDate(b.end) && this.toDate(b.start) < end);
    if (hit) {
      return { valid: true, isAvailable: false, reasonCode: 'OVERLAP', title: 'Unavailable',
        message: 'Unavailable: ' + span + ' overlaps an existing booking from ' + hit.start.slice(11) + ' to ' + hit.end.slice(11) + '.' };
    }
    return { valid: true, isAvailable: true, reasonCode: 'AVAILABLE', title: 'Available',
      message: 'Available: the room is free from ' + span + '.' };
  },

  // Button handler: reads widgets, stores the decision for the Text widgets.
  run() {
    this.result = this.evaluate(StartPicker.selectedDate, DurationInput.text, BlockedSwitch.isSwitchedOn, new Date());
    return this.result;
  },
};
