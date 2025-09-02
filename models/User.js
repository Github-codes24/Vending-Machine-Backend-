const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const prescriptionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g. '#0000125'
  for: { type: String, default: 'self' }, // relation
  medicines: [{ name: String, quantity: Number, cost: Number }],
  collected: { type: Boolean, default: false },
  collectedAt: { type: Date }
}, { _id: false });

const userSchema = new mongoose.Schema({
  rfid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  age: Number,
  phone: String,
  dob: String,
  email: String,
  gender: String,
  address: String,
  prescriptions: [prescriptionSchema]
}, { timestamps: true });

// JWT helper
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, rfid: this.rfid, type: 'user', name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};


module.exports = mongoose.model('User', userSchema);
