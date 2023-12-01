const { DateTime } = require('luxon');

const dt = DateTime.now();

function getStartOfMonth() {
  return dt.startOf('month').toISODate();
}

module.exports = getStartOfMonth;
