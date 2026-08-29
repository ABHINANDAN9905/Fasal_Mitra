import { Router } from 'express';
import multer from 'multer';
import { diagnoseDiseaseHandler, parseVoiceQueryHandler } from '../controllers/aiController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

router.post('/diagnose-crop', upload.single('image'), diagnoseDiseaseHandler);
router.post('/voice-intent', parseVoiceQueryHandler);

export default router;
