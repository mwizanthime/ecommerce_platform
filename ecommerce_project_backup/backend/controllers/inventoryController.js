const { InventoryTransaction, Product, User } = require('../models');
const { Sequelize } = require('sequelize');

class InventoryController {
  /**
   * Get all inventory transactions with pagination
   */
  async getTransactions(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        product_id, 
        type, 
        startDate, 
        endDate,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Apply filters
      if (product_id) {
        whereClause.product_id = product_id;
      }

      if (type) {
        whereClause.type = type;
      }

      if (startDate || endDate) {
        whereClause.created_at = {};
        if (startDate) {
          whereClause.created_at[Sequelize.Op.gte] = new Date(startDate);
        }
        if (endDate) {
          whereClause.created_at[Sequelize.Op.lte] = new Date(endDate);
        }
      }

      const transactions = await InventoryTransaction.findAndCountAll({
        where: whereClause,
        include: [
          { 
            model: Product, 
            attributes: ['id', 'name', 'sku'],
            include: [{
              model: require('./../models/supplier'),
              attributes: ['id', 'name']
            }]
          },
          { 
            model: User, 
            attributes: ['id', 'username', 'email'] 
          }
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        transactions: transactions.rows,
        pagination: {
          totalItems: transactions.count,
          totalPages: Math.ceil(transactions.count / limit),
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ 
        message: 'Error fetching transactions', 
        error: error.message 
      });
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(req, res) {
    try {
      const transaction = await InventoryTransaction.findByPk(req.params.id, {
        include: [
          { 
            model: Product, 
            attributes: ['id', 'name', 'sku', 'description'],
            include: [{
              model: require('./../models/supplier'),
              attributes: ['id', 'name', 'contact_person']
            }]
          },
          { 
            model: User, 
            attributes: ['id', 'username', 'email'] 
          }
        ]
      });
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({ 
        message: 'Error fetching transaction', 
        error: error.message 
      });
    }
  }

  /**
   * Get stock history for a specific product
   */
  async getStockHistory(req, res) {
    try {
      const { productId } = req.params;
      const { limit = 100, type } = req.query;

      const whereClause = { product_id: productId };
      
      if (type) {
        whereClause.type = type;
      }

      const transactions = await InventoryTransaction.findAll({
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
        limit: parseInt(limit)
      });

      res.json(transactions);
    } catch (error) {
      console.error('Stock history error:', error);
      res.status(500).json({ 
        message: 'Error fetching stock history', 
        error: error.message 
      });
    }
  }

  /**
   * Create a new inventory transaction
   */
  async createTransaction(req, res) {
    try {
      const { product_id, type, quantity, reason, reference } = req.body;
      
      // Validate required fields
      if (!product_id || !type || !quantity) {
        return res.status(400).json({ 
          message: 'Product ID, type, and quantity are required' 
        });
      }

      if (!['in', 'out', 'adjustment'].includes(type)) {
        return res.status(400).json({ 
          message: 'Type must be "in", "out", or "adjustment"' 
        });
      }

      if (quantity <= 0) {
        return res.status(400).json({ 
          message: 'Quantity must be greater than 0' 
        });
      }

      // Get the product
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const previousQuantity = product.quantity;
      let newQuantity = previousQuantity;

      // Calculate new quantity based on transaction type
      switch (type) {
        case 'in':
          newQuantity += quantity;
          break;
        case 'out':
          if (previousQuantity < quantity) {
            return res.status(400).json({ 
              message: 'Insufficient stock',
              available: previousQuantity,
              requested: quantity
            });
          }
          newQuantity -= quantity;
          break;
        case 'adjustment':
          if (quantity < 0) {
            return res.status(400).json({ 
              message: 'Adjusted quantity cannot be negative' 
            });
          }
          newQuantity = quantity;
          break;
      }

      // Start transaction to ensure data consistency
      const result = await require('../models').sequelize.transaction(async (t) => {
        // Update product quantity
        await product.update({ quantity: newQuantity }, { transaction: t });

        // Create inventory transaction
        const transaction = await InventoryTransaction.create({
          product_id,
          type,
          quantity: Math.abs(quantity),
          previous_quantity: previousQuantity,
          new_quantity: newQuantity,
          reason: reason || 'Manual adjustment',
          reference,
          user_id: req.user.id
        }, { transaction: t });

        return transaction;
      });

      // Fetch the complete transaction with associations
      const completeTransaction = await InventoryTransaction.findByPk(result.id, {
        include: [
          { model: Product },
          { model: User, attributes: ['id', 'username'] }
        ]
      });

      res.status(201).json({
        message: 'Inventory transaction created successfully',
        transaction: completeTransaction,
        stockUpdate: {
          previous: previousQuantity,
          new: newQuantity,
          difference: newQuantity - previousQuantity
        }
      });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({ 
        message: 'Error creating inventory transaction', 
        error: error.message 
      });
    }
  }

  /**
   * Bulk create inventory transactions
   */
  async bulkCreateTransactions(req, res) {
    try {
      const { transactions } = req.body;

      if (!Array.isArray(transactions) || transactions.length === 0) {
        return res.status(400).json({ 
          message: 'Transactions array is required' 
        });
      }

      const results = [];
      const errors = [];

      // Process each transaction
      for (const [index, transactionData] of transactions.entries()) {
        try {
          const { product_id, type, quantity, reason } = transactionData;

          // Validate transaction data
          if (!product_id || !type || !quantity) {
            errors.push({
              index,
              error: 'Missing required fields (product_id, type, quantity)'
            });
            continue;
          }

          const product = await Product.findByPk(product_id);
          if (!product) {
            errors.push({
              index,
              error: `Product not found with ID: ${product_id}`
            });
            continue;
          }

          const previousQuantity = product.quantity;
          let newQuantity = previousQuantity;

          switch (type) {
            case 'in':
              newQuantity += quantity;
              break;
            case 'out':
              if (previousQuantity < quantity) {
                errors.push({
                  index,
                  error: `Insufficient stock for product: ${product.name}`
                });
                continue;
              }
              newQuantity -= quantity;
              break;
            case 'adjustment':
              newQuantity = quantity;
              break;
            default:
              errors.push({
                index,
                error: 'Invalid transaction type'
              });
              continue;
          }

          // Update product and create transaction
          await require('../models').sequelize.transaction(async (t) => {
            await product.update({ quantity: newQuantity }, { transaction: t });

            const transaction = await InventoryTransaction.create({
              product_id,
              type,
              quantity: Math.abs(quantity),
              previous_quantity: previousQuantity,
              new_quantity: newQuantity,
              reason: reason || 'Bulk import',
              user_id: req.user.id
            }, { transaction: t });

            results.push(transaction);
          });

        } catch (error) {
          errors.push({
            index,
            error: error.message
          });
        }
      }

      res.json({
        message: 'Bulk transaction processing completed',
        successful: results.length,
        failed: errors.length,
        results: results.map(t => t.id),
        errors
      });
    } catch (error) {
      console.error('Bulk create transactions error:', error);
      res.status(500).json({ 
        message: 'Error processing bulk transactions', 
        error: error.message 
      });
    }
  }

  /**
   * Get inventory summary report
   */
  async getInventoryReport(req, res) {
    try {
      const { reportType = 'summary' } = req.query;

      switch (reportType) {
        case 'summary':
          return await this.getSummaryReport(req, res);
        case 'movement':
          return await this.getMovementReport(req, res);
        case 'valuation':
          return await this.getValuationReport(req, res);
        default:
          return res.status(400).json({ message: 'Invalid report type' });
      }
    } catch (error) {
      console.error('Inventory report error:', error);
      res.status(500).json({ 
        message: 'Error generating inventory report', 
        error: error.message 
      });
    }
  }

  /**
   * Generate summary report
   */
  async getSummaryReport(req, res) {
    try {
      const products = await Product.findAll({
        include: [{
          model: require('./../models/supplier'),
          attributes: ['id', 'name']
        }],
        order: [['quantity', 'ASC']]
      });

      const totalValue = products.reduce((sum, product) => {
        return sum + (product.quantity * parseFloat(product.price));
      }, 0);

      const stockStatus = {
        outOfStock: products.filter(p => p.quantity === 0).length,
        lowStock: products.filter(p => p.quantity > 0 && p.quantity <= p.min_stock_level).length,
        inStock: products.filter(p => p.quantity > p.min_stock_level).length
      };

      res.json({
        reportType: 'summary',
        generatedAt: new Date(),
        totalProducts: products.length,
        totalStockValue: parseFloat(totalValue.toFixed(2)),
        stockStatus,
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          quantity: p.quantity,
          minStockLevel: p.min_stock_level,
          price: p.price,
          supplier: p.Supplier?.name,
          status: p.quantity === 0 ? 'Out of Stock' : 
                 p.quantity <= p.min_stock_level ? 'Low Stock' : 'In Stock'
        }))
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate movement report
   */
  async getMovementReport(req, res) {
    try {
      const { days = 30 } = req.query;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const movements = await InventoryTransaction.findAll({
        where: {
          created_at: {
            [Sequelize.Op.gte]: startDate
          }
        },
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'sku'],
            include: [{
              model: require('./../models/supplier'),
              attributes: ['id', 'name']
            }]
          },
          {
            model: User,
            attributes: ['id', 'username']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      const summary = await InventoryTransaction.findAll({
        where: {
          created_at: {
            [Sequelize.Op.gte]: startDate
          }
        },
        attributes: [
          'type',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity']
        ],
        group: ['type'],
        raw: true
      });

      res.json({
        reportType: 'movement',
        period: `${days} days`,
        generatedAt: new Date(),
        summary,
        totalTransactions: movements.length,
        movements: movements.map(m => ({
          id: m.id,
          date: m.created_at,
          product: m.Product.name,
          sku: m.Product.sku,
          type: m.type,
          quantity: m.quantity,
          previousQuantity: m.previous_quantity,
          newQuantity: m.new_quantity,
          reason: m.reason,
          user: m.User.username
        }))
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate valuation report
   */
  async getValuationReport(req, res) {
    try {
      const products = await Product.findAll({
        include: [{
          model: require('./../models/supplier'),
          attributes: ['id', 'name']
        }],
        order: [[Sequelize.literal('quantity * price'), 'DESC']]
      });

      const valuationData = products.map(product => {
        const quantity = product.quantity;
        const price = parseFloat(product.price);
        const cost = product.cost_price ? parseFloat(product.cost_price) : price * 0.6; // Estimate if not available
        const value = quantity * price;
        const costValue = quantity * cost;
        const profitMargin = value - costValue;

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          quantity,
          price,
          costPrice: cost,
          totalValue: parseFloat(value.toFixed(2)),
          costValue: parseFloat(costValue.toFixed(2)),
          profitMargin: parseFloat(profitMargin.toFixed(2)),
          marginPercentage: parseFloat(((profitMargin / value) * 100).toFixed(2)),
          supplier: product.Supplier?.name
        };
      });

      const totalValuation = valuationData.reduce((sum, item) => sum + item.totalValue, 0);
      const totalCost = valuationData.reduce((sum, item) => sum + item.costValue, 0);
      const totalProfit = valuationData.reduce((sum, item) => sum + item.profitMargin, 0);

      res.json({
        reportType: 'valuation',
        generatedAt: new Date(),
        summary: {
          totalProducts: products.length,
          totalValuation: parseFloat(totalValuation.toFixed(2)),
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalProfit: parseFloat(totalProfit.toFixed(2)),
          averageMargin: parseFloat(((totalProfit / totalValuation) * 100).toFixed(2))
        },
        products: valuationData
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new InventoryController();