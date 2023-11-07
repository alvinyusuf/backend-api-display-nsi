function getFormatDate(now, isStartMonth = false, beforeNow = false) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const hour = now.getHours();
  let date;
  if (isStartMonth) {
    date = '01';
  } else if (beforeNow || hour < 10) {
    if (now.getDate() === 1) {
      date = now.getDate();
    } else {
      // date = now.getDate() - 4;
      date = now.getDate() - 1;
    }
  } else {
    // date = now.getDate() - 4;
    date = now.getDate();
  }
  const dateNow = `${month}-${date}-${year}`;
  return dateNow;
}

module.exports = getFormatDate;
