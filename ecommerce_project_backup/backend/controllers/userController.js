// backend/controllers/userController.js
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import uploadProfile from '../middleware/uploadProfile.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';



// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use the middleware for profile picture uploads
export const uploadProfilePictureMiddleware = uploadProfile.single('profile_picture');

export const uploadProfilePicture = async (req, res) => {
  try {
    console.log('Upload profile picture request received');
    console.log('Uploaded file:', req.file);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    
    // ✅ File is now saved to uploads/profiles/ with the new naming convention
    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;

    console.log('User ID:', userId);
    console.log('Profile picture path:', profilePicturePath);
    console.log('File saved at:', req.file.path);

    // Verify file was actually saved
    if (!fs.existsSync(req.file.path)) {
      console.error('File was not saved to disk:', req.file.path);
      return res.status(500).json({ message: 'Failed to save file to server' });
    }

    // Get current profile picture to delete it later
    const [currentUser] = await pool.execute(
      'SELECT profile_picture FROM users WHERE id = ?',
      [userId]
    );

    const currentPicture = currentUser[0]?.profile_picture;
    console.log('Current profile picture:', currentPicture);

    // Update user's profile picture in database
    const [updateResult] = await pool.execute(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profilePicturePath, userId]
    );

    console.log('Database update result:', updateResult);

    // Delete old profile picture if it exists and is not the default
    if (currentPicture && !currentPicture.includes('/api/placeholder/')) {
      try {
        // Extract filename from path and build full path
        const oldFilename = path.basename(currentPicture);
        const oldPicturePath = path.join(__dirname, '..', 'uploads', 'profiles', oldFilename);
        
        console.log('Attempting to delete old picture:', oldPicturePath);
        
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
          console.log('Old profile picture deleted successfully');
        } else {
          console.log('Old profile picture not found at:', oldPicturePath);
        }
      } catch (deleteError) {
        console.error('Error deleting old profile picture:', deleteError);
      }
    }

    // Get updated user data
    const [updatedUser] = await pool.execute(
      'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile picture updated successfully',
      profile_picture: profilePicturePath,
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    
    // Clean up the uploaded file if there was an error
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('Cleaned up uploaded file due to error');
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      message: 'Server error while uploading profile picture', 
      error: error.message 
    });
  }
};

export const removeProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Remove profile picture for user:', userId);

    // Get current profile picture
    const [currentUser] = await pool.execute(
      'SELECT profile_picture FROM users WHERE id = ?',
      [userId]
    );

    const currentPicture = currentUser[0]?.profile_picture;
    console.log('Current picture to remove:', currentPicture);

    // Remove profile picture from database
    const [updateResult] = await pool.execute(
      'UPDATE users SET profile_picture = NULL WHERE id = ?',
      [userId]
    );

    console.log('Database removal result:', updateResult);

    // Delete the file if it exists and is not the default
    if (currentPicture && !currentPicture.includes('/api/placeholder/')) {
      try {
        // Extract filename from path
        const filename = path.basename(currentPicture);
        const picturePath = path.join(__dirname, '..', 'uploads', 'profiles', filename);
        
        console.log('Attempting to delete file:', picturePath);
        
        if (fs.existsSync(picturePath)) {
          fs.unlinkSync(picturePath);
          console.log('Profile picture file deleted successfully');
        } else {
          console.log('Profile picture file not found at:', picturePath);
        }
      } catch (deleteError) {
        console.error('Error deleting profile picture file:', deleteError);
      }
    }

    // Get updated user data
    const [updatedUser] = await pool.execute(
      'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile picture removed successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Remove profile picture error:', error);
    res.status(500).json({ 
      message: 'Server error while removing profile picture', 
      error: error.message 
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email,profile_picture, role, is_approved, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// export const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Users can only view their own profile unless they are admin
//     if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const [users] = await pool.execute(
//       'SELECT id, username, email, role, is_approved, created_at FROM users WHERE id = ?',
//       [id]
//     );

//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(users[0]);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they are admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [users] = await pool.execute(
      'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { username, email, password } = req.body;

//     // Users can only update their own profile unless they are admin
//     if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     let updateQuery = 'UPDATE users SET username = ?, email = ?';
//     const params = [username, email];

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       updateQuery += ', password = ?';
//       params.push(hashedPassword);
//     }

//     updateQuery += ' WHERE id = ?';
//     params.push(id);

//     const [result] = await pool.execute(updateQuery, params);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'User updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
// // backend/controllers/userController.js - Update the updateUser function
// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { username, email, password, currentPassword } = req.body;

//     // Users can only update their own profile unless they are admin
//     if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Check if user exists
//     const [users] = await pool.execute(
//       'SELECT * FROM users WHERE id = ?',
//       [id]
//     );

//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const existingUser = users[0];

//     // If changing password, verify current password
//     if (password) {
//       if (!currentPassword) {
//         return res.status(400).json({ message: 'Current password is required' });
//       }

//       const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
//       if (!isCurrentPasswordValid) {
//         return res.status(400).json({ message: 'Current password is incorrect' });
//       }

//       // Hash new password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
      
//       await pool.execute(
//         'UPDATE users SET password = ? WHERE id = ?',
//         [hashedPassword, id]
//       );
//     }

//     // Update username and email if provided
//     if (username || email) {
//       let updateQuery = 'UPDATE users SET ';
//       const updateParams = [];
//       const updates = [];

//       if (username) {
//         updates.push('username = ?');
//         updateParams.push(username);
//       }

//       if (email) {
//         updates.push('email = ?');
//         updateParams.push(email);
//       }

//       updateQuery += updates.join(', ') + ' WHERE id = ?';
//       updateParams.push(id);

//       await pool.execute(updateQuery, updateParams);
//     }

//     // Get updated user data
//     const [updatedUsers] = await pool.execute(
//       'SELECT id, username, email, role, is_approved, created_at FROM users WHERE id = ?',
//       [id]
//     );

//     res.json({ 
//       message: 'User updated successfully',
//       user: updatedUsers[0]
//     });
//   } catch (error) {
//     console.error('Update user error:', error);
    
//     if (error.code === 'ER_DUP_ENTRY') {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }
    
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };






// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Prevent users from deleting themselves
//     if (req.user.id === parseInt(id)) {
//       return res.status(400).json({ message: 'Cannot delete your own account' });
//     }

//     const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// backend/controllers/userController.js



// // backend/controllers/userController.js - Update the updateUser function
// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { username, email, password, currentPassword, role } = req.body;

//     console.log('Updating user:', id, req.body);

//     // Check if user exists
//     const [users] = await pool.execute(
//       'SELECT * FROM users WHERE id = ?',
//       [id]
//     );

//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const existingUser = users[0];

//     // Users can only update their own profile unless they are admin
//     if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Check for duplicate username or email (excluding current user)
//     const [duplicateUsers] = await pool.execute(
//       'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
//       [username, email, id]
//     );

//     if (duplicateUsers.length > 0) {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }

//     // If changing password, verify current password
//     if (password) {
//       if (!currentPassword) {
//         return res.status(400).json({ message: 'Current password is required to change password' });
//       }

//       const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
//       if (!isCurrentPasswordValid) {
//         return res.status(400).json({ message: 'Current password is incorrect' });
//       }

//       // Hash new password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
      
//       await pool.execute(
//         'UPDATE users SET password = ? WHERE id = ?',
//         [hashedPassword, id]
//       );
//     }

//     // Build update query
//     let updateQuery = 'UPDATE users SET username = ?, email = ?';
//     const updateParams = [username, email];

//     // Only admin can update role
//     if (req.user.role === 'admin' && role) {
//       updateQuery += ', role = ?';
//       updateParams.push(role);
      
//       // If role is changed to seller and not approved, set is_approved to false
//       if (role === 'seller' && existingUser.role !== 'seller') {
//         updateQuery += ', is_approved = FALSE';
//       }
//     }

//     updateQuery += ' WHERE id = ?';
//     updateParams.push(id);

//     const [result] = await pool.execute(updateQuery, updateParams);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Get updated user data
//     const [updatedUsers] = await pool.execute(
//       'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
//       [id]
//     );

//     res.json({ 
//       message: 'User updated successfully',
//       user: updatedUsers[0]
//     });
//   } catch (error) {
//     console.error('Update user error:', error);
    
//     if (error.code === 'ER_DUP_ENTRY') {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }
    
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// backend/controllers/userController.js - Update the updateUser function
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, currentPassword, role } = req.body;

    console.log('Updating user:', id, req.body);

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingUser = users[0];

    // Users can only update their own profile unless they are admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check for duplicate username or email (excluding current user) - only if they are provided
    if (username || email) {
      const [duplicateUsers] = await pool.execute(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
        [username, email, id]
      );

      if (duplicateUsers.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
    }

    // If changing password, verify current password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
    }

    // Build update query dynamically based on what's provided
    let updateQuery = 'UPDATE users SET ';
    const updateParams = [];
    const updates = [];

    // Only update username if provided and not undefined
    if (username !== undefined && username !== null) {
      updates.push('username = ?');
      updateParams.push(username);
    }

    // Only update email if provided and not undefined
    if (email !== undefined && email !== null) {
      updates.push('email = ?');
      updateParams.push(email);
    }

    // Only admin can update role
    if (req.user.role === 'admin' && role !== undefined && role !== null) {
      updates.push('role = ?');
      updateParams.push(role);
      
      // If role is changed to seller and not approved, set is_approved to false
      if (role === 'seller' && existingUser.role !== 'seller') {
        updates.push('is_approved = FALSE');
      }
    }

    // If there are no fields to update (only password was updated), return success
    if (updates.length === 0 && password) {
      // Get updated user data
      const [updatedUsers] = await pool.execute(
        'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
        [id]
      );

      return res.json({ 
        message: 'Password updated successfully',
        user: updatedUsers[0]
      });
    }

    // If there are fields to update, build and execute the query
    if (updates.length > 0) {
      updateQuery += updates.join(', ') + ' WHERE id = ?';
      updateParams.push(id);

      const [result] = await pool.execute(updateQuery, updateParams);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // Get updated user data
    const [updatedUsers] = await pool.execute(
      'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({ 
      message: 'User updated successfully',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent users from deleting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Check if user has related records
    const checkQueries = [
      { table: 'orders', field: 'user_id', message: 'User has orders' },
      { table: 'products', field: 'seller_id', message: 'User has products' },
      { table: 'reviews', field: 'user_id', message: 'User has reviews' },
      { table: 'cart', field: 'user_id', message: 'User has cart items' },
      { table: 'wishlist', field: 'user_id', message: 'User has wishlist items' }
    ];

    for (const query of checkQueries) {
      const [result] = await pool.execute(
        `SELECT COUNT(*) as count FROM ${query.table} WHERE ${query.field} = ?`,
        [id]
      );
      
      if (result[0].count > 0) {
        return res.status(400).json({ 
          message: `Cannot delete user: ${query.message}. Please reassign or delete related records first.`,
          constraint: query.table
        });
      }
    }

    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    
    // Handle foreign key constraint errors
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(400).json({ 
        message: 'Cannot delete user: User has related records in the system. Please reassign or delete related records first.'
      });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const approveSeller = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE users SET is_approved = TRUE WHERE id = ? AND role = "seller"',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({ message: 'Seller approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};