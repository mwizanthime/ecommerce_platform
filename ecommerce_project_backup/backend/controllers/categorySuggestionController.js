// backend/controllers/categorySuggestionController.js
import pool from '../config/database.js';

export const suggestCategory = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    const suggested_by = req.user.id;

    // Check if category with same name already exists
    const [existingCategories] = await pool.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existingCategories.length > 0) {
      return res.status(400).json({ 
        message: 'A category with this name already exists' 
      });
    }

    // Check if pending suggestion with same name already exists
    const [existingSuggestions] = await pool.execute(
      'SELECT id FROM category_suggestions WHERE name = ? AND status = "pending"',
      [name]
    );

    if (existingSuggestions.length > 0) {
      return res.status(400).json({ 
        message: 'A pending suggestion with this name already exists' 
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO category_suggestions (name, description, parent_id, suggested_by) VALUES (?, ?, ?, ?)',
      [name, description, parent_id || null, suggested_by]
    );

    res.status(201).json({ 
      message: 'Category suggestion submitted successfully. It will be reviewed by an administrator.',
      suggestionId: result.insertId
    });
  } catch (error) {
    console.error('Error suggesting category:', error);
    res.status(500).json({ 
      message: 'Server error submitting suggestion', 
      error: error.message 
    });
  }
};

// export const getCategorySuggestions = async (req, res) => {
//   try {
//     const { status } = req.query;
//     const userId = req.user.id;
//     const role = req.user.role;

//     let query = `
//       SELECT cs.*, 
//              u.username as suggested_by_name,
//              u.email as suggested_by_email,
//              c.name as parent_name
//       FROM category_suggestions cs
//       LEFT JOIN users u ON cs.suggested_by = u.id
//       LEFT JOIN categories c ON cs.parent_id = c.id
//     `;

//     const params = [];

//     // Sellers can only see their own suggestions
//     if (role === 'seller') {
//       query += ' WHERE cs.suggested_by = ?';
//       params.push(userId);
//     } else if (status) {
//       query += ' WHERE cs.status = ?';
//       params.push(status);
//     }

//     query += ' ORDER BY cs.created_at DESC';

//     const [suggestions] = await pool.execute(query, params);

//     res.json({ 
//       success: true,
//       suggestions 
//     });
//   } catch (error) {
//     console.error('Error fetching category suggestions:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error fetching suggestions', 
//       error: error.message 
//     });
//   }
// };

// backend/controllers/categorySuggestionController.js
export const getCategorySuggestions = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;
    const role = req.user.role;

    let query = `
      SELECT cs.*, 
             u.username as suggested_by_name,
             u.email as suggested_by_email,
             c.name as parent_name
      FROM category_suggestions cs
      LEFT JOIN users u ON cs.suggested_by = u.id
      LEFT JOIN categories c ON cs.parent_id = c.id
    `;

    const params = [];

    // Handle different user roles
    if (role === 'seller') {
      // Sellers can only see their own suggestions
      query += ' WHERE cs.suggested_by = ?';
      params.push(userId);
      
      // Sellers can filter by status for their own suggestions
      if (status) {
        query += ' AND cs.status = ?';
        params.push(status);
      }
    } else if (role === 'admin') {
      // Admins can see ALL suggestions
      if (status) {
        query += ' WHERE cs.status = ?';
        params.push(status);
      }
      // If no status filter, admins see all suggestions (no WHERE clause)
    }

    query += ' ORDER BY cs.created_at DESC';

    const [suggestions] = await pool.execute(query, params);

    console.log(`Fetched ${suggestions.length} suggestions for ${role} user ${userId}`);
    
    res.json({ 
      success: true,
      suggestions 
    });
  } catch (error) {
    console.error('Error fetching category suggestions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching suggestions', 
      error: error.message 
    });
  }
};




// Add this to your categorySuggestionController.js
export const getAdminCategorySuggestions = async (req, res) => {
  try {
    const { status, limit } = req.query;
    
    let query = `
      SELECT cs.*, 
             u.username as suggested_by_name,
             u.email as suggested_by_email,
             c.name as parent_name
      FROM category_suggestions cs
      LEFT JOIN users u ON cs.suggested_by = u.id
      LEFT JOIN categories c ON cs.parent_id = c.id
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE cs.status = ?';
      params.push(status);
    }

    query += ' ORDER BY cs.created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [suggestions] = await pool.execute(query, params);

    console.log(`Admin fetched ${suggestions.length} suggestions with status: ${status || 'all'}`);
    
    res.json({ 
      success: true,
      suggestions 
    });
  } catch (error) {
    console.error('Error fetching admin category suggestions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching admin suggestions', 
      error: error.message 
    });
  }
};



export const updateSuggestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    const adminId = req.user.id;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"' 
      });
    }

    // Check if suggestion exists
    const [suggestions] = await pool.execute(
      'SELECT * FROM category_suggestions WHERE id = ?',
      [id]
    );

    if (suggestions.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Category suggestion not found' 
      });
    }

    const suggestion = suggestions[0];

    // If approving, create the actual category
    let categoryId = null;
    if (status === 'approved') {
      // Check if category already exists (in case of race condition)
      const [existingCategories] = await pool.execute(
        'SELECT id FROM categories WHERE name = ?',
        [suggestion.name]
      );

      if (existingCategories.length === 0) {
        const [categoryResult] = await pool.execute(
          'INSERT INTO categories (name, description, parent_id) VALUES (?, ?, ?)',
          [suggestion.name, suggestion.description, suggestion.parent_id]
        );
        categoryId = categoryResult.insertId;
      } else {
        categoryId = existingCategories[0].id;
      }
    }

    // Update suggestion status
    await pool.execute(
      'UPDATE category_suggestions SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, admin_notes, id]
    );

    res.json({ 
      success: true,
      message: `Category suggestion ${status} successfully`,
      categoryId: status === 'approved' ? categoryId : null
    });

  } catch (error) {
    console.error('Error updating suggestion status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating suggestion', 
      error: error.message 
    });
  }
};

export const deleteSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    let query = 'DELETE FROM category_suggestions WHERE id = ?';
    const params = [id];

    // Sellers can only delete their own pending suggestions
    if (role === 'seller') {
      query += ' AND suggested_by = ? AND status = "pending"';
      params.push(userId);
    }

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Suggestion not found or you do not have permission to delete it' 
      });
    }

    res.json({ 
      success: true,
      message: 'Suggestion deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting suggestion', 
      error: error.message 
    });
  }
};