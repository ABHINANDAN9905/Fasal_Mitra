import { Router } from 'express';
import { getMandis, getMandiDetails } from '../controllers/mandiController.js';

const router = Router();

router.get('/', getMandis);
router.get('/nearby', getMandis);
router.get('/:id', getMandiDetails);

export default router;
