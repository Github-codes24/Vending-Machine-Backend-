// controllers/ownerController.js
const Owner = require('../models/Owner');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const jwt = require('jsonwebtoken');
const { generateOtp, sendOtp } = require('../utils/otpService');

// POST /api/owners/auth/fingerprint
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
exports.scanRfid = catchAsyncErrors(async (req, res) => {
  const { ownerId, rfid } = req.body;
  if (!ownerId || !rfid) return res.status(400).json({ message: 'ownerId and rfid required' });

  const owner = await Owner.findById(ownerId);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  if (owner.rfid !== rfid) return res.status(400).json({ message: 'RFID mismatch' });

  res.json({
    success: true,
    step: 'rfid_ok',
    ownerId: owner._id,
    message: 'RFID validated. Please verify OTP.'
  });
});

// POST /api/owners/auth/otp/send
exports.sendOtp = catchAsyncErrors(async (req, res) => {
  const { ownerId } = req.body;
  if (!ownerId) return res.status(400).json({ message: 'ownerId required' });

  const owner = await Owner.findById(ownerId);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  const otp = generateOtp(); // 4-digit
  owner.otpCode = otp;
  owner.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await owner.save();

  // Send OTP: mocked
  await sendOtp(owner.phone || owner.email || 'mock@local', otp);

  // Msked (last 4)
  const mask = (owner.phone && owner.phone.length >= 4) ? ('xxxxxx' + owner.phone.slice(-4)) : ('xxxxxx' + otp);

  res.json({
    success: true,
    step: 'otp_sent',
    ownerId: owner._id,
    mask,
    expiresInSeconds: 300,
    message: 'OTP sent'
  });
});

// POST /api/owners/auth/otp/verify
exports.verifyOtp = catchAsyncErrors(async (req, res) => {
  const { ownerId, otp } = req.body;
  if (!ownerId || !otp) return res.status(400).json({ message: 'ownerId and otp required' });

  const owner = await Owner.findById(ownerId);
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  if (!owner.otpCode || !owner.otpExpires || owner.otpExpires < new Date()) {
    return res.status(400).json({ message: 'OTP expired. Please resend.' });
  }

  if (owner.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  owner.otpCode = null;
  owner.otpExpires = null;
  await owner.save();

  const token = jwt.sign(
    { id: owner._id, type: 'owner', name: owner.name },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    success: true,
    step: 'otp_ok',
    owner: { id: owner._id, name: owner.name, role: owner.role },
    message: `Welcome ${owner.name}`,
    token
  });
});

// placeholders for not-yet-implemented owner-only endpoints
exports.getExpiryReport = (req, res) => res.status(501).json({ message: 'Not implemented yet' });
exports.getProductReport = (req, res) => res.status(501).json({ message: 'Not implemented yet' });
