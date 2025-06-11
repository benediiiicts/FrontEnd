const fs = require('fs');   // 'fs' (File System) untuk membaca file dari folder
const path = require('path');
const pool = require('./config/database');

/**
 * Script ini akan mengisi (seed) data awal ke dalam database, termasuk:
 * - Data pengguna dari array `usersData`.
 * * Untuk menjalankan:
 * 1. Pastikan ekstensi pgcrypto sudah aktif di database Anda: CREATE EXTENSION IF NOT EXISTS pgcrypto;
 * 2. Buka terminal di folder `pencari-jodoh-backend`.
 * 3. Jalankan perintah: node seed_database.js
 */

// --- DATA PENGGUNA YANG AKAN DIMASUKKAN ---
const usersData = [
    {
        email: 'alyaamanda@gmail.com',
        password: 'alyaamanda123',
        nama: 'Alya Amanda',
        tanggal_lahir: '2006-08-26',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 11,
        kota_id: 34,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 165,
        pekerjaan: 'Idol',
        bio: 'Jika hatimu sedang menangis aku akan datang sebagai pelangi.',
        photo_filename: 'alya_amanda.jpg'
    },
    {
        email: 'amandasukma@gmail.com',
        password: 'amandasukma123',
        nama: 'Amanda Sukma',
        tanggal_lahir: '2004-12-17',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 12,
        kota_id: 39,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 160,
        pekerjaan: 'Idol',
        bio: 'Aku akan membuat hatimu berdebar kencang seperti lagu dengan 1.000 BPM.',
        photo_filename: 'amanda_sukma.jpg'
    },
    {
        email: 'angelinachristy@gmail.com',
        password: 'angelinachristy123',
        nama: 'Angelina Christy',
        tanggal_lahir: '2005-12-05',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 15,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Peduli dan berbaik hati, siapakah dia?',
        photo_filename: 'angelina_christy.jpg'
    },
    {
        email: 'anindyaramadhani@gmail.com',
        password: 'anindyaramadhani123',
        nama: 'Anindya Ramadhani',
        tanggal_lahir: '2005-10-18',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 11,
        kota_id: 35,
        agama_id: 1,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 154,
        pekerjaan: 'Idol',
        bio: 'Si mungil hadir semanis mangga.',
        photo_filename: 'anindya_ramadhani.jpg'
    },
    {
        email: 'aurellia@gmail.com',
        password: 'aurellia123',
        nama: 'Aurellia',
        tanggal_lahir: '2002-10-29',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 11,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'S1',
        tinggi_badan: 155,
        pekerjaan: 'Idol',
        bio: 'Si social butterfly yang energik dan periang!',
        photo_filename: 'aurellia.jpg'
    },
    {
        email: 'aurhelalana@gmail.com',
        password: 'aurhelalana123',
        nama: 'Aurhel Alana',
        tanggal_lahir: '2006-09-14',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 15,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMA',
        tinggi_badan: 163,
        pekerjaan: 'Idol',
        bio: 'Dengan kekuatan bulan, aku akan menyihirmu dengan pesonaku.',
        photo_filename: 'aurhel_alana.jpg'
    },
    {
        email: 'cathleennixie@gmail.com',
        password: 'cathleennixie123',
        nama: 'Cathleen Nixie',
        tanggal_lahir: '2009-05-28',
        jenis_kelamin: 'Wanita',
        kepribadian_id: 13,
        kota_id: 35,
        agama_id: 2,
        pendidikan_terakhir: 'SMP',
        tinggi_badan: 158,
        pekerjaan: 'Idol',
        bio: 'Tring! Si peri cantik jelita, itulah Aku!',
        photo_filename: 'cathleen_nixie.jpg'
    }
];

const seedDatabase = async () => {
    const client = await pool.connect();
    console.log('Koneksi ke database berhasil.');

    try {
        // Pastikan ekstensi pgcrypto tersedia
        await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
        console.log('Ekstensi pgcrypto dipastikan aktif.');

        await client.query('BEGIN'); // Mulai transaksi

        // Membuat path absolut ke folder foto.
        // `__dirname` adalah variabel global Node.js yang berisi path ke folder tempat script ini berada.
        const photoDirectory = path.join(__dirname, 'data', 'fotoJKT');

        for (const userData of usersData) {
            console.log(`\nMemproses: ${userData.nama}`);

            // Langkah 1: Membaca file gambar
            // Menggabungkan path direktori dengan nama file dari data pengguna
            const filePath = path.join(photoDirectory, userData.photo_filename);
            let imageBuffer = null;

            // Cek apakah file benar-benar ada sebelum mencoba membacanya
            if (fs.existsSync(filePath)) {
                // Jika ada, baca seluruh file sebagai data biner dan simpan di `imageBuffer`
                imageBuffer = fs.readFileSync(filePath);
                console.log(`--> Foto ditemukan: ${userData.photo_filename}`);
            } else {
                console.warn(`--> PERINGATAN: Foto ${userData.photo_filename} tidak ditemukan. Kolom gambar akan diisi NULL.`);
            }
            
            // Langkah 2: Menyiapkan query SQL
            // Query INSERT dengan placeholder ($1, $2, dst.) untuk keamanan (mencegah SQL Injection).
            // `crypt($2, gen_salt('bf', 10))` akan dieksekusi di sisi database (untuk hashing password).
            // `ON CONFLICT (email) DO NOTHING` mencegah error jika email sudah ada; data duplikat akan dilewati.
            const insertQuery = `
                INSERT INTO users (
                    email, password, nama, tanggal_lahir, jenis_kelamin, 
                    kepribadian_id, kota_id, agama_id, pendidikan_terakhir, 
                    tinggi_badan, pekerjaan, bio, profile_picture
                ) VALUES ($1, crypt($2, gen_salt('bf', 10)), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (email) DO NOTHING; -- Tidak melakukan apa-apa jika email sudah ada
            `;

            // Membuat array `values` yang urutannya HARUS SAMA dengan urutan placeholder ($1, $2, ...).
            const values = [
                userData.email,
                userData.password,
                userData.nama,
                userData.tanggal_lahir,
                userData.jenis_kelamin,
                userData.kepribadian_id,
                userData.kota_id,
                userData.agama_id,
                userData.pendidikan_terakhir,
                userData.tinggi_badan,
                userData.pekerjaan,
                userData.bio,
                imageBuffer
            ];

            // Langkah 3: Menjalankan query
            // Mengirim query dan nilainya (values) ke database untuk dieksekusi.
            const res = await client.query(insertQuery, values);

            // Memberikan feedback di konsol berdasarkan hasil query (untuk debugging)
            if (res.rowCount > 0) {
                 console.log(`--> Sukses memasukkan data untuk ${userData.nama}`);
            } else {
                 console.log(`--> Data untuk ${userData.nama} (email: ${userData.email}) sudah ada, dilewati.`);
            }
        }

        // MENYIMPAN TRANSAKSI: Jika semua perulangan berhasil tanpa error, simpan semua perubahan ke database.
        await client.query('COMMIT');
        console.log('\n-----------------------------------');
        console.log('Proses seeding data berhasil diselesaikan.');
        console.log('-----------------------------------');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n!!! TERJADI ERROR SAAT SEEDING !!!');
        console.error(error);
    } finally {
        client.release();
        await pool.end();   // Menutup semua koneksi di pool. Penting untuk script yang hanya berjalan sekali.
        console.log('Koneksi ke database ditutup.');
    }
};

seedDatabase();
