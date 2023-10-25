/* eslint-disable array-callback-return */
const downtimeToSeconds = require('./downtimeToSeconds');
const addingDowntime = require('./addingDowntime');

module.exports = function currentDowntimeFormater(array) {
  const data = array.map((element) => {
    const downtime = addingDowntime(
      element.current_monthly_downtime,
      element.total_monthly_downtime,
    );
    return downtime;
  });

  let totalDowntime = '0:0:0:0';
  data.map((element) => {
    totalDowntime = addingDowntime(totalDowntime, element);
  });

  const downtimeInSeconds = downtimeToSeconds(totalDowntime);

  return {
    totalDowntime,
    totalDowntimeInSeconds: downtimeInSeconds,
  };
};
