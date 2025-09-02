// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const ownerRoutes = require('./routes/ownerRoutes');
const userRoutes = require('./routes/userRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const billRoutes = require('./routes/billRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { authLimiter } = require('./middlewares/rateLimiter');

const app = express();

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Apply rate limiter ONLY on sensitive auth endpoints
app.use('/api/owners/auth', authLimiter);
app.use('/api/users/:rfid', authLimiter);  // RFID login only

// Routes
app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);

// Fallbacks & Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
