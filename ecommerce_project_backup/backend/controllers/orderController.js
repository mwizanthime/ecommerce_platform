// // backend/controllers/orderController.js
// import pool from '../config/database.js';

// export const createOrder = async (req, res) => {
//   try {
//     const { shippingAddress, billingAddress, paymentMethod } = req.body;
//     const userId = req.user.id;

//     // Get user's cart
//     const [carts] = await pool.execute(
//       'SELECT id FROM cart WHERE user_id = ?',
//       [userId]
//     );

//     if (carts.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     const cartId = carts[0].id;

//     // Get cart items
//     const [cartItems] = await pool.execute(
//       `SELECT ci.product_id, ci.quantity, p.price, p.name, p.quantity as stock_quantity
//        FROM cart_items ci
//        JOIN products p ON ci.product_id = p.id
//        WHERE ci.cart_id = ?`,
//       [cartId]
//     );

//     if (cartItems.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Check stock and calculate total
//     let total = 0;
//     for (const item of cartItems) {
//       if (item.quantity > item.stock_quantity) {
//         return res.status(400).json({ 
//           message: `Insufficient stock for ${item.name}` 
//         });
//       }
//       total += item.price * item.quantity;
//     }

//     // Generate order number
//     const orderNumber = 'ORD' + Date.now();

//     // Start transaction
//     const connection = await pool.getConnection();
//     await connection.beginTransaction();

//     try {
//       // Create order
//       const [orderResult] = await connection.execute(
//         `INSERT INTO orders (user_id, order_number, total_amount, payment_method, 
//          shipping_address, billing_address, payment_status) 
//          VALUES (?, ?, ?, ?, ?, ?, 'paid')`,
//         [userId, orderNumber, total, paymentMethod, 
//          JSON.stringify(shippingAddress), JSON.stringify(billingAddress)]
//       );

//       const orderId = orderResult.insertId;

//       // Create order items and update product quantities
//       for (const item of cartItems) {
//         await connection.execute(
//           'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
//           [orderId, item.product_id, item.quantity, item.price]
//         );

//         // Update product stock
//         await connection.execute(
//           'UPDATE products SET quantity = quantity - ? WHERE id = ?',
//           [item.quantity, item.product_id]
//         );
//       }

//       // Clear cart
//       await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

//       await connection.commit();

//       res.status(201).json({ 
//         message: 'Order created successfully', 
//         orderId,
//         orderNumber 
//       });

//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }

//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const role = req.user.role;

//     let query = `
//       SELECT o.*, COUNT(oi.id) as item_count
//       FROM orders o
//       LEFT JOIN order_items oi ON o.id = oi.order_id
//     `;

//     if (role !== 'admin') {
//       query += ' WHERE o.user_id = ?';
//     }

//     query += ' GROUP BY o.id ORDER BY o.created_at DESC';

//     const [orders] = await pool.execute(query, role !== 'admin' ? [userId] : []);

//     res.json({ orders });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const role = req.user.role;

//     let query = 'SELECT * FROM orders WHERE id = ?';
//     const params = [id];

//     if (role !== 'admin') {
//       query += ' AND user_id = ?';
//       params.push(userId);
//     }

//     const [orders] = await pool.execute(query, params);

//     if (orders.length === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const [orderItems] = await pool.execute(
//       `SELECT oi.*, p.name as product_name, 
//               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
//        FROM order_items oi
//        JOIN products p ON oi.product_id = p.id
//        WHERE oi.order_id = ?`,
//       [id]
//     );

//     res.json({
//       ...orders[0],
//       items: orderItems,
//       shipping_address: JSON.parse(orders[0].shipping_address),
//       billing_address: JSON.parse(orders[0].billing_address)
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const [result] = await pool.execute(
//       'UPDATE orders SET status = ? WHERE id = ?',
//       [status, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.json({ message: 'Order status updated' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };



// // backend/controllers/orderController.js
// import pool from '../config/database.js';

// export const createOrder = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const { shippingAddress, billingAddress, paymentMethod } = req.body;
//     const userId = req.user.id;

//     // Get user's cart
//     const [carts] = await connection.execute(
//       'SELECT id FROM cart WHERE user_id = ?',
//       [userId]
//     );

//     if (carts.length === 0) {
//       await connection.rollback();
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     const cartId = carts[0].id;

//     // Get cart items with product details
//     const [cartItems] = await connection.execute(
//       `SELECT ci.product_id, ci.quantity, p.price, p.name, p.quantity as stock_quantity
//        FROM cart_items ci
//        JOIN products p ON ci.product_id = p.id
//        WHERE ci.cart_id = ?`,
//       [cartId]
//     );

//     if (cartItems.length === 0) {
//       await connection.rollback();
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Check stock availability and calculate total
//     let total = 0;
//     for (const item of cartItems) {
//       if (item.quantity > item.stock_quantity) {
//         await connection.rollback();
//         return res.status(400).json({ 
//           message: `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}` 
//         });
//       }
//       total += Number(item.price) * item.quantity;
//     }

//     // Generate unique order number
//     const orderNumber = 'ORD' + Date.now();

//     // Create order
//     const [orderResult] = await connection.execute(
//       `INSERT INTO orders (user_id, order_number, total_amount, payment_method, 
//        shipping_address, billing_address, status, payment_status) 
//        VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
//       [
//         userId, 
//         orderNumber, 
//         total, 
//         paymentMethod, 
//         JSON.stringify(shippingAddress), 
//         JSON.stringify(billingAddress)
//       ]
//     );

//     const orderId = orderResult.insertId;

//     // Create order items and update product stock
//     for (const item of cartItems) {
//       await connection.execute(
//         'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
//         [orderId, item.product_id, item.quantity, item.price]
//       );

//       // Update product stock
//       await connection.execute(
//         'UPDATE products SET quantity = quantity - ? WHERE id = ?',
//         [item.quantity, item.product_id]
//       );
//     }

//     // Clear cart items
//     await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

//     await connection.commit();

//     res.status(201).json({ 
//       message: 'Order created successfully', 
//       orderId,
//       orderNumber,
//       totalAmount: total
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Order creation error:', error);
//     res.status(500).json({ 
//       message: 'Server error creating order', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

// export const getOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const role = req.user.role;

//     let query = `
//       SELECT o.*, u.email as user_email, 
//              COUNT(oi.id) as item_count,
//              SUM(oi.quantity) as total_items
//       FROM orders o
//       LEFT JOIN order_items oi ON o.id = oi.order_id
//       LEFT JOIN users u ON o.user_id = u.id
//     `;

//     const params = [];
    
//     if (role !== 'admin') {
//       query += ' WHERE o.user_id = ?';
//       params.push(userId);
//     }

//     query += ' GROUP BY o.id ORDER BY o.created_at DESC';

//     const [orders] = await pool.execute(query, params);

//     // Parse address fields
//     const ordersWithParsedAddress = orders.map(order => ({
//       ...order,
//       shipping_address: JSON.parse(order.shipping_address),
//       billing_address: JSON.parse(order.billing_address)
//     }));

//     res.json({ orders: ordersWithParsedAddress });
//   } catch (error) {
//     console.error('Get orders error:', error);
//     res.status(500).json({ 
//       message: 'Server error fetching orders', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// export const getOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const role = req.user.role;

//     let query = `
//       SELECT o.*, u.email as user_email, u.username
//       FROM orders o
//       LEFT JOIN users u ON o.user_id = u.id
//       WHERE o.id = ?
//     `;
    
//     const params = [id];

//     if (role !== 'admin') {
//       query += ' AND o.user_id = ?';
//       params.push(userId);
//     }

//     const [orders] = await pool.execute(query, params);

//     if (orders.length === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Get order items with product details
//     const [orderItems] = await pool.execute(
//       `SELECT oi.*, p.name as product_name, p.sku,
//               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
//        FROM order_items oi
//        JOIN products p ON oi.product_id = p.id
//        WHERE oi.order_id = ?`,
//       [id]
//     );

//     const order = {
//       ...orders[0],
//       items: orderItems,
//       shipping_address: JSON.parse(orders[0].shipping_address),
//       billing_address: JSON.parse(orders[0].billing_address)
//     };

//     res.json(order);
//   } catch (error) {
//     console.error('Get order error:', error);
//     res.status(500).json({ 
//       message: 'Server error fetching order', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     // Validate status
//     const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         message: 'Invalid status', 
//         validStatuses 
//       });
//     }

//     const [result] = await pool.execute(
//       'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [status, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.json({ 
//       message: 'Order status updated successfully',
//       status 
//     });
//   } catch (error) {
//     console.error('Update order status error:', error);
//     res.status(500).json({ 
//       message: 'Server error updating order status', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };



// backend/controllers/orderController.js
import pool from '../config/database.js';

// export const createOrder = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//     await connection.beginTransaction();

//     const { shippingAddress, billingAddress, paymentMethod } = req.body;
//     const userId = req.user.id;

//     // Get user's cart
//     const [carts] = await connection.execute(
//       'SELECT id FROM cart WHERE user_id = ?',
//       [userId]
//     );

//     if (carts.length === 0) {
//       await connection.rollback();
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     const cartId = carts[0].id;

//     // Get cart items with product details
//     const [cartItems] = await connection.execute(
//       `SELECT ci.product_id, ci.quantity, p.price, p.name, p.quantity as stock_quantity
//        FROM cart_items ci
//        JOIN products p ON ci.product_id = p.id
//        WHERE ci.cart_id = ?`,
//       [cartId]
//     );

//     if (cartItems.length === 0) {
//       await connection.rollback();
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Check stock availability and calculate total
//     let total = 0;
//     for (const item of cartItems) {
//       if (item.quantity > item.stock_quantity) {
//         await connection.rollback();
//         return res.status(400).json({ 
//           message: `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}` 
//         });
//       }
//       total += Number(item.price) * item.quantity;
//     }

//     // Generate unique order number
//     const orderNumber = 'ORD' + Date.now();

//     // Create order
//     const [orderResult] = await connection.execute(
//       `INSERT INTO orders (user_id, order_number, total_amount, payment_method, 
//        shipping_address, billing_address, status, payment_status) 
//        VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
//       [
//         userId, 
//         orderNumber, 
//         total, 
//         paymentMethod, 
//         JSON.stringify(shippingAddress), 
//         JSON.stringify(billingAddress)
//       ]
//     );

//     const orderId = orderResult.insertId;

//     // Create order items and update product stock
//     for (const item of cartItems) {
//       await connection.execute(
//         'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
//         [orderId, item.product_id, item.quantity, item.price]
//       );

//       // Update product stock
//       await connection.execute(
//         'UPDATE products SET quantity = quantity - ? WHERE id = ?',
//         [item.quantity, item.product_id]
//       );
//     }

//     // Clear cart items
//     await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

//     await connection.commit();

//     res.status(201).json({ 
//       message: 'Order created successfully', 
//       orderId,
//       orderNumber,
//       totalAmount: total
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Order creation error:', error);
//     res.status(500).json({ 
//       message: 'Server error creating order', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { shippingAddress, billingAddress, paymentMethod, couponCode, discountAmount } = req.body;
    const userId = req.user.id;

    // Get user's cart
    const [carts] = await connection.execute(
      'SELECT id FROM cart WHERE user_id = ?',
      [userId]
    );

    if (carts.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const cartId = carts[0].id;

    // Get cart items with product details
    const [cartItems] = await connection.execute(
      `SELECT ci.product_id, ci.quantity, p.price, p.name, p.quantity as stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability and calculate total
    let total = 0;
    for (const item of cartItems) {
      if (item.quantity > item.stock_quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}` 
        });
      }
      total += Number(item.price) * item.quantity;
    }

    // Handle coupon logic
    let couponId = null;
    let finalTotal = total;

    if (couponCode) {
      // Get coupon details
      const [coupons] = await connection.execute(
        `SELECT * FROM coupons 
         WHERE code = ? AND is_active = TRUE 
         AND (valid_from IS NULL OR valid_from <= NOW())
         AND (valid_until IS NULL OR valid_until >= NOW())`,
        [couponCode]
      );

      if (coupons.length > 0) {
        const coupon = coupons[0];
        
        // Validate coupon usage
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
          await connection.rollback();
          return res.status(400).json({ message: 'Coupon usage limit exceeded' });
        }

        // Validate minimum order amount
        if (total < coupon.min_order_amount) {
          await connection.rollback();
          return res.status(400).json({ 
            message: `Minimum order amount of $${coupon.min_order_amount} required for this coupon` 
          });
        }

        couponId = coupon.id;
        
        // Apply discount
        let discount = 0;
        if (coupon.discount_type === 'percentage') {
          discount = (total * coupon.discount_value) / 100;
          if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
            discount = coupon.max_discount_amount;
          }
        } else {
          discount = coupon.discount_value;
        }

        finalTotal = total - discount;

        // Update coupon usage count
        await connection.execute(
          'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
          [couponId]
        );
      }
    }

    // Generate unique order number
    const orderNumber = 'ORD' + Date.now();

    // Create order with coupon_id
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_amount, payment_method, 
       shipping_address, billing_address, status, payment_status, coupon_id) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)`,
      [
        userId, 
        orderNumber, 
        finalTotal, 
        paymentMethod, 
        JSON.stringify(shippingAddress), 
        JSON.stringify(billingAddress),
        couponId  // This was missing - now including coupon_id
      ]
    );

    const orderId = orderResult.insertId;

    // Create order items and update product stock
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart items
    await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

    await connection.commit();

    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId,
      orderNumber,
      totalAmount: finalTotal,
      discountApplied: couponId ? (total - finalTotal) : 0,
      couponUsed: couponCode || null
    });

  } catch (error) {
    await connection.rollback();
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: 'Server error creating order', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};



export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = `
      SELECT o.*, u.email as user_email, 
             COUNT(oi.id) as item_count,
             SUM(oi.quantity) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN users u ON o.user_id = u.id
    `;

    const params = [];
    
    if (role !== 'admin') {
      query += ' WHERE o.user_id = ?';
      params.push(userId);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    // const [orders] = await pool.execute(query, params);


const [orders] = await pool.execute(
  `SELECT o.*, u.email as user_email, 
          c.code as coupon_code, c.discount_type, c.discount_value,
          COUNT(oi.id) as item_count,
          SUM(oi.quantity) as total_items
   FROM orders o
   LEFT JOIN order_items oi ON o.id = oi.order_id
   LEFT JOIN users u ON o.user_id = u.id
   LEFT JOIN coupons c ON o.coupon_id = c.id
   ${role !== 'admin' ? 'WHERE o.user_id = ?' : ''}
   GROUP BY o.id ORDER BY o.created_at DESC`,
  role !== 'admin' ? [userId] : []
);



    // Parse address fields and get order items
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const [orderItems] = await pool.execute(
          `SELECT oi.*, p.name as product_name, p.sku,
                  (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.id]
        );

        return {
          ...order,
          items: orderItems,
          shipping_address: JSON.parse(order.shipping_address),
          billing_address: JSON.parse(order.billing_address)
        };
      })
    );

    res.json({ orders: ordersWithDetails });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      message: 'Server error fetching orders', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    let query = `
      SELECT o.*, u.email as user_email, u.username
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;
    
    const params = [id];

    if (role !== 'admin') {
      query += ' AND o.user_id = ?';
      params.push(userId);
    }

    const [orders] = await pool.execute(query, params);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get order items with product details
    const [orderItems] = await pool.execute(
      `SELECT oi.*, p.name as product_name, p.sku,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    // Get order tracking history
    const [trackingHistory] = await pool.execute(
      `SELECT th.*, u.username as updated_by_name
       FROM tracking_history th
       LEFT JOIN users u ON th.updated_by = u.id
       WHERE th.order_id = ?
       ORDER BY th.created_at ASC`,
      [id]
    );

    const order = {
      ...orders[0],
      items: orderItems,
      tracking_history: trackingHistory,
      shipping_address: JSON.parse(orders[0].shipping_address),
      billing_address: JSON.parse(orders[0].billing_address)
    };

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      message: 'Server error fetching order', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const userId = req.user.id;

//     // Validate status
//     const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         message: 'Invalid status', 
//         validStatuses 
//       });
//     }

//     // Check if order exists and user has permission
//     const [orders] = await pool.execute(
//       'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = "admin")',
//       [id, userId, req.user.role]
//     );

//     if (orders.length === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const currentOrder = orders[0];

//     // Validate cancellation (only pending or confirmed orders can be cancelled)
//     if (status === 'cancelled') {
//       if (!['pending', 'confirmed'].includes(currentOrder.status)) {
//         return res.status(400).json({ 
//           message: 'Cannot cancel order that is already shipped or delivered' 
//         });
//       }
//     }

//     const connection = await pool.getConnection();
    
//     try {
//       await connection.beginTransaction();

//       // Update order status
//       const [result] = await connection.execute(
//         'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//         [status, id]
//       );

//       if (result.affectedRows === 0) {
//         await connection.rollback();
//         return res.status(404).json({ message: 'Order not found' });
//       }

//       // If order is cancelled, restore product stock
//       if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
//         const [orderItems] = await connection.execute(
//           'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
//           [id]
//         );

//         for (const item of orderItems) {
//           await connection.execute(
//             'UPDATE products SET quantity = quantity + ? WHERE id = ?',
//             [item.quantity, item.product_id]
//           );
//         }

//         // Update payment status to refunded if it was paid
//         if (currentOrder.payment_status === 'paid') {
//           await connection.execute(
//             'UPDATE orders SET payment_status = "refunded" WHERE id = ?',
//             [id]
//           );
//         }
//       }

//       // Add to tracking history
//       await connection.execute(
//         `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
//          VALUES (?, ?, ?, ?, ?)`,
//         [
//           id,
//           status,
//           getStatusDescription(status),
//           getStatusLocation(status),
//           userId
//         ]
//       );

//       await connection.commit();

//       res.json({ 
//         message: 'Order status updated successfully',
//         status,
//         previousStatus: currentOrder.status
//       });

//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }

//   } catch (error) {
//     console.error('Update order status error:', error);
//     res.status(500).json({ 
//       message: 'Server error updating order status', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// Update order status (seller)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if order exists and contains seller's products
    const [orderCheck] = await pool.execute(
      `SELECT o.id 
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND p.seller_id = ?`,
      [orderId, req.user.id]
    );

    if (orderCheck.length === 0) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }

    // Update order status
    await pool.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, orderId]
    );

    res.json({ 
      success: true,
      message: `Order status updated to ${status}` 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    // Check if order exists and user has permission
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Validate cancellation (only pending or confirmed orders can be cancelled)
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel order that is already shipped or delivered' 
      });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update order status to cancelled
      const [result] = await connection.execute(
        'UPDATE orders SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Order not found' });
      }

      // Restore product stock
      const [orderItems] = await connection.execute(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );

      for (const item of orderItems) {
        await connection.execute(
          'UPDATE products SET quantity = quantity + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Update payment status to refunded if it was paid
      if (order.payment_status === 'paid') {
        await connection.execute(
          'UPDATE orders SET payment_status = "refunded" WHERE id = ?',
          [id]
        );
      }

      // Add to tracking history with cancellation reason
      await connection.execute(
        `INSERT INTO tracking_history (order_id, status, description, location, notes, updated_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          'cancelled',
          'Order cancelled by customer',
          'Warehouse',
          reason || 'No reason provided',
          userId
        ]
      );

      await connection.commit();

      res.json({ 
        message: 'Order cancelled successfully',
        orderId: id,
        refundIssued: order.payment_status === 'paid'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      message: 'Server error cancelling order', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    // Check if order exists and user has permission
    let query = 'SELECT * FROM orders WHERE id = ?';
    const params = [id];

    if (role !== 'admin') {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const [orders] = await pool.execute(query, params);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get tracking history
    const [trackingHistory] = await pool.execute(
      `SELECT th.*, u.username as updated_by_name
       FROM tracking_history th
       LEFT JOIN users u ON th.updated_by = u.id
       WHERE th.order_id = ?
       ORDER BY th.created_at ASC`,
      [id]
    );

    // Generate tracking URL if order is shipped
    const order = orders[0];
    let trackingInfo = {
      tracking_number: order.tracking_number,
      carrier: order.carrier || 'Standard Shipping',
      tracking_url: null,
      estimated_delivery: null
    };

    if (order.status === 'shipped' && order.tracking_number) {
      trackingInfo.tracking_url = generateTrackingUrl(order.tracking_number, order.carrier);
      
      // Calculate estimated delivery (3-5 business days from shipping date)
      const shippedDate = trackingHistory.find(t => t.status === 'shipped')?.created_at;
      if (shippedDate) {
        const deliveryDate = new Date(shippedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        trackingInfo.estimated_delivery = deliveryDate.toISOString().split('T')[0];
      }
    }

    res.json({
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        shipping_address: JSON.parse(order.shipping_address)
      },
      tracking_info: trackingInfo,
      tracking_history: trackingHistory
    });

  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({ 
      message: 'Server error fetching tracking information', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper functions
const getStatusDescription = (status) => {
  const descriptions = {
    pending: 'Order received and being processed',
    confirmed: 'Order confirmed and payment verified',
    shipped: 'Order has been shipped',
    delivered: 'Order has been delivered',
    cancelled: 'Order has been cancelled'
  };
  return descriptions[status] || 'Order status updated';
};

const getStatusLocation = (status) => {
  const locations = {
    pending: 'Processing Center',
    confirmed: 'Warehouse',
    shipped: 'Distribution Center',
    delivered: 'Customer Location',
    cancelled: 'System'
  };
  return locations[status] || 'Warehouse';
};

const generateTrackingUrl = (trackingNumber, carrier) => {
  const carriers = {
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
  };
  
  return carriers[carrier?.toLowerCase()] || `https://example.com/track/${trackingNumber}`;
};


// // Get orders for seller (their products only)
// export const getSellerOrders = async (req, res) => {
//   try {
//     const sellerId = req.user.id;

//     const [orders] = await pool.execute(
//       `SELECT DISTINCT o.*, u.email as user_email, u.username,
//               COUNT(oi.id) as item_count,
//               SUM(oi.quantity) as total_items
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        LEFT JOIN users u ON o.user_id = u.id
//        WHERE p.seller_id = ?
//        GROUP BY o.id
//        ORDER BY o.created_at DESC`,
//       [sellerId]
//     );

//     // Parse address fields and get order items with seller's products only
//     const ordersWithDetails = await Promise.all(
//       orders.map(async (order) => {
//         const [orderItems] = await pool.execute(
//           `SELECT oi.*, p.name as product_name, p.sku, p.seller_id as seller_id,
//                   (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
//            FROM order_items oi
//            JOIN products p ON oi.product_id = p.id
//            WHERE oi.order_id = ? AND p.seller_id = ?`,
//           [order.id, sellerId]
//         );

//         return {
//           ...order,
//           items: orderItems,
//           shipping_address: JSON.parse(order.shipping_address),
//           billing_address: JSON.parse(order.billing_address)
//         };
//       })
//     );

//     res.json({ orders: ordersWithDetails });
//   } catch (error) {
//     console.error('Get seller orders error:', error);
//     res.status(500).json({ 
//       message: 'Server error fetching seller orders', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };
// backend/controllers/orderController.js

// // Get orders for seller (their products only)
// export const getSellerOrders = async (req, res) => {
//   try {
//     const sellerId = req.user.id;
//     console.log('Fetching seller orders for seller ID:', sellerId);

//     // First, let's verify the seller exists and has products
//     const [sellerProducts] = await pool.execute(
//       'SELECT id, name FROM products WHERE seller_id = ? LIMIT 5',
//       [sellerId]
//     );

//     console.log('Seller products found:', sellerProducts.length);

//     const [orders] = await pool.execute(
//       `SELECT DISTINCT 
//         o.id, o.order_number, o.total_amount, o.status, o.payment_status,
//         o.shipping_address, o.billing_address, o.created_at, o.updated_at,
//         u.email as user_email, u.username,
//         COUNT(oi.id) as item_count,
//         SUM(oi.quantity) as total_items
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        LEFT JOIN users u ON o.user_id = u.id
//        WHERE p.seller_id = ?
//        GROUP BY o.id
//        ORDER BY o.created_at DESC`,
//       [sellerId]
//     );

//     console.log('Raw orders found:', orders.length);

//     // Parse address fields and get order items with seller's products only
//     const ordersWithDetails = await Promise.all(
//       orders.map(async (order) => {
//         try {
//           const [orderItems] = await pool.execute(
//             `SELECT oi.*, p.name as product_name, p.sku, p.seller_id,
//                     (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
//              FROM order_items oi
//              JOIN products p ON oi.product_id = p.id
//              WHERE oi.order_id = ? AND p.seller_id = ?`,
//             [order.id, sellerId]
//           );

//           let shipping_address = {};
//           let billing_address = {};

//           try {
//             shipping_address = order.shipping_address ? JSON.parse(order.shipping_address) : {};
//             billing_address = order.billing_address ? JSON.parse(order.billing_address) : {};
//           } catch (parseError) {
//             console.error('Error parsing addresses for order:', order.id, parseError);
//             // Use empty objects if parsing fails
//           }

//           return {
//             ...order,
//             items: orderItems || [],
//             shipping_address,
//             billing_address
//           };
//         } catch (error) {
//           console.error(`Error processing order ${order.id}:`, error);
//           return {
//             ...order,
//             items: [],
//             shipping_address: {},
//             billing_address: {}
//           };
//         }
//       })
//     );

//     console.log('Processed orders with details:', ordersWithDetails.length);

//     res.json({ 
//       success: true,
//       orders: ordersWithDetails 
//     });

//   } catch (error) {
//     console.error('Get seller orders error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error fetching seller orders', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };


// // Get seller's orders
// export const getSellerOrders = async (req, res) => {
//   try {
//     const [orders] = await pool.execute(
//       `SELECT o.*, 
//               oi.product_id, oi.quantity, oi.price,
//               p.name as product_name, p.sku, p.seller_id,
//               pi.image_url as product_image,
//               u.email as user_email
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//        JOIN users u ON o.user_id = u.id
//        WHERE p.seller_id = ?
//        ORDER BY o.created_at DESC`,
//       [req.user.id]
//     );

//     // Group orders by order ID
//     const groupedOrders = orders.reduce((acc, item) => {
//       if (!acc[item.id]) {
//         acc[item.id] = {
//           id: item.id,
//           order_number: item.order_number,
//           status: item.status,
//           payment_status: item.payment_status,
//           total_amount: item.total_amount,
//           created_at: item.created_at,
//           user_email: item.user_email,
//           shipping_address: item.shipping_address ? JSON.parse(item.shipping_address) : null,
//           items: []
//         };
//       }
      
//       acc[item.id].items.push({
//         product_id: item.product_id,
//         product_name: item.product_name,
//         sku: item.sku,
//         quantity: item.quantity,
//         price: item.price,
//         product_image: item.product_image
//       });
      
//       return acc;
//     }, {});

//     res.json({
//       success: true,
//       orders: Object.values(groupedOrders)
//     });
//   } catch (error) {
//     console.error('Error fetching seller orders:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };



// Update getSellerOrders to use item-level status
export const getSellerOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT 
        o.id, o.order_number, o.created_at,
        oi.id as order_item_id, oi.product_id, oi.quantity, oi.price, oi.status as item_status,
        oi.tracking_number as item_tracking,
        p.name as product_name, p.sku,
        pi.image_url as product_image,
        u.email as user_email,
        o.shipping_address
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       JOIN users u ON o.user_id = u.id
       WHERE p.seller_id = ?
       ORDER BY o.created_at DESC, oi.id ASC`,
      [req.user.id]
    );

    // Group orders by order ID with item-level status
    const groupedOrders = orders.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = {
          id: item.id,
          order_number: item.order_number,
          created_at: item.created_at,
          user_email: item.user_email,
          shipping_address: item.shipping_address ? JSON.parse(item.shipping_address) : null,
          items: []
        };
      }
      
      acc[item.id].items.push({
        order_item_id: item.order_item_id,
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        product_image: item.product_image,
        status: item.item_status,
        tracking_number: item.item_tracking
      });
      
      return acc;
    }, {});

    res.json({
      success: true,
      orders: Object.values(groupedOrders)
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// // Update order item status (per product)
// export const updateOrderItemStatus = async (req, res) => {
//   try {
//     const { orderItemId } = req.params;
//     const { status, tracking_number } = req.body;

//     // Validate status
//     const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     // Check if order item exists and belongs to seller's product
//     const [orderItems] = await pool.execute(
//       `SELECT oi.id, p.seller_id 
//        FROM order_items oi
//        JOIN products p ON oi.product_id = p.id
//        WHERE oi.id = ? AND p.seller_id = ?`,
//       [orderItemId, req.user.id]
//     );

//     if (orderItems.length === 0) {
//       return res.status(404).json({ message: 'Order item not found or access denied' });
//     }

//     // Update order item status
//     let updateQuery = 'UPDATE order_items SET status = ?, updated_at = CURRENT_TIMESTAMP';
//     const updateParams = [status];

//     if (tracking_number) {
//       updateQuery += ', tracking_number = ?';
//       updateParams.push(tracking_number);
//     }

//     updateQuery += ' WHERE id = ?';
//     updateParams.push(orderItemId);

//     await pool.execute(updateQuery, updateParams);

//     // If marking as delivered, update product sales count
//     if (status === 'delivered') {
//       await pool.execute(
//         'UPDATE products SET sales_count = sales_count + 1 WHERE id IN (SELECT product_id FROM order_items WHERE id = ?)',
//         [orderItemId]
//       );
//     }

//     res.json({ 
//       success: true,
//       message: `Order item status updated to ${status}` 
//     });
//   } catch (error) {
//     console.error('Error updating order item status:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// backend/controllers/orderController.js

// Update order item status (per product)
export const updateOrderItemStatus = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { orderItemId } = req.params;
    const { status, tracking_number } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if order item exists and belongs to seller's product
    const [orderItems] = await connection.execute(
      `SELECT oi.id, oi.order_id, p.seller_id 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.id = ? AND p.seller_id = ?`,
      [orderItemId, req.user.id]
    );

    if (orderItems.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order item not found or access denied' });
    }

    const orderId = orderItems[0].order_id;

    // Update order item status
    let updateQuery = 'UPDATE order_items SET status = ?, updated_at = CURRENT_TIMESTAMP';
    const updateParams = [status];

    if (tracking_number) {
      updateQuery += ', tracking_number = ?';
      updateParams.push(tracking_number);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(orderItemId);

    await connection.execute(updateQuery, updateParams);

    // If marking as delivered, update product sales count
    if (status === 'delivered') {
      await connection.execute(
        'UPDATE products SET sales_count = sales_count + 1 WHERE id IN (SELECT product_id FROM order_items WHERE id = ?)',
        [orderItemId]
      );
    }

    // ✅ NEW: Check if all items in the order are delivered and update order status
    if (status === 'delivered') {
      // Get all order items for this order
      const [allOrderItems] = await connection.execute(
        `SELECT status FROM order_items WHERE order_id = ?`,
        [orderId]
      );

      // Check if ALL items are delivered
      const allItemsDelivered = allOrderItems.every(item => item.status === 'delivered');
      
      if (allItemsDelivered) {
        // Update the main order status to delivered
        await connection.execute(
          'UPDATE orders SET status = "delivered", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [orderId]
        );

        // Add to tracking history
        await connection.execute(
          `INSERT INTO tracking_history (order_id, status, description, location, updated_by) 
           VALUES (?, 'delivered', 'All items in order have been delivered', 'System', ?)`,
          [orderId, req.user.id]
        );
      }
    }

    await connection.commit();

    res.json({ 
      success: true,
      message: `Order item status updated to ${status}`,
      orderUpdated: status === 'delivered' ? await checkOrderStatus(connection, orderId) : false
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating order item status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
};

// ✅ NEW: Helper function to check and update order status
const checkOrderStatus = async (connection, orderId) => {
  try {
    // Get all order items for this order
    const [allOrderItems] = await connection.execute(
      `SELECT status FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    if (allOrderItems.length === 0) return false;

    // Check if ALL items are delivered
    const allItemsDelivered = allOrderItems.every(item => item.status === 'delivered');
    
    if (allItemsDelivered) {
      await connection.execute(
        'UPDATE orders SET status = "delivered", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [orderId]
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking order status:', error);
    return false;
  }
};






// backend/controllers/orderController.js

// ✅ NEW: Function to check and update order status manually
export const checkAndUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const updated = await checkOrderStatus(connection, orderId);
      
      await connection.commit();
      
      if (updated) {
        res.json({ 
          success: true, 
          message: 'Order status updated to delivered',
          status: 'delivered'
        });
      } else {
        res.json({ 
          success: true, 
          message: 'Order status remains the same - not all items are delivered',
          status: 'pending'
        });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error checking order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const checkProductPurchase = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if user has purchased and received the product within last 30 days
    const [orders] = await pool.execute(`
      SELECT oi.id, o.created_at, oi.status
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ? AND oi.product_id = ? 
      AND oi.status = 'delivered'
      AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      LIMIT 1
    `, [userId, productId]);

    const hasPurchased = orders.length > 0;

    res.json({ 
      hasPurchased,
      purchaseDetails: hasPurchased ? {
        orderDate: orders[0].created_at,
        status: orders[0].status
      } : null
    });
  } catch (error) {
    console.error('Error checking product purchase:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get seller order stats with item-level status
export const getSellerOrderStats = async (req, res) => {
  try {
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(DISTINCT oi.id) as total_items,
        SUM(oi.quantity * oi.price) as total_revenue,
        COUNT(DISTINCT o.id) as total_orders,
        COUNT(DISTINCT o.user_id) as total_customers
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ? AND o.payment_status = 'paid'`,
      [req.user.id]
    );

    const [statusCounts] = await pool.execute(
      `SELECT 
        oi.status,
        COUNT(oi.id) as count
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ?
       GROUP BY oi.status`,
      [req.user.id]
    );

    res.json({
      success: true,
      stats: stats[0] || {},
      statusCounts: statusCounts || []
    });
  } catch (error) {
    console.error('Error fetching seller order stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// // Get seller order statistics
// export const getSellerOrderStats = async (req, res) => {
//   try {
//     const [stats] = await pool.execute(
//       `SELECT 
//         COUNT(DISTINCT o.id) as total_orders,
//         SUM(oi.quantity * oi.price) as total_revenue,
//         AVG(oi.quantity * oi.price) as average_order_value,
//         COUNT(DISTINCT o.user_id) as total_customers
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ? AND o.payment_status = 'paid'`,
//       [req.user.id]
//     );

//     const [statusCounts] = await pool.execute(
//       `SELECT 
//         o.status,
//         COUNT(DISTINCT o.id) as count
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ?
//        GROUP BY o.status`,
//       [req.user.id]
//     );

//     res.json({
//       success: true,
//       stats: stats[0] || {},
//       statusCounts: statusCounts || []
//     });
//   } catch (error) {
//     console.error('Error fetching seller order stats:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// // Mark order as paid (for seller's products)
// export const markOrderAsPaid = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sellerId = req.user.id;

//     // Verify that the order contains seller's products
//     const [sellerOrders] = await pool.execute(
//       `SELECT o.id, o.payment_status
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE o.id = ? AND p.seller_id = ?`,
//       [id, sellerId]
//     );

//     if (sellerOrders.length === 0) {
//       return res.status(404).json({ 
//         message: 'Order not found or you are not authorized to update this order' 
//       });
//     }

//     const order = sellerOrders[0];

//     // Check if already paid
//     if (order.payment_status === 'paid') {
//       return res.status(400).json({ 
//         message: 'Order is already marked as paid' 
//       });
//     }

//     const connection = await pool.getConnection();
    
//     try {
//       await connection.beginTransaction();

//       // Update payment status
//       const [result] = await connection.execute(
//         'UPDATE orders SET payment_status = "paid", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//         [id]
//       );

//       if (result.affectedRows === 0) {
//         await connection.rollback();
//         return res.status(404).json({ message: 'Order not found' });
//       }

//       // Add to tracking history
//       await connection.execute(
//         `INSERT INTO tracking_history (order_id, status, description, location, notes, updated_by) 
//          VALUES (?, 'confirmed', 'Payment confirmed by seller', 'System', 'Order marked as paid by seller', ?)`,
//         [id, sellerId]
//       );

//       await connection.commit();

//       res.json({ 
//         message: 'Order successfully marked as paid',
//         orderId: id
//       });

//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }

//   } catch (error) {
//     console.error('Mark order as paid error:', error);
//     res.status(500).json({ 
//       message: 'Server error marking order as paid', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };


// Mark order as paid (seller)
export const markOrderAsPaid = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if order exists and contains seller's products
    const [orderCheck] = await pool.execute(
      `SELECT o.id 
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND p.seller_id = ?`,
      [orderId, req.user.id]
    );

    if (orderCheck.length === 0) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }

    // Update payment status
    await pool.execute(
      'UPDATE orders SET payment_status = "paid", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [orderId]
    );

    res.json({ 
      success: true,
      message: 'Order marked as paid' 
    });
  } catch (error) {
    console.error('Error marking order as paid:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get seller's order details
export const getSellerOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    // Verify that the order contains seller's products
    const [orders] = await pool.execute(
      `SELECT o.*, u.email as user_email, u.username
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND p.seller_id = ?
       LIMIT 1`,
      [id, sellerId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get order items (only seller's products)
    const [orderItems] = await pool.execute(
      `SELECT oi.*, p.name as product_name, p.sku, p.seller_id as seller_id,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ? AND p.seller_id = ?`,
      [id, sellerId]
    );

    // Get order tracking history
    const [trackingHistory] = await pool.execute(
      `SELECT th.*, u.username as updated_by_name
       FROM tracking_history th
       LEFT JOIN users u ON th.updated_by = u.id
       WHERE th.order_id = ?
       ORDER BY th.created_at ASC`,
      [id]
    );

    const order = {
      ...orders[0],
      items: orderItems,
      tracking_history: trackingHistory,
      shipping_address: JSON.parse(orders[0].shipping_address),
      billing_address: JSON.parse(orders[0].billing_address)
    };

    res.json(order);
  } catch (error) {
    console.error('Get seller order error:', error);
    res.status(500).json({ 
      message: 'Server error fetching order', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};



// Get detailed order view for seller
export const getSellerOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get complete order details with ALL products
    const [orderDetails] = await pool.execute(
      `SELECT 
        o.*,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name as product_name,
        p.sku,
        p.seller_id,
        s.business_name as seller_business_name,
        pi.image_url as product_image,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        CASE WHEN p.seller_id = ? THEN 1 ELSE 0 END as is_seller_product
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN sellers s ON p.seller_id = s.user_id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?
       ORDER BY oi.id ASC`,
      [req.user.id, orderId]
    );

    if (orderDetails.length === 0) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }

    // Check if this order contains seller's products
    const hasSellerProducts = orderDetails.some(item => item.is_seller_product === 1);
    if (!hasSellerProducts) {
      return res.status(403).json({ message: 'You do not have products in this order' });
    }

    // Structure the response
    const order = {
      id: orderDetails[0].id,
      order_number: orderDetails[0].order_number,
      status: orderDetails[0].status,
      payment_status: orderDetails[0].payment_status,
      total_amount: orderDetails[0].total_amount,
      created_at: orderDetails[0].created_at,
      user_email: orderDetails[0].user_email,
      user_name: `${orderDetails[0].user_first_name} ${orderDetails[0].user_last_name}`,
      shipping_address: orderDetails[0].shipping_address ? JSON.parse(orderDetails[0].shipping_address) : null,
      items: orderDetails.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        product_image: item.product_image,
        seller_id: item.seller_id,
        seller_business_name: item.seller_business_name,
        is_seller_product: item.is_seller_product === 1,
        item_total: (item.price * item.quantity)
      })),
      seller_items: orderDetails.filter(item => item.is_seller_product === 1).map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        product_image: item.product_image,
        item_total: (item.price * item.quantity)
      })),
      seller_total: orderDetails
        .filter(item => item.is_seller_product === 1)
        .reduce((total, item) => total + (item.price * item.quantity), 0),
      other_sellers_total: orderDetails
        .filter(item => item.is_seller_product === 0)
        .reduce((total, item) => total + (item.price * item.quantity), 0)
    };

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching seller order detail:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};