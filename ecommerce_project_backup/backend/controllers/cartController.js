// backend/controllers/cartController.js
import pool from '../config/database.js';





// Helper function to format image URL
const formatImageUrl = (imagePath) => {
  if (!imagePath) {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/100/100`;
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads/')) {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
  }

  return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
};

// export const getCart = async (req, res) => {
//   try {
//     const [carts] = await pool.execute(
//       'SELECT id FROM cart WHERE user_id = ?',
//       [req.user.id]
//     );

//     let cartId;
//     if (carts.length === 0) {
//       // Create cart if it doesn't exist
//       const [result] = await pool.execute(
//         'INSERT INTO cart (user_id) VALUES (?)',
//         [req.user.id]
//       );
//       cartId = result.insertId;
//     } else {
//       cartId = carts[0].id;
//     }

//     const [cartItems] = await pool.execute(
//       `SELECT ci.id, ci.product_id, ci.quantity, p.name as product_name, 
//               p.price, p.quantity as stock_quantity,
//               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image
//        FROM cart_items ci
//        JOIN products p ON ci.product_id = p.id
//        WHERE ci.cart_id = ?`,
//       [cartId]
//     );

//     res.json({ items: cartItems });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


export const getCart = async (req, res) => {
  try {
    const [carts] = await pool.execute(
      'SELECT id FROM cart WHERE user_id = ?',
      [req.user.id]
    );

    let cartId;
    if (carts.length === 0) {
      // Create cart if it doesn't exist
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id) VALUES (?)',
        [req.user.id]
      );
      cartId = result.insertId;
    } else {
      cartId = carts[0].id;
    }

    const [cartItems] = await pool.execute(
      `SELECT 
        ci.id, 
        ci.product_id, 
        ci.quantity, 
        p.name as product_name, 
        p.price, 
        p.quantity as stock_quantity,
        pi.image_url as product_image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    // Format the image URLs before sending to frontend
    const formattedCartItems = cartItems.map(item => ({
      ...item,
      product_image: formatImageUrl(item.product_image)
    }));

    res.json({ items: formattedCartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Get or create cart
    const [carts] = await pool.execute(
      'SELECT id FROM cart WHERE user_id = ?',
      [req.user.id]
    );

    let cartId;
    if (carts.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id) VALUES (?)',
        [req.user.id]
      );
      cartId = result.insertId;
    } else {
      cartId = carts[0].id;
    }

    // Check if product exists and is in stock
    const [products] = await pool.execute(
      'SELECT id, quantity FROM products WHERE id = ? AND is_published = TRUE',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check if item already in cart
    const [existingItems] = await pool.execute(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      await pool.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
    } else {
      // Add new item
      await pool.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
    }

    res.json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// export const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity = 1 } = req.body;

//     // Get or create cart
//     const [carts] = await pool.execute(
//       'SELECT id FROM cart WHERE user_id = ?',
//       [req.user.id]
//     );

//     let cartId;
//     if (carts.length === 0) {
//       const [result] = await pool.execute(
//         'INSERT INTO cart (user_id) VALUES (?)',
//         [req.user.id]
//       );
//       cartId = result.insertId;
//     } else {
//       cartId = carts[0].id;
//     }

//     // Check if product exists and is in stock
//     const [products] = await pool.execute(
//       'SELECT id, quantity FROM products WHERE id = ? AND is_published = TRUE',
//       [productId]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];
//     if (product.quantity < quantity) {
//       return res.status(400).json({ message: 'Insufficient stock' });
//     }

//     // Check if item already in cart
//     const [existingItems] = await pool.execute(
//       'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
//       [cartId, productId]
//     );

//     if (existingItems.length > 0) {
//       // Update quantity
//       const newQuantity = existingItems[0].quantity + quantity;
//       await pool.execute(
//         'UPDATE cart_items SET quantity = ? WHERE id = ?',
//         [newQuantity, existingItems[0].id]
//       );
//     } else {
//       // Add new item
//       await pool.execute(
//         'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
//         [cartId, productId, quantity]
//       );
//     }

//     res.json({ message: 'Product added to cart' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check if item belongs to user's cart
    const [items] = await pool.execute(
      `SELECT ci.* FROM cart_items ci
       JOIN cart c ON ci.cart_id = c.id
       WHERE ci.id = ? AND c.user_id = ?`,
      [itemId, req.user.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check stock
    const [products] = await pool.execute(
      'SELECT quantity FROM products WHERE id = ?',
      [items[0].product_id]
    );

    if (products[0].quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, itemId]
    );

    res.json({ message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Check if item belongs to user's cart
    const [items] = await pool.execute(
      `SELECT ci.* FROM cart_items ci
       JOIN cart c ON ci.cart_id = c.id
       WHERE ci.id = ? AND c.user_id = ?`,
      [itemId, req.user.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await pool.execute('DELETE FROM cart_items WHERE id = ?', [itemId]);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const [carts] = await pool.execute(
      'SELECT id FROM cart WHERE user_id = ?',
      [req.user.id]
    );

    if (carts.length > 0) {
      await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};