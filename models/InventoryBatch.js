// models/InventoryBatch.js
const mongoose = require('mongoose');

const inventoryBatchSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    batchNo: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InventoryBatch', inventoryBatchSchema);
