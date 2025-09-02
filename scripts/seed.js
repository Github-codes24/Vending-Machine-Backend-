// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');

const Owner = require('../models/Owner');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Bill = require('../models/Bill');
const DispenseLog = require('../models/DispenseLog');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear old data
    await Owner.deleteMany();
    await User.deleteMany();
    await Inventory.deleteMany();
    await Bill.deleteMany();
    await DispenseLog.deleteMany();
    console.log('Old data cleared');

    // Owner
    const owner = await Owner.create({
      name: 'Main Owner',
      phone: '8888888888',
      rfid: 'OWNER123RFID',
      fingerprintId: 'OWNER_FP_001',
      serviceKey: 'SERVICE_KEY_ABC123',
      role: 'owner'
    });
    console.log('👤 Owner seeded:', owner.name);

    // User
    const user1 = await User.create({
      rfid: 'RFID123456',
      name: 'Aniket',
      balance: 1000,
      age: 28,
      phone: '9999999999',
      email: 'aniket@example.com',
      gender: 'Male',
      address: 'Pune, India',
      prescriptions: [
        {
          id: '#0000125',
          for: 'self',
          medicines: [
            { name: 'Paracetamol', quantity: 2, cost: 10 },
            { name: 'Cough Syrup', quantity: 1, cost: 50 }
          ],
          collected: false
        },
        {
          id: '#0000126',
          for: 'other',
          medicines: [
            { name: 'Antibiotic', quantity: 1, cost: 100 }
          ],
          collected: true,
          collectedAt: new Date()
        }
      ]
    });
    console.log('👤 User seeded:', user1.name);

    // Inventory
    const inv1 = await Inventory.create({
      itemCode: 'INV1001',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      brandName: 'Cipla',
      mfgBy: 'Cipla Ltd',
      marketedBy: 'Cipla Healthcare',
      typeOfMedicine: 'tablet',
      totalInventory: 85,
      totalCapacity: 100,
      expiryDate: new Date('2026-08-31')
    });

    const inv2 = await Inventory.create({
      itemCode: 'INV1002',
      name: 'Cough Syrup',
      genericName: 'Dextromethorphan + CPM',
      brandName: 'Benadryl',
      mfgBy: 'Johnson & Johnson',
      marketedBy: 'J&J',
      typeOfMedicine: 'bottle',
      totalInventory: 50,
      totalCapacity: 100,
      expiryDate: new Date('2026-09-30')
    });

    const inv3 = await Inventory.create({
      itemCode: 'INV1003',
      name: 'Antibiotic',
      genericName: 'Amoxicillin',
      brandName: 'Mox',
      mfgBy: 'Ranbaxy',
      marketedBy: 'Sun Pharma',
      typeOfMedicine: 'strips',
      totalInventory: 30,
      totalCapacity: 100,
      expiryDate: new Date('2026-10-15')
    });
    console.log('Inventory seeded:', [inv1.name, inv2.name, inv3.name]);


    // Sample Bill (for collected prescription)
    const sampleBill = await Bill.create({
      billNumber: `BILL-${Date.now()}`,
      billingDate: new Date(),
      userId: user1._id,
      prescriptionId: '#0000126',
      relation: 'self',
      patient: {
        name: user1.name,
        age: user1.age,
        phone: user1.phone,
        email: user1.email,
        gender: user1.gender,
        address: user1.address
      },
      medicines: [
        { name: 'Antibiotic', quantity: 1, costPerUnit: 100, lineTotal: 100 }
      ],
      total: 100
    });
    console.log('🧾 Sample Bill seeded:', sampleBill.billNumber);

    // DispenseLog linked to bill
    const sampleLog = await DispenseLog.create({
      itemCode: inv3.itemCode,
      itemName: inv3.name,
      quantity: 1,
      costPerUnit: 100,
      lineTotal: 100,
      totalCost: 100,
      billNumber: sampleBill.billNumber,
      userId: user1._id,
      ownerId: owner._id,
      prescriptionId: '#0000126',
      dispensedAt: new Date()
    });
    console.log('Sample DispenseLog seeded:', sampleLog.itemName);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
