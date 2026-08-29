import { Router } from 'express';
import { getStates, getDistrictsForState } from '../controllers/locationController.js';

const router = Router();

router.get('/states', getStates);
router.get('/states/:state/districts', getDistrictsForState);

export default router;
