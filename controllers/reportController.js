// controllers/reportController.js
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

function ddmmyyyy(date) {
  return new Date(date).toLocaleDateString('en-GB');
}

// POST /api/reports/sales
// body: { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
exports.getSalesReport = catchAsyncErrors(async (req, res) => {
  const { from, to } = req.body || {};
  if (!from || !to) return res.status(400).json({ message: 'from and to are required (YYYY-MM-DD)' });

  // Using your provided sample rows so UI can integrate now
  const rows = [
    { itemName: 'paracetamol', itemCode: '1008765', sellCapacity: 300, currentInventory: 90, emptyCell: 160, last7DaySell: 250 },
    { itemName: 'syringe', itemCode: '1008765', sellCapacity: 100, currentInventory: 30, emptyCell: 70, last7DaySell: 100 },
    { itemName: 'intra vein', itemCode: '1008785', sellCapacity: 50, currentInventory: 4, emptyCell: 41, last7DaySell: 45 },
    { itemName: 'cough syrup', itemCode: '1008762', sellCapacity: 150, currentInventory: 15, emptyCell: 85, last7DaySell: 100 },
    { itemName: 'Anti biotic', itemCode: '1008761', sellCapacity: 150, currentInventory: 60, emptyCell: 90, last7DaySell: 150 },
    { itemName: 'Bandage', itemCode: '1008795', sellCapacity: 50, currentInventory: 6, emptyCell: 34, last7DaySell: 40 },
    { itemName: 'Oinments', itemCode: '1008725', sellCapacity: 20, currentInventory: 1, emptyCell: 14, last7DaySell: 15 },
    { itemName: 'Disprin', itemCode: '1008742', sellCapacity: 100, currentInventory: 60, emptyCell: 30, last7DaySell: 90 },
    { itemName: 'Needles', itemCode: '1008795', sellCapacity: 150, currentInventory: 60, emptyCell: 40, last7DaySell: 100 },
  ];

  res.json({
    reportNumber: `report_${new Date().getTime()}`,
    reportDate: {
      from: ddmmyyyy(from),
      to: ddmmyyyy(to)
    },
    title: 'Stock Report',
    columns: ['item name', 'item code', 'sell capacity', 'current inventory', 'empty cell', 'last 7 day sell'],
    rows
  });
});
