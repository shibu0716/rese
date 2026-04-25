import { Router } from 'express';
import { getOwnerPanel, updateOwnerSettings } from '../controllers/ownerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ownerMiddleware } from '../middleware/ownerMiddleware.js';

const router = Router();

router.get('/panel', authMiddleware, ownerMiddleware, getOwnerPanel);
router.put('/settings', authMiddleware, ownerMiddleware, updateOwnerSettings);

export default router;
