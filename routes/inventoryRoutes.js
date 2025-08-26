// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { getOverview, addInventory } = require('../controllers/inventoryController');

router.get('/overview', getOverview);
router.post('/add', addInventory);

module.exports = router;
