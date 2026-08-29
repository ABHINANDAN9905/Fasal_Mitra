import { Router } from 'express';
import { createWhatsAppShare } from '../controllers/notificationController.js';

const router = Router();

router.post('/whatsapp-share', createWhatsAppShare);

export default router;
