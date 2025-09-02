// controllers/inventoryController.js
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Inventory = require('../models/Inventory');

exports.getOverview = catchAsyncErrors(async (req, res) => {
  const items = await Inventory.find().lean();

  const overview = items.map(i => {
    const balanceRefill = Math.max((i.totalCapacity || 0) - (i.totalInventory || 0), 0);
    const lastRefill = (i.refillLogs || []).slice(-1)[0] || null;
    return {
      itemCode: i.itemCode,
      name: i.name,
      genericName: i.genericName || '',
      brandName: i.brandName || '',
      mfgBy: i.mfgBy || '',
      marketedBy: i.marketedBy || '',
      typeOfMedicine: i.typeOfMedicine || '',
      day: new Date().toLocaleString('en-IN', { weekday: 'long' }),
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      totalInventory: i.totalInventory || 0,
      totalCapacity: i.totalCapacity || 0,
      balanceRefill,
      expiryDate: i.expiryDate || null,
    };
  });

  res.json({ items: overview });
});

// addInventory (owner-only)
exports.addInventory = catchAsyncErrors(async (req, res) => {
  const { itemCode, name, batchNo, quantity, typeOfMedicine, expiryDate } = req.body;
  const ownerId = req.user && req.user.id;

  let item = await Inventory.findOne({ itemCode });
  if (!item) {
    item = new Inventory({
      itemCode,
      name,
      typeOfMedicine,
      totalCapacity: 100,
      totalInventory: 0,
      refillLogs: []
    });
  }

  item.totalInventory += Number(quantity || 0);
  if (expiryDate) item.expiryDate = new Date(expiryDate);
  item.refillLogs = item.refillLogs || [];
  item.refillLogs.push({
    batchNo,
    quantity: Number(quantity || 0),
    addedBy: ownerId,
    date: new Date()
  });

  await item.save();

  res.json({ success: true, message: 'Inventory updated', item });
});
