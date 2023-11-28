const mysql = require('../services/database/mysql');

module.exports = {
  async getTargetMaintenance(callback) {
    try {
      mysql.query(`SELECT target_maintenance
        FROM target_maintenances LIMIT 1`, callback);
    } catch (error) {
      console.error(error);
    }
  },

  async getQmpTarget(callback) {
    try {
      mysql.query(`SELECT januari, februari, maret, april, mei, juni,
      juli, agustus, september, oktober, november, desember
      FROM target_sales WHERE YEAR(tahun) = YEAR(NOW()) LIMIT 1`, callback);
    } catch (error) {
      console.error(error);
    }
  },

  async getMonthlyTarget(month, callback) {
    try {
      mysql.query(`SELECT ${month} AS bulan
      FROM target_sales WHERE YEAR(tahun) = YEAR(NOW()) LIMIT 1`, callback);
    } catch (error) {
      console.error(error);
    }
  },
};
