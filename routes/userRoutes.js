const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// RFID Scan + Welcome
router.get("/:rfid", userController.getUser);

// Balance
router.get("/:rfid/balance", userController.getBalance);

// All prescriptions
router.get("/:rfid/prescriptions", userController.getPrescriptions);

// Prescriptions by relation
router.get("/:rfid/prescriptions/:relation", userController.getPrescriptionsByRelation);

// Collect prescription (by RFID + prescription ID)
router.post("/:rfid/prescriptions/:id/collect", userController.collectPrescription);

module.exports = router;
