// controllers/prescriptionController.js
const { _users } = require("./userController");

// ✅ Get prescription details by ID (search inside users)
exports.getPrescriptionDetails = async (req, res) => {
  const { id } = req.params;

  let foundPrescription = null;
  let userRef = null;

  _users.forEach(u => {
    u.prescriptions.forEach(p => {
      if (p.id === id) {
        foundPrescription = p;
        userRef = u;
      }
    });
  });

  if (!foundPrescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  res.json({
    user: { rfid: userRef.rfid, name: userRef.name },
    prescription: foundPrescription
  });
};

// ✅ Collect prescription (alternate route if frontend uses prescriptionId directly)
exports.collectPrescription = async (req, res) => {
  const { id } = req.params;

  let foundPrescription = null;
  let userRef = null;

  _users.forEach(u => {
    u.prescriptions.forEach(p => {
      if (p.id === id) {
        foundPrescription = p;
        userRef = u;
      }
    });
  });

  if (!foundPrescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }
  if (foundPrescription.collected) {
    return res.status(400).json({ message: "Already collected" });
  }

  const totalCost = foundPrescription.medicines.reduce((sum, m) => sum + (m.cost || 0), 0);
  if (userRef.balance < totalCost) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  userRef.balance -= totalCost;
  foundPrescription.collected = true;

  res.json({
    success: true,
    message: "Prescription collected successfully",
    updatedBalance: userRef.balance,
    prescription: foundPrescription
  });
};
