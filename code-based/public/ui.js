/* Presentation layer only: reads the form, calls SmartCampusRules.checkRoom, renders with textContent. */
(function () {
  'use strict';
  var Data = window.SmartCampusData;
  var Rules = window.SmartCampusRules;
  var $ = function (id) { return document.getElementById(id); };

  function td(text) { var c = document.createElement('td'); c.textContent = text; return c; }

  function renderBookings() {
    var body = $('bookings');
    body.textContent = '';
    Data.BOOKINGS.forEach(function (b) {
      var tr = document.createElement('tr');
      tr.appendChild(td(b.id));
      tr.appendChild(td(b.start.slice(0, 10)));
      tr.appendChild(td(b.start.slice(11)));
      tr.appendChild(td(b.end.slice(11)));
      tr.appendChild(td(b.title));
      body.appendChild(tr);
    });
  }

  function render(r) {
    var d = $('decision');
    var section = $('result');
    section.className = 'card result ' + (!r.valid ? 'invalid' : r.isAvailable ? 'ok' : 'no');
    d.textContent = !r.valid ? 'Check your input' : r.isAvailable ? 'Available' : 'Unavailable';
    $('message').textContent = r.message;
    $('reason').textContent = r.reasonCode;
    section.hidden = false;
  }

  $('roomName').textContent = Data.ROOM.name;
  $('start').value = '2026-12-15T12:00';
  renderBookings();

  $('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var status = document.querySelector('input[name="status"]:checked');
    var result = Rules.checkRoom(
      { start: $('start').value, durationMinutes: $('duration').value, roomBlocked: !!status && status.value === 'blocked' },
      { now: new Date(), bookings: Data.BOOKINGS }
    );
    render(result);
  });
})();
