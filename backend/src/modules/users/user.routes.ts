import { Router } from 'express';
import * as userController from './user.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', authMiddleware, userController.getProfile);

export default router;
