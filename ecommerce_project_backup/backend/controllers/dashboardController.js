// backend/controllers/dashboardController.js
import pool from '../config/database.js';

// export const getAdminDashboard = async (req, res) => {
//   try {
//     // Total counts
//     const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
//     const [productsCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
//     const [ordersCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
//     const [revenueResult] = await pool.execute('SELECT SUM(total_amount) as revenue FROM orders WHERE status = "delivered"');

//     // Recent orders
//     const [recentOrders] = await pool.execute(
//       `SELECT o.*, u.username 
//        FROM orders o
//        JOIN users u ON o.user_id = u.id
//        ORDER BY o.created_at DESC
//        LIMIT 5`
//     );

//     // Pending sellers
//     const [pendingSellers] = await pool.execute(
//       'SELECT id, username, email, created_at FROM users WHERE role = "seller" AND is_approved = FALSE'
//     );

//     // Low stock products
//     const [lowStockProducts] = await pool.execute(
//       'SELECT id, name, quantity FROM products WHERE quantity < 10 AND track_quantity = TRUE ORDER BY quantity ASC LIMIT 5'
//     );

//     res.json({
//       stats: {
//         totalUsers: usersCount[0].count,
//         totalProducts: productsCount[0].count,
//         totalOrders: ordersCount[0].count,
//         totalRevenue: revenueResult[0].revenue || 0,
//         pendingSellers: pendingSellers.length
//       },
//       recentOrders,
//       pendingSellers,
//       lowStockProducts
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getSellerDashboard = async (req, res) => {
//   try {
//     const sellerId = req.user.id;

//     // Seller stats
//     const [productsCount] = await pool.execute(
//       'SELECT COUNT(*) as count FROM products WHERE seller_id = ?',
//       [sellerId]
//     );

//     const [ordersCount] = await pool.execute(
//       `SELECT COUNT(DISTINCT o.id) as count
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ?`,
//       [sellerId]
//     );

//     const [revenueResult] = await pool.execute(
//       `SELECT SUM(oi.quantity * oi.price) as revenue
//        FROM order_items oi
//        JOIN products p ON oi.product_id = p.id
//        JOIN orders o ON oi.order_id = o.id
//        WHERE p.seller_id = ? AND o.status = "delivered"`,
//       [sellerId]
//     );

//     // Recent orders for seller's products
//     const [recentOrders] = await pool.execute(
//       `SELECT o.*, u.username, p.name as product_name, oi.quantity, oi.price
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        JOIN users u ON o.user_id = u.id
//        WHERE p.seller_id = ?
//        ORDER BY o.created_at DESC
//        LIMIT 5`,
//       [sellerId]
//     );

//     // Top selling products
//     const [topProducts] = await pool.execute(
//       `SELECT p.name, SUM(oi.quantity) as total_sold
//        FROM order_items oi
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ?
//        GROUP BY oi.product_id
//        ORDER BY total_sold DESC
//        LIMIT 5`,
//       [sellerId]
//     );

//     res.json({
//       stats: {
//         totalProducts: productsCount[0].count,
//         totalOrders: ordersCount[0].count,
//         totalRevenue: revenueResult[0].revenue || 0
//       },
//       recentOrders,
//       topProducts
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };



export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    // Get basic stats
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT p.id) as totalProducts,
        COUNT(DISTINCT o.id) as totalOrders,
        COALESCE(SUM(oi.price * oi.quantity), 0) as totalRevenue,
        COALESCE(AVG(oi.price * oi.quantity), 0) as avgOrderValue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.payment_status = 'paid'
      WHERE p.seller_id = ?
    `, [sellerId]);

    // Get recent orders
    const [recentOrders] = await pool.execute(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        u.username,
        p.name as product_name,
        oi.quantity,
        oi.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
      WHERE p.seller_id = ?
      ORDER BY o.created_at DESC
      LIMIT 5
    `, [sellerId]);

    // Get top products
    const [topProducts] = await pool.execute(`
      SELECT 
        p.name,
        SUM(oi.quantity) as total_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ?
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `, [sellerId]);

    res.json({
      success: true,
      stats: stats[0] || { totalProducts: 0, totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
      recentOrders: recentOrders || [],
      topProducts: topProducts || []
    });
  } catch (error) {
    console.error('Seller dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    // Get platform-wide stats
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT u.id) as totalUsers,
        COUNT(DISTINCT p.id) as totalProducts,
        COUNT(DISTINCT o.id) as totalOrders,
        COALESCE(SUM(o.total_amount), 0) as totalRevenue,
        COUNT(DISTINCT CASE WHEN u.role = 'seller' THEN u.id END) as totalSellers,
        COUNT(DISTINCT CASE WHEN u.role = 'customer' THEN u.id END) as totalCustomers
      FROM users u
      LEFT JOIN products p ON u.id = p.seller_id
      LEFT JOIN orders o ON u.id = o.user_id AND o.payment_status = 'paid'
    `);

    // Get recent orders
    const [recentOrders] = await pool.execute(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        u.username
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // Get pending sellers
    const [pendingSellers] = await pool.execute(`
      SELECT id, username, email, created_at
      FROM users
      WHERE role = 'seller' AND is_approved = 0
    `);

    // Get low stock products
    const [lowStockProducts] = await pool.execute(`
      SELECT id, name, quantity
      FROM products
      WHERE quantity < 10
      ORDER BY quantity ASC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: stats[0] || { 
        totalUsers: 0, 
        totalProducts: 0, 
        totalOrders: 0, 
        totalRevenue: 0, 
        totalSellers: 0, 
        totalCustomers: 0 
      },
      recentOrders: recentOrders || [],
      pendingSellers: pendingSellers || [],
      lowStockProducts: lowStockProducts || []
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Customer stats
    const [ordersCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
      [userId]
    );

    const [wishlistCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?',
      [userId]
    );

    // Recent orders
    const [recentOrders] = await pool.execute(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Recently viewed (you can implement this with a separate table)
    const [recentProducts] = await pool.execute(
      `SELECT p.*, 
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM products p
       WHERE p.is_published = TRUE
       ORDER BY p.created_at DESC
       LIMIT 4`
    );

    res.json({
      stats: {
        totalOrders: ordersCount[0].count,
        wishlistItems: wishlistCount[0].count
      },
      recentOrders,
      recentProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};