/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const targetModel = require('../model/targetModel');

function getLimitDowntime() {
  return new Promise((resolve, reject) => {
    try {
      targetModel.getTargetMaintenance((err, result) => {
        if (err) {
          console.error(err);
          resolve(2750);
        }
        const limit = result[0].target_maintenance;
        resolve(limit);
      });
    } catch (error) {
      console.error(error);
      resolve(2750);
    }
  });
}

module.exports = getLimitDowntime;
