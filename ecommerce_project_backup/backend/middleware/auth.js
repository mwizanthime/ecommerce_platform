// // backend/middleware/auth.js
// import jwt from 'jsonwebtoken';
// import pool from '../config/database.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     const [users] = await pool.execute(
//       'SELECT id, username, email, role FROM users WHERE id = ?',
//       [decoded.userId]
//     );

//     if (users.length === 0) {
//       return res.status(401).json({ message: 'Token is not valid' });
//     }

//     req.user = users[0];
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     next();
//   };
// };


// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist and get latest data
    const [users] = await pool.execute(
      'SELECT id, username, email, role FROM users WHERE id = ?', // Removed is_approved
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // If roles is a string, convert to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    console.log('Authorization check:', {
      userRole: req.user.role,
      allowedRoles,
      user: req.user
    });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        required: allowedRoles,
        current: req.user.role
      });
    }

    // REMOVED the is_approved check for sellers
    // if (req.user.role === 'seller' && !req.user.is_approved) {
    //   return res.status(403).json({ 
    //     message: 'Seller account pending approval' 
    //   });
    // }

    next();
  };
};