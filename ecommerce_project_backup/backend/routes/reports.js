// // routes/reports.js
// import express from  'express';

// import { authenticate, authorize } from '../middleware/auth.js';
// import reportController from '../controllers/reportController.js';


// const router = express.Router();
// // Sales Reports
// router.get('/sales/daily', authenticate, authorize(['admin', 'seller']), reportController.getDailySalesReport);
// router.get('/sales/weekly', authenticate, authorize(['admin', 'seller']), reportController.getWeeklySalesReport);
// router.get('/sales/monthly', authenticate, authorize(['admin', 'seller']), reportController.getMonthlySalesReport);
// router.get('/sales/yearly', authenticate, authorize(['admin', 'seller']), reportController.getYearlySalesReport);

// // Product Reports
// router.get('/products/top-selling', authenticate, authorize(['admin', 'seller']), reportController.getTopSellingProducts);
// router.get('/products/performance', authenticate, authorize(['admin', 'seller']), reportController.getProductPerformance);
// router.get('/products/inventory-status', authenticate, authorize(['admin', 'seller']), reportController.getInventoryStatus);

// // Order Reports
// router.get('/orders/summary', authenticate, authorize(['admin', 'seller']), reportController.getOrderSummary);
// router.get('/orders/status-breakdown', authenticate, authorize(['admin', 'seller']), reportController.getOrderStatusBreakdown);

// // User Reports
// router.get('/users/activity', authenticate, authorize(['admin']), reportController.getUserActivity);
// router.get('/users/stats', authenticate, authorize(['admin']), reportController.getUserStats);

// // Coupon Reports
// router.get('/coupons/usage', authenticate, authorize(['admin']), reportController.getCouponUsage);

// // Export Endpoints
// router.get('/export/sales', authenticate, authorize(['admin', 'seller']), reportController.exportSalesReport);
// router.get('/export/orders', authenticate, authorize(['admin', 'seller']), reportController.exportOrderReport);
// router.get('/export/products', authenticate, authorize(['admin', 'seller']), reportController.exportProductReport);
// router.get('/export/inventory', authenticate, authorize(['admin', 'seller']), reportController.exportInventoryReport);
// router.post('/export/custom', authenticate, authorize(['admin', 'seller']), reportController.generateCustomReport);

// // Dashboard Statistics
// router.get('/dashboard/stats', authenticate, authorize(['admin', 'seller']), reportController.getDashboardStats);
// router.get('/dashboard/quick-stats', authenticate, authorize(['admin', 'seller']), reportController.getQuickStats);
// router.get('/dashboard/recent-activity', authenticate, authorize(['admin', 'seller']), reportController.getRecentActivity);

// export default router;




// routes/reports.js
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getDashboardStats,
  getDailySalesReport,
  getWeeklySalesReport,
  getMonthlySalesReport,
  getYearlySalesReport,
  getTopSellingProducts,
  getProductPerformance,
  getInventoryStatus,
  getOrderSummary,
  getOrderStatusBreakdown,
  getUserActivity,
  getUserStats,
  getCouponUsage,
  getQuickStats,
  getRecentActivity,
  exportSalesReport,
  exportOrderReport,
  exportProductReport,
  exportInventoryReport,
  generateCustomReport
} from '../controllers/reportController.js';

const router = express.Router();

// Dashboard Statistics
router.get('/dashboard/stats', authenticate, authorize(['admin', 'seller']), getDashboardStats);
router.get('/dashboard/quick-stats', authenticate, authorize(['admin', 'seller']), getQuickStats);
router.get('/dashboard/recent-activity', authenticate, authorize(['admin', 'seller']), getRecentActivity);

// Sales Reports
router.get('/sales/daily', authenticate, authorize(['admin', 'seller']), getDailySalesReport);
router.get('/sales/weekly', authenticate, authorize(['admin', 'seller']), getWeeklySalesReport);
router.get('/sales/monthly', authenticate, authorize(['admin', 'seller']), getMonthlySalesReport);
router.get('/sales/yearly', authenticate, authorize(['admin', 'seller']), getYearlySalesReport);

// Product Reports
router.get('/products/top-selling', authenticate, authorize(['admin', 'seller']), getTopSellingProducts);
router.get('/products/performance', authenticate, authorize(['admin', 'seller']), getProductPerformance);
router.get('/products/inventory-status', authenticate, authorize(['admin', 'seller']), getInventoryStatus);

// Order Reports
router.get('/orders/summary', authenticate, authorize(['admin', 'seller']), getOrderSummary);
router.get('/orders/status-breakdown', authenticate, authorize(['admin', 'seller']), getOrderStatusBreakdown);

// User Reports
router.get('/users/activity', authenticate, authorize(['admin']), getUserActivity);
router.get('/users/stats', authenticate, authorize(['admin']), getUserStats);

// Coupon Reports
router.get('/coupons/usage', authenticate, authorize(['admin']), getCouponUsage);

// Export Endpoints
router.get('/export/sales', authenticate, authorize(['admin', 'seller']), exportSalesReport);
router.get('/export/orders', authenticate, authorize(['admin', 'seller']), exportOrderReport);
router.get('/export/products', authenticate, authorize(['admin', 'seller']), exportProductReport);
router.get('/export/inventory', authenticate, authorize(['admin', 'seller']), exportInventoryReport);
router.post('/export/custom', authenticate, authorize(['admin', 'seller']), generateCustomReport);

export default router;