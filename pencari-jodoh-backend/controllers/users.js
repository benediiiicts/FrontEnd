// controllers/users.js
const pool = require('../config/database');
const multer = require('multer');
const bcrypt = require('bcrypt'); // Import bcrypt
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyyangharusnyasangatpanjangdanacak';

// Konfigurasi multer untuk menyimpan file di memory (tidak ke disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const registerUser = async (req, res) => {
    // Multer middleware untuk menangani upload file
    upload.single('profile_picture')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error during file upload:', err);
            return res.status(400).json({ error: 'Gagal mengunggah file (Multer error)' });
        } else if (err) {
            console.error('Unknown error during file upload:', err);
            return res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah file' });
        }

        const client = await pool.connect(); // Dapatkan client dari pool untuk transaksi
        try {
            await client.query('BEGIN'); // Mulai transaksi

            // Destrukturisasi data dari req.body
            const {
                email, // Ambil email
                password, // Ambil password (akan di-hash)
                nama,
                tanggal_lahir,
                jenis_kelamin,
                sifat_kepribadian,
                kota_id,
                pendidikan_terakhir,
                agama,
                tinggi_badan,
                pekerjaan,
                hobi,
                bio
            } = req.body;

            const profilePictureBuffer = req.file ? req.file.buffer : null; // Dapatkan buffer file (jika menggunakan BYTEA)

            // --- Validasi dan Pemrosesan Data ---

            // Validasi dasar untuk email dan password dari SignUpPage
            if (!email || !password) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Email dan password harus disediakan.' });
            }

            // Hashing password
            const saltRounds = 10; // Jumlah putaran salt, semakin tinggi semakin aman tapi lebih lambat
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // 1. Validasi Jenis Kelamin
            const validJenisKelamin = ['Pria', 'Wanita'];
            if (!validJenisKelamin.includes(jenis_kelamin)) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Jenis kelamin tidak valid. Harus "Pria" atau "Wanita".' });
            }

            // 2. Konversi kota_id ke INTEGER atau NULL
            const finalKotaId = kota_id ? parseInt(kota_id, 10) : null;
            if (kota_id && isNaN(finalKotaId)) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'ID kota tidak valid.' });
            }

            // 3. Konversi tinggi_badan ke INTEGER atau NULL
            const finalTinggiBadan = (tinggi_badan !== undefined && tinggi_badan !== null && tinggi_badan !== '')
                ? parseInt(tinggi_badan, 10)
                : null;
            if (tinggi_badan && tinggi_badan !== '' && isNaN(finalTinggiBadan)) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Tinggi badan tidak valid.' });
            }

            // 4. Parse string hobi menjadi array ID
            let selectedHobiIds = [];
            if (hobi) {
                try {
                    selectedHobiIds = JSON.parse(hobi);
                    if (!Array.isArray(selectedHobiIds) || selectedHobiIds.some(id => isNaN(Number(id)))) {
                        throw new Error('Hobi data is not a valid array of numbers.');
                    }
                } catch (parseError) {
                    console.error('Error parsing hobi JSON:', parseError);
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: 'Format data hobi tidak valid.' });
                }
            }

            // --- Insert Data ke Database ---

            // 1. Insert data ke tabel users
            // Tambahkan 'email' dan 'password' ke daftar kolom dan values
            const insertUserQuery = `
                INSERT INTO users (email, password, nama, tanggal_lahir, jenis_kelamin, sifat_kepribadian, kota_id, pendidikan_terakhir, agama, tinggi_badan, pekerjaan, bio, profile_picture)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING user_id;
            `;
            const userValues = [
                email,
                hashedPassword, // Gunakan password yang sudah di-hash
                nama,
                tanggal_lahir,
                jenis_kelamin,
                sifat_kepribadian || null,
                finalKotaId,
                pendidikan_terakhir || null,
                agama || null,
                finalTinggiBadan,
                pekerjaan || null,
                bio || null,
                profilePictureBuffer
            ];
            const userResult = await client.query(insertUserQuery, userValues);
            const newUserId = userResult.rows[0].user_id;

            // 2. Insert data ke tabel user_hobi untuk setiap hobi yang dipilih
            if (selectedHobiIds.length > 0) {
                const insertHobiQuery = `
                    INSERT INTO user_hobi (user_id, hobi_id)
                    VALUES ($1, $2);
                `;
                for (const hobiId of selectedHobiIds) {
                    await client.query(insertHobiQuery, [newUserId, parseInt(hobiId, 10)]);
                }
            }

            await client.query('COMMIT');
            res.status(201).json({ message: 'Registrasi berhasil', userId: newUserId });

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error during registration transaction:', error);
            // Cek jika error adalah duplikasi email (constraint UNIQUE)
            if (error.code === '23505' && error.constraint === 'users_email_key') {
                return res.status(409).json({ error: 'Email ini sudah terdaftar.' });
            }
            res.status(500).json({ error: 'Gagal melakukan registrasi ke database' });
        } finally {
            client.release();
        }
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password harus disediakan.' });
    }

    try {
        // Cari user berdasarkan email
        const userQuery = 'SELECT user_id, email, password FROM users WHERE email = $1';
        const result = await pool.query(userQuery, [email]);

        if (result.rows.length === 0) {
            // User tidak ditemukan
            return res.status(401).json({ error: 'Email atau password salah.' });
        }

        const user = result.rows[0];
        const hashedPassword = user.password;

        // Bandingkan password yang diberikan dengan hash password di database
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
            // Generate JWT token
            const token = jwt.sign(
                { userId: user.user_id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' } // Token berlaku selama 1 jam
            );
            res.status(200).json({
                message: 'Login berhasil!',
                token: token,
                userId: user.user_id,
                email: user.email
            });
        } else {
            // Password tidak cocok
            res.status(401).json({ error: 'Email atau password salah.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT user_id, nama, jenis_kelamin, kota_id, email FROM users'); // Tambahkan email jika ingin ditampilkan
        res.status(200).json({ users: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar pengguna' });
    }
};

const getAllKota = async (req, res) => {
    try {
        const result = await pool.query('SELECT kota_id, nama_kota FROM kota ORDER BY nama_kota');
        res.status(200).json({ kota: result.rows });
    } catch (error) {
        console.error('Error fetching kota:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar kota' });
    }
};

const getAllHobi = async (req, res) => {
    try {
        const result = await pool.query('SELECT hobi_id, nama_hobi FROM hobi ORDER BY nama_hobi');
        res.status(200).json({ hobi: result.rows });
    } catch (error) {
        console.error('Error fetching hobi:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar hobi' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getAllKota,
    getAllHobi,
};
