// models/Inventory.js
const mongoose = require('mongoose');

const refillLogSchema = new mongoose.Schema({
  batchNo: String,
  quantity: Number,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  date: { type: Date, default: Date.now }
}, { _id: false });

const inventorySchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  genericName: String,
  brandName: String,
  mfgBy: String,
  marketedBy: String,
  typeOfMedicine: String,
  totalCapacity: { type: Number, default: 0 },
  totalInventory: { type: Number, default: 0 },
  expiryDate: Date,
  refillLogs: [refillLogSchema]
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
