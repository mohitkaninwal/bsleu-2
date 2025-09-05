import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Document from '../models/Document.js';
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
                { model: User, attributes: ['id', 'firstName', 'familyName', 'email'] }, 
                { model: Schedule }
            ],
            order: [['createdAt', 'DESC'], ['id', 'DESC']] // Latest bookings first, then by ID for consistency
        });
        
        res.json({ success: true, data: bookings });
    } catch (error) {
        logger.error('Get All Bookings Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user details with documents
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'resetPasswordToken'] },
            include: [
                {
                    model: Document,
                    where: { isActive: true },
                    required: false, // LEFT JOIN to include users even without documents
                    attributes: [
                        'id', 'documentType', 'originalName', 'fileName', 
                        'fileSize', 'mimeType', 'verificationStatus', 
                        'createdAt', 'downloadCount'
                    ]
                }
            ]
        });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, data: user });
    } catch (error) {
        logger.error('Get User Details Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

