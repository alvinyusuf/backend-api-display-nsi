const mysql = require('mysql');

module.exports = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'dashboard',
  port: 3306,
});
