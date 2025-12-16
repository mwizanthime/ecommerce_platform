// backend/controllers/analyticsController.js
import pool from '../config/database.js';

export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    // Get basic stats
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        SUM(oi.quantity) as total_items_sold,
        SUM(oi.price * oi.quantity) as total_revenue,
        AVG(oi.price * oi.quantity) as avg_order_value,
        COUNT(DISTINCT o.user_id) as unique_customers
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ? AND o.payment_status = 'paid'
    `, [sellerId]);

    // Get monthly sales data
    const [monthlySales] = await pool.execute(`
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        SUM(oi.price * oi.quantity) as revenue,
        COUNT(DISTINCT o.id) as orders
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ? AND o.payment_status = 'paid'
      GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `, [sellerId]);

    // Get top products
    const [topProducts] = await pool.execute(`
      SELECT 
        p.name,
        p.id,
        SUM(oi.quantity) as total_sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ?
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `, [sellerId]);

    // Get order status distribution
    const [orderStatus] = await pool.execute(`
      SELECT 
        o.status,
        COUNT(DISTINCT o.id) as count
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ?
      GROUP BY o.status
    `, [sellerId]);

    res.json({
      success: true,
      data: {
        stats: stats[0] || {},
        monthlySales,
        topProducts,
        orderStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    // Get platform-wide stats
    const [platformStats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT p.id) as total_products,
        COUNT(DISTINCT o.id) as total_orders,
        SUM(o.total_amount) as total_revenue,
        COUNT(DISTINCT CASE WHEN u.role = 'seller' THEN u.id END) as total_sellers,
        COUNT(DISTINCT CASE WHEN u.role = 'customer' THEN u.id END) as total_customers
      FROM users u
      LEFT JOIN products p ON u.id = p.seller_id
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE o.payment_status = 'paid' OR o.payment_status IS NULL
    `);

    // Get sales trends
    const [salesTrends] = await pool.execute(`
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        SUM(o.total_amount) as revenue,
        COUNT(DISTINCT o.id) as orders,
        COUNT(DISTINCT o.user_id) as customers
      FROM orders o
      WHERE o.payment_status = 'paid'
      GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    // Get category performance
    const [categoryPerformance] = await pool.execute(`
      SELECT 
        c.name as category,
        COUNT(DISTINCT oi.product_id) as products,
        SUM(oi.quantity) as items_sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `);

    // Get user growth - generate all months even with zero users
    const [userGrowth] = await pool.execute(`
      WITH RECURSIVE months(month) AS (
        SELECT DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 11 MONTH), '%Y-%m')
        UNION ALL
        SELECT DATE_FORMAT(DATE_ADD(STR_TO_DATE(CONCAT(month, '-01'), '%Y-%m-%d'), INTERVAL 1 MONTH), '%Y-%m')
        FROM months
        WHERE STR_TO_DATE(CONCAT(month, '-01'), '%Y-%m-%d') < DATE_FORMAT(NOW(), '%Y-%m-01')
      )
      SELECT 
        m.month,
        COALESCE(COUNT(u.id), 0) as new_users,
        COALESCE(
          (SELECT COUNT(*) FROM users u2 
           WHERE DATE_FORMAT(u2.created_at, '%Y-%m') <= m.month),
          0
        ) as total_users
      FROM months m
      LEFT JOIN users u ON DATE_FORMAT(u.created_at, '%Y-%m') = m.month
      GROUP BY m.month
      ORDER BY m.month DESC
    `);

    // Get top sellers
    const [topSellers] = await pool.execute(`
      SELECT 
        u.username,
        u.email,
        COUNT(DISTINCT o.id) as orders,
        SUM(oi.price * oi.quantity) as revenue
      FROM users u
      JOIN products p ON u.id = p.seller_id
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE u.role = 'seller' AND o.payment_status = 'paid'
      GROUP BY u.id, u.username, u.email
      ORDER BY revenue DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        platformStats: platformStats[0] || {},
        salesTrends,
        categoryPerformance,
        userGrowth,
        topSellers
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};