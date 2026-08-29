import { Router } from 'express';
import { health, prices, comparePricesHandler } from '../controllers/priceController.js';
import { calculateNetReturnHandler, getHistoricalTrendsHandler } from '../controllers/calculationController.js';

const router = Router();

router.get('/health', health);
router.get('/prices', prices);
router.get('/realtime', prices);
router.get('/compare', comparePricesHandler);
router.post('/compare', comparePricesHandler);
router.post('/calculate-net-return', calculateNetReturnHandler);
router.get('/historical-trends', getHistoricalTrendsHandler);

export default router;
