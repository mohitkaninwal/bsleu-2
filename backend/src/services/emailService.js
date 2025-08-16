import sgMail from '@sendgrid/mail';
import logger from '../utils/logger.js';

// Initialize SendGrid safely (fallback to mock if invalid)
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const hasValidSendgridKey = typeof sendgridApiKey === 'string' && sendgridApiKey.startsWith('SG.');
const fromEmailEnv = process.env.FROM_EMAIL || 'noreply@bsleu.com';

if (hasValidSendgridKey) {
    try {
        sgMail.setApiKey(sendgridApiKey);
        logger.info('SendGrid initialized with provided API key');
        logger.info(`Email sender configured. FROM_EMAIL=${fromEmailEnv}`);
        if (!process.env.FROM_EMAIL) {
            logger.warn('FROM_EMAIL not set. Using default noreply@bsleu.com which may fail unless the domain is authenticated in SendGrid.');
        }
    } catch (err) {
        logger.warn('Failed to initialize SendGrid; using mock email sender');
    }
} else if (sendgridApiKey) {
    logger.warn('SENDGRID_API_KEY is set but invalid (must start with "SG."). Using mock email sender.');
} else {
    logger.info('SENDGRID_API_KEY not set. Using mock email sender.');
}

// Email service
const sendEmail = async (to, subject, html, templateData = null, attachments = null) => {
    try {
        if (!hasValidSendgridKey) {
            // Fallback to mock for development
            logger.info('--- MOCK EMAIL (SendGrid not configured) ---');
            logger.info(`To: ${to}`);
            logger.info(`Subject: ${subject}`);
            logger.info('HTML Body:');
            logger.info(html);
            logger.info('------------------');
            return Promise.resolve();
        }

        const msg = {
            to,
            from: {
                email: fromEmailEnv,
                name: 'BSLEU Exam Booking'
            },
            subject,
            html,
            ...(templateData && { dynamicTemplateData: templateData }),
            ...(attachments && { attachments })
        };

        await sgMail.send(msg);
        logger.info(`Email sent successfully to ${to}`);
        return Promise.resolve();

    } catch (error) {
        // Log rich response body from SendGrid if available (helpful for verification errors, blocks, etc.)
        if (error && error.response && error.response.body) {
            try {
                logger.error('Email sending failed with response:', error.response.body);
            } catch (_) {
                logger.error('Email sending failed (could not stringify response body):', error.message || error);
            }
        } else {
            logger.error('Email sending failed:', error);
        }
        throw error;
    }
};

// Email template functions
export const sendRegistrationConfirmation = async (to, userData) => {
    const subject = 'Welcome to BSLEU - Registration Confirmed';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to BSLEU!</h2>
            <p>Dear ${userData.firstName} ${userData.familyName},</p>
            <p>Thank you for registering with BSLEU Exam Booking Platform. Your account has been successfully created.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Account Details:</h3>
                <p><strong>Name:</strong> ${userData.firstName} ${userData.familyName}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>You can now proceed to book your BSLEU language proficiency exam.</p>
            <p>Best regards,<br>BSLEU Team</p>
        </div>
    `;
    await sendEmail(to, subject, html);
};

export const sendBookingConfirmation = async (to, bookingData) => {
    const subject = `Booking Confirmed - ${bookingData.examLevel} Exam`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Booking Confirmation</h2>
            <p>Dear ${bookingData.userName},</p>
            <p>Your exam booking has been confirmed. Here are your booking details:</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Booking Details:</h3>
                <p><strong>Booking Reference:</strong> ${bookingData.bookingReference}</p>
                <p><strong>Exam Level:</strong> ${bookingData.examLevel}</p>
                <p><strong>Exam Type:</strong> ${bookingData.examType === 'partial' ? 'Partial (' + bookingData.partialComponent + ')' : 'Full Exam'}</p>
                <p><strong>Exam Date:</strong> ${bookingData.examDate}</p>
                <p><strong>Exam Time:</strong> ${bookingData.examTime}</p>
                <p><strong>Test Center:</strong> ${bookingData.testCenter}</p>
                <p><strong>Amount Paid:</strong> ₹${bookingData.amount}</p>
            </div>
            <p><strong>Important Instructions:</strong></p>
            <ul>
                <li>Please arrive 30 minutes before your exam time</li>
                <li>Bring a valid ID document (same as uploaded during registration)</li>
                <li>Mobile phones are not allowed in the examination room</li>
            </ul>
            <p>Best regards,<br>BSLEU Team</p>
        </div>
    `;
    await sendEmail(to, subject, html);
};

export const sendPaymentReceipt = async (to, paymentData, attachments = null) => {
    const subject = `Payment Receipt - ${paymentData.bookingReference}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Payment Receipt</h2>
            <p>Dear ${paymentData.userName},</p>
            <p>Thank you for your payment. Here is your payment receipt:</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Payment Details:</h3>
                <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
                <p><strong>Booking Reference:</strong> ${paymentData.bookingReference}</p>
                <p><strong>Amount:</strong> ₹${paymentData.amount}</p>
                <p><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
                <p><strong>Payment Date:</strong> ${new Date(paymentData.paymentDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style="color: #16a34a;">Success</span></p>
            </div>
            <p>This receipt serves as confirmation of your payment for the BSLEU exam.</p>
            <p>Best regards,<br>BSLEU Team</p>
        </div>
    `;
    await sendEmail(to, subject, html, null, attachments);
};

export const sendExamReminder = async (to, reminderData) => {
    const subject = `Exam Reminder - ${reminderData.examLevel} in ${reminderData.daysUntilExam} days`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Exam Reminder</h2>
            <p>Dear ${reminderData.userName},</p>
            <p>This is a friendly reminder about your upcoming BSLEU exam:</p>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3>Exam Details:</h3>
                <p><strong>Exam Date:</strong> ${reminderData.examDate}</p>
                <p><strong>Exam Time:</strong> ${reminderData.examTime}</p>
                <p><strong>Level:</strong> ${reminderData.examLevel}</p>
                <p><strong>Test Center:</strong> ${reminderData.testCenter}</p>
                <p><strong>Days Remaining:</strong> ${reminderData.daysUntilExam}</p>
            </div>
            <p><strong>Preparation Tips:</strong></p>
            <ul>
                <li>Review your study materials</li>
                <li>Get adequate rest before the exam</li>
                <li>Prepare your identification documents</li>
                <li>Plan your route to the test center</li>
            </ul>
            <p>Good luck with your exam!</p>
            <p>Best regards,<br>BSLEU Team</p>
        </div>
    `;
    await sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'Password Reset Request - BSLEU';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>You requested a password reset for your BSLEU account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>BSLEU Team</p>
        </div>
    `;
    await sendEmail(to, subject, html);
};

export default sendEmail;
