import { Router } from 'express';
import * as videoController from './video.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/', videoController.listVideos);
router.get('/discover', videoController.listVideos);
router.get('/:videoId', authMiddleware, videoController.getVideoDetails);
router.post('/:videoId/progress', authMiddleware, videoController.updateProgress);

export default router;
