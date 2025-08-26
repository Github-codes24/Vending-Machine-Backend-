// models/Owner.js
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rfid: { type: String, required: true, unique: true },          // owner’s RFID card
    fingerprintId: { type: String, required: true, unique: true }, // fingerprint template/id
    phone: { type: String, required: true },                        // e.g., +91XXXXXXXX20
    role: { type: String, enum: ['owner'], default: 'owner' },
    // OTP handling (simple for now)
    otpCode: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Owner', ownerSchema);
