import { Router } from 'express';
import { getOwnerPanel, updateOwnerSettings } from '../controllers/ownerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ownerMiddleware } from '../middleware/ownerMiddleware.js';

const router = Router();
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.get('/panel', authMiddleware, asyncRoute(ownerMiddleware), asyncRoute(getOwnerPanel));
router.put('/settings', authMiddleware, asyncRoute(ownerMiddleware), asyncRoute(updateOwnerSettings));

export default router;
