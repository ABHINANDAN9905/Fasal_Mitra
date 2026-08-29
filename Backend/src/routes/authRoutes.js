import { Router } from 'express';
import {
  signup,
  login,
  demoLogin,
  getMe,
  logout,
  getDemoFarmers
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/me', getMe);
router.post('/logout', logout);
router.get('/demo-farmers', getDemoFarmers);

export default router;
