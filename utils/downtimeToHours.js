function downtimeToHours(downtime) {
  const parts = downtime.split(':').map(Number);
  const days = parts[0];
  const hours = parts[1];

  const totalHours = parseInt(days, 10) * 24 + parseInt(hours, 10);

  return totalHours;
}

module.exports = downtimeToHours;
