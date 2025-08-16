import User from '../models/User.js';
import Booking from '../models/Booking.js';
import logger from '../utils/logger.js';

// @desc    Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    // The user object is attached to the request by the authenticateToken middleware
    res.json({ success: true, user: req.user.toJSON() });
  } catch (error) {
    logger.error('Get Current User Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { familyName, firstName, dateOfBirth, gender, countryOfBirth, birthPlace, nativeLanguage, currentCity, currentCountry } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    user.familyName = familyName || user.familyName;
    user.firstName = firstName || user.firstName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    user.countryOfBirth = countryOfBirth || user.countryOfBirth;
    user.birthPlace = birthPlace || user.birthPlace;
    user.nativeLanguage = nativeLanguage || user.nativeLanguage;
    user.currentCity = currentCity || user.currentCity;
    user.currentCountry = currentCountry || user.currentCountry;

    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user: user.toJSON() });
  } catch (error) {
    logger.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Change user password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user || !(await user.isValidPassword(currentPassword))) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        user.password = newPassword; // Hashing is handled by the model's hook
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        logger.error('Change Password Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all bookings for the current user
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, bookings });
    } catch (error) {
        logger.error('Get User Bookings Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
