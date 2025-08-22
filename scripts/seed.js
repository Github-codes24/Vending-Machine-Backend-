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
