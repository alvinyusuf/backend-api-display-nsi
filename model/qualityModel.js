const mysql = require('../services/database/mysql');

module.exports = {
  async getReportDepart(callback) {
    try {
      mysql.query(`SELECT * FROM history_qualities WHERE MONTH(date) = MONTH(now())
        AND YEAR(date) = YEAR(now())`, callback);
    } catch (error) {
      console.error(error);
    }
  },

  async getDetailDepart(callback) {
    try {
      mysql.query(`SELECT * FROM qualities WHERE MONTH(date) = MONTH(now())
        AND YEAR(date) = YEAR(now())`, callback);
    } catch (error) {
      console.error(error);
    }
  },
};
