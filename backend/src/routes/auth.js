import express from 'express';
import { registerUser, loginUser, refreshToken, logoutUser, requestPasswordReset, resetPassword, registerAdminWithInvite } from '../controllers/authController.js';
import { validateRegistration, validateLogin, validatePasswordResetRequest, validatePasswordReset, validateAdminRegistration } from '../middleware/validators.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validateLogin, loginUser);

// @route   POST api/auth/refresh-token
// @desc    Get a new access token using a refresh token
// @access  Public
router.post('/refresh-token', refreshToken);

// @route   POST api/auth/logout
// @desc    Logout user (invalidate refresh token)
// @access  Private
router.post('/logout', authenticateToken, logoutUser);

// @route   POST api/auth/request-password-reset
// @desc    Request a password reset email
// @access  Public
router.post('/request-password-reset', validatePasswordResetRequest, requestPasswordReset);

// @route   POST api/auth/reset-password
// @desc    Reset password using a token
// @access  Public
router.post('/reset-password', validatePasswordReset, resetPassword);

// @route   POST api/auth/admin/register
// @desc    Register a new admin (guarded by ADMIN_INVITE_SECRET)
// @access  Public (but requires inviteSecret)
router.post('/admin/register', validateAdminRegistration, registerAdminWithInvite);

export default router;
