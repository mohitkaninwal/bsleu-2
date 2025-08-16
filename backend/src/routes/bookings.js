import express from 'express';
import { createBooking, getBookings, getBookingById, cancelBooking, downloadReceipt } from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authenticateToken, createBooking);

// @route   GET api/bookings
// @desc    Get all bookings for a user
// @access  Private (current user bookings should use /users/me/bookings; keeping this for compatibility if needed)
router.get('/', authenticateToken, getBookings);

// @route   GET api/bookings/:id
// @desc    Get a single booking by ID
// @access  Private (admin/user context ideally)
router.get('/:id', authenticateToken, getBookingById);

// @route   GET api/bookings/:id/receipt
// @desc    Download booking receipt PDF
// @access  Private
router.get('/:id/receipt', authenticateToken, downloadReceipt);

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Public (for now)
router.put('/:id/cancel', cancelBooking);

export default router;
