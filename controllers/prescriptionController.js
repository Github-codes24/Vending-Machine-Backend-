// controllers/prescriptionController.js
const User = require('../models/User');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// GET /api/prescriptions/:id/details
exports.getPrescriptionDetails = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne(
    { 'prescriptions.id': id },
    { rfid: 1, name: 1, prescriptions: 1 }
  ).lean();

  if (!user) return res.status(404).json({ message: 'Prescription not found' });

  const prescription = user.prescriptions.find(p => p.id === id);
  res.json({
    user: { rfid: user.rfid, name: user.name },
    prescription
  });
});

// POST /api/prescriptions/:id/collect
exports.collectPrescription = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  // Fetch user with the prescription
  const user = await User.findOne({ 'prescriptions.id': id });
  if (!user) return res.status(404).json({ message: 'Prescription not found' });

  const p = user.prescriptions.find(x => x.id === id);
  if (!p) return res.status(404).json({ message: 'Prescription not found' });
  if (p.collected) return res.status(400).json({ message: 'Already collected' });

  // Compute total cost
  const totalCost = (p.medicines || []).reduce((s, m) => s + (m.cost || 0), 0);
  if (user.balance < totalCost) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  // Update in-memory doc
  user.balance -= totalCost;
  p.collected = true;
  p.collectedAt = new Date();

  await user.save();

  res.json({
    success: true,
    message: 'Prescription collected successfully',
    updatedBalance: user.balance,
    prescription: p
  });
});
