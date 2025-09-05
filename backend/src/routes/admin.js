import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getDashboardStats, getAllUsers, getAllBookings, getUserDetails } from '../controllers/adminController.js';

const router = express.Router();

// All routes in this file are protected and require admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', getDashboardStats);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', getAllUsers);

// @route   GET api/admin/bookings
// @desc    Get all bookings
// @access  Admin
router.get('/bookings', getAllBookings);

// @route   GET api/admin/users/:userId
// @desc    Get user details with documents
// @access  Admin
router.get('/users/:userId', getUserDetails);

export default router;
