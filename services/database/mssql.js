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
      console.error(`Error connecting to SQL Server at ${new Date()}:`, err);
      setTimeout(reconnect, 30000);
    });
}

pool.on('error', (err) => {
  console.error(`Error connecting to SQL Server at ${new Date()}:`, err);
  reconnect();
});

pool.connect()
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch((err) => {
    console.error(`Error connecting to SQL Server at ${new Date()}:`, err);
  });

module.exports = pool;
