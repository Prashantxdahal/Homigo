/**
 * Main API routes file for Homigo app
 * Combines all API routes with proper error handling
 */

const express = require('express');

// Import route modules
const usersRoutes = require('./users');
const listingsRoutes = require('./listings');
const bookingsRoutes = require('./bookings');
const uploadRoutes = require('./upload');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Homigo API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount route modules
router.use('/users', usersRoutes);
router.use('/listings', listingsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/upload', uploadRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

module.exports = router;
