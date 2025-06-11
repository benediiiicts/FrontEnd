const pool = require('../config/database');

const registerUser = async (req, res) => {

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // Multer middleware untuk menangani upload file
    upload.single('profile_picture')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error during file upload:', err);
            return res.status(400).json({ error: 'Gagal mengunggah file (Multer error)' });
        } else if (err) {
            console.error('Unknown error during file upload:', err);
            return res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah file' });
        }

        try {
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

            const profilePictureBuffer = req.file.buffer; // Dapatkan buffer file (jika menggunakan BYTEA)

            // Hashing password
            const saltRounds = 10; // Jumlah putaran salt, semakin tinggi semakin aman tapi lebih lambat
            const hashedPassword = await bcrypt.hash(password, saltRounds);

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
                INSERT INTO users (email, password, nama, tanggal_lahir, jenis_kelamin, kepribadian_id, kota_id, pendidikan_terakhir, agama_id, tinggi_badan, pekerjaan, bio, profile_picture)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING user_id;
            `;
            const userValues = [
                email,
                hashedPassword, // Gunakan password yang sudah di-hash
                nama,
                tanggal_lahir,
                jenis_kelamin,
                
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

module.exports = registerUser;