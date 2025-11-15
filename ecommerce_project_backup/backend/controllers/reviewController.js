// // backend/controllers/reviewController.js
// import pool from '../config/database.js';

// export const getProductReviews = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const [reviews] = await pool.execute(
//       `SELECT r.*, u.username 
//        FROM reviews r
//        JOIN users u ON r.user_id = u.id
//        WHERE r.product_id = ? AND r.is_approved = TRUE
//        ORDER BY r.created_at DESC`,
//       [productId]
//     );

//     // Calculate average rating
//     const [ratingResult] = await pool.execute(
//       'SELECT AVG(rating) as average_rating, COUNT(*) as review_count FROM reviews WHERE product_id = ? AND is_approved = TRUE',
//       [productId]
//     );

//     res.json({
//       reviews,
//       average_rating: ratingResult[0].average_rating || 0,
//       review_count: ratingResult[0].review_count || 0
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getUserReviewForProduct = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const userId = req.user.id;

//     const [reviews] = await pool.execute(
//       'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?',
//       [productId, userId]
//     );

//     res.json({ review: reviews[0] || null });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const createReview = async (req, res) => {
//   try {
//     const { productId, rating, comment } = req.body;
//     const userId = req.user.id;

//     // Check if user has purchased the product
//     const [orders] = await pool.execute(
//       `SELECT oi.id 
//        FROM order_items oi
//        JOIN orders o ON oi.order_id = o.id
//        WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'`,
//       [userId, productId]
//     );

//     if (orders.length === 0) {
//       return res.status(400).json({ message: 'You can only review purchased products' });
//     }

//     // Check if already reviewed
//     const [existingReviews] = await pool.execute(
//       'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
//       [userId, productId]
//     );

//     if (existingReviews.length > 0) {
//       return res.status(400).json({ message: 'You have already reviewed this product' });
//     }

//     const [result] = await pool.execute(
//       'INSERT INTO reviews (user_id, product_id, rating, comment, is_approved) VALUES (?, ?, ?, ?, ?)',
//       [userId, productId, rating, comment, req.user.role === 'admin'] // Auto-approve for admin
//     );

//     res.status(201).json({ 
//       message: 'Review submitted successfully',
//       reviewId: result.insertId 
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const updateReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rating, comment } = req.body;
//     const userId = req.user.id;

//     const [reviews] = await pool.execute(
//       'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
//       [id, userId]
//     );

//     if (reviews.length === 0) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     await pool.execute(
//       'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
//       [rating, comment, id]
//     );

//     res.json({ message: 'Review updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const deleteReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     const [reviews] = await pool.execute(
//       'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
//       [id, userId]
//     );

//     if (reviews.length === 0) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);

//     res.json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };





// backend/controllers/reviewController.js
import pool from '../config/database.js';

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest', rating } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.username, u.profile_picture,
             COUNT(*) OVER() as total_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.is_approved = TRUE
    `;
    
    const params = [productId];

    // Filter by rating
    if (rating && [1, 2, 3, 4, 5].includes(parseInt(rating))) {
      query += ' AND r.rating = ?';
      params.push(rating);
    }

    // Sorting
    const sortOptions = {
      newest: 'r.created_at DESC',
      oldest: 'r.created_at ASC',
      highest: 'r.rating DESC, r.created_at DESC',
      lowest: 'r.rating ASC, r.created_at DESC'
    };
    
    query += ` ORDER BY ${sortOptions[sort] || sortOptions.newest}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [reviews] = await pool.execute(query, params);

    // Calculate rating distribution
    const [ratingStats] = await pool.execute(`
      SELECT 
        rating,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reviews WHERE product_id = ? AND is_approved = TRUE)), 1) as percentage
      FROM reviews 
      WHERE product_id = ? AND is_approved = TRUE
      GROUP BY rating
      ORDER BY rating DESC
    `, [productId, productId]);

    // Overall stats
    const [overallStats] = await pool.execute(`
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        COUNT(DISTINCT user_id) as unique_reviewers
      FROM reviews 
      WHERE product_id = ? AND is_approved = TRUE
    `, [productId]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: reviews[0]?.total_count || 0,
        totalPages: Math.ceil((reviews[0]?.total_count || 0) / limit)
      },
      stats: {
        average_rating: parseFloat(overallStats[0]?.average_rating || 0).toFixed(1),
        total_reviews: overallStats[0]?.total_reviews || 0,
        unique_reviewers: overallStats[0]?.unique_reviewers || 0,
        rating_distribution: ratingStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// export const getUserReviewForProduct = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const userId = req.user.id;

//     const [reviews] = await pool.execute(`
//       SELECT r.*, p.name as product_name
//       FROM reviews r
//       JOIN products p ON r.product_id = p.id
//       WHERE r.product_id = ? AND r.user_id = ?
//     `, [productId, userId]);

//     res.json({ review: reviews[0] || null });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getUserReviews = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { page = 1, limit = 10, status } = req.query;
//     const offset = (page - 1) * limit;

//     let query = `
//       SELECT r.*, p.name as product_name, p.images as product_images,
//              COUNT(*) OVER() as total_count
//       FROM reviews r
//       JOIN products p ON r.product_id = p.id
//       WHERE r.user_id = ?
//     `;
    
//     const params = [userId];

//     if (status === 'approved') {
//       query += ' AND r.is_approved = TRUE';
//     } else if (status === 'pending') {
//       query += ' AND r.is_approved = FALSE';
//     }

//     query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
//     params.push(parseInt(limit), offset);

//     const [reviews] = await pool.execute(query, params);

//     res.json({
//       reviews,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total: reviews[0]?.total_count || 0
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


export const getUserReviewForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const [reviews] = await pool.execute(`
      SELECT r.*, p.name as product_name,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as product_image
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.product_id = ? AND r.user_id = ?
    `, [productId, userId]);

    res.json({ review: reviews[0] || null });
  } catch (error) {
    console.error('Error in getUserReviewForProduct:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getReviewStatistics = async (req, res) => {
  try {
    // Total reviews count
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM reviews');
    
    // Approved reviews count
    const [approvedResult] = await pool.execute('SELECT COUNT(*) as approved FROM reviews WHERE is_approved = TRUE');
    
    // Pending reviews count
    const [pendingResult] = await pool.execute('SELECT COUNT(*) as pending FROM reviews WHERE is_approved = FALSE');
    
    // Reviews by rating
    const [ratingDistribution] = await pool.execute(`
      SELECT rating, COUNT(*) as count 
      FROM reviews 
      WHERE is_approved = TRUE 
      GROUP BY rating 
      ORDER BY rating DESC
    `);
    
    // Recent reviews (last 7 days)
    const [recentResult] = await pool.execute(`
      SELECT COUNT(*) as recent 
      FROM reviews 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    
    // Top reviewed products
    const [topProducts] = await pool.execute(`
      SELECT p.name, p.id, COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = TRUE
      GROUP BY p.id, p.name
      ORDER BY review_count DESC
      LIMIT 5
    `);

    res.json({
      total: totalResult[0].total,
      approved: approvedResult[0].approved,
      pending: pendingResult[0].pending,
      recent: recentResult[0].recent,
      ratingDistribution,
      topProducts
    });
  } catch (error) {
    console.error('Error fetching review statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, p.name as product_name,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as product_image,
             COUNT(*) OVER() as total_count
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
    `;
    
    const params = [userId];

    if (status === 'approved') {
      query += ' AND r.is_approved = TRUE';
    } else if (status === 'pending') {
      query += ' AND r.is_approved = FALSE';
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [reviews] = await pool.execute(query, params);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: reviews[0]?.total_count || 0
      }
    });
  } catch (error) {
    console.error('Error in getUserReviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, title } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has purchased and received the product
    const [orders] = await pool.execute(`
      SELECT oi.id, o.created_at
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ? AND oi.product_id = ? AND oi.status = 'delivered'
      AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `, [userId, productId]);

    if (orders.length === 0) {
      return res.status(400).json({ 
        message: 'You can only review products you have purchased and received within the last 30 days' 
      });
    }

    // Check if already reviewed
    const [existingReviews] = await pool.execute(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingReviews.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Check if user is trusted (5+ approved reviews)
    const [userStats] = await pool.execute(
      'SELECT COUNT(*) as approved_reviews FROM reviews WHERE user_id = ? AND is_approved = TRUE',
      [userId]
    );

    const isTrustedReviewer = userStats[0].approved_reviews >= 5;
    const isAutoApproved = isTrustedReviewer || req.user.role === 'admin';

    const [result] = await pool.execute(
      'INSERT INTO reviews (user_id, product_id, rating, title, comment, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, productId, rating, title, comment, isAutoApproved]
    );

    // Update product average rating
    await updateProductRating(productId);

    res.status(201).json({ 
      message: isAutoApproved ? 'Review submitted successfully' : 'Review submitted and pending approval',
      reviewId: result.insertId,
      is_approved: isAutoApproved
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, title } = req.body;
    const userId = req.user.id;

    const [reviews] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // If review was approved, unapprove it for moderation
    const wasApproved = reviews[0].is_approved;
    
    await pool.execute(
      'UPDATE reviews SET rating = ?, title = ?, comment = ?, is_approved = ?, updated_at = NOW() WHERE id = ?',
      [rating, title, comment, false, id]
    );

    // Update product average rating
    await updateProductRating(reviews[0].product_id);

    res.json({ 
      message: wasApproved ? 
        'Review updated and sent for re-approval' : 
        'Review updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [reviews] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = reviews[0].product_id;

    await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);

    // Update product average rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// // Admin/Seller moderation endpoints
// export const getPendingReviews = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     let query, params;

//     if (req.user.role === 'admin') {
//       query = `
//         SELECT r.*, u.username, p.name as product_name, s.user_id as seller_id
//         FROM reviews r
//         JOIN users u ON r.user_id = u.id
//         JOIN products p ON r.product_id = p.id
//         LEFT JOIN sellers s ON p.user_id = s.user_id
//         WHERE r.is_approved = FALSE
//         ORDER BY r.created_at DESC
//         LIMIT ? OFFSET ?
//       `;
//       params = [parseInt(limit), offset];
//     } else {
//       // Seller can only see reviews for their products
//       query = `
//         SELECT r.*, u.username, p.name as product_name
//         FROM reviews r
//         JOIN users u ON r.user_id = u.id
//         JOIN products p ON r.product_id = p.id
//         WHERE r.is_approved = FALSE AND p.user_id = ?
//         ORDER BY r.created_at DESC
//         LIMIT ? OFFSET ?
//       `;
//       params = [userId, parseInt(limit), offset];
//     }

//     const [reviews] = await pool.execute(query, params);

//     res.json({ reviews });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


export const getPendingReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    console.log('Fetching pending reviews for user:', userId, 'role:', req.user.role);

    let query, params;

    if (req.user.role === 'admin') {
      query = `
        SELECT 
          r.*, 
          u.username, 
          u.email,
          p.name as product_name,
          p.seller_id
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN products p ON r.product_id = p.id
        WHERE r.is_approved = FALSE
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      params = [parseInt(limit), offset];
    } else {
      // Seller can only see reviews for their products
      query = `
        SELECT 
          r.*, 
          u.username, 
          u.email,
          p.name as product_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN products p ON r.product_id = p.id
        WHERE r.is_approved = FALSE AND p.seller_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      params = [userId, parseInt(limit), offset];
    }

    console.log('Executing query:', query);
    console.log('With params:', params);

    const [reviews] = await pool.execute(query, params);

    console.log('Found reviews:', reviews.length);

    res.json({ 
      success: true,
      reviews: reviews || []
    });
  } catch (error) {
    console.error('Error in getPendingReviews:', error);
    console.error('SQL Error details:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};



export const testReviewsEndpoint = async (req, res) => {
  try {
    console.log('Testing reviews endpoint...');
    
    // Simple test query to check if reviews table exists
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM reviews');
    
    console.log('Reviews table test result:', result);
    
    res.json({ 
      success: true,
      message: 'Reviews endpoint is working',
      reviewCount: result[0].count
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Test failed', 
      error: error.message 
    });
  }
};



export const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const moderatorId = req.user.id;

    const [reviews] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [id]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (action === 'approve') {
      await pool.execute(
        'UPDATE reviews SET is_approved = TRUE, moderated_by = ?, moderated_at = NOW() WHERE id = ?',
        [moderatorId, id]
      );
      
      // Update product average rating
      await updateProductRating(reviews[0].product_id);
      
      res.json({ message: 'Review approved successfully' });
    } else if (action === 'reject') {
      await pool.execute(
        'UPDATE reviews SET is_approved = FALSE, moderated_by = ?, moderated_at = NOW() WHERE id = ?',
        [moderatorId, id]
      );
      res.json({ message: 'Review rejected' });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  const [stats] = await pool.execute(`
    SELECT 
      AVG(rating) as average_rating,
      COUNT(*) as review_count
    FROM reviews 
    WHERE product_id = ? AND is_approved = TRUE
  `, [productId]);

  await pool.execute(
    'UPDATE products SET average_rating = ?, review_count = ? WHERE id = ?',
    [stats[0].average_rating || 0, stats[0].review_count || 0, productId]
  );
}