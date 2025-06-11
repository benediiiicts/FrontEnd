const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/kota', dataController.getAllKota);
router.get('/hobi', dataController.getAllHobi);
router.get('/agama', dataController.getAllAgama);
router.get('/kepribadian', dataController.getAllKepribadian);
router.post('/users', dataController.getAllUsers);
module.exports = router;