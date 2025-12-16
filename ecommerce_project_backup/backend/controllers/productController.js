// // backend/controllers/productController.js
// import pool from '../config/database.js';

// // // export const getProducts = async (req, res) => {
// // //   try {
// // //     const {
// // //       page = 1,
// // //       limit = 12,
// // //       category,
// // //       search,
// // //       minPrice,
// // //       maxPrice,
// // //       sortBy = 'created_at',
// // //       sortOrder = 'DESC',
// // //       featured
// // //     } = req.query;


// // //      console.log('Search query received:', search); // Add this line
// // //     console.log('All query params:', req.query); // Add this line

// // //     let query = `
// // //       SELECT p.*, 
// // //              c.name as category_name,
// // //              u.username as seller_name,
// // //              AVG(r.rating) as average_rating,
// // //              COUNT(r.id) as review_count,
// // //              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
// // //       FROM products p
// // //       LEFT JOIN categories c ON p.category_id = c.id
// // //       LEFT JOIN users u ON p.seller_id = u.id
// // //       LEFT JOIN reviews r ON p.id = r.product_id
// // //       WHERE p.is_published = TRUE
// // //     `;
// // //     const params = [];

// // //     if (category) {
// // //       query += ' AND p.category_id = ?';
// // //       params.push(category);
// // //     }

// // //     if (search) {
// // //       query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
// // //       params.push(`%${search}%`, `%${search}%`);
// // //     }

// // //     if (minPrice) {
// // //       query += ' AND p.price >= ?';
// // //       params.push(minPrice);
// // //     }

// // //     if (maxPrice) {
// // //       query += ' AND p.price <= ?';
// // //       params.push(maxPrice);
// // //     }

// // //     if (featured) {
// // //       query += ' AND p.is_featured = TRUE';
// // //     }

// // //     query += ` GROUP BY p.id ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
// // //     const offset = (page - 1) * limit;
// // //     params.push(parseInt(limit), offset);

// // //     const [products] = await pool.execute(query, params);

// // //     // Get total count for pagination
// // //     let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.is_published = TRUE';
// // //     const countParams = [];

// // //     if (category) {
// // //       countQuery += ' AND p.category_id = ?';
// // //       countParams.push(category);
// // //     }

// // //     const [countResult] = await pool.execute(countQuery, countParams);
// // //     const total = countResult[0].total;

// // //     res.json({
// // //       products,
// // //       pagination: {
// // //         page: parseInt(page),
// // //         limit: parseInt(limit),
// // //         total,
// // //         pages: Math.ceil(total / limit)
// // //       }
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Server error', error: error.message });
// // //   }
// // // };
// // // backend/controllers/productController.js - Fix the getProducts function
// // export const getProducts = async (req, res) => {
// //   try {
// //     const {
// //       page = 1,
// //       limit = 12,
// //       category,
// //       search,
// //       minPrice,
// //       maxPrice,
// //       sortBy = 'created_at',
// //       sortOrder = 'DESC',
// //       featured
// //     } = req.query;

// //     console.log('Search query received:', search); // Debug log

// //     let query = `
// //       SELECT p.*, 
// //              c.name as category_name,
// //              u.username as seller_name,
// //              AVG(r.rating) as average_rating,
// //              COUNT(r.id) as review_count,
// //              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
// //       FROM products p
// //       LEFT JOIN categories c ON p.category_id = c.id
// //       LEFT JOIN users u ON p.seller_id = u.id
// //       LEFT JOIN reviews r ON p.id = r.product_id
// //       WHERE p.is_published = TRUE
// //     `;
// //     const params = [];

// //     if (category) {
// //       query += ' AND p.category_id = ?';
// //       params.push(category);
// //     }

// //     if (search) {
// //       query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
// //       const searchTerm = `%${search}%`;
// //       params.push(searchTerm, searchTerm, searchTerm);
// //     }

// //     if (minPrice) {
// //       query += ' AND p.price >= ?';
// //       params.push(minPrice);
// //     }

// //     if (maxPrice) {
// //       query += ' AND p.price <= ?';
// //       params.push(maxPrice);
// //     }

// //     if (featured) {
// //       query += ' AND p.is_featured = TRUE';
// //     }

// //     query += ` GROUP BY p.id ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
// //     const offset = (page - 1) * limit;
// //     params.push(parseInt(limit), offset);

// //     console.log('Final SQL query:', query); // Debug log
// //     console.log('Query params:', params); // Debug log

// //     const [products] = await pool.execute(query, params);

// //     // Get total count for pagination
// //     let countQuery = `
// //       SELECT COUNT(DISTINCT p.id) as total 
// //       FROM products p
// //       LEFT JOIN categories c ON p.category_id = c.id
// //       WHERE p.is_published = TRUE
// //     `;
// //     const countParams = [];

// //     if (category) {
// //       countQuery += ' AND p.category_id = ?';
// //       countParams.push(category);
// //     }

// //     if (search) {
// //       countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
// //       const searchTerm = `%${search}%`;
// //       countParams.push(searchTerm, searchTerm, searchTerm);
// //     }

// //     const [countResult] = await pool.execute(countQuery, countParams);
// //     const total = countResult[0].total;

// //     console.log('Products found:', products.length); // Debug log

// //     res.json({
// //       products,
// //       pagination: {
// //         page: parseInt(page),
// //         limit: parseInt(limit),
// //         total,
// //         pages: Math.ceil(total / limit)
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error in getProducts:', error);
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // };

// export const getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 12,
//       category,
//       search,
//       minPrice,
//       maxPrice,
//       sortBy = 'created_at',
//       sortOrder = 'DESC',
//       featured
//     } = req.query;

//     let query = `
//       SELECT p.*, 
//              c.name as category_name,
//              u.username as seller_name,
//              AVG(r.rating) as average_rating,
//              COUNT(r.id) as review_count,
//              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN users u ON p.seller_id = u.id
//       LEFT JOIN reviews r ON p.id = r.product_id
//       WHERE 1=1
//     `;
//     const params = [];

//     // For sellers, only show their products
//     if (req.user && req.user.role === 'seller') {
//       query += ' AND p.seller_id = ?';
//       params.push(req.user.id);
//     } else {
//       // For customers, only show published products
//       query += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       query += ' AND p.category_id = ?';
//       params.push(category);
//     }

//     if (search) {
//       query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       params.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (minPrice) {
//       query += ' AND p.price >= ?';
//       params.push(minPrice);
//     }

//     if (maxPrice) {
//       query += ' AND p.price <= ?';
//       params.push(maxPrice);
//     }

//     if (featured) {
//       query += ' AND p.is_featured = TRUE';
//     }

//     query += ` GROUP BY p.id ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
//     const offset = (page - 1) * limit;
//     params.push(parseInt(limit), offset);

//     const [products] = await pool.execute(query, params);

//     // Get total count for pagination
//     let countQuery = `
//       SELECT COUNT(DISTINCT p.id) as total 
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       WHERE 1=1
//     `;
//     const countParams = [];

//     if (req.user && req.user.role === 'seller') {
//       countQuery += ' AND p.seller_id = ?';
//       countParams.push(req.user.id);
//     } else {
//       countQuery += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       countQuery += ' AND p.category_id = ?';
//       countParams.push(category);
//     }

//     if (search) {
//       countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       countParams.push(searchTerm, searchTerm, searchTerm);
//     }

//     const [countResult] = await pool.execute(countQuery, countParams);
//     const total = countResult[0].total;

//     res.json({
//       products,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error in getProducts:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [products] = await pool.execute(
//       `SELECT p.*, 
//               c.name as category_name,
//               u.username as seller_name,
//               AVG(r.rating) as average_rating,
//               COUNT(r.id) as review_count
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN reviews r ON p.id = r.product_id
//        WHERE p.id = ?
//        GROUP BY p.id`,
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Get product images
//     const [images] = await pool.execute(
//       'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC',
//       [id]
//     );

//     // Get related products
//     const [relatedProducts] = await pool.execute(
//       `SELECT p.*, 
//               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
//        FROM products p
//        WHERE p.category_id = ? AND p.id != ? AND p.is_published = TRUE
//        LIMIT 4`,
//       [products[0].category_id, id]
//     );

//     res.json({
//       ...products[0],
//       images,
//       related_products: relatedProducts
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // export const createProduct = async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       description,
// //       price,
// //       compare_price,
// //       cost_per_item,
// //       category_id,
// //       sku,
// //       barcode,
// //       track_quantity,
// //       quantity,
// //       is_published,
// //       is_featured,
// //       requires_shipping,
// //       weight,
// //       seo_title,
// //       seo_description
// //     } = req.body;

// //     const [result] = await pool.execute(
// //       `INSERT INTO products (
// //         name, description, price, compare_price, cost_per_item, category_id, seller_id,
// //         sku, barcode, track_quantity, quantity, is_published, is_featured,
// //         requires_shipping, weight, seo_title, seo_description
// //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// //       [
// //         name, description, price, compare_price, cost_per_item, category_id, req.user.id,
// //         sku, barcode, track_quantity, quantity, is_published, is_featured,
// //         requires_shipping, weight, seo_title, seo_description
// //       ]
// //     );

// //     // Handle image uploads
// //     if (req.files && req.files.length > 0) {
// //       const imageValues = req.files.map((file, index) => [
// //         result.insertId,
// //         `/uploads/${file.filename}`,
// //         index === 0 // First image is primary
// //       ]);
      
// //       await pool.execute(
// //         'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?',
// //         [imageValues]
// //       );
// //     }

// //     res.status(201).json({
// //       message: 'Product created successfully',
// //       productId: result.insertId
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // };


// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       compare_price,
//       cost_per_item,
//       category_id,
//       sku,
//       barcode,
//       track_quantity,
//       quantity,
//       is_published,
//       is_featured,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     // Validate required fields
//     if (!name || !price || !category_id) {
//       return res.status(400).json({ 
//         message: 'Name, price, and category are required fields' 
//       });
//     }

//     const [result] = await pool.execute(
//       `INSERT INTO products (
//         name, description, price, compare_price, cost_per_item, category_id, seller_id,
//         sku, barcode, track_quantity, quantity, is_published, is_featured,
//         requires_shipping, weight, seo_title, seo_description
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         name, 
//         description || '', 
//         parseFloat(price) || 0,
//         compare_price ? parseFloat(compare_price) : null,
//         cost_per_item ? parseFloat(cost_per_item) : null,
//         category_id,
//         req.user.id,
//         sku || '',
//         barcode || '',
//         track_quantity ? 1 : 0,
//         parseInt(quantity) || 0,
//         is_published ? 1 : 0,
//         is_featured ? 1 : 0,
//         requires_shipping ? 1 : 0,
//         weight ? parseFloat(weight) : null,
//         seo_title || '',
//         seo_description || ''
//       ]
//     );

//     // Handle image uploads
//     if (req.files && req.files.length > 0) {
//       const imageValues = req.files.map((file, index) => [
//         result.insertId,
//         `/uploads/${file.filename}`,
//         index === 0 // First image is primary
//       ]);
      
//       await pool.execute(
//         `INSERT INTO product_images (product_id, image_url, is_primary) VALUES
//          ?`,
//         [imageValues]
//       );
//     }

//     res.status(201).json({
//       message: 'Product created successfully',
//       productId: result.insertId
//     });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       description,
//       price,
//       compare_price,
//       cost_per_item,
//       category_id,
//       sku,
//       barcode,
//       track_quantity,
//       quantity,
//       is_published,
//       is_featured,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     // Check if product exists and user has permission
//     const [products] = await pool.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const [result] = await pool.execute(
//       `UPDATE products SET 
//         name = ?, description = ?, price = ?, compare_price = ?, cost_per_item = ?, 
//         category_id = ?, sku = ?, barcode = ?, track_quantity = ?, quantity = ?,
//         is_published = ?, is_featured = ?, requires_shipping = ?, weight = ?,
//         seo_title = ?, seo_description = ?, updated_at = CURRENT_TIMESTAMP
//       WHERE id = ?`,
//       [
//         name, description, price, compare_price, cost_per_item, category_id,
//         sku, barcode, track_quantity, quantity, is_published, is_featured,
//         requires_shipping, weight, seo_title, seo_description, id
//       ]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.json({ message: 'Product updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if product exists and user has permission
//     const [products] = await pool.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Delete product images first (due to foreign key constraint)
//     await pool.execute('DELETE FROM product_images WHERE product_id = ?', [id]);

//     // Delete product
//     const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const uploadProductImages = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if product exists and user has permission
//     const [products] = await pool.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'No files uploaded' });
//     }

//     // Insert new images
//     const imageValues = req.files.map(file => [
//       id,
//       `/uploads/${file.filename}`,
//       false // Not primary by default
//     ]);

//     await pool.execute(
//       'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?',
//       [imageValues]
//     );

//     res.json({ message: 'Images uploaded successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };




// // // backend/controllers/productController.js
// // import pool from '../config/database.js';





// // New function for stock adjustment
// export const adjustStock = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { adjustment, reason } = req.body;

//     // Validate adjustment
//     if (!adjustment || isNaN(adjustment)) {
//       return res.status(400).json({ message: 'Valid adjustment value is required' });
//     }

//     // Check if product exists and user has permission
//     const [products] = await pool.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Calculate new quantity
//     const newQuantity = product.quantity + parseInt(adjustment);

//     // Ensure quantity doesn't go negative
//     if (newQuantity < 0) {
//       return res.status(400).json({ 
//         message: 'Insufficient stock. Cannot remove more than available quantity.' 
//       });
//     }

//     // Update product quantity
//     await pool.execute(
//       'UPDATE products SET quantity = ? WHERE id = ?',
//       [newQuantity, id]
//     );

//     // Record stock adjustment in stock_history table
//     await pool.execute(
//       `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
//        VALUES (?, ?, ?, ?)`,
//       [id, adjustment, reason || 'Stock adjustment', req.user.id]
//     );

//     res.json({ 
//       message: 'Stock adjusted successfully',
//       newQuantity 
//     });
//   } catch (error) {
//     console.error('Error adjusting stock:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Add this to your routes


// // backend/controllers/productController.js
// import pool from '../config/database.js';
// import path from 'path';
// import fs from 'fs';

// export const getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 12,
//       category,
//       search,
//       minPrice,
//       maxPrice,
//       sortBy = 'created_at',
//       sortOrder = 'DESC',
//       featured
//     } = req.query;

//     let query = `
//       SELECT p.*, 
//              c.name as category_name,
//              u.username as seller_name,
//              AVG(r.rating) as average_rating,
//              COUNT(r.id) as review_count,
//              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN users u ON p.seller_id = u.id
//       LEFT JOIN reviews r ON p.id = r.product_id
//       WHERE 1=1
//     `;
//     const params = [];

//     // For sellers, only show their products
//     if (req.user && req.user.role === 'seller') {
//       query += ' AND p.seller_id = ?';
//       params.push(req.user.id);
//     } else {
//       // For customers, only show published products
//       query += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       query += ' AND p.category_id = ?';
//       params.push(category);
//     }

//     if (search) {
//       query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       params.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (minPrice) {
//       query += ' AND p.price >= ?';
//       params.push(minPrice);
//     }

//     if (maxPrice) {
//       query += ' AND p.price <= ?';
//       params.push(maxPrice);
//     }

//     if (featured) {
//       query += ' AND p.is_featured = TRUE';
//     }

//     query += ` GROUP BY p.id ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
//     const offset = (page - 1) * limit;
//     params.push(parseInt(limit), offset);

//     const [products] = await pool.execute(query, params);

//     // Get total count for pagination
//     let countQuery = `
//       SELECT COUNT(DISTINCT p.id) as total 
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       WHERE 1=1
//     `;
//     const countParams = [];

//     if (req.user && req.user.role === 'seller') {
//       countQuery += ' AND p.seller_id = ?';
//       countParams.push(req.user.id);
//     } else {
//       countQuery += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       countQuery += ' AND p.category_id = ?';
//       countParams.push(category);
//     }

//     if (search) {
//       countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       countParams.push(searchTerm, searchTerm, searchTerm);
//     }

//     const [countResult] = await pool.execute(countQuery, countParams);
//     const total = countResult[0].total;

//     res.json({
//       products,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error in getProducts:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [products] = await pool.execute(
//       `SELECT p.*, 
//               c.name as category_name,
//               u.username as seller_name,
//               AVG(r.rating) as average_rating,
//               COUNT(r.id) as review_count
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN reviews r ON p.id = r.product_id
//        WHERE p.id = ?
//        GROUP BY p.id`,
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Get product images
//     const [images] = await pool.execute(
//       'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC',
//       [id]
//     );

//     res.json({
//       ...products[0],
//       images
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const createProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const {
//       name,
//       description,
//       price,
//       compare_price,
//       cost_per_item,
//       category_id,
//       sku,
//       barcode,
//       track_quantity,
//       quantity,
//       is_published,
//       is_featured,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     // Validate required fields
//     if (!name || !price || !category_id) {
//       return res.status(400).json({ 
//         message: 'Name, price, and category are required fields' 
//       });
//     }

//     // Check if product name already exists for this seller
//     const [existingProducts] = await connection.execute(
//       'SELECT id FROM products WHERE name = ? AND seller_id = ?',
//       [name, req.user.id]
//     );

//     if (existingProducts.length > 0) {
//       
//       return res.status(400).json({ 
//         message: 'A product with this name already exists. Please choose a different name.' 
//       });
//     }

//     // Insert product
//     const [result] = await connection.execute(
//       `INSERT INTO products (
//         name, description, price, compare_price, cost_per_item, category_id, seller_id,
//         sku, barcode, track_quantity, quantity, is_published, is_featured,
//         requires_shipping, weight, seo_title, seo_description
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         name.trim(),
//         description ? description.trim() : '',
//         parseFloat(price) || 0,
//         compare_price ? parseFloat(compare_price) : null,
//         cost_per_item ? parseFloat(cost_per_item) : null,
//         parseInt(category_id),
//         req.user.id,
//         sku ? sku.trim() : '',
//         barcode ? barcode.trim() : '',
//         track_quantity === 'true' || track_quantity === true ? 1 : 0,
//         parseInt(quantity) || 0,
//         is_published === 'true' || is_published === true ? 1 : 0,
//         is_featured === 'true' || is_featured === true ? 1 : 0,
//         requires_shipping === 'true' || requires_shipping === true ? 1 : 0,
//         weight ? parseFloat(weight) : null,
//         seo_title ? seo_title.trim() : '',
//         seo_description ? seo_description.trim() : ''
//       ]
//     );

//     const productId = result.insertId;

//     // Handle image uploads
//     if (req.files && req.files.length > 0) {
//       const imageValues = req.files.map((file, index) => [
//         productId,
//         `/uploads/${file.filename}`,
//         index === 0 ? 1 : 0 // First image is primary
//       ]);
      
//       await connection.execute(
//         'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?',
//         [imageValues]
//       );
//     }

//     

//     res.status(201).json({
//       message: 'Product created successfully',
//       productId: productId
//     });
//   } catch (error) {
//     
//     console.error('Error creating product:', error);
    
//     // Clean up uploaded files if product creation fails
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (unlinkError) {
//           console.error('Error deleting uploaded file:', unlinkError);
//         }
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Failed to create product', 
//       error: error.message 
//     });
//   } finally {
//     connection.release();
//   }
// };

// export const updateProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;
//     const {
//       name,
//       description,
//       price,
//       compare_price,
//       cost_per_item,
//       category_id,
//       sku,
//       barcode,
//       track_quantity,
//       quantity,
//       is_published,
//       is_featured,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     // Check if product exists and user has permission
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Check if product name already exists for this seller (excluding current product)
//     if (name && name !== product.name) {
//       const [existingProducts] = await connection.execute(
//         'SELECT id FROM products WHERE name = ? AND seller_id = ? AND id != ?',
//         [name, req.user.id, id]
//       );

//       if (existingProducts.length > 0) {
//         
//         return res.status(400).json({ 
//           message: 'A product with this name already exists. Please choose a different name.' 
//         });
//       }
//     }

//     // Update product
//     const [result] = await connection.execute(
//       `UPDATE products SET 
//         name = ?, description = ?, price = ?, compare_price = ?, cost_per_item = ?, 
//         category_id = ?, sku = ?, barcode = ?, track_quantity = ?, quantity = ?,
//         is_published = ?, is_featured = ?, requires_shipping = ?, weight = ?,
//         seo_title = ?, seo_description = ?, updated_at = CURRENT_TIMESTAMP
//       WHERE id = ?`,
//       [
//         name ? name.trim() : product.name,
//         description !== undefined ? description.trim() : product.description,
//         price ? parseFloat(price) : product.price,
//         compare_price !== undefined ? (compare_price ? parseFloat(compare_price) : null) : product.compare_price,
//         cost_per_item !== undefined ? (cost_per_item ? parseFloat(cost_per_item) : null) : product.cost_per_item,
//         category_id ? parseInt(category_id) : product.category_id,
//         sku !== undefined ? sku.trim() : product.sku,
//         barcode !== undefined ? barcode.trim() : product.barcode,
//         track_quantity !== undefined ? (track_quantity === 'true' || track_quantity === true ? 1 : 0) : product.track_quantity,
//         quantity ? parseInt(quantity) : product.quantity,
//         is_published !== undefined ? (is_published === 'true' || is_published === true ? 1 : 0) : product.is_published,
//         is_featured !== undefined ? (is_featured === 'true' || is_featured === true ? 1 : 0) : product.is_featured,
//         requires_shipping !== undefined ? (requires_shipping === 'true' || requires_shipping === true ? 1 : 0) : product.requires_shipping,
//         weight !== undefined ? (weight ? parseFloat(weight) : null) : product.weight,
//         seo_title !== undefined ? seo_title.trim() : product.seo_title,
//         seo_description !== undefined ? seo_description.trim() : product.seo_description,
//         id
//       ]
//     );

//     if (result.affectedRows === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Handle new image uploads
//     if (req.files && req.files.length > 0) {
//       const imageValues = req.files.map((file, index) => [
//         id,
//         `/uploads/${file.filename}`,
//         0 // Not primary by default for updates
//       ]);
      
//       await connection.execute(
//         'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?',
//         [imageValues]
//       );
//     }

//     

//     res.json({ 
//       message: 'Product updated successfully',
//       productId: id 
//     });
//   } catch (error) {
//     
//     console.error('Error updating product:', error);
    
//     // Clean up uploaded files if update fails
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (unlinkError) {
//           console.error('Error deleting uploaded file:', unlinkError);
//         }
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Failed to update product', 
//       error: error.message 
//     });
//   } finally {
//     connection.release();
//   }
// };

// export const deleteProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;

//     // Check if product exists and user has permission
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Get product images for cleanup
//     const [images] = await connection.execute(
//       'SELECT image_url FROM product_images WHERE product_id = ?',
//       [id]
//     );

//     // Delete product images first (due to foreign key constraint)
//     await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);

//     // Delete product
//     const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     

//     // Clean up image files from server
//     images.forEach(image => {
//       try {
//         if (image.image_url) {
//           const filePath = path.join(process.cwd(), image.image_url);
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//           }
//         }
//       } catch (unlinkError) {
//         console.error('Error deleting image file:', unlinkError);
//       }
//     });

//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     
//     console.error('Error deleting product:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   } finally {
//     connection.release();
//   }
// };

// export const adjustStock = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;
//     const { adjustment, reason } = req.body;

//     // Validate adjustment
//     if (!adjustment || isNaN(adjustment)) {
//       
//       return res.status(400).json({ message: 'Valid adjustment value is required' });
//     }

//     // Check if product exists and user has permission
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Calculate new quantity
//     const newQuantity = product.quantity + parseInt(adjustment);

//     // Ensure quantity doesn't go negative
//     if (newQuantity < 0) {
//       
//       return res.status(400).json({ 
//         message: 'Insufficient stock. Cannot remove more than available quantity.' 
//       });
//     }

//     // Update product quantity
//     await connection.execute(
//       'UPDATE products SET quantity = ? WHERE id = ?',
//       [newQuantity, id]
//     );

//     // Record stock adjustment in stock_history table
//     await connection.execute(
//       `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
//        VALUES (?, ?, ?, ?)`,
//       [id, adjustment, reason || 'Stock adjustment', req.user.id]
//     );

//     

//     res.json({ 
//       message: 'Stock adjusted successfully',
//       newQuantity 
//     });
//   } catch (error) {
//     
//     console.error('Error adjusting stock:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   } finally {
//     connection.release();
//   }
// };



// // backend/controllers/productController.js
// import pool from '../config/database.js';
// import path from 'path';
// import fs from 'fs';

// // export const getProducts = async (req, res) => {
// //   try {
// //     const {
// //       page = 1,
// //       limit = 12,
// //       category,
// //       search,
// //       minPrice,
// //       maxPrice,
// //       sortBy = 'created_at',
// //       sortOrder = 'DESC',
// //       featured
// //     } = req.query;

// //     let query = `
// //       SELECT p.*, 
// //              c.name as category_name,
// //              u.username as seller_name,
// //              AVG(r.rating) as average_rating,
// //              COUNT(r.id) as review_count,
// //              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
// //       FROM products p
// //       LEFT JOIN categories c ON p.category_id = c.id
// //       LEFT JOIN users u ON p.seller_id = u.id
// //       LEFT JOIN reviews r ON p.id = r.product_id
// //       WHERE 1=1
// //     `;
// //     const params = [];

// //     // For sellers, only show their products
// //     if (req.user && req.user.role === 'seller') {
// //       query += ' AND p.seller_id = ?';
// //       params.push(req.user.id);
// //     } else {
// //       // For customers, only show published products
// //       query += ' AND p.is_published = TRUE';
// //     }

// //     if (category) {
// //       query += ' AND p.category_id = ?';
// //       params.push(category);
// //     }

// //     if (search) {
// //       query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
// //       const searchTerm = `%${search}%`;
// //       params.push(searchTerm, searchTerm, searchTerm);
// //     }

// //     if (minPrice) {
// //       query += ' AND p.price >= ?';
// //       params.push(minPrice);
// //     }

// //     if (maxPrice) {
// //       query += ' AND p.price <= ?';
// //       params.push(maxPrice);
// //     }

// //     if (featured) {
// //       query += ' AND p.is_featured = TRUE';
// //     }

// //     query += ` GROUP BY p.id ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
// //     const offset = (page - 1) * limit;
// //     params.push(parseInt(limit), offset);

// //     const [products] = await pool.execute(query, params);

// //     // Get total count for pagination
// //     let countQuery = `
// //       SELECT COUNT(DISTINCT p.id) as total 
// //       FROM products p
// //       LEFT JOIN categories c ON p.category_id = c.id
// //       WHERE 1=1
// //     `;
// //     const countParams = [];

// //     if (req.user && req.user.role === 'seller') {
// //       countQuery += ' AND p.seller_id = ?';
// //       countParams.push(req.user.id);
// //     } else {
// //       countQuery += ' AND p.is_published = TRUE';
// //     }

// //     if (category) {
// //       countQuery += ' AND p.category_id = ?';
// //       countParams.push(category);
// //     }

// //     if (search) {
// //       countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
// //       const searchTerm = `%${search}%`;
// //       countParams.push(searchTerm, searchTerm, searchTerm);
// //     }

// //     const [countResult] = await pool.execute(countQuery, countParams);
// //     const total = countResult[0].total;
// // console.log('Products with images:', products.map(p => ({
// //   id: p.id,
// //   name: p.name,
// //   primary_image: p.primary_image,
// //   hasImage: !!p.primary_image
// // })));
// //     res.json({
// //       products,
// //       pagination: {
// //         page: parseInt(page),
// //         limit: parseInt(limit),
// //         total,
// //         pages: Math.ceil(total / limit)
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error in getProducts:', error);
// //     res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // };



// export const getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit=8,
//       category,
//       search,
//       minPrice,
//       maxPrice,
//       sortBy = 'created_at',
//       sortOrder = 'DESC',
//       featured
//     } = req.query;

//     console.log('=== GET PRODUCTS - INCLUDING PRODUCTS WITHOUT IMAGES ===');

//     // Simplified query that definitely returns all products
//     let query = `
//       SELECT 
//         p.*, 
//         c.name as category_name,
//         u.username as seller_name,
//         COALESCE(AVG(r.rating), 0) as average_rating,
//         COUNT(r.id) as review_count,
//         pi.image_url as primary_image
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN users u ON p.seller_id = u.id
//       LEFT JOIN reviews r ON p.id = r.product_id
//       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//       WHERE 1=1
//     `;
//     const params = [];

//     // For sellers, only show their products
//     if (req.user && req.user.role === 'seller') {
//       query += ' AND p.seller_id = ?';
//       params.push(req.user.id);
//     } else {
//       // For customers, only show published products
//       query += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       query += ' AND p.category_id = ?';
//       params.push(category);
//     }

//     if (search) {
//       query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       params.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (minPrice) {
//       query += ' AND p.price >= ?';
//       params.push(parseFloat(minPrice));
//     }

//     if (maxPrice) {
//       query += ' AND p.price <= ?';
//       params.push(parseFloat(maxPrice));
//     }

//     if (featured) {
//       query += ' AND p.is_featured = TRUE';
//     }

//     // Group by product ID only (simpler)
//     query += ` GROUP BY p.id`;

//     // Add sorting
//     const validSortColumns = ['name', 'price', 'created_at', 'updated_at'];
//     const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
//     const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
//     query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

//     // Add pagination
//     const offset = (page - 1) * limit;
//     query += ' LIMIT ? OFFSET ?';
//     params.push(parseInt(limit), offset);

//     console.log('Query:', query);
//     console.log('Params:', params);

//     const [products] = await pool.execute(query, params);

//     // Get total count
//     let countQuery = `
//       SELECT COUNT(*) as total 
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       WHERE 1=1
//     `;
//     const countParams = [];

//     if (req.user && req.user.role === 'seller') {
//       countQuery += ' AND p.seller_id = ?';
//       countParams.push(req.user.id);
//     } else {
//       countQuery += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       countQuery += ' AND p.category_id = ?';
//       countParams.push(category);
//     }

//     if (search) {
//       countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       countParams.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (minPrice) {
//       countQuery += ' AND p.price >= ?';
//       countParams.push(parseFloat(minPrice));
//     }

//     if (maxPrice) {
//       countQuery += ' AND p.price <= ?';
//       countParams.push(parseFloat(maxPrice));
//     }

//     if (featured) {
//       countQuery += ' AND p.is_featured = TRUE';
//     }

//     const [countResult] = await pool.execute(countQuery, countParams);
//     const total = countResult[0].total;

//     // Debug: Show exactly what we're returning
//     console.log(`Returning ${products.length} products (with and without images):`);
//     products.forEach(p => {
//       console.log(`- ID: ${p.id}, Name: "${p.name}", Image: ${p.primary_image ? 'YES' : 'NO'}`);
//     });

//     // Format image URLs before sending
//     const formattedProducts = products.map(product => ({
//       ...product,
//       // Ensure primary_image is properly formatted or set to placeholder
//       primary_image: product.primary_image 
//         ? formatImageUrl(product.primary_image)
//         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//     }));

//     res.json({
//       products: formattedProducts,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error in getProducts:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Add this helper function at the top of your file
// const formatImageUrl = (imagePath) => {
//   if (!imagePath) return null;
  
//   if (imagePath.startsWith('http')) {
//     return imagePath;
//   }
  
//   if (imagePath.startsWith('/uploads/')) {
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//   }
  
//   // If it's just a filename without path
//   if (!imagePath.includes('/')) {
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//   }
  
//   return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
// };


// export const getProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [products] = await pool.execute(
//       `SELECT p.*, 
//               c.name as category_name,
//               u.username as seller_name,
//               AVG(r.rating) as average_rating,
//               COUNT(r.id) as review_count
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN reviews r ON p.id = r.product_id
//        WHERE p.id = ?
//        GROUP BY p.id`,
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Get product images
//     const [images] = await pool.execute(
//       'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC',
//       [id]
//     );

//     res.json({
//       ...products[0],
//       images
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const createProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const {
//       name,
//       description,
//       price,
//       compare_price,
//       cost_per_item,
//       category_id,
//       sku,
//       barcode,
//       track_quantity,
//       quantity,
//       is_published,
//       is_featured,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     // Validate required fields
//     if (!name || !price || !category_id) {
//       
//       return res.status(400).json({ 
//         message: 'Name, price, and category are required fields' 
//       });
//     }

//     // Check if product name already exists for this seller
//     const [existingProducts] = await connection.execute(
//       'SELECT id FROM products WHERE name = ? AND seller_id = ?',
//       [name, req.user.id]
//     );

//     if (existingProducts.length > 0) {
//       
//       return res.status(400).json({ 
//         message: 'A product with this name already exists. Please choose a different name.' 
//       });
//     }

//     // Insert product
//     const [result] = await connection.execute(
//       `INSERT INTO products (
//         name, description, price, compare_price, cost_per_item, category_id, seller_id,
//         sku, barcode, track_quantity, quantity, is_published, is_featured,
//         requires_shipping, weight, seo_title, seo_description
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         name.trim(),
//         description ? description.trim() : '',
//         parseFloat(price) || 0,
//         compare_price ? parseFloat(compare_price) : null,
//         cost_per_item ? parseFloat(cost_per_item) : null,
//         parseInt(category_id),
//         req.user.id,
//         sku ? sku.trim() : '',
//         barcode ? barcode.trim() : '',
//         track_quantity === 'true' || track_quantity === true ? 1 : 0,
//         parseInt(quantity) || 0,
//         is_published === 'true' || is_published === true ? 1 : 0,
//         is_featured === 'true' || is_featured === true ? 1 : 0,
//         requires_shipping === 'true' || requires_shipping === true ? 1 : 0,
//         weight ? parseFloat(weight) : null,
//         seo_title ? seo_title.trim() : '',
//         seo_description ? seo_description.trim() : ''
//       ]
//     );

//     const productId = result.insertId;

//     // Handle image uploads - FIXED: Use individual inserts instead of bulk insert
//     if (req.files && req.files.length > 0) {
//       for (let i = 0; i < req.files.length; i++) {
//         const file = req.files[i];
//         const isPrimary = i === 0 ? 1 : 0; // First image is primary
        
//         await connection.execute(
//           'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
//           [productId, `/uploads/${file.filename}`, isPrimary]
//         );
//       }
//     }

//     

//     res.status(201).json({
//       message: 'Product created successfully',
//       productId: productId
//     });
//   } catch (error) {
//     
//     console.error('Error creating product:', error);
    
//     // Clean up uploaded files if product creation fails
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (unlinkError) {
//           console.error('Error deleting uploaded file:', unlinkError);
//         }
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Failed to create product', 
//       error: error.message 
//     });
//   } finally {
//     connection.release();
//   }
// };

// export const updateProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;
//     const {
//       name,
//       description,
//       price,
//       compare_price,
//       cost_per_item,
//       category_id,
//       sku,
//       barcode,
//       track_quantity,
//       quantity,
//       is_published,
//       is_featured,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     // Check if product exists and user has permission
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Check if product name already exists for this seller (excluding current product)
//     if (name && name !== product.name) {
//       const [existingProducts] = await connection.execute(
//         'SELECT id FROM products WHERE name = ? AND seller_id = ? AND id != ?',
//         [name, req.user.id, id]
//       );

//       if (existingProducts.length > 0) {
//         
//         return res.status(400).json({ 
//           message: 'A product with this name already exists. Please choose a different name.' 
//         });
//       }
//     }

//     // Update product
//     const [result] = await connection.execute(
//       `UPDATE products SET 
//         name = ?, description = ?, price = ?, compare_price = ?, cost_per_item = ?, 
//         category_id = ?, sku = ?, barcode = ?, track_quantity = ?, quantity = ?,
//         is_published = ?, is_featured = ?, requires_shipping = ?, weight = ?,
//         seo_title = ?, seo_description = ?, updated_at = CURRENT_TIMESTAMP
//       WHERE id = ?`,
//       [
//         name ? name.trim() : product.name,
//         description !== undefined ? description.trim() : product.description,
//         price ? parseFloat(price) : product.price,
//         compare_price !== undefined ? (compare_price ? parseFloat(compare_price) : null) : product.compare_price,
//         cost_per_item !== undefined ? (cost_per_item ? parseFloat(cost_per_item) : null) : product.cost_per_item,
//         category_id ? parseInt(category_id) : product.category_id,
//         sku !== undefined ? sku.trim() : product.sku,
//         barcode !== undefined ? barcode.trim() : product.barcode,
//         track_quantity !== undefined ? (track_quantity === 'true' || track_quantity === true ? 1 : 0) : product.track_quantity,
//         quantity ? parseInt(quantity) : product.quantity,
//         is_published !== undefined ? (is_published === 'true' || is_published === true ? 1 : 0) : product.is_published,
//         is_featured !== undefined ? (is_featured === 'true' || is_featured === true ? 1 : 0) : product.is_featured,
//         requires_shipping !== undefined ? (requires_shipping === 'true' || requires_shipping === true ? 1 : 0) : product.requires_shipping,
//         weight !== undefined ? (weight ? parseFloat(weight) : null) : product.weight,
//         seo_title !== undefined ? seo_title.trim() : product.seo_title,
//         seo_description !== undefined ? seo_description.trim() : product.seo_description,
//         id
//       ]
//     );

//     if (result.affectedRows === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Handle new image uploads - FIXED: Use individual inserts
//     if (req.files && req.files.length > 0) {
//       for (let i = 0; i < req.files.length; i++) {
//         const file = req.files[i];
        
//         await connection.execute(
//           'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
//           [id, `/uploads/${file.filename}`, 0] // Not primary by default for updates
//         );
//       }
//     }

//     

//     res.json({ 
//       message: 'Product updated successfully',
//       productId: id 
//     });
//   } catch (error) {
//     
//     console.error('Error updating product:', error);
    
//     // Clean up uploaded files if update fails
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         try {
//           fs.unlinkSync(file.path);
//         } catch (unlinkError) {
//           console.error('Error deleting uploaded file:', unlinkError);
//         }
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Failed to update product', 
//       error: error.message 
//     });
//   } finally {
//     connection.release();
//   }
// };

// export const deleteProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;

//     // Check if product exists and user has permission
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Get product images for cleanup
//     const [images] = await connection.execute(
//       'SELECT image_url FROM product_images WHERE product_id = ?',
//       [id]
//     );

//     // Delete product images first (due to foreign key constraint)
//     await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);

//     // Delete product
//     const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     

//     // Clean up image files from server
//     images.forEach(image => {
//       try {
//         if (image.image_url) {
//           const filePath = path.join(process.cwd(), image.image_url);
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//           }
//         }
//       } catch (unlinkError) {
//         console.error('Error deleting image file:', unlinkError);
//       }
//     });

//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     
//     console.error('Error deleting product:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   } finally {
//     connection.release();
//   }
// };

// export const adjustStock = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;
//     const { adjustment, reason } = req.body;

//     // Validate adjustment
//     if (!adjustment || isNaN(adjustment)) {
//       
//       return res.status(400).json({ message: 'Valid adjustment value is required' });
//     }

//     // Check if product exists and user has permission
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Check if user owns the product or is admin
//     if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
//       
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Calculate new quantity
//     const newQuantity = product.quantity + parseInt(adjustment);

//     // Ensure quantity doesn't go negative
//     if (newQuantity < 0) {
//       
//       return res.status(400).json({ 
//         message: 'Insufficient stock. Cannot remove more than available quantity.' 
//       });
//     }

//     // Update product quantity
//     await connection.execute(
//       'UPDATE products SET quantity = ? WHERE id = ?',
//       [newQuantity, id]
//     );

//     // Record stock adjustment in stock_history table
//     await connection.execute(
//       `INSERT INTO stock_history (product_id, adjustment, reason, created_by) 
//        VALUES (?, ?, ?, ?)`,
//       [id, adjustment, reason || 'Stock adjustment', req.user.id]
//     );

//     

//     res.json({ 
//       message: 'Stock adjusted successfully',
//       newQuantity 
//     });
//   } catch (error) {
//     
//     console.error('Error adjusting stock:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   } finally {
//     connection.release();
//   }
// };






// // backend/controllers/productController.js
// import pool from '../config/database.js';

// // Helper function to format image URLs
// const formatImageUrl = (imagePath) => {
//   if (!imagePath || imagePath === '/api/placeholder/300/300') {
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//   }

//   if (imagePath.startsWith('http')) {
//     return imagePath;
//   }

//   if (imagePath.startsWith('/uploads/')) {
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//   }

//   return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
// };

// export const getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 1000, // Set a very high default limit
//       category,
//       search,
//       minPrice,
//       maxPrice,
//       sortBy = 'created_at',
//       sortOrder = 'DESC',
//       featured
//     } = req.query;

//     console.log('=== GET PRODUCTS - HIGH LIMIT ===');

//     let query = `
//       SELECT 
//         p.*, 
//         c.name as category_name,
//         u.username as seller_name,
//         COALESCE(AVG(r.rating), 0) as average_rating,
//         COUNT(r.id) as review_count,
//         pi.image_url as primary_image
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN users u ON p.seller_id = u.id
//       LEFT JOIN reviews r ON p.id = r.product_id
//       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//       WHERE 1=1
//     `;
//     const params = [];

//     // For sellers, only show their products
//     if (req.user && req.user.role === 'seller') {
//       query += ' AND p.seller_id = ?';
//       params.push(req.user.id);
//     } else {
//       // For customers, only show published products
//       query += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       query += ' AND p.category_id = ?';
//       params.push(category);
//     }

//     if (search) {
//       query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       params.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (minPrice) {
//       query += ' AND p.price >= ?';
//       params.push(parseFloat(minPrice));
//     }

//     if (maxPrice) {
//       query += ' AND p.price <= ?';
//       params.push(parseFloat(maxPrice));
//     }

//     if (featured) {
//       query += ' AND p.is_featured = TRUE';
//     }

//     // Group by product ID
//     query += ` GROUP BY p.id`;

//     // Add sorting
//     const validSortColumns = ['name', 'price', 'created_at', 'updated_at', 'average_rating'];
//     const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
//     const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
//     query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

//     // Always use the limit (but it's set very high by default)
//     const offset = (page - 1) * limit;
//     query += ' LIMIT ? OFFSET ?';
//     params.push(parseInt(limit), offset);

//     console.log('Query:', query);
//     console.log('Params:', params);

//     const [products] = await pool.execute(query, params);

//     // Get total count for pagination info
//     let countQuery = `
//       SELECT COUNT(DISTINCT p.id) as total 
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN reviews r ON p.id = r.product_id
//       WHERE 1=1
//     `;
//     const countParams = [];

//     if (req.user && req.user.role === 'seller') {
//       countQuery += ' AND p.seller_id = ?';
//       countParams.push(req.user.id);
//     } else {
//       countQuery += ' AND p.is_published = TRUE';
//     }

//     if (category) {
//       countQuery += ' AND p.category_id = ?';
//       countParams.push(category);
//     }

//     if (search) {
//       countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
//       const searchTerm = `%${search}%`;
//       countParams.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (minPrice) {
//       countQuery += ' AND p.price >= ?';
//       countParams.push(parseFloat(minPrice));
//     }

//     if (maxPrice) {
//       countQuery += ' AND p.price <= ?';
//       countParams.push(parseFloat(maxPrice));
//     }

//     if (featured) {
//       countQuery += ' AND p.is_featured = TRUE';
//     }

//     const [countResult] = await pool.execute(countQuery, countParams);
//     const total = countResult[0].total;

//     // Debug: Show exactly what we're returning
//     console.log(`Returning ${products.length} products (with and without images):`);
//     products.forEach(p => {
//       console.log(`- ID: ${p.id}, Name: "${p.name}", Image: ${p.primary_image ? 'YES' : 'NO'}`);
//     });

//     // Format image URLs before sending
//     const formattedProducts = products.map(product => ({
//       ...product,
//       average_rating: parseFloat(product.average_rating) || 0,
//       review_count: parseInt(product.review_count) || 0,
//       price: parseFloat(product.price) || 0,
//       quantity: parseInt(product.quantity) || 0,
//       // Ensure primary_image is properly formatted or set to placeholder
//       primary_image: product.primary_image 
//         ? formatImageUrl(product.primary_image)
//         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//     }));

//     res.json({
//       products: formattedProducts,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error in getProducts:', error);
//     res.status(500).json({ 
//       message: 'Server error fetching products', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Other product controller functions you might have
// export const getProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Get product details
//     const [products] = await pool.execute(
//       `SELECT 
//         p.*, 
//         c.name as category_name,
//         u.username as seller_name,
//         u.email as seller_email,
//         COALESCE(AVG(r.rating), 0) as average_rating,
//         COUNT(r.id) as review_count
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN reviews r ON p.id = r.product_id
//        WHERE p.id = ?
//        GROUP BY p.id`,
//       [id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];

//     // Get product images
//     const [images] = await pool.execute(
//       'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, created_at ASC',
//       [id]
//     );

//     // Get product reviews with user info
//     const [reviews] = await pool.execute(
//       `SELECT r.*, u.username, u.email 
//        FROM reviews r
//        LEFT JOIN users u ON r.user_id = u.id
//        WHERE r.product_id = ?
//        ORDER BY r.created_at DESC`,
//       [id]
//     );

//     // Get related products (same category)
//     const [relatedProducts] = await pool.execute(
//       `SELECT 
//         p.*,
//         pi.image_url as primary_image,
//         COALESCE(AVG(r.rating), 0) as average_rating
//        FROM products p
//        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//        LEFT JOIN reviews r ON p.id = r.product_id
//        WHERE p.category_id = ? AND p.id != ? AND p.is_published = TRUE
//        GROUP BY p.id
//        LIMIT 8`,
//       [product.category_id, id]
//     );

//     const formattedProduct = {
//       ...product,
//       average_rating: parseFloat(product.average_rating) || 0,
//       review_count: parseInt(product.review_count) || 0,
//       price: parseFloat(product.price) || 0,
//       quantity: parseInt(product.quantity) || 0,
//       images: images.map(img => ({
//         ...img,
//         image_url: formatImageUrl(img.image_url)
//       })),
//       reviews: reviews.map(review => ({
//         ...review,
//         rating: parseFloat(review.rating) || 0
//       })),
//       related_products: relatedProducts.map(related => ({
//         ...related,
//         average_rating: parseFloat(related.average_rating) || 0,
//         price: parseFloat(related.price) || 0,
//         primary_image: related.primary_image 
//           ? formatImageUrl(related.primary_image)
//           : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//       }))
//     };

//     res.json(formattedProduct);
//   } catch (error) {
//     console.error('Error in getProduct:', error);
//     res.status(500).json({ 
//       message: 'Server error fetching product', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// export const createProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const {
//       name,
//       description,
//       price,
//       quantity,
//       category_id,
//       sku,
//       is_featured = false,
//       is_published = true
//     } = req.body;

//     const seller_id = req.user.id;

//     // Validate required fields
//     if (!name || !description || !price || !category_id) {
//       
//       return res.status(400).json({ 
//         message: 'Name, description, price, and category are required' 
//       });
//     }

//     // Create product
//     const [result] = await connection.execute(
//       `INSERT INTO products 
//        (name, description, price, quantity, category_id, seller_id, sku, is_featured, is_published) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [name, description, price, quantity, category_id, seller_id, sku, is_featured, is_published]
//     );

//     const productId = result.insertId;

//     // Handle product images if provided
//     if (req.files && req.files.length > 0) {
//       for (let i = 0; i < req.files.length; i++) {
//         const file = req.files[i];
//         const isPrimary = i === 0; // First image is primary

//         await connection.execute(
//           'INSERT INTO product_images (product_id, image_url, is_primary, alt_text) VALUES (?, ?, ?, ?)',
//           [productId, file.filename, isPrimary, name]
//         );
//       }
//     }

//     

//     // Return the created product
//     const [newProduct] = await pool.execute(
//       `SELECT 
//         p.*, 
//         c.name as category_name,
//         u.username as seller_name,
//         pi.image_url as primary_image
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//        WHERE p.id = ?`,
//       [productId]
//     );

//     const formattedProduct = {
//       ...newProduct[0],
//       primary_image: newProduct[0].primary_image 
//         ? formatImageUrl(newProduct[0].primary_image)
//         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//     };

//     res.status(201).json({
//       message: 'Product created successfully',
//       product: formattedProduct
//     });

//   } catch (error) {
//     
//     console.error('Error in createProduct:', error);
//     res.status(500).json({ 
//       message: 'Server error creating product', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

// // export const updateProduct = async (req, res) => {
// //   const connection = await pool.getConnection();
  
// //   try {
// //   

// //     const { id } = req.params;
// //     const {
// //       name,
// //       description,
// //       price,
// //       quantity,
// //       category_id,
// //       sku,
// //       is_featured,
// //       is_published
// //     } = req.body;

// //     // Check if product exists and belongs to seller
// //     const [existingProducts] = await connection.execute(
// //       'SELECT * FROM products WHERE id = ? AND seller_id = ?',
// //       [id, req.user.id]
// //     );

// //     if (existingProducts.length === 0) {
// //       
// //       return res.status(404).json({ 
// //         message: 'Product not found or you do not have permission to update it' 
// //       });
// //     }

// //     // Update product
// //     const [result] = await connection.execute(
// //       `UPDATE products 
// //        SET name = ?, description = ?, price = ?, quantity = ?, 
// //            category_id = ?, sku = ?, is_featured = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
// //        WHERE id = ?`,
// //       [name, description, price, quantity, category_id, sku, is_featured, is_published, id]
// //     );

// //     if (result.affectedRows === 0) {
// //       
// //       return res.status(404).json({ message: 'Product not found' });
// //     }

// //     

// //     // Return updated product
// //     const [updatedProduct] = await pool.execute(
// //       `SELECT 
// //         p.*, 
// //         c.name as category_name,
// //         u.username as seller_name,
// //         pi.image_url as primary_image
// //        FROM products p
// //        LEFT JOIN categories c ON p.category_id = c.id
// //        LEFT JOIN users u ON p.seller_id = u.id
// //        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
// //        WHERE p.id = ?`,
// //       [id]
// //     );

// //     const formattedProduct = {
// //       ...updatedProduct[0],
// //       primary_image: updatedProduct[0].primary_image 
// //         ? formatImageUrl(updatedProduct[0].primary_image)
// //         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
// //     };

// //     res.json({
// //       message: 'Product updated successfully',
// //       product: formattedProduct
// //     });

// //   } catch (error) {
// //     
// //     console.error('Error in updateProduct:', error);
// //     res.status(500).json({ 
// //       message: 'Server error updating product', 
// //       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
// //     });
// //   } finally {
// //     connection.release();
// //   }
// // };


// // backend/controllers/productController.js
// // backend/controllers/productController.js - Update the updateProduct function
// export const updateProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;
//     const {
//       name,
//       description,
//       price,
//       quantity,
//       category_id,
//       sku,
//       is_featured,
//       is_published,
//       compare_price,
//       cost_per_item,
//       barcode,
//       track_quantity,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     console.log('=== UPDATE PRODUCT DEBUG ===');
//     console.log('Product ID to update:', id);
//     console.log('Current user ID:', req.user.id);
//     console.log('User role:', req.user.role);
//     console.log('Update data:', req.body);

//     // Check if product exists and belongs to seller (or if admin)
//     let query = 'SELECT * FROM products WHERE id = ?';
//     const params = [id];

//     if (req.user.role !== 'admin') {
//       query += ' AND seller_id = ?';
//       params.push(req.user.id);
//     }

//     const [existingProducts] = await connection.execute(query, params);

//     console.log('Existing products found:', existingProducts.length);
//     if (existingProducts.length > 0) {
//       console.log('Product seller_id:', existingProducts[0].seller_id);
//     }

//     if (existingProducts.length === 0) {
//       
      
//       // More detailed error message
//       const [anyProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
//       if (anyProduct.length === 0) {
//         return res.status(404).json({ 
//           message: 'Product not found' 
//         });
//       } else {
//         return res.status(403).json({ 
//           message: 'You do not have permission to update this product. Product belongs to another seller.' 
//         });
//       }
//     }

//     // Rest of your update logic remains the same...
//     // Build dynamic update query based on provided fields
//     const updateFields = [];
//     const updateValues = [];

//     // Add all the field updates as before...
//     if (name !== undefined) {
//       updateFields.push('name = ?');
//       updateValues.push(name);
//     }
//     if (description !== undefined) {
//       updateFields.push('description = ?');
//       updateValues.push(description);
//     }
//     if (price !== undefined) {
//       updateFields.push('price = ?');
//       updateValues.push(parseFloat(price));
//     }
//     // ... include all other fields

//     // Always update the updated_at timestamp
//     updateFields.push('updated_at = CURRENT_TIMESTAMP');

//     if (updateFields.length === 0) {
//       
//       return res.status(400).json({ message: 'No fields to update' });
//     }

//     // Add the product ID to the values array
//     updateValues.push(id);

//     const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;

//     console.log('Final update query:', updateQuery);
//     console.log('Update values:', updateValues);

//     const [result] = await connection.execute(updateQuery, updateValues);

//     if (result.affectedRows === 0) {
//       
//       return res.status(404).json({ message: 'Product not found during update' });
//     }

//     

//     console.log('Product updated successfully');

//     // Return updated product
//     const [updatedProduct] = await pool.execute(
//       `SELECT 
//         p.*, 
//         c.name as category_name,
//         u.username as seller_name,
//         pi.image_url as primary_image
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//        WHERE p.id = ?`,
//       [id]
//     );

//     if (updatedProduct.length === 0) {
//       return res.status(404).json({ message: 'Updated product not found' });
//     }

//     const formatImageUrl = (imagePath) => {
//       if (!imagePath) {
//         return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//       }
//       if (imagePath.startsWith('http')) {
//         return imagePath;
//       }
//       if (imagePath.startsWith('/uploads/')) {
//         return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//       }
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//     };

//     const formattedProduct = {
//       ...updatedProduct[0],
//       primary_image: updatedProduct[0].primary_image 
//         ? formatImageUrl(updatedProduct[0].primary_image)
//         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//     };

//     res.json({
//       message: 'Product updated successfully',
//       product: formattedProduct
//     });

//   } catch (error) {
//     
//     console.error('Error in updateProduct:', error);
//     res.status(500).json({ 
//       message: 'Server error updating product', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };


// export const deleteProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;

//     // Check if product exists and belongs to seller (or admin)
//     let checkQuery = 'SELECT * FROM products WHERE id = ?';
//     const checkParams = [id];

//     if (req.user.role !== 'admin') {
//       checkQuery += ' AND seller_id = ?';
//       checkParams.push(req.user.id);
//     }

//     const [existingProducts] = await connection.execute(checkQuery, checkParams);

//     if (existingProducts.length === 0) {
//       
//       return res.status(404).json({ 
//         message: 'Product not found or you do not have permission to delete it' 
//       });
//     }

//     // Delete product images first (due to foreign key constraint)
//     await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);

//     // Delete product
//     const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     

//     res.json({ 
//       message: 'Product deleted successfully',
//       productId: id
//     });

//   } catch (error) {
//     
//     console.error('Error in deleteProduct:', error);
//     res.status(500).json({ 
//       message: 'Server error deleting product', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

// export const getCategories = async (req, res) => {
//   try {
//     const [categories] = await pool.execute(
//       'SELECT * FROM categories ORDER BY name ASC'
//     );

//     res.json({ categories });
//   } catch (error) {
//     console.error('Error in getCategories:', error);
//     res.status(500).json({ 
//       message: 'Server error fetching categories', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// export const getFeaturedProducts = async (req, res) => {
//   try {
//     const [products] = await pool.execute(
//       `SELECT 
//         p.*, 
//         c.name as category_name,
//         pi.image_url as primary_image,
//         COALESCE(AVG(r.rating), 0) as average_rating
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//        LEFT JOIN reviews r ON p.id = r.product_id
//        WHERE p.is_featured = TRUE AND p.is_published = TRUE
//        GROUP BY p.id
//        ORDER BY p.created_at DESC
//        LIMIT 12`
//     );

//     const formattedProducts = products.map(product => ({
//       ...product,
//       average_rating: parseFloat(product.average_rating) || 0,
//       price: parseFloat(product.price) || 0,
//       primary_image: product.primary_image 
//         ? formatImageUrl(product.primary_image)
//         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//     }));

//     res.json({ products: formattedProducts });
//   } catch (error) {
//     console.error('Error in getFeaturedProducts:', error);
//     res.status(500).json({ 
//       message: 'Server error fetching featured products', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };



// // backend/controllers/productController.js

// // Adjust product stock (for orders, cancellations, etc.)
// export const adjustStock = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { id } = req.params;
//     const { quantity, action = 'decrease' } = req.body; // action: 'increase' or 'decrease'

//     if (!quantity || quantity <= 0) {
//       
//       return res.status(400).json({ 
//         message: 'Valid quantity is required' 
//       });
//     }

//     // Check if product exists
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [id]
//     );

//     if (products.length === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];
//     const currentStock = product.quantity;
//     let newStock;

//     if (action === 'decrease') {
//       // Check if enough stock is available
//       if (currentStock < quantity) {
//         
//         return res.status(400).json({ 
//           message: `Insufficient stock. Available: ${currentStock}, Requested: ${quantity}` 
//         });
//       }
//       newStock = currentStock - quantity;
//     } else if (action === 'increase') {
//       newStock = currentStock + quantity;
//     } else {
//       
//       return res.status(400).json({ 
//         message: 'Invalid action. Use "increase" or "decrease"' 
//       });
//     }

//     // Update stock
//     const [result] = await connection.execute(
//       'UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [newStock, id]
//     );

//     if (result.affectedRows === 0) {
//       
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     

//     res.json({
//       message: `Stock ${action}d successfully`,
//       productId: id,
//       previousStock: currentStock,
//       newStock,
//       change: action === 'increase' ? `+${quantity}` : `-${quantity}`
//     });

//   } catch (error) {
//     
//     console.error('Error in adjustStock:', error);
//     res.status(500).json({ 
//       message: 'Server error adjusting stock', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };

// // Bulk adjust stock for multiple products (useful for order processing)
// export const bulkAdjustStock = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {
//   

//     const { adjustments } = req.body; // Array of { productId, quantity, action }

//     if (!Array.isArray(adjustments) || adjustments.length === 0) {
//       
//       return res.status(400).json({ 
//         message: 'Adjustments array is required' 
//       });
//     }

//     const results = [];
//     const errors = [];

//     // Process each adjustment
//     for (const adjustment of adjustments) {
//       const { productId, quantity, action = 'decrease' } = adjustment;

//       try {
//         // Check if product exists
//         const [products] = await connection.execute(
//           'SELECT * FROM products WHERE id = ?',
//           [productId]
//         );

//         if (products.length === 0) {
//           errors.push({ productId, error: 'Product not found' });
//           continue;
//         }

//         const product = products[0];
//         const currentStock = product.quantity;
//         let newStock;

//         if (action === 'decrease') {
//           if (currentStock < quantity) {
//             errors.push({ 
//               productId, 
//               error: `Insufficient stock. Available: ${currentStock}, Requested: ${quantity}` 
//             });
//             continue;
//           }
//           newStock = currentStock - quantity;
//         } else if (action === 'increase') {
//           newStock = currentStock + quantity;
//         } else {
//           errors.push({ productId, error: 'Invalid action' });
//           continue;
//         }

//         // Update stock
//         const [result] = await connection.execute(
//           'UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//           [newStock, productId]
//         );

//         if (result.affectedRows > 0) {
//           results.push({
//             productId,
//             productName: product.name,
//             previousStock: currentStock,
//             newStock,
//             change: action === 'increase' ? `+${quantity}` : `-${quantity}`
//           });
//         }
//       } catch (error) {
//         errors.push({ productId, error: error.message });
//       }
//     }

//     // If there are any errors, rollback the entire transaction
//     if (errors.length > 0) {
//       
//       return res.status(400).json({
//         message: 'Some stock adjustments failed',
//         successful: results,
//         errors
//       });
//     }

//     

//     res.json({
//       message: 'All stock adjustments completed successfully',
//       adjustments: results
//     });

//   } catch (error) {
//     
//     console.error('Error in bulkAdjustStock:', error);
//     res.status(500).json({ 
//       message: 'Server error adjusting stock', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } finally {
//     connection.release();
//   }
// };






import pool from '../config/database.js';

// Helper function to format image URLs
const formatImageUrl = (imagePath) => {
  if (!imagePath || imagePath === '/api/placeholder/300/300') {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads/')) {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
  }

  return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
};

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1000,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      featured
    } = req.query;

    console.log('=== GET PRODUCTS - SELLER FILTERED ===');
    console.log('Current user:', req.user);

    let query = `
      SELECT 
        p.*, 
        c.name as category_name,
        u.username as seller_name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN reviews r ON p.id = r.product_id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE 1=1
    `;
    const params = [];

    // For sellers, only show their products
    if (req.user && req.user.role === 'seller') {
      query += ' AND p.seller_id = ?';
      params.push(req.user.id);
      console.log('Filtering by seller_id:', req.user.id);
    } else if (req.user && req.user.role === 'admin') {
      // Admin can see all products
      console.log('Admin user - showing all products');
    } else {
      // For customers, only show published products
      query += ' AND p.is_published = TRUE';
    }

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (featured) {
      query += ' AND p.is_featured = TRUE';
    }

    // Group by product ID
    query += ` GROUP BY p.id`;

    // Add sorting
    const validSortColumns = ['name', 'price', 'created_at', 'updated_at', 'average_rating'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    // Always use the limit
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    console.log('Query:', query);
    console.log('Params:', params);

    const [products] = await pool.execute(query, params);

    // Get total count for pagination info
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE 1=1
    `;
    const countParams = [];

    if (req.user && req.user.role === 'seller') {
      countQuery += ' AND p.seller_id = ?';
      countParams.push(req.user.id);
    } else if (!req.user || (req.user.role !== 'admin')) {
      countQuery += ' AND p.is_published = TRUE';
    }

    if (category) {
      countQuery += ' AND p.category_id = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (minPrice) {
      countQuery += ' AND p.price >= ?';
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countQuery += ' AND p.price <= ?';
      countParams.push(parseFloat(maxPrice));
    }

    if (featured) {
      countQuery += ' AND p.is_featured = TRUE';
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    console.log(`Returning ${products.length} products for user ${req.user?.id}`);

    // Format image URLs before sending
    const formattedProducts = products.map(product => ({
      ...product,
      average_rating: parseFloat(product.average_rating) || 0,
      review_count: parseInt(product.review_count) || 0,
      price: parseFloat(product.price) || 0,
      quantity: parseInt(product.quantity) || 0,
      primary_image: product.primary_image 
        ? formatImageUrl(product.primary_image)
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ 
      message: 'Server error fetching products', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get seller's products only
// export const getSellerProducts = async (req, res) => {
//   try {
//     console.log('=== GET SELLER PRODUCTS ===');
//     console.log('Seller ID:', req.user.id);
    
//     const [products] = await pool.execute(
//       `SELECT 
//         p.*, 
//         c.name as category_name,
//         u.username as seller_name,
//         pi.image_url as primary_image
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//        WHERE p.seller_id = ?
//        ORDER BY p.created_at DESC`,
//       [req.user.id]
//     );

//     console.log(`Found ${products.length} products for seller ${req.user.id}`);

//     const formattedProducts = products.map(product => ({
//       ...product,
//       price: parseFloat(product.price) || 0,
//       quantity: parseInt(product.quantity) || 0,
//       primary_image: product.primary_image 
//         ? formatImageUrl(product.primary_image)
//         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//     }));

//     res.json({ 
//       success: true,
//       products: formattedProducts 
//     });

//   } catch (error) {
//     console.error('Get seller products error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error fetching seller products', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Get product details
    const [products] = await pool.execute(
      `SELECT 
        p.*, 
        c.name as category_name,
        u.username as seller_name,
        u.email as seller_email,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    // Get product images
    const [images] = await pool.execute(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, created_at ASC',
      [id]
    );

    // Get product reviews with user info
    const [reviews] = await pool.execute(
      `SELECT r.*, u.username, u.email 
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Get related products (same category)
    const [relatedProducts] = await pool.execute(
      `SELECT 
        p.*,
        pi.image_url as primary_image,
        COALESCE(AVG(r.rating), 0) as average_rating
       FROM products p
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.category_id = ? AND p.id != ? AND p.is_published = TRUE
       GROUP BY p.id
       LIMIT 8`,
      [product.category_id, id]
    );

    const formattedProduct = {
      ...product,
      average_rating: parseFloat(product.average_rating) || 0,
      review_count: parseInt(product.review_count) || 0,
      price: parseFloat(product.price) || 0,
      quantity: parseInt(product.quantity) || 0,
      images: images.map(img => ({
        ...img,
        image_url: formatImageUrl(img.image_url)
      })),
      reviews: reviews.map(review => ({
        ...review,
        rating: parseFloat(review.rating) || 0
      })),
      related_products: relatedProducts.map(related => ({
        ...related,
        average_rating: parseFloat(related.average_rating) || 0,
        price: parseFloat(related.price) || 0,
        primary_image: related.primary_image 
          ? formatImageUrl(related.primary_image)
          : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
      }))
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({ 
      message: 'Server error fetching product', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const createProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {


    const {
      name,
      description,
      price,
      quantity,
      category_id,
      sku,
      is_featured = false,
      is_published = true,
      compare_price,
      cost_per_item,
      barcode,
      track_quantity = true,
      requires_shipping = true,
      weight,
      seo_title,
      seo_description
    } = req.body;

    const seller_id = req.user.id;

    console.log('=== CREATE PRODUCT ===');
    console.log('Seller ID:', seller_id);
    console.log('Product data:', req.body);

    // Validate required fields
    if (!name || !description || !price || !category_id) {
      
      return res.status(400).json({ 
        message: 'Name, description, price, and category are required' 
      });
    }

    // Create product
    const [result] = await connection.execute(
      `INSERT INTO products 
       (name, description, price, quantity, category_id, seller_id, sku, is_featured, is_published,
        compare_price, cost_per_item, barcode, track_quantity, requires_shipping, weight, seo_title, seo_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description, price, quantity, category_id, seller_id, sku, is_featured, is_published,
        compare_price, cost_per_item, barcode, track_quantity, requires_shipping, weight, seo_title, seo_description
      ]
    );

    const productId = result.insertId;

    // Handle product images if provided
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const isPrimary = i === 0; // First image is primary

        await connection.execute(
          'INSERT INTO product_images (product_id, image_url, is_primary, alt_text) VALUES (?, ?, ?, ?)',
          [productId, file.filename, isPrimary, name]
        );
      }
    }

    

    // Return the created product
    const [newProduct] = await pool.execute(
      `SELECT 
        p.*, 
        c.name as category_name,
        u.username as seller_name,
        pi.image_url as primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       WHERE p.id = ?`,
      [productId]
    );

    const formattedProduct = {
      ...newProduct[0],
      primary_image: newProduct[0].primary_image 
        ? formatImageUrl(newProduct[0].primary_image)
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
    };

    res.status(201).json({
      message: 'Product created successfully',
      product: formattedProduct
    });

  } catch (error) {
    
    console.error('Error in createProduct:', error);
    res.status(500).json({ 
      message: 'Server error creating product', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// export const updateProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {


//     const { id } = req.params;
//     const {
//       name,
//       description,
//       price,
//       quantity,
//       category_id,
//       sku,
//       is_featured,
//       is_published,
//       compare_price,
//       cost_per_item,
//       barcode,
//       track_quantity,
//       requires_shipping,
//       weight,
//       seo_title,
//       seo_description
//     } = req.body;

//     console.log('=== UPDATE PRODUCT ===');
//     console.log('Product ID:', id);
//     console.log('Current user ID:', req.user.id);
//     console.log('User role:', req.user.role);
//     console.log('Update data:', req.body);

//     // Check if product exists and belongs to seller (or if admin)
//     let query = 'SELECT * FROM products WHERE id = ?';
//     const params = [id];

//     if (req.user.role !== 'admin') {
//       query += ' AND seller_id = ?';
//       params.push(req.user.id);
//     }

//     const [existingProducts] = await connection.execute(query, params);

//     console.log('Existing products found:', existingProducts.length);
//     if (existingProducts.length > 0) {
//       console.log('Product seller_id:', existingProducts[0].seller_id);
//     }

//     if (existingProducts.length === 0) {
      
      
//       // More detailed error message
//       const [anyProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
//       if (anyProduct.length === 0) {
//         return res.status(404).json({ 
//           message: 'Product not found' 
//         });
//       } else {
//         return res.status(403).json({ 
//           message: 'You do not have permission to update this product. Product belongs to another seller.' 
//         });
//       }
//     }

//     // Build dynamic update query
//     const updateFields = [];
//     const updateValues = [];

//     if (name !== undefined) {
//       updateFields.push('name = ?');
//       updateValues.push(name);
//     }
//     if (description !== undefined) {
//       updateFields.push('description = ?');
//       updateValues.push(description);
//     }
//     if (price !== undefined) {
//       updateFields.push('price = ?');
//       updateValues.push(parseFloat(price));
//     }
//     if (quantity !== undefined) {
//       updateFields.push('quantity = ?');
//       updateValues.push(parseInt(quantity));
//     }
//     if (category_id !== undefined) {
//       updateFields.push('category_id = ?');
//       updateValues.push(category_id);
//     }
//     if (sku !== undefined) {
//       updateFields.push('sku = ?');
//       updateValues.push(sku);
//     }
//     if (is_featured !== undefined) {
//       updateFields.push('is_featured = ?');
//       updateValues.push(is_featured ? 1 : 0);
//     }
//     if (is_published !== undefined) {
//       updateFields.push('is_published = ?');
//       updateValues.push(is_published ? 1 : 0);
//     }
//     if (compare_price !== undefined) {
//       updateFields.push('compare_price = ?');
//       updateValues.push(compare_price ? parseFloat(compare_price) : null);
//     }
//     if (cost_per_item !== undefined) {
//       updateFields.push('cost_per_item = ?');
//       updateValues.push(cost_per_item ? parseFloat(cost_per_item) : null);
//     }
//     if (barcode !== undefined) {
//       updateFields.push('barcode = ?');
//       updateValues.push(barcode);
//     }
//     if (track_quantity !== undefined) {
//       updateFields.push('track_quantity = ?');
//       updateValues.push(track_quantity ? 1 : 0);
//     }
//     if (requires_shipping !== undefined) {
//       updateFields.push('requires_shipping = ?');
//       updateValues.push(requires_shipping ? 1 : 0);
//     }
//     if (weight !== undefined) {
//       updateFields.push('weight = ?');
//       updateValues.push(weight ? parseFloat(weight) : null);
//     }
//     if (seo_title !== undefined) {
//       updateFields.push('seo_title = ?');
//       updateValues.push(seo_title);
//     }
//     if (seo_description !== undefined) {
//       updateFields.push('seo_description = ?');
//       updateValues.push(seo_description);
//     }

//     // Always update the updated_at timestamp
//     updateFields.push('updated_at = CURRENT_TIMESTAMP');

//     if (updateFields.length === 0) {
      
//       return res.status(400).json({ message: 'No fields to update' });
//     }

//     // Add the product ID to the values array
//     updateValues.push(id);

//     const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;

//     console.log('Final update query:', updateQuery);
//     console.log('Update values:', updateValues);

//     const [result] = await connection.execute(updateQuery, updateValues);

//     if (result.affectedRows === 0) {
      
//       return res.status(404).json({ message: 'Product not found during update' });
//     }

    

//     console.log('Product updated successfully');

//     // Return updated product
//     const [updatedProduct] = await pool.execute(
//       `SELECT 
//         p.*, 
//         c.name as category_name,
//         u.username as seller_name,
//         pi.image_url as primary_image
//        FROM products p
//        LEFT JOIN categories c ON p.category_id = c.id
//        LEFT JOIN users u ON p.seller_id = u.id
//        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
//        WHERE p.id = ?`,
//       [id]
//     );

//     if (updatedProduct.length === 0) {
//       return res.status(404).json({ message: 'Updated product not found' });
//     }

//     const formattedProduct = {
//       ...updatedProduct[0],
//       primary_image: updatedProduct[0].primary_image 
//         ? formatImageUrl(updatedProduct[0].primary_image)
//         : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
//     };

//     res.json({
//       message: 'Product updated successfully',
//       product: formattedProduct
//     });

//   } catch (error) {
    
//     console.error('Error in updateProduct:', error);
//     res.status(500).json({ 
//       message: 'Server error updating product', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };



// Add this function to your products controller


export const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;
    
    console.log('=== UPDATE PRODUCT ===');
    console.log('Product ID:', id);
    console.log('Current user ID:', req.user.id);
    console.log('Update data (body):', req.body);
    console.log('Update files:', req.files);

    // Check if product exists and belongs to seller (or if admin)
    let query = 'SELECT * FROM products WHERE id = ?';
    const params = [id];

    if (req.user.role !== 'admin') {
      query += ' AND seller_id = ?';
      params.push(req.user.id);
    }

    const [existingProducts] = await connection.execute(query, params);

    if (existingProducts.length === 0) {
      const [anyProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
      if (anyProduct.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      } else {
        return res.status(403).json({ message: 'You do not have permission to update this product' });
      }
    }

    // Parse FormData fields
    const {
      name, description, price, quantity, category_id, sku,
      is_featured, is_published, compare_price, cost_per_item,
      barcode, track_quantity, requires_shipping, weight,
      seo_title, seo_description
    } = req.body;

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    // Helper function to handle field updates
    const addField = (field, value, transform = null) => {
      if (value !== undefined && value !== null && value !== '') {
        updateFields.push(`${field} = ?`);
        updateValues.push(transform ? transform(value) : value);
      }
    };

    addField('name', name);
    addField('description', description);
    addField('price', price, val => parseFloat(val));
    addField('quantity', quantity, val => parseInt(val));
    addField('category_id', category_id, val => parseInt(val));
    addField('sku', sku);
    addField('barcode', barcode);
    addField('is_featured', is_featured, val => val === '1' || val === 'true' ? 1 : 0);
    addField('is_published', is_published, val => val === '1' || val === 'true' ? 1 : 0);
    addField('compare_price', compare_price, val => val ? parseFloat(val) : null);
    addField('cost_per_item', cost_per_item, val => val ? parseFloat(val) : null);
    addField('track_quantity', track_quantity, val => val === '1' || val === 'true' ? 1 : 0);
    addField('requires_shipping', requires_shipping, val => val === '1' || val === 'true' ? 1 : 0);
    addField('weight', weight, val => val ? parseFloat(val) : null);
    addField('seo_title', seo_title);
    addField('seo_description', seo_description);

    // Always update the updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add the product ID to the values array
    updateValues.push(id);

    const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('Final update query:', updateQuery);

    const [result] = await connection.execute(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found during update' });
    }

    // **FIX: Handle image uploads properly**
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'new images');
      
      // Delete existing images
      await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);
      
      // Insert new images with proper path
      for (let i = 0; i < req.files.length; i++) {
        const image = req.files[i];
        const isPrimary = i === 0 ? 1 : 0;
        
        // **FIX: Store with /uploads/ prefix**
        const imagePath = `/uploads/${image.filename}`;
        
        console.log(`Storing image ${i+1}:`, {
          filename: image.filename,
          path: imagePath,
          isPrimary: isPrimary
        });
        
        await connection.execute(
          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
          [id, imagePath, isPrimary]
        );
      }
    } else {
      console.log('No new images to process');
    }

    console.log('Product updated successfully');

    // Return updated product with proper image URL
    const [updatedProduct] = await connection.execute(
      `SELECT 
        p.*, 
        c.name as category_name,
        u.username as seller_name,
        pi.image_url as primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       WHERE p.id = ?`,
      [id]
    );

    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: 'Updated product not found' });
    }

    // **FIX: Use the formatImageUrl function properly**
    const formattedProduct = {
      ...updatedProduct[0],
      primary_image: formatImageUrl(updatedProduct[0].primary_image)
    };

    console.log('Returning updated product:', formattedProduct);

    res.json({
      message: 'Product updated successfully',
      product: formattedProduct
    });

  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ 
      message: 'Server error updating product', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};


export const getSellerProducts = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const sellerId = req.user.id; // Assuming user ID is available from auth middleware

    // Modified query to include order information
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        pi.image_url as primary_image,
        (SELECT COUNT(*) FROM order_items WHERE product_id = p.id) as order_count,
        CASE 
          WHEN (SELECT COUNT(*) FROM order_items WHERE product_id = p.id) > 0 THEN TRUE 
          ELSE FALSE 
        END as has_orders
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.seller_id = ?
      ORDER BY p.created_at DESC
    `;

    const [products] = await connection.execute(query, [sellerId]);

    // Transform the data if needed
    const transformedProducts = products.map(product => ({
      ...product,
      has_orders: Boolean(product.has_orders), // Ensure it's a boolean
      order_count: parseInt(product.order_count) // Ensure it's a number
    }));

    res.json({ 
      success: true,
      products: transformedProducts 
    });

  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching products', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Your existing deleteProduct function remains the same
export const deleteProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;

    // Check if product exists and belongs to seller (or admin)
    let checkQuery = 'SELECT * FROM products WHERE id = ?';
    const checkParams = [id];

    if (req.user.role !== 'admin') {
      checkQuery += ' AND seller_id = ?';
      checkParams.push(req.user.id);
    }

    const [existingProducts] = await connection.execute(checkQuery, checkParams);

    if (existingProducts.length === 0) {
      return res.status(404).json({ 
        message: 'Product not found or you do not have permission to delete it' 
      });
    }

    // Check if product has any orders
    const [orderItems] = await connection.execute(
      'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
      [id]
    );
    
    if (orderItems[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete product because it has orders. You can archive the product instead.',
        has_orders: true
      });
    }

    // Delete product images first (due to foreign key constraint)
    await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);

    // Delete product
    const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ 
      message: 'Product deleted successfully',
      productId: id
    });

  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ 
      message: 'Server error deleting product', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } 
};






// export const deleteProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {


//     const { id } = req.params;

//     // Check if product exists and belongs to seller (or admin)
//     let checkQuery = 'SELECT * FROM products WHERE id = ?';
//     const checkParams = [id];

//     if (req.user.role !== 'admin') {
//       checkQuery += ' AND seller_id = ?';
//       checkParams.push(req.user.id);
//     }

//     const [existingProducts] = await connection.execute(checkQuery, checkParams);

//     if (existingProducts.length === 0) {
      
//       return res.status(404).json({ 
//         message: 'Product not found or you do not have permission to delete it' 
//       });
//     }

//     // Delete product images first (due to foreign key constraint)
//     await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);

//     // Delete product
//     const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
      
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.json({ 
//       message: 'Product deleted successfully',
//       productId: id
//     });

//   } catch (error) {
//     console.error('Error in deleteProduct:', error);
//     res.status(500).json({ 
//       message: 'Server error deleting product', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };







// export const deleteProduct = async (req, res) => {
//   const connection = await pool.getConnection();
  
//   try {

//     const { id } = req.params;

//     // Check if product exists and belongs to seller (or admin)
//     let checkQuery = 'SELECT * FROM products WHERE id = ?';
//     const checkParams = [id];

//     if (req.user.role !== 'admin') {
//       checkQuery += ' AND seller_id = ?';
//       checkParams.push(req.user.id);
//     }

//     const [existingProducts] = await connection.execute(checkQuery, checkParams);

//     if (existingProducts.length === 0) {
      
//       return res.status(404).json({ 
//         message: 'Product not found or you do not have permission to delete it' 
//       });
//     }

//     // Check if product has any orders
//     const [orderItems] = await connection.execute(
//       'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
//       [id]
//     );
    
//     if (orderItems[0].count > 0) {
      
//       return res.status(400).json({ 
//         message: 'Cannot delete product because it has orders. You can archive the product instead.',
//         has_orders: true
//       });
//     }

//     // Delete product images first (due to foreign key constraint)
//     await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);

//     // Delete product
//     const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
      
//       return res.status(404).json({ message: 'Product not found' });
//     }

    

//     res.json({ 
//       message: 'Product deleted successfully',
//       productId: id
//     });

//   } catch (error) {
    
//     console.error('Error in deleteProduct:', error);
//     res.status(500).json({ 
//       message: 'Server error deleting product', 
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   } 
// };


export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories ORDER BY name ASC'
    );

    res.json({ categories });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ 
      message: 'Server error fetching categories', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT 
        p.*, 
        c.name as category_name,
        pi.image_url as primary_image,
        COALESCE(AVG(r.rating), 0) as average_rating
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.is_featured = TRUE AND p.is_published = TRUE
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT 12`
    );

    const formattedProducts = products.map(product => ({
      ...product,
      average_rating: parseFloat(product.average_rating) || 0,
      price: parseFloat(product.price) || 0,
      primary_image: product.primary_image 
        ? formatImageUrl(product.primary_image)
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
    }));

    res.json({ products: formattedProducts });
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    res.status(500).json({ 
      message: 'Server error fetching featured products', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Stock Management Functions
export const adjustStock = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {


    const { id } = req.params;
    const { adjustment, reason = 'Manual adjustment' } = req.body;

    console.log('=== ADJUST STOCK ===');
    console.log('Product ID:', id);
    console.log('Adjustment:', adjustment);
    console.log('Reason:', reason);

    if (adjustment === undefined || adjustment === 0) {
      
      return res.status(400).json({ 
        message: 'Valid adjustment is required and cannot be zero' 
      });
    }

    // Check if product exists and belongs to seller
    let query = 'SELECT * FROM products WHERE id = ?';
    const params = [id];

    if (req.user.role !== 'admin') {
      query += ' AND seller_id = ?';
      params.push(req.user.id);
    }

    const [products] = await connection.execute(query, params);

    if (products.length === 0) {
      
      return res.status(404).json({ 
        message: 'Product not found or you do not have permission to adjust stock' 
      });
    }

    const product = products[0];
    const currentStock = product.quantity;
    const newStock = currentStock + parseInt(adjustment);

    // Check if new stock is negative
    if (newStock < 0) {
      
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${currentStock}, Adjustment: ${adjustment}` 
      });
    }

    // Update stock
    const [result] = await connection.execute(
      'UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStock, id]
    );

    if (result.affectedRows === 0) {
      
      return res.status(404).json({ message: 'Product not found' });
    }

    // Log the stock adjustment (optional - you can create a stock_history table)
    // await connection.execute(
    //   'INSERT INTO stock_history (product_id, adjustment, reason, updated_by) VALUES (?, ?, ?, ?)',
    //   [id, adjustment, reason, req.user.id]
    // );

    

    res.json({
      message: `Stock ${adjustment > 0 ? 'increased' : 'decreased'} successfully`,
      productId: id,
      productName: product.name,
      previousStock: currentStock,
      newStock,
      adjustment: parseInt(adjustment),
      reason
    });

  } catch (error) {
    
    console.error('Error in adjustStock:', error);
    res.status(500).json({ 
      message: 'Server error adjusting stock', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

export const bulkAdjustStock = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {


    const { adjustments } = req.body;

    if (!Array.isArray(adjustments) || adjustments.length === 0) {
      
      return res.status(400).json({ 
        message: 'Adjustments array is required' 
      });
    }

    const results = [];
    const errors = [];

    for (const adjustment of adjustments) {
      const { productId, adjustment: quantity, reason = 'Bulk adjustment' } = adjustment;

      try {
        // Check if product exists and belongs to seller
        let query = 'SELECT * FROM products WHERE id = ?';
        const params = [productId];

        if (req.user.role !== 'admin') {
          query += ' AND seller_id = ?';
          params.push(req.user.id);
        }

        const [products] = await connection.execute(query, params);

        if (products.length === 0) {
          errors.push({ productId, error: 'Product not found or no permission' });
          continue;
        }

        const product = products[0];
        const currentStock = product.quantity;
        const newStock = currentStock + parseInt(quantity);

        if (newStock < 0) {
          errors.push({ 
            productId, 
            error: `Insufficient stock. Available: ${currentStock}, Adjustment: ${quantity}` 
          });
          continue;
        }

        const [result] = await connection.execute(
          'UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newStock, productId]
        );

        if (result.affectedRows > 0) {
          results.push({
            productId,
            productName: product.name,
            previousStock: currentStock,
            newStock,
            adjustment: parseInt(quantity),
            reason
          });
        }
      } catch (error) {
        errors.push({ productId, error: error.message });
      }
    }

    if (errors.length > 0) {
      
      return res.status(400).json({
        message: 'Some stock adjustments failed',
        successful: results,
        errors
      });
    }

    

    res.json({
      message: 'All stock adjustments completed successfully',
      adjustments: results
    });

  } catch (error) {
    
    console.error('Error in bulkAdjustStock:', error);
    res.status(500).json({ 
      message: 'Server error adjusting stock', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    connection.release();
  }
};