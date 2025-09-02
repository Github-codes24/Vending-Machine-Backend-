// routes/billRoutes.js
const express = require('express');
const router = express.Router();
const { getBill, getUserBills } = require('../controllers/billsController');

// GET bill by id or billNumber
router.get('/:id', getBill);

// GET bills by user rfid
router.get('/user/:rfid', getUserBills);

module.exports = router;
