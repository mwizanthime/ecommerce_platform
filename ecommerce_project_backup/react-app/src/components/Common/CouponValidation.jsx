// src/components/Common/CouponValidation.jsx
import React, { useState } from 'react';
import { couponAPI } from '../../services/api';

const CouponValidation = ({ orderAmount, onCouponApplied, onCouponRemoved }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState('');

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await couponAPI.validateCoupon(couponCode, orderAmount);
      const couponData = response.data.coupon;
      
      setAppliedCoupon(couponData);
      onCouponApplied(couponData);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      onCouponRemoved();
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setError('');
    onCouponRemoved();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply Coupon</h3>
      
      {!appliedCoupon ? (
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={loading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button 
            onClick={validateCoupon}
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span className="font-semibold text-green-800">
                Coupon <strong>{appliedCoupon.code}</strong> applied successfully!
              </span>
            </div>
            <button 
              onClick={removeCoupon}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
          <div className="text-green-700">
            Discount: -${appliedCoupon.discount_amount.toFixed(2)}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
};

export default CouponValidation;