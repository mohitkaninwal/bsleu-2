import Document from '../models/Document.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

// @desc    Upload a document
export const uploadDocument = async (req, res) => {
    try {
        const { documentType, bookingId } = req.body;
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Validate document type
        const validDocTypes = ['passport_front', 'passport_back', 'passport_photo', 'telc_certificate'];
        if (!validDocTypes.includes(documentType)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid document type' 
            });
        }

        // Validate file type and size
        const maxSize = 10 * 1024 * 1024; // 10MB to match frontend limits
        if (req.file.size > maxSize) {
            return res.status(400).json({ 
                success: false, 
                message: 'File size exceeds 2MB limit' 
            });
        }

        // Validate file format based on document type
        const allowedFormats = {
            'passport_front': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
            'passport_back': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
            'passport_photo': ['image/jpeg', 'image/jpg', 'image/png'],
            'telc_certificate': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        };

        if (!allowedFormats[documentType].includes(req.file.mimetype)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid file format for ${documentType}. Expected: ${allowedFormats[documentType].join(', ')}` 
            });
        }

        // Create document record
        const document = await Document.create({
            userId,
            bookingId: bookingId || null,
            documentType,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            verificationStatus: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            document: {
                id: document.id,
                documentType: document.documentType,
                originalName: document.originalName,
                verificationStatus: document.verificationStatus,
                uploadedAt: document.createdAt
            }
        });

    } catch (error) {
        logger.error('Document Upload Error:', error);
        res.status(500).json({ success: false, message: 'Server error during document upload' });
    }
};

// @desc    Get/download a document
export const getDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        const document = await Document.findByPk(documentId, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'familyName']
                }
            ]
        });
        
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        
        // Check permissions: user can access their own documents, admin can access all
        if (userRole !== 'admin' && document.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        // Check if file exists
        const filePath = path.resolve(document.filePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on server' });
        }
        
        // Update download count and timestamp
        await document.update({
            downloadCount: document.downloadCount + 1,
            lastDownloadedAt: new Date()
        });
        
        // Set appropriate headers for download
        res.setHeader('Content-Type', document.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
        res.setHeader('Cache-Control', 'no-cache');
        
        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
    } catch (error) {
        logger.error('Document Download Error:', error);
        res.status(500).json({ success: false, message: 'Server error during document download' });
    }
};

// @desc    Delete a document
export const deleteDocument = async (req, res) => {
    // Placeholder function
    res.status(501).json({ message: 'Not Implemented' });
};
