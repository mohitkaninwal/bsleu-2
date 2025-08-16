import { Op } from 'sequelize';
import User from '../models/User.js';
import { generateTokens } from '../middleware/auth.js';
import { sendPasswordResetEmail, sendRegistrationConfirmation } from '../services/emailService.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import logger from '../utils/logger.js';
dotenv.config();

// @desc    Register a new user
export const registerUser = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      familyName, 
      firstName, 
      telephone,
      dateOfBirth, 
      birthPlace,
      countryOfBirth, 
      nativeLanguage, 
      gender, 
      placeOfResidence,
      countryOfResidence
    } = req.body;

    const normalizedEmail = (email || '').trim().toLowerCase();
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      // Allow re-use of the same email to proceed with additional bookings
      const { accessToken, refreshToken } = generateTokens(existingUser.id);
      return res.status(200).json({
        success: true,
        message: 'User already exists. Proceeding with existing account.',
        user: existingUser.toJSON(),
        accessToken,
        refreshToken
      });
    }

    const user = await User.create({
      email: normalizedEmail,
      password,
      familyName,
      firstName,
      telephone,
      dateOfBirth,
      birthPlace,
      countryOfBirth,
      nativeLanguage,
      gender,
      placeOfResidence,
      countryOfResidence
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Send registration confirmation email
    try {
      await sendRegistrationConfirmation(user.email, {
        firstName: user.firstName,
        familyName: user.familyName,
        email: user.email
      });
    } catch (emailError) {
      logger.error('Failed to send registration email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: user.toJSON(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate user and get token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    logger.info(`Login attempt for email=${normalizedEmail}`);
    let user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      // Fallback to case-insensitive lookup to handle legacy mixed-case emails
      user = await User.findOne({ where: { email: { [Op.iLike]: normalizedEmail } } });
    }

    if (!user) {
      logger.warn(`Login failed: user not found for email=${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    logger.info(`Login user found: id=${user.id} role=${user.role} isActive=${user.isActive}`);

    const passwordOk = await user.isValidPassword(password);
    if (!passwordOk) {
      logger.warn(`Login failed: invalid password for user id=${user.id}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    await user.update({ lastLogin: new Date() });

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({ 
      success: true, 
      message: 'Logged in successfully', 
      user: user.toJSON(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Refresh access token
export const refreshToken = async (req, res) => {
  // This is a simplified version. In a real app, you'd store and validate refresh tokens.
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }
  // Logic to validate refresh token and issue a new access token would go here.
  res.status(501).json({ message: 'Not implemented' });
};

// @desc    Logout user
export const logoutUser = async (req, res) => {
  // In a stateless JWT setup, logout is handled client-side by deleting the token.
  // For stateful, you would invalidate the token here.
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Request a password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    logger.error('Password Reset Request Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
    }

    user.password = password; // Hashing is done by the 'beforeUpdate' hook
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password has been reset' });
  } catch (error) {
    logger.error('Password Reset Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Register an admin using a server-side invite secret; returns JWT tokens
// @route   POST /api/auth/admin/register
// @access  Protected by invite secret (ADMIN_INVITE_SECRET)
export const registerAdminWithInvite = async (req, res) => {
  try {
    const { inviteSecret, email, password, familyName, firstName, telephone, placeOfResidence, countryOfResidence } = req.body;

    if (!process.env.ADMIN_INVITE_SECRET) {
      return res.status(500).json({ success: false, message: 'Admin invite secret not configured' });
    }

    if (!inviteSecret || inviteSecret !== process.env.ADMIN_INVITE_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid invite secret' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    let adminUser;
    if (existing) {
      // Update existing admin credentials
      existing.role = 'admin';
      if (password) existing.password = password; // hashed by beforeUpdate hook
      existing.isActive = true;
      await existing.save();
      adminUser = existing;
    } else {
      adminUser = await User.create({
        email: normalizedEmail,
        password,
        familyName,
        firstName,
        telephone,
        placeOfResidence,
        countryOfResidence,
        role: 'admin',
        isActive: true,
      });
    }

    const { accessToken, refreshToken } = generateTokens(adminUser.id);

    res.status(existing ? 200 : 201).json({
      success: true,
      message: existing ? 'Admin updated successfully' : 'Admin created successfully',
      user: adminUser.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Admin Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during admin registration' });
  }
};
