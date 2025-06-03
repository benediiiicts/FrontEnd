const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3001;

// Middleware untuk mem-parsing body request dalam format JSON
app.use(bodyParser.json());

// Mengaktifkan CORS (Cross-Origin Resource Sharing)
// Ini penting agar frontend Anda (yang berjalan di port berbeda) bisa berkomunikasi dengan backend.
// Untuk produksi, Anda mungkin ingin membatasi origin ke domain frontend Anda saja.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Izinkan dari semua origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Path ke file data_user.json
const dataFilePath = path.join(__dirname, 'data', 'data_user.json');

// Pastikan file data_user.json ada, jika tidak, buat file kosong
async function initializeDataFile() {
  try {
    await fs.access(dataFilePath); // Coba akses file
  } catch (error) {
    // Jika file tidak ada, buat dengan array kosong
    console.log('File data_user.json tidak ditemukan, membuat yang baru.');
    await fs.writeFile(dataFilePath, '[]', 'utf8');
  }
}

// Melayani file statis (gambar profil)
// Ini akan memungkinkan frontend untuk mengakses gambar di /data/images/user1.jpg
// dengan URL seperti http://localhost:3001/images/user1.jpg (jika server berjalan di port 3001)
// Atau jika Anda ingin pathnya persis seperti yang Anda sebutkan: /data/images
app.use('/images', express.static(path.join(__dirname, 'data', 'images')));


// --- Endpoint API ---

// GET: Endpoint untuk mengambil semua data pengguna
app.get('/api/users', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    console.error('Gagal membaca data pengguna:', error);
    // Jika file tidak ada atau kosong, kembalikan array kosong
    if (error.code === 'ENOENT' || error.name === 'SyntaxError') {
      return res.json([]);
    }
    res.status(500).json({ error: 'Terjadi kesalahan server saat mengambil data pengguna.' });
  }
});

// --- Inisialisasi dan Jalankan Server ---
initializeDataFile().then(() => {
  app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
    console.log(`Akses gambar profil di http://localhost:${port}/images/`);
  });
}).catch(err => {
  console.error('Gagal menginisialisasi file data:', err);
});
