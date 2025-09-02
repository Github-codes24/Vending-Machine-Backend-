// routes/userRoutes.js
const express = require('express');
const { getUser, getBalance, getPrescriptions } = require('../controllers/userController');

const router = express.Router();

// Public → scan RFID
router.get('/:rfid', getUser);

// RFID only, No JWT
router.get('/:rfid/balance', getBalance);
router.get('/:rfid/prescriptions', getPrescriptions);

module.exports = router;
