const mssql = require('mssql');

const config = require('../../config/mssql');

const pool = new mssql.ConnectionPool(config);

function reconnect() {
  console.log('Attempting to reconnect to SQL Server...');
  pool.connect()
    .then(() => {
      console.log('Reconnected to SQL Server');
    })
    .catch((err) => {
      console.error('Error reconnecting to SQL Server:', err);
      setTimeout(reconnect, 30000);
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
