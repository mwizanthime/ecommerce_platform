// // backend/controllers/authController.js
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import pool from '../config/database.js';

// export const register = async (req, res) => {
//   try {
//     const { username, email, password, role = 'customer' } = req.body;

//     // Check if user exists
//     const [existingUsers] = await pool.execute(
//       'SELECT id FROM users WHERE email = ? OR username = ?',
//       [email, username]
//     );

//     if (existingUsers.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const [result] = await pool.execute(
//       'INSERT INTO users (username, email, password, role, is_approved) VALUES (?, ?, ?, ?, ?)',
//       [username, email, hashedPassword, role, role === 'customer']
//     );

//     const token = jwt.sign(
//       { userId: result.insertId },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: result.insertId,
//         username,
//         email,
//         role,
//         is_approved: role === 'customer'
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const [users] = await pool.execute(
//       'SELECT * FROM users WHERE email = ?',
//       [email]
//     );

//     if (users.length === 0) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const user = users[0];

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check if seller is approved
//     if (user.role === 'seller' && !user.is_approved) {
//       return res.status(400).json({ message: 'Your account is pending approval' });
//     }

//     const token = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         is_approved: user.is_approved,
//         profile_picture: user.profile_picture
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getProfile = async (req, res) => {
//   try {
//     res.json(req.user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };



// backend/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, role = 'customer' } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role, is_approved) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, role === 'customer']
    );

    // Get the complete user data including profile_picture
    const [newUsers] = await pool.execute(
      'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    const newUser = newUsers[0];

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists - include profile_picture in SELECT
    const [users] = await pool.execute(
      'SELECT id, username, email, password, role, profile_picture, is_approved, created_at FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if seller is approved
    if (user.role === 'seller' && !user.is_approved) {
      return res.status(400).json({ message: 'Your account is pending approval' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Get fresh user data including profile_picture
    const [users] = await pool.execute(
      'SELECT id, username, email, role, profile_picture, is_approved, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};