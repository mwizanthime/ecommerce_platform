// // backend/routes/delivery.js
// import express from 'express';
// import {
//   initiateDelivery,
//   updateDeliveryStatus,
//   verifyDeliveryWithOTP,
//   uploadDeliveryProof,
//   getDeliveryProofs,
//   recordDeliveryAttempt
// } from '../controllers/deliveryController.js';
// import { authenticate, authorize } from '../middleware/auth.js';
// import upload from '../middleware/upload.js';

// const router = express.Router();

// // Seller and admin routes for managing delivery
// router.post('/orders/:orderId/ship', authenticate, authorize(['seller', 'admin']), initiateDelivery);
// router.patch('/tracking/:trackingId/status', authenticate, authorize(['seller', 'admin']), updateDeliveryStatus);
// router.post('/tracking/:trackingId/attempt', authenticate, authorize(['seller', 'admin']), recordDeliveryAttempt);

// // Delivery person routes
// router.post('/orders/:orderId/verify-otp', authenticate, authorize(['delivery', 'admin']), verifyDeliveryWithOTP);
// router.post('/orders/:orderId/proof', authenticate, authorize(['delivery', 'admin']), upload.single('proofFile'), uploadDeliveryProof);

// // Customer, seller, and admin routes for viewing proofs
// router.get('/orders/:orderId/proofs', authenticate, authorize(['customer', 'seller', 'admin']), getDeliveryProofs);

// export default router;





// backend/routes/delivery.js
import express from 'express';
import {
  initiateDelivery,
  updateDeliveryStatus,
  verifyDeliveryWithOTP,
  uploadDeliveryProof,
  getDeliveryProofs,
  recordDeliveryAttempt
} from '../controllers/deliveryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Seller and admin routes for managing delivery
router.post('/orders/:orderId/ship', authenticate, authorize(['seller', 'admin']), initiateDelivery);
router.patch('/tracking/:trackingId/status', authenticate, authorize(['seller', 'admin']), updateDeliveryStatus);
router.post('/tracking/:trackingId/attempt', authenticate, authorize(['seller', 'admin']), recordDeliveryAttempt);

// Delivery person routes
router.post('/orders/:orderId/verify-otp', authenticate, authorize(['delivery', 'admin']), verifyDeliveryWithOTP);
router.post('/orders/:orderId/proof', authenticate, authorize(['delivery', 'admin']), upload.single('proofFile'), uploadDeliveryProof);

// Customer, seller, and admin routes for viewing proofs
router.get('/orders/:orderId/proofs', authenticate, getDeliveryProofs);
router.get('/orders/:orderId/tracking', authenticate, getDeliveryProofs);

export default router;