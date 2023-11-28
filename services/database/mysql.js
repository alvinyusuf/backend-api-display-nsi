const mysql = require('mysql');
const config = require('../../config/mysql');

module.exports = mysql.createConnection(config);
