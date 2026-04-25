import { Router } from 'express';
import { getHistory, getProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/profile', authMiddleware, getProfile);
router.get('/history', authMiddleware, getHistory);

export default router;
