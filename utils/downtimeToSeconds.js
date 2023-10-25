function downtimeToSeconds(downtime) {
  const parts = downtime.split(':').map(Number);
  const days = parts[0];
  const hours = parts[1];
  const minutes = parts[2];
  const seconds = parts[3];

  const totalSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds;

  return totalSeconds;
}

module.exports = downtimeToSeconds;
