import { Router } from 'express';
import { listMatches } from '../controllers/matchController.js';

const router = Router();
router.get('/', listMatches);

export default router;
