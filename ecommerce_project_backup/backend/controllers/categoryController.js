// backend/controllers/categoryController.js
import pool from '../config/database.js';

export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_published = TRUE) as product_count
       FROM categories c
       WHERE c.parent_id IS NULL
       ORDER BY c.name`
    );

    // Get subcategories for each category
    for (let category of categories) {
      const [subcategories] = await pool.execute(
        `SELECT s.*, 
                (SELECT COUNT(*) FROM products WHERE category_id = s.id AND is_published = TRUE) as product_count
         FROM categories s
         WHERE s.parent_id = ?
         ORDER BY s.name`,
        [category.id]
      );
      category.subcategories = subcategories;
    }

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get subcategories if it's a parent category
    const [subcategories] = await pool.execute(
      'SELECT * FROM categories WHERE parent_id = ? ORDER BY name',
      [id]
    );

    // Get products in this category
    const [products] = await pool.execute(
      `SELECT p.*, 
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM products p
       WHERE p.category_id = ? AND p.is_published = TRUE
       ORDER BY p.created_at DESC`,
      [id]
    );

    res.json({
      ...categories[0],
      subcategories,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, parent_id, image_url } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, parent_id, image_url) VALUES (?, ?, ?, ?)',
      [name, description, parent_id || null, image_url]
    );

    res.status(201).json({ 
      message: 'Category created successfully',
      categoryId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent_id, image_url } = req.body;

    const [result] = await pool.execute(
      'UPDATE categories SET name = ?, description = ?, parent_id = ?, image_url = ? WHERE id = ?',
      [name, description, parent_id, image_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const [products] = await pool.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );

    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products' 
      });
    }

    // Check if category has subcategories
    const [subcategories] = await pool.execute(
      'SELECT COUNT(*) as count FROM categories WHERE parent_id = ?',
      [id]
    );

    if (subcategories[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing subcategories' 
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};