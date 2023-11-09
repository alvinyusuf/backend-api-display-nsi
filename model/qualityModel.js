const mysql = require('../services/database/mysql');

module.exports = {
  async getReportDepart(callback) {
    try {
      mysql.query(`SELECT target_cam_ipqc, target_cnc_ipqc, target_mfg_ipqc,
        target_cam_oqc, target_cnc_oqc, target_mfg_oqc,
        ncr_cam_ipqc, lot_cam_ipqc, ncr_cnc_ipqc, lot_cnc_ipqc,
        ncr_mfg_ipqc, lot_mfg_ipqc, ncr_cam_oqc, lot_cam_oqc,
        ncr_cnc_oqc, lot_cnc_oqc, ncr_mfg_oqc, lot_mfg_oqc, date
        FROM history_qualities WHERE MONTH(date) = MONTH(now())
        AND YEAR(date) = YEAR(now())`, callback);
    } catch (error) {
      console.error(error);
    }
  },
};
