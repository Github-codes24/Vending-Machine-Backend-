const express = require("express");
const {
  getPrescriptionDetails,
  collectPrescription
} = require("../controllers/prescriptionController");

const router = express.Router();

// GET prescription details by ID
router.get("/:id/details", getPrescriptionDetails);

// POST collect prescription
router.post("/:id/collect", collectPrescription);

module.exports = router;
