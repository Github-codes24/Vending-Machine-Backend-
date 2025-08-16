const express = require('express');
const router = express.Router();
const { getBalance, getPrescriptions } = require('../controllers/userController');

// GET Balance
router.get('/:rfid/balance', getBalance);

// GET Prescriptions
router.get('/:rfid/prescriptions', getPrescriptions);

module.exports = router;
