/**
 * Users API routes for Homigo app
 * Handles user creation and management
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../../config/db');
const { authenticateToken } = require('../../middleware/auth');
const validator = require('validator');

const router = express.Router();

/**
 * POST /api/users - Create a new user
 */
router.post('/', async (req, res) => {
  const { name, email, password, role = 'guest' } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!['host', 'guest'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "host" or "guest"'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.toLowerCase(), password_hash, role]
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        }
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/users/:id - Get user by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, bio, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * PUT /api/users/:id - Update user profile
 */
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, bio } = req.body;

  try {
    // Check if user exists and user is updating their own profile
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    // Validation
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email.toLowerCase(), id]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    // Update user
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           bio = COALESCE($3, bio),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, name, email, role, bio, created_at, updated_at`,
      [name?.trim(), email?.toLowerCase(), bio?.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/users - Get all users (admin only or for development)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, role, created_at FROM users';
    let queryParams = [];

    if (role && ['host', 'guest'].includes(role)) {
      query += ' WHERE role = $1';
      queryParams.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users';
    let countParams = [];

    if (role && ['host', 'guest'].includes(role)) {
      countQuery += ' WHERE role = $1';
      countParams.push(role);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
