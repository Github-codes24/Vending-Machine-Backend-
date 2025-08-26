// models/InventoryItem.js
const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // e.g., Paracetamol
    genericName: { type: String, default: '' },
    brandName: { type: String, default: '' },
    mfgBy: { type: String, default: '' },
    marketedBy: { type: String, default: '' },
    day: { type: String, default: '' },              // e.g., 'Tuesday'
    itemCode: { type: String, required: true, unique: true },
    typeOfMedicine: { type: String, enum: ['bottle','box','stripes','pack','other'], default: 'box' },
    totalCapacity: { type: Number, default: 100 },
    totalInventory: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
