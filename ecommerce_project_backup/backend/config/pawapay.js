export const pawapayConfig = {
  baseUrl: process.env.PAWAPAY_BASE_URL || 'https://api.pawapay.cloud',
  apiKey: process.env.PAWAPAY_API_KEY || 'mock_api_key_for_development',
  secretKey: process.env.PAWAPAY_SECRET_KEY || 'mock_secret_key_for_development',
  merchantId: process.env.PAWAPAY_MERCHANT_ID || 'mock_merchant_id',
  webhookSecret: process.env.PAWAPAY_WEBHOOK_SECRET || 'mock_webhook_secret',
  
  // Supported payment methods - use lowercase keys that match frontend
  paymentMethods: {
    'momo': 'MTN Mobile Money',
    'airtel_money': 'Airtel Money',
    'mpesa': 'M-Pesa',
    'orange_money': 'Orange Money',
    'tigo_pesa': 'Tigo Pesa',
    'vodacom_mpesa': 'Vodacom M-Pesa'
  },
  
  // Country codes for payment methods
  countries: {
    RWANDA: 'RW',
    KENYA: 'KE',
    TANZANIA: 'TZ',
    UGANDA: 'UG',
    GHANA: 'GH'
  }
};