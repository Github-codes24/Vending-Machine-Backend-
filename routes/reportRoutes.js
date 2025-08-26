// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/reportController');

router.post('/sales', getSalesReport);
// (Future) router.get('/expiry', ...);

module.exports = router;
