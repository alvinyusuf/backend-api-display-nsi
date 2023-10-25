module.exports = function getLocaleDate(date) {
  return new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
};
