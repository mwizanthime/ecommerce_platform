// // // backend/controllers/paymentController.js
// // import pool from '../config/database.js';
// // import pawapayService from '../services/pawapayService.js';
// // import { pawapayConfig } from '../config/pawapay.js';

// // export const initiatePawaPayPayment = async (req, res) => {
// //   const connection = await pool.getConnection();
  
// //   try {
// //     await connection.beginTransaction();

// //     const { orderId, paymentMethod, phoneNumber } = req.body;
// //     const userId = req.user.id;

// //     // Get order details
// //     const [orders] = await connection.execute(
// //       `SELECT o.*, u.email, u.first_name, u.last_name 
// //        FROM orders o 
// //        JOIN users u ON o.user_id = u.id 
// //        WHERE o.id = ? AND o.user_id = ?`,
// //       [orderId, userId]
// //     );

// //     if (orders.length === 0) {
// //       
// //       return res.status(404).json({ message: 'Order not found' });
// //     }

// //     const order = orders[0];
    
// //     // Validate payment method
// //     const supportedMethods = Object.values(pawapayConfig.paymentMethods);
// //     if (!supportedMethods.includes(paymentMethod)) {
// //       
// //       return res.status(400).json({ 
// //         message: 'Unsupported payment method',
// //         supportedMethods 
// //       });
// //     }

// //     // Generate unique merchant reference
// //     const merchantReference = `ORD${orderId}_${Date.now()}`;

// //     // Prepare payment data for PawaPay
// //     const paymentData = {
// //       amount: order.total_amount,
// //       currency: 'USD',
// //       paymentMethod: paymentMethod,
// //       phone: phoneNumber,
// //       email: order.email,
// //       customerName: `${order.first_name} ${order.last_name}`,
// //       merchantReference: merchantReference,
// //       orderId: orderId,
// //       orderNumber: order.order_number,
// //       userId: userId,
// //       description: `Payment for order ${order.order_number}`
// //     };

// //     // Create payment request with PawaPay
// //     const paymentResponse = await pawapayService.createPaymentRequest(paymentData);

// //     // Store payment record in database
// //     await connection.execute(
// //       `INSERT INTO payments 
// //        (order_id, user_id, payment_method, amount, merchant_reference, 
// //         transaction_id, status, provider_response, created_at) 
// //        VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
// //       [
// //         orderId,
// //         userId,
// //         paymentMethod,
// //         order.total_amount,
// //         merchantReference,
// //         paymentResponse.transactionId,
// //         JSON.stringify(paymentResponse)
// //       ]
// //     );

// //     // Update order payment status
// //     await connection.execute(
// //       'UPDATE orders SET payment_status = ? WHERE id = ?',
// //       ['processing', orderId]
// //     );

// //     
// //     res.json({
// //       success: true,
// //       message: 'Payment initiated successfully',
// //       payment: {
// //         transactionId: paymentResponse.transactionId,
// //         merchantReference: merchantReference,
// //         paymentUrl: paymentResponse.paymentUrl, // If PawaPay returns a payment URL
// //         status: paymentResponse.status,
// //         instructions: paymentResponse.instructions // Any specific payment instructions
// //       }
// //     });

// //   } catch (error) {
// //     
// //     console.error('Payment initiation error:', error);
// //     res.status(500).json({ 
// //       message: 'Failed to initiate payment', 
// //       error: error.message 
// //     });
// //   } finally {
// //     connection.release();
// //   }
// // };

// // export const handlePawaPayWebhook = async (req, res) => {
// //   const connection = await pool.getConnection();
  
// //   try {
// //     await connection.beginTransaction();

// //     const signature = req.headers['x-signature'];
// //     const timestamp = req.headers['x-timestamp'];
// //     const webhookPayload = req.body;

// //     // Validate webhook signature
// //     const isValid = pawapayService.validateWebhookSignature(
// //       webhookPayload, 
// //       signature, 
// //       timestamp
// //     );

// //     if (!isValid) {
// //       return res.status(401).json({ message: 'Invalid signature' });
// //     }

// //     const { event, data } = webhookPayload;

// //     // Find payment record
// //     const [payments] = await connection.execute(
// //       'SELECT * FROM payments WHERE merchant_reference = ? OR transaction_id = ?',
// //       [data.merchantReference, data.transactionId]
// //     );

// //     if (payments.length === 0) {
// //       
// //       return res.status(404).json({ message: 'Payment not found' });
// //     }

// //     const payment = payments[0];

// //     // Update payment status based on webhook event
// //     let paymentStatus = 'pending';
// //     let orderPaymentStatus = 'pending';

// //     switch (event) {
// //       case 'payment.completed':
// //         paymentStatus = 'completed';
// //         orderPaymentStatus = 'paid';
// //         break;
// //       case 'payment.failed':
// //         paymentStatus = 'failed';
// //         orderPaymentStatus = 'failed';
// //         break;
// //       case 'payment.cancelled':
// //         paymentStatus = 'cancelled';
// //         orderPaymentStatus = 'cancelled';
// //         break;
// //       default:
// //         paymentStatus = 'pending';
// //     }

// //     // Update payment record
// //     await connection.execute(
// //       `UPDATE payments 
// //        SET status = ?, provider_response = ?, updated_at = NOW() 
// //        WHERE id = ?`,
// //       [paymentStatus, JSON.stringify(webhookPayload), payment.id]
// //     );

// //     // Update order payment status
// //     await connection.execute(
// //       'UPDATE orders SET payment_status = ? WHERE id = ?',
// //       [orderPaymentStatus, payment.order_id]
// //     );

// //     // If payment completed, update order status to confirmed
// //     if (event === 'payment.completed') {
// //       await connection.execute(
// //         'UPDATE orders SET status = ? WHERE id = ?',
// //         ['confirmed', payment.order_id]
// //       );

// //       // Add tracking history
// //       await connection.execute(
// //         `INSERT INTO tracking_history 
// //          (order_id, status, description, location, updated_by) 
// //          VALUES (?, 'confirmed', 'Payment confirmed via ${payment.payment_method}', 'System', ?)`,
// //         [payment.order_id, 1] // System user
// //       );
// //     }

// //     
// //     res.json({ success: true, message: 'Webhook processed successfully' });

// //   } catch (error) {
// //     
// //     console.error('Webhook processing error:', error);
// //     res.status(500).json({ message: 'Webhook processing failed' });
// //   } finally {
// //     connection.release();
// //   }
// // };

// // export const checkPaymentStatus = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const userId = req.user.id;

// //     // Get payment status from database
// //     const [payments] = await pool.execute(
// //       `SELECT p.*, o.order_number 
// //        FROM payments p 
// //        JOIN orders o ON p.order_id = o.id 
// //        WHERE p.order_id = ? AND p.user_id = ? 
// //        ORDER BY p.created_at DESC LIMIT 1`,
// //       [orderId, userId]
// //     );

// //     if (payments.length === 0) {
// //       return res.status(404).json({ message: 'Payment not found' });
// //     }

// //     const payment = payments[0];

// //     // If payment is still pending, check with PawaPay
// //     if (payment.status === 'pending') {
// //       try {
// //         const paymentStatus = await pawapayService.checkPaymentStatus(
// //           payment.merchant_reference
// //         );
        
// //         // Update payment status if changed
// //         if (paymentStatus.status !== payment.status) {
// //           await pool.execute(
// //             'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
// //             [paymentStatus.status, payment.id]
// //           );

// //           await pool.execute(
// //             'UPDATE orders SET payment_status = ? WHERE id = ?',
// //             [paymentStatus.status === 'completed' ? 'paid' : paymentStatus.status, orderId]
// //           );

// //           payment.status = paymentStatus.status;
// //         }
// //       } catch (error) {
// //         console.error('Error checking payment status:', error);
// //         // Continue with database status
// //       }
// //     }

// //     res.json({
// //       payment: {
// //         id: payment.id,
// //         orderId: payment.order_id,
// //         amount: payment.amount,
// //         paymentMethod: payment.payment_method,
// //         status: payment.status,
// //         merchantReference: payment.merchant_reference,
// //         transactionId: payment.transaction_id,
// //         createdAt: payment.created_at
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Check payment status error:', error);
// //     res.status(500).json({ 
// //       message: 'Failed to check payment status', 
// //       error: error.message 
// //     });
// //   }
// // };

// // export const getSupportedPaymentMethods = async (req, res) => {
// //   try {
// //     const { countryCode } = req.query;
    
// //     // Get supported methods from PawaPay
// //     const supportedMethods = await pawapayService.getSupportedPaymentMethods(
// //       countryCode || 'RW'
// //     );

// //     res.json({
// //       success: true,
// //       paymentMethods: supportedMethods,
// //       defaultMethods: pawapayConfig.paymentMethods
// //     });

// //   } catch (error) {
// //     console.error('Get payment methods error:', error);
// //     res.status(500).json({ 
// //       message: 'Failed to get payment methods',
// //       error: error.message 
// //     });
// //   }
// // };



// // backend/controllers/paymentController.js
// import pool from '../config/database.js';
// import pawapayService from '../services/pawapayService.js';
// import { pawapayConfig } from '../config/pawapay.js';

// export const initiatePawaPayPayment = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const { orderId, paymentMethod, phoneNumber } = req.body;
//     const userId = req.user.id;

//     console.log('🚀 Initiating PawaPay payment:', { orderId, paymentMethod, phoneNumber });

//     // Validate required fields
//     if (!orderId || !paymentMethod || !phoneNumber) {
      
//       return res.status(400).json({ 
//         message: 'Missing required fields: orderId, paymentMethod, phoneNumber' 
//       });
//     }

//     // Get order details
//     const [orders] = await connection.execute(
//       `SELECT o.*, u.email, u.first_name, u.last_name 
//        FROM orders o 
//        JOIN users u ON o.user_id = u.id 
//        WHERE o.id = ? AND o.user_id = ?`,
//       [orderId, userId]
//     );

//     if (orders.length === 0) {
      
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const order = orders[0];
    
//     // Validate order can be paid
//     if (order.payment_status !== 'pending') {
      
//       return res.status(400).json({ 
//         message: `Order payment status is ${order.payment_status}, cannot initiate payment`
//       });
//     }

//     // Validate payment method
//     const supportedMethods = Object.keys(pawapayConfig.paymentMethods);
//     if (!supportedMethods.includes(paymentMethod)) {
      
//       return res.status(400).json({ 
//         message: 'Unsupported payment method',
//         supportedMethods 
//       });
//     }

//     // Generate unique merchant reference
//     const merchantReference = pawapayService.generateMerchantReference(orderId);
    
//     // Format phone number
//     const formattedPhone = pawapayService.formatPhoneNumber(phoneNumber, 'RW');

//     // Prepare payment data for PawaPay
//     const paymentData = {
//       amount: order.total_amount,
//       currency: 'USD',
//       paymentMethod: paymentMethod,
//       phone: formattedPhone,
//       email: order.email,
//       customerName: `${order.first_name} ${order.last_name}`,
//       merchantReference: merchantReference,
//       orderId: order.id,
//       orderNumber: order.order_number,
//       userId: userId,
//       description: `Payment for order ${order.order_number}`
//     };

//     console.log('📦 Sending payment request to PawaPay:', paymentData);

//     // Create payment request with PawaPay
//     const paymentResponse = await pawapayService.createPaymentRequest(paymentData);

//     // Create payments table if not exists
//     await connection.execute(`
//       CREATE TABLE IF NOT EXISTS payments (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         order_id INT NOT NULL,
//         user_id INT NOT NULL,
//         payment_method VARCHAR(50) NOT NULL,
//         amount DECIMAL(10,2) NOT NULL,
//         merchant_reference VARCHAR(255) NOT NULL UNIQUE,
//         transaction_id VARCHAR(255),
//         status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
//         provider_response JSON,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
//         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//       )
//     `);

//     // Store payment record in database
//     const [paymentResult] = await connection.execute(
//       `INSERT INTO payments 
//        (order_id, user_id, payment_method, amount, merchant_reference, 
//         transaction_id, status, provider_response) 
//        VALUES (?, ?, ?, ?, ?, ?, 'processing', ?)`,
//       [
//         orderId,
//         userId,
//         paymentMethod,
//         order.total_amount,
//         merchantReference,
//         paymentResponse.transactionId,
//         JSON.stringify(paymentResponse)
//       ]
//     );

//     // Update order payment status
//     await connection.execute(
//       'UPDATE orders SET payment_status = ? WHERE id = ?',
//       ['processing', orderId]
//     );

//     // Add to tracking history
//     await connection.execute(
//       `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
//        VALUES (?, 'confirmed', 'Payment initiated via ${paymentMethod}', 'Payment System', ?)`,
//       [orderId, userId]
//     );

    
//     console.log('✅ Payment initiated successfully:', {
//       paymentId: paymentResult.insertId,
//       merchantReference,
//       transactionId: paymentResponse.transactionId
//     });

//     res.json({
//       success: true,
//       message: 'Payment initiated successfully',
//       payment: {
//         paymentId: paymentResult.insertId,
//         transactionId: paymentResponse.transactionId,
//         merchantReference: merchantReference,
//         status: paymentResponse.status,
//         instructions: paymentResponse.instructions || 'Check your mobile device for payment request',
//         amount: order.total_amount,
//         currency: 'USD'
//       },
//       nextSteps: [
//         'Check your mobile device for payment request',
//         'Payment status will update automatically',
//         'You can check status anytime in your orders'
//       ]
//     });

//   } catch (error) {
    
//     console.error('Payment initiation error:', error);
//     res.status(500).json({ 
//       message: 'Failed to initiate payment', 
//       error: error.message,
//       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

// export const handlePawaPayWebhook = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const signature = req.headers['x-signature'];
//     const timestamp = req.headers['x-timestamp'];
//     const webhookId = req.headers['x-webhook-id'];
    
//     const webhookPayload = req.body;

//     console.log('🔄 PawaPay Webhook Received:', {
//       webhookId,
//       signature: signature ? 'Present' : 'Missing',
//       timestamp,
//       payload: webhookPayload
//     });

//     // Validate webhook signature
//     const isValid = pawapayService.validateWebhookSignature(
//       webhookPayload, 
//       signature, 
//       timestamp
//     );

//     if (!isValid) {
//       console.error('❌ Invalid webhook signature');
      
//       return res.status(401).json({ message: 'Invalid signature' });
//     }

//     const { event, data } = webhookPayload;

//     console.log(`📦 Processing webhook event: ${event}`, data);

//     // Find payment record by merchant reference or transaction ID
//     let [payments] = await connection.execute(
//       'SELECT * FROM payments WHERE merchant_reference = ? OR transaction_id = ?',
//       [data.merchantReference, data.transactionId]
//     );

//     if (payments.length === 0) {
//       console.error('❌ Payment not found for webhook:', data.merchantReference, data.transactionId);
      
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     const payment = payments[0];

//     // Update payment status based on webhook event
//     let paymentStatus = 'pending';
//     let orderPaymentStatus = 'pending';
//     let orderStatus = 'pending';
//     let description = '';

//     switch (event) {
//       case 'payment.completed':
//         paymentStatus = 'completed';
//         orderPaymentStatus = 'paid';
//         orderStatus = 'confirmed';
//         description = `Payment completed via ${payment.payment_method}`;
//         console.log(`✅ Payment completed for order ${payment.order_id}`);
//         break;
        
//       case 'payment.failed':
//         paymentStatus = 'failed';
//         orderPaymentStatus = 'failed';
//         description = `Payment failed: ${data.reason || 'Unknown reason'}`;
//         console.log(`❌ Payment failed for order ${payment.order_id}:`, data.reason);
//         break;
        
//       case 'payment.cancelled':
//         paymentStatus = 'cancelled';
//         orderPaymentStatus = 'cancelled';
//         description = 'Payment cancelled by user';
//         console.log(`🚫 Payment cancelled for order ${payment.order_id}`);
//         break;
        
//       default:
//         paymentStatus = 'pending';
//         console.log(`❓ Unhandled webhook event: ${event}`);
//     }

//     // Update payment record
//     await connection.execute(
//       `UPDATE payments 
//        SET status = ?, provider_response = ?, updated_at = NOW() 
//        WHERE id = ?`,
//       [paymentStatus, JSON.stringify(webhookPayload), payment.id]
//     );

//     // Update order payment status
//     await connection.execute(
//       'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
//       [orderPaymentStatus, orderStatus, payment.order_id]
//     );

//     // Add to tracking history
//     if (description) {
//       await connection.execute(
//         `INSERT INTO tracking_history 
//          (order_id, status, description, location, updated_by) 
//          VALUES (?, ?, ?, 'Payment System', ?)`,
//         [payment.order_id, orderStatus, description, 1] // System user
//       );
//     }

//     // If payment failed or cancelled, restore product stock
//     if (event === 'payment.failed' || event === 'payment.cancelled') {
//       const [orderItems] = await connection.execute(
//         'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
//         [payment.order_id]
//       );

//       for (const item of orderItems) {
//         await connection.execute(
//           'UPDATE products SET quantity = quantity + ? WHERE id = ?',
//           [item.quantity, item.product_id]
//         );
//       }
//       console.log(`🔄 Stock restored for order ${payment.order_id}`);
//     }

    
//     console.log(`✅ Webhook processed successfully for order ${payment.order_id}`);

//     res.json({ 
//       success: true, 
//       message: 'Webhook processed successfully',
//       orderId: payment.order_id,
//       status: paymentStatus
//     });

//   } catch (error) {
    
//     console.error('💥 Webhook processing error:', error);
//     res.status(500).json({ 
//       message: 'Webhook processing failed',
//       error: error.message 
//     });
//   }
// };

// export const checkPaymentStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.id;

//     console.log('🔍 Checking payment status for order:', orderId);

//     // Get payment status from database
//     const [payments] = await pool.execute(
//       `SELECT p.*, o.order_number, o.status as order_status
//        FROM payments p 
//        JOIN orders o ON p.order_id = o.id 
//        WHERE p.order_id = ? AND p.user_id = ? 
//        ORDER BY p.created_at DESC LIMIT 1`,
//       [orderId, userId]
//     );

//     if (payments.length === 0) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     const payment = payments[0];

//     let needsUpdate = false;

//     // If payment is still processing, check with PawaPay
//     if (payment.status === 'processing' || payment.status === 'pending') {
//       try {
//         console.log('🔄 Checking payment status with PawaPay:', payment.merchant_reference);
//         const paymentStatus = await pawapayService.checkPaymentStatus(
//           payment.merchant_reference
//         );
        
//         if (paymentStatus.status !== payment.status) {
//           console.log(`🔄 Payment status changed: ${payment.status} -> ${paymentStatus.status}`);
          
//           // Update payment status
//           await pool.execute(
//             'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
//             [paymentStatus.status, payment.id]
//           );

//           // Update order status
//           let orderPaymentStatus = paymentStatus.status;
//           let orderStatus = payment.order_status;
          
//           if (paymentStatus.status === 'completed') {
//             orderPaymentStatus = 'paid';
//             orderStatus = 'confirmed';
//           } else if (paymentStatus.status === 'failed') {
//             orderPaymentStatus = 'failed';
//           }

//           await pool.execute(
//             'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
//             [orderPaymentStatus, orderStatus, orderId]
//           );

//           needsUpdate = true;
//           payment.status = paymentStatus.status;
//         }
//       } catch (error) {
//         console.error('Error checking payment status with PawaPay:', error.message);
//         // Continue with database status
//       }
//     }

//     res.json({
//       payment: {
//         id: payment.id,
//         orderId: payment.order_id,
//         orderNumber: payment.order_number,
//         amount: payment.amount,
//         paymentMethod: payment.payment_method,
//         status: payment.status,
//         merchantReference: payment.merchant_reference,
//         transactionId: payment.transaction_id,
//         createdAt: payment.created_at,
//         updatedAt: payment.updated_at
//       },
//       updated: needsUpdate
//     });

//   } catch (error) {
//     console.error('Check payment status error:', error);
//     res.status(500).json({ 
//       message: 'Failed to check payment status', 
//       error: error.message 
//     });
//   }
// };

// export const getSupportedPaymentMethods = async (req, res) => {
//   try {
//     const { countryCode } = req.query;
    
//     console.log('🌍 Getting supported payment methods for:', countryCode || 'RW');

//     // Get supported methods from PawaPay
//     const supportedMethods = await pawapayService.getSupportedPaymentMethods(
//       countryCode || 'RW'
//     );

//     // Format methods for frontend
//     const formattedMethods = supportedMethods.map(method => ({
//       id: method,
//       name: pawapayConfig.paymentMethods[method] || method,
//       icon: getPaymentMethodIcon(method),
//       description: `Pay with ${pawapayConfig.paymentMethods[method] || method}`,
//       countries: pawapayConfig.countries[countryCode]?.methods || []
//     }));

//     res.json({
//       success: true,
//       paymentMethods: formattedMethods,
//       defaultCountry: countryCode || 'RW'
//     });

//   } catch (error) {
//     console.error('Get payment methods error:', error);
//     res.status(500).json({ 
//       message: 'Failed to get payment methods',
//       error: error.message 
//     });
//   }
// };

// // Helper function to get payment method icons
// function getPaymentMethodIcon(method) {
//   const icons = {
//     'mtn_momo': '📱',
//     'airtel_money': '💳', 
//     'orange_money': '🍊',
//     'vodacom_momo': '💰',
//     'tigo_pesa': '🐯'
//   };
//   return icons[method] || '💳';
// }



// // backend/controllers/paymentController.js
// import pool from '../config/database.js';
// import pawapayService from '../services/pawapayService.js';
// import { pawapayConfig } from '../config/pawapay.js';

// export const initiatePawaPayPayment = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const { orderId, paymentMethod, phoneNumber } = req.body;
//     const userId = req.user.id;

//     console.log('🚀 Initiating PawaPay payment:', { orderId, paymentMethod, phoneNumber });

//     // Validate required fields
//     if (!orderId || !paymentMethod || !phoneNumber) {
//       return res.status(400).json({ 
//         message: 'Missing required fields: orderId, paymentMethod, phoneNumber' 
//       });
//     }

//     // Get order details - only get what we need from users table
//     const [orders] = await connection.execute(
//       `SELECT o.*, u.email 
//        FROM orders o 
//        JOIN users u ON o.user_id = u.id 
//        WHERE o.id = ? AND o.user_id = ?`,
//       [orderId, userId]
//     );

//     if (orders.length === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const order = orders[0];
    
//     // Extract customer information from shipping address
//     let customerName = 'Customer';
//     let customerEmail = order.email;
    
//     try {
//       // Parse shipping address to get customer name
//       const shippingAddress = typeof order.shipping_address === 'string' 
//         ? JSON.parse(order.shipping_address) 
//         : order.shipping_address;
      
//       if (shippingAddress) {
//         // Get name from shipping address (preferred)
//         if (shippingAddress.firstName && shippingAddress.lastName) {
//           customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`;
//         } else if (shippingAddress.firstName) {
//           customerName = shippingAddress.firstName;
//         } else if (shippingAddress.name) {
//           // Some addresses might have a single name field
//           customerName = shippingAddress.name;
//         }
        
//         // Get email from shipping address if available
//         if (shippingAddress.email) {
//           customerEmail = shippingAddress.email;
//         }
//       } else {
//         // Fallback to billing address if shipping address is not available
//         const billingAddress = typeof order.billing_address === 'string' 
//           ? JSON.parse(order.billing_address) 
//           : order.billing_address;
        
//         if (billingAddress) {
//           if (billingAddress.firstName && billingAddress.lastName) {
//             customerName = `${billingAddress.firstName} ${billingAddress.lastName}`;
//           } else if (billingAddress.firstName) {
//             customerName = billingAddress.firstName;
//           } else if (billingAddress.name) {
//             customerName = billingAddress.name;
//           }
          
//           if (billingAddress.email) {
//             customerEmail = billingAddress.email;
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error parsing address for customer name:', error);
//       // Continue with default values if parsing fails
//     }
    
//     // Validate order can be paid
//     if (order.payment_status !== 'pending') {
//       return res.status(400).json({ 
//         message: `Order payment status is ${order.payment_status}, cannot initiate payment`
//       });
//     }

//     // Validate payment method
//     const supportedMethods = Object.keys(pawapayConfig.paymentMethods);
//     if (!supportedMethods.includes(paymentMethod)) {
//       return res.status(400).json({ 
//         message: 'Unsupported payment method',
//         supportedMethods 
//       });
//     }

//     // Generate unique merchant reference
//     const merchantReference = `PAWA${orderId}_${Date.now()}`;
    
//     // Format phone number for Rwanda by default
//     const formattedPhone = formatPhoneForPawaPay(phoneNumber, 'RW');

//     // Prepare payment data for PawaPay
//     const paymentData = {
//       amount: order.total_amount,
//       currency: 'USD',
//       paymentMethod: paymentMethod,
//       phone: formattedPhone,
//       email: customerEmail,
//       customerName: customerName,
//       merchantReference: merchantReference,
//       orderId: order.id,
//       orderNumber: order.order_number,
//       userId: userId,
//       description: `Payment for order ${order.order_number}`
//     };

//     console.log('📦 Sending payment request to PawaPay:', paymentData);

//     // Create payment request with PawaPay
//     const paymentResponse = await pawapayService.createPaymentRequest(paymentData);

//     // Store payment record in database
//     const [paymentResult] = await connection.execute(
//       `INSERT INTO payments 
//        (order_id, user_id, payment_method, amount, currency, merchant_reference, 
//         transaction_id, status, provider_response) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, 'processing', ?)`,
//       [
//         orderId,
//         userId,
//         paymentMethod,
//         order.total_amount,
//         'USD',
//         merchantReference,
//         paymentResponse.transactionId || `mock_tx_${Date.now()}`,
//         JSON.stringify(paymentResponse)
//       ]
//     );

//     // Update order payment status
//     await connection.execute(
//       'UPDATE orders SET payment_status = ? WHERE id = ?',
//       ['processing', orderId]
//     );

//     // Add to tracking history
//     await connection.execute(
//       `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
//        VALUES (?, 'confirmed', 'Payment initiated via ${paymentMethod}', 'Payment System', ?)`,
//       [orderId, userId]
//     );

//     await connection.commit();
    
//     console.log('✅ Payment initiated successfully:', {
//       paymentId: paymentResult.insertId,
//       merchantReference,
//       transactionId: paymentResponse.transactionId
//     });

//     res.json({
//       success: true,
//       message: 'Payment initiated successfully',
//       payment: {
//         paymentId: paymentResult.insertId,
//         transactionId: paymentResponse.transactionId,
//         merchantReference: merchantReference,
//         status: paymentResponse.status || 'processing',
//         instructions: paymentResponse.instructions || 'Check your mobile device for payment request',
//         amount: order.total_amount,
//         currency: 'USD'
//       },
//       nextSteps: [
//         'Check your mobile device for payment request',
//         'Payment status will update automatically',
//         'You can check status anytime in your orders'
//       ]
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Payment initiation error:', error);
//     res.status(500).json({ 
//       message: 'Failed to initiate payment', 
//       error: error.message
//     });
//   } finally {
//     connection.release();
//   }
// };

// // Also update the formatPhoneForPawaPay function to be more robust
// function formatPhoneForPawaPay(phone, countryCode = 'RW') {
//   if (!phone) return '';
  
//   // Remove all non-numeric characters
//   let cleaned = phone.replace(/\D/g, '');
  
//   // Handle empty string
//   if (!cleaned) return '';
  
//   // Handle country codes
//   switch (countryCode) {
//     case 'RW': // Rwanda
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '250' + cleaned.substring(1);
//       } else if (cleaned.startsWith('7') && cleaned.length === 9) {
//         cleaned = '250' + cleaned;
//       } else if (cleaned.startsWith('25') && cleaned.length === 12) {
//         // Already in correct format (e.g., 25078xxxxxx)
//       } else if (!cleaned.startsWith('250') && cleaned.length === 9) {
//         cleaned = '250' + cleaned;
//       }
//       break;
      
//     case 'KE': // Kenya
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '254' + cleaned.substring(1);
//       } else if (cleaned.startsWith('7') && cleaned.length === 9) {
//         cleaned = '254' + cleaned;
//       }
//       break;
      
//     case 'UG': // Uganda
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '256' + cleaned.substring(1);
//       } else if (cleaned.startsWith('7') && cleaned.length === 9) {
//         cleaned = '256' + cleaned;
//       }
//       break;
      
//     case 'TZ': // Tanzania
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '255' + cleaned.substring(1);
//       } else if (cleaned.startsWith('6') || cleaned.startsWith('7')) {
//         if (cleaned.length === 9) {
//           cleaned = '255' + cleaned;
//         }
//       }
//       break;
      
//     default:
//       // If no country code specified, try to detect
//       if (cleaned.startsWith('0') && cleaned.length >= 9) {
//         // Assume local format, keep as is and let PawaPay handle it
//       }
//       break;
//   }
  
//   // Ensure it starts with + if not already
//   return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
// }




// export const handlePawaPayWebhook = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const signature = req.headers['x-signature'];
//     const timestamp = req.headers['x-timestamp'];
//     const webhookPayload = req.body;

//     console.log('🔄 PawaPay Webhook Received:', {
//       signature: signature ? 'Present' : 'Missing',
//       timestamp,
//       payload: webhookPayload
//     });

//     // Validate webhook signature
//     const isValid = true; // Temporarily set to true for development

//     if (!isValid) {
//       console.error('❌ Invalid webhook signature');
//       await connection.rollback();
//       connection.release();
//       return res.status(401).json({ message: 'Invalid signature' });
//     }

//     const { event, data } = webhookPayload;

//     console.log(`📦 Processing webhook event: ${event}`, data);

//     // Find payment record by merchant reference
//     const [payments] = await connection.execute(
//       'SELECT * FROM payments WHERE merchant_reference = ?',
//       [data.merchantReference]
//     );

//     if (payments.length === 0) {
//       console.error('❌ Payment not found for webhook:', data.merchantReference);
//       await connection.rollback();
//       connection.release();
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     const payment = payments[0];

//     // Update payment status based on webhook event
//     let paymentStatus = 'pending';
//     let orderPaymentStatus = 'pending';
//     let orderStatus = 'pending';

//     switch (event) {
//       case 'payment.completed':
//         paymentStatus = 'completed';
//         orderPaymentStatus = 'paid';
//         orderStatus = 'confirmed';
//         console.log(`✅ Payment completed for order ${payment.order_id}`);
//         break;
        
//       case 'payment.failed':
//         paymentStatus = 'failed';
//         orderPaymentStatus = 'failed';
//         orderStatus = 'pending'; // Keep order pending for failed payment
//         console.log(`❌ Payment failed for order ${payment.order_id}`);
        
//         // Restore stock if payment failed
//         await restoreStockForOrder(connection, payment.order_id, `Payment failed: ${event}`);
//         break;
        
//       case 'payment.cancelled':
//         paymentStatus = 'cancelled';
//         orderPaymentStatus = 'cancelled';
//         orderStatus = 'cancelled';
//         console.log(`🚫 Payment cancelled for order ${payment.order_id}`);
        
//         // Restore stock if payment cancelled
//         await restoreStockForOrder(connection, payment.order_id, `Payment cancelled: ${event}`);
//         break;
        
//       default:
//         console.log(`❓ Unhandled webhook event: ${event}`);
//     }

//     // Update payment record
//     await connection.execute(
//       `UPDATE payments 
//        SET status = ?, provider_response = ?, updated_at = NOW() 
//        WHERE id = ?`,
//       [paymentStatus, JSON.stringify(webhookPayload), payment.id]
//     );

//     // Update order payment status and status
//     await connection.execute(
//       'UPDATE orders SET payment_status = ?, status = ?, updated_at = NOW() WHERE id = ?',
//       [orderPaymentStatus, orderStatus, payment.order_id]
//     );

//     // Add to tracking history
//     await connection.execute(
//       `INSERT INTO tracking_history 
//        (order_id, status, description, location, updated_by) 
//        VALUES (?, ?, ?, 'Payment System', ?)`,
//       [payment.order_id, orderStatus, `Payment ${event} via webhook`, 1]
//     );

//     await connection.commit();
//     console.log(`✅ Webhook processed successfully for order ${payment.order_id}`);

//     res.json({ 
//       success: true, 
//       message: 'Webhook processed successfully'
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('💥 Webhook processing error:', error);
//     res.status(500).json({ 
//       message: 'Webhook processing failed',
//       error: error.message 
//     });
//   } finally {
//     connection.release();
//   }
// };

// // Helper function to restore stock when payment fails/cancels
// async function restoreStockForOrder(connection, orderId, reason) {
//   const userId = req.user.id;
//   // Get order items
//   const [orderItems] = await connection.execute(
//     'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
//     [orderId]
//   );

//   for (const item of orderItems) {
//     // Restore product stock
//     await connection.execute(
//       'UPDATE products SET quantity = quantity + ? WHERE id = ?',
//       [item.quantity, item.product_id]
//     );

//     // Record stock history for restoration
//     await connection.execute(
//       `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
//        VALUES (?, ?, ?, ?)`,
//       [
//         item.product_id,
//         item.quantity,
//         reason,
//         userId
//       ]
//     );
//   }
// }


// export const checkPaymentStatus = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     const { orderId } = req.params;
//     const userId = req.user.id;

//     console.log('🔍 Checking payment status for order:', orderId);

//     // Get payment status from database
//     const [payments] = await connection.execute(
//       `SELECT p.*, o.order_number, o.status as order_status, o.payment_status as order_payment_status
//        FROM payments p 
//        JOIN orders o ON p.order_id = o.id 
//        WHERE p.order_id = ? AND p.user_id = ? 
//        ORDER BY p.created_at DESC LIMIT 1`,
//       [orderId, userId]
//     );

//     if (payments.length === 0) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     const payment = payments[0];
//     let needsUpdate = false;

//     // If payment is completed but order payment_status is not updated
//     if (payment.status === 'completed' && payment.order_payment_status !== 'paid') {
//       console.log('🔄 Syncing order payment status with payment status');
      
//       await connection.execute(
//         'UPDATE orders SET payment_status = "paid", status = "confirmed" WHERE id = ?',
//         [orderId]
//       );
      
//       // Add to tracking history
//       await connection.execute(
//         `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
//          VALUES (?, 'confirmed', 'Payment confirmed via ${payment.payment_method}', 'Payment System', ?)`,
//         [orderId, userId]
//       );
      
//       needsUpdate = true;
//       console.log('✅ Order payment status updated to paid');
//     }

//     // If payment is still processing, check with PawaPay (mock for development)
//     if (payment.status === 'processing' || payment.status === 'pending') {
//       try {
//         console.log('🔄 Checking payment status with PawaPay:', payment.merchant_reference);
        
//         // Mock payment completion for development after 60 seconds
//         const paymentTime = new Date(payment.created_at).getTime();
//         const currentTime = new Date().getTime();
//         const timeDiff = (currentTime - paymentTime) / 1000; // in seconds
        
//         if (timeDiff > 60) { // After 60 seconds, mark as completed for testing
//           console.log('🎭 Mock payment completion for development');
          
//           await connection.execute(
//             'UPDATE payments SET status = "completed", updated_at = NOW() WHERE id = ?',
//             [payment.id]
//           );

//           await connection.execute(
//             'UPDATE orders SET payment_status = "paid", status = "confirmed" WHERE id = ?',
//             [orderId]
//           );

//           // Add to tracking history
//           await connection.execute(
//             `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
//              VALUES (?, 'confirmed', 'Payment completed via ${payment.payment_method}', 'Payment System', ?)`,
//             [orderId, userId]
//           );

//           needsUpdate = true;
//           payment.status = 'completed';
//           console.log('✅ Mock payment completed and order updated');
//         }
//       } catch (error) {
//         console.error('Error checking payment status with PawaPay:', error.message);
//       }
//     }

//     // Get updated order data
//     const [updatedOrders] = await connection.execute(
//       'SELECT payment_status, status FROM orders WHERE id = ?',
//       [orderId]
//     );

//     const updatedOrder = updatedOrders[0];

//     res.json({
//       payment: {
//         id: payment.id,
//         orderId: payment.order_id,
//         orderNumber: payment.order_number,
//         amount: payment.amount,
//         paymentMethod: payment.payment_method,
//         status: payment.status,
//         merchantReference: payment.merchant_reference,
//         transactionId: payment.transaction_id,
//         createdAt: payment.created_at,
//         updatedAt: payment.updated_at
//       },
//       order: {
//         payment_status: updatedOrder.payment_status,
//         status: updatedOrder.status
//       },
//       updated: needsUpdate,
//       synced: true
//     });

//   } catch (error) {
//     console.error('Check payment status error:', error);
//     res.status(500).json({ 
//       message: 'Failed to check payment status', 
//       error: error.message 
//     });
//   }
// };
// export const getSupportedPaymentMethods = async (req, res) => {
//   try {
//     const { countryCode } = req.query;
    
//     console.log('🌍 Getting supported payment methods for:', countryCode || 'RW');

//     // Get supported methods from PawaPay
//     const supportedMethods = await pawapayService.getSupportedPaymentMethods(
//       countryCode || 'RW'
//     );

//     res.json({
//       success: true,
//       paymentMethods: supportedMethods,
//       defaultCountry: countryCode || 'RW'
//     });

//   } catch (error) {
//     console.error('Get payment methods error:', error);
//     res.status(500).json({ 
//       message: 'Failed to get payment methods',
//       error: error.message 
//     });
//   }
// };



// // backend/controllers/paymentController.js
// import pool from '../config/database.js';
// import pawapayService from '../services/pawapayService.js';
// import { pawapayConfig } from '../config/pawapay.js';

// // Unified payment initiation function
// export const initiatePayment = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const { 
//       type = 'standalone_payment', // 'order_payment' or 'standalone_payment'
//       provider, 
//       phoneNumber, 
//       amount, 
//       country = 'RW',
//       orderId, // For order payments
//       description // For standalone payments
//     } = req.body;
    
//     const userId = req.user.id;

//     console.log('🚀 Initiating payment:', { 
//       type, 
//       provider, 
//       phoneNumber, 
//       amount, 
//       orderId,
//       userId 
//     });

//     // Validate required fields
//     if (!provider || !phoneNumber) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Missing required fields: provider, phoneNumber' 
//       });
//     }

//     // Validate payment method
//     const supportedMethods = Object.keys(pawapayConfig.paymentMethods);
//     if (!supportedMethods.includes(provider)) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Unsupported payment method',
//         supportedMethods 
//       });
//     }

//     let paymentAmount = 0;
//     let orderDetails = null;
//     let merchantReference = '';
//     let customerName = req.user.username;
//     let customerEmail = req.user.email;

//     // Handle order payments
//     if (type === 'order_payment') {
//       if (!orderId) {
//         return res.status(400).json({ 
//           success: false,
//           message: 'Order ID is required for order payments' 
//         });
//       }

//       // Get order details
//       const [orders] = await connection.execute(
//         `SELECT o.*, u.email, u.username 
//          FROM orders o 
//          JOIN users u ON o.user_id = u.id 
//          WHERE o.id = ? AND o.user_id = ?`,
//         [orderId, userId]
//       );

//       if (orders.length === 0) {
//         return res.status(404).json({ 
//           success: false,
//           message: 'Order not found' 
//         });
//       }

//       orderDetails = orders[0];
//       paymentAmount = parseFloat(orderDetails.total_amount);
      
//       // Validate order can be paid
//       if (orderDetails.payment_status !== 'pending') {
//         return res.status(400).json({ 
//           success: false,
//           message: `Order payment status is ${orderDetails.payment_status}, cannot initiate payment`
//         });
//       }

//       // Extract customer information from shipping address
//       try {
//         const shippingAddress = typeof orderDetails.shipping_address === 'string' 
//           ? JSON.parse(orderDetails.shipping_address) 
//           : orderDetails.shipping_address;
        
//         if (shippingAddress) {
//           if (shippingAddress.firstName && shippingAddress.lastName) {
//             customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`;
//           } else if (shippingAddress.name) {
//             customerName = shippingAddress.name;
//           }
//           if (shippingAddress.email) {
//             customerEmail = shippingAddress.email;
//           }
//         }
//       } catch (error) {
//         console.error('Error parsing address for customer name:', error);
//       }

//       merchantReference = `ORDER_${orderId}_${Date.now()}`;
      
//     } else {
//       // Handle standalone payments
//       paymentAmount = parseFloat(amount);
//       if (isNaN(paymentAmount) || paymentAmount <= 0) {
//         return res.status(400).json({ 
//           success: false,
//           message: 'Invalid amount. Must be greater than 0' 
//         });
//       }

//       merchantReference = `STANDALONE_${userId}_${Date.now()}`;
//     }

//     // Format phone number for PawaPay
//     const formattedPhone = formatPhoneForPawaPay(phoneNumber, country);

//     // Prepare payment data for PawaPay
//     const paymentData = {
//       amount: paymentAmount,
//       currency: 'USD',
//       paymentMethod: provider,
//       phone: formattedPhone,
//       email: customerEmail,
//       customerName: customerName,
//       merchantReference: merchantReference,
//       userId: userId,
//       description: description || (type === 'order_payment' 
//         ? `Payment for order ${orderDetails?.order_number}` 
//         : `Payment of ${paymentAmount} USD via ${provider}`)
//     };

//     // Add order-specific data
//     if (type === 'order_payment' && orderDetails) {
//       paymentData.orderId = orderDetails.id;
//       paymentData.orderNumber = orderDetails.order_number;
//       paymentData.metadata = {
//         type: 'order_payment',
//         orderId: orderDetails.id,
//         orderNumber: orderDetails.order_number
//       };
//     } else {
//       paymentData.metadata = {
//         type: 'standalone_payment',
//         description: description
//       };
//     }

//     console.log('📦 Sending payment request to PawaPay:', paymentData);

//     // Create payment request with PawaPay
//     const paymentResponse = await pawapayService.createPaymentRequest(paymentData);

//     // Store payment record in database
//     const [paymentResult] = await connection.execute(
//       `INSERT INTO payments 
//        (user_id, order_id, type, payment_method, amount, currency, 
//         merchant_reference, transaction_id, status, provider_response) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'processing', ?)`,
//       [
//         userId,
//         type === 'order_payment' ? orderId : null,
//         type,
//         provider,
//         paymentAmount,
//         'USD',
//         merchantReference,
//         paymentResponse.transactionId || `mock_tx_${Date.now()}`,
//         JSON.stringify(paymentResponse)
//       ]
//     );

//     // Update order payment status if this is an order payment
//     if (type === 'order_payment' && orderDetails) {
//       await connection.execute(
//         'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
//         ['processing', 'confirmed', orderId]
//       );

//       // Add to tracking history
//       await connection.execute(
//         `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
//          VALUES (?, 'confirmed', 'Payment initiated via ${provider}', 'Payment System', ?)`,
//         [orderId, userId]
//       );
//     }

//     await connection.commit();
    
//     console.log('✅ Payment initiated successfully:', {
//       paymentId: paymentResult.insertId,
//       type,
//       merchantReference,
//       transactionId: paymentResponse.transactionId
//     });

//     const response = {
//       success: true,
//       message: 'Payment initiated successfully',
//       payment: {
//         paymentId: paymentResult.insertId,
//         transactionId: paymentResponse.transactionId,
//         merchantReference: merchantReference,
//         status: paymentResponse.status || 'processing',
//         instructions: paymentResponse.instructions || 'Check your mobile device for payment request',
//         amount: paymentAmount,
//         currency: 'USD',
//         phoneNumber: formattedPhone,
//         provider: provider,
//         type: type
//       },
//       nextSteps: [
//         'Check your mobile device for payment request',
//         'Payment status will update automatically'
//       ]
//     };

//     // Add order-specific response data
//     if (type === 'order_payment' && orderDetails) {
//       response.order = {
//         orderId: orderDetails.id,
//         orderNumber: orderDetails.order_number,
//         status: 'confirmed',
//         payment_status: 'processing'
//       };
//     }

//     res.json(response);

//   } catch (error) {
//     await connection.rollback();
//     console.error('Payment initiation error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to initiate payment', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

// // Unified webhook handler
// export const handlePaymentWebhook = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const signature = req.headers['x-signature'];
//     const timestamp = req.headers['x-timestamp'];
//     const webhookPayload = req.body;

//     console.log('🔄 Payment Webhook Received:', {
//       event: webhookPayload.event,
//       merchantReference: webhookPayload.data?.merchantReference
//     });

//     // Validate webhook signature (skip in development)
//     if (process.env.NODE_ENV === 'production') {
//       const isValid = await pawapayService.validateWebhookSignature(
//         webhookPayload,
//         signature,
//         timestamp
//       );
      
//       if (!isValid) {
//         console.error('❌ Invalid webhook signature');
//         await connection.rollback();
//         connection.release();
//         return res.status(401).json({ success: false, message: 'Invalid signature' });
//       }
//     }

//     const { event, data } = webhookPayload;

//     // Find payment record by merchant reference
//     const [payments] = await connection.execute(
//       `SELECT p.*, o.id as order_id, o.order_number, o.user_id as order_user_id 
//        FROM payments p 
//        LEFT JOIN orders o ON p.order_id = o.id 
//        WHERE p.merchant_reference = ?`,
//       [data.merchantReference]
//     );

//     if (payments.length === 0) {
//       console.error('❌ Payment not found for webhook:', data.merchantReference);
//       await connection.rollback();
//       connection.release();
//       return res.status(404).json({ success: false, message: 'Payment not found' });
//     }

//     const payment = payments[0];

//     // Update payment status based on webhook event
//     let paymentStatus = payment.status;
//     let orderPaymentStatus = payment.type === 'order_payment' ? 'processing' : null;
//     let orderStatus = payment.type === 'order_payment' ? 'confirmed' : null;

//     switch (event) {
//       case 'payment.completed':
//         paymentStatus = 'completed';
//         if (payment.type === 'order_payment') {
//           orderPaymentStatus = 'paid';
//           orderStatus = 'confirmed';
//         }
//         console.log(`✅ Payment completed for ${payment.type}`);
//         break;
        
//       case 'payment.failed':
//         paymentStatus = 'failed';
//         if (payment.type === 'order_payment') {
//           orderPaymentStatus = 'failed';
//           orderStatus = 'pending';
//         }
//         console.log(`❌ Payment failed for ${payment.type}`);
//         break;
        
//       case 'payment.cancelled':
//         paymentStatus = 'cancelled';
//         if (payment.type === 'order_payment') {
//           orderPaymentStatus = 'cancelled';
//           orderStatus = 'cancelled';
//         }
//         console.log(`🚫 Payment cancelled for ${payment.type}`);
//         break;
        
//       case 'payment.processing':
//         paymentStatus = 'processing';
//         console.log(`🔄 Payment processing for ${payment.type}`);
//         break;
        
//       default:
//         console.log(`❓ Unhandled webhook event: ${event}`);
//     }

//     // Update payment record
//     await connection.execute(
//       `UPDATE payments 
//        SET status = ?, provider_response = ?, updated_at = NOW(), transaction_id = ?
//        WHERE id = ?`,
//       [
//         paymentStatus,
//         JSON.stringify(webhookPayload),
//         data.transactionId || payment.transaction_id,
//         payment.id
//       ]
//     );

//     // Update order if this is an order payment
//     if (payment.type === 'order_payment' && payment.order_id) {
//       await connection.execute(
//         'UPDATE orders SET payment_status = ?, status = ?, updated_at = NOW() WHERE id = ?',
//         [orderPaymentStatus, orderStatus, payment.order_id]
//       );

//       // Add to tracking history
//       await connection.execute(
//         `INSERT INTO tracking_history 
//          (order_id, status, description, location, updated_by) 
//          VALUES (?, ?, ?, 'Payment System', ?)`,
//         [payment.order_id, orderStatus, `Payment ${event} via webhook`, 1]
//       );

//       // Restore stock if payment failed/cancelled
//       if (event === 'payment.failed' || event === 'payment.cancelled') {
//         const [orderItems] = await connection.execute(
//           'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
//           [payment.order_id]
//         );

//         for (const item of orderItems) {
//           await connection.execute(
//             'UPDATE products SET quantity = quantity + ? WHERE id = ?',
//             [item.quantity, item.product_id]
//           );

//           await connection.execute(
//             `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
//              VALUES (?, ?, ?, ?)`,
//             [
//               item.product_id,
//               item.quantity,
//               `Payment ${event} for order ${payment.order_id}`,
//               payment.user_id
//             ]
//           );
//         }
//       }
//     }

//     await connection.commit();
//     console.log(`✅ Webhook processed successfully for ${payment.type}`);

//     res.json({ 
//       success: true, 
//       message: 'Webhook processed successfully'
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('💥 Webhook processing error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Webhook processing failed',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

// // Check payment status (works for both order and standalone payments)
// export const checkPaymentStatus = async (req, res) => {
//   try {
//     const { type = 'payment', id } = req.params;
//     const userId = req.user.id;

//     console.log('🔍 Checking payment status:', { type, id, userId });

//     let query = '';
//     let params = [];

//     if (type === 'order') {
//       // Get payment for an order
//       query = `
//         SELECT p.*, o.order_number, o.status as order_status, o.payment_status as order_payment_status
//         FROM payments p 
//         JOIN orders o ON p.order_id = o.id 
//         WHERE p.order_id = ? AND p.user_id = ? AND p.type = 'order_payment'
//         ORDER BY p.created_at DESC LIMIT 1
//       `;
//       params = [id, userId];
//     } else {
//       // Get standalone payment by payment ID
//       query = `
//         SELECT p.* 
//         FROM payments p 
//         WHERE p.id = ? AND p.user_id = ? AND p.type = 'standalone_payment'
//       `;
//       params = [id, userId];
//     }

//     const [payments] = await pool.execute(query, params);

//     if (payments.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Payment not found' 
//       });
//     }

//     const payment = payments[0];

//     // If payment is processing, check with PawaPay
//     if (payment.status === 'processing' || payment.status === 'pending') {
//       try {
//         console.log('🔄 Checking payment status with PawaPay:', payment.merchant_reference);
        
//         const statusResponse = await pawapayService.checkPaymentStatus(
//           payment.merchant_reference
//         );

//         if (statusResponse.status !== payment.status) {
//           await pool.execute(
//             'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
//             [statusResponse.status, payment.id]
//           );
          
//           // Update order if needed
//           if (payment.type === 'order_payment' && statusResponse.status === 'completed') {
//             await pool.execute(
//               'UPDATE orders SET payment_status = "paid", status = "confirmed" WHERE id = ?',
//               [payment.order_id]
//             );
//           }
          
//           payment.status = statusResponse.status;
//         }
//       } catch (error) {
//         console.error('Error checking PawaPay status:', error.message);
//       }
//     }

//     // Parse provider response
//     let providerResponse = {};
//     try {
//       if (payment.provider_response) {
//         providerResponse = JSON.parse(payment.provider_response);
//       }
//     } catch (e) {
//       console.error('Error parsing provider response:', e);
//     }

//     const response = {
//       success: true,
//       payment: {
//         id: payment.id,
//         type: payment.type,
//         provider: payment.payment_method,
//         amount: payment.amount,
//         currency: payment.currency,
//         phoneNumber: payment.phone_number,
//         status: payment.status,
//         merchantReference: payment.merchant_reference,
//         transactionId: payment.transaction_id,
//         createdAt: payment.created_at,
//         updatedAt: payment.updated_at,
//         providerResponse: providerResponse
//       }
//     };

//     // Add order info if it's an order payment
//     if (payment.type === 'order_payment') {
//       response.payment.order = {
//         orderId: payment.order_id,
//         orderNumber: payment.order_number,
//         status: payment.order_status,
//         payment_status: payment.order_payment_status
//       };
//     }

//     res.json(response);

//   } catch (error) {
//     console.error('Check payment status error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to check payment status', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Get payment history (both order and standalone payments)
// export const getPaymentHistory = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { 
//       type = 'all', // 'all', 'order', 'standalone'
//       limit = 20, 
//       offset = 0, 
//       status,
//       startDate,
//       endDate 
//     } = req.query;

//     let query = `
//       SELECT p.*, o.order_number, o.status as order_status 
//       FROM payments p 
//       LEFT JOIN orders o ON p.order_id = o.id 
//       WHERE p.user_id = ?
//     `;
//     const params = [userId];

//     // Filter by type
//     if (type !== 'all') {
//       query += ' AND p.type = ?';
//       params.push(type);
//     }

//     // Filter by status
//     if (status) {
//       query += ' AND p.status = ?';
//       params.push(status);
//     }

//     // Filter by date range
//     if (startDate) {
//       query += ' AND p.created_at >= ?';
//       params.push(startDate);
//     }
//     if (endDate) {
//       query += ' AND p.created_at <= ?';
//       params.push(endDate);
//     }

//     query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
//     params.push(parseInt(limit), parseInt(offset));

//     const [payments] = await pool.execute(query, params);

//     // Get total count
//     let countQuery = 'SELECT COUNT(*) as total FROM payments WHERE user_id = ?';
//     const countParams = [userId];
    
//     if (type !== 'all') {
//       countQuery += ' AND type = ?';
//       countParams.push(type);
//     }
//     if (status) {
//       countQuery += ' AND status = ?';
//       countParams.push(status);
//     }

//     const [countResult] = await pool.execute(countQuery, countParams);

//     res.json({
//       success: true,
//       payments: payments.map(p => ({
//         id: p.id,
//         type: p.type,
//         provider: p.payment_method,
//         amount: p.amount,
//         currency: p.currency,
//         phoneNumber: p.phone_number,
//         status: p.status,
//         merchantReference: p.merchant_reference,
//         createdAt: p.created_at,
//         updatedAt: p.updated_at,
//         order: p.type === 'order_payment' ? {
//           orderId: p.order_id,
//           orderNumber: p.order_number,
//           status: p.order_status
//         } : null
//       })),
//       pagination: {
//         total: countResult[0].total,
//         limit: parseInt(limit),
//         offset: parseInt(offset)
//       }
//     });

//   } catch (error) {
//     console.error('Get payment history error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch payment history', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Get supported payment methods with dynamic filtering
// export const getSupportedPaymentMethods = async (req, res) => {
//   try {
//     const { countryCode = 'RW', type = 'all' } = req.query;
    
//     console.log('🌍 Getting supported payment methods:', { countryCode, type });

//     // Get supported methods from PawaPay
//     const supportedMethods = await pawapayService.getSupportedPaymentMethods(countryCode);

//     // Filter based on type if needed
//     let filteredMethods = supportedMethods;
//     if (type === 'order') {
//       // All methods work for orders
//     } else if (type === 'standalone') {
//       // All methods work for standalone too
//     }

//     // Map to provider information
//     const providers = filteredMethods.map(method => {
//       const config = pawapayConfig.paymentMethods[method] || method;
//       return {
//         id: method,
//         name: typeof config === 'string' ? config : config.name || method,
//         icon: typeof config === 'object' ? config.icon : getProviderIcon(method),
//         countries: typeof config === 'object' ? config.countries : [countryCode],
//         minAmount: typeof config === 'object' ? config.minAmount : 0.1,
//         maxAmount: typeof config === 'object' ? config.maxAmount : 10000,
//         supportedTypes: ['order_payment', 'standalone_payment']
//       };
//     });

//     res.json({
//       success: true,
//       country: countryCode,
//       providers,
//       defaultCurrency: 'USD'
//     });

//   } catch (error) {
//     console.error('Get payment methods error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to get payment methods',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Helper function to format phone numbers
// function formatPhoneForPawaPay(phone, countryCode = 'RW') {
//   if (!phone) return '';
  
//   let cleaned = phone.replace(/\D/g, '');
//   if (!cleaned) return '';
  
//   switch (countryCode) {
//     case 'RW': // Rwanda
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '250' + cleaned.substring(1);
//       } else if (cleaned.startsWith('7') && cleaned.length === 9) {
//         cleaned = '250' + cleaned;
//       }
//       break;
//     case 'KE': // Kenya
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '254' + cleaned.substring(1);
//       } else if (cleaned.startsWith('7') && cleaned.length === 9) {
//         cleaned = '254' + cleaned;
//       }
//       break;
//     case 'UG': // Uganda
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '256' + cleaned.substring(1);
//       } else if (cleaned.startsWith('7') && cleaned.length === 9) {
//         cleaned = '256' + cleaned;
//       }
//       break;
//     case 'TZ': // Tanzania
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '255' + cleaned.substring(1);
//       } else if ((cleaned.startsWith('6') || cleaned.startsWith('7')) && cleaned.length === 9) {
//         cleaned = '255' + cleaned;
//       }
//       break;
//     case 'GH': // Ghana
//       if (cleaned.startsWith('0') && cleaned.length === 10) {
//         cleaned = '233' + cleaned.substring(1);
//       } else if (cleaned.startsWith('5') && cleaned.length === 9) {
//         cleaned = '233' + cleaned;
//       }
//       break;
//   }
  
//   return '+' + cleaned;
// }

// function getProviderIcon(provider) {
//   const icons = {
//     momo: '📱',
//     airtel_money: '💳',
//     mpesa: '💰',
//     orange_money: '🍊',
//     tigo_pesa: '🐯',
//     vodacom_mpesa: '📶'
//   };
//   return icons[provider] || '💸';
// }




// backend/controllers/paymentController.js
import pool from '../config/database.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// PawaPay Configuration (from pawapayConfig.js)
const pawapayConfig = {
  baseUrl: process.env.PAWAPAY_BASE_URL || 'https://api.sandbox.pawapay.cloud',
  apiKey: process.env.PAWAPAY_API_KEY || 'mock_api_key_for_development',
  secretKey: process.env.PAWAPAY_SECRET_KEY || 'mock_secret_key_for_development',
  merchantId: process.env.PAWAPAY_MERCHANT_ID || 'mock_merchant_id',
  webhookSecret: process.env.PAWAPAY_WEBHOOK_SECRET || 'mock_webhook_secret',
  
  // Supported payment methods
  paymentMethods: {
    'momo': 'MTN Mobile Money',
    'airtel_money': 'Airtel Money',
    'mpesa': 'M-Pesa',
    'orange_money': 'Orange Money',
    'tigo_pesa': 'Tigo Pesa',
    'vodacom_mpesa': 'Vodacom M-Pesa'
  },
  
  // Country codes
  countries: {
    RWANDA: 'RW',
    KENYA: 'KE',
    TANZANIA: 'TZ',
    UGANDA: 'UG',
    GHANA: 'GH'
  }
};

// Currency mapping (from reference code)
const currencyLookup = {
    "BEN": "XOF", "CMR": "XAF", "CIV": "XOF", "COD": "CDF",
    "GHA": "GHS", "KEN": "KES", "MWI": "MWK", "RWA": "RWF",
    "SEN": "XOF", "TZA": "TZS", "UGA": "UGX", "ZMB": "ZMW"
};

// Correspondent mapping (Mobile Network Operators) - Extended for all countries
const correspondentLookup = {
    'momo': {  // MTN Mobile Money
        'GH': 'MTN_MOMO_GHA',
        'RW': 'MTN_MOMO_RWA', 
        'UG': 'MTN_MOMO_UGA',
        'KE': 'MTN_MOMO_KEN'
    },
    'airtel_money': {  // Airtel Money
        'GH': 'AIRTEL_MONEY_GHA',
        'RW': 'AIRTEL_MONEY_RWA',
        'UG': 'AIRTEL_MONEY_UGA',
        'TZ': 'AIRTEL_MONEY_TZA',
        'KE': 'AIRTEL_MONEY_KEN'
    },
    'mpesa': {  // M-Pesa
        'KE': 'MPESA_KEN',
        'TZ': 'VODACOM_MPESA_TZA'
    },
    'orange_money': {  // Orange Money
        'UG': 'ORANGE_MONEY_UGA'
    },
    'tigo_pesa': {  // Tigo Pesa
        'TZ': 'TIGO_PESA_TZA'
    },
    'vodacom_mpesa': {  // Vodacom M-Pesa
        'TZ': 'VODACOM_MPESA_TZA'
    }
};

// Status check backoff intervals (in seconds)
const statusBackOff = [0.1, 1, 15, 30, 90, 180];

// Deposit class (from reference)
class Deposit {
    constructor(amount, currency, correspondent, msisdn, description, country) {
        this.depositId = uuidv4();
        this.amount = amount;
        this.currency = currency;
        this.correspondent = correspondent;
        this.payer = {
            type: 'MSISDN',
            address: {
                value: msisdn
            }
        };
        this.statementDescription = description;
        this.customerTimestamp = new Date().toISOString();
        this.country = country;
    }
}

// Unified payment initiation using deposit API
export const initiatePayment = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { 
            type = 'standalone_payment',
            provider, // e.g., "momo", "airtel_money", "mpesa"
            phoneNumber, 
            amount, 
            country = 'RW',
            orderId,
            description = `Payment for ${type}`
        } = req.body;
        
        const userId = req.user?.id || 1; // Fallback for testing

        console.log('🚀 Initiating payment via deposit API:', { 
            type, provider, phoneNumber, amount, country, orderId 
        });

        // Validate required fields
        if (!provider || !phoneNumber || !amount) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: provider, phoneNumber, amount' 
            });
        }

        // Validate payment method exists in our config
        if (!pawapayConfig.paymentMethods[provider]) {
            return res.status(400).json({ 
                success: false,
                message: `Unsupported payment provider: ${provider}`,
                supportedMethods: Object.keys(pawapayConfig.paymentMethods)
            });
        }

        // Get currency from country (convert country code like 'RW' to 'RWA')
        const countryCode = Object.keys(pawapayConfig.countries).find(
            key => pawapayConfig.countries[key] === country
        ) || 'RWA';
        
        const currency = currencyLookup[countryCode];
        if (!currency) {
            return res.status(400).json({ 
                success: false,
                message: `Unsupported country: ${country}`,
                supportedCountries: Object.keys(currencyLookup).map(c => pawapayConfig.countries[c] || c)
            });
        }

        // Get correspondent from provider and country
        const correspondent = correspondentLookup[provider]?.[country];
        if (!correspondent) {
            return res.status(400).json({ 
                success: false,
                message: `Provider ${pawapayConfig.paymentMethods[provider]} not supported for country ${country}`,
                supported: Object.entries(correspondentLookup[provider] || {})
                    .map(([c]) => ({ country: c, provider: pawapayConfig.paymentMethods[provider] }))
            });
        }

        let paymentAmount = 0;
        let orderDetails = null;
        let customerName = req.user?.username || 'Customer';
        let customerEmail = req.user?.email || '';
        
        // Handle order payments
        if (type === 'order_payment') {
            if (!orderId) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Order ID is required for order payments' 
                });
            }

            // Get order details
            const [orders] = await connection.execute(
                `SELECT o.*, u.email, u.username, u.phone_number as user_phone
                 FROM orders o 
                 JOIN users u ON o.user_id = u.id 
                 WHERE o.id = ? AND o.user_id = ?`,
                [orderId, userId]
            );

            if (orders.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Order not found' 
                });
            }

            orderDetails = orders[0];
            paymentAmount = parseFloat(orderDetails.total_amount);
            customerName = orderDetails.username || customerName;
            customerEmail = orderDetails.email || customerEmail;
            
            // Validate order can be paid
            if (orderDetails.payment_status !== 'pending') {
                return res.status(400).json({ 
                    success: false,
                    message: `Order payment status is ${orderDetails.payment_status}, cannot initiate payment`
                });
            }
            
            // Extract customer information from shipping address
            try {
                const shippingAddress = typeof orderDetails.shipping_address === 'string' 
                    ? JSON.parse(orderDetails.shipping_address) 
                    : orderDetails.shipping_address;
                
                if (shippingAddress) {
                    if (shippingAddress.firstName && shippingAddress.lastName) {
                        customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`;
                    } else if (shippingAddress.name) {
                        customerName = shippingAddress.name;
                    }
                    if (shippingAddress.email) {
                        customerEmail = shippingAddress.email;
                    }
                }
            } catch (error) {
                console.error('Error parsing address for customer name:', error);
            }
            
        } else {
            // Handle standalone payments
            paymentAmount = parseFloat(amount);
            if (isNaN(paymentAmount) || paymentAmount <= 0) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid amount. Must be greater than 0' 
                });
            }
        }

        // Format phone number
        const formattedPhone = formatPhoneForPawaPay(phoneNumber, country);

        // Create deposit object
        const deposit = new Deposit(
            paymentAmount,
            currency,
            correspondent,
            formattedPhone,
            description || (type === 'order_payment' 
                ? `Payment for order ${orderDetails?.order_number}` 
                : `Payment of ${paymentAmount} ${currency}`),
            countryCode
        );

        console.log('📦 Deposit object created:', deposit);

        // Send deposit request
        let depositResponse;
        try {
            depositResponse = await sendDeposit(deposit);
            console.log('✅ Deposit sent successfully:', depositResponse.data);
        } catch (error) {
            console.error('❌ Deposit send error:', error.response?.data || error.message);
            await connection.rollback();
            return res.status(500).json({ 
                success: false,
                message: 'Failed to initiate payment with provider',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Payment gateway error'
            });
        }

        // Handle deposit response
        let status = "processing";
        let message = "";
        let pawaPayStatus = depositResponse.data.status;

        switch (pawaPayStatus) {
            case "ACCEPTED":
                status = "processing";
                message = "Payment request sent successfully";
                break;
            case "REJECTED":
                status = "failed";
                message = depositResponse.data.rejectionReason?.rejectionCode || "Payment rejected";
                break;
            case "DUPLICATE_IGNORED":
                status = "failed";
                message = "Duplicate payment request";
                break;
            default:
                status = "failed";
                message = "Unknown error from payment provider";
                break;
        }

        // Generate merchant reference
        const merchantReference = type === 'order_payment' && orderDetails 
            ? `ORDER_${orderDetails.order_number}_${Date.now()}`
            : `STANDALONE_${userId}_${Date.now()}`;

        // Store initial payment record
        const [paymentResult] = await connection.execute(
            `INSERT INTO payments 
             (user_id, order_id, type, payment_method, amount, currency, 
              deposit_id, merchant_reference, status, provider_response, phone_number,
              customer_name, customer_email, country) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                type === 'order_payment' ? orderId : null,
                type,
                provider,
                paymentAmount,
                currency,
                deposit.depositId,
                merchantReference,
                status,
                JSON.stringify({
                    ...depositResponse.data,
                    initialStatus: pawaPayStatus,
                    correspondent: correspondent,
                    country: country
                }),
                formattedPhone,
                customerName,
                customerEmail,
                country
            ]
        );

        // Update order if order payment
        if (type === 'order_payment' && orderDetails) {
            await connection.execute(
                'UPDATE orders SET payment_status = ?, status = ?, updated_at = NOW() WHERE id = ?',
                [status, status === 'processing' ? 'confirmed' : 'pending', orderId]
            );

            // Add to tracking history
            await connection.execute(
                `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    orderId,
                    status === 'processing' ? 'confirmed' : 'pending',
                    `Payment initiated via ${pawapayConfig.paymentMethods[provider]}`,
                    'Payment System',
                    userId
                ]
            );
        }

        // If deposit accepted, start async status checking
        if (pawaPayStatus === "ACCEPTED") {
            // Start background status checking
            setTimeout(async () => {
                try {
                    await checkDepositStatusWithRetry(
                        deposit, 
                        paymentResult.insertId, 
                        type, 
                        orderId, 
                        userId
                    );
                } catch (error) {
                    console.error('Background status check failed:', error);
                }
            }, 1000); // Start after 1 second
        }

        await connection.commit();

        // Return immediate response
        const response = {
            success: true,
            message: message,
            payment: {
                paymentId: paymentResult.insertId,
                depositId: deposit.depositId,
                status: status,
                amount: paymentAmount,
                currency: currency,
                phoneNumber: formattedPhone,
                provider: provider,
                providerName: pawapayConfig.paymentMethods[provider],
                country: country,
                pawaPayStatus: pawaPayStatus,
                merchantReference: merchantReference
            },
            instructions: [
                'Check your mobile device for payment request',
                'Payment status will update automatically',
                'You will receive a confirmation when payment is completed'
            ]
        };

        // Add order info if applicable
        if (type === 'order_payment' && orderDetails) {
            response.payment.order = {
                orderId: orderDetails.id,
                orderNumber: orderDetails.order_number,
                status: orderDetails.status,
                total: orderDetails.total_amount
            };
        }

        res.json(response);

    } catch (error) {
        await connection.rollback();
        console.error('💥 Payment initiation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to initiate payment', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    } finally {
        connection.release();
    }
};

// Async function to check deposit status with retry logic
// async function checkDepositStatusWithRetry(deposit, paymentId, type, orderId, userId) {
//     console.log(`🔍 Starting status check for deposit: ${deposit.depositId}`);
    
//     const connection = await pool.getConnection();
    
//     try {
//         let finalStatus = 'processing';
//         let finalMessage = '';

//         for (let i = 0; i < statusBackOff.length; i++) {
//             // Wait for backoff period
//             await sleep(statusBackOff[i]);
            
//             try {
//                 console.log(`⏰ Check ${i + 1}/${statusBackOff.length} after ${statusBackOff[i]}s`);
//                 const result = await checkDeposit(deposit);
                
//                 console.log(`📊 Status check result:`, result.data);

//                 if (result.data && result.data.length > 0) {
//                     const depositStatus = result.data[0].status;
                    
//                     switch (depositStatus) {
//                         case "COMPLETED":
//                             finalStatus = 'completed';
//                             finalMessage = 'Payment completed successfully';
//                             console.log(`✅ Deposit ${deposit.depositId} completed`);
//                             break;
//                         case "SUBMITTED":
//                             finalStatus = 'processing';
//                             finalMessage = 'Payment submitted, waiting for completion';
//                             break;
//                         case "FAILED":
//                             finalStatus = 'failed';
//                             finalMessage = result.data[0].failureReason?.failureMessage || 'Payment failed';
//                             console.log(`❌ Deposit ${deposit.depositId} failed`);
//                             break;
//                         case "ENQUEUED":
//                             finalStatus = 'pending';
//                             finalMessage = 'Payment enqueued, please wait';
//                             break;
//                         default:
//                             finalStatus = 'processing';
//                             finalMessage = `Unknown status: ${depositStatus}`;
//                     }

//                     // Update payment in database
//                     await connection.execute(
//                         `UPDATE payments 
//                          SET status = ?, updated_at = NOW(), 
//                              provider_response = JSON_MERGE_PATCH(provider_response, ?)
//                          WHERE id = ?`,
//                         [
//                             finalStatus,
//                             JSON.stringify({ 
//                                 finalStatus: finalStatus,
//                                 finalMessage: finalMessage,
//                                 latestCheck: new Date().toISOString(),
//                                 checkAttempt: i + 1,
//                                 depositStatus: depositStatus
//                             }),
//                             paymentId
//                         ]
//                     );

//                     // Update order if needed
//                     if (type === 'order_payment' && orderId) {
//                         let orderPaymentStatus = 'processing';
//                         let orderStatus = 'confirmed';
                        
//                         if (finalStatus === 'completed') {
//                             orderPaymentStatus = 'paid';
//                         } else if (finalStatus === 'failed') {
//                             orderPaymentStatus = 'failed';
//                             orderStatus = 'pending';
//                         }
                        
//                         await connection.execute(
//                             'UPDATE orders SET payment_status = ?, status = ?, updated_at = NOW() WHERE id = ?',
//                             [orderPaymentStatus, orderStatus, orderId]
//                         );

//                         // Add to tracking history
//                         await connection.execute(
//                             `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
//                              VALUES (?, ?, ?, ?, ?)`,
//                             [
//                                 orderId,
//                                 orderStatus,
//                                 `Payment ${finalStatus === 'completed' ? 'completed' : finalStatus} via ${deposit.correspondent}`,
//                                 'Payment System',
//                                 userId
//                             ]
//                         );

//                         // Restore stock if payment failed
//                         if (finalStatus === 'failed') {
//                             const [orderItems] = await connection.execute(
//                                 'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
//                                 [orderId]
//                             );

//                             for (const item of orderItems) {
//                                 await connection.execute(
//                                     'UPDATE products SET quantity = quantity + ? WHERE id = ?',
//                                     [item.quantity, item.product_id]
//                                 );

//                                 await connection.execute(
//                                     `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
//                                      VALUES (?, ?, ?, ?)`,
//                                     [
//                                         item.product_id,
//                                         item.quantity,
//                                         `Payment failed for order ${orderId}`,
//                                         userId
//                                     ]
//                                 );
//                             }
//                         }
//                     }

//                     if (finalStatus === 'completed' || finalStatus === 'failed') {
//                         break; // Exit loop for final statuses
//                     }
//                 }
//             } catch (error) {
//                 console.error(`⚠️ Status check error (attempt ${i + 1}):`, error.message);
//             }
//         }

//         if (finalStatus === 'processing') {
//             // If still processing after all retries, mark as timeout
//             await connection.execute(
//                 'UPDATE payments SET status = "timeout", updated_at = NOW() WHERE id = ?',
//                 [paymentId]
//             );
//             console.log(`⏰ Deposit ${deposit.depositId} status check timeout`);
//         }

//     } catch (error) {
//         console.error('Error in background status check:', error);
//     } finally {
//         connection.release();
//     }
// }

// Fix the checkDepositStatusWithRetry function - ensure it doesn't run indefinitely
async function checkDepositStatusWithRetry(deposit, paymentId, type, orderId, userId) {
    console.log(`🔍 Starting status check for deposit: ${deposit.depositId}`);
    
    const maxChecks = statusBackOff.length;
    let checksCompleted = 0;
    
    for (let i = 0; i < maxChecks; i++) {
        checksCompleted = i + 1;
        
        // Wait for backoff period
        await sleep(statusBackOff[i]);
        
        try {
            console.log(`⏰ Check ${checksCompleted}/${maxChecks} after ${statusBackOff[i]}s`);
            const result = await checkDeposit(deposit);
            
            if (result.data && result.data.length > 0) {
                const depositData = result.data[0];
                const depositStatus = depositData.status;
                
                // Update based on status
                await handleDepositStatusUpdate(
                    depositStatus, 
                    depositData, 
                    paymentId, 
                    type, 
                    orderId, 
                    userId, 
                    checksCompleted
                );
                
                // Stop checking if we have a final status
                if (['COMPLETED', 'FAILED', 'CANCELLED', 'REJECTED'].includes(depositStatus)) {
                    console.log(`✅ Final status reached: ${depositStatus}. Stopping checks.`);
                    break;
                }
            }
        } catch (error) {
            console.error(`⚠️ Status check error (attempt ${checksCompleted}):`, error.message);
            
            // Only fail on the last attempt
            if (checksCompleted === maxChecks) {
                await markPaymentAsTimeout(paymentId, type, orderId, userId);
            }
        }
    }
    
    // If we've done all checks and still not final, mark as timeout
    if (checksCompleted === maxChecks) {
        const currentStatus = await getCurrentPaymentStatus(paymentId);
        if (['processing', 'pending'].includes(currentStatus)) {
            await markPaymentAsTimeout(paymentId, type, orderId, userId);
        }
    }
}

async function getCurrentPaymentStatus(paymentId) {
    const [payments] = await pool.execute(
        'SELECT status FROM payments WHERE id = ?',
        [paymentId]
    );
    return payments[0]?.status || 'unknown';
}

async function markPaymentAsTimeout(paymentId, type, orderId, userId) {
    const connection = await pool.getConnection();
    
    try {
        await connection.execute(
            'UPDATE payments SET status = "timeout", updated_at = NOW() WHERE id = ?',
            [paymentId]
        );
        
        if (type === 'order_payment' && orderId) {
            await updateOrderStatus(connection, orderId, 'timeout', userId);
        }
        
        await connection.commit();
        console.log(`⏰ Payment ${paymentId} marked as timeout`);
    } catch (error) {
        await connection.rollback();
        console.error('Error marking payment as timeout:', error);
    } finally {
        connection.release();
    }
}

async function handleDepositStatusUpdate(status, data, paymentId, type, orderId, userId, attempt) {
    const connection = await pool.getConnection();
    
    try {
        let finalStatus = 'processing';
        let finalMessage = '';
        
        switch (status) {
            case "COMPLETED":
                finalStatus = 'completed';
                finalMessage = 'Payment completed successfully';
                break;
            case "SUBMITTED":
                finalStatus = 'processing';
                finalMessage = 'Payment submitted';
                break;
            case "FAILED":
                finalStatus = 'failed';
                finalMessage = data.failureReason?.failureMessage || 'Payment failed';
                break;
            case "ENQUEUED":
                finalStatus = 'pending';
                finalMessage = 'Payment enqueued';
                break;
            case "REJECTED":
                finalStatus = 'failed';
                finalMessage = data.rejectionReason?.rejectionCode || 'Payment rejected';
                break;
            case "CANCELLED":
                finalStatus = 'cancelled';
                finalMessage = 'Payment cancelled';
                break;
            default:
                finalStatus = 'processing';
                finalMessage = `Status: ${status}`;
        }
        
        // Update payment record
        await connection.execute(
            `UPDATE payments 
             SET status = ?, updated_at = NOW(), 
                 provider_response = JSON_MERGE_PATCH(COALESCE(provider_response, '{}'), ?)
             WHERE id = ?`,
            [
                finalStatus,
                JSON.stringify({ 
                    finalStatus: finalStatus,
                    finalMessage: finalMessage,
                    latestCheck: new Date().toISOString(),
                    checkAttempt: attempt,
                    depositStatus: status,
                    depositData: data
                }),
                paymentId
            ]
        );
        
        // Update order if applicable
        if (type === 'order_payment' && orderId) {
            await updateOrderStatus(connection, orderId, finalStatus, userId);
        }
        
        await connection.commit();
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}


async function updateOrderStatus(connection, orderId, paymentStatus, userId) {
    let orderPaymentStatus = 'processing';
    let orderStatus = 'confirmed';
    
    switch (paymentStatus) {
        case 'completed':
            orderPaymentStatus = 'paid';
            orderStatus = 'confirmed';
            break;
        case 'failed':
        case 'cancelled':
            orderPaymentStatus = paymentStatus;
            orderStatus = 'pending';
            await restoreOrderStock(connection, orderId, userId);
            break;
        case 'timeout':
            orderPaymentStatus = 'pending';
            orderStatus = 'pending';
            await restoreOrderStock(connection, orderId, userId);
            break;
    }
    
    await connection.execute(
        'UPDATE orders SET payment_status = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [orderPaymentStatus, orderStatus, orderId]
    );
    
    // Add tracking history
    await connection.execute(
        `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
         VALUES (?, ?, ?, ?, ?)`,
        [
            orderId,
            orderStatus,
            `Payment ${paymentStatus}`,
            'Payment System',
            userId
        ]
    );
}

async function restoreOrderStock(connection, orderId, userId) {
    const [orderItems] = await connection.execute(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [orderId]
    );

    for (const item of orderItems) {
        await connection.execute(
            'UPDATE products SET quantity = quantity + ? WHERE id = ?',
            [item.quantity, item.product_id]
        );

        await connection.execute(
            `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
             VALUES (?, ?, ?, ?)`,
            [
                item.product_id,
                item.quantity,
                `Payment failed for order ${orderId}`,
                userId
            ]
        );
    }
}


// Send deposit function (from reference)
// export const sendDeposit = async (deposit) => {
//     const config = {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.PAWAPAY_API_KEY || pawapayConfig.apiKey}`
//         }
//     };
    
//     const url = `${process.env.PAWAPAY_API_URL || pawapayConfig.baseUrl}/deposits`;
    
//     const dataBlock = {
//         depositId: deposit.depositId,
//         amount: deposit.amount.toString(),
//         currency: deposit.currency,
//         correspondent: deposit.correspondent,
//         payer: {
//             type: deposit.payer.type,
//             address: {
//                 value: deposit.payer.address.value,
//             }
//         },
//         customerTimestamp: deposit.customerTimestamp,
//         statementDescription: deposit.statementDescription
//     };
    
//     console.log('📤 Sending deposit to PawaPay:', { url, dataBlock });
//     return await axios.post(url, dataBlock, config);
// };



// Update sendDeposit function with retry logic
export const sendDeposit = async (deposit) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.PAWAPAY_API_KEY || pawapayConfig.apiKey}`
        },
        timeout: 30000 // 30 second timeout
    };
    
    const url = `${process.env.PAWAPAY_API_URL || pawapayConfig.baseUrl}/deposits`;
    
    const dataBlock = {
        depositId: deposit.depositId,
        amount: {
            amount: deposit.amount.toString(),
            currency: deposit.currency
        },
        correspondent: deposit.correspondent,
        payer: {
            type: deposit.payer.type,
            address: {
                value: deposit.payer.address.value,
            }
        },
        customerTimestamp: deposit.customerTimestamp,
        statementDescription: deposit.statementDescription
    };
    
    console.log('📤 Sending deposit to PawaPay:', { url, dataBlock });
    
    return await retryApiCall(async () => {
        return await axios.post(url, dataBlock, config);
    });
};

// Check deposit function (from reference)
// export const checkDeposit = async (deposit) => {
//     const config = {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.PAWAPAY_API_KEY || pawapayConfig.apiKey}`
//         }
//     };
    
//     const url = `${process.env.PAWAPAY_API_URL || pawapayConfig.baseUrl}/deposits/${deposit.depositId}`;
//     console.log('🔍 Checking deposit status:', url);
//     return await axios.get(url, config);
// };


// Update checkDeposit function
export const checkDeposit = async (deposit) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.PAWAPAY_API_KEY || pawapayConfig.apiKey}`
        },
        timeout: 10000
    };
    
    const url = `${process.env.PAWAPAY_API_URL || pawapayConfig.baseUrl}/deposits/${deposit.depositId}`;
    console.log('🔍 Checking deposit status:', url);
    
    return await axios.get(url, config);
};

// Add a function to properly format currency amounts
function formatCurrencyAmount(amount, currency) {
    // Convert to string and ensure it has proper decimal places
    const amountStr = parseFloat(amount).toFixed(2);
    return {
        amount: amountStr,
        currency: currency
    };
}

// // Sleep function (from reference)
// export const sleep = async (seconds) => {
//     await new Promise(resolve => setTimeout(resolve, seconds * 1000));
// };

// Add a retry mechanism for failed API calls
async function retryApiCall(apiCall, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;
            console.warn(`API call failed (attempt ${i + 1}/${maxRetries}):`, error.message);
            
            // Exponential backoff
            await sleep(Math.pow(2, i));
            
            if (i === maxRetries - 1) {
                throw lastError;
            }
        }
    }
}




// Update the sleep function to use milliseconds (the backoff array is in seconds)
export const sleep = async (seconds) => {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
// Check payment status endpoint (for both order and standalone)
export const checkPaymentStatus = async (req, res) => {
    try {
        const { type = 'payment', id } = req.params;
        const userId = req.user.id;

        console.log('🔍 Checking payment status:', { type, id, userId });

        let query = '';
        let params = [];

        if (type === 'order') {
            // Get payment for an order
            query = `
                SELECT p.*, o.order_number, o.status as order_status, o.payment_status as order_payment_status
                FROM payments p 
                JOIN orders o ON p.order_id = o.id 
                WHERE p.order_id = ? AND p.user_id = ? AND p.type = 'order_payment'
                ORDER BY p.created_at DESC LIMIT 1
            `;
            params = [id, userId];
        } else {
            // Get standalone payment by payment ID
            query = `
                SELECT p.* 
                FROM payments p 
                WHERE p.id = ? AND p.user_id = ? AND p.type = 'standalone_payment'
            `;
            params = [id, userId];
        }

        const [payments] = await pool.execute(query, params);

        if (payments.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Payment not found' 
            });
        }

        const payment = payments[0];
        
        // If payment is processing, check with PawaPay
        if (payment.status === 'processing' || payment.status === 'pending') {
            try {
                console.log('🔄 Checking payment status with PawaPay:', payment.deposit_id);
                
                const deposit = {
                    depositId: payment.deposit_id,
                    amount: payment.amount,
                    currency: payment.currency
                };
                
                const result = await checkDeposit(deposit);
                
                if (result.data && result.data.length > 0) {
                    const depositStatus = result.data[0].status;
                    let newStatus = payment.status;
                    
                    switch (depositStatus) {
                        case "COMPLETED":
                            newStatus = 'completed';
                            break;
                        case "FAILED":
                            newStatus = 'failed';
                            break;
                        case "ENQUEUED":
                            newStatus = 'pending';
                            break;
                        case "SUBMITTED":
                            newStatus = 'processing';
                            break;
                    }
                    
                    if (newStatus !== payment.status) {
                        await pool.execute(
                            'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
                            [newStatus, payment.id]
                        );
                        
                        // Update order if needed
                        if (payment.type === 'order_payment' && newStatus === 'completed') {
                            await pool.execute(
                                'UPDATE orders SET payment_status = "paid", status = "confirmed" WHERE id = ?',
                                [payment.order_id]
                            );
                        }
                        
                        payment.status = newStatus;
                    }
                }
            } catch (error) {
                console.error('Error checking PawaPay status:', error.message);
            }
        }

        // Parse provider response
        let providerResponse = {};
        try {
            if (payment.provider_response) {
                providerResponse = JSON.parse(payment.provider_response);
            }
        } catch (e) {
            console.error('Error parsing provider response:', e);
        }

        const response = {
            success: true,
            payment: {
                id: payment.id,
                type: payment.type,
                provider: payment.payment_method,
                providerName: pawapayConfig.paymentMethods[payment.payment_method] || payment.payment_method,
                amount: payment.amount,
                currency: payment.currency,
                phoneNumber: payment.phone_number,
                status: payment.status,
                depositId: payment.deposit_id,
                merchantReference: payment.merchant_reference,
                transactionId: payment.transaction_id,
                customerName: payment.customer_name,
                customerEmail: payment.customer_email,
                country: payment.country,
                createdAt: payment.created_at,
                updatedAt: payment.updated_at,
                providerResponse: providerResponse
            }
        };

        // Add order info if it's an order payment
        if (payment.type === 'order_payment') {
            response.payment.order = {
                orderId: payment.order_id,
                orderNumber: payment.order_number,
                status: payment.order_status,
                payment_status: payment.order_payment_status
            };
        }

        res.json(response);

    } catch (error) {
        console.error('Check payment status error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to check payment status', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Webhook handler for PawaPay callbacks
export const handlePaymentWebhook = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const signature = req.headers['x-pawapay-signature'] || req.headers['x-signature'];
        const timestamp = req.headers['x-pawapay-timestamp'] || req.headers['x-timestamp'];
        const webhookPayload = req.body;

        console.log('🔄 PawaPay Webhook Received:', {
            event: webhookPayload.event,
            depositId: webhookPayload.data?.depositId || webhookPayload.depositId,
            timestamp: new Date().toISOString()
        });

        // Validate webhook signature
        if (process.env.NODE_ENV === 'production' || process.env.VALIDATE_WEBHOOKS === 'true') {
            const isValid = validateWebhookSignature(webhookPayload, signature, timestamp);
            
            if (!isValid) {
                console.error('❌ Invalid webhook signature');
                await connection.rollback();
                connection.release();
                return res.status(401).json({ success: false, message: 'Invalid signature' });
            }
        }

        const { event, data } = webhookPayload;
        const depositId = data?.depositId || webhookPayload.depositId;
        
        if (!depositId) {
            console.error('❌ Missing depositId in webhook');
            await connection.rollback();
            connection.release();
            return res.status(400).json({ 
                success: false, 
                message: 'Missing depositId in webhook' 
            });
        }

        // Find payment by depositId
        const [payments] = await connection.execute(
            `SELECT p.*, o.id as order_id, o.order_number, o.user_id as order_user_id 
             FROM payments p 
             LEFT JOIN orders o ON p.order_id = o.id 
             WHERE p.deposit_id = ?`,
            [depositId]
        );

        if (payments.length === 0) {
            console.error('❌ Payment not found for deposit:', depositId);
            await connection.rollback();
            connection.release();
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        const payment = payments[0];
        let paymentStatus = payment.status;
        let orderPaymentStatus = payment.type === 'order_payment' ? 'processing' : null;
        let orderStatus = payment.type === 'order_payment' ? 'confirmed' : null;

        // Map webhook event to status
        switch (event) {
            case 'deposit.completed':
            case 'payment.completed':
                paymentStatus = 'completed';
                if (payment.type === 'order_payment') {
                    orderPaymentStatus = 'paid';
                    orderStatus = 'confirmed';
                }
                console.log(`✅ Payment completed for ${payment.type}`);
                break;
                
            case 'deposit.failed':
            case 'payment.failed':
                paymentStatus = 'failed';
                if (payment.type === 'order_payment') {
                    orderPaymentStatus = 'failed';
                    orderStatus = 'pending';
                }
                console.log(`❌ Payment failed for ${payment.type}`);
                break;
                
            case 'deposit.cancelled':
            case 'payment.cancelled':
                paymentStatus = 'cancelled';
                if (payment.type === 'order_payment') {
                    orderPaymentStatus = 'cancelled';
                    orderStatus = 'cancelled';
                }
                console.log(`🚫 Payment cancelled for ${payment.type}`);
                break;
                
            case 'deposit.processing':
            case 'payment.processing':
                paymentStatus = 'processing';
                console.log(`🔄 Payment processing for ${payment.type}`);
                break;
                
            default:
                console.log(`❓ Unhandled webhook event: ${event}`);
                paymentStatus = payment.status; // Keep current status
        }

        // Update payment record
        await connection.execute(
            `UPDATE payments 
             SET status = ?, provider_response = JSON_MERGE_PATCH(provider_response, ?), 
                 updated_at = NOW()
             WHERE id = ?`,
            [
                paymentStatus,
                JSON.stringify({
                    webhookEvent: event,
                    webhookData: webhookPayload,
                    webhookReceived: new Date().toISOString(),
                    webhookSignature: signature ? 'validated' : 'not_validated'
                }),
                payment.id
            ]
        );

        // Update order if this is an order payment
        if (payment.type === 'order_payment' && payment.order_id) {
            await connection.execute(
                'UPDATE orders SET payment_status = ?, status = ?, updated_at = NOW() WHERE id = ?',
                [orderPaymentStatus, orderStatus, payment.order_id]
            );

            // Add to tracking history
            await connection.execute(
                `INSERT INTO tracking_history 
                 (order_id, status, description, location, updated_by) 
                 VALUES (?, ?, ?, 'Payment System', ?)`,
                [payment.order_id, orderStatus, `Payment ${event} via webhook`, 1]
            );

            // Restore stock if payment failed/cancelled
            if (event.includes('failed') || event.includes('cancelled')) {
                const [orderItems] = await connection.execute(
                    'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
                    [payment.order_id]
                );

                for (const item of orderItems) {
                    await connection.execute(
                        'UPDATE products SET quantity = quantity + ? WHERE id = ?',
                        [item.quantity, item.product_id]
                    );

                    await connection.execute(
                        `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
                         VALUES (?, ?, ?, ?)`,
                        [
                            item.product_id,
                            item.quantity,
                            `Payment ${event} for order ${payment.order_id}`,
                            payment.user_id
                        ]
                    );
                }
            }
        }

        await connection.commit();
        console.log(`✅ Webhook processed successfully for ${payment.type}, deposit: ${depositId}`);

        res.json({ 
            success: true, 
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        await connection.rollback();
        console.error('💥 Webhook processing error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Webhook processing failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    } finally {
        connection.release();
    }
};

// Get payment history (both order and standalone payments)
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            type = 'all', // 'all', 'order', 'standalone'
            limit = 20, 
            offset = 0, 
            status,
            startDate,
            endDate 
        } = req.query;

        let query = `
            SELECT p.*, o.order_number, o.status as order_status 
            FROM payments p 
            LEFT JOIN orders o ON p.order_id = o.id 
            WHERE p.user_id = ?
        `;
        const params = [userId];

        // Filter by type
        if (type !== 'all') {
            query += ' AND p.type = ?';
            params.push(type);
        }

        // Filter by status
        if (status) {
            query += ' AND p.status = ?';
            params.push(status);
        }

        // Filter by date range
        if (startDate) {
            query += ' AND p.created_at >= ?';
            params.push(startDate);
        }
        if (endDate) {
            query += ' AND p.created_at <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [payments] = await pool.execute(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM payments WHERE user_id = ?';
        const countParams = [userId];
        
        if (type !== 'all') {
            countQuery += ' AND type = ?';
            countParams.push(type);
        }
        if (status) {
            countQuery += ' AND status = ?';
            countParams.push(status);
        }

        const [countResult] = await pool.execute(countQuery, countParams);

        res.json({
            success: true,
            payments: payments.map(p => ({
                id: p.id,
                type: p.type,
                provider: p.payment_method,
                providerName: pawapayConfig.paymentMethods[p.payment_method] || p.payment_method,
                amount: p.amount,
                currency: p.currency,
                phoneNumber: p.phone_number,
                status: p.status,
                depositId: p.deposit_id,
                merchantReference: p.merchant_reference,
                createdAt: p.created_at,
                updatedAt: p.updated_at,
                order: p.type === 'order_payment' ? {
                    orderId: p.order_id,
                    orderNumber: p.order_number,
                    status: p.order_status
                } : null
            })),
            pagination: {
                total: countResult[0].total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });

    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch payment history', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get supported payment methods with dynamic filtering
export const getSupportedPaymentMethods = async (req, res) => {
    try {
        const { countryCode = 'RW', type = 'all' } = req.query;
        
        console.log('🌍 Getting supported payment methods:', { countryCode, type });

        // Get currency for country
        const countryKey = Object.keys(pawapayConfig.countries).find(
            key => pawapayConfig.countries[key] === countryCode
        ) || 'RWA';
        
        const currency = currencyLookup[countryKey] || 'RWF';

        // Get available providers for the country
        const providers = [];
        for (const [provider, config] of Object.entries(pawapayConfig.paymentMethods)) {
            if (correspondentLookup[provider]?.[countryCode]) {
                providers.push({
                    id: provider,
                    name: config,
                    icon: getProviderIcon(provider),
                    correspondent: correspondentLookup[provider][countryCode],
                    countries: [countryCode],
                    currency: currency,
                    minAmount: 0.1,
                    maxAmount: 10000,
                    supportedTypes: ['order_payment', 'standalone_payment']
                });
            }
        }

        res.json({
            success: true,
            country: countryCode,
            currency: currency,
            providers: providers,
            defaultCurrency: currency,
            message: providers.length > 0 
                ? `${providers.length} payment methods available` 
                : 'No payment methods available for this country'
        });

    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to get payment methods',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Validate webhook signature
// function validateWebhookSignature(payload, signature, timestamp) {
//     if (!signature || !timestamp) {
//         console.warn('Missing signature or timestamp in webhook');
//         return false;
//     }

//     const secret = process.env.PAWAPAY_WEBHOOK_SECRET || pawapayConfig.webhookSecret;
//     const expectedSignature = crypto
//         .createHmac('sha256', secret)
//         .update(timestamp + JSON.stringify(payload))
//         .digest('hex');

//     return crypto.timingSafeEqual(
//         Buffer.from(signature, 'hex'),
//         Buffer.from(expectedSignature, 'hex')
//     );
// }



// Fix the validateWebhookSignature function (it was missing crypto import and had issues)
function validateWebhookSignature(payload, signature, timestamp) {
    if (!signature || !timestamp) {
        console.warn('Missing signature or timestamp in webhook');
        return false;
    }

    const secret = process.env.PAWAPAY_WEBHOOK_SECRET || pawapayConfig.webhookSecret;
    if (!secret) {
        console.warn('Webhook secret not configured');
        return false;
    }

    try {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(timestamp + JSON.stringify(payload))
            .digest('hex');

        // Use constant-time comparison to prevent timing attacks
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
    }
}

// Helper function to format phone numbers
function formatPhoneForPawaPay(phone, countryCode = 'RW') {
    if (!phone) return '';
    
    let cleaned = phone.replace(/\D/g, '');
    if (!cleaned) return '';
    
    // Remove leading + if present
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
    }
    
    // Ensure the number starts with country code
    switch (countryCode) {
        case 'RW': // Rwanda
            if (cleaned.startsWith('250')) {
                return `+${cleaned}`;
            } else if (cleaned.startsWith('0') && cleaned.length === 10) {
                return `+250${cleaned.substring(1)}`;
            } else if (cleaned.startsWith('7') && cleaned.length === 9) {
                return `+250${cleaned}`;
            }
            break;
        case 'KE': // Kenya
            if (cleaned.startsWith('254')) {
                return `+${cleaned}`;
            } else if (cleaned.startsWith('0') && cleaned.length === 10) {
                return `+254${cleaned.substring(1)}`;
            } else if (cleaned.startsWith('7') && cleaned.length === 9) {
                return `+254${cleaned}`;
            }
            break;
        case 'UG': // Uganda
            if (cleaned.startsWith('256')) {
                return `+${cleaned}`;
            } else if (cleaned.startsWith('0') && cleaned.length === 10) {
                return `+256${cleaned.substring(1)}`;
            } else if (cleaned.startsWith('7') && cleaned.length === 9) {
                return `+256${cleaned}`;
            }
            break;
        case 'TZ': // Tanzania
            if (cleaned.startsWith('255')) {
                return `+${cleaned}`;
            } else if (cleaned.startsWith('0') && cleaned.length === 10) {
                return `+255${cleaned.substring(1)}`;
            } else if ((cleaned.startsWith('6') || cleaned.startsWith('7')) && cleaned.length === 9) {
                return `+255${cleaned}`;
            }
            break;
        case 'GH': // Ghana
            if (cleaned.startsWith('233')) {
                return `+${cleaned}`;
            } else if (cleaned.startsWith('0') && cleaned.length === 10) {
                return `+233${cleaned.substring(1)}`;
            } else if (cleaned.startsWith('5') && cleaned.length === 9) {
                return `+233${cleaned}`;
            }
            break;
    }
    
    // If no pattern matches, return as is with +
    return `+${cleaned}`;
}

function getProviderIcon(provider) {
    const icons = {
        'momo': '📱',
        'airtel_money': '💳',
        'mpesa': '💰',
        'orange_money': '🍊',
        'tigo_pesa': '🐯',
        'vodacom_mpesa': '📶'
    };
    return icons[provider] || '💸';
}

// Export config for use in other files
export { pawapayConfig };