const crypto = require('crypto');

let otpStore = {}; // temporary in-memory { phone: otp }

// mock send
exports.sendOtp = async (recipient, otp) => {
  if (!process.env.OTP_PROVIDER_API_KEY) {
    otpStore[recipient] = otp; // store latest OTP for recipient
    console.log(`[Mock OTP] Sending OTP ${otp} to ${recipient}`);
    return true;
  }

  // TODO: integrate real SMS provider
  console.log(`OTP sent via provider to ${recipient}`);
  return true;
};

// Generate secure 4-digit OTP
exports.generateOtp = () => {
  return '' + Math.floor(1000 + Math.random() * 9000);
};

// Get last OTP for recipient (debug only)
exports.getLastOtp = (recipient) => otpStore[recipient] || null;
