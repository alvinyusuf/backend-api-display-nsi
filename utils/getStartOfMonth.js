const { DateTime } = require('luxon');

function getStartOfMonth() {
  const dt = DateTime.now();
  return dt.startOf('month').toISODate();
}

module.exports = getStartOfMonth;
