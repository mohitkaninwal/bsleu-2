import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Document from '../models/Document.js';
import '../models/index.js'; // Ensure associations are loaded
import logger from '../utils/logger.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

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

// @desc    Export user details as PDF
export const exportUserDetailsPDF = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'resetPasswordToken'] },
            include: [
                {
                    model: Document,
                    where: { isActive: true },
                    required: false,
                    attributes: [
                        'id', 'documentType', 'originalName', 'fileName', 
                        'fileSize', 'mimeType', 'verificationStatus', 
                        'createdAt', 'downloadCount'
                    ]
                },
                {
                    model: Booking,
                    required: false,
                    include: [{ model: Schedule }],
                    attributes: [
                        'id', 'bookingReference', 'examLevel', 'examType', 
                        'examFee', 'status', 'createdAt'
                    ]
                }
            ]
        });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="user-details-${user.firstName}-${user.familyName}.pdf"`);
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Header
        doc.fontSize(20).fillColor('#1e40af').text('BSLEU Akademie - Student Details', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor('#000000').text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, { align: 'right' });
        doc.moveDown(2);
        
        // Personal Information
        doc.fontSize(16).fillColor('#1e40af').text('Personal Information');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000000');
        doc.text(`Full Name: ${user.firstName} ${user.familyName}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Phone: ${user.phone || 'Not provided'}`);
        doc.text(`Date of Birth: ${user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-GB') : 'Not provided'}`);
        doc.text(`Gender: ${user.gender || 'Not provided'}`);
        doc.text(`Nationality: ${user.nationality || 'Not provided'}`);
        doc.moveDown(1.5);
        
        // Location Information
        doc.fontSize(16).fillColor('#1e40af').text('Location Information');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000000');
        doc.text(`Birth Place: ${user.birthPlace || 'Not provided'}`);
        doc.text(`Current Address: ${user.currentAddress || 'Not provided'}`);
        doc.text(`City: ${user.city || 'Not provided'}`);
        doc.text(`State: ${user.state || 'Not provided'}`);
        doc.text(`Postal Code: ${user.postalCode || 'Not provided'}`);
        doc.text(`Country: ${user.country || 'Not provided'}`);
        doc.moveDown(1.5);
        
        // ID Information
        if (user.idType || user.idNumber) {
            doc.fontSize(16).fillColor('#1e40af').text('Identification');
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000000');
            doc.text(`ID Type: ${user.idType?.replace('_', ' ') || 'Not provided'}`);
            doc.text(`ID Number: ${user.idNumber || 'Not provided'}`);
            doc.moveDown(1.5);
        }
        
        // Account Information
        doc.fontSize(16).fillColor('#1e40af').text('Account Information');
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000000');
        doc.text(`Role: ${user.role || 'student'}`);
        doc.text(`Account Created: ${new Date(user.createdAt).toLocaleDateString('en-GB')}`);
        doc.text(`Last Updated: ${new Date(user.updatedAt).toLocaleDateString('en-GB')}`);
        doc.moveDown(1.5);
        
        // Documents
        if (user.Documents && user.Documents.length > 0) {
            doc.fontSize(16).fillColor('#1e40af').text(`Uploaded Documents (${user.Documents.length})`);
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000000');
            
            user.Documents.forEach((document, index) => {
                const docTypeLabels = {
                    'passport': 'Passport',
                    'id_card': 'ID Card',
                    'driving_license': 'Driving License',
                    'profile_picture': 'Profile Picture',
                    'other': 'Other Document'
                };
                
                doc.text(`${index + 1}. ${docTypeLabels[document.documentType] || document.documentType}`);
                doc.text(`   File: ${document.originalName}`);
                doc.text(`   Size: ${(document.fileSize / 1024).toFixed(1)} KB`);
                doc.text(`   Status: ${document.verificationStatus}`);
                doc.text(`   Uploaded: ${new Date(document.createdAt).toLocaleDateString('en-GB')}`);
                doc.text(`   Downloads: ${document.downloadCount || 0}`);
                doc.moveDown(0.5);
            });
            doc.moveDown(1);
        }
        
        // Booking History
        if (user.Bookings && user.Bookings.length > 0) {
            doc.fontSize(16).fillColor('#1e40af').text(`Booking History (${user.Bookings.length})`);
            doc.moveDown(0.5);
            doc.fontSize(11).fillColor('#000000');
            
            user.Bookings.forEach((booking, index) => {
                doc.text(`${index + 1}. ${booking.bookingReference || `#${booking.id}`}`);
                doc.text(`   Exam Level: ${booking.examLevel}`);
                doc.text(`   Exam Type: ${booking.examType}`);
                doc.text(`   Fee: ₹${booking.examFee}`);
                doc.text(`   Status: ${booking.status}`);
                doc.text(`   Booked: ${new Date(booking.createdAt).toLocaleDateString('en-GB')}`);
                if (booking.Schedule) {
                    doc.text(`   Date: ${new Date(booking.Schedule.examDate).toLocaleDateString('en-GB')}`);
                    doc.text(`   Time: ${booking.Schedule.timeSlot}`);
                }
                doc.moveDown(0.5);
            });
        }
        
        // Footer
        doc.moveDown(2);
        doc.fontSize(10).fillColor('#666666').text('This document was generated by BSLEU Akademie Admin System', { align: 'center' });
        doc.text(`Export Date: ${new Date().toLocaleString('en-GB')}`, { align: 'center' });
        
        // Finalize PDF
        doc.end();
        
    } catch (error) {
        logger.error('Export User Details PDF Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
