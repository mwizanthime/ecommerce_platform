// // backend/routes/categorySuggestions.js
// import express from 'express';
// import {
//   suggestCategory,
//   getCategorySuggestions,
//   updateSuggestionStatus,
//   deleteSuggestion
// } from '../controllers/categorySuggestionController.js';
// import { authenticate, authorize } from '../middleware/auth.js';

// const router = express.Router();

// // Sellers can suggest categories and view their own suggestions
// router.post('/', authenticate, authorize('seller', 'admin'), suggestCategory);
// router.get('/', authenticate, authorize('seller', 'admin'), getCategorySuggestions);
// router.delete('/:id', authenticate, authorize('seller', 'admin'), deleteSuggestion);

// // Only admins can update suggestion status
// router.patch('/:id/status', authenticate, authorize('admin'), updateSuggestionStatus);

// export default router;



// backend/routes/categorySuggestions.js
import express from 'express';
import {
  suggestCategory,
  getCategorySuggestions,
  getAdminCategorySuggestions, // Add this
  updateSuggestionStatus,
  deleteSuggestion
} from '../controllers/categorySuggestionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Sellers can suggest categories and view their own suggestions
router.post('/', authenticate, authorize('seller', 'admin'), suggestCategory);
router.get('/', authenticate, authorize('seller', 'admin'), getCategorySuggestions);
router.delete('/:id', authenticate, authorize('seller', 'admin'), deleteSuggestion);

// Admin-specific route to get all suggestions
router.get('/admin/all', authenticate, authorize('admin'), getAdminCategorySuggestions);

// Only admins can update suggestion status
router.patch('/:id/status', authenticate, authorize('admin'), updateSuggestionStatus);

export default router;