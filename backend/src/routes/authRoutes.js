import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/signup', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export default router;
