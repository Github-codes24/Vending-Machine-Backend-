// Mock Users (no DB today)
const users = [
  {
    rfid: 'RFID1001',
    name: 'Gourab',
    balance: 15000,
    prescriptions: [
      {
        id: '#0000125',
        medicines: [{ name: 'Paracetamol', quantity: 90, cost: 80 }]
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
        medicines: [{ name: 'Vitamin C', quantity: 30, cost: 250 }]
      }
    ]
  }
];

// ✅ API: Check Balance
exports.getBalance = (req, res) => {
  const { rfid } = req.params;
  const user = users.find(u => u.rfid === rfid);

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ name: user.name, balance: user.balance });
};

// ✅ API: Get Prescriptions
exports.getPrescriptions = (req, res) => {
  const { rfid } = req.params;
  const user = users.find(u => u.rfid === rfid);

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ name: user.name, prescriptions: user.prescriptions });
};
