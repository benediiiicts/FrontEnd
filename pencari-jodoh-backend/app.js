const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const dataRoutes = require('./routes/data');
const pool = require('./config/database');
const cors = require('cors');
const setupWebSocket = require('./websocket');
const http = require('http');

const app = express();
const port = 3001;

// buat server HTTP
const server = http.createServer(app);

const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/data', dataRoutes);

// setup logika dari websocket.js ke server
setupWebSocket(server);

// Koneksi Database dan Start Server
pool.connect()
  .then(() => {
    console.log('Berhasil terhubung ke database!');
    server.listen(port, () => {
      console.log(`🚀 Server berjalan di http://localhost:${port}, WebSocket juga aktif.`);
    });
  })
  .catch(err => {
    console.error('Gagal terhubung ke database PostgreSQL (dari app.js):', err);
  });