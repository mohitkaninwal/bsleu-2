import express from 'express';
import { uploadDocument, getDocument, deleteDocument } from '../controllers/documentController.js';
import { upload } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/documents/upload
// @desc    Upload a document
// @access  Private
router.post('/upload', authenticateToken, upload.single('document'), uploadDocument);

// @route   GET api/documents/:id
// @desc    Get/download a document
// @access  Private
router.get('/:id', getDocument);

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', deleteDocument);

export default router;
