'use strict';
// Shared acceptance tests T1–T8 (Practice #12, Task #05) + boundary checks.
// The same inputs are used for the low-code track (see ../../low-code/test-inputs.json).
const test = require('node:test');
const assert = require('node:assert/strict');
const { checkRoom, REASON } = require('../src/rules');
const { BOOKINGS } = require('../src/bookings');
const CASES = require('../../low-code/test-inputs.json');

const NOW = new Date(2026, 11, 1, 9, 0); // fixed clock: 1 Dec 2026 09:00 local
const SNAPSHOT = JSON.stringify(BOOKINGS);
const run = (input) => checkRoom(input, { now: NOW, bookings: BOOKINGS });

for (const c of CASES.cases.filter((x) => x.id !== 'T8')) {
  test(`${c.id} ${c.name}`, () => {
    const r = run(c.input);
    assert.equal(r.valid, c.expected.valid, 'valid');
    assert.equal(r.isAvailable, c.expected.isAvailable, 'isAvailable');
    assert.equal(r.reasonCode, c.expected.reasonCode, 'reasonCode');
    assert.ok(r.message.length > 10, 'message is shown');
  });
}

test('T8 booking data unchanged after all checks', () => {
  for (const c of CASES.cases) if (c.input) run(c.input);
  assert.equal(JSON.stringify(BOOKINGS), SNAPSHOT);
  assert.ok(Object.isFrozen(BOOKINGS) && Object.isFrozen(BOOKINGS[0]));
});

// ---- extra boundary / robustness checks (not part of the shared 8) ----
test('B1 duration = 120 is accepted, = 1 is accepted', () => {
  assert.equal(run({ start: '2026-12-16T09:00', durationMinutes: 120, roomBlocked: false }).reasonCode, REASON.AVAILABLE);
  assert.equal(run({ start: '2026-12-16T09:00', durationMinutes: 1, roomBlocked: false }).reasonCode, REASON.AVAILABLE);
});
test('B2 adjacent before a booking (09:00 + 60 → ends 10:00) is available', () => {
  assert.equal(run({ start: '2026-12-15T09:00', durationMinutes: 60, roomBlocked: false }).isAvailable, true);
});
test('B3 one minute of overlap is unavailable', () => {
  const r = run({ start: '2026-12-15T09:00', durationMinutes: 61, roomBlocked: false });
  assert.equal(r.reasonCode, REASON.OVERLAP);
  assert.equal(r.conflict.id, 'BK-1');
});
test('B4 empty / malformed / impossible start', () => {
  assert.equal(run({ start: '', durationMinutes: 30 }).reasonCode, REASON.START_REQUIRED);
  assert.equal(run({ start: 'tomorrow', durationMinutes: 30 }).reasonCode, REASON.START_INVALID);
  assert.equal(run({ start: '2026-02-31T10:00', durationMinutes: 30 }).reasonCode, REASON.START_INVALID);
  assert.equal(run({ start: '<script>alert(1)</script>', durationMinutes: 30 }).reasonCode, REASON.START_INVALID);
});
test('B5 negative / empty / non-numeric duration', () => {
  for (const d of [-5, '', 'abc', null, undefined, NaN, Infinity]) {
    assert.equal(run({ start: '2026-12-16T09:00', durationMinutes: d }).valid, false, String(d));
  }
});
test('B6 start exactly "now" is not in the future', () => {
  assert.equal(run({ start: '2026-12-01T09:00', durationMinutes: 30 }).reasonCode, REASON.START_IN_PAST);
});
test('B7 blocked has priority over overlap; validation has priority over blocked', () => {
  assert.equal(run({ start: '2026-12-15T11:00', durationMinutes: 60, roomBlocked: true }).reasonCode, REASON.ROOM_BLOCKED);
  assert.equal(run({ start: '2026-11-20T11:00', durationMinutes: 60, roomBlocked: true }).reasonCode, REASON.START_IN_PAST);
});
test('B8 several errors are all reported', () => {
  const r = run({ start: '', durationMinutes: 0 });
  assert.equal(r.errors.length, 2);
});
