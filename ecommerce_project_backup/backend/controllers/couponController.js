// backend/controllers/couponController.js
import pool from '../config/database.js';

export const getCoupons = async (req, res) => {
  try {
    const [coupons] = await pool.execute(
      // 'SELECT * FROM coupons WHERE is_active = TRUE AND (valid_until IS NULL OR valid_until > NOW()) ORDER BY created_at DESC'
      `-- Test coupon validation scenarios
SELECT
c.id,
    c.code,
    c.discount_type,
    c.discount_value,
    c.min_order_amount,
    c.max_discount_amount,
    c.usage_limit,
    c.used_count,
    c.valid_from,
    c.valid_until,
    c.is_active,
    -- Test with $100 order amount
    CASE 
        WHEN c.is_active = 0 THEN 'Coupon inactive'
        WHEN NOW() < c.valid_from THEN 'Not yet valid'
        WHEN NOW() > c.valid_until THEN 'Expired'
        WHEN c.usage_limit IS NOT NULL AND c.used_count >= c.usage_limit THEN 'Usage limit reached'
        WHEN 100 < c.min_order_amount THEN 'Minimum order not met'
        ELSE 'Valid'
    END as validation_status,
    -- Calculate discount for $100 order
    CASE 
        WHEN c.discount_type = 'percentage' THEN 
            LEAST(100 * c.discount_value / 100, COALESCE(c.max_discount_amount, 100 * c.discount_value / 100))
        ELSE c.discount_value
    END as calculated_discount
FROM coupons c
ORDER BY c.id;`
    );

    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const [coupons] = await pool.execute(
      'SELECT * FROM coupons WHERE id = ?',
      [id]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json(coupons[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      valid_from,
      valid_until,
      is_active
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO coupons (
        code, discount_type, discount_value, min_order_amount, max_discount_amount,
        usage_limit, valid_from, valid_until, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code, discount_type, discount_value, min_order_amount, max_discount_amount,
        usage_limit, valid_from, valid_until, is_active
      ]
    );

    res.status(201).json({
      message: 'Coupon created successfully',
      couponId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// export const updateCoupon = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       code,
//       discount_type,
//       discount_value,
//       min_order_amount,
//       max_discount_amount,
//       usage_limit,
//       valid_from,
//       valid_until,
//       is_active
//     } = req.body;

//     const [result] = await pool.execute(
//       `UPDATE coupons SET 
//         code = ?, discount_type = ?, discount_value = ?, min_order_amount = ?,
//         max_discount_amount = ?, usage_limit = ?, valid_from = ?, valid_until = ?,
//         is_active = ?
//       WHERE id = ?`,
//       [
//         code, discount_type, discount_value, min_order_amount,
//         max_discount_amount, usage_limit, valid_from, valid_until,
//         is_active, id
//       ]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Coupon not found' });
//     }

//     res.json({ message: 'Coupon updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const deleteCoupon = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [result] = await pool.execute('DELETE FROM coupons WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Coupon not found' });
//     }

//     res.json({ message: 'Coupon deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// backend/controllers/couponController.js


// backend/controllers/couponController.js
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      valid_from,
      valid_until,
      is_active,
    } = req.body;

    console.log('Updating coupon:', id, req.body);

    // Check if coupon exists
    const [existingCoupons] = await pool.execute(
      'SELECT * FROM coupons WHERE id = ?',
      [id]
    );

    if (existingCoupons.length === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check for duplicate code (excluding current coupon)
    const [duplicateCoupons] = await pool.execute(
      'SELECT id FROM coupons WHERE code = ? AND id != ?',
      [code, id]
    );

    if (duplicateCoupons.length > 0) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Convert empty strings to NULL for optional fields
    const processedMinOrder = min_order_amount === '' ? null : min_order_amount;
    const processedMaxDiscount = max_discount_amount === '' ? null : max_discount_amount;
    const processedUsageLimit = usage_limit === '' ? null : usage_limit;
    const processedValidFrom = valid_from === '' ? null : valid_from;
    const processedValidUntil = valid_until === '' ? null : valid_until;

    const [result] = await pool.execute(
      `UPDATE coupons SET 
        code = ?, discount_type = ?, discount_value = ?, min_order_amount = ?,
        max_discount_amount = ?, usage_limit = ?, valid_from = ?, valid_until = ?,
        is_active = ?
      WHERE id = ?`,
      [
        code, 
        discount_type, 
        parseFloat(discount_value),
        processedMinOrder ? parseFloat(processedMinOrder) : null,
        processedMaxDiscount ? parseFloat(processedMaxDiscount) : null,
        processedUsageLimit ? parseInt(processedUsageLimit) : null,
        processedValidFrom,
        processedValidUntil,
        is_active,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Get updated coupon
    const [updatedCoupons] = await pool.execute(
      'SELECT * FROM coupons WHERE id = ?',
      [id]
    );

    res.json({ 
      message: 'Coupon updated successfully',
      coupon: updatedCoupons[0]
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if coupon is used in any orders
    const [usedCoupons] = await pool.execute(
      'SELECT COUNT(*) as usage_count FROM orders WHERE coupon_id = ?',
      [id]
    );

    if (usedCoupons[0].usage_count > 0) {
      // If coupon is used, disable it instead of deleting
      const [result] = await pool.execute(
        'UPDATE coupons SET is_active = FALSE WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Coupon not found' });
      }

      return res.json({ 
        message: 'Coupon has been used in orders and has been disabled instead of deleted',
        disabled: true 
      });
    }

    // If coupon is not used, proceed with hard delete
    const [result] = await pool.execute('DELETE FROM coupons WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    
    // Handle foreign key constraint errors
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      // Try to disable instead
      const [result] = await pool.execute(
        'UPDATE coupons SET is_active = FALSE WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Coupon not found' });
      }

      return res.json({ 
        message: 'Coupon is referenced in other records and has been disabled instead of deleted',
        disabled: true 
      });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const [coupons] = await pool.execute(
      `SELECT * FROM coupons 
       WHERE code = ? AND is_active = TRUE 
       AND (valid_from IS NULL OR valid_from <= NOW())
       AND (valid_until IS NULL OR valid_until >= NOW())`,
      [code]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    const coupon = coupons[0];

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Check minimum order amount
    if (orderAmount < coupon.min_order_amount) {
      return res.status(400).json({ 
        message: `Minimum order amount of $${coupon.min_order_amount} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }
    } else {
      discount = coupon.discount_value;
    }

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discount,
        final_amount: orderAmount - discount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




