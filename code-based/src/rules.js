/* Smart Campus — deterministic availability rules (Practice #12).
 * Pure functions: no DOM, no I/O, never mutates bookings.
 * Layers: (1) validate input  (2) calculate availability  (3) build message.
 * The UI (public/ui.js) only displays what checkRoom() returns. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SmartCampusRules = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_DURATION_MIN = 120;
  var TIME_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

  var REASON = Object.freeze({
    AVAILABLE: 'AVAILABLE',
    OVERLAP: 'OVERLAP',
    ROOM_BLOCKED: 'ROOM_BLOCKED',
    START_REQUIRED: 'START_REQUIRED',
    START_INVALID: 'START_INVALID',
    START_IN_PAST: 'START_IN_PAST',
    DURATION_INVALID: 'DURATION_INVALID',
    DURATION_TOO_LONG: 'DURATION_TOO_LONG',
  });

  // "YYYY-MM-DDTHH:mm" -> local Date (explicit parse, no engine-specific behaviour).
  function parseLocal(s) {
    if (typeof s !== 'string') return null;
    var m = TIME_RE.exec(s.trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0);
    // Reject impossible dates such as 2026-02-31 that Date would roll over.
    if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3] ||
        d.getHours() !== +m[4] || d.getMinutes() !== +m[5]) return null;
    return d;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  // ---- (1) Validation: AC1, AC2, AC6 ----
  function validate(input, now) {
    var errors = [];
    var raw = input && input.start;
    var start = null;
    if (raw === undefined || raw === null || String(raw).trim() === '') {
      errors.push({ code: REASON.START_REQUIRED, message: 'Please choose a start date and time.' });
    } else if (!(start = parseLocal(String(raw)))) {
      errors.push({ code: REASON.START_INVALID, message: 'Start time must be a real date and time (YYYY-MM-DD HH:mm).' });
    } else if (start.getTime() <= now.getTime()) {
      errors.push({ code: REASON.START_IN_PAST, message: 'Start time must be in the future.' });
    }

    var dRaw = input && input.durationMinutes;
    var duration = (typeof dRaw === 'string' && dRaw.trim() !== '') ? Number(dRaw) : dRaw;
    if (typeof duration !== 'number' || !isFinite(duration) || duration <= 0) {
      errors.push({ code: REASON.DURATION_INVALID, message: 'Duration must be a number greater than 0 minutes.' });
    } else if (duration > MAX_DURATION_MIN) {
      errors.push({ code: REASON.DURATION_TOO_LONG, message: 'Duration can be at most ' + MAX_DURATION_MIN + ' minutes.' });
    }
    return { ok: errors.length === 0, errors: errors, start: start, duration: duration };
  }

  // [aStart, aEnd) and [bStart, bEnd) overlap iff aStart < bEnd && bStart < aEnd (touching is not overlap).
  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }

  // ---- (2) Availability calculation: AC3, AC4, AC5 (read-only) ----
  function calculate(start, durationMinutes, roomBlocked, bookings) {
    var end = new Date(start.getTime() + durationMinutes * 60000);
    if (roomBlocked === true) return { isAvailable: false, reasonCode: REASON.ROOM_BLOCKED, start: start, end: end };
    for (var i = 0; i < bookings.length; i++) {
      var b = bookings[i];
      var bs = parseLocal(b.start), be = parseLocal(b.end);
      if (bs && be && overlaps(start.getTime(), end.getTime(), bs.getTime(), be.getTime())) {
        return { isAvailable: false, reasonCode: REASON.OVERLAP, start: start, end: end, conflict: { id: b.id, start: b.start, end: b.end } };
      }
    }
    return { isAvailable: true, reasonCode: REASON.AVAILABLE, start: start, end: end };
  }

  // ---- (3) Message ----
  function messageFor(r) {
    var span = hhmm(r.start) + '–' + hhmm(r.end);
    if (r.reasonCode === REASON.AVAILABLE) return 'Available: the room is free from ' + span + '.';
    if (r.reasonCode === REASON.ROOM_BLOCKED) return 'Unavailable: the room is blocked (closed) for this time.';
    if (r.reasonCode === REASON.OVERLAP) {
      return 'Unavailable: ' + span + ' overlaps an existing booking from ' +
        r.conflict.start.slice(11) + ' to ' + r.conflict.end.slice(11) + '.';
    }
    return '';
  }

  /**
   * Public contract.
   * @param {{start:string, durationMinutes:number|string, roomBlocked:boolean}} input
   * @param {{now?:Date, bookings?:Array}} [opts]
   * @returns {{valid:boolean, isAvailable:boolean, reasonCode:string, message:string, errors:Array, conflict?:object}}
   */
  function checkRoom(input, opts) {
    opts = opts || {};
    var now = opts.now || new Date();
    var bookings = opts.bookings || [];
    var v = validate(input, now);
    if (!v.ok) {
      return {
        valid: false, isAvailable: false, reasonCode: v.errors[0].code,
        message: v.errors.map(function (e) { return e.message; }).join(' '), errors: v.errors,
      };
    }
    var r = calculate(v.start, v.duration, input.roomBlocked === true, bookings);
    var out = { valid: true, isAvailable: r.isAvailable, reasonCode: r.reasonCode, message: messageFor(r), errors: [] };
    if (r.conflict) out.conflict = r.conflict;
    return out;
  }

  return { checkRoom: checkRoom, validate: validate, calculate: calculate, overlaps: overlaps,
    parseLocal: parseLocal, REASON: REASON, MAX_DURATION_MIN: MAX_DURATION_MIN };
});
