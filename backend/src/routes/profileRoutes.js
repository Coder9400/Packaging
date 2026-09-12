import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getProfile);
router.get('/:companyId', requireAuth, getProfile);
router.patch('/', requireAuth, updateProfile);
router.put('/', requireAuth, updateProfile);
router.put('/:companyId', requireAuth, updateProfile);

export default router;
