// backend/routes/users.js
import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  approveSeller,
  uploadProfilePicture,
  removeProfilePicture,
  uploadProfilePictureMiddleware
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), getUsers);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.put('/:id/approve', authenticate, authorize('admin'), approveSeller);


// New profile picture routes
router.patch('/profile/picture', authenticate, uploadProfilePictureMiddleware, uploadProfilePicture);
router.delete('/profile/picture', authenticate, removeProfilePicture);

export default router;