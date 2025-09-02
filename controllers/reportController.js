// controllers/reportController.js
const Inventory = require('../models/Inventory');
const DispenseLog = require('../models/DispenseLog');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

function ddmmyyyy(date) {
  return new Date(date).toLocaleDateString('en-GB');
}

// Generate sales/stock report
const getSalesReport = catchAsyncErrors(async (req, res) => {
  const { from, to } = req.body || {};
  if (!from || !to) {
    return res.status(400).json({ message: 'from and to are required (YYYY-MM-DD)' });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const items = await Inventory.find().lean();

  const rows = await Promise.all(
    items.map(async (i) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const salesLogs = await DispenseLog.aggregate([
        { $match: { itemCode: i.itemCode, dispensedAt: { $gte: sevenDaysAgo, $lte: new Date() } } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);

      const last7DaySell = salesLogs.length > 0 ? salesLogs[0].total : 0;

      return {
        itemName: i.name,
        itemCode: i.itemCode,
        sellCapacity: i.totalCapacity || 0,
        currentInventory: i.totalInventory || 0,
        emptyCell: Math.max((i.totalCapacity || 0) - (i.totalInventory || 0), 0),
        last7DaySell
      };
    })
  );

  res.json({
    reportNumber: `report_${Date.now()}`,
    reportDate: { from: ddmmyyyy(fromDate), to: ddmmyyyy(toDate) },
    title: 'Stock Report',
    columns: ['item name','item code','sell capacity','current inventory','empty cell','last 7 day sell'],
    rows
  });
});

module.exports = { getSalesReport };
