const mssql = require('mssql');

const config = {
  user: 'sa',
  password: 'P@ssw0rd',
  server: 'sapbi2',
  database: 'SBO_NSI_USD_LIVE',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 60000,
    requestTimeout: 30000,
    stream: true,
  },
};

const pool = new mssql.ConnectionPool(config);
// const conn = pool.connect();

// conn.then(() => {
//   console.log('Connected to SQL Server');
// }).catch((err) => {
//   console.error('Error connecting to SQL Server:', err);
// });

// module.exports = conn;

function reconnect() {
  console.log('Attempting to reconnect to SQL Server...');
  pool.connect()
    .then(() => {
      console.log('Reconnected to SQL Server');
    })
    .catch((err) => {
      console.error('Error reconnecting to SQL Server:', err);
      setTimeout(reconnect, 5000);
    });
}

pool.on('error', (err) => {
  console.error('SQL Server Connection Pool Error:', err);
  reconnect();
});

pool.connect()
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch((err) => {
    console.error('Error connecting to SQL Server:', err);
  });

module.exports = pool;
