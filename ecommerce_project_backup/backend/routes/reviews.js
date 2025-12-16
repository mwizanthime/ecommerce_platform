// // backend/routes/reviews.js
// import express from 'express';
// import {
//   getProductReviews,
//   createReview,
//   updateReview,
//   deleteReview,
//   getUserReviewForProduct
// } from '../controllers/reviewController.js';
// import { authenticate } from '../middleware/auth.js';

// const router = express.Router();

// router.get('/product/:productId', getProductReviews);
// router.get('/product/:productId/user', authenticate, getUserReviewForProduct);
// router.post('/', authenticate, createReview);
// router.put('/:id', authenticate, updateReview);
// router.delete('/:id', authenticate, deleteReview);

// export default router;





// import express from 'express';
// import {
//   getProductReviews,
//   createReview,
//   updateReview,
//   deleteReview,
//   getUserReviewForProduct,
//   getUserReviews,
//   getPendingReviews,
//   moderateReview
// } from '../controllers/reviewController.js';
// import { authenticate, authorize } from '../middleware/auth.js';
// // import { isSeller, isAdmin } from '../middleware/role.js';

// const router = express.Router();

// // Public routes
// router.get('/product/:productId', getProductReviews);

// // User routes
// router.get('/user', authenticate, getUserReviews);
// router.get('/product/:productId/user', authenticate, getUserReviewForProduct);
// router.post('/', authenticate, createReview);
// router.put('/:id', authenticate, updateReview);
// router.delete('/:id', authenticate, deleteReview);


// // Moderation routes
// router.get('/pending', authenticate, authorize('seller'), getPendingReviews);
// router.patch('/:id/moderate', authenticate, authorize('seller'), moderateReview);

// // Admin routes
// router.get('/admin/pending', authenticate, authorize('admin'), getPendingReviews);
// router.patch('/admin/:id/moderate', authenticate, authorize('admin'), moderateReview);

// export default router;




// // backend/routes/reviews.js
// import express from 'express';
// import {
//   getProductReviews,
//   createReview,
//   updateReview,
//   deleteReview,
//   getUserReviewForProduct,
//   getUserReviews,
//   getPendingReviews,
//   moderateReview,getAdminAllReviews,getAdminReviewStats,
//   getReviewStatistics , testReviewsEndpoint,verifyPurchaseEligibility
// } from '../controllers/reviewController.js';
// import { authenticate, authorize } from '../middleware/auth.js';

// const router = express.Router();

// // Public routes
// router.get('/product/:productId', getProductReviews);
// // Test route (temporary)
// router.get('/test', testReviewsEndpoint);

// // User routes
// router.get('/user', authenticate, getUserReviews);
// router.get('/product/:productId/user', authenticate, getUserReviewForProduct);
// router.post('/', authenticate, createReview);
// router.put('/:id', authenticate, updateReview);
// router.delete('/:id', authenticate, deleteReview);

// // Moderation routes
// router.get('/pending', authenticate, authorize('seller'), getPendingReviews);
// router.patch('/:id/moderate', authenticate, authorize('seller'), moderateReview);
// router.get('/admin/statistics', authenticate, authorize('admin'), getReviewStatistics);

// // Admin routes
// router.get('/admin/pending', authenticate, authorize('admin'), getPendingReviews);
// router.patch('/admin/:id/moderate', authenticate, authorize('admin'), moderateReview);

// // Add to backend/routes/reviews.js
// router.get('/admin/all', authenticate, authorize('admin'), getAdminAllReviews);
// router.get('/admin/statistics', authenticate, authorize('admin'), getAdminReviewStats);
// // Add to backend/routes/reviews.js
// router.get('/product/:productId/eligibility', authenticate, verifyPurchaseEligibility);

// export default router;



// backend/routes/reviews.js
import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviewForProduct,
  getUserReviews,
  getPendingReviews,
  moderateReview,
  getAdminAllReviews,
  getReviewStatistics, // Remove getAdminReviewStats if it's the same
  testReviewsEndpoint,
  verifyPurchaseEligibility
} from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/test', testReviewsEndpoint);

// User routes
router.get('/user', authenticate, getUserReviews);
router.get('/product/:productId/user', authenticate, getUserReviewForProduct);
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

// Moderation routes
router.get('/pending', authenticate, authorize('seller'), getPendingReviews);
router.patch('/:id/moderate', authenticate, authorize('seller'), moderateReview);

// Admin routes
router.get('/admin/pending', authenticate, authorize('admin'), getPendingReviews);
router.patch('/admin/:id/moderate', authenticate, authorize('admin'), moderateReview);
router.get('/admin/all', authenticate, authorize('admin'), getAdminAllReviews);
router.get('/admin/statistics', authenticate, authorize('admin'), getReviewStatistics); // Only one route

// Eligibility route
router.get('/product/:productId/eligibility', authenticate, verifyPurchaseEligibility);

export default router;