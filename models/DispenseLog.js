// models/DispenseLog.js
const mongoose = require('mongoose');

const dispenseLogSchema = new mongoose.Schema({
  itemCode: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  costPerUnit: { type: Number, required: true },
  totalCost: { type: Number, required: true }, // ✅ aggregate of quantity*costPerUnit
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  prescriptionId: { type: String, required: true },
  dispensedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DispenseLog', dispenseLogSchema);
