import { Router } from 'express';
import {
  loginMerchantHandler,
  getBulletinsHandler,
  updatePriceHandler,
  getProfileHandler,
  deleteBulletinHandler
} from '../controllers/merchantController.js';

const router = Router();

router.post('/login', loginMerchantHandler);
router.get('/bulletins', getBulletinsHandler);
router.post('/prices/update', updatePriceHandler);
router.get('/profile', getProfileHandler);
router.post('/prices/reset', deleteBulletinHandler);

export default router;
