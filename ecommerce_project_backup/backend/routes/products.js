// // backend/routes/products.js
// import express from 'express';
// import {
//   getProducts,
//   getProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct,adjustStock,
//   // uploadProductImages
// } from '../controllers/productController.js';
// import { authenticate, authorize } from '../middleware/auth.js';
// import upload from '../middleware/upload.js';

// const router = express.Router();

// router.get('/', getProducts);
// router.get('/:id', getProduct);
// router.post('/', authenticate, authorize('seller', 'admin'), upload.array('images', 5), createProduct);
// router.put('/:id', authenticate, authorize('seller', 'admin'), updateProduct);
// router.delete('/:id', authenticate, authorize('seller', 'admin'), deleteProduct);
// // router.post('/:id/images', authenticate, authorize('seller', 'admin'), upload.array('images', 5), uploadProductImages);
// router.post('/:id/adjust-stock', authenticate, authorize('seller', 'admin'), adjustStock);

// export default router;





// // backend/routes/products.js
// import express from 'express';
// import {
//   getProducts,
//   getProduct,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getCategories,
//   getFeaturedProducts,
//   adjustStock,          // Add this import
//   bulkAdjustStock       // Add this import (optional)
// } from '../controllers/productController.js';
// import { authenticate, authorize } from '../middleware/auth.js';
// import upload from '../middleware/upload.js';

// const router = express.Router();

// // Public routes
// router.get('/', getProducts);
// router.get('/categories', getCategories);
// router.get('/featured', getFeaturedProducts);
// router.get('/:id', getProduct);

// // Protected routes (seller and admin)
// router.post('/', authenticate, authorize(['seller', 'admin']), upload.array('images', 5), createProduct);
// router.put('/:id', authenticate, authorize(['seller', 'admin']), updateProduct);


// router.patch('/:id', authenticate, authorize(['seller', 'admin']), updateProduct);


// router.delete('/:id', authenticate, authorize(['seller', 'admin']), deleteProduct);

// // Stock management routes
// router.patch('/:id/stock', authenticate, authorize(['seller', 'admin']), adjustStock);
// router.patch('/stock/bulk', authenticate, authorize(['seller', 'admin']), bulkAdjustStock);

// export default router;




import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts,
  adjustStock,
  bulkAdjustStock,
  getSellerProducts  // Add this import
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Protected routes (seller and admin)
router.post('/', authenticate, upload.array('images', 5), createProduct);
router.put('/:id', authenticate, updateProduct);
router.patch('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

// Seller-specific routes
router.get('/seller/products', authenticate, getSellerProducts); // Add this route

// Stock management routes
router.patch('/:id/stock', authenticate, adjustStock);
router.patch('/stock/bulk', authenticate, bulkAdjustStock);

export default router;