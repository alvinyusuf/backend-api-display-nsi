require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const routes = require('./routes');
const socketEmitter = require('./services/websocket/socketEmitter');

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: '*',
});

app.get('/', (req, res) => res.json({ message: 'backend api' }));
app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('frontend connected');

  const emitData = setInterval(async () => {
    await socketEmitter.downtimeEmitter(socket);
  }, 1000);

  const emitDataQuality = setInterval(async () => {
    await socketEmitter.qualityEmitter(socket);
  }, 1000);

  const emitDataProduction = setInterval(async () => {
    await socketEmitter.productionEmitter(socket);
  }, 600000); // 10 menit sekali untuk emit

  const emitMonthlySales = setInterval(async () => {
    await socketEmitter.salesMonthlyEmitter(socket);
  // }, 20000);
  }, 1860000); // 31 menit sekali untuk emit

  const emitQmpSales = setInterval(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    await socketEmitter.salesQmpEmitter(socket);
  }, 1740000); // 29 menit sekali untuk emit

  socket.on('disconnect', () => {
    console.log('frontend disconnected');
    clearInterval(emitData);
    clearInterval(emitDataQuality);
    clearInterval(emitDataProduction);
    clearInterval(emitMonthlySales);
    clearInterval(emitQmpSales);
  });
});

server.listen(5000, () => console.log('server listened on http://localhost:5000'));
