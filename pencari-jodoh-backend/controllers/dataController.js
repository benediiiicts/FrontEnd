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
                u.kota_id, u.kepribadian_id, u.agama_id,
                k.nama_kota,
                p.jenis_kepribadian AS nama_personality,
                a.nama_agama
            FROM users u
            LEFT JOIN kota k ON u.kota_id = k.kota_id
            LEFT JOIN kepribadian p ON u.kepribadian_id = p.kepribadian_id
            LEFT JOIN agama a ON u.agama_id = a.agama_id
            WHERE u.user_id != $1 
                AND u.jenis_kelamin != $2
                AND u.user_id NOT IN (
                    SELECT liked_user_id FROM liked_users WHERE liking_user_id = $1
                )
                AND u.user_id NOT IN (
                    SELECT disliked_user_id FROM disliked_users WHERE disliking_user_id = $1
                )
            ORDER BY RANDOM()
            `;
        
        const queryParams = [idUser, jenisKelamin];
        const result = await pool.query(queryText, queryParams);

        // Ubah format gambar ke base64 sebelum dikirim
        const users = result.rows.map(user => {

            const imgType = 'image/jpeg';
            const base64Img = user.profile_picture.toString('base64');
            user.profile_picture = `data:${imgType};base64,${base64Img}`;
            return user;
        });

        res.status(200).json({ users: users });
    } catch (error) {
        console.error('Error fetching all users for CSR:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar users' });
    }
};

// Fungsi untuk menyimpan data like ke table liked_users
const likeUser = async (req, res) => {
  const { liking_user_id, liked_user_id } = req.body;
  try {
    // INSERT data ke liked_users. Gunakan ON CONFLICT DO NOTHING agar tidak duplikat
    await pool.query(
      `INSERT INTO liked_users (liking_user_id, liked_user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [liking_user_id, liked_user_id]
    );
    res.status(200).json({ message: 'User liked successfully' });
  } catch (error) {
    console.error('Error liking user:', error);
    res.status(500).json({ error: 'Gagal melakukan like' });
  }
};

// Fungsi untuk menyimpan data dislike ke table disliked_users
const dislikeUser = async (req, res) => {
  const { disliking_user_id, disliked_user_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO disliked_users (disliking_user_id, disliked_user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [disliking_user_id, disliked_user_id]
    );
    res.status(200).json({ message: 'User disliked successfully' });
  } catch (error) {
    console.error('Error disliking user:', error);
    res.status(500).json({ error: 'Gagal melakukan dislike' });
  }
};


module.exports = {
    getAllKota,
    getAllHobi,
    getAllAgama,
    getAllKepribadian,
    getAllUsers,
    likeUser,
    dislikeUser
};
