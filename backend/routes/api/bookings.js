/**
 * Bookings API routes for Homigo app
 * Handles booking creation and management
 */

const express = require('express');
const { pool } = require('../../config/db');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

/**
 * POST /api/bookings - Create a new booking
 */
router.post('/', authenticateToken, async (req, res) => {
  const {
    listing_id,
    booking_date,
    check_in_date,
    check_out_date
  } = req.body;

  try {
    // Validation
    if (!listing_id || !booking_date || !check_in_date || !check_out_date) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID, booking date, check-in date, and check-out date are required'
      });
    }

    // Parse and validate dates
    const bookingDate = new Date(booking_date);
    const checkInDate = new Date(check_in_date);
    const checkOutDate = new Date(check_out_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    if (bookingDate > checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be after check-in date'
      });
    }

    // Check if listing exists and is active
    const listingResult = await pool.query(
      'SELECT id, host_id, price, status FROM listings WHERE id = $1',
      [listing_id]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const listing = listingResult.rows[0];

    if (listing.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Listing is not available for booking'
      });
    }

    // Check if user is trying to book their own listing
    if (listing.host_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own listing'
      });
    }

    // Check for conflicting bookings
    const conflictResult = await pool.query(
      `SELECT id FROM bookings 
       WHERE listing_id = $1 
       AND status IN ('confirmed', 'pending')
       AND (
         (check_in_date <= $2 AND check_out_date > $2) OR
         (check_in_date < $3 AND check_out_date >= $3) OR
         (check_in_date >= $2 AND check_out_date <= $3)
       )`,
      [listing_id, check_in_date, check_out_date]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'These dates are already booked or pending confirmation'
      });
    }

    // Calculate total price
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const total_price = days * parseFloat(listing.price);

    // Create booking
    const result = await pool.query(
      `INSERT INTO bookings 
       (listing_id, guest_id, booking_date, check_in_date, check_out_date, total_price) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, listing_id, guest_id, booking_date, check_in_date, check_out_date, 
                 total_price, status, created_at`,
      [
        listing_id,
        req.user.id,
        booking_date,
        check_in_date,
        check_out_date,
        total_price
      ]
    );

    const booking = result.rows[0];

    // Get booking details with listing and guest info
    const bookingDetailsResult = await pool.query(
      `SELECT 
        b.id, b.booking_date, b.check_in_date, b.check_out_date, 
        b.total_price, b.status, b.created_at,
        l.id as listing_id, l.title as listing_title, l.location as listing_location,
        l.price as listing_price, l.images as listing_images,
        u.id as guest_id, u.name as guest_name, u.email as guest_email,
        h.id as host_id, h.name as host_name, h.email as host_email
      FROM bookings b
      JOIN listings l ON b.listing_id = l.id
      JOIN users u ON b.guest_id = u.id
      JOIN users h ON l.host_id = h.id
      WHERE b.id = $1`,
      [booking.id]
    );

    const bookingDetails = bookingDetailsResult.rows[0];

    const response = {
      id: bookingDetails.id,
      booking_date: bookingDetails.booking_date,
      check_in_date: bookingDetails.check_in_date,
      check_out_date: bookingDetails.check_out_date,
      total_price: parseFloat(bookingDetails.total_price),
      status: bookingDetails.status,
      created_at: bookingDetails.created_at,
      listing: {
        id: bookingDetails.listing_id,
        title: bookingDetails.listing_title,
        location: bookingDetails.listing_location,
        price: parseFloat(bookingDetails.listing_price),
        images: bookingDetails.listing_images
      },
      guest: {
        id: bookingDetails.guest_id,
        name: bookingDetails.guest_name,
        email: bookingDetails.guest_email
      },
      host: {
        id: bookingDetails.host_id,
        name: bookingDetails.host_name,
        email: bookingDetails.host_email
      }
    };

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking: response }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle unique constraint violation (duplicate booking)
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'These dates are already booked'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/bookings/:userId - Get bookings for a specific user (guest)
 */
router.get('/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  try {
    // Check if user is requesting their own bookings
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own bookings'
      });
    }

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        b.id, b.booking_date, b.check_in_date, b.check_out_date, 
        b.total_price, b.status, b.created_at,
        l.id as listing_id, l.title as listing_title, l.location as listing_location,
        l.price as listing_price, l.images as listing_images,
        h.id as host_id, h.name as host_name, h.email as host_email
      FROM bookings b
      JOIN listings l ON b.listing_id = l.id
      JOIN users h ON l.host_id = h.id
      WHERE b.guest_id = $1
    `;

    let queryParams = [userId];

    if (status) {
      query += ' AND b.status = $2';
      queryParams.push(status);
    }

    query += ' ORDER BY b.created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookings WHERE guest_id = $1';
    let countParams = [userId];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    const bookings = result.rows.map(row => ({
      id: row.id,
      booking_date: row.booking_date,
      check_in_date: row.check_in_date,
      check_out_date: row.check_out_date,
      total_price: parseFloat(row.total_price),
      status: row.status,
      created_at: row.created_at,
      listing: {
        id: row.listing_id,
        title: row.listing_title,
        location: row.listing_location,
        price: parseFloat(row.listing_price),
        images: row.listing_images
      },
      host: {
        id: row.host_id,
        name: row.host_name,
        email: row.host_email
      }
    }));

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/bookings/listing/:listingId - Get bookings for a specific listing (host only)
 */
router.get('/listing/:listingId', authenticateToken, async (req, res) => {
  const { listingId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  try {
    // Check if user owns the listing
    const listingCheck = await pool.query(
      'SELECT host_id FROM listings WHERE id = $1',
      [listingId]
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
        message: 'You can only view bookings for your own listings'
      });
    }

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        b.id, b.booking_date, b.check_in_date, b.check_out_date, 
        b.total_price, b.status, b.created_at,
        u.id as guest_id, u.name as guest_name, u.email as guest_email
      FROM bookings b
      JOIN users u ON b.guest_id = u.id
      WHERE b.listing_id = $1
    `;

    let queryParams = [listingId];

    if (status) {
      query += ' AND b.status = $2';
      queryParams.push(status);
    }

    query += ' ORDER BY b.created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookings WHERE listing_id = $1';
    let countParams = [listingId];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    const bookings = result.rows.map(row => ({
      id: row.id,
      booking_date: row.booking_date,
      check_in_date: row.check_in_date,
      check_out_date: row.check_out_date,
      total_price: parseFloat(row.total_price),
      status: row.status,
      created_at: row.created_at,
      guest: {
        id: row.guest_id,
        name: row.guest_name,
        email: row.guest_email
      }
    }));

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching listing bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * PUT /api/bookings/:id/status - Update booking status
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, confirmed, cancelled, completed)'
      });
    }

    // Get booking details to check permissions
    const bookingResult = await pool.query(
      `SELECT b.guest_id, l.host_id, b.status as current_status
       FROM bookings b
       JOIN listings l ON b.listing_id = l.id
       WHERE b.id = $1`,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookingResult.rows[0];

    // Check permissions - host can confirm/cancel, guest can cancel
    const isHost = booking.host_id === req.user.id;
    const isGuest = booking.guest_id === req.user.id;

    if (!isHost && !isGuest) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this booking'
      });
    }

    // Validate status transitions
    if (isGuest && !['cancelled'].includes(status)) {
      return res.status(403).json({
        success: false,
        message: 'Guests can only cancel bookings'
      });
    }

    if (isHost && status === 'cancelled' && booking.current_status === 'confirmed') {
      // Hosts can cancel confirmed bookings but should provide reason
      // In a real app, you might want to require a cancellation reason
    }

    // Update booking status
    const result = await pool.query(
      `UPDATE bookings 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, listing_id, guest_id, booking_date, check_in_date, 
                 check_out_date, total_price, status, created_at, updated_at`,
      [status, id]
    );

    const updatedBooking = result.rows[0];

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking: updatedBooking }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/bookings - Get all bookings (admin or for development)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        b.id, b.booking_date, b.check_in_date, b.check_out_date, 
        b.total_price, b.status, b.created_at,
        l.id as listing_id, l.title as listing_title, l.location as listing_location,
        u.id as guest_id, u.name as guest_name, u.email as guest_email,
        h.id as host_id, h.name as host_name, h.email as host_email
      FROM bookings b
      JOIN listings l ON b.listing_id = l.id
      JOIN users u ON b.guest_id = u.id
      JOIN users h ON l.host_id = h.id
    `;

    let queryParams = [];

    if (status) {
      query += ' WHERE b.status = $1';
      queryParams.push(status);
    }

    query += ' ORDER BY b.created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookings';
    let countParams = [];

    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    const bookings = result.rows.map(row => ({
      id: row.id,
      booking_date: row.booking_date,
      check_in_date: row.check_in_date,
      check_out_date: row.check_out_date,
      total_price: parseFloat(row.total_price),
      status: row.status,
      created_at: row.created_at,
      listing: {
        id: row.listing_id,
        title: row.listing_title,
        location: row.listing_location
      },
      guest: {
        id: row.guest_id,
        name: row.guest_name,
        email: row.guest_email
      },
      host: {
        id: row.host_id,
        name: row.host_name,
        email: row.host_email
      }
    }));

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
