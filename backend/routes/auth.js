const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth');

/**
 * Authentication routes
 */

// Register new user
router.post('/register', register);

// Login user  
router.post('/login', login);

// Logout user (simple response - JWT tokens are stateless)
router.post('/logout', logout);

module.exports = router;
