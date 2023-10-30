const mysql = require('../config/mysql');

module.exports = {
  async getReportDepart(callback) {
    mysql.query(`SELECT * FROM history_qualities WHERE MONTH(date) = MONTH(now())
      AND YEAR(date) = YEAR(now())`, callback);
  },
};
