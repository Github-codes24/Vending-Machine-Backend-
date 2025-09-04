const express = require('express');
const router = express.Router();
const { getLastOtp } = require('../utils/otpService');

// Debug endpoint (TEMPORARY) - fetch last OTP by phone
router.get('/last-otp/:phone', (req, res) => {
  const { phone } = req.params;
  const otp = getLastOtp(phone);
  if (!otp) {
    return res.status(404).json({ message: 'No OTP found for this phone' });
  }
  res.json({ otp });
});

module.exports = router;
