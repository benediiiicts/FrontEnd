const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "acakacakacakhahahihihuhuhehehoho";

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        return res.status(400).json({ error: 'Email dan password harus disediakan.' });
    }

    try {
        const userQuery = 'SELECT user_id, email, password, jenis_kelamin, nama FROM users WHERE email = $1';
        const result = await pool.query(userQuery, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email atau password salah.' });
        }

        const user = result.rows[0];
        const hashedPassword = user.password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
            const token = jwt.sign(
                { userId: user.user_id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                message: 'Login berhasil!',
                token: token,
                userId: user.user_id,
                email: user.email,
                jenisKelamin: user.jenis_kelamin,
                nama: user.nama
            });
        } else {
            res.status(401).json({ error: 'Email atau password salah.' });
        }
    } catch (error) {
        console.error('Error login:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
    }
};

module.exports = loginUser;