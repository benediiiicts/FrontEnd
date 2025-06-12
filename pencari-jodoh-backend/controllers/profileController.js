const pool = require('../config/database');
const multer = require('multer');

// Konfigurasi Multer untuk menyimpan file di memory (buffer)
// Ini sudah benar untuk menerima file di req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getUserProfile = async (req, res) => {
    const { idUser } = req.body;
    try {
        const query = `
            WITH UserHobbies AS (
                SELECT
                    uh.user_id,
                    h.hobi_id,
                    h.nama_hobi
                FROM
                    user_hobi AS uh
                JOIN
                    hobi AS h ON uh.hobi_id = h.hobi_id
                WHERE
                    uh.user_id = $1
                GROUP BY
                    uh.user_id, h.hobi_id, h.nama_hobi
                ORDER BY
                    h.hobi_id
            )
            SELECT
                u.user_id,
                u.email,
                u.nama,
                u.tanggal_lahir,
                u.jenis_kelamin,
                u.kota_id,
                kt.nama_kota,
                u.kepribadian_id,
                kp.jenis_kepribadian,
                u.agama_id,
                ag.nama_agama,
                COALESCE(ARRAY_AGG(uh.hobi_id) FILTER (WHERE uh.hobi_id IS NOT NULL), '{}') AS "idHobiList",
                COALESCE(ARRAY_AGG(uh.nama_hobi) FILTER (WHERE uh.nama_hobi IS NOT NULL), '{}') AS "hobiList",
                u.pendidikan_terakhir,
                u.tinggi_badan,
                u.pekerjaan,
                u.profile_picture,
                u.bio
            FROM
                users AS u
            LEFT JOIN
                kota AS kt ON u.kota_id = kt.kota_id
            LEFT JOIN
                kepribadian AS kp ON u.kepribadian_id = kp.kepribadian_id
            LEFT JOIN
                agama AS ag ON u.agama_id = ag.agama_id
            LEFT JOIN
                UserHobbies AS uh ON u.user_id = uh.user_id
            WHERE
                u.user_id = $1
            GROUP BY
                u.user_id, u.email, u.nama, u.tanggal_lahir, u.jenis_kelamin, u.kota_id, kt.nama_kota,
                u.kepribadian_id, kp.jenis_kepribadian, u.agama_id, ag.nama_agama,
                u.pendidikan_terakhir, u.tinggi_badan, u.pekerjaan, u.profile_picture, u.bio;
        `
        const result = await pool.query(query, [idUser]);
        const userProfile = result.rows[0];

        if (!userProfile) {
            return res.status(404).json({ error: 'User profile not found.' });
        }

        // Pastikan profile_picture ada sebelum diolah
        if (userProfile.profile_picture) {
            const imgType = 'image/jpeg'; // Asumsi semua gambar adalah JPEG atau sesuaikan dengan tipe yang disimpan
            const base64Img = userProfile.profile_picture.toString('base64');
            userProfile.profile_picture = `data:${imgType};base64,${base64Img}`;
        } else {
            userProfile.profile_picture = null; // Atau URL gambar default jika tidak ada
        }

        res.status(200).json({ user: userProfile });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Gagal mengambil data profile user' });
    }
};

const updateUserProfile = async (req, res) => {
    // Middleware Multer dipanggil di sini sebelum logika utama
    upload.single('profile_picture')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error saat upload file (update):', err);
            return res.status(400).json({ error: 'Gagal mengunggah file (Multer error)' });
        } else if (err) {
            console.error('Error saat upload file (update):', err);
            return res.status(500).json({ error: 'Terjadi kesalahan saat mengunggah file' });
        }

        const userIdToUpdate = parseInt(req.params.userId, 10);

        // Ambil koneksi dari pool sebelum memulai transaksi
        const client = await pool.connect();

        try {
            await client.query('BEGIN'); // Mulai transaksi

            const {
                nama,
                tanggal_lahir,
                jenis_kelamin,
                kepribadian_id,
                kota_id,
                pendidikan_terakhir,
                agama_id,
                tinggi_badan,
                pekerjaan,
                hobiList, // Ini akan menjadi stringified JSON array
                bio
            } = req.body;

            let updateFields = [];
            let updateValues = [];
            let paramIndex = 1;

            const addField = (field, value) => {
                // Perhatikan: Anda mungkin ingin membedakan antara null dan undefined
                // untuk memastikan field di-set ke NULL di DB jika data tidak dikirim
                // atau dikirim sebagai null dari frontend.
                // Untuk kesederhanaan, kita akan tetap menambahkan field jika nilainya ada.
                if (value !== undefined) { // Cek apakah value bukan undefined
                    updateFields.push(`${field} = $${paramIndex++}`);
                    updateValues.push(value);
                }
            };

            addField('nama', nama);
            addField('tanggal_lahir', tanggal_lahir);
            addField('jenis_kelamin', jenis_kelamin);
            addField('kepribadian_id', kepribadian_id ? parseInt(kepribadian_id, 10) : null);
            addField('kota_id', kota_id ? parseInt(kota_id, 10) : null);
            addField('pendidikan_terakhir', pendidikan_terakhir);
            addField('agama_id', agama_id ? parseInt(agama_id, 10) : null);
            addField('tinggi_badan', tinggi_badan ? parseInt(tinggi_badan, 10) : null);
            addField('pekerjaan', pekerjaan);
            addField('bio', bio);

            const profilePictureBuffer = req.file ? req.file.buffer : null;
            if (profilePictureBuffer) {
                addField('profile_picture', profilePictureBuffer);
            }

            if (updateFields.length === 0 && hobiList === undefined) { // Periksa juga hobiList
                await client.query('ROLLBACK'); // Rollback jika tidak ada yang diupdate
                return res.status(400).json({ message: 'Tidak ada data yang disediakan untuk diperbarui.' });
            }

            if (updateFields.length > 0) {
                const updateUserQuery = `
                    UPDATE users
                    SET ${updateFields.join(', ')}
                    WHERE user_id = $${paramIndex};
                `;
                updateValues.push(userIdToUpdate); // Parameter terakhir adalah userIdToUpdate
                await client.query(updateUserQuery, updateValues);
            }

            // --- Logika untuk hobi ---
            if (hobiList !== undefined) { // Pastikan hobiList ada di body request
                let selectedHobiIds = [];
                try {
                    // Cek apakah hobiList adalah string yang perlu di-parse
                    if (typeof hobiList === 'string') {
                        selectedHobiIds = JSON.parse(hobiList);
                    } else if (Array.isArray(hobiList)) {
                        selectedHobiIds = hobiList;
                    }

                    // Pastikan semua ID hobi adalah integer
                    selectedHobiIds = selectedHobiIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

                } catch (parseError) {
                    console.error('Error parsing hobi JSON (update):', parseError);
                    await client.query('ROLLBACK'); // Rollback jika parsing gagal
                    return res.status(400).json({ error: 'Format data hobi tidak valid.' });
                }

                // 1. Hapus semua hobi user yang ada saat ini
                const deleteHobiQuery = `
                    DELETE FROM user_hobi
                    WHERE user_id = $1;
                `;
                await client.query(deleteHobiQuery, [userIdToUpdate]);

                // 2. Tambahkan hobi-hobi baru yang diterima dari frontend
                if (selectedHobiIds.length > 0) {
                    // Buat array of string untuk nilai VALUES, contoh: ['($1, $2)', '($3, $4)']
                    const hobiInsertPlaceholders = selectedHobiIds.map((_, i) => `($${(i * 2) + 1}, $${(i * 2) + 2})`);
                    // Buat array of values yang rata, contoh: [userId, hobiId1, userId, hobiId2, ...]
                    const hobiInsertValues = selectedHobiIds.flatMap(hobiId => [userIdToUpdate, hobiId]);

                    const insertHobiQuery = `
                        INSERT INTO user_hobi (user_id, hobi_id)
                        VALUES ${hobiInsertPlaceholders.join(',')};
                    `;
                    await client.query(insertHobiQuery, hobiInsertValues); // Jalankan query dengan parameter
                }
            }

            await client.query('COMMIT'); // Commit transaksi jika semua berhasil
            res.status(200).json({ message: 'Profil berhasil diperbarui.', userId: userIdToUpdate });

        } catch (error) {
            await client.query('ROLLBACK'); // Rollback transaksi jika ada error
            console.error('Error during profile update process:', error);
            // Cek jika error adalah duplikasi email (constraint UNIQUE)
            if (error.code === '23505' && error.constraint === 'users_email_key') {
                return res.status(409).json({ error: 'Email ini sudah terdaftar.' });
            }
            // Tangani error duplicate key untuk hobi juga, meskipun seharusnya sudah teratasi dengan DELETE/INSERT
            if (error.code === '23505' && error.constraint === 'user_hobi_pkey') {
                 return res.status(409).json({ error: 'Gagal memperbarui hobi: terdapat duplikasi data.' });
            }
            res.status(500).json({ error: 'Gagal memperbarui profil ke database.' });
        } finally {
            client.release(); // Pastikan koneksi dikembalikan ke pool
        }
    });
};

module.exports = {
    getUserProfile,
    updateUserProfile
};