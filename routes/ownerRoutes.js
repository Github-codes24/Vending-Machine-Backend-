// routes/ownerRoutes.js
const express = require('express');
const router = express.Router();
const {
  scanFingerprint,
  scanRFID,
  sendOtp,
  verifyOtp
} = require('../controllers/ownerController');

router.post('/auth/fingerprint', scanFingerprint);
router.post('/auth/rfid', scanRFID);
router.post('/auth/otp/send', sendOtp);
router.post('/auth/otp/verify', verifyOtp);

module.exports = router;
