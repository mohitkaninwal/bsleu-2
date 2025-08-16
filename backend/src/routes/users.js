import express from 'express';
import { getCurrentUser, updateUserProfile, changePassword, getUserBookings } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateToken);

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', getCurrentUser);

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', updateUserProfile);

// @route   PUT api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', changePassword);

// @route   GET api/users/me/bookings
// @desc    Get all bookings for the current user
// @access  Private
router.get('/me/bookings', getUserBookings);

export default router;
