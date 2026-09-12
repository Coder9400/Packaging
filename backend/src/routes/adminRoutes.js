import { Router } from 'express';
import { getAdminMetrics, getBusinesses, updateBusinessStatus } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/metrics', requireAuth, requireAdmin, getAdminMetrics);
router.get('/businesses', requireAuth, requireAdmin, getBusinesses);
router.patch('/businesses/:id/status', requireAuth, requireAdmin, updateBusinessStatus);

export default router;
