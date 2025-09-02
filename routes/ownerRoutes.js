// routes/ownerRoutes.js
const express = require('express');
const router = express.Router();
const {
  scanFingerprint,
  scanRfid,
  sendOtp,
  verifyOtp,
  getExpiryReport,
  getProductReport
} = require('../controllers/ownerController');

const { authOwner } = require('../middlewares/auth');

// Public auth flow
router.post('/auth/fingerprint', scanFingerprint);
router.post('/auth/rfid', scanRfid);
router.post('/auth/otp/send', sendOtp);
router.post('/auth/otp/verify', verifyOtp);

// Protected placeholders
router.get('/reports/expiry/:days', authOwner, getExpiryReport);
router.get('/reports/product/:itemCode', authOwner, getProductReport);

module.exports = router;
