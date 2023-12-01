const { DateTime } = require('luxon');

const dt = DateTime.now();

function getStartAndBeforeDate() {
  const start = dt.minus({ month: 1 }).toISODate();
  const now = dt.minus({ day: 1 }).toISODate();
  return { start, now };
}

module.exports = getStartAndBeforeDate;
