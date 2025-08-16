import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { sendPaymentReceipt, sendBookingConfirmation } from '../services/emailService.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
export const createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user.id;

        // Get booking details
        const booking = await Booking.findOne({
            where: { id: bookingId, userId }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if already paid
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already paid'
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(booking.examFee * 100), // Amount in smallest currency unit (paise)
            currency: booking.currency,
            receipt: `booking_${booking.id}_${Date.now()}`,
            notes: {
                booking_id: booking.id,
                user_id: userId,
                exam_level: booking.examLevel,
                exam_type: booking.examType
            }
        };

        const order = await razorpay.orders.create(options);

        // Update booking with order details
        await booking.update({
            razorpayOrderId: order.id
        });

        res.json({
            success: true,
            data: {
                order: {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    receipt: order.receipt
                },
                booking: {
                    id: booking.id,
                    examLevel: booking.examLevel,
                    examType: booking.examType,
                    examFee: booking.examFee
                }
            }
        });

    } catch (error) {
        logger.error('Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order'
        });
    }
};

// @desc    Verify a Razorpay payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        const userId = req.user.id;

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Get booking
        const booking = await Booking.findOne({
            where: { id: bookingId, userId }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Create payment record
        const payment = await Payment.create({
            bookingId: booking.id,
            userId: userId,
            amount: booking.examFee,
            currency: booking.currency,
            status: 'success',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentMethod: 'razorpay',
            transactionId: razorpay_payment_id
        });

        // Update booking status
        await booking.update({
            status: 'confirmed',
            paymentStatus: 'paid'
        });

        // Get user details for email
        const user = await User.findByPk(userId);

        // Send confirmation emails
        try {
            // Generate a PDF receipt and send as attachment
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const title = 'BSLEU Payment Receipt';
            page.drawText(title, { x: 50, y: height - 80, size: 20, font, color: rgb(0.14, 0.39, 0.92) });
            const lines = [
              `Name: ${user.firstName} ${user.familyName}`,
              `Booking Reference: ${booking.bookingReference}`,
              `Transaction ID: ${payment.transactionId}`,
              `Amount: ₹${payment.amount.toLocaleString()}`,
              `Payment Method: Razorpay`,
              `Payment Date: ${new Date(payment.createdAt).toLocaleString()}`,
              `Exam Level: ${booking.examLevel}`,
              `Exam Type: ${booking.examType}${booking.partialComponent ? ' ('+booking.partialComponent+')' : ''}`,
            ];
            let y = height - 120;
            lines.forEach((text) => {
              page.drawText(text, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
              y -= 20;
            });
            const pdfBytes = await pdfDoc.save();

            await sendPaymentReceipt(
              user.email,
              {
                userName: `${user.firstName} ${user.familyName}`,
                transactionId: payment.transactionId,
                bookingReference: booking.bookingReference,
                amount: payment.amount,
                paymentMethod: 'Razorpay',
                paymentDate: payment.createdAt,
              },
              [
                {
                  filename: `${booking.bookingReference}_receipt.pdf`,
                  type: 'application/pdf',
                  content: Buffer.from(pdfBytes).toString('base64'),
                  disposition: 'attachment',
                },
              ]
            );

            // Send booking confirmation
            await sendBookingConfirmation(user.email, {
                userName: `${user.firstName} ${user.familyName}`,
                bookingReference: booking.bookingReference,
                examLevel: booking.examLevel,
                examType: booking.examType,
                partialComponent: booking.partialComponent,
                examDate: 'TBA', // Will be updated when schedule is assigned
                examTime: 'TBA',
                testCenter: 'TBA',
                amount: payment.amount
            });
        } catch (emailError) {
            logger.error('Failed to send confirmation emails:', emailError);
            // Don't fail payment verification if email fails
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                payment: {
                    id: payment.id,
                    status: payment.status,
                    amount: payment.amount,
                    currency: payment.currency,
                    transactionId: payment.transactionId
                },
                booking: {
                    id: booking.id,
                    status: booking.status,
                    paymentStatus: booking.paymentStatus,
                    bookingReference: booking.bookingReference
                }
            }
        });

    } catch (error) {
        logger.error('Verify Payment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
};

// @desc    Handle Razorpay webhooks
export const handleWebhook = async (req, res) => {
    // Placeholder function
    res.status(501).json({ message: 'Not Implemented' });
};
