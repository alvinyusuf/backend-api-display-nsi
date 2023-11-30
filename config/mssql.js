const config = {
  user: process.env.USER_MSSQL,
  password: process.env.PASSWORD_MSSQL,
  server: process.env.SERVER_MSSQL,
  database: process.env.DATABASE_MSSQL,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 60000,
    requestTimeout: 60000,
    stream: true,
  },
};

module.exports = config;
