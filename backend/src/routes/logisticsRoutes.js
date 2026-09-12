import { Router } from 'express';
import {
  getActiveShipments,
  getCompletedShipments,
  getRouteOptimization,
  updateShipmentStatus,
} from '../controllers/logisticsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/active', requireAuth, getActiveShipments);
router.get('/completed', requireAuth, getCompletedShipments);
router.get('/optimization', requireAuth, getRouteOptimization);
router.patch('/shipments/:id/status', requireAuth, updateShipmentStatus);

export default router;
