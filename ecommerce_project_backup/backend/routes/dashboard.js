// backend/routes/dashboard.js
import express from 'express';
import {
  getAdminDashboard,
  getSellerDashboard,
  getCustomerDashboard
} from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', authenticate, authorize('admin'), getAdminDashboard);
router.get('/seller', authenticate, authorize('seller'), getSellerDashboard);
router.get('/customer', authenticate, getCustomerDashboard);

export default router;