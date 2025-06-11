// controllers/users.js
const pool = require('../config/database');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyyangharusnyasangatpanjangdanacak';

// Konfigurasi multer untuk menyimpan file di memory (tidak ke disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token tidak ditemukan.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ error: 'Token tidak valid atau kadaluarsa.' });
        }
        req.user = user;
        next();
    });
};

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

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userProfileQuery = `
            SELECT
                u.user_id,
                u.email,
                u.nama,
                u.tanggal_lahir,
                u.jenis_kelamin,
                u.sifat_kepribadian,
                u.pendidikan_terakhir,
                u.agama,
                u.tinggi_badan,
                u.pekerjaan,
                u.bio,
                k.nama_kota AS lokasi_nama,
                k.kota_id, -- Sertakan kota_id untuk keperluan edit
                ARRAY_AGG(h.nama_hobi) FILTER (WHERE h.nama_hobi IS NOT NULL) AS hobi_names,
                ARRAY_AGG(h.hobi_id) FILTER (WHERE h.hobi_id IS NOT NULL) AS hobi_ids
            FROM
                users u
            LEFT JOIN
                kota k ON u.kota_id = k.kota_id
            LEFT JOIN
                user_hobi uh ON u.user_id = uh.user_id
            LEFT JOIN
                hobi h ON uh.hobi_id = h.hobi_id
            WHERE
                u.user_id = $1
            GROUP BY
                u.user_id, k.nama_kota, k.kota_id; -- Tambahkan k.kota_id di GROUP BY
        `;

        const result = await pool.query(userProfileQuery, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profil pengguna tidak ditemukan.' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Gagal mengambil data profil pengguna.' });
    }
};

const getProfilePicture = async (req, res) => {
    const userId = req.params.userId; // Ambil userId dari parameter URL

    try {
        const query = 'SELECT profile_picture FROM users WHERE user_id = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0 || !result.rows[0].profile_picture) {
            return res.status(404).send('Gambar profil tidak ditemukan.');
        }

        const imageData = result.rows[0].profile_picture;

        // Asumsi gambar adalah JPEG atau PNG. Anda mungkin perlu menyimpan tipe MIME di DB
        // untuk penanganan yang lebih akurat. Untuk contoh, kita asumsikan JPEG.
        res.writeHead(200, {
            'Content-Type': 'image/jpeg', // Ganti jika Anda tahu tipe gambar lain
            'Content-Length': imageData.length
        });
        res.end(imageData); // Kirim buffer gambar
    } catch (error) {
        console.error('Error serving profile picture:', error);
        res.status(500).send('Gagal mengambil gambar profil.');
    }
};

const updateUserProfile = async (req, res) => {
    const targetUserId = req.params.userId;
    const authenticatedUserId = req.user.userId;

    if (String(targetUserId) !== String(authenticatedUserId)) {
        return res.status(403).json({ error: 'Anda tidak diizinkan mengedit profil pengguna lain.' });
    }

    upload.single('profile_picture')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error during file upload for update:', err);
            return res.status(400).json({ error: 'Gagal mengunggah file gambar.' });
        } else if (err) {
            console.error('Unknown error during file upload for update:', err);
            return res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah file.' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const {
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

            const newProfilePictureBuffer = req.file ? req.file.buffer : undefined;

            // Validasi dan pemrosesan data (mirip dengan registerUser)
            const validJenisKelamin = ['Pria', 'Wanita'];
            if (jenis_kelamin && !validJenisKelamin.includes(jenis_kelamin)) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Jenis kelamin tidak valid. Harus "Pria" atau "Wanita".' });
            }

            const finalKotaId = kota_id ? parseInt(kota_id, 10) : null;
            if (kota_id && isNaN(finalKotaId)) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'ID kota tidak valid.' });
            }

            const finalTinggiBadan = (tinggi_badan !== undefined && tinggi_badan !== null && tinggi_badan !== '')
                ? parseInt(tinggi_badan, 10)
                : null;
            if (tinggi_badan && tinggi_badan !== '' && isNaN(finalTinggiBadan)) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Tinggi badan tidak valid.' });
            }

            let selectedHobiIds = [];
            if (hobi) {
                try {
                    selectedHobiIds = JSON.parse(hobi);
                    if (!Array.isArray(selectedHobiIds) || selectedHobiIds.some(id => isNaN(Number(id)))) {
                        throw new Error('Hobi data is not a valid array of numbers.');
                    }
                } catch (parseError) {
                    console.error('Error parsing hobi JSON for update:', parseError);
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: 'Format data hobi tidak valid.' });
                }
            }

            // Dynamically build the UPDATE query and values
            let updateFields = [];
            let updateValues = [];
            let paramIndex = 1; // Start parameter index from 1

            const addField = (fieldName, value) => {
                updateFields.push(`${fieldName} = $${paramIndex++}`);
                updateValues.push(value);
            };

            addField('nama', nama || null);
            addField('tanggal_lahir', tanggal_lahir || null);
            addField('jenis_kelamin', jenis_kelamin || null);
            addField('sifat_kepribadian', sifat_kepribadian || null);
            addField('kota_id', finalKotaId);
            addField('pendidikan_terakhir', pendidikan_terakhir || null);
            addField('agama', agama || null);
            addField('tinggi_badan', finalTinggiBadan);
            addField('pekerjaan', pekerjaan || null);
            addField('bio', bio || null);

            // Only add profile_picture to update if a new file was provided
            if (newProfilePictureBuffer !== undefined) {
                addField('profile_picture', newProfilePictureBuffer);
            }

            // Add WHERE clause parameter (authenticatedUserId) as the last parameter
            updateValues.push(authenticatedUserId);

            const updateUserQuery = `
                UPDATE users
                SET ${updateFields.join(', ')}
                WHERE user_id = $${paramIndex}
            `;

            await client.query(updateUserQuery, updateValues);

            // 2. Update data di tabel user_hobi
            // Hapus semua hobi yang ada untuk user ini
            await client.query('DELETE FROM user_hobi WHERE user_id = $1', [authenticatedUserId]);

            // Masukkan hobi yang baru dipilih
            if (selectedHobiIds.length > 0) {
                const insertHobiQuery = `
                    INSERT INTO user_hobi (user_id, hobi_id)
                    VALUES ($1, $2);
                `;
                for (const hobiId of selectedHobiIds) {
                    await client.query(insertHobiQuery, [authenticatedUserId, parseInt(hobiId, 10)]);
                }
            }

            await client.query('COMMIT'); // Commit transaksi
            res.status(200).json({ message: 'Profil berhasil diperbarui.' });

        } catch (error) {
            await client.query('ROLLBACK'); // Rollback transaksi jika ada error
            console.error('Error during profile update transaction:', error);
            res.status(500).json({ error: 'Gagal memperbarui profil pengguna.' });
        } finally {
            client.release(); // Lepaskan client
        }
    });
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
    authenticateToken,
    registerUser,
    loginUser,
    getUserProfile,
    getProfilePicture,
    updateUserProfile,
    getAllUsers,
    getAllKota,
    getAllHobi,
};
