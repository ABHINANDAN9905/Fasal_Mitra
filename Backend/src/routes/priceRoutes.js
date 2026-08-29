import { Router } from 'express'
import { health, prices } from '../controllers/priceController.js'

const router = Router()
router.get('/health', health)
router.get('/prices', prices)

export default router
