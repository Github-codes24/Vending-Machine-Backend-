const express = require("express");
const { collectPrescription } = require("../controllers/prescriptionController");
const router = express.Router();

router.post("/:rfid/:id/collect", collectPrescription);

module.exports = router;
