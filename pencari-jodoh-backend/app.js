// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const dataRoutes = require('./routes/data');
const pool = require('./config/database');
const cors = require('cors');

const app = express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/data', dataRoutes);

pool.connect()
  .then(() => {
    console.log('Berhasil terhubung ke database PostgreSQL (dari app.js)!');
    app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Gagal terhubung ke database PostgreSQL (dari app.js):', err);
  });