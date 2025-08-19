// controllers/userController.js

// Mock Users (skip DB for now)
const users = [
  {
    rfid: "RFID1001",
    name: "Gourab",
    balance: 15000,
    prescriptions: [
      {
        id: "#0000125",
        for: "self",
        medicines: [{ name: "Paracetamol", quantity: 90, cost: 80 }],
        collected: false
      },
      {
        id: "#0000457",
        for: "wife",
        medicines: [{ name: "Amoxicillin", quantity: 20, cost: 120 }],
        collected: false
      }
    ]
  },
  {
    rfid: "RFID1002",
    name: "Aarti",
    balance: 8000,
    prescriptions: [
      {
        id: "#0000456",
        for: "self",
        medicines: [{ name: "Vitamin C", quantity: 30, cost: 250 }],
        collected: false
      }
    ]
  }
];

// ✅ RFID Scan + Welcome
exports.getUser = (req, res) => {
  const { rfid } = req.params;
  const user = users.find(u => u.rfid === rfid);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ rfid: user.rfid, name: user.name });
};

// ✅ Balance
exports.getBalance = (req, res) => {
  const { rfid } = req.params;
  const user = users.find(u => u.rfid === rfid);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ name: user.name, balance: user.balance });
};

// ✅ All Prescriptions
exports.getPrescriptions = (req, res) => {
  const { rfid } = req.params;
  const user = users.find(u => u.rfid === rfid);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ name: user.name, prescriptions: user.prescriptions });
};

// ✅ Prescriptions by Relation
exports.getPrescriptionsByRelation = (req, res) => {
  const { rfid, relation } = req.params;
  const user = users.find(u => u.rfid === rfid);

  if (!user) return res.status(404).json({ message: "User not found" });

  const filtered = user.prescriptions.filter(p => p.for === relation);

  res.json({ name: user.name, prescriptions: filtered });
};

// ✅ Collect Prescription
exports.collectPrescription = (req, res) => {
  const { rfid, id } = req.params;
  const user = users.find(u => u.rfid === rfid);

  if (!user) return res.status(404).json({ message: "User not found" });

  const prescription = user.prescriptions.find(p => p.id === id);
  if (!prescription) return res.status(404).json({ message: "Prescription not found" });

  if (prescription.collected) {
    return res.status(400).json({ message: "Already collected" });
  }

  // Deduct total cost
  const totalCost = prescription.medicines.reduce((sum, m) => sum + (m.cost || 0), 0);
  if (user.balance < totalCost) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  user.balance -= totalCost;
  prescription.collected = true;

  res.json({
    message: "Prescription collected",
    newBalance: user.balance,
    prescription
  });
};

// Helper export so prescriptionController can reuse
exports._users = users;
