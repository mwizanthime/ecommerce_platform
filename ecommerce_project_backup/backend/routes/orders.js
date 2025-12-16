// backend/routes/orders.js 
import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderTracking,
  getSellerOrders,
  getSellerOrderStats,
  markOrderAsPaid,
  getSellerOrder,
  getSellerOrderDetail,
  updateOrderItemStatus,
  checkAndUpdateOrderStatus,
  checkProductPurchase 
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js'; // Only import authenticate

const router = express.Router();

// Customer routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/cancel', authenticate, cancelOrder);
router.get('/:id/tracking', authenticate, getOrderTracking);

// Admin routes - temporarily remove authorize
// router.put('/:id/status', authenticate, updateOrderStatus);
router.patch('/seller/orders/:orderId/status', authenticate, updateOrderStatus);

// Seller routes - temporarily remove authorize
router.get('/seller/orders', authenticate, getSellerOrders);
router.get('/seller/orders/:orderId', authenticate, getSellerOrder);
router.get('/seller/orders/:orderId', authenticate, getSellerOrderDetail);
router.patch('/seller/orders/:orderId/mark-paid', authenticate, markOrderAsPaid);
router.get('/seller/orders/stats', authenticate, getSellerOrderStats);
// In your orders routes file
router.patch('/:orderId/check-status', authenticate, checkAndUpdateOrderStatus);
router.patch('/seller/order-items/:orderItemId/status', authenticate, updateOrderItemStatus);


router.get('/check-purchase/:productId', authenticate, checkProductPurchase);



export default router;