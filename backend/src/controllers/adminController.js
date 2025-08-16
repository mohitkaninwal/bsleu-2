import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import '../models/index.js'; // Ensure associations are loaded
import logger from '../utils/logger.js';

// @desc    Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBookings, confirmedBookings, totalRevenue] = await Promise.all([
      User.count(),
      Booking.count(),
      Booking.count({ where: { status: 'confirmed' } }),
      Booking.sum('examFee')
    ]);
    res.json({ success: true, data: { totalUsers, totalBookings, confirmedBookings, totalRevenue: totalRevenue || 0 } });
  } catch (error) {
    logger.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json({ success: true, data: users });
    } catch (error) {
        logger.error('Get All Users Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({ 
            include: [
                { model: User, attributes: ['firstName', 'familyName', 'email'] }, 
                { model: Schedule }
            ],
            order: [['createdAt', 'DESC']] // Latest bookings first
        });
        res.json({ success: true, data: bookings });
    } catch (error) {
        logger.error('Get All Bookings Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
