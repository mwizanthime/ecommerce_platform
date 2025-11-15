const { Supplier, Product, InventoryTransaction } = require('../models');
const { Sequelize } = require('sequelize');
const { validationResult } = require('express-validator');

class SupplierController {
  // Get all suppliers with optional filtering and pagination
  async getSuppliers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        search, 
        sortBy = 'created_at', 
        sortOrder = 'DESC' 
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Search filter
      if (search) {
        whereClause[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.like]: `%${search}%` } },
          { contact_person: { [Sequelize.Op.like]: `%${search}%` } },
          { email: { [Sequelize.Op.like]: `%${search}%` } }
        ];
      }

      const suppliers = await Supplier.findAndCountAll({
        where: whereClause,
        include: [{
          model: Product,
          attributes: ['id', 'name', 'sku', 'quantity'],
          required: false
        }],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true // Important for count with includes
      });

      // Calculate product counts and stock values for each supplier
      const suppliersWithStats = await Promise.all(
        suppliers.rows.map(async (supplier) => {
          const supplierProducts = await Product.findAll({
            where: { supplier_id: supplier.id },
            attributes: [
              'id',
              'quantity',
              'price',
              [Sequelize.fn('COUNT', Sequelize.col('id')), 'product_count'],
              [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_stock'],
              [Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'stock_value']
            ],
            raw: true
          });

          const productCount = supplierProducts.length;
          const totalStock = supplierProducts.reduce((sum, product) => sum + (product.quantity || 0), 0);
          const stockValue = supplierProducts.reduce((sum, product) => 
            sum + (product.quantity * parseFloat(product.price || 0)), 0
          );

          return {
            ...supplier.toJSON(),
            stats: {
              productCount,
              totalStock,
              stockValue: parseFloat(stockValue.toFixed(2))
            }
          };
        })
      );

      res.json({
        suppliers: suppliersWithStats,
        totalPages: Math.ceil(suppliers.count / limit),
        currentPage: parseInt(page),
        totalSuppliers: suppliers.count,
        hasNextPage: page * limit < suppliers.count,
        hasPrevPage: page > 1
      });
    } catch (error) {
      console.error('Get suppliers error:', error);
      res.status(500).json({ 
        message: 'Error fetching suppliers', 
        error: error.message 
      });
    }
  }

  // Get supplier by ID
  async getSupplierById(req, res) {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByPk(id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'sku', 'quantity', 'price', 'min_stock_level'],
          include: [{
            model: InventoryTransaction,
            attributes: ['id', 'type', 'quantity', 'created_at'],
            limit: 10,
            order: [['created_at', 'DESC']]
          }]
        }]
      });

      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      // Calculate supplier statistics
      const supplierProducts = await Product.findAll({
        where: { supplier_id: id },
        attributes: [
          'id',
          'quantity',
          'price',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'product_count'],
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_stock'],
          [Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'stock_value']
        ],
        raw: true
      });

      const productCount = supplierProducts.length;
      const totalStock = supplierProducts.reduce((sum, product) => sum + (product.quantity || 0), 0);
      const stockValue = supplierProducts.reduce((sum, product) => 
        sum + (product.quantity * parseFloat(product.price || 0)), 0
      );

      const lowStockProducts = await Product.count({
        where: { 
          supplier_id: id,
          quantity: {
            [Sequelize.Op.lte]: Sequelize.col('min_stock_level')
          }
        }
      });

      const outOfStockProducts = await Product.count({
        where: { 
          supplier_id: id,
          quantity: 0
        }
      });

      res.json({
        ...supplier.toJSON(),
        stats: {
          productCount,
          totalStock,
          stockValue: parseFloat(stockValue.toFixed(2)),
          lowStockProducts,
          outOfStockProducts
        }
      });
    } catch (error) {
      console.error('Get supplier error:', error);
      res.status(500).json({ 
        message: 'Error fetching supplier', 
        error: error.message 
      });
    }
  }

  // Create new supplier
  async createSupplier(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, contact_person, phone, email, address } = req.body;

      // Check if supplier with same name or email already exists
      const existingSupplier = await Supplier.findOne({
        where: {
          [Sequelize.Op.or]: [
            { name },
            { email }
          ]
        }
      });

      if (existingSupplier) {
        return res.status(400).json({ 
          message: 'Supplier with this name or email already exists' 
        });
      }

      const supplier = await Supplier.create({
        name,
        contact_person,
        phone,
        email,
        address
      });

      res.status(201).json({
        message: 'Supplier created successfully',
        supplier
      });
    } catch (error) {
      console.error('Create supplier error:', error);
      res.status(500).json({ 
        message: 'Error creating supplier', 
        error: error.message 
      });
    }
  }

  // Update supplier
  async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const { name, contact_person, phone, email, address } = req.body;

      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      // Check if another supplier with the same name or email exists
      if (name || email) {
        const whereCondition = {
          id: { [Sequelize.Op.ne]: id }
        };

        if (name && email) {
          whereCondition[Sequelize.Op.or] = [
            { name },
            { email }
          ];
        } else if (name) {
          whereCondition.name = name;
        } else if (email) {
          whereCondition.email = email;
        }

        const existingSupplier = await Supplier.findOne({ where: whereCondition });

        if (existingSupplier) {
          return res.status(400).json({ 
            message: 'Another supplier with this name or email already exists' 
          });
        }
      }

      await supplier.update({
        name: name || supplier.name,
        contact_person: contact_person !== undefined ? contact_person : supplier.contact_person,
        phone: phone !== undefined ? phone : supplier.phone,
        email: email !== undefined ? email : supplier.email,
        address: address !== undefined ? address : supplier.address
      });

      // Fetch updated supplier with relationships
      const updatedSupplier = await Supplier.findByPk(id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'sku', 'quantity']
        }]
      });

      res.json({
        message: 'Supplier updated successfully',
        supplier: updatedSupplier
      });
    } catch (error) {
      console.error('Update supplier error:', error);
      res.status(500).json({ 
        message: 'Error updating supplier', 
        error: error.message 
      });
    }
  }

  // Delete supplier
  async deleteSupplier(req, res) {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByPk(id, {
        include: [{
          model: Product,
          attributes: ['id', 'name']
        }]
      });

      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      // Check if supplier has associated products
      if (supplier.Products && supplier.Products.length > 0) {
        const productNames = supplier.Products.map(product => product.name).join(', ');
        return res.status(400).json({ 
          message: `Cannot delete supplier with associated products: ${productNames}`,
          associatedProducts: supplier.Products
        });
      }

      await supplier.destroy();

      res.json({
        message: 'Supplier deleted successfully',
        deletedSupplier: {
          id: supplier.id,
          name: supplier.name
        }
      });
    } catch (error) {
      console.error('Delete supplier error:', error);
      res.status(500).json({ 
        message: 'Error deleting supplier', 
        error: error.message 
      });
    }
  }

  // Get supplier products
  async getSupplierProducts(req, res) {
    try {
      const { id } = req.params;
      const { 
        page = 1, 
        limit = 50,
        stockStatus 
      } = req.query;

      const offset = (page - 1) * limit;

      // Verify supplier exists
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      const whereClause = { supplier_id: id };

      // Filter by stock status
      if (stockStatus) {
        switch (stockStatus) {
          case 'out_of_stock':
            whereClause.quantity = 0;
            break;
          case 'low_stock':
            whereClause.quantity = {
              [Sequelize.Op.gt]: 0,
              [Sequelize.Op.lte]: Sequelize.col('min_stock_level')
            };
            break;
          case 'in_stock':
            whereClause.quantity = {
              [Sequelize.Op.gt]: Sequelize.col('min_stock_level')
            };
            break;
        }
      }

      const products = await Product.findAndCountAll({
        where: whereClause,
        include: [{
          model: InventoryTransaction,
          attributes: ['id', 'type', 'quantity', 'created_at'],
          limit: 5,
          order: [['created_at', 'DESC']]
        }],
        order: [['name', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        supplier: {
          id: supplier.id,
          name: supplier.name
        },
        products: products.rows,
        totalPages: Math.ceil(products.count / limit),
        currentPage: parseInt(page),
        totalProducts: products.count
      });
    } catch (error) {
      console.error('Get supplier products error:', error);
      res.status(500).json({ 
        message: 'Error fetching supplier products', 
        error: error.message 
      });
    }
  }

  // Get supplier performance metrics
  async getSupplierPerformance(req, res) {
    try {
      const { id } = req.params;
      const { period = '30days' } = req.query;

      // Verify supplier exists
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      let dateFilter = new Date();
      switch (period) {
        case '7days':
          dateFilter.setDate(dateFilter.getDate() - 7);
          break;
        case '30days':
          dateFilter.setDate(dateFilter.getDate() - 30);
          break;
        case '90days':
          dateFilter.setDate(dateFilter.getDate() - 90);
          break;
        default:
          dateFilter.setDate(dateFilter.getDate() - 30);
      }

      // Get stock movement for supplier's products
      const stockMovement = await InventoryTransaction.findAll({
        attributes: [
          'type',
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity'],
          [Sequelize.fn('COUNT', Sequelize.col('InventoryTransaction.id')), 'transaction_count']
        ],
        include: [{
          model: Product,
          attributes: [],
          where: { supplier_id: id }
        }],
        where: {
          created_at: {
            [Sequelize.Op.gte]: dateFilter
          }
        },
        group: ['type'],
        raw: true
      });

      // Get product statistics
      const productStats = await Product.findAll({
        where: { supplier_id: id },
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_products'],
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_stock'],
          [Sequelize.fn('SUM', Sequelize.literal('quantity * price')), 'total_value'],
          [Sequelize.fn('AVG', Sequelize.col('price')), 'avg_price']
        ],
        raw: true
      });

      // Get low stock alerts
      const lowStockAlerts = await Product.count({
        where: { 
          supplier_id: id,
          quantity: {
            [Sequelize.Op.lte]: Sequelize.col('min_stock_level')
          }
        }
      });

      res.json({
        supplier: {
          id: supplier.id,
          name: supplier.name
        },
        period,
        stockMovement,
        productStats: productStats[0] || {},
        lowStockAlerts,
        performance: {
          // You can add more performance metrics here
          stockTurnover: this.calculateStockTurnover(stockMovement),
          fulfillmentRate: this.calculateFulfillmentRate(stockMovement)
        }
      });
    } catch (error) {
      console.error('Get supplier performance error:', error);
      res.status(500).json({ 
        message: 'Error fetching supplier performance', 
        error: error.message 
      });
    }
  }

  // Helper method to calculate stock turnover
  calculateStockTurnover(stockMovement) {
    const inTransactions = stockMovement.find(t => t.type === 'in');
    const outTransactions = stockMovement.find(t => t.type === 'out');
    
    const totalIn = inTransactions ? parseFloat(inTransactions.total_quantity) : 0;
    const totalOut = outTransactions ? parseFloat(outTransactions.total_quantity) : 0;
    
    return totalOut > 0 ? (totalIn / totalOut).toFixed(2) : 0;
  }

  // Helper method to calculate fulfillment rate
  calculateFulfillmentRate(stockMovement) {
    const inTransactions = stockMovement.find(t => t.type === 'in');
    const outTransactions = stockMovement.find(t => t.type === 'out');
    
    const totalIn = inTransactions ? parseFloat(inTransactions.total_quantity) : 0;
    const totalOut = outTransactions ? parseFloat(outTransactions.total_quantity) : 0;
    
    return totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(2) : 0;
  }

  // Search suppliers
  async searchSuppliers(req, res) {
    try {
      const { query, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const suppliers = await Supplier.findAll({
        where: {
          [Sequelize.Op.or]: [
            { name: { [Sequelize.Op.like]: `%${query}%` } },
            { contact_person: { [Sequelize.Op.like]: `%${query}%` } },
            { email: { [Sequelize.Op.like]: `%${query}%` } },
            { phone: { [Sequelize.Op.like]: `%${query}%` } }
          ]
        },
        limit: parseInt(limit),
        order: [['name', 'ASC']]
      });

      res.json({
        query,
        results: suppliers,
        totalResults: suppliers.length
      });
    } catch (error) {
      console.error('Search suppliers error:', error);
      res.status(500).json({ 
        message: 'Error searching suppliers', 
        error: error.message 
      });
    }
  }
}

module.exports = new SupplierController();