/* Smart Campus — fictional booking data (Practice #12).
 * One fictional room, read-only. Shared 1:1 with the low-code track.
 * Dates were moved from 20 Nov 2026 (Practice #11, now in the past) to 15 Dec 2026;
 * times and rules are unchanged, and the same data is used by both tracks. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SmartCampusData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var ROOM = Object.freeze({ label: 'B-204', name: 'Seminar room B-204' });
  var BOOKINGS = Object.freeze([
    Object.freeze({ id: 'BK-1', start: '2026-12-15T10:00', end: '2026-12-15T11:30', title: 'Fictional lecture' }),
    Object.freeze({ id: 'BK-2', start: '2026-12-15T14:00', end: '2026-12-15T15:00', title: 'Fictional study group' }),
  ]);
  return { ROOM: ROOM, BOOKINGS: BOOKINGS };
});
