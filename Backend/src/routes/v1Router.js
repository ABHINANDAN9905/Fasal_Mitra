import { Router } from 'express';
import priceRoutes from './priceRoutes.js';
import mandiRoutes from './mandiRoutes.js';
import cropRoutes from './cropRoutes.js';
import locationRoutes from './locationRoutes.js';
import aiRoutes from './aiRoutes.js';
import weatherRoutes from './weatherRoutes.js';
import logisticsRoutes from './logisticsRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import authRoutes from './authRoutes.js';
import merchantRoutes from './merchantRoutes.js';

const v1Router = Router();

v1Router.use('/merchant', merchantRoutes);
v1Router.use('/auth', authRoutes);
v1Router.use('/prices', priceRoutes);
v1Router.use('/mandis', mandiRoutes);
v1Router.use('/crops', cropRoutes);
v1Router.use('/locations', locationRoutes);
v1Router.use('/ai', aiRoutes);
v1Router.use('/weather', weatherRoutes);
v1Router.use('/logistics', logisticsRoutes);
v1Router.use('/notifications', notificationRoutes);

export default v1Router;
