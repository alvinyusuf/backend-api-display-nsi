const mysql = require('../services/database/mysql');

module.exports = {
  async getReportDepart(callback) {
    mysql.query(`SELECT * FROM history_qualities WHERE MONTH(date) = MONTH(now())
      AND YEAR(date) = YEAR(now())`, callback);
  },
};
