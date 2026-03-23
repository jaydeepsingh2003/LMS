import { Router } from 'express';
import * as aiController from './ai.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/ask', authMiddleware, aiController.askQuestion);

export default router;
