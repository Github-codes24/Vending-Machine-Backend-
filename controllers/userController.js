// controllers/userController.js
const User = require('../models/User');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const ALLOWED_RELATIONS = new Set(['self','wife','daughter','son','other']);
const normalizeRelation = (r) => (ALLOWED_RELATIONS.has(r) ? r : 'other');

// RFID scan → fetch user
exports.getUser = catchAsyncErrors(async (req, res) => {
  const { rfid } = req.params;
  const user = await User.findOne({ rfid });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ rfid: user.rfid, name: user.name });
});

// Balance
exports.getBalance = catchAsyncErrors(async (req, res) => {
  const { rfid } = req.params;
  const user = await User.findOne({ rfid });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ balance: user.balance });
});

// Prescriptions list (pending + collected)
exports.getPrescriptions = catchAsyncErrors(async (req, res) => {
  const { rfid } = req.params;
  const user = await User.findOne({ rfid }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  const prescriptions = (user.prescriptions || []).map((p) => ({
    id: p.id,
    for: normalizeRelation(p.for),
    status: p.collected ? 'collected' : 'pending',
    collectedAt: p.collectedAt || null
  }));

  res.json({ prescriptions });
});
