// models/Owner.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  rfid: { type: String, required: true, unique: true },
  fingerprintId: { type: String, required: true, unique: true },
  role: { type: String, default: 'owner' },
  otpCode: String,
  otpExpires: Date,
}, { timestamps: true });

ownerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, type: 'owner', name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

module.exports = mongoose.model('Owner', ownerSchema);
