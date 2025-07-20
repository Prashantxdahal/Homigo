/**
 * Listings API routes for Homigo app
 * Handles property listing creation and management
 */

const express = require('express');
const { pool } = require('../../config/db');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

/**
 * POST /api/listings - Create a new listing
 */
router.post('/', authenticateToken, async (req, res) => {
  const {
    title,
    description,
    location,
    price,
    images = [],
    amenities = []
  } = req.body;

  try {
    // Validation
    if (!title || !description || !location || !price) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, location, and price are required'
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: 'Images must be an array'
      });
    }

    if (!Array.isArray(amenities)) {
      return res.status(400).json({
        success: false,
        message: 'Amenities must be an array'
      });
    }

    // Create listing
    const result = await pool.query(
      `INSERT INTO listings (host_id, title, description, location, price, images, amenities) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, host_id, title, description, location, price, images, amenities, status, created_at`,
      [
        req.user.id,
        title.trim(),
        description.trim(),
        location.trim(),
        parseFloat(price),
        JSON.stringify(images),
        JSON.stringify(amenities)
      ]
    );

    const listing = result.rows[0];

    // Get host information
    const hostResult = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: {
        listing: {
          ...listing,
          host: hostResult.rows[0]
        }
      }
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/listings - Get all active listings
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build query dynamically
    let query = `
      SELECT 
        l.id, l.title, l.description, l.location, l.price, 
        l.images, l.amenities, l.status, l.created_at,
        u.id as host_id, u.name as host_name, u.email as host_email
      FROM listings l
      JOIN users u ON l.host_id = u.id
      WHERE l.status = 'active'
    `;

    let queryParams = [];
    let paramCount = 0;

    // Add filters
    if (location) {
      paramCount++;
      query += ` AND l.location ILIKE $${paramCount}`;
      queryParams.push(`%${location}%`);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND l.price >= $${paramCount}`;
      queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND l.price <= $${paramCount}`;
      queryParams.push(parseFloat(maxPrice));
    }

    // Add sorting
    const validSortFields = ['created_at', 'price', 'title'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    
    query += ` ORDER BY l.${finalSortBy} ${finalSortOrder}`;

    // Add pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    queryParams.push(parseInt(limit));

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM listings l WHERE l.status = \'active\'';
    let countParams = [];
    let countParamCount = 0;

    if (location) {
      countParamCount++;
      countQuery += ` AND l.location ILIKE $${countParamCount}`;
      countParams.push(`%${location}%`);
    }

    if (minPrice) {
      countParamCount++;
      countQuery += ` AND l.price >= $${countParamCount}`;
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countParamCount++;
      countQuery += ` AND l.price <= $${countParamCount}`;
      countParams.push(parseFloat(maxPrice));
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Format listings
    const listings = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      location: row.location,
      price: parseFloat(row.price),
      images: row.images,
      amenities: row.amenities,
      status: row.status,
      created_at: row.created_at,
      host: {
        id: row.host_id,
        name: row.host_name,
        email: row.host_email
      }
    }));

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        filters: {
          location,
          minPrice: minPrice ? parseFloat(minPrice) : null,
          maxPrice: maxPrice ? parseFloat(maxPrice) : null,
          sortBy: finalSortBy,
          sortOrder: finalSortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/listings/:id - Get specific listing by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        l.id, l.title, l.description, l.location, l.price, 
        l.images, l.amenities, l.status, l.created_at, l.updated_at,
        u.id as host_id, u.name as host_name, u.email as host_email, u.bio as host_bio
      FROM listings l
      JOIN users u ON l.host_id = u.id
      WHERE l.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const row = result.rows[0];
    const listing = {
      id: row.id,
      title: row.title,
      description: row.description,
      location: row.location,
      price: parseFloat(row.price),
      images: row.images,
      amenities: row.amenities,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      host: {
        id: row.host_id,
        name: row.host_name,
        email: row.host_email,
        bio: row.host_bio
      }
    };

    res.json({
      success: true,
      data: { listing }
    });

  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * PUT /api/listings/:id - Update listing (host only)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    price,
    images,
    amenities,
    status
  } = req.body;

  try {
    // Check if listing exists and user is the host
    const listingCheck = await pool.query(
      'SELECT host_id FROM listings WHERE id = $1',
      [id]
    );

    if (listingCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listingCheck.rows[0].host_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own listings'
      });
    }

    // Validation
    if (price && price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    if (status && !['active', 'inactive', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Update listing
    const result = await pool.query(
      `UPDATE listings 
       SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         location = COALESCE($3, location),
         price = COALESCE($4, price),
         images = COALESCE($5, images),
         amenities = COALESCE($6, amenities),
         status = COALESCE($7, status),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, host_id, title, description, location, price, images, amenities, status, created_at, updated_at`,
      [
        title?.trim(),
        description?.trim(),
        location?.trim(),
        price ? parseFloat(price) : null,
        images ? JSON.stringify(images) : null,
        amenities ? JSON.stringify(amenities) : null,
        status,
        id
      ]
    );

    const listing = result.rows[0];

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: { listing }
    });

  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * DELETE /api/listings/:id - Delete listing (host only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if listing exists and user is the host
    const listingCheck = await pool.query(
      'SELECT host_id FROM listings WHERE id = $1',
      [id]
    );

    if (listingCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listingCheck.rows[0].host_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own listings'
      });
    }

    // Delete listing
    await pool.query('DELETE FROM listings WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/listings/host/:hostId - Get listings by host
 */
router.get('/host/:hostId', async (req, res) => {
  const { hostId } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT 
        l.id, l.title, l.description, l.location, l.price, 
        l.images, l.amenities, l.status, l.created_at,
        u.id as host_id, u.name as host_name, u.email as host_email
      FROM listings l
      JOIN users u ON l.host_id = u.id
      WHERE l.host_id = $1
    `;

    let queryParams = [hostId];
    
    if (status) {
      query += ' AND l.status = $2';
      queryParams.push(status);
    }

    query += ' ORDER BY l.created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM listings WHERE host_id = $1';
    let countParams = [hostId];
    
    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    const listings = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      location: row.location,
      price: parseFloat(row.price),
      images: row.images,
      amenities: row.amenities,
      status: row.status,
      created_at: row.created_at,
      host: {
        id: row.host_id,
        name: row.host_name,
        email: row.host_email
      }
    }));

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching host listings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
