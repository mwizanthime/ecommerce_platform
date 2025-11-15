// src/pages/admin/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import { couponAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  // const [formData, setFormData] = useState({
  //   code: '',
  //   discount_type: 'percentage',
  //   discount_value: '',
  //   min_order_amount: '',
  //   max_discount_amount: '',
  //   usage_limit: '',
  //   valid_from: '',
  //   valid_until: '',
  //   is_active: true
  // });



const [formData, setFormData] = useState({
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_amount: '',
  max_discount_amount: '',
  usage_limit: '',
  valid_from: '',
  valid_until: '',
  is_active: true,
});



  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getCoupons();
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editingCoupon) {
  //       await couponAPI.updateCoupon(editingCoupon.id, formData);
  //     } else {
  //       await couponAPI.createCoupon(formData);
  //     }
      
  //     setShowForm(false);
  //     setEditingCoupon(null);
  //     setFormData({
  //       code: '',
  //       discount_type: 'percentage',
  //       discount_value: '',
  //       min_order_amount: '',
  //       max_discount_amount: '',
  //       usage_limit: '',
  //       valid_from: '',
  //       valid_until: '',
  //       is_active: true
  //     });
  //     fetchCoupons();
  //   } catch (error) {
  //     console.error('Error saving coupon:', error);
  //   }
  // };

  // const handleEdit = (coupon) => {
  //   setEditingCoupon(coupon);
  //   setFormData({
  //     code: coupon.code,
  //     discount_type: coupon.discount_type,
  //     discount_value: coupon.discount_value,
  //     min_order_amount: coupon.min_order_amount || '',
  //     max_discount_amount: coupon.max_discount_amount || '',
  //     usage_limit: coupon.usage_limit || '',
  //     valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
  //     valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
  //     is_active: coupon.is_active
  //   });
  //   setShowForm(true);
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
  //   try {
  //     await couponAPI.deleteCoupon(id);
  //     fetchCoupons();
  //   } catch (error) {
  //     console.error('Error deleting coupon:', error);
  //   }
  // };


// src/pages/admin/CouponManagement.jsx

// Update the handleEdit function to include auto_apply


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     // Convert empty strings to null for optional fields
//     const submitData = {
//       ...formData,
//       min_order_amount: formData.min_order_amount || null,
//       max_discount_amount: formData.max_discount_amount || null,
//       usage_limit: formData.usage_limit || null,
//       valid_from: formData.valid_from || null,
//       valid_until: formData.valid_until || null,
//       discount_value: parseFloat(formData.discount_value),
//       auto_apply: formData.auto_apply || false
//     };

//     if (editingCoupon) {
//       await couponAPI.updateCoupon(editingCoupon.id, submitData);
//       toast.success('Coupon updated successfully');
//     } else {
//       await couponAPI.createCoupon(submitData);
//       toast.success('Coupon created successfully');
//     }
    
//     setShowForm(false);
//     setEditingCoupon(null);
//     setFormData({
//       code: '',
//       discount_type: 'percentage',
//       discount_value: '',
//       min_order_amount: '',
//       max_discount_amount: '',
//       usage_limit: '',
//       valid_from: '',
//       valid_until: '',
//       is_active: true,
//       auto_apply: false
//     });
//     fetchCoupons();
//   } catch (error) {
//     console.error('Error saving coupon:', error);
//     if (error.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error('Failed to save coupon');
//     }
//   }
// };


// const handleEdit = (coupon) => {
//   setEditingCoupon(coupon);
//   setFormData({
//     code: coupon.code,
//     discount_type: coupon.discount_type,
//     discount_value: coupon.discount_value.toString(),
//     min_order_amount: coupon.min_order_amount ? coupon.min_order_amount.toString() : '',
//     max_discount_amount: coupon.max_discount_amount ? coupon.max_discount_amount.toString() : '',
//     usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : '',
//     valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
//     valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
//     is_active: coupon.is_active,
//     auto_apply: coupon.auto_apply || false
//   });
//   setShowForm(true);
// };




// src/pages/admin/CouponManagement.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('Submitting form, editingCoupon:', editingCoupon);
    console.log('Form data:', formData);

    // Convert empty strings to null for optional fields
    const submitData = {
      ...formData,
      min_order_amount: formData.min_order_amount || null,
      max_discount_amount: formData.max_discount_amount || null,
      usage_limit: formData.usage_limit || null,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
      discount_value: parseFloat(formData.discount_value),
    };

    if (editingCoupon) {
      console.log('Updating coupon with ID:', editingCoupon.id);
      // Make sure editingCoupon.id exists
      if (!editingCoupon.id) {
        toast.error('Cannot update coupon: Missing coupon ID');
        return;
      }
      await couponAPI.updateCoupon(editingCoupon.id, submitData);
      toast.success('Coupon updated successfully');
    } else {
      console.log('Creating new coupon');
      await couponAPI.createCoupon(submitData);
      toast.success('Coupon created successfully');
    }
    
    setShowForm(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      max_discount_amount: '',
      usage_limit: '',
      valid_from: '',
      valid_until: '',
      is_active: true,
    });
    fetchCoupons();
  } catch (error) {
    console.error('Error saving coupon:', error);
    console.error('Error details:', error.response?.data);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to save coupon');
    }
  }
};

// Fix the handleEdit function to ensure we have the coupon ID
const handleEdit = (coupon) => {
  console.log('Editing coupon:', coupon);
  
  if (!coupon.id) {
    toast.error('Cannot edit coupon: Missing ID');
    return;
  }

  setEditingCoupon(coupon);
  setFormData({
    code: coupon.code || '',
    discount_type: coupon.discount_type || 'percentage',
    discount_value: coupon.discount_value ? coupon.discount_value.toString() : '',
    min_order_amount: coupon.min_order_amount ? coupon.min_order_amount.toString() : '',
    max_discount_amount: coupon.max_discount_amount ? coupon.max_discount_amount.toString() : '',
    usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : '',
    valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
    valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
    is_active: coupon.is_active !== undefined ? coupon.is_active : true,
  });
  setShowForm(true);
};




const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this coupon? If the coupon has been used, it will be disabled instead.')) return;
  
  try {
    const response = await couponAPI.deleteCoupon(id);
    
    if (response.data.disabled) {
      toast.success('Coupon has been disabled (it was used in orders)');
    } else {
      toast.success('Coupon deleted successfully');
    }
    
    fetchCoupons();
  } catch (error) {
    console.error('Error deleting coupon:', error);
    
    if (error.response?.status === 400) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to delete coupon');
    }
  }
};



  const formatDate = (dateString) => {
    if (!dateString) return 'No limit';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
    const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;

    if (!coupon.is_active) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactive</span>;
    }

    if (validFrom && now < validFrom) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Scheduled</span>;
    }

    if (validUntil && now > validUntil) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Expired</span>;
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Limit Reached</span>;
    }

    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-gray-700 border border-gray-300 hover:bg-gray-300 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create New Coupon
        </button>
      </div>

      {/* Coupon Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coupon Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  {/* Discount Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.discount_type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  {/* Minimum Order Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Max Discount Amount (only for percentage) */}
                  {formData.discount_type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Discount Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.max_discount_amount}
                        onChange={(e) => setFormData({...formData, max_discount_amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}
{/* <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Auto-apply to all users
  </label>
  <select
    value={formData.auto_apply}
    onChange={(e) => setFormData({...formData, auto_apply: e.target.value === 'true'})}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
  >
    <option value={false}>No - Users must enter code</option>
    <option value={true}>Yes - Apply automatically</option>
  </select>
</div> */}

                  {/* Usage Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Unlimited"
                    />
                  </div>

                  {/* Active Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>

                  {/* Valid From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From
                    </label>
                    <input
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Valid Until */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCoupon(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-gray-700 border border-gray-300 hover:bg-gray-300 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.discount_type === 'percentage' 
                        ? `${coupon.discount_value}%`
                        : `$${coupon.discount_value}`
                      }
                      {coupon.max_discount_amount && 
                        <div className="text-xs text-gray-500">
                          Max: ${coupon.max_discount_amount}
                        </div>
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${coupon.min_order_amount || '0.00'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.used_count || 0}
                      {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(coupon.valid_until)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(coupon)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-primary-600 hover:text-primary-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No coupons found</div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-primary-600 text-gray-700 border border-gray-300 hover:bg-gray-300 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create your first coupon
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;