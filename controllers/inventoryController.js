// controllers/inventoryController.js
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const InventoryItem = require('../models/InventoryItem');
const InventoryBatch = require('../models/InventoryBatch');

// GET /api/inventory/overview
exports.getOverview = catchAsyncErrors(async (req, res) => {
  const items = await InventoryItem.find().sort({ name: 1 });

  const overview = items.map(i => {
    const balanceRefill = Math.max((i.totalCapacity || 0) - (i.totalInventory || 0), 0);
    return {
      name: i.name,
      genericName: i.genericName,
      brandName: i.brandName,
      mfgBy: i.mfgBy,
      marketedBy: i.marketedBy,
      day: i.day || new Date().toLocaleString('en-IN', { weekday: 'long' }),
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      totalInventory: i.totalInventory,
      totalCapacity: i.totalCapacity,
      balanceRefill,
      itemCode: i.itemCode,
      typeOfMedicine: i.typeOfMedicine
    };
  });

  res.json({ items: overview });
});

// POST /api/inventory/add
// body: { itemCode, name, batchNo, quantity, typeOfMedicine, genericName, brandName, mfgBy, marketedBy, totalCapacity }
exports.addInventory = catchAsyncErrors(async (req, res) => {
  const {
    itemCode, name, batchNo, quantity,
    typeOfMedicine, genericName, brandName, mfgBy, marketedBy,
    totalCapacity
  } = req.body;

  if (!itemCode || !name || !batchNo || !quantity) {
    return res.status(400).json({ message: 'itemCode, name, batchNo, quantity are required' });
  }

  let item = await InventoryItem.findOne({ itemCode });
  if (!item) {
    item = await InventoryItem.create({
      itemCode,
      name,
      typeOfMedicine: (typeOfMedicine || 'box').toLowerCase(),
      genericName: genericName || '',
      brandName: brandName || '',
      mfgBy: mfgBy || '',
      marketedBy: marketedBy || '',
      totalCapacity: totalCapacity || 100,
      totalInventory: 0,
      day: new Date().toLocaleString('en-IN', { weekday: 'long' })
    });
  }

  await InventoryBatch.create({
    item: item._id,
    batchNo,
    quantity: Number(quantity),
  });

  // increase stock
  item.totalInventory = (item.totalInventory || 0) + Number(quantity);
  await item.save();

  res.json({
    success: true,
    message: 'Inventory updated',
    item: {
      name: item.name,
      itemCode: item.itemCode,
      totalInventory: item.totalInventory,
      totalCapacity: item.totalCapacity
    }
  });
});
