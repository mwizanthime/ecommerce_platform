// // src/pages/admin/CouponManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { couponAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const CouponManagement = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editingCoupon, setEditingCoupon] = useState(null);
//   // const [formData, setFormData] = useState({
//   //   code: '',
//   //   discount_type: 'percentage',
//   //   discount_value: '',
//   //   min_order_amount: '',
//   //   max_discount_amount: '',
//   //   usage_limit: '',
//   //   valid_from: '',
//   //   valid_until: '',
//   //   is_active: true
//   // });



// const [formData, setFormData] = useState({
//   code: '',
//   discount_type: 'percentage',
//   discount_value: '',
//   min_order_amount: '',
//   max_discount_amount: '',
//   usage_limit: '',
//   valid_from: '',
//   valid_until: '',
//   is_active: true,
// });



//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const fetchCoupons = async () => {
//     try {
//       setLoading(true);
//       const response = await couponAPI.getCoupons();
//       setCoupons(response.data.coupons);
//     } catch (error) {
//       console.error('Error fetching coupons:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     if (editingCoupon) {
//   //       await couponAPI.updateCoupon(editingCoupon.id, formData);
//   //     } else {
//   //       await couponAPI.createCoupon(formData);
//   //     }
      
//   //     setShowForm(false);
//   //     setEditingCoupon(null);
//   //     setFormData({
//   //       code: '',
//   //       discount_type: 'percentage',
//   //       discount_value: '',
//   //       min_order_amount: '',
//   //       max_discount_amount: '',
//   //       usage_limit: '',
//   //       valid_from: '',
//   //       valid_until: '',
//   //       is_active: true
//   //     });
//   //     fetchCoupons();
//   //   } catch (error) {
//   //     console.error('Error saving coupon:', error);
//   //   }
//   // };

//   // const handleEdit = (coupon) => {
//   //   setEditingCoupon(coupon);
//   //   setFormData({
//   //     code: coupon.code,
//   //     discount_type: coupon.discount_type,
//   //     discount_value: coupon.discount_value,
//   //     min_order_amount: coupon.min_order_amount || '',
//   //     max_discount_amount: coupon.max_discount_amount || '',
//   //     usage_limit: coupon.usage_limit || '',
//   //     valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
//   //     valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
//   //     is_active: coupon.is_active
//   //   });
//   //   setShowForm(true);
//   // };

//   // const handleDelete = async (id) => {
//   //   if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
//   //   try {
//   //     await couponAPI.deleteCoupon(id);
//   //     fetchCoupons();
//   //   } catch (error) {
//   //     console.error('Error deleting coupon:', error);
//   //   }
//   // };


// // src/pages/admin/CouponManagement.jsx

// // Update the handleEdit function to include auto_apply


// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   try {
// //     // Convert empty strings to null for optional fields
// //     const submitData = {
// //       ...formData,
// //       min_order_amount: formData.min_order_amount || null,
// //       max_discount_amount: formData.max_discount_amount || null,
// //       usage_limit: formData.usage_limit || null,
// //       valid_from: formData.valid_from || null,
// //       valid_until: formData.valid_until || null,
// //       discount_value: parseFloat(formData.discount_value),
// //       auto_apply: formData.auto_apply || false
// //     };

// //     if (editingCoupon) {
// //       await couponAPI.updateCoupon(editingCoupon.id, submitData);
// //       toast.success('Coupon updated successfully');
// //     } else {
// //       await couponAPI.createCoupon(submitData);
// //       toast.success('Coupon created successfully');
// //     }
    
// //     setShowForm(false);
// //     setEditingCoupon(null);
// //     setFormData({
// //       code: '',
// //       discount_type: 'percentage',
// //       discount_value: '',
// //       min_order_amount: '',
// //       max_discount_amount: '',
// //       usage_limit: '',
// //       valid_from: '',
// //       valid_until: '',
// //       is_active: true,
// //       auto_apply: false
// //     });
// //     fetchCoupons();
// //   } catch (error) {
// //     console.error('Error saving coupon:', error);
// //     if (error.response?.data?.message) {
// //       toast.error(error.response.data.message);
// //     } else {
// //       toast.error('Failed to save coupon');
// //     }
// //   }
// // };


// // const handleEdit = (coupon) => {
// //   setEditingCoupon(coupon);
// //   setFormData({
// //     code: coupon.code,
// //     discount_type: coupon.discount_type,
// //     discount_value: coupon.discount_value.toString(),
// //     min_order_amount: coupon.min_order_amount ? coupon.min_order_amount.toString() : '',
// //     max_discount_amount: coupon.max_discount_amount ? coupon.max_discount_amount.toString() : '',
// //     usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : '',
// //     valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
// //     valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
// //     is_active: coupon.is_active,
// //     auto_apply: coupon.auto_apply || false
// //   });
// //   setShowForm(true);
// // };




// // src/pages/admin/CouponManagement.jsx
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     console.log('Submitting form, editingCoupon:', editingCoupon);
//     console.log('Form data:', formData);

//     // Convert empty strings to null for optional fields
//     const submitData = {
//       ...formData,
//       min_order_amount: formData.min_order_amount || null,
//       max_discount_amount: formData.max_discount_amount || null,
//       usage_limit: formData.usage_limit || null,
//       valid_from: formData.valid_from || null,
//       valid_until: formData.valid_until || null,
//       discount_value: parseFloat(formData.discount_value),
//     };

//     if (editingCoupon) {
//       console.log('Updating coupon with ID:', editingCoupon.id);
//       // Make sure editingCoupon.id exists
//       if (!editingCoupon.id) {
//         toast.error('Cannot update coupon: Missing coupon ID');
//         return;
//       }
//       await couponAPI.updateCoupon(editingCoupon.id, submitData);
//       toast.success('Coupon updated successfully');
//     } else {
//       console.log('Creating new coupon');
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
//     });
//     fetchCoupons();
//   } catch (error) {
//     console.error('Error saving coupon:', error);
//     console.error('Error details:', error.response?.data);
//     if (error.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error('Failed to save coupon');
//     }
//   }
// };

// // Fix the handleEdit function to ensure we have the coupon ID
// const handleEdit = (coupon) => {
//   console.log('Editing coupon:', coupon);
  
//   if (!coupon.id) {
//     toast.error('Cannot edit coupon: Missing ID');
//     return;
//   }

//   setEditingCoupon(coupon);
//   setFormData({
//     code: coupon.code || '',
//     discount_type: coupon.discount_type || 'percentage',
//     discount_value: coupon.discount_value ? coupon.discount_value.toString() : '',
//     min_order_amount: coupon.min_order_amount ? coupon.min_order_amount.toString() : '',
//     max_discount_amount: coupon.max_discount_amount ? coupon.max_discount_amount.toString() : '',
//     usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : '',
//     valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
//     valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
//     is_active: coupon.is_active !== undefined ? coupon.is_active : true,
//   });
//   setShowForm(true);
// };




// const handleDelete = async (id) => {
//   if (!window.confirm('Are you sure you want to delete this coupon? If the coupon has been used, it will be disabled instead.')) return;
  
//   try {
//     const response = await couponAPI.deleteCoupon(id);
    
//     if (response.data.disabled) {
//       toast.success('Coupon has been disabled (it was used in orders)');
//     } else {
//       toast.success('Coupon deleted successfully');
//     }
    
//     fetchCoupons();
//   } catch (error) {
//     console.error('Error deleting coupon:', error);
    
//     if (error.response?.status === 400) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error('Failed to delete coupon');
//     }
//   }
// };



//   const formatDate = (dateString) => {
//     if (!dateString) return 'No limit';
//     return new Date(dateString).toLocaleDateString();
//   };

//   const getStatusBadge = (coupon) => {
//     const now = new Date();
//     const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
//     const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;

//     if (!coupon.is_active) {
//       return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Inactive</span>;
//     }

//     if (validFrom && now < validFrom) {
//       return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Scheduled</span>;
//     }

//     if (validUntil && now > validUntil) {
//       return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Expired</span>;
//     }

//     if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
//       return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Limit Reached</span>;
//     }

//     return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>;
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-primary-600 text-gray-700 border border-gray-300 hover:bg-gray-300 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
//         >
//           Create New Coupon
//         </button>
//       </div>

//       {/* Coupon Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
//               </h2>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Coupon Code */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Coupon Code *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.code}
//                       onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       required
//                     />
//                   </div>

//                   {/* Discount Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Discount Type *
//                     </label>
//                     <select
//                       value={formData.discount_type}
//                       onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     >
//                       <option value="percentage">Percentage</option>
//                       <option value="fixed">Fixed Amount</option>
//                     </select>
//                   </div>

//                   {/* Discount Value */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {formData.discount_type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={formData.discount_value}
//                       onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       required
//                     />
//                   </div>

//                   {/* Minimum Order Amount */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Minimum Order Amount
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={formData.min_order_amount}
//                       onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="0.00"
//                     />
//                   </div>

//                   {/* Max Discount Amount (only for percentage) */}
//                   {formData.discount_type === 'percentage' && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Maximum Discount Amount
//                       </label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={formData.max_discount_amount}
//                         onChange={(e) => setFormData({...formData, max_discount_amount: e.target.value})}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       />
//                     </div>
//                   )}
// {/* <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Auto-apply to all users
//   </label>
//   <select
//     value={formData.auto_apply}
//     onChange={(e) => setFormData({...formData, auto_apply: e.target.value === 'true'})}
//     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//   >
//     <option value={false}>No - Users must enter code</option>
//     <option value={true}>Yes - Apply automatically</option>
//   </select>
// </div> */}

//                   {/* Usage Limit */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Usage Limit
//                     </label>
//                     <input
//                       type="number"
//                       min="0"
//                       value={formData.usage_limit}
//                       onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="Unlimited"
//                     />
//                   </div>

//                   {/* Active Status */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Status
//                     </label>
//                     <select
//                       value={formData.is_active}
//                       onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     >
//                       <option value={true}>Active</option>
//                       <option value={false}>Inactive</option>
//                     </select>
//                   </div>

//                   {/* Valid From */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Valid From
//                     </label>
//                     <input
//                       type="date"
//                       value={formData.valid_from}
//                       onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>

//                   {/* Valid Until */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Valid Until
//                     </label>
//                     <input
//                       type="date"
//                       value={formData.valid_until}
//                       onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingCoupon(null);
//                     }}
//                     className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-primary-600 text-gray-700 border border-gray-300 hover:bg-gray-300 rounded-md hover:bg-primary-700 transition-colors"
//                   >
//                     {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Coupons Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Code
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Discount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Min Order
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Usage
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Valid Until
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {coupons.map((coupon) => (
//                 <tr key={coupon.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {coupon.discount_type === 'percentage' 
//                         ? `${coupon.discount_value}%`
//                         : `$${coupon.discount_value}`
//                       }
//                       {coupon.max_discount_amount && 
//                         <div className="text-xs text-gray-500">
//                           Max: ${coupon.max_discount_amount}
//                         </div>
//                       }
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       ${coupon.min_order_amount || '0.00'}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {coupon.used_count || 0}
//                       {coupon.usage_limit && ` / ${coupon.usage_limit}`}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {formatDate(coupon.valid_until)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getStatusBadge(coupon)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     <button
//                       onClick={() => handleEdit(coupon)}
//                       className="text-primary-600 hover:text-primary-900 transition-colors"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(coupon.id)}
//                       className="text-red-600 hover:text-red-900 transition-colors"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {coupons.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-500 text-lg">No coupons found</div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="mt-4 bg-primary-600 text-gray-700 border border-gray-300 hover:bg-gray-300 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
//           >
//             Create your first coupon
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CouponManagement;





// src/pages/admin/CouponManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { couponAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph } from "docx";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

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

  // Ref for the print table
  const printTableRef = useRef(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No limit';
    return new Date(dateString).toLocaleDateString();
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form, editingCoupon:', editingCoupon);
      console.log('Form data:', formData);

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

  // Function to filter coupons by period
  const filterCouponsByPeriod = (period) => {
    const now = new Date();
    const startOfDay = (d) => {
      const r = new Date(d);
      r.setHours(0, 0, 0, 0);
      return r;
    };
    const endOfDay = (d) => {
      const r = new Date(d);
      r.setHours(23, 59, 59, 999);
      return r;
    };

    let start, end;

    if (period === 'daily') {
      start = startOfDay(now);
      end = endOfDay(now);
    } else if (period === 'weekly') {
      start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
      end = endOfDay(now);
    } else if (period === 'monthly') {
      start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      end = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    } else if (period === 'yearly') {
      start = startOfDay(new Date(now.getFullYear(), 0, 1));
      end = endOfDay(new Date(now.getFullYear(), 11, 31));
    } else {
      // All coupons
      return coupons;
    }

    return coupons.filter(coupon => {
      const couponDate = coupon.created_at ? new Date(coupon.created_at) : coupon.valid_from ? new Date(coupon.valid_from) :              coupon.valid_until ? new Date(coupon.valid_until) : null;
      
      if (!couponDate) return false;
      return couponDate >= start && couponDate <= end;
    });
  };

  // New print function without opening new window
  const handlePrint = (period) => {
    const filteredCoupons = filterCouponsByPeriod(period);
    
    if (!filteredCoupons || filteredCoupons.length === 0) {
      toast('No coupons found for selected period', { icon: 'ℹ️' });
      return;
    }

    // Create a clone of the coupon-table div
    const table = document.getElementById('coupon-table');
    if (!table) return;
    
    const clonedTable = table.cloneNode(true);
    
    // Remove action buttons from cloned table
    clonedTable.querySelectorAll("tr").forEach(row => {
      const actionsCell = row.querySelector("td:last-child, th:last-child");
      if (actionsCell) {
        row.removeChild(actionsCell);
      }
    });

    // Create a hidden iframe for printing
    const printWindow = document.createElement('iframe');
    printWindow.style.position = 'absolute';
    printWindow.style.width = '0';
    printWindow.style.height = '0';
    printWindow.style.border = 'none';
    
    const title = `${period.charAt(0).toUpperCase() + period.slice(1)} Coupon Report`;
    
    document.body.appendChild(printWindow);
    
    const printDocument = printWindow.contentWindow.document;
    printDocument.open();
    printDocument.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .print-header { text-align: center; margin-bottom: 20px; }
            .print-header h2 { margin: 0; }
            .print-date { color: #666; font-size: 14px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>${title}</h2>
            <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
            <div class="print-date">Total Coupons: ${filteredCoupons.length}</div>
          </div>
          ${clonedTable.outerHTML}
        </body>
      </html>
    `);
    printDocument.close();
    
    // Trigger print
    printWindow.contentWindow.focus();
    printWindow.contentWindow.print();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(printWindow);
    }, 1000);
  };

  // Updated download functions using autoTable for better PDF formatting
  const downloadPDF = () => {
    if (!window.confirm("Export to PDF?")) return;
    
    const doc = new jsPDF();
    const title = "Coupon Report";
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 10);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 18);
    
    // Prepare data for table
    const headers = [['Code', 'Discount', 'Min Order', 'Usage', 'Valid Until', 'Status']];
    
    const data = coupons.map(coupon => [
      coupon.code,
      coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`,
      `$${coupon.min_order_amount || '0.00'}`,
      `${coupon.used_count || 0}${coupon.usage_limit ? '/' + coupon.usage_limit : ''}`,
      formatDate(coupon.valid_until),
      coupon.is_active ? 'Active' : 'Inactive'
    ]);
    
    // Add table using autoTable
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 25,
      styles: { 
        fontSize: 10, 
        cellPadding: 3,
        font: 'helvetica'
      },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { top: 25 },
      theme: 'grid'
    });
    
    doc.save("coupon-report.pdf");
  };

  const downloadWord = async () => {
    if (!window.confirm("Export to Word?")) return;
    
    const children = coupons.map(coupon => 
      new Paragraph(
        `${coupon.code} - ${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : '$'} - Min: $${coupon.min_order_amount || '0.00'} - Used: ${coupon.used_count || 0} - Valid: ${formatDate(coupon.valid_until)}`
      )
    );

    const doc = new Document({ 
      sections: [{ 
        children: [
          new Paragraph("Coupon Report"),
          new Paragraph(`Generated on: ${new Date().toLocaleString()}`),
          ...children
        ] 
      }] 
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "coupon-report.docx");
  };

  const downloadExcel = () => {
    if (!window.confirm("Export to Excel?")) return;
    
    // Prepare data for Excel
    const excelData = coupons.map(coupon => ({
      'Code': coupon.code,
      'Discount Type': coupon.discount_type,
      'Discount Value': coupon.discount_value,
      'Min Order Amount': coupon.min_order_amount || '0.00',
      'Max Discount Amount': coupon.max_discount_amount || '',
      'Usage Limit': coupon.usage_limit || '',
      'Used Count': coupon.used_count || 0,
      'Valid From': coupon.valid_from ? formatDate(coupon.valid_from) : '',
      'Valid Until': coupon.valid_until ? formatDate(coupon.valid_until) : '',
      'Status': coupon.is_active ? 'Active' : 'Inactive',
      'Created At': coupon.created_at ? formatDate(coupon.created_at) : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Coupons");
    XLSX.writeFile(workbook, "coupon-report.xlsx");
  };

  const downloadCSV = () => {
    if (!window.confirm("Export to CSV?")) return;
    
    // Prepare data for CSV
    const csvData = coupons.map(coupon => ({
      'Code': coupon.code,
      'Discount Type': coupon.discount_type,
      'Discount Value': coupon.discount_value,
      'Min Order Amount': coupon.min_order_amount || '0.00',
      'Max Discount Amount': coupon.max_discount_amount || '',
      'Usage Limit': coupon.usage_limit || '',
      'Used Count': coupon.used_count || 0,
      'Valid From': coupon.valid_from ? formatDate(coupon.valid_from) : '',
      'Valid Until': coupon.valid_until ? formatDate(coupon.valid_until) : '',
      'Status': coupon.is_active ? 'Active' : 'Inactive'
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "coupon-report.csv");
  };

  const downloadFile = (type) => {
    if (type === "pdf") return downloadPDF();
    if (type === "word") return downloadWord();
    if (type === "excel") return downloadExcel();
    if (type === "csv") return downloadCSV();
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

      {/* Actions (Print & Download) */}
      <div className="flex items-center gap-3">
        {/* PRINT DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowPrintMenu(!showPrintMenu)}
            className="bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Print Reports ▾
          </button>

          {showPrintMenu && (
            <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <button onClick={() => handlePrint('daily')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">Daily Report</button>
              <button onClick={() => handlePrint('weekly')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">Weekly Report</button>
              <button onClick={() => handlePrint('monthly')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">Monthly Report</button>
              <button onClick={() => handlePrint('yearly')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">Yearly Report</button>
              <button onClick={() => handlePrint('all')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">All Coupons</button>
            </div>
          )}
        </div>

        {/* DOWNLOAD DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Download ▾
          </button>

          {showDownloadMenu && (
            <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <button onClick={() => downloadFile('pdf')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">PDF</button>
              <button onClick={() => downloadFile('word')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">Word (.docx)</button>
              <button onClick={() => downloadFile('excel')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">Excel (.xlsx)</button>
              <button onClick={() => downloadFile('csv')} className="block px-4 py-2 text-left hover:bg-gray-100 w-full">CSV</button>
            </div>
          )}
        </div>
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
      <div id="coupon-table" className="bg-white rounded-lg shadow-md overflow-hidden">
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