// routes/prescriptionRoutes.js
const express = require('express');
const { getPrescriptionDetails, collectPrescription } = require('../controllers/prescriptionController');

const router = express.Router();

router.get('/:id', getPrescriptionDetails);
router.post('/:id/collect', collectPrescription);

module.exports = router;
