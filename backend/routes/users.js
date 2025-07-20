const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

/**
 * User routes
 * Base path: /api/users
 */

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', getAllUsers);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // req.user is already the full user object from auth middleware
    res.status(200).json({
      success: true,
      data: { user: req.user },
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, bio, profile_picture } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.getUserByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken by another user'
      });
    }

    // Update user profile
    const updatedUser = await User.updateUserProfile(userId, { name, email, bio, profile_picture });
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user: updatedUser },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Get user with password
    const userWithPassword = await User.getUserByIdWithPassword(userId);
    if (!userWithPassword) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await User.verifyPassword(currentPassword, userWithPassword.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    const success = await User.updatePassword(userId, newPassword);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update password'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', getUserById);

// @route   POST /api/users
// @desc    Create new user
// @access  Public
router.post('/', createUser);

// @route   PUT /api/users/:id
// @desc    Update user by ID
// @access  Public
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
// @access  Public
router.delete('/:id', deleteUser);

module.exports = router;
