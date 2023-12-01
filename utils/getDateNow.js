const { DateTime } = require('luxon');

const dt = DateTime.now();

function getDateNow() {
  let date;
  if (dt.hour < 10) {
    date = dt.minus({ day: 1 }).toISODate();
  } else {
    date = dt.toISODate();
  }
  return date;
}

module.exports = getDateNow;
