function addingDowntime(downtime, secDowntime) {
  const downtimeParts = downtime.split(':').map(Number);
  const secDowntimeParts = secDowntime.split(':').map(Number);

  const totalSeconds = downtimeParts[3] + secDowntimeParts[3];
  const totalMinutes = downtimeParts[2] + secDowntimeParts[2] + Math.floor(totalSeconds / 60);
  const totalHours = downtimeParts[1] + secDowntimeParts[1] + Math.floor(totalMinutes / 60);
  const totalDays = downtimeParts[0] + secDowntimeParts[0] + Math.floor(totalHours / 24);

  const resultFormat = `${totalDays}:${totalHours % 24}:${totalMinutes % 60}:${totalSeconds % 60}`;

  return resultFormat;
}

module.exports = addingDowntime;
