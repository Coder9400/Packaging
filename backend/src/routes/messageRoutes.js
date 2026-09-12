import { Router } from 'express';
import {
  getConversations,
  getMessages,
  createConversation,
  sendMessage,
} from '../controllers/messageController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/conversations', requireAuth, getConversations);
router.post('/conversations', requireAuth, createConversation);
router.get('/conversations/:conversationId', requireAuth, getMessages);
router.get('/:conversationId', requireAuth, getMessages);
router.post('/conversations/:conversationId/messages', requireAuth, sendMessage);
router.post('/', requireAuth, sendMessage);

export default router;
