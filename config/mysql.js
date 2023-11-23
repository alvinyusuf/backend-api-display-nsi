const mysql = require('mysql');

module.exports = mysql.createConnection({
  host: '192.168.10.75',
  user: 'guest',
  password: 'guest_desk45',
  database: 'dashboard',
  port: 3306,
});
