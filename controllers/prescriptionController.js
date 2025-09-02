// controllers/prescriptionController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const DispenseLog = require('../models/DispenseLog');
const Bill = require('../models/Bill');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const formatMoney = (n) => Number(n || 0).toFixed(2);
const now = () => new Date();

const ALLOWED_RELATIONS = new Set(['self','wife','daughter','son','other']);
function normalizeRelation(r) {
  if (!r) return 'self';
  return ALLOWED_RELATIONS.has(r) ? r : 'other';
}

function generateBillNumber() {
  return `BILL-${Date.now()}`;
}

// GET prescription details by ID
exports.getPrescriptionDetails = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne(
    { 'prescriptions.id': id },
    { prescriptions: 1, name: 1, rfid: 1 }
  ).lean();

  if (!user) return res.status(404).json({ message: 'Prescription not found' });

  const presc = (user.prescriptions || []).find((p) => p.id === id);
  if (!presc) return res.status(404).json({ message: 'Prescription not found' });

  // normalize relation
  presc.for = normalizeRelation(presc.for);

  return res.json({
    user: { rfid: user.rfid, name: user.name },
    prescription: presc,
  });
});

// POST collect prescription (body: { rfid, relation })
exports.collectPrescription = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { rfid, relation } = req.body;

  if (!rfid) {
    return res.status(400).json({ message: 'RFID is required to collect prescription' });
  }

  const session = await mongoose.startSession();
  try {
    let bill;
    await session.withTransaction(async () => {
      const user = await User.findOne({ rfid }).session(session);
      if (!user) throw { statusCode: 404, message: 'User not found' };

      const presIndex = (user.prescriptions || []).findIndex((p) => p.id === id);
      if (presIndex === -1) throw { statusCode: 404, message: 'Prescription not found' };

      const presc = user.prescriptions[presIndex];
      if (presc.collected) throw { statusCode: 400, message: 'Already collected' };

      if (!Array.isArray(presc.medicines) || presc.medicines.length === 0) {
        throw { statusCode: 400, message: 'Prescription has no medicines' };
      }

      // compute total as sum(quantity * cost)
      const total = presc.medicines.reduce((s, m) =>
        s + (Number(m.quantity || 0) * Number(m.cost || 0)), 0);

      if ((user.balance || 0) < total) {
        throw { statusCode: 400, message: 'Insufficient balance' };
      }

      // decrease inventory and log dispense
      for (const med of presc.medicines) {
        const item = await Inventory.findOne({
          name: new RegExp(`^${med.name}$`, 'i'),
        }).session(session);

        if (!item) throw { statusCode: 404, message: `Inventory not found for ${med.name}` };
        if ((item.totalInventory || 0) < (med.quantity || 0)) {
          throw { statusCode: 400, message: `Insufficient stock for ${med.name}` };
        }

        item.totalInventory -= med.quantity || 0;
        await item.save({ session });

        await DispenseLog.create([{
          itemCode: item.itemCode,
          itemName: item.name,
          quantity: med.quantity || 0,
          costPerUnit: med.cost || 0,
          lineTotal: (Number(med.quantity || 0) * Number(med.cost || 0)),
          totalCost: (Number(med.quantity || 0) * Number(med.cost || 0)),
          userId: user._id,
          prescriptionId: id,
          dispensedAt: now(),
        }], { session });
      }

      // deduct balance and mark collected
      user.balance = Number(user.balance || 0) - total;
      user.prescriptions[presIndex].collected = true;
      user.prescriptions[presIndex].collectedAt = now();
      await user.save({ session });

      // create bill
      const billData = {
        billNumber: generateBillNumber(),
        billingDate: now(),
        userId: user._id,
        prescriptionId: id,
        relation: normalizeRelation(relation),
        patient: {
          name: user.name,
          age: user.age || null,
          phone: user.phone || null,
          dob: user.dob || null,
          email: user.email || null,
          gender: user.gender || null,
          address: user.address || null,
        },
        medicines: presc.medicines.map((m) => ({
          name: m.name,
          quantity: m.quantity,
          costPerUnit: Number(m.cost || 0),
          lineTotal: (Number(m.quantity || 0) * Number(m.cost || 0)),
        })),
        total: Number(total),
      };

      bill = await Bill.create([billData], { session });
      bill = bill[0];
    });

    // get fresh balance
    const freshUser = await User.findOne({ rfid });
    return res.json({
      success: true,
      message: 'Prescription collected and dispensed',
      bill: {
        billNumber: bill.billNumber,
        billingDate: bill.billingDate,
        patient: bill.patient,
        medicines: bill.medicines,
        total: formatMoney(bill.total),
        availableBalance: formatMoney(freshUser.balance),
      }
    });
  } catch (err) {
    // return structured error
    if (err && err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('collectPrescription ERROR:', err);
    return res.status(500).json({ message: 'Server error while collecting prescription' });
  } finally {
    session.endSession();
  }
});
