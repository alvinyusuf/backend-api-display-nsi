const { DateTime } = require('luxon');

function getStartAndBeforeDate() {
  const dt = DateTime.now();
  const start = dt.minus({ month: 1 }).toISODate();
  const now = dt.minus({ day: 1 }).toISODate();
  return { start, now };
}

module.exports = getStartAndBeforeDate;
