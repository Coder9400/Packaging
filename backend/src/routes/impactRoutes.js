import { Router } from 'express';
import { getImpactSummary } from '../controllers/impactController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/summary', requireAuth, getImpactSummary);
router.get('/metrics', requireAuth, getImpactSummary);

export default router;
