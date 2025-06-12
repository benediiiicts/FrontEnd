const pool = require('../config/database');

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

const getAllAgama = async (req, res) => {
    try {
        const result = await pool.query('SELECT agama_id, nama_agama FROM agama ORDER BY nama_agama');
        res.status(200).json({ agama: result.rows });
    } catch (error) {
        console.error('Error fetching agama:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar agama' });
    }
};

const getAllKepribadian = async (req, res) => {
    try {
        const result = await pool.query('SELECT kepribadian_id, jenis_kepribadian FROM kepribadian ORDER BY jenis_kepribadian');
        res.status(200).json({ kepribadian: result.rows });
    } catch (error) {
        console.error('Error fetching kepribadian:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar kepribadian' });
    }
};

const getAllUsers = async (req, res) => {
    // Hanya butuh idUser dan jenisKelamin untuk mendapatkan daftar dasar
    const { idUser, jenisKelamin } = req.body;

    try {
        // Query sederhana untuk mengambil semua data yang dibutuhkan oleh frontend untuk filter
        const queryText = `
            SELECT 
                u.user_id, u.nama, u.tanggal_lahir, u.profile_picture,
                u.kota_id, u.kepribadian_id, u.agama_id, -- Kirim ID untuk filtering di client
                k.nama_kota,
                p.jenis_kepribadian AS nama_personality,
                a.nama_agama
            FROM users u
            LEFT JOIN kota k ON u.kota_id = k.kota_id
            LEFT JOIN kepribadian p ON u.kepribadian_id = p.kepribadian_id
            LEFT JOIN agama a ON u.agama_id = a.agama_id
            WHERE u.user_id != $1 AND u.jenis_kelamin != $2
            ORDER BY RANDOM() -- Acak daftar awal dari server
        `;
        
        const queryParams = [idUser, jenisKelamin];
        const result = await pool.query(queryText, queryParams);

        // Ubah format gambar ke base64 sebelum dikirim
        const users = result.rows.map(user => {
            if (user.profile_picture) {
                const imgType = 'image/jpeg';
                const base64Img = Buffer.from(user.profile_picture).toString('base64');
                user.profile_picture = `data:${imgType};base64,${base64Img}`;
            }
            return user;
        });

        res.status(200).json({ users: users });
    } catch (error) {
        console.error('Error fetching all users for CSR:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar users' });
    }
};


module.exports = {
    getAllKota,
    getAllHobi,
    getAllAgama,
    getAllKepribadian,
    getAllUsers
};