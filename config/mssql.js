const mssql = require('mssql');

const config = {
  user: 'sa',
  password: 'P@ssw0rd',
  server: 'sapbi2',
  database: 'SBO_NSI_USD_LIVE',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pool = new mssql.ConnectionPool(config);
const conn = pool.connect();

module.exports = conn;
