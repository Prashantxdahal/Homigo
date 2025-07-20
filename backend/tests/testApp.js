const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('../routes/auth');
const usersRoutes = require('../routes/users');
const apiRoutes = require('../routes/api');

// Import middleware
const { errorHandler } = require('../middleware/errorHandler');

function createTestApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve static files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api', apiRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

module.exports = createTestApp;
