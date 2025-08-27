const express = require('express');
const { 
  getUser, 
  getBalance, 
  getPrescriptions, 
  getPrescriptionsByRelation 
} = require('../controllers/userController');

const router = express.Router();

router.get('/:rfid', getUser);
router.get('/:rfid/balance', getBalance);
router.get('/:rfid/prescriptions', getPrescriptions);
router.get('/:rfid/prescriptions/:relation', getPrescriptionsByRelation);

module.exports = router;
