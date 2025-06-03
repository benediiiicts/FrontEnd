// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const pool = require('./config/database'); // Import pool
const cors = require('cors');

const app = express();
const port = 3001;

// Konfigurasi CORS untuk mengizinkan hanya dari http://localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions)); // Terapkan konfigurasi CORS

app.use(bodyParser.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Selamat datang di sistem pencarian pasangan!');
});

// Uji koneksi database saat aplikasi dimulai
pool.connect()
  .then(() => {
    console.log('Berhasil terhubung ke database PostgreSQL (dari app.js)!');
    app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Gagal terhubung ke database PostgreSQL (dari app.js):', err);
    // Anda mungkin ingin tidak memulai server jika koneksi database gagal
  });