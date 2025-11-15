// const express = require('express');
// const { Product, Supplier, InventoryTransaction } = require('../models');
// const { authenticateToken } = require('../middleware/auth');
// const { Sequelize } = require('sequelize');

// const router = express.Router();

// // Get dashboard stats
// router.get('/stats', authenticateToken, async (req, res) => {
//   try {
//     const totalProducts = await Product.count();
//     const totalSuppliers = await Supplier.count();
//     const totalStockValue = await Product.sum('quantity', {
//       where: { quantity: { [Sequelize.Op.gt]: 0 } }
//     });
    
//     const lowStockProducts = await Product.findAll({
//       where: {
//         quantity: {
//           [Sequelize.Op.lte]: Sequelize.col('min_stock_level')
//         }
//       },
//       include: [Supplier]
//     });

//     // Recent transactions
//     const recentTransactions = await InventoryTransaction.findAll({
//       include: [Product],
//       order: [['created_at', 'DESC']],
//       limit: 10
//     });

//     res.json({
//       totalProducts,
//       totalSuppliers,
//       totalStockValue: totalStockValue || 0,
//       lowStockCount: lowStockProducts.length,
//       lowStockProducts,
//       recentTransactions
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticateToken, dashboardController.getDashboardStats);

// Get reorder suggestions
router.get('/reorder-suggestions', authenticateToken, dashboardController.getReorderSuggestions);

// Get quick overview
router.get('/quick-overview', authenticateToken, dashboardController.getQuickOverview);

// Get analytics
router.get('/analytics', authenticateToken, dashboardController.getAnalytics);

// Add this route to dashboard routes
router.get('/supplier-stats', authenticateToken, dashboardController.getSupplierStats);

module.exports = router;