module.exports = function getLocaleDate(date, month = false) {
  if (month) {
    return new Date(date).toLocaleString('en-US', {
      timeZone: 'Asia/Jakarta', hour12: false, year: 'numeric', month: 'short',
    });
  }
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta', hour12: false, year: 'numeric', month: 'long', day: 'numeric',
    // timeZone: 'Asia/Jakarta', hour12: false, year: 'numeric', month: 'numeric', day: 'numeric',
  });
};
