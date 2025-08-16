import Document from '../models/Document.js';
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
    // Placeholder function
    res.status(501).json({ message: 'Not Implemented' });
};

// @desc    Delete a document
export const deleteDocument = async (req, res) => {
    // Placeholder function
    res.status(501).json({ message: 'Not Implemented' });
};
