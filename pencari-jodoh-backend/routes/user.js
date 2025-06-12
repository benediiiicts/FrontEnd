const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const profileController = require('../controllers/profileController');

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/profile', profileController.getUserProfile);
router.put('/updateProfile/:userId', profileController.updateUserProfile);
// router.get('/getUsers', userController.authenticateToken, userController.getAllUsers);
// router.get('/kota', userController.getAllKota);
// router.get('/hobi', userController.getAllHobi);
// router.get('/profile', userController.authenticateToken, userController.getUserProfile);
// router.put('/profile/:userId', userController.authenticateToken, userController.updateUserProfile); // Route untuk update profil
// router.get('/profile-picture/:userId', userController.getProfilePicture);

module.exports = router;