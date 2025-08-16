import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

// @route   GET api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', getNotifications);

// @route   PUT api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', markAsRead);

export default router;
