// app.js
const express = require('express');
const cors = require('cors');
const ownerRoutes = require('./routes/ownerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const app = express();
const reportRoutes = require('./routes/reportRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/relationships', require('./routes/relationshipRoutes'));
app.use('/api/owners', ownerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);

module.exports = app;
