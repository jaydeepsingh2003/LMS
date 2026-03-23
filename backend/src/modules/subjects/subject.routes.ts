import { Router } from 'express';
import * as subjectController from './subject.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/', subjectController.listSubjects);
router.get('/:subjectId/tree', authMiddleware, subjectController.getSubjectTree);
router.post('/:subjectId/enroll', authMiddleware, subjectController.enrollUser);
router.get('/explore', authMiddleware, subjectController.exploreDiscovery);
router.get('/preview-youtube', authMiddleware, subjectController.previewYouTube);
router.post('/import-youtube', authMiddleware, subjectController.importFromYouTube);

export default router;
