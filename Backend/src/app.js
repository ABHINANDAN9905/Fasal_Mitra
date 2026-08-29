import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';

import v1Router from './routes/v1Router.js';
import priceRoutes from './routes/priceRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import merchantRoutes from './routes/merchantRoutes.js';
import { health } from './controllers/priceController.js';
import { getStates, getDistrictsForState } from './controllers/locationController.js';

const app = express();

// 1. Security & Performance Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  env.frontendUrl
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching origins
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in development
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Health check route
app.get('/health', health);
app.get('/api/health', health);

// 3. Direct /api routes matching user requirement specifications
app.get('/api/states', getStates);
app.get('/api/states/:state/districts', getDistrictsForState);
app.use('/api/crops', cropRoutes);
app.use('/api/mandis', mandiRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api', priceRoutes);

// 4. API Versioned Routes (/api/v1/...)
app.use('/api/v1', v1Router);

// 5. 404 Catch-all Handler
app.use((req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: [${req.method}] ${req.originalUrl}`
  });
});

// 6. Global Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

export default app;
