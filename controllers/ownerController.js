// controllers/ownerController.js
const Owner = require('../models/Owner');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// POST /api/owners/auth/fingerprint
// body: { fingerprintId }
exports.scanFingerprint = catchAsyncErrors(async (req, res) => {
  const { fingerprintId } = req.body;
  if (!fingerprintId) return res.status(400).json({ message: 'fingerprintId required' });

  const owner = await Owner.findOne({ fingerprintId });
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  res.json({
    success: true,
    step: 'fingerprint_ok',
    ownerId: owner._id,
    message: 'Fingerprint validated. Please scan RFID card.'
  });
});

// POST /api/owners/auth/rfid
// body: { ownerId, rfid }
exports.scanRFID = catchAsyncErrors(async (req, res) => {
  const { ownerId, rfid } = req.body;
  if (!ownerId || !rfid) return res.status(400).json({ message: 'ownerId and rfid required' });

  const owner = await Owner.findById(ownerId);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  if (owner.rfid !== rfid) {
    return res.status(400).json({ message: 'RFID mismatch' });
  }

  res.json({
    success: true,
    step: 'rfid_ok',
    ownerId: owner._id,
    message: 'RFID validated. Please verify OTP.'
  });
});

// POST /api/owners/auth/otp/send
// body: { ownerId }
exports.sendOtp = catchAsyncErrors(async (req, res) => {
  const { ownerId } = req.body;
  if (!ownerId) return res.status(400).json({ message: 'ownerId required' });

  const owner = await Owner.findById(ownerId);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  // Per your spec: OTP should be 4 digits and masked as xxxxxx0120
  // We’ll set it to "0120" for demo/testing and expire in 5 minutes
  owner.otpCode = '0120';
  owner.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await owner.save();

  // front-end can show: "OTP sent to xxxxxx0120"
  res.json({
    success: true,
    step: 'otp_sent',
    ownerId: owner._id,
    mask: 'xxxxxx0120',
    expiresInSeconds: 300,
    message: 'OTP sent'
  });
});

// POST /api/owners/auth/otp/verify
// body: { ownerId, otp }
exports.verifyOtp = catchAsyncErrors(async (req, res) => {
  const { ownerId, otp } = req.body;
  if (!ownerId || !otp) return res.status(400).json({ message: 'ownerId and otp required' });

  const owner = await Owner.findById(ownerId);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  if (!owner.otpCode || !owner.otpExpires || owner.otpExpires < new Date()) {
    return res.status(400).json({ message: 'OTP expired. Please resend.' });
  }

  if (owner.otpCode !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // success -> clear OTP
  owner.otpCode = null;
  owner.otpExpires = null;
  await owner.save();

  res.json({
    success: true,
    step: 'otp_ok',
    owner: { id: owner._id, name: owner.name, role: owner.role },
    message: `Welcome ${owner.name}`
  });
});
