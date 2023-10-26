const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(cors());

app.get('/', (req, res) => res.json({ message: 'backend api' }));
app.use('/api', routes);

app.listen(5000, () => console.log('server listened on http://localhost:5000'));
