const mysql = require('../config/mysql');

module.exports = {
  getCurrentDowntime(callback) {
    mysql.query(`SELECT current_monthly_downtime, total_monthly_downtime,
      DATE_FORMAT(NOW(), '%m/%y') as bulan_downtime
      FROM machine_repairs WHERE MONTH(downtime_month) = MONTH(now())
      AND YEAR(downtime_month) = YEAR(now())`, callback);
  },

  getBeforeDowntime(bulan, calback) {
    mysql.query(`SELECT total_downtime AS totalDowntime, bulan_downtime FROM total_downtimes
      WHERE MONTH(bulan_downtime) = MONTH(now())-${bulan}`, calback);
  },

  getCurrentMachines(calback) {
    mysql.query(`SELECT machine_repairs.id, machines.no_mesin AS noMesin,
      machine_repairs.pic, machine_repairs.status_aktifitas,
      machine_repairs.status_mesin, machine_repairs.tgl_kerusakan,
      machine_repairs.current_downtime, machine_repairs.total_downtime
      FROM machine_repairs JOIN machines ON
      machine_repairs.mesin_id = machines.id
      WHERE status_mesin != 'OK Repair (Finish)' AND status_aktifitas = 'Stop'`, calback);
  },
  // getCurrentMachines(calback) {
  //   mysql.query(`SELECT machine_repairs.id, machines.no_mesin AS noMesin,
  //     machine_repairs.pic, machine_repairs.status_aktifitas,
  //     machine_repairs.status_mesin, machine_repairs.tgl_kerusakan,
  //     machine_repairs.current_downtime, machine_repairs.total_downtime
  //     FROM machine_repairs JOIN machines ON
  //     machine_repairs.mesin_id = machines.id
  //     WHERE status_mesin != 'OK Repair (Finish)'`, calback);
  // },

  getHistoryDowntime(callback) {
    mysql.query(`SELECT total_downtime AS totalDowntime, bulan_downtime FROM total_downtimes
      WHERE bulan_downtime >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      AND MONTH(bulan_downtime) != MONTH(now()) ORDER BY bulan_downtime DESC`, callback);
  },
};
