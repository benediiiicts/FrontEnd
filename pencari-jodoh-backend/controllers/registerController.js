const pool = require('../config/database');
const multer = require('multer');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    upload.single('profile_picture')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error saat upload file:', err);
            return res.status(400).json({ error: 'Gagal mengunggah file (Multer error)' });
        } else if (err) {
            console.error('Error saat upload file:', err);
            return res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah file' });
        }

        try {
            const {
                email,
                password,
                nama,
                tanggal_lahir,
                jenis_kelamin,
                kepribadian_id,
                kota_id,
                pendidikan_terakhir,
                agama_id,
                tinggi_badan,
                pekerjaan,
                hobiList,
                bio
            } = req.body;

            const profilePictureBuffer = req.file.buffer;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            let selectedHobiIds = [];
            if (hobiList) {
                try {
                    selectedHobiIds = JSON.parse(hobiList);
                    if (!Array.isArray(selectedHobiIds) || selectedHobiIds.some(id => isNaN(Number(id)))) {
                        throw new Error('Hobi data is not a valid array of numbers.');
                    }
                } catch (parseError) {
                    console.error('Error parsing hobi JSON:', parseError);
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: 'Format data hobi tidak valid.' });
                }
            }

            const insertUserQuery = `
                INSERT INTO users (email, password, nama, tanggal_lahir, jenis_kelamin, kepribadian_id, kota_id, pendidikan_terakhir, agama_id, tinggi_badan, pekerjaan, bio, profile_picture)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING user_id;
            `;
            const userValues = [
                email,
                hashedPassword,
                nama,
                tanggal_lahir,
                jenis_kelamin,
                kepribadian_id,
                kota_id,
                pendidikan_terakhir,
                agama_id,
                tinggi_badan,
                pekerjaan,
                bio,
                profilePictureBuffer,
            ];

            const userResult = await pool.query(insertUserQuery, userValues);
            const newUserId = userResult.rows[0].user_id;

            if (selectedHobiIds.length > 0) {
                const insertHobiQuery = `
                    INSERT INTO user_hobi (user_id, hobi_id)
                    VALUES ($1, $2);
                `;
                for (const hobiId of selectedHobiIds) {
                    await pool.query(insertHobiQuery, [newUserId, parseInt(hobiId, 10)]);
                }
            }

            res.status(201).json({ message: 'Registrasi berhasil', userId: newUserId });

        } catch (error) {
            console.error('Error during registration process:', error);
            // Cek jika error adalah duplikasi email (constraint UNIQUE)
            if (error.code === '23505' && error.constraint === 'users_email_key') {
                return res.status(409).json({ error: 'Email ini sudah terdaftar.' });
            }
            res.status(500).json({ error: 'Gagal melakukan registrasi ke database' });
        }
    });
};

module.exports = registerUser;