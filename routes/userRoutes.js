const express = require('express');
const { getUser, getBalance, getPrescriptions } = require('../controllers/userController');
const router = express.Router();

router.get('/:rfid', getUser);
router.get('/:rfid/balance', getBalance);
router.get('/:rfid/prescriptions', getPrescriptions);

module.exports = router;
