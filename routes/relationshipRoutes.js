const express = require('express');
const { getPrescriptionsByRelation } = require('../controllers/userController');
const router = express.Router();

router.get('/:rfid/:relation', getPrescriptionsByRelation);

module.exports = router;
