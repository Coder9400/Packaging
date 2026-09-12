import { Router } from 'express';
import {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
} from '../controllers/requestController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createRequest);
router.get('/sent', requireAuth, getSentRequests);
router.get('/received', requireAuth, getReceivedRequests);
router.post('/:id/accept', requireAuth, acceptRequest);
router.patch('/:id/accept', requireAuth, acceptRequest);
router.post('/:id/reject', requireAuth, rejectRequest);
router.patch('/:id/reject', requireAuth, rejectRequest);

export default router;
