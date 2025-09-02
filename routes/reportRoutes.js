// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/reportController');
const { authOwner } = require('../middlewares/auth');

// Generate sales/stock report
router.post('/sales', authOwner, getSalesReport);

module.exports = router;
