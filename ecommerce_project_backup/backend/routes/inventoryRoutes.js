// // const express = require('express');
// // const { InventoryTransaction, Product } = require('../models');
// // const { authenticateToken } = require('../middleware/authMiddleware');

// // const router = express.Router();

// // // Get all inventory transactions
// // router.get('/transactions', authenticateToken, async (req, res) => {
// //   try {
// //     const transactions = await InventoryTransaction.findAll({
// //       include: [Product],
// //       order: [['created_at', 'DESC']]
// //     });
// //     res.json(transactions);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // });

// // // Get transactions by product ID
// // router.get('/transactions/product/:productId', authenticateToken, async (req, res) => {
// //   try {
// //     const transactions = await InventoryTransaction.findAll({
// //       where: { product_id: req.params.productId },
// //       include: [Product],
// //       order: [['created_at', 'DESC']]
// //     });
// //     res.json(transactions);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // });

// // module.exports = router;


// // const express = require('express');
// // const { InventoryTransaction, Product, User } = require('../models');
// // const { authenticateToken } = require('../middleware/auth');

// // const router = express.Router();

// // // Get all inventory transactions
// // router.get('/transactions', authenticateToken, async (req, res) => {
// //   try {
// //     const { page = 1, limit = 50, product_id } = req.query;
// //     const offset = (page - 1) * limit;

// //     const whereClause = {};
// //     if (product_id) {
// //       whereClause.product_id = product_id;
// //     }

// //     const transactions = await InventoryTransaction.findAndCountAll({
// //       where: whereClause,
// //       include: [
// //         { model: Product, attributes: ['id', 'name', 'sku'] },
// //         { model: User, attributes: ['id', 'username'] }
// //       ],
// //       order: [['created_at', 'DESC']],
// //       limit: parseInt(limit),
// //       offset: parseInt(offset)
// //     });

// //     res.json({
// //       transactions: transactions.rows,
// //       totalPages: Math.ceil(transactions.count / limit),
// //       currentPage: parseInt(page),
// //       totalTransactions: transactions.count
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // });

// // // Get transaction by ID
// // router.get('/transactions/:id', authenticateToken, async (req, res) => {
// //   try {
// //     const transaction = await InventoryTransaction.findByPk(req.params.id, {
// //       include: [
// //         { model: Product, attributes: ['id', 'name', 'sku'] },
// //         { model: User, attributes: ['id', 'username'] }
// //       ]
// //     });
    
// //     if (!transaction) {
// //       return res.status(404).json({ message: 'Transaction not found' });
// //     }
    
// //     res.json(transaction);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // });

// // // Get stock history for a product
// // router.get('/history/:productId', authenticateToken, async (req, res) => {
// //   try {
// //     const transactions = await InventoryTransaction.findAll({
// //       where: { product_id: req.params.productId },
// //       include: [
// //         { model: Product, attributes: ['id', 'name', 'sku'] },
// //         { model: User, attributes: ['id', 'username'] }
// //       ],
// //       order: [['created_at', 'DESC']]
// //     });

// //     res.json(transactions);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // });

// // module.exports = router;


// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const inventoryController = require('../controllers/inventoryController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// const router = express.Router();

// // Get all inventory transactions
// router.get('/transactions', authenticateToken, inventoryController.getTransactions);

// // Get transaction by ID
// router.get('/transactions/:id', authenticateToken, inventoryController.getTransactionById);

// // Get stock history for a product
// router.get('/history/:productId', authenticateToken, inventoryController.getStockHistory);

// // Create new transaction
// router.post('/transactions', [
//   authenticateToken,
//   body('product_id').isInt({ min: 1 }),
//   body('type').isIn(['in', 'out', 'adjustment']),
//   body('quantity').isFloat({ min: 0.01 })
// ], inventoryController.createTransaction);

// // Bulk create transactions
// router.post('/transactions/bulk', authenticateToken, inventoryController.bulkCreateTransactions);

// // Get inventory reports
// router.get('/reports', authenticateToken, inventoryController.getInventoryReport);

// module.exports = router;



const express = require('express');
const { InventoryTransaction, Product, User } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all inventory transactions with pagination
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, product_id, type } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (product_id) whereClause.product_id = product_id;
    if (type) whereClause.type = type;

    const transactions = await InventoryTransaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'sku']
        },
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        transactions: transactions.rows,
        totalCount: transactions.count,
        totalPages: Math.ceil(transactions.count / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

// Get transaction by ID
router.get('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await InventoryTransaction.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'sku', 'quantity']
        },
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message
    });
  }
});

// Get stock history for a product
router.get('/history/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 100 } = req.query;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const transactions = await InventoryTransaction.findAll({
      where: { product_id: productId },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          currentStock: product.quantity
        },
        transactions,
        totalTransactions: transactions.length
      }
    });
  } catch (error) {
    console.error('Stock history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock history',
      error: error.message
    });
  }
});

// Create a new inventory transaction (manual entry)
router.post('/transactions', authenticateToken, async (req, res) => {
  try {
    const { product_id, type, quantity, reason, reference } = req.body;

    if (!product_id || !type || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, type, and quantity are required'
      });
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const previousQuantity = product.quantity;
    let newQuantity = previousQuantity;

    switch (type) {
      case 'in':
        newQuantity += quantity;
        break;
      case 'out':
        if (previousQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock'
          });
        }
        newQuantity -= quantity;
        break;
      case 'adjustment':
        newQuantity = quantity;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid transaction type'
        });
    }

    // Update product quantity
    await product.update({ quantity: newQuantity });

    // Create transaction
    const transaction = await InventoryTransaction.create({
      product_id,
      type,
      quantity: type === 'adjustment' ? Math.abs(newQuantity - previousQuantity) : quantity,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      reason: reason || 'Manual transaction',
      reference,
      user_id: req.user.id
    });

    const transactionWithDetails = await InventoryTransaction.findByPk(transaction.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'sku']
        },
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transactionWithDetails
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating transaction',
      error: error.message
    });
  }
});

module.exports = router;