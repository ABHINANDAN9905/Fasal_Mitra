import { Router } from 'express';
import { getVehicles, getQuote } from '../controllers/logisticsController.js';

const router = Router();

router.get('/vehicles', getVehicles);
router.post('/quote', getQuote);

export default router;
