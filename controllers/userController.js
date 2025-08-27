// controllers/userController.js
const User = require('../models/User');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// ✅ Expose users array only if you still need it somewhere else (removed now)
// module.exports._users = [...]  // <-- not needed once DB is live

// GET /api/users/:rfid  — RFID scan + welcome
exports.getUser = catchAsyncErrors(async (req, res) => {
  const { rfid } = req.params;
  const user = await User.findOne({ rfid }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ rfid: user.rfid, name: user.name });
});

// GET /api/users/:rfid/balance
exports.getBalance = catchAsyncErrors(async (req, res) => {
  const { rfid } = req.params;
  const user = await User.findOne({ rfid }, { name: 1, balance: 1 }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ name: user.name, balance: user.balance });
});

// GET /api/users/:rfid/prescriptions
exports.getPrescriptions = catchAsyncErrors(async (req, res) => {
  const { rfid } = req.params;
  const user = await User.findOne({ rfid }, { name: 1, prescriptions: 1 }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ name: user.name, prescriptions: user.prescriptions || [] });
});

// GET /api/relationships/:rfid/:relation
exports.getPrescriptionsByRelation = catchAsyncErrors(async (req, res) => {
  const { rfid, relation } = req.params;
  const user = await User.findOne({ rfid }, { name: 1, prescriptions: 1 }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  const filtered = (user.prescriptions || []).filter(p => p.for === relation);
  res.json({ name: user.name, prescriptions: filtered });
});
