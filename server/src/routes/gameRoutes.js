import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { coinFlip, crash, dice } from '../controllers/gameController.js';

const router = Router();
router.post('/coinflip', authMiddleware, coinFlip);
router.post('/dice', authMiddleware, dice);
router.post('/crash', authMiddleware, crash);

export default router;
