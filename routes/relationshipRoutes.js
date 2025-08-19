// routes/relationshipRoutes.js
const express = require("express");
const { getRelationships } = require("../controllers/relationshipController");

const router = express.Router();

// GET relationships
router.get("/:userId/relationships", getRelationships);

module.exports = router;
