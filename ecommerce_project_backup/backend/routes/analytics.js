// backend/routes/analytics.js
import express from 'express';
import { getSellerAnalytics, getAdminAnalytics } from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/seller', authenticate, authorize('seller', 'admin'), getSellerAnalytics);
router.get('/admin', authenticate, authorize('admin'), getAdminAnalytics);

export default router;