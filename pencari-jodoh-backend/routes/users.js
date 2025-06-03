// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/register', userController.registerUser);
router.get('/getUsers', userController.getAllUsers);
router.get('/kota', userController.getAllKota);
router.get('/hobi', userController.getAllHobi);
router.post('/login', userController.loginUser); // Tambahkan route untuk login

module.exports = router;
