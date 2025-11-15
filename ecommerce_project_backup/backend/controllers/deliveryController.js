// backend/controllers/deliveryController.js
import pool from '../config/database.js';
// import { sendSMS, sendEmail } from '../services/notificationService.js';
// import { uploadToCloudinary } from '../services/fileUploadService.js';

// Try to import services, but provide fallbacks if they don't exist
let sendSMS, sendEmail, uploadToCloudinary;

try {
  const notificationService = await import('../services/notificationService.js');
  sendSMS = notificationService.sendSMS;
  sendEmail = notificationService.sendEmail;
} catch (error) {
  console.warn('Notification service not found, using mock functions');
  sendSMS = async () => ({ success: true, message: 'Mock SMS sent' });
  sendEmail = async () => ({ success: true, message: 'Mock email sent' });
}

try {
  const fileUploadService = await import('../services/fileUploadService.js');
  uploadToCloudinary = fileUploadService.uploadToCloudinary;
} catch (error) {
  console.warn('File upload service not found, using mock function');
  uploadToCloudinary = async () => ({
    secure_url: 'https://example.com/mock-upload.jpg',
    public_id: 'mock-file-id'
  });
}



// export const initiateDelivery = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const { orderId } = req.params;
//     const { carrier, trackingNumber, estimatedDelivery } = req.body;
//     const userId = req.user.id;

//     // Verify order exists and belongs to seller or admin has access
//     const [orders] = await connection.execute(
//       `SELECT o.*, p.seller_id 
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE o.id = ? AND (p.seller_id = ? OR ? = 'admin')
//        GROUP BY o.id`,
//       [orderId, userId, req.user.role]
//     );

//     if (orders.length === 0) {
//       await connection.rollback();
//       return res.status(404).json({ message: 'Order not found or unauthorized' });
//     }

//     const order = orders[0];

//     // Check if order is ready for shipping
//     if (order.status !== 'confirmed' && order.status !== 'paid') {
//       await connection.rollback();
//       return res.status(400).json({ 
//         message: 'Order must be confirmed or paid before shipping' 
//       });
//     }

//     // Generate OTP for delivery verification
//     const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Create delivery tracking record
//     const [trackingResult] = await connection.execute(
//       `INSERT INTO delivery_tracking 
//        (order_id, tracking_number, carrier, estimated_delivery, status) 
//        VALUES (?, ?, ?, ?, 'picked_up')`,
//       [orderId, trackingNumber, carrier, estimatedDelivery]
//     );

//     const trackingId = trackingResult.insertId;

//     // Create OTP proof record
//     await connection.execute(
//       `INSERT INTO delivery_proofs 
//        (order_id, tracking_id, proof_type, proof_data) 
//        VALUES (?, ?, 'otp', ?)`,
//       [orderId, trackingId, JSON.stringify({ otp: deliveryOtp, verified: false })]
//     );

//     // Update order status
//     await connection.execute(
//       'UPDATE orders SET status = "shipped", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [orderId]
//     );

//     // Add to tracking history
//     await connection.execute(
//       `INSERT INTO tracking_history 
//        (order_id, status, description, location, updated_by) 
//        VALUES (?, 'shipped', 'Order has been shipped and is in transit', 'Distribution Center', ?)`,
//       [orderId, userId]
//     );

//     // Get customer contact info
//     const [customer] = await connection.execute(
//       `SELECT u.email, u.phone, o.shipping_address 
//        FROM users u 
//        JOIN orders o ON u.id = o.user_id 
//        WHERE o.id = ?`,
//       [orderId]
//     );

//     if (customer.length > 0) {
//       const customerInfo = customer[0];
//       const shippingAddress = JSON.parse(customerInfo.shipping_address);

//       // Send shipping notification with OTP
//       await sendSMS({
//         to: customerInfo.phone,
//         message: `Your order #${order.order_number} has been shipped. Tracking: ${trackingNumber}. Delivery OTP: ${deliveryOtp}. Please keep this OTP ready for delivery.`
//       });

//       await sendEmail({
//         to: customerInfo.email,
//         subject: `Order Shipped - ${order.order_number}`,
//         template: 'orderShipped',
//         data: {
//           orderNumber: order.order_number,
//           trackingNumber,
//           carrier,
//           estimatedDelivery,
//           otp: deliveryOtp,
//           customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`
//         }
//       });
//     }

//     await connection.commit();

//     res.status(200).json({
//       message: 'Delivery initiated successfully',
//       trackingId,
//       trackingNumber,
//       deliveryOtp, // Only returned for testing/demo purposes
//       estimatedDelivery
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Initiate delivery error:', error);
//     res.status(500).json({ 
//       message: 'Server error initiating delivery', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

export const initiateDelivery = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { orderId } = req.params;
    const { carrier, trackingNumber, estimatedDelivery } = req.body;
    const userId = req.user.id;

    // Verify order exists and belongs to seller or admin has access
    const [orders] = await connection.execute(
      `SELECT o.*, p.seller_id 
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND (p.seller_id = ? OR ? = 'admin')
       GROUP BY o.id`,
      [orderId, userId, req.user.role]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    const order = orders[0];

    // Check if order is ready for shipping
    if (order.status !== 'confirmed' && order.status !== 'paid') {
      await connection.rollback();
      return res.status(400).json({ 
        message: 'Order must be confirmed or paid before shipping' 
      });
    }

    // Generate OTP for delivery verification
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create delivery tracking record
    const [trackingResult] = await connection.execute(
      `INSERT INTO delivery_tracking 
       (order_id, tracking_number, carrier, estimated_delivery, status) 
       VALUES (?, ?, ?, ?, 'picked_up')`,
      [orderId, trackingNumber, carrier, estimatedDelivery]
    );

    const trackingId = trackingResult.insertId;

    // Create OTP proof record
    await connection.execute(
      `INSERT INTO delivery_proofs 
       (order_id, tracking_id, proof_type, proof_data) 
       VALUES (?, ?, 'otp', ?)`,
      [orderId, trackingId, JSON.stringify({ otp: deliveryOtp, verified: false })]
    );

    // Update order status
    await connection.execute(
      'UPDATE orders SET status = "shipped", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [orderId]
    );

    // Add to tracking history
    await connection.execute(
      `INSERT INTO tracking_history 
       (order_id, status, description, location, updated_by) 
       VALUES (?, 'shipped', 'Order has been shipped and is in transit', 'Distribution Center', ?)`,
      [orderId, userId]
    );

    // Get customer contact info
    const [customer] = await connection.execute(
      `SELECT u.email, u.phone, o.shipping_address 
       FROM users u 
       JOIN orders o ON u.id = o.user_id 
       WHERE o.id = ?`,
      [orderId]
    );

    if (customer.length > 0) {
      const customerInfo = customer[0];
      const shippingAddress = JSON.parse(customerInfo.shipping_address);

      // Send shipping notification with OTP (mock for now)
      await sendSMS({
        to: customerInfo.phone,
        message: `Your order #${order.order_number} has been shipped. Tracking: ${trackingNumber}. Delivery OTP: ${deliveryOtp}. Please keep this OTP ready for delivery.`
      });

      await sendEmail({
        to: customerInfo.email,
        subject: `Order Shipped - ${order.order_number}`,
        template: 'orderShipped',
        data: {
          orderNumber: order.order_number,
          trackingNumber,
          carrier,
          estimatedDelivery,
          otp: deliveryOtp,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`
        }
      });
    }

    await connection.commit();

    res.status(200).json({
      message: 'Delivery initiated successfully',
      trackingId,
      trackingNumber,
      deliveryOtp, // Only returned for testing/demo purposes
      estimatedDelivery
    });

  } catch (error) {
    await connection.rollback();
    console.error('Initiate delivery error:', error);
    res.status(500).json({ 
      message: 'Server error initiating delivery', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// ... rest of your deliveryController.js functions remain the same
// Just make sure to use the imported services


export const updateDeliveryStatus = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { status, location, notes } = req.body;
    const userId = req.user.id;

    const validStatuses = ['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid delivery status', 
        validStatuses 
      });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update delivery tracking
      const [result] = await connection.execute(
        `UPDATE delivery_tracking 
         SET status = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [status, trackingId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Tracking record not found' });
      }

      // Get order ID for tracking history
      const [tracking] = await connection.execute(
        'SELECT order_id FROM delivery_tracking WHERE id = ?',
        [trackingId]
      );

      const orderId = tracking[0].order_id;

      // Add to tracking history
      const statusDescriptions = {
        'in_transit': 'Package is in transit to destination',
        'out_for_delivery': 'Package is out for delivery',
        'delivered': 'Package has been delivered',
        'failed': 'Delivery attempt failed'
      };

      await connection.execute(
        `INSERT INTO tracking_history 
         (order_id, status, description, location, notes, updated_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          status,
          statusDescriptions[status] || 'Delivery status updated',
          location || 'In Transit',
          notes,
          userId
        ]
      );

      // If delivered, update order status
      if (status === 'delivered') {
        await connection.execute(
          'UPDATE orders SET status = "delivered", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [orderId]
        );

        await connection.execute(
          'UPDATE delivery_tracking SET actual_delivery = CURRENT_TIMESTAMP WHERE id = ?',
          [trackingId]
        );
      }

      await connection.commit();

      res.json({ 
        message: 'Delivery status updated successfully',
        status,
        trackingId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ 
      message: 'Server error updating delivery status', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const verifyDeliveryWithOTP = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { orderId } = req.params;
    const { otp, deliveryPersonId } = req.body;

    // Verify OTP
    const [proofs] = await connection.execute(
      `SELECT dp.*, dt.tracking_number 
       FROM delivery_proofs dp
       JOIN delivery_tracking dt ON dp.tracking_id = dt.id
       WHERE dp.order_id = ? AND dp.proof_type = 'otp' AND dt.status != 'delivered'`,
      [orderId]
    );

    if (proofs.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'No pending delivery found for this order' });
    }

    const proof = proofs[0];
    const proofData = JSON.parse(proof.proof_data);

    if (proofData.otp !== otp) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (proofData.verified) {
      await connection.rollback();
      return res.status(400).json({ message: 'OTP already used' });
    }

    // Mark OTP as verified
    await connection.execute(
      `UPDATE delivery_proofs 
       SET proof_data = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [JSON.stringify({ ...proofData, verified: true }), deliveryPersonId, proof.id]
    );

    // Update delivery status to delivered
    await connection.execute(
      `UPDATE delivery_tracking 
       SET status = 'delivered', actual_delivery = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [proof.tracking_id]
    );

    // Update order status
    await connection.execute(
      'UPDATE orders SET status = "delivered", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [orderId]
    );

    // Add to tracking history
    await connection.execute(
      `INSERT INTO tracking_history 
       (order_id, status, description, location, notes, updated_by) 
       VALUES (?, 'delivered', 'Order delivered and verified with OTP', 'Customer Location', 'OTP verification successful', ?)`,
      [orderId, deliveryPersonId]
    );

    // Get order details for notification
    const [orders] = await connection.execute(
      `SELECT o.*, u.email, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [orderId]
    );

    if (orders.length > 0) {
      const order = orders[0];
      
      // Send delivery confirmation to customer
      await sendEmail({
        to: order.email,
        subject: `Order Delivered - ${order.order_number}`,
        template: 'orderDelivered',
        data: {
          orderNumber: order.order_number,
          deliveryDate: new Date().toLocaleDateString()
        }
      });
    }

    await connection.commit();

    res.json({ 
      message: 'Delivery verified successfully',
      orderId,
      trackingNumber: proof.tracking_number
    });

  } catch (error) {
    await connection.rollback();
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      message: 'Server error verifying delivery', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// export const uploadDeliveryProof = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { proofType, notes, location } = req.body;
//     const userId = req.user.id;

//     if (!req.file) {
//       return res.status(400).json({ message: 'Proof file is required' });
//     }

//     const connection = await pool.getConnection();
    
//     try {
//       await connection.beginTransaction();

//       // Upload file to cloud storage
//       const uploadResult = await uploadToCloudinary(req.file, 'delivery-proofs');

//       // Get tracking ID
//       const [tracking] = await connection.execute(
//         'SELECT id FROM delivery_tracking WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
//         [orderId]
//       );

//       if (tracking.length === 0) {
//         await connection.rollback();
//         return res.status(404).json({ message: 'No tracking found for this order' });
//       }

//       const trackingId = tracking[0].id;

//       // Create delivery proof record
//       await connection.execute(
//         `INSERT INTO delivery_proofs 
//          (order_id, tracking_id, proof_type, proof_data, verified_by) 
//          VALUES (?, ?, ?, ?, ?)`,
//         [
//           orderId,
//           trackingId,
//           proofType,
//           JSON.stringify({
//             fileUrl: uploadResult.secure_url,
//             publicId: uploadResult.public_id,
//             uploadedAt: new Date().toISOString(),
//             location: location || null,
//             notes: notes || null
//           }),
//           userId
//         ]
//       );

//       // If this is a photo proof and delivery isn't marked as delivered yet
//       if (proofType === 'photo') {
//         await connection.execute(
//           `UPDATE delivery_tracking 
//            SET status = 'delivered', actual_delivery = CURRENT_TIMESTAMP,
//            proof_of_delivery = JSON_OBJECT('photo_provided', true, 'verified_by', ?)
//            WHERE id = ?`,
//           [userId, trackingId]
//         );

//         await connection.execute(
//           'UPDATE orders SET status = "delivered", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//           [orderId]
//         );

//         // Add to tracking history
//         await connection.execute(
//           `INSERT INTO tracking_history 
//            (order_id, status, description, location, notes, updated_by) 
//            VALUES (?, 'delivered', 'Order delivered with photo proof', 'Customer Location', 'Photo evidence provided', ?)`,
//           [orderId, userId]
//         );
//       }

//       await connection.commit();

//       res.json({ 
//         message: 'Delivery proof uploaded successfully',
//         proofType,
//         fileUrl: uploadResult.secure_url,
//         orderId
//       });

//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }

//   } catch (error) {
//     console.error('Upload delivery proof error:', error);
//     res.status(500).json({ 
//       message: 'Server error uploading delivery proof', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };
export const uploadDeliveryProof = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { proofType, notes, location } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Proof file is required' });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Upload file to cloud storage (mock for now)
      const uploadResult = await uploadToCloudinary(req.file, 'delivery-proofs');

      // Get tracking ID
      const [tracking] = await connection.execute(
        'SELECT id FROM delivery_tracking WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
        [orderId]
      );

      if (tracking.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'No tracking found for this order' });
      }

      const trackingId = tracking[0].id;

      // Create delivery proof record
      await connection.execute(
        `INSERT INTO delivery_proofs 
         (order_id, tracking_id, proof_type, proof_data, verified_by) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          trackingId,
          proofType,
          JSON.stringify({
            fileUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            uploadedAt: new Date().toISOString(),
            location: location || null,
            notes: notes || null
          }),
          userId
        ]
      );

      // If this is a photo proof and delivery isn't marked as delivered yet
      if (proofType === 'photo') {
        await connection.execute(
          `UPDATE delivery_tracking 
           SET status = 'delivered', actual_delivery = CURRENT_TIMESTAMP,
           proof_of_delivery = JSON_OBJECT('photo_provided', true, 'verified_by', ?)
           WHERE id = ?`,
          [userId, trackingId]
        );

        await connection.execute(
          'UPDATE orders SET status = "delivered", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [orderId]
        );

        // Add to tracking history
        await connection.execute(
          `INSERT INTO tracking_history 
           (order_id, status, description, location, notes, updated_by) 
           VALUES (?, 'delivered', 'Order delivered with photo proof', 'Customer Location', 'Photo evidence provided', ?)`,
          [orderId, userId]
        );
      }

      await connection.commit();

      res.json({ 
        message: 'Delivery proof uploaded successfully',
        proofType,
        fileUrl: uploadResult.secure_url,
        orderId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Upload delivery proof error:', error);
    res.status(500).json({ 
      message: 'Server error uploading delivery proof', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
export const getDeliveryProofs = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    // Verify order access
    let query = `
      SELECT o.* FROM orders o 
      WHERE o.id = ?
    `;
    const params = [orderId];

    if (role !== 'admin') {
      query += ' AND (o.user_id = ? OR EXISTS (SELECT 1 FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id AND p.seller_id = ?))';
      params.push(userId, userId);
    }

    const [orders] = await pool.execute(query, params);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    // Get delivery proofs
    const [proofs] = await pool.execute(
      `SELECT dp.*, dt.tracking_number, u.username as verified_by_name
       FROM delivery_proofs dp
       JOIN delivery_tracking dt ON dp.tracking_id = dt.id
       LEFT JOIN users u ON dp.verified_by = u.id
       WHERE dp.order_id = ?
       ORDER BY dp.created_at DESC`,
      [orderId]
    );

    // Parse proof data
    const proofsWithData = proofs.map(proof => ({
      ...proof,
      proof_data: JSON.parse(proof.proof_data)
    }));

    res.json({ 
      orderId,
      proofs: proofsWithData
    });

  } catch (error) {
    console.error('Get delivery proofs error:', error);
    res.status(500).json({ 
      message: 'Server error fetching delivery proofs', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const recordDeliveryAttempt = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { status, reason, notes, location, attemptDate } = req.body;
    const userId = req.user.id;

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get current attempt number
      const [attempts] = await connection.execute(
        'SELECT COUNT(*) as attempt_count FROM delivery_attempts WHERE tracking_id = ?',
        [trackingId]
      );

      const attemptNumber = attempts[0].attempt_count + 1;

      // Record delivery attempt
      await connection.execute(
        `INSERT INTO delivery_attempts 
         (tracking_id, attempt_number, attempt_date, status, reason, location_data, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          trackingId,
          attemptNumber,
          attemptDate || new Date(),
          status,
          reason,
          JSON.stringify(location || {}),
          notes
        ]
      );

      // Update tracking status if failed
      if (status === 'failed') {
        await connection.execute(
          'UPDATE delivery_tracking SET status = "failed", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [trackingId]
        );

        // Get order ID for notification
        const [tracking] = await connection.execute(
          'SELECT order_id FROM delivery_tracking WHERE id = ?',
          [trackingId]
        );

        if (tracking.length > 0) {
          const orderId = tracking[0].order_id;

          // Add to tracking history
          await connection.execute(
            `INSERT INTO tracking_history 
             (order_id, status, description, location, notes, updated_by) 
             VALUES (?, 'failed', 'Delivery attempt failed', 'Customer Location', ?, ?)`,
            [orderId, reason || 'Delivery attempt unsuccessful', userId]
          );

          // Notify customer about failed delivery attempt
          const [order] = await connection.execute(
            `SELECT o.*, u.email, u.phone 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             WHERE o.id = ?`,
            [orderId]
          );

          if (order.length > 0) {
            await sendSMS({
              to: order[0].phone,
              message: `Delivery attempt failed for your order #${order[0].order_number}. Reason: ${reason}. We will try again tomorrow.`
            });
          }
        }
      }

      await connection.commit();

      res.json({ 
        message: 'Delivery attempt recorded successfully',
        attemptNumber,
        status,
        trackingId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Record delivery attempt error:', error);
    res.status(500).json({ 
      message: 'Server error recording delivery attempt', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};