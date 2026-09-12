import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import materialRoutes from './materialRoutes.js';
import listingRoutes from './listingRoutes.js';
import requestRoutes from './requestRoutes.js';
import orderRoutes from './orderRoutes.js';
import logisticsRoutes from './logisticsRoutes.js';
import messageRoutes from './messageRoutes.js';
import impactRoutes from './impactRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// Public Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Synapse API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/materials', materialRoutes);
router.use('/listings', listingRoutes);
router.use('/requests', requestRoutes);
router.use('/orders', orderRoutes);
router.use('/logistics', logisticsRoutes);
router.use('/messages', messageRoutes);
router.use('/impact', impactRoutes);
router.use('/admin', adminRoutes);

export default router;
