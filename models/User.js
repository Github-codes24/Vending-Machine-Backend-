const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  medicines: [{ name: String, quantity: Number, cost: Number }],
  status: { type: String, enum: ['pending', 'collected'], default: 'pending' }
});

const userSchema = new mongoose.Schema({
  rfid: { type: String, required: true, unique: true }, // RFID card ID
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  prescriptions: [prescriptionSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
