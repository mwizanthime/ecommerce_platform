import express from 'express';
import {
  initiateStandalonePayment,
  handleStandalonePaymentWebhook,
  checkTransactionStatus,
  getTransactionHistory,
  getSupportedProviders
} from '../controllers/standalonePaymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// User routes (require authentication)
router.post('/initiate', authenticate, initiateStandalonePayment);
router.get('/status/:transactionId', authenticate, checkTransactionStatus);
router.get('/history', authenticate, getTransactionHistory);
router.get('/providers', authenticate, getSupportedProviders);

// Webhook routes (no authentication required)
router.post('/webhook', handleStandalonePaymentWebhook);

export default router;