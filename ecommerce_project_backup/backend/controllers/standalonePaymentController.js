import pool from '../config/database.js';
import pawapayService from '../services/pawapayService.js';
import { pawapayConfig } from '../config/pawapay.js';

export const initiateStandalonePayment = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { provider, phoneNumber, amount, country = 'RW' } = req.body;
    const userId = req.user.id;

    console.log('🚀 Initiating standalone PawaPay payment:', { 
      provider, 
      phoneNumber, 
      amount, 
      userId,
      country 
    });

    // Validate required fields
    if (!provider || !phoneNumber || !amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: provider, phoneNumber, amount' 
      });
    }

    // Validate amount
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid amount. Must be greater than 0' 
      });
    }

    // Validate payment method
    const supportedMethods = Object.keys(pawapayConfig.paymentMethods);
    if (!supportedMethods.includes(provider)) {
      return res.status(400).json({ 
        success: false,
        message: 'Unsupported payment method',
        supportedMethods 
      });
    }

    // Get user information
    const [users] = await connection.execute(
      'SELECT email, username FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const user = users[0];

    // Generate unique merchant reference
    const merchantReference = `STANDALONE_${userId}_${Date.now()}`;
    
    // Format phone number for PawaPay
    const formattedPhone = formatPhoneForPawaPay(phoneNumber, country);

    // Prepare payment data for PawaPay
    const paymentData = {
      amount: paymentAmount,
      currency: 'USD',
      paymentMethod: provider,
      phone: formattedPhone,
      email: user.email,
      customerName: user.username,
      merchantReference: merchantReference,
      userId: userId,
      description: `Payment of ${paymentAmount} USD via ${provider}`
    };

    console.log('📦 Sending standalone payment request to PawaPay:', paymentData);

    // Create payment request with PawaPay
    const paymentResponse = await pawapayService.createPaymentRequest(paymentData);

    // Store transaction record in database
    const [transactionResult] = await connection.execute(
      `INSERT INTO transactions 
       (user_id, provider, amount, currency, phone_number, status, merchant_reference, transaction_id, provider_response) 
       VALUES (?, ?, ?, ?, ?, 'processing', ?, ?, ?)`,
      [
        userId,
        provider,
        paymentAmount,
        'USD',
        formattedPhone,
        merchantReference,
        paymentResponse.transactionId || `mock_tx_${Date.now()}`,
        JSON.stringify(paymentResponse)
      ]
    );

    await connection.commit();
    
    console.log('✅ Standalone payment initiated successfully:', {
      transactionId: transactionResult.insertId,
      merchantReference,
      pawaPayTransactionId: paymentResponse.transactionId
    });

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      transaction: {
        transactionId: transactionResult.insertId,
        pawaPayTransactionId: paymentResponse.transactionId,
        merchantReference: merchantReference,
        status: paymentResponse.status || 'processing',
        instructions: paymentResponse.instructions || 'Check your mobile device for payment request',
        amount: paymentAmount,
        currency: 'USD',
        phoneNumber: formattedPhone,
        provider: provider
      },
      nextSteps: [
        'Check your mobile device for payment request',
        'Payment status will update automatically',
        'You can check status anytime'
      ]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Standalone payment initiation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to initiate payment', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// Helper function to format phone numbers for PawaPay
export function formatPhoneForPawaPay(phone, countryCode = 'RW') {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle empty string
  if (!cleaned) return '';
  
  // Handle country codes
  switch (countryCode) {
    case 'RW': // Rwanda
      if (cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '250' + cleaned.substring(1);
      } else if (cleaned.startsWith('7') && cleaned.length === 9) {
        cleaned = '250' + cleaned;
      } else if (cleaned.startsWith('25') && cleaned.length === 12) {
        // Already in correct format
      } else if (!cleaned.startsWith('250') && cleaned.length === 9) {
        cleaned = '250' + cleaned;
      }
      break;
      
    case 'KE': // Kenya
      if (cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '254' + cleaned.substring(1);
      } else if (cleaned.startsWith('7') && cleaned.length === 9) {
        cleaned = '254' + cleaned;
      }
      break;
      
    case 'UG': // Uganda
      if (cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '256' + cleaned.substring(1);
      } else if (cleaned.startsWith('7') && cleaned.length === 9) {
        cleaned = '256' + cleaned;
      }
      break;
      
    case 'TZ': // Tanzania
      if (cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '255' + cleaned.substring(1);
      } else if ((cleaned.startsWith('6') || cleaned.startsWith('7')) && cleaned.length === 9) {
        cleaned = '255' + cleaned;
      }
      break;
      
    case 'GH': // Ghana
      if (cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '233' + cleaned.substring(1);
      } else if (cleaned.startsWith('5') && cleaned.length === 9) {
        cleaned = '233' + cleaned;
      }
      break;
      
    default:
      // Keep as is
      break;
  }
  
  return '+' + cleaned;
}

// Handle standalone payment webhook
export const handleStandalonePaymentWebhook = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const signature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];
    const webhookPayload = req.body;

    console.log('🔄 Standalone Payment Webhook Received:', {
      signature: signature ? 'Present' : 'Missing',
      timestamp,
      event: webhookPayload.event
    });

    // Log webhook for debugging
    await connection.execute(
      `INSERT INTO pawawebhook_logs (webhook_id, event_type, merchant_reference, transaction_id, payload) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        webhookPayload.id || `webhook_${Date.now()}`,
        webhookPayload.event,
        webhookPayload.data?.merchantReference,
        webhookPayload.data?.transactionId,
        JSON.stringify(webhookPayload)
      ]
    );

    // Validate webhook signature (for production)
    if (process.env.NODE_ENV === 'production') {
      const isValid = await pawapayService.validateWebhookSignature(
        webhookPayload,
        signature,
        timestamp
      );
      
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        await connection.rollback();
        connection.release();
        return res.status(401).json({ success: false, message: 'Invalid signature' });
      }
    }

    const { event, data } = webhookPayload;

    console.log(`📦 Processing standalone webhook event: ${event}`, data);

    // Find transaction by merchant reference
    const [transactions] = await connection.execute(
      'SELECT * FROM transactions WHERE merchant_reference = ?',
      [data.merchantReference]
    );

    if (transactions.length === 0) {
      console.error('❌ Transaction not found for webhook:', data.merchantReference);
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const transaction = transactions[0];

    // Update transaction status based on webhook event
    let transactionStatus = 'pending';
    
    switch (event) {
      case 'payment.completed':
        transactionStatus = 'completed';
        console.log(`✅ Payment completed for transaction ${transaction.id}`);
        break;
        
      case 'payment.failed':
        transactionStatus = 'failed';
        console.log(`❌ Payment failed for transaction ${transaction.id}`);
        break;
        
      case 'payment.cancelled':
        transactionStatus = 'cancelled';
        console.log(`🚫 Payment cancelled for transaction ${transaction.id}`);
        break;
        
      case 'payment.processing':
        transactionStatus = 'processing';
        console.log(`🔄 Payment processing for transaction ${transaction.id}`);
        break;
        
      default:
        console.log(`❓ Unhandled webhook event: ${event}`);
        transactionStatus = transaction.status; // Keep current status
    }

    // Update transaction record
    await connection.execute(
      `UPDATE transactions 
       SET status = ?, provider_response = ?, updated_at = NOW(), transaction_id = ?
       WHERE id = ?`,
      [
        transactionStatus,
        JSON.stringify(webhookPayload),
        data.transactionId || transaction.transaction_id,
        transaction.id
      ]
    );

    // Mark webhook as processed
    await connection.execute(
      'UPDATE pawawebhook_logs SET processed = TRUE WHERE merchant_reference = ?',
      [data.merchantReference]
    );

    await connection.commit();
    console.log(`✅ Standalone webhook processed successfully for transaction ${transaction.id}`);

    res.json({ 
      success: true, 
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('💥 Standalone webhook processing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Webhook processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// Check transaction status
export const checkTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    console.log('🔍 Checking transaction status:', transactionId);

    // Get transaction from database
    const [transactions] = await pool.execute(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, userId]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaction not found' 
      });
    }

    const transaction = transactions[0];

    // If transaction is still processing, check with PawaPay
    if (transaction.status === 'processing' || transaction.status === 'pending') {
      try {
        console.log('🔄 Checking transaction status with PawaPay:', transaction.merchant_reference);
        
        const statusResponse = await pawapayService.checkPaymentStatus(
          transaction.merchant_reference
        );

        if (statusResponse.status !== transaction.status) {
          // Update transaction status if changed
          await pool.execute(
            'UPDATE transactions SET status = ?, updated_at = NOW() WHERE id = ?',
            [statusResponse.status, transaction.id]
          );
          
          transaction.status = statusResponse.status;
          console.log(`✅ Transaction status updated to: ${statusResponse.status}`);
        }
      } catch (error) {
        console.error('Error checking PawaPay status:', error.message);
        // Continue with stored status
      }
    }

    // Parse provider response
    let providerResponse = {};
    try {
      if (transaction.provider_response) {
        providerResponse = JSON.parse(transaction.provider_response);
      }
    } catch (e) {
      console.error('Error parsing provider response:', e);
    }

    res.json({
      success: true,
      transaction: {
        id: transaction.id,
        provider: transaction.provider,
        amount: transaction.amount,
        currency: transaction.currency,
        phoneNumber: transaction.phone_number,
        status: transaction.status,
        merchantReference: transaction.merchant_reference,
        transactionId: transaction.transaction_id,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
        providerResponse: providerResponse
      }
    });

  } catch (error) {
    console.error('Check transaction status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to check transaction status', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// // Get user's transaction history
// export const getTransactionHistory = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { limit = 20, offset = 0, status } = req.query;

//     let query = 'SELECT * FROM transactions WHERE user_id = ?';
//     const params = [userId];

//     if (status) {
//       query += ' AND status = ?';
//       params.push(status);
//     }

//     query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
//     params.push(parseInt(limit), parseInt(offset));

//     const [transactions] = await pool.execute(query, params);

//     // Get total count
//     const [countResult] = await pool.execute(
//       'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?',
//       [userId]
//     );

//     res.json({
//       success: true,
//       transactions: transactions.map(tx => ({
//         id: tx.id,
//         provider: tx.provider,
//         amount: tx.amount,
//         currency: tx.currency,
//         phoneNumber: tx.phone_number,
//         status: tx.status,
//         merchantReference: tx.merchant_reference,
//         createdAt: tx.created_at,
//         updatedAt: tx.updated_at
//       })),
//       pagination: {
//         total: countResult[0].total,
//         limit: parseInt(limit),
//         offset: parseInt(offset)
//       }
//     });

//   } catch (error) {
//     console.error('Get transaction history error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch transaction history', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };


export const getTransactionHistory = async (req, res) => {
  console.log('📊 Fetching transaction history for user:', req.user.id);
  
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0, status } = req.query;

    console.log('Query params:', { limit, offset, status });

    // Validate parameters
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid limit parameter. Must be between 1 and 100' 
      });
    }

    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid offset parameter. Must be >= 0' 
      });
    }

    // Build query
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (status && ['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offsetNum);

    console.log('Executing query:', query);
    console.log('With params:', params);

    // Execute query
    const [transactions] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
    const countParams = [userId];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);

    console.log(`Found ${transactions.length} transactions`);

    res.json({
      success: true,
      transactions: transactions.map(tx => ({
        id: tx.id,
        provider: tx.provider,
        amount: tx.amount,
        currency: tx.currency,
        phoneNumber: tx.phone_number,
        status: tx.status,
        merchantReference: tx.merchant_reference,
        transactionId: tx.transaction_id,
        createdAt: tx.created_at,
        updatedAt: tx.updated_at
      })),
      pagination: {
        total: countResult[0].total || 0,
        limit: limitNum,
        offset: offsetNum
      }
    });

  } catch (error) {
    console.error('💥 Get transaction history error:', error);
    console.error('Error stack:', error.stack);
    
    // Check if it's a database connection error
    if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        success: false,
        message: 'Database connection error. Please try again later.' 
      });
    }
    
    // Check if it's a table doesn't exist error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('❌ Transactions table does not exist!');
      return res.status(500).json({ 
        success: false,
        message: 'Database configuration error. Transactions table missing.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'System error'
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch transaction history', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get supported providers for a country
export const getSupportedProviders = async (req, res) => {
  try {
    const { country = 'RW' } = req.query;
    
    console.log('🌍 Getting supported providers for:', country);

    // Get supported methods from PawaPay
    const supportedMethods = await pawapayService.getSupportedPaymentMethods(country);

    // Map to provider information
    const providers = supportedMethods.map(method => {
      const config = pawapayConfig.paymentMethods[method] || method;
      return {
        id: method,
        name: typeof config === 'string' ? config : config.name,
        icon: typeof config === 'object' ? config.icon : getProviderIcon(method),
        countries: typeof config === 'object' ? config.countries : [country],
        minAmount: typeof config === 'object' ? config.minAmount : 0.1,
        maxAmount: typeof config === 'object' ? config.maxAmount : 10000
      };
    });

    res.json({
      success: true,
      country,
      providers,
      defaultCurrency: 'USD'
    });

  } catch (error) {
    console.error('Get supported providers error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get supported providers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

function getProviderIcon(provider) {
  const icons = {
    momo: '📱',
    airtel_money: '💳',
    mpesa: '💰',
    orange_money: '🍊',
    tigo_pesa: '🐯',
    vodacom_mpesa: '📶'
  };
  return icons[provider] || '💸';
}