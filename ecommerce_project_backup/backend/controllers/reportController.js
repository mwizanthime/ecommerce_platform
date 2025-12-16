// // controllers/reportController.js
// import db from "../config/database.js";
// import moment from "moment";
// import XLSX from "xlsx";
// import PDFDocument from "pdfkit";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

// class ReportController {
//   // Dashboard Statistics
//   async getDashboardStats(req, res) {
//     try {
//       const { period = "monthly", startDate, endDate } = req.query;
//       const userId = req.user.id;
//       const userRole = req.user.role;

//       let dateCondition = "";
//       let dateParams = [];

//       if (startDate && endDate) {
//         dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//         dateParams.push(startDate, endDate);
//       } else {
//         // Use period-based filtering
//         const now = new Date();
//         let start, end;

//         switch (period) {
//           case "daily":
//             start = format(now, "yyyy-MM-dd");
//             end = format(now, "yyyy-MM-dd");
//             dateCondition = `AND DATE(o.created_at) = ?`;
//             dateParams.push(start);
//             break;
//           case "weekly":
//             const weekStart = new Date(
//               now.setDate(now.getDate() - now.getDay())
//             );
//             const weekEnd = new Date(
//               now.setDate(now.getDate() - now.getDay() + 6)
//             );
//             dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//             dateParams.push(
//               format(weekStart, "yyyy-MM-dd"),
//               format(weekEnd, "yyyy-MM-dd")
//             );
//             break;
//           case "monthly":
//             const monthStart = format(
//               new Date(now.getFullYear(), now.getMonth(), 1),
//               "yyyy-MM-dd"
//             );
//             const monthEnd = format(
//               new Date(now.getFullYear(), now.getMonth() + 1, 0),
//               "yyyy-MM-dd"
//             );
//             dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//             dateParams.push(monthStart, monthEnd);
//             break;
//           case "yearly":
//             const yearStart = format(
//               new Date(now.getFullYear(), 0, 1),
//               "yyyy-MM-dd"
//             );
//             const yearEnd = format(
//               new Date(now.getFullYear(), 11, 31),
//               "yyyy-MM-dd"
//             );
//             dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//             dateParams.push(yearStart, yearEnd);
//             break;
//         }
//       }

//       // Get total orders and sales
//       let orderQuery = `
//                 SELECT 
//                     COUNT(*) as total_orders,
//                     SUM(total_amount) as total_sales,
//                     AVG(total_amount) as avg_order_value,
//                     COUNT(DISTINCT user_id) as unique_customers
//                 FROM orders o
//                 WHERE o.payment_status = 'paid'
//                 ${dateCondition}
//             `;

//       // For sellers, only show their products
//       if (userRole === "seller") {
//         orderQuery = `
//                     SELECT 
//                         COUNT(DISTINCT o.id) as total_orders,
//                         SUM(oi.price * oi.quantity) as total_sales,
//                         AVG(oi.price * oi.quantity) as avg_order_value,
//                         COUNT(DISTINCT o.user_id) as unique_customers
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     ${dateCondition}
//                 `;
//         dateParams.unshift(userId);
//       }

//       const [orderStats] = await db.query(orderQuery, dateParams);

//       // Get order status breakdown
//       let statusQuery = `
//                 SELECT 
//                     status,
//                     COUNT(*) as count
//                 FROM orders
//                 WHERE 1=1 ${dateCondition}
//                 GROUP BY status
//             `;

//       if (userRole === "seller") {
//         statusQuery = `
//                     SELECT 
//                         oi.status,
//                         COUNT(DISTINCT o.id) as count
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE p.seller_id = ?
//                     ${dateCondition}
//                     GROUP BY oi.status
//                 `;
//       }

//       const [statusBreakdown] = await db.query(statusQuery, dateParams);

//       // Get top products
//       let topProductsQuery = `
//                 SELECT 
//                     p.id,
//                     p.name,
//                     p.category_id,
//                     c.name as category_name,
//                     SUM(oi.quantity) as units_sold,
//                     SUM(oi.price * oi.quantity) as revenue,
//                     p.quantity as current_stock
//                 FROM order_items oi
//                 JOIN products p ON oi.product_id = p.id
//                 JOIN categories c ON p.category_id = c.id
//                 JOIN orders o ON oi.order_id = o.id
//                 WHERE o.payment_status = 'paid'
//                 ${dateCondition}
//                 GROUP BY p.id
//                 ORDER BY revenue DESC
//                 LIMIT 10
//             `;

//       if (userRole === "seller") {
//         topProductsQuery = `
//                     SELECT 
//                         p.id,
//                         p.name,
//                         p.category_id,
//                         c.name as category_name,
//                         SUM(oi.quantity) as units_sold,
//                         SUM(oi.price * oi.quantity) as revenue,
//                         p.quantity as current_stock
//                     FROM order_items oi
//                     JOIN products p ON oi.product_id = p.id
//                     JOIN categories c ON p.category_id = c.id
//                     JOIN orders o ON oi.order_id = o.id
//                     WHERE o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     ${dateCondition}
//                     GROUP BY p.id
//                     ORDER BY revenue DESC
//                     LIMIT 10
//                 `;
//       }

//       const [topProducts] = await db.query(topProductsQuery, dateParams);

//       // Get daily/weekly/monthly trend
//       const trendQuery = `
//                 SELECT 
//                     DATE(created_at) as date,
//                     COUNT(*) as orders,
//                     SUM(total_amount) as revenue
//                 FROM orders
//                 WHERE payment_status = 'paid'
//                 ${dateCondition}
//                 GROUP BY DATE(created_at)
//                 ORDER BY date
//             `;

//       const [trendData] = await db.query(trendQuery, dateParams);

//       // Get low stock products
//       const lowStockQuery = `
//                 SELECT 
//                     p.id,
//                     p.name,
//                     p.quantity,
//                     p.sku,
//                     c.name as category_name
//                 FROM products p
//                 JOIN categories c ON p.category_id = c.id
//                 WHERE p.quantity <= 10
//                 AND p.track_quantity = 1
//                 ${userRole === "seller" ? "AND p.seller_id = ?" : ""}
//                 ORDER BY p.quantity ASC
//                 LIMIT 10
//             `;

//       const lowStockParams = userRole === "seller" ? [userId] : [];
//       const [lowStockProducts] = await db.query(lowStockQuery, lowStockParams);

//       res.json({
//         success: true,
//         data: {
//           period,
//           summary: {
//             total_orders: orderStats[0]?.total_orders || 0,
//             total_sales: orderStats[0]?.total_sales || 0,
//             avg_order_value: orderStats[0]?.avg_order_value || 0,
//             unique_customers: orderStats[0]?.unique_customers || 0,
//           },
//           status_breakdown: statusBreakdown,
//           top_products: topProducts,
//           trend_data: trendData,
//           low_stock_products: lowStockProducts,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching dashboard stats:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch dashboard statistics",
//       });
//     }
//   }

//   // Daily Sales Report
//   async getDailySalesReport(req, res) {
//     try {
//       const { date } = req.query;
//       const reportDate = date || format(new Date(), "yyyy-MM-dd");
//       const userId = req.user.id;
//       const userRole = req.user.role;

//       let query = `
//                 SELECT 
//                     DATE(o.created_at) as report_date,
//                     COUNT(*) as total_orders,
//                     SUM(o.total_amount) as total_sales,
//                     AVG(o.total_amount) as avg_order_value,
//                     COUNT(DISTINCT o.user_id) as unique_customers,
//                     COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders,
//                     COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders
//                 FROM orders o
//                 WHERE DATE(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//             `;

//       let params = [reportDate];

//       if (userRole === "seller") {
//         query = `
//                     SELECT 
//                         DATE(o.created_at) as report_date,
//                         COUNT(DISTINCT o.id) as total_orders,
//                         SUM(oi.price * oi.quantity) as total_sales,
//                         AVG(oi.price * oi.quantity) as avg_order_value,
//                         COUNT(DISTINCT o.user_id) as unique_customers,
//                         COUNT(DISTINCT CASE WHEN oi.status = 'delivered' THEN o.id END) as delivered_orders,
//                         COUNT(DISTINCT CASE WHEN oi.status = 'cancelled' THEN o.id END) as cancelled_orders
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE DATE(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY DATE(o.created_at)
//                 `;
//         params.push(userId);
//       }

//       const [summary] = await db.query(query, params);

//       // Get hourly trend
//       let hourlyQuery = `
//                 SELECT 
//                     HOUR(o.created_at) as hour,
//                     COUNT(*) as orders,
//                     SUM(o.total_amount) as sales
//                 FROM orders o
//                 WHERE DATE(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//                 GROUP BY HOUR(o.created_at)
//                 ORDER BY hour
//             `;

//       if (userRole === "seller") {
//         hourlyQuery = `
//                     SELECT 
//                         HOUR(o.created_at) as hour,
//                         COUNT(DISTINCT o.id) as orders,
//                         SUM(oi.price * oi.quantity) as sales
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE DATE(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY HOUR(o.created_at)
//                     ORDER BY hour
//                 `;
//       }

//       const [hourlyTrend] = await db.query(hourlyQuery, params);

//       // Get top products for the day
//       let topProductsQuery = `
//                 SELECT 
//                     p.id,
//                     p.name,
//                     c.name as category,
//                     SUM(oi.quantity) as units_sold,
//                     SUM(oi.price * oi.quantity) as revenue
//                 FROM order_items oi
//                 JOIN products p ON oi.product_id = p.id
//                 JOIN categories c ON p.category_id = c.id
//                 JOIN orders o ON oi.order_id = o.id
//                 WHERE DATE(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//                 GROUP BY p.id
//                 ORDER BY revenue DESC
//                 LIMIT 10
//             `;

//       if (userRole === "seller") {
//         topProductsQuery = `
//                     SELECT 
//                         p.id,
//                         p.name,
//                         c.name as category,
//                         SUM(oi.quantity) as units_sold,
//                         SUM(oi.price * oi.quantity) as revenue
//                     FROM order_items oi
//                     JOIN products p ON oi.product_id = p.id
//                     JOIN categories c ON p.category_id = c.id
//                     JOIN orders o ON oi.order_id = o.id
//                     WHERE DATE(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY p.id
//                     ORDER BY revenue DESC
//                     LIMIT 10
//                 `;
//       }

//       const [topProducts] = await db.query(topProductsQuery, params);

//       // Get payment methods
//       let paymentMethodQuery = `
//                 SELECT 
//                     payment_method,
//                     COUNT(*) as count,
//                     SUM(total_amount) as amount
//                 FROM orders
//                 WHERE DATE(created_at) = ?
//                 AND payment_status = 'paid'
//                 GROUP BY payment_method
//             `;

//       if (userRole === "seller") {
//         paymentMethodQuery = `
//                     SELECT 
//                         o.payment_method,
//                         COUNT(DISTINCT o.id) as count,
//                         SUM(oi.price * oi.quantity) as amount
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE DATE(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY o.payment_method
//                 `;
//       }

//       const [paymentMethods] = await db.query(paymentMethodQuery, params);

//       res.json({
//         success: true,
//         data: {
//           date: reportDate,
//           period: "daily",
//           summary: summary[0] || {},
//           top_products: topProducts,
//           hourly_trend: hourlyTrend,
//           payment_methods: paymentMethods,
//         },
//       });
//     } catch (error) {
//       console.error("Error generating daily sales report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate daily sales report",
//       });
//     }
//   }

//   // Weekly Sales Report
//   async getWeeklySalesReport(req, res) {
//     try {
//       const { week } = req.query;
//       const userId = req.user.id;
//       const userRole = req.user.role;

//       // Parse week parameter (format: YYYY-WW)
//       let year, weekNumber;
//       if (week) {
//         [year, weekNumber] = week.split("-W");
//         weekNumber = parseInt(weekNumber);
//       } else {
//         const now = new Date();
//         year = now.getFullYear();
//         const startDate = new Date(now.getFullYear(), 0, 1);
//         const days = Math.floor((now - startDate) / (24 * 60 * 60 * 1000));
//         weekNumber = Math.ceil(days / 7);
//       }

//       // Calculate week start and end dates
//       const weekStart = new Date(year, 0, (weekNumber - 1) * 7 + 1);
//       const weekEnd = new Date(year, 0, weekNumber * 7);

//       let query = `
//                 SELECT 
//                     YEARWEEK(o.created_at, 1) as week_number,
//                     COUNT(*) as total_orders,
//                     SUM(o.total_amount) as total_sales,
//                     AVG(o.total_amount) as avg_order_value,
//                     COUNT(DISTINCT o.user_id) as unique_customers,
//                     COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders
//                 FROM orders o
//                 WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
//                 AND o.payment_status = 'paid'
//             `;

//       let params = [weekStart];

//       if (userRole === "seller") {
//         query = `
//                     SELECT 
//                         YEARWEEK(o.created_at, 1) as week_number,
//                         COUNT(DISTINCT o.id) as total_orders,
//                         SUM(oi.price * oi.quantity) as total_sales,
//                         AVG(oi.price * oi.quantity) as avg_order_value,
//                         COUNT(DISTINCT o.user_id) as unique_customers,
//                         COUNT(DISTINCT CASE WHEN oi.status = 'delivered' THEN o.id END) as delivered_orders
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                 `;
//         params.push(userId);
//       }

//       const [summary] = await db.query(query, params);

//       // Get daily breakdown
//       let dailyQuery = `
//                 SELECT 
//                     DATE(o.created_at) as date,
//                     DAYNAME(o.created_at) as day,
//                     COUNT(*) as orders,
//                     SUM(o.total_amount) as sales
//                 FROM orders o
//                 WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
//                 AND o.payment_status = 'paid'
//                 GROUP BY DATE(o.created_at)
//                 ORDER BY date
//             `;

//       if (userRole === "seller") {
//         dailyQuery = `
//                     SELECT 
//                         DATE(o.created_at) as date,
//                         DAYNAME(o.created_at) as day,
//                         COUNT(DISTINCT o.id) as orders,
//                         SUM(oi.price * oi.quantity) as sales
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY DATE(o.created_at)
//                     ORDER BY date
//                 `;
//       }

//       const [dailyBreakdown] = await db.query(dailyQuery, params);

//       // Get top categories
//       let categoryQuery = `
//                 SELECT 
//                     c.id,
//                     c.name,
//                     COUNT(DISTINCT o.id) as orders,
//                     SUM(o.total_amount) as sales
//                 FROM orders o
//                 JOIN order_items oi ON o.id = oi.order_id
//                 JOIN products p ON oi.product_id = p.id
//                 JOIN categories c ON p.category_id = c.id
//                 WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
//                 AND o.payment_status = 'paid'
//                 GROUP BY c.id
//                 ORDER BY sales DESC
//                 LIMIT 5
//             `;

//       if (userRole === "seller") {
//         categoryQuery = `
//                     SELECT 
//                         c.id,
//                         c.name,
//                         COUNT(DISTINCT o.id) as orders,
//                         SUM(oi.price * oi.quantity) as sales
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     JOIN categories c ON p.category_id = c.id
//                     WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY c.id
//                     ORDER BY sales DESC
//                     LIMIT 5
//                 `;
//       }

//       const [topCategories] = await db.query(categoryQuery, params);

//       // Get seller performance (for admin only)
//       let sellerPerformance = [];
//       if (userRole === "admin") {
//         const sellerQuery = `
//                     SELECT 
//                         u.id,
//                         u.username,
//                         u.email,
//                         COUNT(DISTINCT o.id) as orders,
//                         SUM(oi.price * oi.quantity) as revenue,
//                         COUNT(DISTINCT o.user_id) as customers
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     JOIN users u ON p.seller_id = u.id
//                     WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
//                     AND o.payment_status = 'paid'
//                     GROUP BY u.id
//                     ORDER BY revenue DESC
//                     LIMIT 10
//                 `;
//         const [sellers] = await db.query(sellerQuery, [weekStart]);
//         sellerPerformance = sellers;
//       }

//       res.json({
//         success: true,
//         data: {
//           week: `${year}-W${weekNumber}`,
//           start_date: format(weekStart, "yyyy-MM-dd"),
//           end_date: format(weekEnd, "yyyy-MM-dd"),
//           summary: summary[0] || {},
//           daily_breakdown: dailyBreakdown,
//           top_categories: topCategories,
//           seller_performance: sellerPerformance,
//         },
//       });
//     } catch (error) {
//       console.error("Error generating weekly sales report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate weekly sales report",
//       });
//     }
//   }

//   // Monthly Sales Report
//   async getMonthlySalesReport(req, res) {
//     try {
//       const { month } = req.query; // Format: YYYY-MM
//       const userId = req.user.id;
//       const userRole = req.user.role;

//       let year, monthNumber;
//       if (month) {
//         [year, monthNumber] = month.split("-");
//         monthNumber = parseInt(monthNumber);
//       } else {
//         const now = new Date();
//         year = now.getFullYear();
//         monthNumber = now.getMonth() + 1;
//       }

//       const monthStart = new Date(year, monthNumber - 1, 1);
//       const monthEnd = new Date(year, monthNumber, 0);

//       let query = `
//                 SELECT 
//                     YEAR(o.created_at) as year,
//                     MONTH(o.created_at) as month,
//                     COUNT(*) as total_orders,
//                     SUM(o.total_amount) as total_sales,
//                     AVG(o.total_amount) as avg_order_value,
//                     COUNT(DISTINCT o.user_id) as total_customers,
//                     COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders,
//                     COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders,
//                     SUM(CASE WHEN o.status = 'cancelled' THEN o.total_amount ELSE 0 END) as refund_amount
//                 FROM orders o
//                 WHERE YEAR(o.created_at) = ?
//                 AND MONTH(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//             `;

//       let params = [year, monthNumber];

//       if (userRole === "seller") {
//         query = `
//                     SELECT 
//                         YEAR(o.created_at) as year,
//                         MONTH(o.created_at) as month,
//                         COUNT(DISTINCT o.id) as total_orders,
//                         SUM(oi.price * oi.quantity) as total_sales,
//                         AVG(oi.price * oi.quantity) as avg_order_value,
//                         COUNT(DISTINCT o.user_id) as total_customers,
//                         COUNT(DISTINCT CASE WHEN oi.status = 'delivered' THEN o.id END) as delivered_orders,
//                         COUNT(DISTINCT CASE WHEN oi.status = 'cancelled' THEN o.id END) as cancelled_orders,
//                         SUM(CASE WHEN oi.status = 'cancelled' THEN oi.price * oi.quantity ELSE 0 END) as refund_amount
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND MONTH(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                 `;
//         params.push(userId);
//       }

//       const [summary] = await db.query(query, params);

//       // Get weekly trend
//       let weeklyQuery = `
//                 SELECT 
//                     YEARWEEK(o.created_at, 1) as week,
//                     CONCAT('Week ', WEEK(o.created_at, 1)) as week_label,
//                     COUNT(*) as orders,
//                     SUM(o.total_amount) as sales
//                 FROM orders o
//                 WHERE YEAR(o.created_at) = ?
//                 AND MONTH(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//                 GROUP BY YEARWEEK(o.created_at, 1)
//                 ORDER BY week
//             `;

//       if (userRole === "seller") {
//         weeklyQuery = `
//                     SELECT 
//                         YEARWEEK(o.created_at, 1) as week,
//                         CONCAT('Week ', WEEK(o.created_at, 1)) as week_label,
//                         COUNT(DISTINCT o.id) as orders,
//                         SUM(oi.price * oi.quantity) as sales
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND MONTH(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY YEARWEEK(o.created_at, 1)
//                     ORDER BY week
//                 `;
//       }

//       const [weeklyTrend] = await db.query(weeklyQuery, params);

//       // Get geographic distribution (for admin only)
//       let geographicDistribution = [];
//       if (userRole === "admin") {
//         const geoQuery = `
//                     SELECT 
//                         JSON_UNQUOTE(JSON_EXTRACT(shipping_address, '$.country')) as country,
//                         COUNT(*) as orders,
//                         SUM(total_amount) as sales
//                     FROM orders
//                     WHERE YEAR(created_at) = ?
//                     AND MONTH(created_at) = ?
//                     AND payment_status = 'paid'
//                     AND shipping_address IS NOT NULL
//                     GROUP BY JSON_UNQUOTE(JSON_EXTRACT(shipping_address, '$.country'))
//                     ORDER BY sales DESC
//                 `;
//         const [geoData] = await db.query(geoQuery, [year, monthNumber]);
//         geographicDistribution = geoData;
//       }

//       // Get inventory analysis
//       const inventoryQuery = `
//                 SELECT 
//                     p.id,
//                     p.name,
//                     p.quantity,
//                     p.sku,
//                     c.name as category_name,
//                     (
//                         SELECT COUNT(*) 
//                         FROM order_items oi 
//                         JOIN orders o ON oi.order_id = o.id 
//                         WHERE oi.product_id = p.id 
//                         AND YEAR(o.created_at) = ? 
//                         AND MONTH(o.created_at) = ?
//                         AND o.payment_status = 'paid'
//                     ) as sold_this_month,
//                     (
//                         SELECT MAX(o.created_at) 
//                         FROM order_items oi 
//                         JOIN orders o ON oi.order_id = o.id 
//                         WHERE oi.product_id = p.id 
//                         AND o.payment_status = 'paid'
//                     ) as last_sold
//                 FROM products p
//                 JOIN categories c ON p.category_id = c.id
//                 WHERE p.quantity <= 10
//                 AND p.track_quantity = 1
//                 ${userRole === "seller" ? "AND p.seller_id = ?" : ""}
//                 ORDER BY p.quantity ASC
//                 LIMIT 10
//             `;

//       const inventoryParams =
//         userRole === "seller"
//           ? [year, monthNumber, userId]
//           : [year, monthNumber];
//       const [inventoryAnalysis] = await db.query(
//         inventoryQuery,
//         inventoryParams
//       );

//       // Get best sellers
//       let bestSellersQuery = `
//                 SELECT 
//                     p.id,
//                     p.name,
//                     c.name as category_name,
//                     SUM(oi.quantity) as units_sold,
//                     SUM(oi.price * oi.quantity) as revenue
//                 FROM order_items oi
//                 JOIN products p ON oi.product_id = p.id
//                 JOIN categories c ON p.category_id = c.id
//                 JOIN orders o ON oi.order_id = o.id
//                 WHERE YEAR(o.created_at) = ?
//                 AND MONTH(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//                 GROUP BY p.id
//                 ORDER BY revenue DESC
//                 LIMIT 10
//             `;

//       if (userRole === "seller") {
//         bestSellersQuery = `
//                     SELECT 
//                         p.id,
//                         p.name,
//                         c.name as category_name,
//                         SUM(oi.quantity) as units_sold,
//                         SUM(oi.price * oi.quantity) as revenue
//                     FROM order_items oi
//                     JOIN products p ON oi.product_id = p.id
//                     JOIN categories c ON p.category_id = c.id
//                     JOIN orders o ON oi.order_id = o.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND MONTH(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY p.id
//                     ORDER BY revenue DESC
//                     LIMIT 10
//                 `;
//       }

//       const [bestSellers] = await db.query(bestSellersQuery, params);

//       res.json({
//         success: true,
//         data: {
//           month: `${year}-${String(monthNumber).padStart(2, "0")}`,
//           summary: summary[0] || {},
//           weekly_trend: weeklyTrend,
//           geographic_distribution: geographicDistribution,
//           inventory_analysis: {
//             low_stock_items: inventoryAnalysis.filter(
//               (item) => item.quantity <= 10
//             ),
//             best_sellers: bestSellers,
//             dead_stock: inventoryAnalysis.filter(
//               (item) => !item.sold_this_month && item.quantity > 0
//             ),
//           },
//         },
//       });
//     } catch (error) {
//       console.error("Error generating monthly sales report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate monthly sales report",
//       });
//     }
//   }

//   // Yearly Sales Report
//   async getYearlySalesReport(req, res) {
//     try {
//       const { year } = req.query || new Date().getFullYear();
//       const userId = req.user.id;
//       const userRole = req.user.role;

//       let query = `
//                 SELECT 
//                     YEAR(o.created_at) as year,
//                     COUNT(*) as total_orders,
//                     SUM(o.total_amount) as total_sales,
//                     AVG(o.total_amount) as avg_order_value,
//                     COUNT(DISTINCT o.user_id) as total_customers,
//                     (
//                         SELECT COUNT(*) 
//                         FROM orders o2 
//                         WHERE YEAR(o2.created_at) = ? - 1
//                         AND o2.payment_status = 'paid'
//                     ) as previous_year_orders,
//                     (
//                         SELECT SUM(total_amount) 
//                         FROM orders o2 
//                         WHERE YEAR(o2.created_at) = ? - 1
//                         AND o2.payment_status = 'paid'
//                     ) as previous_year_sales
//                 FROM orders o
//                 WHERE YEAR(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//             `;

//       let params = [year, year, year];

//       if (userRole === "seller") {
//         query = `
//                     SELECT 
//                         YEAR(o.created_at) as year,
//                         COUNT(DISTINCT o.id) as total_orders,
//                         SUM(oi.price * oi.quantity) as total_sales,
//                         AVG(oi.price * oi.quantity) as avg_order_value,
//                         COUNT(DISTINCT o.user_id) as total_customers,
//                         (
//                             SELECT COUNT(DISTINCT o2.id) 
//                             FROM orders o2
//                             JOIN order_items oi2 ON o2.id = oi2.order_id
//                             JOIN products p2 ON oi2.product_id = p2.id
//                             WHERE YEAR(o2.created_at) = ? - 1
//                             AND o2.payment_status = 'paid'
//                             AND p2.seller_id = ?
//                         ) as previous_year_orders,
//                         (
//                             SELECT SUM(oi2.price * oi2.quantity) 
//                             FROM orders o2
//                             JOIN order_items oi2 ON o2.id = oi2.order_id
//                             JOIN products p2 ON oi2.product_id = p2.id
//                             WHERE YEAR(o2.created_at) = ? - 1
//                             AND o2.payment_status = 'paid'
//                             AND p2.seller_id = ?
//                         ) as previous_year_sales
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                 `;
//         params = [year, userId, year, userId, year, userId];
//       }

//       const [summary] = await db.query(query, params);

//       // Calculate year-over-year growth
//       const currentYearSales = summary[0]?.total_sales || 0;
//       const previousYearSales = summary[0]?.previous_year_sales || 0;
//       const yoyGrowth =
//         previousYearSales > 0
//           ? ((currentYearSales - previousYearSales) / previousYearSales) * 100
//           : 0;

//       // Get monthly breakdown
//       let monthlyQuery = `
//                 SELECT 
//                     MONTH(o.created_at) as month,
//                     DATE_FORMAT(o.created_at, '%Y-%m') as month_date,
//                     COUNT(*) as orders,
//                     SUM(o.total_amount) as sales
//                 FROM orders o
//                 WHERE YEAR(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//                 GROUP BY MONTH(o.created_at)
//                 ORDER BY month
//             `;

//       if (userRole === "seller") {
//         monthlyQuery = `
//                     SELECT 
//                         MONTH(o.created_at) as month,
//                         DATE_FORMAT(o.created_at, '%Y-%m') as month_date,
//                         COUNT(DISTINCT o.id) as orders,
//                         SUM(oi.price * oi.quantity) as sales
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY MONTH(o.created_at)
//                     ORDER BY month
//                 `;
//       }

//       const [monthlyBreakdown] = await db.query(
//         monthlyQuery,
//         userRole === "seller" ? [year, userId] : [year]
//       );

//       // Get category performance
//       let categoryQuery = `
//                 SELECT 
//                     c.id,
//                     c.name as category_name,
//                     COUNT(DISTINCT o.id) as orders,
//                     SUM(o.total_amount) as sales,
//                     (
//                         SELECT SUM(o2.total_amount) 
//                         FROM orders o2
//                         JOIN order_items oi2 ON o2.id = oi2.order_id
//                         JOIN products p2 ON oi2.product_id = p2.id
//                         JOIN categories c2 ON p2.category_id = c2.id
//                         WHERE YEAR(o2.created_at) = ? - 1
//                         AND c2.id = c.id
//                         AND o2.payment_status = 'paid'
//                     ) as previous_year_sales
//                 FROM orders o
//                 JOIN order_items oi ON o.id = oi.order_id
//                 JOIN products p ON oi.product_id = p.id
//                 JOIN categories c ON p.category_id = c.id
//                 WHERE YEAR(o.created_at) = ?
//                 AND o.payment_status = 'paid'
//                 GROUP BY c.id
//                 ORDER BY sales DESC
//                 LIMIT 10
//             `;

//       if (userRole === "seller") {
//         categoryQuery = `
//                     SELECT 
//                         c.id,
//                         c.name as category_name,
//                         COUNT(DISTINCT o.id) as orders,
//                         SUM(oi.price * oi.quantity) as sales,
//                         (
//                             SELECT SUM(oi2.price * oi2.quantity) 
//                             FROM orders o2
//                             JOIN order_items oi2 ON o2.id = oi2.order_id
//                             JOIN products p2 ON oi2.product_id = p2.id
//                             JOIN categories c2 ON p2.category_id = c2.id
//                             WHERE YEAR(o2.created_at) = ? - 1
//                             AND c2.id = c.id
//                             AND o2.payment_status = 'paid'
//                             AND p2.seller_id = ?
//                         ) as previous_year_sales
//                     FROM orders o
//                     JOIN order_items oi ON o.id = oi.order_id
//                     JOIN products p ON oi.product_id = p.id
//                     JOIN categories c ON p.category_id = c.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND p.seller_id = ?
//                     GROUP BY c.id
//                     ORDER BY sales DESC
//                     LIMIT 10
//                 `;
//       }

//       const categoryParams =
//         userRole === "seller" ? [year, userId, year, userId] : [year, year];
//       const [categoryPerformance] = await db.query(
//         categoryQuery,
//         categoryParams
//       );

//       // Calculate category growth
//       const categoryPerformanceWithGrowth = categoryPerformance.map((cat) => {
//         const currentSales = cat.sales || 0;
//         const previousSales = cat.previous_year_sales || 0;
//         const growth =
//           previousSales > 0
//             ? ((currentSales - previousSales) / previousSales) * 100
//             : currentSales > 0
//             ? 100
//             : 0;

//         return {
//           ...cat,
//           growth: parseFloat(growth.toFixed(2)),
//         };
//       });

//       // Get customer analysis (for admin only)
//       let customerAnalysis = {};
//       if (userRole === "admin") {
//         const customerQuery = `
//                     SELECT 
//                         COUNT(DISTINCT CASE WHEN order_count = 1 THEN user_id END) as new_customers,
//                         COUNT(DISTINCT CASE WHEN order_count > 1 THEN user_id END) as returning_customers,
//                         AVG(order_count) as avg_orders_per_customer,
//                         AVG(total_spent) as avg_customer_value
//                     FROM (
//                         SELECT 
//                             user_id,
//                             COUNT(*) as order_count,
//                             SUM(total_amount) as total_spent
//                         FROM orders
//                         WHERE YEAR(created_at) = ?
//                         AND payment_status = 'paid'
//                         GROUP BY user_id
//                     ) as customer_stats
//                 `;

//         const [customerStats] = await db.query(customerQuery, [year]);
//         customerAnalysis.new_vs_returning = {
//           new: customerStats[0]?.new_customers || 0,
//           returning: customerStats[0]?.returning_customers || 0,
//         };

//         // Get top spenders
//         const topSpendersQuery = `
//                     SELECT 
//                         u.id,
//                         u.username,
//                         u.email,
//                         COUNT(o.id) as total_orders,
//                         SUM(o.total_amount) as total_spent,
//                         MAX(o.created_at) as last_order_date
//                     FROM orders o
//                     JOIN users u ON o.user_id = u.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     GROUP BY u.id
//                     ORDER BY total_spent DESC
//                     LIMIT 10
//                 `;

//         const [topSpenders] = await db.query(topSpendersQuery, [year]);
//         customerAnalysis.top_spenders = topSpenders;
//       }

//       // Get coupon effectiveness
//       let couponEffectiveness = [];
//       if (userRole === "admin") {
//         const couponQuery = `
//                     SELECT 
//                         c.id,
//                         c.code,
//                         c.discount_type,
//                         c.discount_value,
//                         c.min_order_amount,
//                         COUNT(DISTINCT o.id) as times_used,
//                         SUM(
//                             CASE 
//                                 WHEN c.discount_type = 'percentage' 
//                                 THEN LEAST(o.total_amount * (c.discount_value / 100), c.max_discount_amount)
//                                 ELSE c.discount_value
//                             END
//                         ) as total_discount,
//                         SUM(o.total_amount) as orders_generated
//                     FROM orders o
//                     LEFT JOIN coupons c ON o.coupon_id = c.id
//                     WHERE YEAR(o.created_at) = ?
//                     AND o.payment_status = 'paid'
//                     AND c.id IS NOT NULL
//                     GROUP BY c.id
//                     ORDER BY times_used DESC
//                     LIMIT 10
//                 `;

//         const [couponData] = await db.query(couponQuery, [year]);
//         couponEffectiveness = couponData;
//       }

//       res.json({
//         success: true,
//         data: {
//           year: parseInt(year),
//           summary: {
//             ...summary[0],
//             year_over_year_growth: parseFloat(yoyGrowth.toFixed(2)),
//             average_monthly_sales: (summary[0]?.total_sales || 0) / 12,
//             total_customers: summary[0]?.total_customers || 0,
//             average_customer_value:
//               summary[0]?.total_sales / summary[0]?.total_customers || 0,
//           },
//           monthly_breakdown: monthlyBreakdown,
//           category_performance: categoryPerformanceWithGrowth,
//           customer_analysis: customerAnalysis,
//           coupon_effectiveness: couponEffectiveness,
//         },
//       });
//     } catch (error) {
//       console.error("Error generating yearly sales report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate yearly sales report",
//       });
//     }
//   }

//   // Export Functions
//   async exportSalesReport(req, res) {
//     try {
//       const { period, format = "csv", startDate, endDate } = req.query;
//       const userId = req.user.id;
//       const userRole = req.user.role;

//       // Get sales data based on period
//       let salesData;
//       switch (period) {
//         case "daily":
//           salesData = await this.getDailySalesData(userId, userRole, startDate);
//           break;
//         case "weekly":
//           salesData = await this.getWeeklySalesData(
//             userId,
//             userRole,
//             startDate
//           );
//           break;
//         case "monthly":
//           salesData = await this.getMonthlySalesData(
//             userId,
//             userRole,
//             startDate
//           );
//           break;
//         case "yearly":
//           salesData = await this.getYearlySalesData(
//             userId,
//             userRole,
//             startDate
//           );
//           break;
//         default:
//           if (startDate && endDate) {
//             salesData = await this.getCustomSalesData(
//               userId,
//               userRole,
//               startDate,
//               endDate
//             );
//           } else {
//             return res.status(400).json({
//               success: false,
//               message: "Invalid period or date range",
//             });
//           }
//       }

//       // Export based on format
//       switch (format.toLowerCase()) {
//         case "csv":
//           return this.exportToCSV(
//             res,
//             salesData,
//             `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
//           );
//         case "excel":
//           return this.exportToExcel(
//             res,
//             salesData,
//             `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
//           );
//         case "pdf":
//           return this.exportToPDF(
//             res,
//             salesData,
//             `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
//           );
//         case "json":
//           return this.exportToJSON(
//             res,
//             salesData,
//             `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
//           );
//         default:
//           return res
//             .status(400)
//             .json({ success: false, message: "Unsupported export format" });
//       }
//     } catch (error) {
//       console.error("Error exporting sales report:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Failed to export sales report" });
//     }
//   }

//   async exportToCSV(res, data, filename) {
//     try {
//       // Convert data to CSV format
//       const headers = Object.keys(data[0] || {});
//       const csvContent = [
//         headers.join(","),
//         ...data.map((row) =>
//           headers
//             .map((header) => {
//               const value = row[header];
//               if (typeof value === "object") return JSON.stringify(value);
//               return `"${value}"`;
//             })
//             .join(",")
//         ),
//       ].join("\n");

//       res.setHeader("Content-Type", "text/csv");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${filename}.csv"`
//       );
//       res.send(csvContent);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async exportToExcel(res, data, filename) {
//     try {
//       const worksheet = XLSX.utils.json_to_sheet(data);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "buffer",
//       });

//       res.setHeader(
//         "Content-Type",
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       );
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${filename}.xlsx"`
//       );
//       res.send(excelBuffer);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async exportToPDF(res, data, filename) {
//     try {
//       const doc = new jsPDF();

//       // Add title
//       doc.setFontSize(16);
//       doc.text("Sales Report", 20, 20);
//       doc.setFontSize(10);
//       doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

//       // Prepare table data
//       const headers = Object.keys(data[0] || {});
//       const tableData = data.map((row) => headers.map((header) => row[header]));

//       // Add table
//       autoTable(doc, {
//         head: [headers],
//         body: tableData,
//         startY: 40,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [59, 130, 246] },
//       });

//       const pdfBuffer = doc.output("arraybuffer");

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${filename}.pdf"`
//       );
//       res.send(Buffer.from(pdfBuffer));
//     } catch (error) {
//       throw error;
//     }
//   }

//   async exportToJSON(res, data, filename) {
//     try {
//       const jsonData = {
//         generated: new Date().toISOString(),
//         record_count: data.length,
//         data: data,
//       };

//       res.setHeader("Content-Type", "application/json");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${filename}.json"`
//       );
//       res.send(JSON.stringify(jsonData, null, 2));
//     } catch (error) {
//       throw error;
//     }
//   }

//   // Helper methods for data retrieval
//   async getDailySalesData(userId, userRole, date) {
//     // Implementation for daily sales data
//     const query =
//       userRole === "seller" ? `SELECT ... WHERE p.seller_id = ?` : `SELECT ...`;
//     // ... implement based on your database structure
//     return [];
//   }

//   async getWeeklySalesData(userId, userRole, week) {
//     // Implementation for weekly sales data
//     return [];
//   }

//   async getMonthlySalesData(userId, userRole, month) {
//     // Implementation for monthly sales data
//     return [];
//   }

//   async getYearlySalesData(userId, userRole, year) {
//     // Implementation for yearly sales data
//     return [];
//   }

//   async getCustomSalesData(userId, userRole, startDate, endDate) {
//     // Implementation for custom date range sales data
//     return [];
//   }
// }

// export default new ReportController();



// controllers/reportController.js
import db from "../config/database.js";
import moment from "moment";
import XLSX from "xlsx";
import PDFDocument from "pdfkit";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Dashboard Statistics - DEBUG VERSION
export const getDashboardStats = async (req, res) => {
  console.log("=== DEBUG: getDashboardStats called ===");
  console.log("Query params:", req.query);
  console.log("User:", req.user);
  
  try {
    const { period = "monthly", startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("Period:", period);
    console.log("User ID:", userId);
    console.log("User Role:", userRole);

    let dateCondition = "";
    let dateParams = [];

    if (startDate && endDate) {
      dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
      dateParams.push(startDate, endDate);
      console.log("Custom date range:", startDate, "to", endDate);
    } else {
      const now = moment();
      let start, end;

      switch (period) {
        case "daily":
          start = now.format("YYYY-MM-DD");
          end = now.format("YYYY-MM-DD");
          dateCondition = `AND DATE(o.created_at) = ?`;
          dateParams.push(start);
          console.log("Daily period:", start);
          break;
        case "weekly":
          start = now.startOf('week').format("YYYY-MM-DD");
          end = now.endOf('week').format("YYYY-MM-DD");
          dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
          dateParams.push(start, end);
          console.log("Weekly period:", start, "to", end);
          break;
        case "monthly":
          start = now.startOf('month').format("YYYY-MM-DD");
          end = now.endOf('month').format("YYYY-MM-DD");
          dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
          dateParams.push(start, end);
          console.log("Monthly period:", start, "to", end);
          break;
        case "yearly":
          start = now.startOf('year').format("YYYY-MM-DD");
          end = now.endOf('year').format("YYYY-MM-DD");
          dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
          dateParams.push(start, end);
          console.log("Yearly period:", start, "to", end);
          break;
        default:
          console.log("Unknown period, using monthly");
          start = now.startOf('month').format("YYYY-MM-DD");
          end = now.endOf('month').format("YYYY-MM-DD");
          dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
          dateParams.push(start, end);
      }
    }

    console.log("Date condition:", dateCondition);
    console.log("Date params:", dateParams);

    // Get total orders and sales
    let orderQuery = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as avg_order_value,
        COUNT(DISTINCT user_id) as unique_customers
      FROM orders o
      WHERE o.payment_status = 'paid'
      ${dateCondition}
    `;

    // For sellers, only show their products
    if (userRole === "seller") {
      orderQuery = `
        SELECT 
          COUNT(DISTINCT o.id) as total_orders,
          SUM(oi.price * oi.quantity) as total_sales,
          AVG(oi.price * oi.quantity) as avg_order_value,
          COUNT(DISTINCT o.user_id) as unique_customers
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.payment_status = 'paid'
        AND p.seller_id = ?
        ${dateCondition}
      `;
      dateParams.unshift(userId);
    }

    console.log("Order query:", orderQuery);
    console.log("Order query params:", dateParams);

    let orderStats;
    try {
      [orderStats] = await db.query(orderQuery, dateParams);
      console.log("Order stats result:", orderStats);
    } catch (dbError) {
      console.error("Database error in order query:", dbError);
      console.error("SQL:", orderQuery);
      console.error("Params:", dateParams);
      throw dbError;
    }

    // Get order status breakdown
    let statusQuery = `
      SELECT 
        status,
        COUNT(*) as count
      FROM orders
      WHERE 1=1 ${dateCondition}
      GROUP BY status
    `;

    if (userRole === "seller") {
      statusQuery = `
        SELECT 
          oi.status,
          COUNT(DISTINCT o.id) as count
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE p.seller_id = ?
        ${dateCondition}
        GROUP BY oi.status
      `;
    }

    console.log("Status query:", statusQuery);
    console.log("Status query params:", dateParams);

    let statusBreakdown;
    try {
      [statusBreakdown] = await db.query(statusQuery, dateParams);
      console.log("Status breakdown result:", statusBreakdown);
    } catch (dbError) {
      console.error("Database error in status query:", dbError);
      throw dbError;
    }

    // Get top products
    let topProductsQuery = `
      SELECT 
        p.id,
        p.name,
        p.category_id,
        c.name as category_name,
        SUM(oi.quantity) as units_sold,
        SUM(oi.price * oi.quantity) as revenue,
        p.quantity as current_stock
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      ${dateCondition}
      GROUP BY p.id
      ORDER BY revenue DESC
      LIMIT 10
    `;

    if (userRole === "seller") {
      topProductsQuery = `
        SELECT 
          p.id,
          p.name,
          p.category_id,
          c.name as category_name,
          SUM(oi.quantity) as units_sold,
          SUM(oi.price * oi.quantity) as revenue,
          p.quantity as current_stock
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.payment_status = 'paid'
        AND p.seller_id = ?
        ${dateCondition}
        GROUP BY p.id
        ORDER BY revenue DESC
        LIMIT 10
      `;
    }

    console.log("Top products query:", topProductsQuery);
    console.log("Top products params:", dateParams);

    let topProducts;
    try {
      [topProducts] = await db.query(topProductsQuery, dateParams);
      console.log("Top products result:", topProducts);
    } catch (dbError) {
      console.error("Database error in top products query:", dbError);
      throw dbError;
    }

    // Get daily/weekly/monthly trend
    const trendQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE payment_status = 'paid'
      ${dateCondition}
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    console.log("Trend query:", trendQuery);
    console.log("Trend params:", dateParams);

    let trendData;
    try {
      [trendData] = await db.query(trendQuery, dateParams);
      console.log("Trend data result:", trendData);
    } catch (dbError) {
      console.error("Database error in trend query:", dbError);
      throw dbError;
    }

    // Get low stock products
    const lowStockQuery = `
      SELECT 
        p.id,
        p.name,
        p.quantity,
        p.sku,
        c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.quantity <= 10
      AND p.track_quantity = 1
      ${userRole === "seller" ? "AND p.seller_id = ?" : ""}
      ORDER BY p.quantity ASC
      LIMIT 10
    `;

    const lowStockParams = userRole === "seller" ? [userId] : [];
    console.log("Low stock query:", lowStockQuery);
    console.log("Low stock params:", lowStockParams);

    let lowStockProducts;
    try {
      [lowStockProducts] = await db.query(lowStockQuery, lowStockParams);
      console.log("Low stock products result:", lowStockProducts);
    } catch (dbError) {
      console.error("Database error in low stock query:", dbError);
      throw dbError;
    }

    const response = {
      success: true,
      data: {
        period,
        summary: {
          total_orders: orderStats[0]?.total_orders || 0,
          total_sales: orderStats[0]?.total_sales || 0,
          avg_order_value: orderStats[0]?.avg_order_value || 0,
          unique_customers: orderStats[0]?.unique_customers || 0,
        },
        status_breakdown: statusBreakdown,
        top_products: topProducts,
        trend_data: trendData,
        low_stock_products: lowStockProducts,
      },
    };

    console.log("=== DEBUG: Response being sent ===");
    console.log(JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error("=== DEBUG: Error in getDashboardStats ===");
    console.error("Full error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Check if it's a database error
    if (error.code) {
      console.error("Database error code:", error.code);
      console.error("Database error number:", error.errno);
      console.error("Database SQL state:", error.sqlState);
      console.error("Database SQL message:", error.sqlMessage);
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        sqlState: error.sqlState
      } : undefined
    });
  }
};

// Fixed getProductPerformance - handles missing productId
export const getProductPerformance = async (req, res) => {
  try {
    const { productId, period = 'monthly' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("Product performance params:", req.query);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required. Please provide a productId parameter."
      });
    }

    // Verify product ownership for sellers
    if (userRole === 'seller') {
      const [product] = await db.query(
        "SELECT id FROM products WHERE id = ? AND seller_id = ?",
        [productId, userId]
      );
      
      if (product.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view this product"
        });
      }
    }

    let periodCondition = "";
    let groupBy = "";
    
    switch (period) {
      case 'daily':
        periodCondition = "DATE(o.created_at)";
        groupBy = "DATE(o.created_at)";
        break;
      case 'weekly':
        periodCondition = "YEARWEEK(o.created_at, 1)";
        groupBy = "YEARWEEK(o.created_at, 1)";
        break;
      case 'monthly':
        periodCondition = "DATE_FORMAT(o.created_at, '%Y-%m')";
        groupBy = "DATE_FORMAT(o.created_at, '%Y-%m')";
        break;
      default:
        periodCondition = "DATE_FORMAT(o.created_at, '%Y-%m')";
        groupBy = "DATE_FORMAT(o.created_at, '%Y-%m')";
    }

    const query = `
      SELECT 
        ${periodCondition} as period,
        COUNT(DISTINCT o.id) as total_orders,
        SUM(oi.quantity) as total_units_sold,
        SUM(oi.price * oi.quantity) as total_revenue,
        AVG(oi.price * oi.quantity) as avg_sale_value
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = ?
      AND o.payment_status = 'paid'
      GROUP BY ${groupBy}
      ORDER BY period DESC
      LIMIT 12
    `;

    const [performance] = await db.query(query, [productId]);

    res.json({
      success: true,
      data: {
        product_id: productId,
        period,
        performance: performance || []
      }
    });
  } catch (error) {
    console.error("Error fetching product performance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product performance"
    });
  }
};

// Implemented getUserActivity
export const getUserActivity = async (req, res) => {
  try {
    const { period = 'monthly', limit = 50 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only administrators can access user activity reports"
      });
    }

    let dateCondition = "";
    switch (period) {
      case 'daily':
        dateCondition = "AND DATE(u.last_login) = CURDATE()";
        break;
      case 'weekly':
        dateCondition = "AND u.last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        break;
      case 'monthly':
        dateCondition = "AND u.last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        break;
      default:
        dateCondition = "AND u.last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    }

    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.last_login,
        u.created_at as registration_date,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        (
          SELECT COUNT(*) 
          FROM user_sessions us 
          WHERE us.user_id = u.id 
          AND us.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) as sessions_last_30_days
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id IS NOT NULL
      ${dateCondition}
      GROUP BY u.id
      ORDER BY u.last_login DESC
      LIMIT ?
    `;

    const [userActivity] = await db.query(query, [parseInt(limit)]);

    res.json({
      success: true,
      data: {
        period,
        total_users: userActivity.length,
        users: userActivity
      }
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity"
    });
  }
};

// Implemented getUserStats
export const getUserStats = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only administrators can access user statistics"
      });
    }

    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
        COUNT(CASE WHEN role = 'seller' THEN 1 END) as seller_users,
        COUNT(CASE WHEN role = 'customer' THEN 1 END) as customer_users,
        COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_users_30d,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30d,
        AVG(TIMESTAMPDIFF(DAY, created_at, NOW())) as avg_account_age_days
      FROM users
    `;

    const [stats] = await db.query(statsQuery);

    const growthQuery = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `;

    const [growthData] = await db.query(growthQuery);

    res.json({
      success: true,
      data: {
        summary: stats[0],
        growth_trend: growthData,
        calculated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics"
    });
  }
};

// Implemented getCouponUsage
export const getCouponUsage = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only administrators can access coupon usage reports"
      });
    }

    let dateCondition = "";
    let dateParams = [];

    if (startDate && endDate) {
      dateCondition = "AND DATE(o.created_at) BETWEEN ? AND ?";
      dateParams.push(startDate, endDate);
    } else {
      const now = moment();
      switch (period) {
        case 'daily':
          dateCondition = "AND DATE(o.created_at) = ?";
          dateParams.push(now.format("YYYY-MM-DD"));
          break;
        case 'weekly':
          dateCondition = "AND o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
          break;
        case 'monthly':
          dateCondition = "AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
          break;
        default:
          dateCondition = "AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      }
    }

    const query = `
      SELECT 
        c.id,
        c.code,
        c.discount_type,
        c.discount_value,
        c.min_order_amount,
        c.max_usage,
        c.usage_count,
        c.start_date,
        c.end_date,
        c.is_active,
        COUNT(DISTINCT o.id) as times_used,
        COALESCE(SUM(
          CASE 
            WHEN c.discount_type = 'percentage' 
            THEN LEAST(o.total_amount * (c.discount_value / 100), c.max_discount_amount)
            ELSE c.discount_value
          END
        ), 0) as total_discount,
        COALESCE(SUM(o.total_amount), 0) as total_sales_with_coupon,
        COUNT(DISTINCT o.user_id) as unique_users
      FROM coupons c
      LEFT JOIN orders o ON c.id = o.coupon_id AND o.payment_status = 'paid'
      WHERE c.id IS NOT NULL
      ${dateCondition}
      GROUP BY c.id
      ORDER BY times_used DESC
    `;

    const [couponUsage] = await db.query(query, dateParams);

    // Calculate effectiveness
    const couponsWithEffectiveness = couponUsage.map(coupon => {
      const effectiveness = coupon.times_used > 0 ? 
        (coupon.total_discount / coupon.total_sales_with_coupon) * 100 : 0;
      
      return {
        ...coupon,
        effectiveness_rate: parseFloat(effectiveness.toFixed(2)),
        is_expired: coupon.end_date && new Date(coupon.end_date) < new Date(),
        is_upcoming: coupon.start_date && new Date(coupon.start_date) > new Date()
      };
    });

    // Summary statistics
    const summary = {
      total_coupons: couponsWithEffectiveness.length,
      active_coupons: couponsWithEffectiveness.filter(c => c.is_active).length,
      total_usage: couponsWithEffectiveness.reduce((sum, c) => sum + c.times_used, 0),
      total_discount: couponsWithEffectiveness.reduce((sum, c) => sum + c.total_discount, 0),
      avg_effectiveness: couponsWithEffectiveness.length > 0 ?
        couponsWithEffectiveness.reduce((sum, c) => sum + c.effectiveness_rate, 0) / couponsWithEffectiveness.length : 0
    };

    res.json({
      success: true,
      data: {
        period,
        summary,
        coupons: couponsWithEffectiveness,
        most_effective: [...couponsWithEffectiveness]
          .sort((a, b) => b.effectiveness_rate - a.effectiveness_rate)
          .slice(0, 5),
        most_used: [...couponsWithEffectiveness]
          .sort((a, b) => b.times_used - a.times_used)
          .slice(0, 5)
      }
    });
  } catch (error) {
    console.error("Error fetching coupon usage:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon usage"
    });
  }
};

// Implement getQuickStats
export const getQuickStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let today = moment().format("YYYY-MM-DD");
    let yesterday = moment().subtract(1, 'day').format("YYYY-MM-DD");
    let lastMonth = moment().subtract(1, 'month').format("YYYY-MM");

    // Today's sales
    let todaySalesQuery = `
      SELECT 
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE DATE(created_at) = ?
      AND payment_status = 'paid'
    `;

    let todayParams = [today];
    if (userRole === 'seller') {
      todaySalesQuery = `
        SELECT 
          COUNT(DISTINCT o.id) as orders,
          COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE DATE(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
      `;
      todayParams.push(userId);
    }

    const [todaySales] = await db.query(todaySalesQuery, todayParams);

    // Yesterday's sales
    let yesterdayParams = [yesterday];
    if (userRole === 'seller') {
      yesterdayParams.push(userId);
    }
    const [yesterdaySales] = await db.query(todaySalesQuery.replace('?', '?'), yesterdayParams);

    // This month sales
    let monthSalesQuery = `
      SELECT 
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE DATE_FORMAT(created_at, '%Y-%m') = ?
      AND payment_status = 'paid'
    `;

    let monthParams = [lastMonth];
    if (userRole === 'seller') {
      monthSalesQuery = `
        SELECT 
          COUNT(DISTINCT o.id) as orders,
          COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE DATE_FORMAT(o.created_at, '%Y-%m') = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
      `;
      monthParams.push(userId);
    }

    const [monthSales] = await db.query(monthSalesQuery, monthParams);

    // Pending orders
    let pendingQuery = `
      SELECT COUNT(*) as count
      FROM orders
      WHERE status IN ('pending', 'processing')
    `;

    if (userRole === 'seller') {
      pendingQuery = `
        SELECT COUNT(DISTINCT o.id) as count
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.status IN ('pending', 'processing')
        AND p.seller_id = ?
      `;
    }

    const pendingParams = userRole === 'seller' ? [userId] : [];
    const [pendingOrders] = await db.query(pendingQuery, pendingParams);

    // Low stock products
    const lowStockQuery = `
      SELECT COUNT(*) as count
      FROM products
      WHERE quantity <= 10
      AND track_quantity = 1
      ${userRole === 'seller' ? 'AND seller_id = ?' : ''}
    `;

    const lowStockParams = userRole === 'seller' ? [userId] : [];
    const [lowStock] = await db.query(lowStockQuery, lowStockParams);

    res.json({
      success: true,
      data: {
        today: {
          orders: todaySales[0]?.orders || 0,
          revenue: todaySales[0]?.revenue || 0
        },
        yesterday: {
          orders: yesterdaySales[0]?.orders || 0,
          revenue: yesterdaySales[0]?.revenue || 0,
          change: todaySales[0]?.revenue - yesterdaySales[0]?.revenue || 0
        },
        this_month: {
          orders: monthSales[0]?.orders || 0,
          revenue: monthSales[0]?.revenue || 0
        },
        alerts: {
          pending_orders: pendingOrders[0]?.count || 0,
          low_stock: lowStock[0]?.count || 0
        },
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quick statistics"
    });
  }
};

// Implement getRecentActivity
export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { limit = 10 } = req.query;

    let recentOrdersQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at,
        u.username as customer_name,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
      ${userRole === 'seller' ? `
        AND EXISTS (
          SELECT 1 FROM order_items oi2 
          JOIN products p ON oi2.product_id = p.id 
          WHERE oi2.order_id = o.id AND p.seller_id = ?
        )
      ` : ''}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `;

    const orderParams = userRole === 'seller' ? [userId, parseInt(limit)] : [parseInt(limit)];
    const [recentOrders] = await db.query(recentOrdersQuery, orderParams);

    // Recent registrations (admin only)
    let recentRegistrations = [];
    if (userRole === 'admin') {
      const regQuery = `
        SELECT 
          id,
          username,
          email,
          role,
          created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT ?
      `;
      const [registrations] = await db.query(regQuery, [5]);
      recentRegistrations = registrations;
    }

    // Recent product updates (seller only)
    let recentProducts = [];
    if (userRole === 'seller') {
      const productQuery = `
        SELECT 
          id,
          name,
          price,
          quantity,
          updated_at
        FROM products
        WHERE seller_id = ?
        ORDER BY updated_at DESC
        LIMIT ?
      `;
      const [products] = await db.query(productQuery, [userId, 5]);
      recentProducts = products;
    }

    res.json({
      success: true,
      data: {
        recent_orders: recentOrders,
        recent_registrations: recentRegistrations,
        recent_products: recentProducts,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activity"
    });
  }
};
// Dashboard Statistics
// export const getDashboardStats = async (req, res) => {
//   try {
//     const { period = "monthly", startDate, endDate } = req.query;
//     const userId = req.user.id;
//     const userRole = req.user.role;

//     let dateCondition = "";
//     let dateParams = [];

//     if (startDate && endDate) {
//       dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//       dateParams.push(startDate, endDate);
//     } else {
//       // Use period-based filtering
//       const now = new Date();
//       let start, end;

//       switch (period) {
//         case "daily":
//           start = moment(now).format("YYYY-MM-DD");
//           end = moment(now).format("YYYY-MM-DD");
//           dateCondition = `AND DATE(o.created_at) = ?`;
//           dateParams.push(start);
//           break;
//         case "weekly":
//           const weekStart = moment(now).startOf('week').format("YYYY-MM-DD");
//           const weekEnd = moment(now).endOf('week').format("YYYY-MM-DD");
//           dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//           dateParams.push(weekStart, weekEnd);
//           break;
//         case "monthly":
//           const monthStart = moment(now).startOf('month').format("YYYY-MM-DD");
//           const monthEnd = moment(now).endOf('month').format("YYYY-MM-DD");
//           dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//           dateParams.push(monthStart, monthEnd);
//           break;
//         case "yearly":
//           const yearStart = moment(now).startOf('year').format("YYYY-MM-DD");
//           const yearEnd = moment(now).endOf('year').format("YYYY-MM-DD");
//           dateCondition = `AND DATE(o.created_at) BETWEEN ? AND ?`;
//           dateParams.push(yearStart, yearEnd);
//           break;
//       }
//     }

//     // Get total orders and sales
//     let orderQuery = `
//       SELECT 
//         COUNT(*) as total_orders,
//         SUM(total_amount) as total_sales,
//         AVG(total_amount) as avg_order_value,
//         COUNT(DISTINCT user_id) as unique_customers
//       FROM orders o
//       WHERE o.payment_status = 'paid'
//       ${dateCondition}
//     `;

//     // For sellers, only show their products
//     if (userRole === "seller") {
//       orderQuery = `
//         SELECT 
//           COUNT(DISTINCT o.id) as total_orders,
//           SUM(oi.price * oi.quantity) as total_sales,
//           AVG(oi.price * oi.quantity) as avg_order_value,
//           COUNT(DISTINCT o.user_id) as unique_customers
//         FROM orders o
//         JOIN order_items oi ON o.id = oi.order_id
//         JOIN products p ON oi.product_id = p.id
//         WHERE o.payment_status = 'paid'
//         AND p.seller_id = ?
//         ${dateCondition}
//       `;
//       dateParams.unshift(userId);
//     }

//     const [orderStats] = await db.query(orderQuery, dateParams);

//     // Get order status breakdown
//     let statusQuery = `
//       SELECT 
//         status,
//         COUNT(*) as count
//       FROM orders
//       WHERE 1=1 ${dateCondition}
//       GROUP BY status
//     `;

//     if (userRole === "seller") {
//       statusQuery = `
//         SELECT 
//           o.status,
//           COUNT(DISTINCT o.id) as count
//         FROM orders o
//         JOIN order_items oi ON o.id = oi.order_id
//         JOIN products p ON oi.product_id = p.id
//         WHERE p.seller_id = ?
//         ${dateCondition}
//         GROUP BY o.status
//       `;
//     }

//     const [statusBreakdown] = await db.query(statusQuery, dateParams);

//     // Get top products
//     let topProductsQuery = `
//       SELECT 
//         p.id,
//         p.name,
//         p.category_id,
//         c.name as category_name,
//         SUM(oi.quantity) as units_sold,
//         SUM(oi.price * oi.quantity) as revenue,
//         p.quantity as current_stock
//       FROM order_items oi
//       JOIN products p ON oi.product_id = p.id
//       JOIN categories c ON p.category_id = c.id
//       JOIN orders o ON oi.order_id = o.id
//       WHERE o.payment_status = 'paid'
//       ${dateCondition}
//       GROUP BY p.id
//       ORDER BY revenue DESC
//       LIMIT 10
//     `;

//     if (userRole === "seller") {
//       topProductsQuery = `
//         SELECT 
//           p.id,
//           p.name,
//           p.category_id,
//           c.name as category_name,
//           SUM(oi.quantity) as units_sold,
//           SUM(oi.price * oi.quantity) as revenue,
//           p.quantity as current_stock
//         FROM order_items oi
//         JOIN products p ON oi.product_id = p.id
//         JOIN categories c ON p.category_id = c.id
//         JOIN orders o ON oi.order_id = o.id
//         WHERE o.payment_status = 'paid'
//         AND p.seller_id = ?
//         ${dateCondition}
//         GROUP BY p.id
//         ORDER BY revenue DESC
//         LIMIT 10
//       `;
//     }

//     const [topProducts] = await db.query(topProductsQuery, dateParams);

//     // Get daily/weekly/monthly trend
//     const trendQuery = `
//       SELECT 
//         DATE(created_at) as date,
//         COUNT(*) as orders,
//         SUM(total_amount) as revenue
//       FROM orders
//       WHERE payment_status = 'paid'
//       ${dateCondition}
//       GROUP BY DATE(created_at)
//       ORDER BY date
//     `;

//     const [trendData] = await db.query(trendQuery, dateParams);

//     // Get low stock products
//     const lowStockQuery = `
//       SELECT 
//         p.id,
//         p.name,
//         p.quantity,
//         p.sku,
//         c.name as category_name
//       FROM products p
//       JOIN categories c ON p.category_id = c.id
//       WHERE p.quantity <= 10
//       AND p.track_quantity = 1
//       ${userRole === "seller" ? "AND p.seller_id = ?" : ""}
//       ORDER BY p.quantity ASC
//       LIMIT 10
//     `;

//     const lowStockParams = userRole === "seller" ? [userId] : [];
//     const [lowStockProducts] = await db.query(lowStockQuery, lowStockParams);

//     res.json({
//       success: true,
//       data: {
//         period,
//         summary: {
//           total_orders: orderStats[0]?.total_orders || 0,
//           total_sales: orderStats[0]?.total_sales || 0,
//           avg_order_value: orderStats[0]?.avg_order_value || 0,
//           unique_customers: orderStats[0]?.unique_customers || 0,
//         },
//         status_breakdown: statusBreakdown,
//         top_products: topProducts,
//         trend_data: trendData,
//         low_stock_products: lowStockProducts,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch dashboard statistics",
//     });
//   }
// };

// Daily Sales Report
export const getDailySalesReport = async (req, res) => {
  try {
    const { date } = req.query;
    const reportDate = date || moment().format("YYYY-MM-DD");
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = `
      SELECT 
        DATE(o.created_at) as report_date,
        COUNT(*) as total_orders,
        SUM(o.total_amount) as total_sales,
        AVG(o.total_amount) as avg_order_value,
        COUNT(DISTINCT o.user_id) as unique_customers,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders
      FROM orders o
      WHERE DATE(o.created_at) = ?
      AND o.payment_status = 'paid'
    `;

    let params = [reportDate];

    if (userRole === "seller") {
      query = `
        SELECT 
          DATE(o.created_at) as report_date,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(oi.price * oi.quantity) as total_sales,
          AVG(oi.price * oi.quantity) as avg_order_value,
          COUNT(DISTINCT o.user_id) as unique_customers,
          COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders,
          COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE DATE(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY DATE(o.created_at)
      `;
      params.push(userId);
    }

    const [summary] = await db.query(query, params);

    // Get hourly trend
    let hourlyQuery = `
      SELECT 
        HOUR(o.created_at) as hour,
        COUNT(*) as orders,
        SUM(o.total_amount) as sales
      FROM orders o
      WHERE DATE(o.created_at) = ?
      AND o.payment_status = 'paid'
      GROUP BY HOUR(o.created_at)
      ORDER BY hour
    `;

    if (userRole === "seller") {
      hourlyQuery = `
        SELECT 
          HOUR(o.created_at) as hour,
          COUNT(DISTINCT o.id) as orders,
          SUM(oi.price * oi.quantity) as sales
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE DATE(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY HOUR(o.created_at)
        ORDER BY hour
      `;
    }

    const [hourlyTrend] = await db.query(hourlyQuery, params);

    // Get top products for the day
    let topProductsQuery = `
      SELECT 
        p.id,
        p.name,
        c.name as category,
        SUM(oi.quantity) as units_sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE DATE(o.created_at) = ?
      AND o.payment_status = 'paid'
      GROUP BY p.id
      ORDER BY revenue DESC
      LIMIT 10
    `;

    if (userRole === "seller") {
      topProductsQuery = `
        SELECT 
          p.id,
          p.name,
          c.name as category,
          SUM(oi.quantity) as units_sold,
          SUM(oi.price * oi.quantity) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE DATE(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY p.id
        ORDER BY revenue DESC
        LIMIT 10
      `;
    }

    const [topProducts] = await db.query(topProductsQuery, params);

    // Get payment methods
    let paymentMethodQuery = `
      SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(total_amount) as amount
      FROM orders
      WHERE DATE(created_at) = ?
      AND payment_status = 'paid'
      GROUP BY payment_method
    `;

    if (userRole === "seller") {
      paymentMethodQuery = `
        SELECT 
          o.payment_method,
          COUNT(DISTINCT o.id) as count,
          SUM(oi.price * oi.quantity) as amount
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE DATE(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY o.payment_method
      `;
    }

    const [paymentMethods] = await db.query(paymentMethodQuery, params);

    res.json({
      success: true,
      data: {
        date: reportDate,
        period: "daily",
        summary: summary[0] || {},
        top_products: topProducts,
        hourly_trend: hourlyTrend,
        payment_methods: paymentMethods,
      },
    });
  } catch (error) {
    console.error("Error generating daily sales report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate daily sales report",
    });
  }
};

// Weekly Sales Report
export const getWeeklySalesReport = async (req, res) => {
  try {
    const { week } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Parse week parameter (format: YYYY-WW)
    let year, weekNumber;
    let weekStart, weekEnd;
    
    if (week) {
      [year, weekNumber] = week.split("-W");
      weekNumber = parseInt(weekNumber);
      weekStart = moment().year(year).week(weekNumber).startOf('week');
      weekEnd = moment().year(year).week(weekNumber).endOf('week');
    } else {
      weekStart = moment().startOf('week');
      weekEnd = moment().endOf('week');
      year = weekStart.year();
      weekNumber = weekStart.week();
    }

    let query = `
      SELECT 
        YEARWEEK(o.created_at, 1) as week_number,
        COUNT(*) as total_orders,
        SUM(o.total_amount) as total_sales,
        AVG(o.total_amount) as avg_order_value,
        COUNT(DISTINCT o.user_id) as unique_customers,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders
      FROM orders o
      WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
      AND o.payment_status = 'paid'
    `;

    let params = [weekStart.format("YYYY-MM-DD")];

    if (userRole === "seller") {
      query = `
        SELECT 
          YEARWEEK(o.created_at, 1) as week_number,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(oi.price * oi.quantity) as total_sales,
          AVG(oi.price * oi.quantity) as avg_order_value,
          COUNT(DISTINCT o.user_id) as unique_customers,
          COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
      `;
      params.push(userId);
    }

    const [summary] = await db.query(query, params);

    // Get daily breakdown
    let dailyQuery = `
      SELECT 
        DATE(o.created_at) as date,
        DAYNAME(o.created_at) as day,
        COUNT(*) as orders,
        SUM(o.total_amount) as sales
      FROM orders o
      WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
      AND o.payment_status = 'paid'
      GROUP BY DATE(o.created_at)
      ORDER BY date
    `;

    if (userRole === "seller") {
      dailyQuery = `
        SELECT 
          DATE(o.created_at) as date,
          DAYNAME(o.created_at) as day,
          COUNT(DISTINCT o.id) as orders,
          SUM(oi.price * oi.quantity) as sales
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY DATE(o.created_at)
        ORDER BY date
      `;
    }

    const [dailyBreakdown] = await db.query(dailyQuery, params);

    // Get top categories
    let categoryQuery = `
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT o.id) as orders,
        SUM(o.total_amount) as sales
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
      AND o.payment_status = 'paid'
      GROUP BY c.id
      ORDER BY sales DESC
      LIMIT 5
    `;

    if (userRole === "seller") {
      categoryQuery = `
        SELECT 
          c.id,
          c.name,
          COUNT(DISTINCT o.id) as orders,
          SUM(oi.price * oi.quantity) as sales
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY c.id
        ORDER BY sales DESC
        LIMIT 5
      `;
    }

    const [topCategories] = await db.query(categoryQuery, params);

    // Get seller performance (for admin only)
    let sellerPerformance = [];
    if (userRole === "admin") {
      const sellerQuery = `
        SELECT 
          u.id,
          u.username,
          u.email,
          COUNT(DISTINCT o.id) as orders,
          SUM(oi.price * oi.quantity) as revenue,
          COUNT(DISTINCT o.user_id) as customers
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        JOIN users u ON p.seller_id = u.id
        WHERE YEARWEEK(o.created_at, 1) = YEARWEEK(?, 1)
        AND o.payment_status = 'paid'
        GROUP BY u.id
        ORDER BY revenue DESC
        LIMIT 10
      `;
      const [sellers] = await db.query(sellerQuery, [weekStart.format("YYYY-MM-DD")]);
      sellerPerformance = sellers;
    }

    res.json({
      success: true,
      data: {
        week: `${year}-W${weekNumber}`,
        start_date: weekStart.format("YYYY-MM-DD"),
        end_date: weekEnd.format("YYYY-MM-DD"),
        summary: summary[0] || {},
        daily_breakdown: dailyBreakdown,
        top_categories: topCategories,
        seller_performance: sellerPerformance,
      },
    });
  } catch (error) {
    console.error("Error generating weekly sales report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate weekly sales report",
    });
  }
};

// Monthly Sales Report
export const getMonthlySalesReport = async (req, res) => {
  try {
    const { month } = req.query; // Format: YYYY-MM
    const userId = req.user.id;
    const userRole = req.user.role;

    let year, monthNumber;
    if (month) {
      [year, monthNumber] = month.split("-");
      monthNumber = parseInt(monthNumber);
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthNumber = now.getMonth() + 1;
    }

    const monthStart = moment(`${year}-${monthNumber}`, "YYYY-MM").startOf('month');
    const monthEnd = moment(`${year}-${monthNumber}`, "YYYY-MM").endOf('month');

    let query = `
      SELECT 
        YEAR(o.created_at) as year,
        MONTH(o.created_at) as month,
        COUNT(*) as total_orders,
        SUM(o.total_amount) as total_sales,
        AVG(o.total_amount) as avg_order_value,
        COUNT(DISTINCT o.user_id) as total_customers,
        COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders,
        SUM(CASE WHEN o.status = 'cancelled' THEN o.total_amount ELSE 0 END) as refund_amount
      FROM orders o
      WHERE YEAR(o.created_at) = ?
      AND MONTH(o.created_at) = ?
      AND o.payment_status = 'paid'
    `;

    let params = [year, monthNumber];

    if (userRole === "seller") {
      query = `
        SELECT 
          YEAR(o.created_at) as year,
          MONTH(o.created_at) as month,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(oi.price * oi.quantity) as total_sales,
          AVG(oi.price * oi.quantity) as avg_order_value,
          COUNT(DISTINCT o.user_id) as total_customers,
          COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders,
          COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders,
          SUM(CASE WHEN o.status = 'cancelled' THEN oi.price * oi.quantity ELSE 0 END) as refund_amount
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE YEAR(o.created_at) = ?
        AND MONTH(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
      `;
      params.push(userId);
    }

    const [summary] = await db.query(query, params);

    // Get weekly trend
    let weeklyQuery = `
      SELECT 
        YEARWEEK(o.created_at, 1) as week,
        CONCAT('Week ', WEEK(o.created_at, 1)) as week_label,
        COUNT(*) as orders,
        SUM(o.total_amount) as sales
      FROM orders o
      WHERE YEAR(o.created_at) = ?
      AND MONTH(o.created_at) = ?
      AND o.payment_status = 'paid'
      GROUP BY YEARWEEK(o.created_at, 1)
      ORDER BY week
    `;

    if (userRole === "seller") {
      weeklyQuery = `
        SELECT 
          YEARWEEK(o.created_at, 1) as week,
          CONCAT('Week ', WEEK(o.created_at, 1)) as week_label,
          COUNT(DISTINCT o.id) as orders,
          SUM(oi.price * oi.quantity) as sales
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE YEAR(o.created_at) = ?
        AND MONTH(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY YEARWEEK(o.created_at, 1)
        ORDER BY week
      `;
    }

    const [weeklyTrend] = await db.query(weeklyQuery, params);

    // Get geographic distribution (for admin only)
    let geographicDistribution = [];
    if (userRole === "admin") {
      const geoQuery = `
        SELECT 
          JSON_UNQUOTE(JSON_EXTRACT(shipping_address, '$.country')) as country,
          COUNT(*) as orders,
          SUM(total_amount) as sales
        FROM orders
        WHERE YEAR(created_at) = ?
        AND MONTH(created_at) = ?
        AND payment_status = 'paid'
        AND shipping_address IS NOT NULL
        GROUP BY JSON_UNQUOTE(JSON_EXTRACT(shipping_address, '$.country'))
        ORDER BY sales DESC
      `;
      const [geoData] = await db.query(geoQuery, [year, monthNumber]);
      geographicDistribution = geoData;
    }

    // Get inventory analysis
    const inventoryQuery = `
      SELECT 
        p.id,
        p.name,
        p.quantity,
        p.sku,
        c.name as category_name,
        (
          SELECT COUNT(*) 
          FROM order_items oi 
          JOIN orders o ON oi.order_id = o.id 
          WHERE oi.product_id = p.id 
          AND YEAR(o.created_at) = ? 
          AND MONTH(o.created_at) = ?
          AND o.payment_status = 'paid'
        ) as sold_this_month,
        (
          SELECT MAX(o.created_at) 
          FROM order_items oi 
          JOIN orders o ON oi.order_id = o.id 
          WHERE oi.product_id = p.id 
          AND o.payment_status = 'paid'
        ) as last_sold
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.quantity <= 10
      AND p.track_quantity = 1
      ${userRole === "seller" ? "AND p.seller_id = ?" : ""}
      ORDER BY p.quantity ASC
      LIMIT 10
    `;

    const inventoryParams =
      userRole === "seller"
        ? [year, monthNumber, userId]
        : [year, monthNumber];
    const [inventoryAnalysis] = await db.query(
      inventoryQuery,
      inventoryParams
    );

    // Get best sellers
    let bestSellersQuery = `
      SELECT 
        p.id,
        p.name,
        c.name as category_name,
        SUM(oi.quantity) as units_sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE YEAR(o.created_at) = ?
      AND MONTH(o.created_at) = ?
      AND o.payment_status = 'paid'
      GROUP BY p.id
      ORDER BY revenue DESC
      LIMIT 10
    `;

    if (userRole === "seller") {
      bestSellersQuery = `
        SELECT 
          p.id,
          p.name,
          c.name as category_name,
          SUM(oi.quantity) as units_sold,
          SUM(oi.price * oi.quantity) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE YEAR(o.created_at) = ?
        AND MONTH(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY p.id
        ORDER BY revenue DESC
        LIMIT 10
      `;
    }

    const [bestSellers] = await db.query(bestSellersQuery, params);

    res.json({
      success: true,
      data: {
        month: `${year}-${String(monthNumber).padStart(2, "0")}`,
        summary: summary[0] || {},
        weekly_trend: weeklyTrend,
        geographic_distribution: geographicDistribution,
        inventory_analysis: {
          low_stock_items: inventoryAnalysis.filter(
            (item) => item.quantity <= 10
          ),
          best_sellers: bestSellers,
          dead_stock: inventoryAnalysis.filter(
            (item) => !item.sold_this_month && item.quantity > 0
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error generating monthly sales report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate monthly sales report",
    });
  }
};

// Yearly Sales Report
export const getYearlySalesReport = async (req, res) => {
  try {
    const { year } = req.query || new Date().getFullYear();
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = `
      SELECT 
        YEAR(o.created_at) as year,
        COUNT(*) as total_orders,
        SUM(o.total_amount) as total_sales,
        AVG(o.total_amount) as avg_order_value,
        COUNT(DISTINCT o.user_id) as total_customers,
        (
          SELECT COUNT(*) 
          FROM orders o2 
          WHERE YEAR(o2.created_at) = ? - 1
          AND o2.payment_status = 'paid'
        ) as previous_year_orders,
        (
          SELECT SUM(total_amount) 
          FROM orders o2 
          WHERE YEAR(o2.created_at) = ? - 1
          AND o2.payment_status = 'paid'
        ) as previous_year_sales
      FROM orders o
      WHERE YEAR(o.created_at) = ?
      AND o.payment_status = 'paid'
    `;

    let params = [year, year, year];

    if (userRole === "seller") {
      query = `
        SELECT 
          YEAR(o.created_at) as year,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(oi.price * oi.quantity) as total_sales,
          AVG(oi.price * oi.quantity) as avg_order_value,
          COUNT(DISTINCT o.user_id) as total_customers,
          (
            SELECT COUNT(DISTINCT o2.id) 
            FROM orders o2
            JOIN order_items oi2 ON o2.id = oi2.order_id
            JOIN products p2 ON oi2.product_id = p2.id
            WHERE YEAR(o2.created_at) = ? - 1
            AND o2.payment_status = 'paid'
            AND p2.seller_id = ?
          ) as previous_year_orders,
          (
            SELECT SUM(oi2.price * oi2.quantity) 
            FROM orders o2
            JOIN order_items oi2 ON o2.id = oi2.order_id
            JOIN products p2 ON oi2.product_id = p2.id
            WHERE YEAR(o2.created_at) = ? - 1
            AND o2.payment_status = 'paid'
            AND p2.seller_id = ?
          ) as previous_year_sales
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE YEAR(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
      `;
      params = [year, userId, year, userId, year, userId];
    }

    const [summary] = await db.query(query, params);

    // Calculate year-over-year growth
    const currentYearSales = summary[0]?.total_sales || 0;
    const previousYearSales = summary[0]?.previous_year_sales || 0;
    const yoyGrowth =
      previousYearSales > 0
        ? ((currentYearSales - previousYearSales) / previousYearSales) * 100
        : 0;

    // Get monthly breakdown
    let monthlyQuery = `
      SELECT 
        MONTH(o.created_at) as month,
        DATE_FORMAT(o.created_at, '%Y-%m') as month_date,
        COUNT(*) as orders,
        SUM(o.total_amount) as sales
      FROM orders o
      WHERE YEAR(o.created_at) = ?
      AND o.payment_status = 'paid'
      GROUP BY MONTH(o.created_at)
      ORDER BY month
    `;

    if (userRole === "seller") {
      monthlyQuery = `
        SELECT 
          MONTH(o.created_at) as month,
          DATE_FORMAT(o.created_at, '%Y-%m') as month_date,
          COUNT(DISTINCT o.id) as orders,
          SUM(oi.price * oi.quantity) as sales
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE YEAR(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY MONTH(o.created_at)
        ORDER BY month
      `;
    }

    const [monthlyBreakdown] = await db.query(
      monthlyQuery,
      userRole === "seller" ? [year, userId] : [year]
    );

    // Get category performance
    let categoryQuery = `
      SELECT 
        c.id,
        c.name as category_name,
        COUNT(DISTINCT o.id) as orders,
        SUM(o.total_amount) as sales,
        (
          SELECT SUM(o2.total_amount) 
          FROM orders o2
          JOIN order_items oi2 ON o2.id = oi2.order_id
          JOIN products p2 ON oi2.product_id = p2.id
          JOIN categories c2 ON p2.category_id = c2.id
          WHERE YEAR(o2.created_at) = ? - 1
          AND c2.id = c.id
          AND o2.payment_status = 'paid'
        ) as previous_year_sales
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE YEAR(o.created_at) = ?
      AND o.payment_status = 'paid'
      GROUP BY c.id
      ORDER BY sales DESC
      LIMIT 10
    `;

    if (userRole === "seller") {
      categoryQuery = `
        SELECT 
          c.id,
          c.name as category_name,
          COUNT(DISTINCT o.id) as orders,
          SUM(oi.price * oi.quantity) as sales,
          (
            SELECT SUM(oi2.price * oi2.quantity) 
            FROM orders o2
            JOIN order_items oi2 ON o2.id = oi2.order_id
            JOIN products p2 ON oi2.product_id = p2.id
            JOIN categories c2 ON p2.category_id = c2.id
            WHERE YEAR(o2.created_at) = ? - 1
            AND c2.id = c.id
            AND o2.payment_status = 'paid'
            AND p2.seller_id = ?
          ) as previous_year_sales
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE YEAR(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND p.seller_id = ?
        GROUP BY c.id
        ORDER BY sales DESC
        LIMIT 10
      `;
    }

    const categoryParams =
      userRole === "seller" ? [year, userId, year, userId] : [year, year];
    const [categoryPerformance] = await db.query(
      categoryQuery,
      categoryParams
    );

    // Calculate category growth
    const categoryPerformanceWithGrowth = categoryPerformance.map((cat) => {
      const currentSales = cat.sales || 0;
      const previousSales = cat.previous_year_sales || 0;
      const growth =
        previousSales > 0
          ? ((currentSales - previousSales) / previousSales) * 100
          : currentSales > 0
          ? 100
          : 0;

      return {
        ...cat,
        growth: parseFloat(growth.toFixed(2)),
      };
    });

    // Get customer analysis (for admin only)
    let customerAnalysis = {};
    if (userRole === "admin") {
      const customerQuery = `
        SELECT 
          COUNT(DISTINCT CASE WHEN order_count = 1 THEN user_id END) as new_customers,
          COUNT(DISTINCT CASE WHEN order_count > 1 THEN user_id END) as returning_customers,
          AVG(order_count) as avg_orders_per_customer,
          AVG(total_spent) as avg_customer_value
        FROM (
          SELECT 
            user_id,
            COUNT(*) as order_count,
            SUM(total_amount) as total_spent
          FROM orders
          WHERE YEAR(created_at) = ?
          AND payment_status = 'paid'
          GROUP BY user_id
        ) as customer_stats
      `;

      const [customerStats] = await db.query(customerQuery, [year]);
      customerAnalysis.new_vs_returning = {
        new: customerStats[0]?.new_customers || 0,
        returning: customerStats[0]?.returning_customers || 0,
      };

      // Get top spenders
      const topSpendersQuery = `
        SELECT 
          u.id,
          u.username,
          u.email,
          COUNT(o.id) as total_orders,
          SUM(o.total_amount) as total_spent,
          MAX(o.created_at) as last_order_date
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE YEAR(o.created_at) = ?
        AND o.payment_status = 'paid'
        GROUP BY u.id
        ORDER BY total_spent DESC
        LIMIT 10
      `;

      const [topSpenders] = await db.query(topSpendersQuery, [year]);
      customerAnalysis.top_spenders = topSpenders;
    }

    // Get coupon effectiveness
    let couponEffectiveness = [];
    if (userRole === "admin") {
      const couponQuery = `
        SELECT 
          c.id,
          c.code,
          c.discount_type,
          c.discount_value,
          c.min_order_amount,
          COUNT(DISTINCT o.id) as times_used,
          SUM(
            CASE 
              WHEN c.discount_type = 'percentage' 
              THEN LEAST(o.total_amount * (c.discount_value / 100), c.max_discount_amount)
              ELSE c.discount_value
            END
          ) as total_discount,
          SUM(o.total_amount) as orders_generated
        FROM orders o
        LEFT JOIN coupons c ON o.coupon_id = c.id
        WHERE YEAR(o.created_at) = ?
        AND o.payment_status = 'paid'
        AND c.id IS NOT NULL
        GROUP BY c.id
        ORDER BY times_used DESC
        LIMIT 10
      `;

      const [couponData] = await db.query(couponQuery, [year]);
      couponEffectiveness = couponData;
    }

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        summary: {
          ...summary[0],
          year_over_year_growth: parseFloat(yoyGrowth.toFixed(2)),
          average_monthly_sales: (summary[0]?.total_sales || 0) / 12,
          total_customers: summary[0]?.total_customers || 0,
          average_customer_value:
            summary[0]?.total_sales / (summary[0]?.total_customers || 1) || 0,
        },
        monthly_breakdown: monthlyBreakdown,
        category_performance: categoryPerformanceWithGrowth,
        customer_analysis: customerAnalysis,
        coupon_effectiveness: couponEffectiveness,
      },
    });
  } catch (error) {
    console.error("Error generating yearly sales report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate yearly sales report",
    });
  }
};

// Top Selling Products Report
export const getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let dateCondition = "";
    let params = [];

    if (startDate && endDate) {
      dateCondition = "AND DATE(o.created_at) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    let query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        c.name as category_name,
        SUM(oi.quantity) as total_units_sold,
        SUM(oi.price * oi.quantity) as total_revenue,
        COUNT(DISTINCT o.id) as total_orders,
        p.quantity as current_stock
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      ${dateCondition}
      ${userRole === 'seller' ? 'AND p.seller_id = ?' : ''}
      GROUP BY p.id
      ORDER BY total_revenue DESC
      LIMIT ?
    `;

    if (userRole === 'seller') {
      params.unshift(userId);
    }
    params.push(parseInt(limit));

    const [products] = await db.query(query, params);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top selling products"
    });
  }
};

// Product Performance Report
// export const getProductPerformance = async (req, res) => {
//   try {
//     const { productId, period = 'monthly' } = req.query;
//     const userId = req.user.id;
//     const userRole = req.user.role;

//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID is required"
//       });
//     }

//     // Verify product ownership for sellers
//     if (userRole === 'seller') {
//       const [product] = await db.query(
//         "SELECT id FROM products WHERE id = ? AND seller_id = ?",
//         [productId, userId]
//       );
      
//       if (product.length === 0) {
//         return res.status(403).json({
//           success: false,
//           message: "You don't have permission to view this product"
//         });
//       }
//     }

//     let periodCondition = "";
//     let groupBy = "";
    
//     switch (period) {
//       case 'daily':
//         periodCondition = "DATE(o.created_at)";
//         groupBy = "DATE(o.created_at)";
//         break;
//       case 'weekly':
//         periodCondition = "YEARWEEK(o.created_at, 1)";
//         groupBy = "YEARWEEK(o.created_at, 1)";
//         break;
//       case 'monthly':
//         periodCondition = "DATE_FORMAT(o.created_at, '%Y-%m')";
//         groupBy = "DATE_FORMAT(o.created_at, '%Y-%m')";
//         break;
//       default:
//         periodCondition = "DATE_FORMAT(o.created_at, '%Y-%m')";
//         groupBy = "DATE_FORMAT(o.created_at, '%Y-%m')";
//     }

//     const query = `
//       SELECT 
//         ${periodCondition} as period,
//         COUNT(DISTINCT o.id) as total_orders,
//         SUM(oi.quantity) as total_units_sold,
//         SUM(oi.price * oi.quantity) as total_revenue,
//         AVG(oi.price * oi.quantity) as avg_sale_value
//       FROM order_items oi
//       JOIN orders o ON oi.order_id = o.id
//       WHERE oi.product_id = ?
//       AND o.payment_status = 'paid'
//       GROUP BY ${groupBy}
//       ORDER BY period DESC
//       LIMIT 12
//     `;

//     const [performance] = await db.query(query, [productId]);

//     res.json({
//       success: true,
//       data: {
//         product_id: productId,
//         period,
//         performance
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching product performance:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch product performance"
//     });
//   }
// };

// Inventory Status Report
export const getInventoryStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.quantity as current_stock,
        p.track_quantity,
        p.min_stock_level,
        c.name as category_name,
        (
          SELECT SUM(oi.quantity) 
          FROM order_items oi 
          JOIN orders o ON oi.order_id = o.id 
          WHERE oi.product_id = p.id 
          AND o.payment_status = 'paid'
          AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) as units_sold_last_30_days,
        (
          SELECT AVG(oi.quantity) 
          FROM order_items oi 
          JOIN orders o ON oi.order_id = o.id 
          WHERE oi.product_id = p.id 
          AND o.payment_status = 'paid'
        ) as avg_units_per_order
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.track_quantity = 1
      ${userRole === 'seller' ? 'AND p.seller_id = ?' : ''}
      ORDER BY 
        CASE 
          WHEN p.quantity <= p.min_stock_level THEN 1
          WHEN p.quantity <= (p.min_stock_level * 2) THEN 2
          ELSE 3
        END,
        p.quantity ASC
    `;

    const params = userRole === 'seller' ? [userId] : [];
    const [inventory] = await db.query(query, params);

    // Categorize inventory status
    const categorized = {
      low_stock: inventory.filter(item => item.current_stock <= item.min_stock_level),
      medium_stock: inventory.filter(item => 
        item.current_stock > item.min_stock_level && 
        item.current_stock <= (item.min_stock_level * 2)
      ),
      good_stock: inventory.filter(item => item.current_stock > (item.min_stock_level * 2))
    };

    res.json({
      success: true,
      data: {
        summary: {
          total_products: inventory.length,
          low_stock: categorized.low_stock.length,
          medium_stock: categorized.medium_stock.length,
          good_stock: categorized.good_stock.length
        },
        details: categorized
      }
    });
  } catch (error) {
    console.error("Error fetching inventory status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory status"
    });
  }
};

// Order Summary Report
export const getOrderSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let dateCondition = "";
    let params = [];

    if (startDate && endDate) {
      dateCondition = "AND DATE(o.created_at) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    let query = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as avg_order_value,
        COUNT(DISTINCT user_id) as unique_customers,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as pending_payment_amount
      FROM orders o
      WHERE 1=1
      ${dateCondition}
      ${userRole === "seller" ? "AND EXISTS (SELECT 1 FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id AND p.seller_id = ?)" : ""}
    `;

    if (userRole === 'seller') {
      params.unshift(userId);
    }

    const [summary] = await db.query(query, params);

    res.json({
      success: true,
      data: summary[0]
    });
  } catch (error) {
    console.error("Error fetching order summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order summary"
    });
  }
};

// Order Status Breakdown
export const getOrderStatusBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let dateCondition = "";
    let params = [];

    if (startDate && endDate) {
      dateCondition = "AND DATE(o.created_at) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    let query = `
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as total_amount
      FROM orders o
      WHERE 1=1
      ${dateCondition}
      ${userRole === "seller" ? "AND EXISTS (SELECT 1 FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id AND p.seller_id = ?)" : ""}
      GROUP BY status
      ORDER BY count DESC
    `;

    if (userRole === 'seller') {
      params.unshift(userId);
    }

    const [breakdown] = await db.query(query, params);

    res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    console.error("Error fetching order status breakdown:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order status breakdown"
    });
  }
};

// Stub functions for unimplemented routes (to be implemented as needed)
// export const getUserActivity = async (req, res) => {
//   res.status(501).json({
//     success: false,
//     message: "Not implemented yet"
//   });
// };

// export const getUserStats = async (req, res) => {
//   res.status(501).json({
//     success: false,
//     message: "Not implemented yet"
//   });
// };

// export const getCouponUsage = async (req, res) => {
//   res.status(501).json({
//     success: false,
//     message: "Not implemented yet"
//   });
// };

// export const getQuickStats = async (req, res) => {
//   res.status(501).json({
//     success: false,
//     message: "Not implemented yet"
//   });
// };

// export const getRecentActivity = async (req, res) => {
//   res.status(501).json({
//     success: false,
//     message: "Not implemented yet"
//   });
// };

export const exportOrderReport = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
};

export const exportProductReport = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
};

export const exportInventoryReport = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
};

export const generateCustomReport = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
};

// Export Functions (from the original class)
export const exportSalesReport = async (req, res) => {
  try {
    const { period, format = "csv", startDate, endDate } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get sales data based on period
    let salesData;
    switch (period) {
      case "daily":
        salesData = await getDailySalesData(userId, userRole, startDate);
        break;
      case "weekly":
        salesData = await getWeeklySalesData(
          userId,
          userRole,
          startDate
        );
        break;
      case "monthly":
        salesData = await getMonthlySalesData(
          userId,
          userRole,
          startDate
        );
        break;
      case "yearly":
        salesData = await getYearlySalesData(
          userId,
          userRole,
          startDate
        );
        break;
      default:
        if (startDate && endDate) {
          salesData = await getCustomSalesData(
            userId,
            userRole,
            startDate,
            endDate
          );
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid period or date range",
          });
        }
    }

    // Export based on format
    switch (format.toLowerCase()) {
      case "csv":
        return exportToCSV(
          res,
          salesData,
          `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
        );
      case "excel":
        return exportToExcel(
          res,
          salesData,
          `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
        );
      case "pdf":
        return exportToPDF(
          res,
          salesData,
          `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
        );
      case "json":
        return exportToJSON(
          res,
          salesData,
          `sales_report_${period}_${new Date().toISOString().split("T")[0]}`
        );
      default:
        return res
          .status(400)
          .json({ success: false, message: "Unsupported export format" });
    }
  } catch (error) {
    console.error("Error exporting sales report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to export sales report" });
  }
};

const exportToCSV = async (res, data, filename) => {
  try {
    // Convert data to CSV format
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (typeof value === "object") return JSON.stringify(value);
            return `"${value}"`;
          })
          .join(",")
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    throw error;
  }
};

const exportToExcel = async (res, data, filename) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.xlsx"`
    );
    res.send(excelBuffer);
  } catch (error) {
    throw error;
  }
};

const exportToPDF = async (res, data, filename) => {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Sales Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

    // Prepare table data
    const headers = Object.keys(data[0] || {});
    const tableData = data.map((row) => headers.map((header) => row[header]));

    // Add table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    const pdfBuffer = doc.output("arraybuffer");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.pdf"`
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    throw error;
  }
};

const exportToJSON = async (res, data, filename) => {
  try {
    const jsonData = {
      generated: new Date().toISOString(),
      record_count: data.length,
      data: data,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.json"`
    );
    res.send(JSON.stringify(jsonData, null, 2));
  } catch (error) {
    throw error;
  }
};

// Helper methods for data retrieval
const getDailySalesData = async (userId, userRole, date) => {
  // Implementation for daily sales data
  const query =
    userRole === "seller" ? `SELECT ... WHERE p.seller_id = ?` : `SELECT ...`;
  // ... implement based on your database structure
  return [];
};

const getWeeklySalesData = async (userId, userRole, week) => {
  // Implementation for weekly sales data
  return [];
};

const getMonthlySalesData = async (userId, userRole, month) => {
  // Implementation for monthly sales data
  return [];
};

const getYearlySalesData = async (userId, userRole, year) => {
  // Implementation for yearly sales data
  return [];
};

const getCustomSalesData = async (userId, userRole, startDate, endDate) => {
  // Implementation for custom date range sales data
  return [];
};