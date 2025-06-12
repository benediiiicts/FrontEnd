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
    const {idUser, jenisKelamin} = req.body;
    try{
        const query = 'SELECT user_id, nama, tanggal_lahir, profile_picture FROM users WHERE user_id != $1 AND jenis_kelamin != $2';
        const result = await pool.query(query, [idUser, jenisKelamin]);
        const users = result.rows.map(user => {
            const imgType = 'image/jpeg';
            const base64Img = user.profile_picture.toString('base64');
            user.profile_picture = `data:${imgType};base64,${base64Img}`;
            return user;
        });
        res.status(200).json({ users: result.rows });
    }catch (error) {
        console.error('Error fetching users:', error);
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