import { Router } from 'express';
import { placeBet } from '../controllers/betController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', authMiddleware, placeBet);

export default router;
