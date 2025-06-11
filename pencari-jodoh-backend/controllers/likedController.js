//mpor modul 
const pool = require('../config/database');
const path = require('path');//membutuhkan path 
const fs = require('fs');//file system untuk mengambil file

//fungsi untuk mengambil getLiked User
    const getLikedUsers = async (req, res) => {
        try {
            //mengambil si liking_user_id dari input 
            const { liking_user_id } = req.body;
            //kalau misal si liking user id kosong
            if (!liking_user_id) {
                return res.status(400).json({ message: 'liking_user_id tidak boleh kosong' });
            }
            //query untuk mengambil data dari liked user 
            const query = `
                SELECT 
                    u.user_id, u.nama, u.email, u.tanggal_lahir, u.jenis_kelamin, 
                    u.kota_id, k.nama_kota, u.kepribadian_id, kp.jenis_kepribadian, 
                    u.agama_id, ag.nama_agama, u.pendidikan_terakhir, 
                    u.tinggi_badan, u.pekerjaan, u.profile_picture, u.bio, 
                    l.liked_at
                FROM liked_users l
                JOIN users u ON l.liked_user_id = u.user_id
                LEFT JOIN kota k ON u.kota_id = k.kota_id
                LEFT JOIN kepribadian kp ON u.kepribadian_id = kp.kepribadian_id
                LEFT JOIN agama ag ON u.agama_id = ag.agama_id
                WHERE l.liking_user_id = $1
                ORDER BY l.liked_at DESC
            `;
            //melakukan query
            const result = await pool.query(query, [liking_user_id]);
            const users = result.rows.map(user => {
                const imgType = 'image/jpeg/png';
                const base64Img = user.profile_picture.toString('base64');
                user.profile_picture = `data:${imgType};base64,${base64Img}`;
                return user;
            });

            res.status(200).json({ liked_users: result.rows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    };

   


// Change how you export to include both functions
module.exports = {
    getLikedUsers
};
