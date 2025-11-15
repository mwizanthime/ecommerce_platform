// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const { Supplier } = require('../models');
// const { authenticateToken } = require('../middleware/authMiddleware');

// const router = express.Router();

// // Get all suppliers
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const suppliers = await Supplier.findAll({
//       order: [['created_at', 'DESC']]
//     });
//     res.json(suppliers);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get supplier by ID
// router.get('/:id', authenticateToken, async (req, res) => {
//   try {
//     const supplier = await Supplier.findByPk(req.params.id);
    
//     if (!supplier) {
//       return res.status(404).json({ message: 'Supplier not found' });
//     }
    
//     res.json(supplier);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create supplier
// router.post('/', [
//   authenticateToken,
//   body('name').notEmpty().trim()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const supplier = await Supplier.create(req.body);
//     res.status(201).json(supplier);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Update supplier
// router.put('/:id', authenticateToken, async (req, res) => {
//   try {
//     const supplier = await Supplier.findByPk(req.params.id);
    
//     if (!supplier) {
//       return res.status(404).json({ message: 'Supplier not found' });
//     }

//     await supplier.update(req.body);
//     res.json(supplier);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Delete supplier
// router.delete('/:id', authenticateToken, async (req, res) => {
//   try {
//     const supplier = await Supplier.findByPk(req.params.id);
    
//     if (!supplier) {
//       return res.status(404).json({ message: 'Supplier not found' });
//     }

//     await supplier.destroy();
//     res.json({ message: 'Supplier deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;


// const express = require('express');
// const { body } = require('express-validator');
// const supplierController = require('../controllers/supplierController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// const router = express.Router();

// // Validation rules
// const supplierValidation = [
//   body('name').notEmpty().trim().withMessage('Supplier name is required'),
//   body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required')
// ];

// // Get all suppliers
// router.get('/', authenticateToken, supplierController.getSuppliers);

// // Search suppliers
// router.get('/search', authenticateToken, supplierController.searchSuppliers);

// // Get supplier by ID
// router.get('/:id', authenticateToken, supplierController.getSupplierById);

// // Get supplier products
// router.get('/:id/products', authenticateToken, supplierController.getSupplierProducts);

// // Get supplier performance
// router.get('/:id/performance', authenticateToken, supplierController.getSupplierPerformance);

// // Create supplier
// router.post('/', authenticateToken, supplierValidation, supplierController.createSupplier);

// // Update supplier
// router.put('/:id', authenticateToken, supplierValidation, supplierController.updateSupplier);

// // Delete supplier
// router.delete('/:id', authenticateToken, supplierController.deleteSupplier);

// module.exports = router;



const express = require('express');
const { Supplier } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all suppliers
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching suppliers...');
    const suppliers = await Supplier.findAll({
      order: [['created_at', 'DESC']]
    });

    console.log(`Found ${suppliers.length} suppliers`);
    
    // Return consistent response structure
    res.json({
      success: true,
      data: suppliers,
      count: suppliers.length
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suppliers',
      error: error.message
    });
  }
});

// Get supplier by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    
    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching supplier',
      error: error.message
    });
  }
});

// Create supplier
router.post('/', authenticateToken, async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating supplier',
      error: error.message
    });
  }
});

// Update supplier
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    await supplier.update(req.body);
    
    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating supplier',
      error: error.message
    });
  }
});

// Delete supplier
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    await supplier.destroy();
    
    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting supplier',
      error: error.message
    });
  }
});

module.exports = router;