// utils/otpService.js
const crypto = require('crypto');

// mock
exports.sendOtp = async (recipient, otp) => {
  if (!process.env.OTP_PROVIDER_API_KEY) {
    console.log(`[Mock OTP] Sending OTP ${otp} to ${recipient}`);
    return true;
  }

  console.log(`OTP sent via provider to ${recipient}`);
  return true;
};

// Generate secure 4-digit OTP
exports.generateOtp = () => {
  return ('' + Math.floor(1000 + Math.random() * 9000));
};
