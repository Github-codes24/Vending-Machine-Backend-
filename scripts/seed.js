// scripts/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});

    await User.create([
      {
        rfid: 'RFID1001',
        name: 'Gourab',
        balance: 15000,
        prescriptions: [
          {
            id: '#0000125',
            for: 'self',
            medicines: [{ name: 'Paracetamol', quantity: 90, cost: 80 }],
            collected: false
          },
          {
            id: '#0000457',
            for: 'wife',
            medicines: [{ name: 'Amoxicillin', quantity: 20, cost: 120 }],
            collected: false
          }
        ]
      },
      {
        rfid: 'RFID1002',
        name: 'Aarti',
        balance: 8000,
        prescriptions: [
          {
            id: '#0000456',
            for: 'self',
            medicines: [{ name: 'Vitamin C', quantity: 30, cost: 250 }],
            collected: false
          }
        ]
      }
    ]);

    console.log('✅ Seed complete');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed error:', e);
    process.exit(1);
  }
};

run();
// scripts/seed.js (append)
const Owner = require('../models/Owner');

async function seedOwners() {
  await Owner.deleteMany({});
  await Owner.create([
    {
      name: 'Admin One',
      rfid: 'OWNER_RFID_1001',
      fingerprintId: 'FP_1001',
      phone: '+91XXXXXX0120',
      role: 'owner'
    }
  ]);
  console.log('✅ Owners seeded');
}

(async () => {
  try {
    // ... your current user seeding
    await seedOwners();
    console.log('✅ Seed complete');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
const InventoryItem = require('../models/InventoryItem');
const InventoryBatch = require('../models/InventoryBatch');

async function seedInventory() {
  await InventoryBatch.deleteMany({});
  await InventoryItem.deleteMany({});

  const items = await InventoryItem.insertMany([
    {
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      brandName: 'Cipla',
      mfgBy: 'Cipla',
      marketedBy: 'Cipla',
      itemCode: '1008765',
      typeOfMedicine: 'box',
      totalCapacity: 100,
      totalInventory: 90,
      day: 'Tuesday'
    },
    { name: 'Syringe', genericName: '', brandName: '', mfgBy: '', marketedBy: '', itemCode: '1008766', typeOfMedicine: 'pack', totalCapacity: 100, totalInventory: 30, day: 'Tuesday' },
    { name: 'Intra vein', itemCode: '1008785', typeOfMedicine: 'pack', totalCapacity: 50, totalInventory: 4, day: 'Tuesday' },
    { name: 'Cough Syrup', itemCode: '1008762', typeOfMedicine: 'bottle', totalCapacity: 150, totalInventory: 15, day: 'Tuesday' },
    { name: 'Anti biotic', itemCode: '1008761', typeOfMedicine: 'box', totalCapacity: 150, totalInventory: 60, day: 'Tuesday' },
    { name: 'Bandage', itemCode: '1008795', typeOfMedicine: 'pack', totalCapacity: 50, totalInventory: 6, day: 'Tuesday' },
    { name: 'Oinments', itemCode: '1008725', typeOfMedicine: 'box', totalCapacity: 20, totalInventory: 1, day: 'Tuesday' },
    { name: 'Disprin', itemCode: '1008742', typeOfMedicine: 'stripes', totalCapacity: 100, totalInventory: 60, day: 'Tuesday' },
    { name: 'Needles', itemCode: '1008796', typeOfMedicine: 'pack', totalCapacity: 150, totalInventory: 60, day: 'Tuesday' },
  ]);

  await InventoryBatch.insertMany([
    { item: items[0]._id, batchNo: 'B5644HGH', quantity: 90 },
  ]);

  console.log('✅ Inventory seeded');
}
