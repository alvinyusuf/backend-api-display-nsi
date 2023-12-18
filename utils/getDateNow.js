const { DateTime } = require('luxon');

function getDateNow() {
  const dt = DateTime.now();
  let date;
  if (dt.hour < 10) {
    date = dt.minus({ day: 1 }).toISODate();
  } else {
    date = dt.toISODate();
  }
  return date;
}

module.exports = getDateNow;
