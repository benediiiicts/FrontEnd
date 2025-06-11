const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController')
const registerController = require('../controllers/registerController')

router.post('/login', loginController);
// router.post('/register', userController.registerUser);
// router.get('/getUsers', userController.authenticateToken, userController.getAllUsers);
// router.get('/kota', userController.getAllKota);
// router.get('/hobi', userController.getAllHobi);
// router.get('/profile', userController.authenticateToken, userController.getUserProfile);
// router.put('/profile/:userId', userController.authenticateToken, userController.updateUserProfile); // Route untuk update profil
// router.get('/profile-picture/:userId', userController.getProfilePicture);

module.exports = router;