const mysql = require('../services/database/mysql');

module.exports = {
  getTarget(callback) {
    try {
      mysql.query('SELECT * FROM dashboard.targets LIMIT 1', callback);
    } catch (error) {
      console.error(error);
    }
  },
};
