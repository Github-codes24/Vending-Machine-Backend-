// models/user.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  cost: { type: Number, default: 0 }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  id: { type: String, required: true },            // e.g. '#0000125'
  for: { type: String, enum: ['self','wife','son','daughter','other'], required: true },
  medicines: { type: [medicineSchema], default: [] },
  collected: { type: Boolean, default: false },
  collectedAt: { type: Date }
}, { _id: false });

const userSchema = new mongoose.Schema({
  rfid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  prescriptions: { type: [prescriptionSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
