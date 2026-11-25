'use strict';
// SIMULATION ONLY — runs the Appsmith JS Object source in Node with fake widgets.
// It checks the logic that will be pasted into Appsmith; it does NOT prove the Appsmith app works.
// Real low-code evidence = screenshots taken inside Appsmith (see BUILD_GUIDE.md).
// Usage: node low-code/appsmith/simulate.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, 'Checker.jsobject.js'), 'utf8').replace('export default', 'module.exports =');
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'test-inputs.json'), 'utf8')).cases;
const NOW = new Date(2026, 11, 1, 9, 0);

function load(widgets) {
  const sandbox = { module: {}, ...widgets };
  vm.runInNewContext(src, sandbox);
  return sandbox.module.exports;
}

const Checker = load({});
const snapshot = JSON.stringify(Checker.bookings);
let pass = 0;
const rows = [];
for (const c of cases) {
  let ok, observed;
  if (c.id === 'T8') {
    ok = JSON.stringify(Checker.bookings) === snapshot;
    observed = ok ? 'bookings unchanged' : 'bookings CHANGED';
  } else {
    const r = Checker.evaluate(c.input.start, String(c.input.durationMinutes), c.input.roomBlocked, NOW);
    ok = r.valid === c.expected.valid && r.isAvailable === c.expected.isAvailable && r.reasonCode === c.expected.reasonCode;
    observed = `${r.title} / ${r.reasonCode} — ${r.message}`;
  }
  if (ok) pass++;
  rows.push(`${ok ? 'PASS' : 'FAIL'}  ${c.id}  ${c.name.padEnd(36)} ${observed}`);
}
// run() wiring check with fake widgets (Appsmith Datepicker gives an ISO string, Input gives text).
const wired = load({ StartPicker: { selectedDate: new Date(2027, 0, 10, 12, 0).toISOString() }, DurationInput: { text: '45' }, BlockedSwitch: { isSwitchedOn: false } });
const w = wired.run();
console.log('[SIMULATED — Node vm, not Appsmith]  fixed now = 2026-12-01 09:00');
rows.forEach((r) => console.log(r));
console.log(`run() wiring with fake widgets -> ${w.reasonCode} (${w.message})`);
console.log(`Result: ${pass}/${cases.length} simulated cases passed`);
process.exitCode = pass === cases.length ? 0 : 1;
