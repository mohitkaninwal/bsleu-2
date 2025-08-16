import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import bookingRoutes from './bookings.js';
import scheduleRoutes from './schedules.js';
import paymentRoutes from './payments.js';
import documentRoutes from './documents.js';
import notificationRoutes from './notifications.js';
import adminRoutes from './admin.js';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/payments', paymentRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
