// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { getOverview, addInventory } = require('../controllers/inventoryController');
const { authOwner } = require('../middlewares/auth');

// Inventory overview (owner-only)
router.get('/overview', authOwner, getOverview);

// Add/update inventory (owner-only)
router.post('/add', authOwner, addInventory);

module.exports = router;
