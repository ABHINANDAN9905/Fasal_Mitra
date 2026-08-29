import express from 'express'
import cors from 'cors'
import priceRoutes from './routes/priceRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', priceRoutes)

export default app
