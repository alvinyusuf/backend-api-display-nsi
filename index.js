const express = require('express');
const cors = require('cors');
const conn = require('./config/mysql');

const routes = require('./routes');

const app = express();

app.use(cors());

app.use((req, res, next) => {
  req.conn = conn;
  next();
});
app.get('/', (req, res) => res.json({ message: 'backend api' }));
app.use('/api', routes);

app.listen(5000, () => console.log('server listened on http://localhost:5000'));
