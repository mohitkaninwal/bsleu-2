import express from 'express';
import { createOrder, verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/payments/create-order
// @desc    Create a Razorpay order for a booking
// @access  Private
router.post('/create-order', authenticateToken, createOrder);

// @route   POST api/payments/verify
// @desc    Verify a Razorpay payment
// @access  Private
router.post('/verify', authenticateToken, verifyPayment);

// @route   POST api/payments/webhook
// @desc    Handle Razorpay webhooks
// @access  Public
router.post('/webhook', handleWebhook);

export default router;
