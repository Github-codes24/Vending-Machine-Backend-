// models/Bill.js
const mongoose = require('mongoose');

const billMedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0, required: true },
  costPerUnit: { type: Number, default: 0, required: true },
  lineTotal: { type: Number, default: 0, required: true }
}, { _id: false });

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  billingDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prescriptionId: { type: String },
  patient: {
    name: String,
    age: Number,
    phone: String,
    dob: String,
    email: String,
    gender: String,
    address: String
  },
  medicines: [billMedicineSchema],
  total: { type: Number, default: 0, required: true },
  paymentMethod: { type: String, default: 'account' },
  relation: {
    type: String,
    enum: ['self', 'wife', 'son', 'daughter', 'other'],
    default: 'self'
  }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
