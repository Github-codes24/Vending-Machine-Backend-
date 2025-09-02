// controllers/billsController.js
const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const User = require('../models/User');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// GET /api/bills/:id  -> billNumber (BILL-)
exports.getBill = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  let bill;
  if (mongoose.Types.ObjectId.isValid(id)) {
    bill = await Bill.findById(id).lean();
  }
  if (!bill) {
    // fallback to billNumber
    bill = await Bill.findOne({ billNumber: id }).lean();
  }

  if (!bill) return res.status(404).json({ message: 'Bill not found' });

  res.json({
    billNumber: bill.billNumber,
    billingDate: bill.billingDate,
    patient: bill.patient,
    medicines: bill.medicines,
    total: bill.total,
    relation: bill.relation
  });
});

// GET /api/bills/user/:rfid  -> find user by rfid, return bills
exports.getUserBills = catchAsyncErrors(async (req, res) => {
  const { rfid } = req.params;
  const user = await User.findOne({ rfid });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const bills = await Bill.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
  res.json({ bills });
});
