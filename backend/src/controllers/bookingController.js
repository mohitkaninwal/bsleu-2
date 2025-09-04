import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { generateBookingReference } from '../utils/bookingReference.js';
import logger from '../utils/logger.js';

// @desc    Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { scheduleId, examLevel, examType, partialComponent } = req.body;
        const userId = req.user.id;

        // Validate partial exam requirements
        if (examType === 'partial' && !partialComponent) {
            return res.status(400).json({ 
                success: false, 
                message: 'Partial component (written/oral) is required for partial exams' 
            });
        }

        // Calculate exam fee based on level
        const examFees = {
            'A1': 20060,
            'A2': 20060,
            'B1': 21240,
            'B2': 21240,
            'B1-P': 20650,
            'B2-P': 20650,
            'C1-P': 23010,
            'C1': 23600,
        };

        const examFee = examFees[examLevel];
        if (!examFee) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid exam level' 
            });
        }

        // Generate unique booking reference
        const bookingReference = generateBookingReference();

        // Prevent duplicate booking by the same user for the same schedule (date + shift)
        const existing = await Booking.findOne({ where: { userId, scheduleId } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered for this exam date and shift.'
      });
    }

        // Get schedule and check availability
        const schedule = await Schedule.findByPk(scheduleId);
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }

        // Check if seats are available
        if (schedule.bookedSlots >= schedule.totalSlots) {
            return res.status(409).json({
                success: false,
                message: 'No available slots for this exam schedule. Please choose a different date or time.'
            });
        }

        // Prevent multiple bookings on the same calendar date for the same user
        const sameDayScheduleIds = await Schedule.findAll({
            where: { examDate: schedule.examDate },
            attributes: ['id']
        });
        const ids = sameDayScheduleIds.map(s => s.id);
        const sameDayExisting = await Booking.findOne({ where: { userId, scheduleId: ids } });
        if (sameDayExisting) {
            return res.status(409).json({
                success: false,
                message: 'You already have a booking on this date. Only one exam per day is allowed.'
            });
        }

        // Create booking and increment bookedSlots atomically using transaction
        const booking = await Booking.create({
            bookingReference,
            userId,
            scheduleId,
            examLevel,
            examType,
            partialComponent,
            examFee,
            currency: 'INR'
        });

        // Increment booked slots count
        await schedule.increment('bookedSlots', { by: 1 });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: booking.toJSON()
        });

    } catch (error) {
        logger.error('Create Booking Error:', error);
        res.status(500).json({ success: false, message: 'Server error during booking creation' });
    }
};

// @desc    Get all bookings for a user
export const getBookings = async (req, res) => {
    // Placeholder function
    res.status(501).json({ message: 'Not Implemented' });
};

// @desc    Get a single booking by ID
export const getBookingById = async (req, res) => {
    // Placeholder function
    res.status(501).json({ message: 'Not Implemented' });
};

// @desc    Cancel a booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findOne({ where: { id, userId } });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
        }

        // Update booking status to cancelled
        await booking.update({ status: 'cancelled' });

        // Decrement booked slots count
        const schedule = await Schedule.findByPk(booking.scheduleId);
        if (schedule && schedule.bookedSlots > 0) {
            await schedule.decrement('bookedSlots', { by: 1 });
        }

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            booking: booking.toJSON()
        });
    } catch (error) {
        logger.error('Cancel Booking Error:', error);
        res.status(500).json({ success: false, message: 'Server error during booking cancellation' });
    }
};

// @desc    Download booking receipt as PDF
export const downloadReceipt = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findOne({ where: { id: bookingId, userId } });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const schedule = await Schedule.findByPk(booking.scheduleId);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Header
    const title = 'BSLEU Akademie - Payment Receipt';
    page.drawText(title, { x: 50, y: height - 80, size: 20, font: boldFont, color: rgb(0.14, 0.39, 0.92) });
    
    // Company info
    page.drawText('BSLEU Akademie LLP', { x: 50, y: height - 110, size: 14, font: boldFont, color: rgb(0, 0, 0) });
    page.drawText('Direct Licensed Testing Center of telc gGmbH', { x: 50, y: height - 130, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
    page.drawText('License Number: 105007', { x: 50, y: height - 145, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
    
    // Receipt details
    const examDate = schedule?.examDate ? new Date(schedule.examDate).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'To be announced';
    
    const examTime = schedule?.examTime ? 
      (schedule.examTime === 'morning' ? 'Morning (08:30 AM)' : 'Evening (12:00 PM)') : 
      'To be announced';
    
    const testCenter = schedule?.testCenter || 'BSLEU Main Center, Noida';
    
    const lines = [
      '',
      'PAYMENT DETAILS:',
      `Booking Reference: ${booking.bookingReference}`,
      `Transaction Date: ${new Date(booking.createdAt).toLocaleDateString('en-IN')}`,
      `Amount Paid: ₹${Number(booking.examFee).toLocaleString()}`,
      `Payment Status: ${booking.paymentStatus.toUpperCase()}`,
      '',
      'EXAM DETAILS:',
      `Candidate Name: ${user.firstName} ${user.familyName}`,
      `Email: ${user.email}`,
      `Exam Level: ${booking.examLevel}`,
      `Exam Type: ${booking.examType}${booking.partialComponent ? ' (' + booking.partialComponent + ')' : ''}`,
      `Exam Date: ${examDate}`,
      `Exam Time: ${examTime}`,
      `Test Center: ${testCenter}`,
      '',
      'IMPORTANT NOTES:',
      '• Please arrive 30 minutes before the exam time',
      '• Bring a valid passport for identification',
      '• No electronic devices are allowed in the exam hall',
      '• Contact us for any queries at info@bsleu.com',
      '',
      `Receipt Generated: ${new Date().toLocaleString('en-IN')}`,
    ];
    
    let y = height - 180;
    lines.forEach((text) => {
      if (text === '') {
        y -= 10; // Extra space for empty lines
      } else if (text.includes(':')) {
        // Section headers
        page.drawText(text, { x: 50, y, size: 12, font: boldFont, color: rgb(0, 0, 0) });
        y -= 20;
      } else if (text.startsWith('•')) {
        // Bullet points
        page.drawText(text, { x: 70, y, size: 10, font, color: rgb(0, 0, 0) });
        y -= 15;
      } else {
        // Regular text
        page.drawText(text, { x: 50, y, size: 11, font, color: rgb(0, 0, 0) });
        y -= 18;
      }
    });
    
    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${booking.bookingReference}_receipt.pdf"`);
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    logger.error('Download Receipt Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate receipt' });
  }
};
