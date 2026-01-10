// // backend/routes/payments.js
// import express from 'express';
// import {
//   initiatePawaPayPayment,
//   handlePawaPayWebhook,
//   checkPaymentStatus,
//   getSupportedPaymentMethods
// } from '../controllers/paymentController.js';
// import { authenticate } from '../middleware/auth.js';

// const router = express.Router();

// // Customer routes
// router.post('/pawapay/initiate', authenticate, initiatePawaPayPayment);
// router.get('/status/:orderId', authenticate, checkPaymentStatus);
// router.get('/methods', authenticate, getSupportedPaymentMethods);

// // Webhook routes (no authentication required for webhooks)
// router.post('/pawapay/webhook', handlePawaPayWebhook);

// export default router;



// import express from 'express';
// import {
//   initiatePayment,
//   handlePaymentWebhook,
//   checkPaymentStatus,
//   getPaymentHistory,
//   getSupportedPaymentMethods
// } from '../controllers/paymentController.js';
// import { authenticate } from '../middleware/auth.js';

// const router = express.Router();

// // Unified payment routes
// router.post('/initiate', authenticate, initiatePayment);
// router.get('/status/:type/:id', authenticate, checkPaymentStatus);
// router.get('/history', authenticate, getPaymentHistory);
// router.get('/methods', authenticate, getSupportedPaymentMethods);

// // Webhook routes (no authentication required)
// router.post('/webhook', handlePaymentWebhook);

// // Legacy endpoints for backward compatibility
// router.get('/order/:orderId', authenticate, (req, res) => checkPaymentStatus(req, res));
// router.get('/transaction/:paymentId', authenticate, (req, res) => checkPaymentStatus(req, res));

// export default router;



// backend/routes/payments.js
import express from 'express';
import {
  initiatePayment,
  handlePaymentWebhook,
  checkPaymentStatus,
  getPaymentHistory,checkExistingPayment,
  getSupportedPaymentMethods,testPaymentSetup,mockWebhook,syncPaymentData
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Unified payment routes
router.post('/initiate', authenticate, initiatePayment);
router.get('/status/:type/:id', authenticate, checkPaymentStatus);
router.get('/history', authenticate, getPaymentHistory);
router.get('/methods', authenticate, getSupportedPaymentMethods);

// Webhook routes (no authentication required)
router.post('/webhook', handlePaymentWebhook);

// Legacy endpoints for backward compatibility
router.get('/order/:orderId', authenticate, (req, res) => {
  req.params.type = 'order';
  req.params.id = req.params.orderId;
  checkPaymentStatus(req, res);
});

router.get('/transaction/:paymentId', authenticate, (req, res) => {
  req.params.type = 'payment';
  req.params.id = req.params.paymentId;
  checkPaymentStatus(req, res);
});

// Additional endpoints for frontend
router.get('/deposit/:depositId', authenticate, async (req, res) => {
  try {
    const { depositId } = req.params;
    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE deposit_id = ? AND user_id = ?',
      [depositId, req.user.id]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    res.json({ success: true, payment: payments[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/test', authenticate, testPaymentSetup);
router.post('/mock-webhook', mockWebhook);
router.post('/sync', authenticate, syncPaymentData);
router.get('/check/:orderId', authenticate, checkExistingPayment);

export default router;