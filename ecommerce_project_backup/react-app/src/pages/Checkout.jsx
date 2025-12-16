// // src/pages/Checkout.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const Checkout = () => {
//   const { cartItems, getCartTotal, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
  
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'US',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     nameOnCard: ''
//   });

//   if (cartItems.length === 0) {
//     navigate('/cart');
//     return null;
//   }

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Simulate payment processing
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Clear cart after successful order
//       await clearCart();
      
//       toast.success('Order placed successfully!');
//       navigate('/orders');
//     } catch (error) {
//       toast.error('Failed to place order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const subtotal = getCartTotal();
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Shipping Information */}
//             <div className="space-y-6">
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       ZIP Code
//                     </label>
//                     <input
//                       type="text"
//                       name="zipCode"
//                       value={formData.zipCode}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Card Number
//                   </label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={formData.cardNumber}
//                     onChange={handleInputChange}
//                     placeholder="1234 5678 9012 3456"
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Expiry Date
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleInputChange}
//                       placeholder="MM/YY"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       CVV
//                     </label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={formData.cvv}
//                       onChange={handleInputChange}
//                       placeholder="123"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Name on Card
//                   </label>
//                   <input
//                     type="text"
//                     name="nameOnCard"
//                     value={formData.nameOnCard}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div>
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
//                 <div className="space-y-4 mb-6">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={item.product_image}
//                           alt={item.product_name}
//                           className="w-12 h-12 object-cover rounded"
//                         />
//                         <div>
//                           <p className="font-medium text-gray-800">{item.product_name}</p>
//                           <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                         </div>
//                       </div>
//                       <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="border-t border-gray-200 pt-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax</span>
//                     <span>${tax.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-primary-500 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold mt-6 disabled:opacity-50"
//                 >
//                   {loading ? <LoadingSpinner size="sm" /> : 'Place Order'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


// // src/pages/Checkout.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import { ordersAPI } from '../services/api';

// const Checkout = () => {
//   const { cartItems, getCartTotal, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'US',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     nameOnCard: '',
//     phone: ''
//   });

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       navigate('/cart');
//     }
//   }, [cartItems.length, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Basic input formatting
//     let formattedValue = value;
    
//     if (name === 'cardNumber') {
//       formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
//     } else if (name === 'expiryDate') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
//     } else if (name === 'cvv') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 4);
//     } else if (name === 'zipCode') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 10);
//     } else if (name === 'phone') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: formattedValue
//     }));
//   };

//   const formatImageUrl = (imagePath) => {
//     if (!imagePath || imagePath === '/api/placeholder/300/300') {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//   };

//   const validateForm = () => {
//     const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'];
    
//     for (const field of requiredFields) {
//       if (!formData[field].trim()) {
//         toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     // Validate payment info (basic validation)
//     if (formData.cardNumber.replace(/\s/g, '').length < 16) {
//       toast.error('Please enter a valid card number');
//       return false;
//     }

//     if (!formData.expiryDate.includes('/') || formData.expiryDate.length !== 5) {
//       toast.error('Please enter a valid expiry date (MM/YY)');
//       return false;
//     }

//     if (formData.cvv.length < 3) {
//       toast.error('Please enter a valid CVV');
//       return false;
//     }

//     if (!formData.nameOnCard.trim()) {
//       toast.error('Please enter the name on card');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please login to complete your order');
//       navigate('/login');
//       return;
//     }

//     if (cartItems.length === 0) {
//       toast.error('Your cart is empty');
//       navigate('/cart');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       // Prepare order data matching backend expectations
//       const orderData = {
//         shippingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country,
//           phone: formData.phone,
//           email: formData.email
//         },
//         billingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country
//         },
//         paymentMethod: 'credit_card'
//       };

//       // Create order via API
//       const response = await ordersAPI.createOrder(orderData);
      
//       if (response.data) {
//         // Clear cart after successful order
//         await clearCart();
        
//         toast.success('Order placed successfully!');
//         navigate(`/orders/${response.data.orderId || response.data.order_id}`);
//       } else {
//         throw new Error('Failed to create order');
//       }
//     } catch (error) {
//       console.error('Order creation error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate totals
//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 9.99;
//   const tax = subtotal * 0.1;
//   const total = subtotal + shipping + tax;

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Form */}
//             <div className="space-y-6">
//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="(555) 123-4567"
//                   />
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="123 Main St"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ZIP Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Card Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={formData.cardNumber}
//                     onChange={handleInputChange}
//                     placeholder="1234 5678 9012 3456"
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Expiry Date *
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleInputChange}
//                       placeholder="MM/YY"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       CVV *
//                     </label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={formData.cvv}
//                       onChange={handleInputChange}
//                       placeholder="123"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Name on Card *
//                   </label>
//                   <input
//                     type="text"
//                     name="nameOnCard"
//                     value={formData.nameOnCard}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Order Summary */}
//             <div>
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
//                 <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={formatImageUrl(item.product_image)}
//                           alt={item.product_name}
//                           className="w-12 h-12 object-cover rounded"
//                           onError={(e) => {
//                             e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                           }}
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 truncate">{item.product_name}</p>
//                           <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                           <p className="text-sm font-semibold text-gray-900">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="border-t border-gray-200 pt-4 space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Shipping</span>
//                     <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax</span>
//                     <span>${tax.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Security Notice */}
//                 <div className="mt-4 p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center text-sm text-green-800">
//                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                     Secure checkout with SSL encryption
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-primary-600 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <LoadingSpinner size="sm" />
//                       <span className="ml-2">Processing...</span>
//                     </>
//                   ) : (
//                     `Place Order - $${total.toFixed(2)}`
//                   )}
//                 </button>

//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   By completing your purchase, you agree to our Terms of Service and Privacy Policy.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


// // src/pages/Checkout.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import CouponValidation from '../components/Common/CouponValidation';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import { ordersAPI,couponAPI } from '../services/api';

// const Checkout = () => {
//   const { cartItems, getCartTotal, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'US',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     nameOnCard: '',
//     phone: ''
//   });

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       navigate('/cart');
//     }
//   }, [cartItems.length, navigate]);



//   // In your Checkout component, add this useEffect to auto-apply coupons
// useEffect(() => {
//   const autoApplyCoupons = async () => {
//     // You could auto-apply based on user segment, cart value, etc.
//     if (subtotal > 100 && !appliedCoupon) {
//       try {
//         const response = await couponAPI.validateCoupon('WELCOME10', subtotal);
//         handleCouponApplied(response.data.coupon);
//       } catch (error) {
//         // Silent fail - coupon not applicable
//       }
//     }
//   };

//   autoApplyCoupons();
// }, [subtotal, appliedCoupon]);
// const AvailableCoupons = ({ orderAmount, onCouponClick }) => {
//   const [availableCoupons, setAvailableCoupons] = useState([]);

//   useEffect(() => {
//     const fetchAvailableCoupons = async () => {
//       try {
//         const response = await couponAPI.getCoupons();
//         // Filter coupons that are applicable to current order
//         const applicable = response.data.coupons.filter(coupon => 
//           coupon.is_active && orderAmount >= coupon.min_order_amount
//         );
//         setAvailableCoupons(applicable);
//       } catch (error) {
//         console.error('Error fetching coupons:', error);
//       }
//     };

//     fetchAvailableCoupons();
//   }, [orderAmount]);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Coupons</h3>
//       <div className="space-y-3">
//         {availableCoupons.map(coupon => (
//           <div 
//             key={coupon.id}
//             className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
//             onClick={() => onCouponClick(coupon.code)}
//           >
//             <div>
//               <span className="font-semibold text-gray-800">{coupon.code}</span>
//               <p className="text-sm text-gray-600">
//                 {coupon.discount_type === 'percentage' 
//                   ? `${coupon.discount_value}% off` 
//                   : `$${coupon.discount_value} off`
//                 }
//                 {coupon.min_order_amount > 0 && ` on orders over $${coupon.min_order_amount}`}
//               </p>
//             </div>
//             <button className="text-primary-600 hover:text-primary-700 font-medium">
//               Apply
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Basic input formatting
//     let formattedValue = value;
    
//     if (name === 'cardNumber') {
//       formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
//     } else if (name === 'expiryDate') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
//     } else if (name === 'cvv') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 4);
//     } else if (name === 'zipCode') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 10);
//     } else if (name === 'phone') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: formattedValue
//     }));
//   };

//   const handleCouponApplied = (couponData) => {
//     setDiscount(couponData.discount_amount);
//     setAppliedCoupon(couponData);
//     toast.success(`Coupon "${couponData.code}" applied successfully!`);
//   };

//   const handleCouponRemoved = () => {
//     setDiscount(0);
//     setAppliedCoupon(null);
//     toast.success('Coupon removed');
//   };

  

//   const formatImageUrl = (imagePath) => {
//     if (!imagePath || imagePath === '/api/placeholder/300/300') {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//   };

//   const validateForm = () => {
//     const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'];
    
//     for (const field of requiredFields) {
//       if (!formData[field].trim()) {
//         toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     // Validate payment info (basic validation)
//     if (formData.cardNumber.replace(/\s/g, '').length < 16) {
//       toast.error('Please enter a valid card number');
//       return false;
//     }

//     if (!formData.expiryDate.includes('/') || formData.expiryDate.length !== 5) {
//       toast.error('Please enter a valid expiry date (MM/YY)');
//       return false;
//     }

//     if (formData.cvv.length < 3) {
//       toast.error('Please enter a valid CVV');
//       return false;
//     }

//     if (!formData.nameOnCard.trim()) {
//       toast.error('Please enter the name on card');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please login to complete your order');
//       navigate('/login');
//       return;
//     }

//     if (cartItems.length === 0) {
//       toast.error('Your cart is empty');
//       navigate('/cart');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       // Prepare order data matching backend expectations
//       const orderData = {
//         shippingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country,
//           phone: formData.phone,
//           email: formData.email
//         },
//         billingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country
//         },
//         paymentMethod: 'credit_card',
//         couponCode: appliedCoupon?.code || null,
//         discountAmount: discount
//       };

//       // Create order via API
//       const response = await ordersAPI.createOrder(orderData);
      
//       if (response.data) {
//         // Clear cart after successful order
//         await clearCart();
        
//         toast.success('Order placed successfully!');
//         navigate(`/orders/${response.data.orderId || response.data.order_id}`);
//       } else {
//         throw new Error('Failed to create order');
//       }
//     } catch (error) {
//       console.error('Order creation error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate totals
//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 9.99;
//   const tax = (subtotal - discount) * 0.1; // Tax calculated after discount
//   const total = (subtotal - discount) + shipping + tax;

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Form */}
//             <div className="space-y-6">
//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="(555) 123-4567"
//                   />
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="123 Main St"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ZIP Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Card Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={formData.cardNumber}
//                     onChange={handleInputChange}
//                     placeholder="1234 5678 9012 3456"
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Expiry Date *
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleInputChange}
//                       placeholder="MM/YY"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       CVV *
//                     </label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={formData.cvv}
//                       onChange={handleInputChange}
//                       placeholder="123"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Name on Card *
//                   </label>
//                   <input
//                     type="text"
//                     name="nameOnCard"
//                     value={formData.nameOnCard}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Order Summary */}
//             <div>
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
//                 <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={formatImageUrl(item.product_image)}
//                           alt={item.product_name}
//                           className="w-12 h-12 object-cover rounded"
//                           onError={(e) => {
//                             e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                           }}
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 truncate">{item.product_name}</p>
//                           <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                           <p className="text-sm font-semibold text-gray-900">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Coupon Validation Component */}
//                 <div className="mb-6">
//                   <CouponValidation 
//                     orderAmount={subtotal}
//                     onCouponApplied={handleCouponApplied}
//                     onCouponRemoved={handleCouponRemoved}
//                   />
//                 </div>

//                 <div className="border-t border-gray-200 pt-4 space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
                  
//                   {discount > 0 && (
//                     <div className="flex justify-between text-sm text-green-600">
//                       <span>Discount</span>
//                       <span>-${discount.toFixed(2)}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Shipping</span>
//                     <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax</span>
//                     <span>${tax.toFixed(2)}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>

//                   {appliedCoupon && (
//                     <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
//                       <div className="flex items-center justify-between text-sm text-green-800">
//                         <span>
//                           Coupon <strong>{appliedCoupon.code}</strong> applied
//                           {appliedCoupon.discount_type === 'percentage' && ` (${appliedCoupon.discount_value}% off)`}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Shipping Notice */}
//                 {subtotal < 50 && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <div className="flex items-center text-sm text-blue-800">
//                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                       </svg>
//                       Add ${(50 - subtotal).toFixed(2)} more for free shipping!
//                     </div>
//                   </div>
//                 )}

//                 {/* Security Notice */}
//                 <div className="mt-4 p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center text-sm text-green-800">
//                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                     Secure checkout with SSL encryption
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <LoadingSpinner size="sm" />
//                       <span className="ml-2">Processing...</span>
//                     </>
//                   ) : (
//                     `Place Order - $${total.toFixed(2)}`
//                   )}
//                 </button>

//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   By completing your purchase, you agree to our Terms of Service and Privacy Policy.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;





// // src/pages/Checkout.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import CouponValidation from '../components/Common/CouponValidation';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import { ordersAPI, couponAPI } from '../services/api';

// const Checkout = () => {
//   const { cartItems, getCartTotal, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'US',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     nameOnCard: '',
//     phone: ''
//   });

//   // Calculate totals FIRST - before any effects that use them
//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 9.99;
//   const tax = (subtotal - discount) * 0.1; // Tax calculated after discount
//   const total = (subtotal - discount) + shipping + tax;

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       navigate('/cart');
//     }
//   }, [cartItems.length, navigate]);

//   // // Auto-apply coupons - NOW subtotal is available
//   // useEffect(() => {
//   //   const autoApplyCoupons = async () => {
//   //     // You could auto-apply based on user segment, cart value, etc.
//   //     if (subtotal > 100 && !appliedCoupon) {
//   //       try {
//   //         const response = await couponAPI.validateCoupon('WELCOME10', subtotal);
//   //         handleCouponApplied(response.data.coupon);
//   //       } catch (error) {
//   //         // Silent fail - coupon not applicable
//   //       }
//   //     }
//   //   };

//   //   autoApplyCoupons();
//   // }, [subtotal, appliedCoupon]);

// // In your Checkout component, update the autoApplyCoupons function
// useEffect(() => {
//   const autoApplyCoupons = async () => {
//     // You could auto-apply based on user segment, cart value, etc.
//     if (subtotal > 100 && !appliedCoupon) {
//       try {
//         const response = await couponAPI.validateCoupon('WELCOME10', subtotal);
//         if (response.data.valid) {
//           handleCouponApplied(response.data.coupon);
//         }
//       } catch (error) {
//         // Silent fail - coupon not applicable or API error
//         console.log('Auto-apply coupon failed:', error.response?.data?.message || error.message);
//       }
//     }
//   };

//   autoApplyCoupons();
// }, [subtotal, appliedCoupon]);


//   const AvailableCoupons = ({ orderAmount, onCouponClick }) => {
//     const [availableCoupons, setAvailableCoupons] = useState([]);

//     useEffect(() => {
//       const fetchAvailableCoupons = async () => {
//         try {
//           const response = await couponAPI.getCoupons();
//           // Filter coupons that are applicable to current order
//           const applicable = response.data.coupons.filter(coupon => 
//             coupon.is_active && orderAmount >= coupon.min_order_amount
//           );
//           setAvailableCoupons(applicable);
//         } catch (error) {
//           console.error('Error fetching coupons:', error);
//         }
//       };

//       fetchAvailableCoupons();
//     }, [orderAmount]);

//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Coupons</h3>
//         <div className="space-y-3">
//           {availableCoupons.map(coupon => (
//             <div 
//               key={coupon.id}
//               className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
//               onClick={() => onCouponClick(coupon.code)}
//             >
//               <div>
//                 <span className="font-semibold text-gray-800">{coupon.code}</span>
//                 <p className="text-sm text-gray-600">
//                   {coupon.discount_type === 'percentage' 
//                     ? `${coupon.discount_value}% off` 
//                     : `$${coupon.discount_value} off`
//                   }
//                   {coupon.min_order_amount > 0 && ` on orders over $${coupon.min_order_amount}`}
//                 </p>
//               </div>
//               <button className="text-primary-600 hover:text-primary-700 font-medium">
//                 Apply
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Basic input formatting
//     let formattedValue = value;
    
//     if (name === 'cardNumber') {
//       formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
//     } else if (name === 'expiryDate') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
//     } else if (name === 'cvv') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 4);
//     } else if (name === 'zipCode') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 10);
//     } else if (name === 'phone') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: formattedValue
//     }));
//   };

//   const handleCouponApplied = (couponData) => {
//     setDiscount(couponData.discount_amount);
//     setAppliedCoupon(couponData);
//     toast.success(`Coupon "${couponData.code}" applied successfully!`);
//   };

//   const handleCouponRemoved = () => {
//     setDiscount(0);
//     setAppliedCoupon(null);
//     toast.success('Coupon removed');
//   };

//   const formatImageUrl = (imagePath) => {
//     if (!imagePath || imagePath === '/api/placeholder/300/300') {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//   };

//   const validateForm = () => {
//     const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'];
    
//     for (const field of requiredFields) {
//       if (!formData[field].trim()) {
//         toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     // Validate payment info (basic validation)
//     if (formData.cardNumber.replace(/\s/g, '').length < 16) {
//       toast.error('Please enter a valid card number');
//       return false;
//     }

//     if (!formData.expiryDate.includes('/') || formData.expiryDate.length !== 5) {
//       toast.error('Please enter a valid expiry date (MM/YY)');
//       return false;
//     }

//     if (formData.cvv.length < 3) {
//       toast.error('Please enter a valid CVV');
//       return false;
//     }

//     if (!formData.nameOnCard.trim()) {
//       toast.error('Please enter the name on card');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please login to complete your order');
//       navigate('/login');
//       return;
//     }

//     if (cartItems.length === 0) {
//       toast.error('Your cart is empty');
//       navigate('/cart');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       // Prepare order data matching backend expectations
//       const orderData = {
//         shippingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country,
//           phone: formData.phone,
//           email: formData.email
//         },
//         billingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country
//         },
//         paymentMethod: 'credit_card',
//         couponCode: appliedCoupon?.code || null,
//         discountAmount: discount
//       };

//       // Create order via API
//       const response = await ordersAPI.createOrder(orderData);
      
//       if (response.data) {
//         // Clear cart after successful order
//         await clearCart();
        
//         toast.success('Order placed successfully!');
//         navigate(`/orders/${response.data.orderId || response.data.order_id}`);
//       } else {
//         throw new Error('Failed to create order');
//       }
//     } catch (error) {
//       console.error('Order creation error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Form */}
//             <div className="space-y-6">
//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="(555) 123-4567"
//                   />
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="123 Main St"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ZIP Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Card Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={formData.cardNumber}
//                     onChange={handleInputChange}
//                     placeholder="1234 5678 9012 3456"
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Expiry Date *
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleInputChange}
//                       placeholder="MM/YY"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       CVV *
//                     </label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={formData.cvv}
//                       onChange={handleInputChange}
//                       placeholder="123"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Name on Card *
//                   </label>
//                   <input
//                     type="text"
//                     name="nameOnCard"
//                     value={formData.nameOnCard}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Order Summary */}
//             <div>
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
//                 <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={formatImageUrl(item.product_image)}
//                           alt={item.product_name}
//                           className="w-12 h-12 object-cover rounded"
//                           onError={(e) => {
//                             e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                           }}
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 truncate">{item.product_name}</p>
//                           <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                           <p className="text-sm font-semibold text-gray-900">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Coupon Validation Component */}
//                 <div className="mb-6">
//                   <CouponValidation 
//                     orderAmount={subtotal}
//                     onCouponApplied={handleCouponApplied}
//                     onCouponRemoved={handleCouponRemoved}
//                   />
//                 </div>

//                 <div className="border-t border-gray-200 pt-4 space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
                  
//                   {discount > 0 && (
//                     <div className="flex justify-between text-sm text-green-600">
//                       <span>Discount</span>
//                       <span>-${discount.toFixed(2)}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Shipping</span>
//                     <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax</span>
//                     <span>${tax.toFixed(2)}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>

//                   {appliedCoupon && (
//                     <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
//                       <div className="flex items-center justify-between text-sm text-green-800">
//                         <span>
//                           Coupon <strong>{appliedCoupon.code}</strong> applied
//                           {appliedCoupon.discount_type === 'percentage' && ` (${appliedCoupon.discount_value}% off)`}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Shipping Notice */}
//                 {subtotal < 50 && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <div className="flex items-center text-sm text-blue-800">
//                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                       </svg>
//                       Add ${(50 - subtotal).toFixed(2)} more for free shipping!
//                     </div>
//                   </div>
//                 )}

//                 {/* Security Notice */}
//                 <div className="mt-4 p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center text-sm text-green-800">
//                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                     Secure checkout with SSL encryption
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-primary-600 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <LoadingSpinner size="sm" />
//                       <span className="ml-2">Processing...</span>
//                     </>
//                   ) : (
//                     `Place Order - $${total.toFixed(2)}`
//                   )}
//                 </button>

//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   By completing your purchase, you agree to our Terms of Service and Privacy Policy.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


// // src/pages/Checkout.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import { ordersAPI, couponAPI } from '../services/api';

// const Checkout = () => {
//   const { cartItems, getCartTotal, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [discount, setDiscount] = useState(0); // Initialize as number 0
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'RWANDA',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     nameOnCard: '',
//     phone: ''
//   });

//   // Calculate totals - FIXED: Ensure discount is treated as number
//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 9.99;
//   const discountAmount = Number(discount) || 0; // Ensure discount is a number
//   const tax = (subtotal - discountAmount) * 0.1;
//   const total = (subtotal - discountAmount) + shipping + tax;

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       navigate('/cart');
//     }
//   }, [cartItems.length, navigate]);

//   // Auto-apply the best available coupon - FIXED: Ensure numbers
//   useEffect(() => {
//     const autoApplyBestCoupon = async () => {
//       if (appliedCoupon) return;

//       try {
//         const response = await couponAPI.getCoupons();
//         const availableCoupons = response.data.coupons.filter(coupon => 
//           coupon.is_active && 
//           subtotal >= Number(coupon.min_order_amount) &&
//           (!coupon.valid_from || new Date(coupon.valid_from) <= new Date()) &&
//           (!coupon.valid_until || new Date(coupon.valid_until) >= new Date())
//         );

//         if (availableCoupons.length === 0) return;

//         let bestCoupon = null;
//         let maxDiscount = 0;

//         for (const coupon of availableCoupons) {
//           let discountAmount = 0;
          
//           if (coupon.discount_type === 'percentage') {
//             discountAmount = (subtotal * Number(coupon.discount_value)) / 100;
//             if (coupon.max_discount_amount && discountAmount > Number(coupon.max_discount_amount)) {
//               discountAmount = Number(coupon.max_discount_amount);
//             }
//           } else {
//             discountAmount = Number(coupon.discount_value);
//           }

//           if (discountAmount > maxDiscount) {
//             maxDiscount = discountAmount;
//             bestCoupon = { 
//               ...coupon, 
//               discount_amount: discountAmount 
//             };
//           }
//         }

//         if (bestCoupon) {
//           setDiscount(maxDiscount); // This should be a number
//           setAppliedCoupon(bestCoupon);
//           console.log(`Auto-applied coupon: ${bestCoupon.code} - $${maxDiscount} off`);
//         }
//       } catch (error) {
//         console.log('Auto-apply coupons failed:', error.message);
//       }
//     };

//     autoApplyBestCoupon();
//   }, [subtotal, appliedCoupon]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Basic input formatting
//     let formattedValue = value;
    
//     if (name === 'cardNumber') {
//       formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
//     } else if (name === 'expiryDate') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
//     } else if (name === 'cvv') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 4);
//     } else if (name === 'zipCode') {
//       formattedValue = value.replace(/\D/g, '').substring(0, 10);
//     } else if (name === 'phone') {
//       formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: formattedValue
//     }));
//   };

//   const formatImageUrl = (imagePath) => {
//     if (!imagePath || imagePath === '/api/placeholder/300/300') {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//   };

//   const validateForm = () => {
//     const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'];
    
//     for (const field of requiredFields) {
//       if (!formData[field].trim()) {
//         toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     // Validate payment info (basic validation)
//     if (formData.cardNumber.replace(/\s/g, '').length < 16) {
//       toast.error('Please enter a valid card number');
//       return false;
//     }

//     if (!formData.expiryDate.includes('/') || formData.expiryDate.length !== 5) {
//       toast.error('Please enter a valid expiry date (MM/YY)');
//       return false;
//     }

//     if (formData.cvv.length < 3) {
//       toast.error('Please enter a valid CVV');
//       return false;
//     }

//     if (!formData.nameOnCard.trim()) {
//       toast.error('Please enter the name on card');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please login to complete your order');
//       navigate('/login');
//       return;
//     }

//     if (cartItems.length === 0) {
//       toast.error('Your cart is empty');
//       navigate('/cart');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       // Prepare order data matching backend expectations
//       // const orderData = {
//       //   shippingAddress: {
//       //     firstName: formData.firstName,
//       //     lastName: formData.lastName,
//       //     street: formData.address,
//       //     city: formData.city,
//       //     state: formData.state,
//       //     zipCode: formData.zipCode,
//       //     country: formData.country,
//       //     phone: formData.phone,
//       //     email: formData.email
//       //   },
//       //   billingAddress: {
//       //     firstName: formData.firstName,
//       //     lastName: formData.lastName,
//       //     street: formData.address,
//       //     city: formData.city,
//       //     state: formData.state,
//       //     zipCode: formData.zipCode,
//       //     country: formData.country
//       //   },
//       //   paymentMethod: 'credit_card',
//       //   couponCode: appliedCoupon?.code || null,
//       //   discountAmount: discountAmount // Use the numeric version
//       // };


//       const orderData = {
//   shippingAddress: {
//     firstName: formData.firstName,
//     lastName: formData.lastName,
//     street: formData.address,
//     city: formData.city,
//     state: formData.state,
//     zipCode: formData.zipCode,
//     country: formData.country,
//     phone: formData.phone,
//     email: formData.email
//   },
//   billingAddress: {
//     firstName: formData.firstName,
//     lastName: formData.lastName,
//     street: formData.address,
//     city: formData.city,
//     state: formData.state,
//     zipCode: formData.zipCode,
//     country: formData.country
//   },
//   paymentMethod: 'credit_card',
//   couponCode: appliedCoupon?.code || null, // Make sure this is included
//   discountAmount: discountAmount // This might be redundant now since backend recalculates
// };
//       // Create order via API
//       const response = await ordersAPI.createOrder(orderData);
      
//       if (response.data) {
//         // Clear cart after successful order
//         await clearCart();
        
//         toast.success('Order placed successfully!');
//         navigate(`/orders/${response.data.orderId || response.data.order_id}`);
//       } else {
//         throw new Error('Failed to create order');
//       }
//     } catch (error) {
//       console.error('Order creation error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Form */}
//             <div className="space-y-6">
//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="(555) 123-4567"
//                   />
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="123 Main St"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ZIP Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Card Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={formData.cardNumber}
//                     onChange={handleInputChange}
//                     placeholder="1234 5678 9012 3456"
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Expiry Date *
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleInputChange}
//                       placeholder="MM/YY"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       CVV *
//                     </label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={formData.cvv}
//                       onChange={handleInputChange}
//                       placeholder="123"
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Name on Card *
//                   </label>
//                   <input
//                     type="text"
//                     name="nameOnCard"
//                     value={formData.nameOnCard}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Order Summary */}
//             <div>
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
//                 <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={formatImageUrl(item.product_image)}
//                           alt={item.product_name}
//                           className="w-12 h-12 object-cover rounded"
//                           onError={(e) => {
//                             e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                           }}
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 truncate">{item.product_name}</p>
//                           <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                           <p className="text-sm font-semibold text-gray-900">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* No coupon input - automatically applied */}
//                 {appliedCoupon && (
//                   <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-green-800 font-semibold">
//                           🎉 Discount Applied!
//                         </p>
//                         <p className="text-green-700 text-sm">
//                           {appliedCoupon.code}: {appliedCoupon.discount_type === 'percentage' 
//                             ? `${appliedCoupon.discount_value}% off` 
//                             : `$${appliedCoupon.discount_value} off`
//                           }
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="border-t border-gray-200 pt-4 space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
                  
//                   {discountAmount > 0 && ( // Use discountAmount instead of discount
//                     <div className="flex justify-between text-sm text-green-600">
//                       <span>Discount</span>
//                       <span>-${discountAmount.toFixed(2)}</span> {/* Use discountAmount */}
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Shipping</span>
//                     <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax</span>
//                     <span>${tax.toFixed(2)}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Shipping Notice */}
//                 {subtotal < 50 && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <div className="flex items-center text-sm text-blue-800">
//                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                       </svg>
//                       Add ${(50 - subtotal).toFixed(2)} more for free shipping!
//                     </div>
//                   </div>
//                 )}

//                 {/* Security Notice */}
//                 <div className="mt-4 p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center text-sm text-green-800">
//                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                     Secure checkout with SSL encryption
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-primary-600 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <LoadingSpinner size="sm" />
//                       <span className="ml-2">Processing...</span>
//                     </>
//                   ) : (
//                     `Place Order - $${total.toFixed(2)}`
//                   )}
//                 </button>

//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   By completing your purchase, you agree to our Terms of Service and Privacy Policy.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;




// // src/pages/Checkout.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import { ordersAPI, couponAPI } from '../services/api';

// const Checkout = () => {
//   const { cartItems, getCartTotal, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: '',
//     lastName: '',
//     address: '',
//     city: '',
//     state: '',
//     country: 'RWANDA',
//     phone: ''
//   });

//   // Calculate totals
//   const subtotal = getCartTotal();
//   const shipping = subtotal > 50 ? 0 : 9.99;
//   const discountAmount = Number(discount) || 0;
//   const tax = (subtotal - discountAmount) * 0.1;
//   const total = (subtotal - discountAmount) + shipping + tax;

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       navigate('/cart');
//     }
//   }, [cartItems.length, navigate]);

//   // Auto-apply the best available coupon
//   useEffect(() => {
//     const autoApplyBestCoupon = async () => {
//       if (appliedCoupon) return;

//       try {
//         const response = await couponAPI.getCoupons();
//         const availableCoupons = response.data.coupons.filter(coupon => 
//           coupon.is_active && 
//           subtotal >= Number(coupon.min_order_amount) &&
//           (!coupon.valid_from || new Date(coupon.valid_from) <= new Date()) &&
//           (!coupon.valid_until || new Date(coupon.valid_until) >= new Date())
//         );

//         if (availableCoupons.length === 0) return;

//         let bestCoupon = null;
//         let maxDiscount = 0;

//         for (const coupon of availableCoupons) {
//           let discountAmount = 0;
          
//           if (coupon.discount_type === 'percentage') {
//             discountAmount = (subtotal * Number(coupon.discount_value)) / 100;
//             if (coupon.max_discount_amount && discountAmount > Number(coupon.max_discount_amount)) {
//               discountAmount = Number(coupon.max_discount_amount);
//             }
//           } else {
//             discountAmount = Number(coupon.discount_value);
//           }

//           if (discountAmount > maxDiscount) {
//             maxDiscount = discountAmount;
//             bestCoupon = { 
//               ...coupon, 
//               discount_amount: discountAmount 
//             };
//           }
//         }

//         if (bestCoupon) {
//           setDiscount(maxDiscount);
//           setAppliedCoupon(bestCoupon);
//           console.log(`Auto-applied coupon: ${bestCoupon.code} - $${maxDiscount} off`);
//         }
//       } catch (error) {
//         console.log('Auto-apply coupons failed:', error.message);
//       }
//     };

//     autoApplyBestCoupon();
//   }, [subtotal, appliedCoupon]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     let formattedValue = value;
    
//     if (name === 'phone') {
//       // Format for MTN Rwanda: +2507xxxxxx
//       formattedValue = value.replace(/\D/g, '');
//       if (formattedValue.startsWith('250')) {
//         formattedValue = '+' + formattedValue;
//       } else if (formattedValue.startsWith('0')) {
//         formattedValue = '+25' + formattedValue;
//       } else if (formattedValue.startsWith('7')) {
//         formattedValue = '+250' + formattedValue;
//       }
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: formattedValue
//     }));
//   };

//   const formatImageUrl = (imagePath) => {
//     if (!imagePath || imagePath === '/api/placeholder/300/300') {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//   };

//   const validateForm = () => {
//     const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'phone'];
    
//     for (const field of requiredFields) {
//       if (!formData[field].trim()) {
//         toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     // Validate MTN Rwanda phone number
//     const phoneRegex = /^\+250[78]\d{8}$/;
//     if (!phoneRegex.test(formData.phone)) {
//       toast.error('Please enter a valid MTN Rwanda phone number (e.g., +2507XXXXXXXX)');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please login to complete your order');
//       navigate('/login');
//       return;
//     }

//     if (cartItems.length === 0) {
//       toast.error('Your cart is empty');
//       navigate('/cart');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const orderData = {
//         shippingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           country: formData.country,
//           phone: formData.phone,
//           email: formData.email
//         },
//         billingAddress: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           country: formData.country
//         },
//         paymentMethod: 'mtn_rwanda',
//         couponCode: appliedCoupon?.code || null
//       };

//       // Create order via API
//       const response = await ordersAPI.createOrder(orderData);
      
//       if (response.data) {
//         // Clear cart after successful order
//         await clearCart();
        
//         toast.success('Order placed successfully! You will receive a payment request via MTN Mobile Money.');
//         navigate(`/orders/${response.data.orderId || response.data.order_id}`);
//       } else {
//         throw new Error('Failed to create order');
//       }
//     } catch (error) {
//       console.error('Order creation error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Form */}
//             <div className="space-y-6">
//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     MTN Rwanda Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="+2507XXXXXXXX"
//                   />
//                   <p className="text-sm text-gray-500 mt-1">
//                     You will receive a payment request via MTN Mobile Money
//                   </p>
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="Street Address"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       District *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Country
//                   </label>
//                   <input
//                     type="text"
//                     name="country"
//                     value={formData.country}
//                     readOnly
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
//                   />
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
//                       <span className="text-white font-bold text-lg">MTN</span>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-800">MTN Mobile Money</h3>
//                       <p className="text-sm text-gray-600">
//                         You will receive a payment request on your MTN Rwanda number
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center text-sm text-green-800">
//                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                     Secure payment via MTN Mobile Money
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Order Summary */}
//             <div>
//               <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
//                 <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={formatImageUrl(item.product_image)}
//                           alt={item.product_name}
//                           className="w-12 h-12 object-cover rounded"
//                           onError={(e) => {
//                             e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                           }}
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 truncate">{item.product_name}</p>
//                           <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                           <p className="text-sm font-semibold text-gray-900">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* No coupon input - automatically applied */}
//                 {appliedCoupon && (
//                   <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-green-800 font-semibold">
//                           🎉 Discount Applied!
//                         </p>
//                         <p className="text-green-700 text-sm">
//                           {appliedCoupon.code}: {appliedCoupon.discount_type === 'percentage' 
//                             ? `${appliedCoupon.discount_value}% off` 
//                             : `$${appliedCoupon.discount_value} off`
//                           }
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="border-t border-gray-200 pt-4 space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
                  
//                   {discountAmount > 0 && (
//                     <div className="flex justify-between text-sm text-green-600">
//                       <span>Discount</span>
//                       <span>-${discountAmount.toFixed(2)}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Shipping</span>
//                     <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax</span>
//                     <span>${tax.toFixed(2)}</span>
//                   </div>
                  
//                   <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Shipping Notice */}
//                 {subtotal < 50 && (
//                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                     <div className="flex items-center text-sm text-blue-800">
//                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                       </svg>
//                       Add ${(50 - subtotal).toFixed(2)} more for free shipping!
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-primary-600 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <LoadingSpinner size="sm" />
//                       <span className="ml-2">Processing...</span>
//                     </>
//                   ) : (
//                     `Pay with MTN - $${total.toFixed(2)}`
//                   )}
//                 </button>

//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   By completing your purchase, you agree to our Terms of Service and Privacy Policy.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;





// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { ordersAPI, paymentAPI, couponAPI } from '../services/api';
import PaymentModal from '../components/Payment/PaymentModal';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: 'RWANDA',
    phone: ''
  });

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const discountAmount = Number(discount) || 0;
  const tax = (subtotal - discountAmount) * 0.1;
  const total = (subtotal - discountAmount) + shipping + tax;

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  // Auto-apply the best available coupon
  useEffect(() => {
    const autoApplyBestCoupon = async () => {
      if (appliedCoupon) return;

      try {
        const response = await couponAPI.getCoupons();
        const availableCoupons = response.data.coupons.filter(coupon => 
          coupon.is_active && 
          subtotal >= Number(coupon.min_order_amount) &&
          (!coupon.valid_from || new Date(coupon.valid_from) <= new Date()) &&
          (!coupon.valid_until || new Date(coupon.valid_until) >= new Date())
        );

        if (availableCoupons.length === 0) return;

        let bestCoupon = null;
        let maxDiscount = 0;

        for (const coupon of availableCoupons) {
          let discountAmount = 0;
          
          if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * Number(coupon.discount_value)) / 100;
            if (coupon.max_discount_amount && discountAmount > Number(coupon.max_discount_amount)) {
              discountAmount = Number(coupon.max_discount_amount);
            }
          } else {
            discountAmount = Number(coupon.discount_value);
          }

          if (discountAmount > maxDiscount) {
            maxDiscount = discountAmount;
            bestCoupon = { 
              ...coupon, 
              discount_amount: discountAmount 
            };
          }
        }

        if (bestCoupon) {
          setDiscount(maxDiscount);
          setAppliedCoupon(bestCoupon);
          console.log(`Auto-applied coupon: ${bestCoupon.code} - $${maxDiscount} off`);
        }
      } catch (error) {
        console.log('Auto-apply coupons failed:', error.message);
      }
    };

    autoApplyBestCoupon();
  }, [subtotal, appliedCoupon]);

  // Load supported payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const response = await paymentAPI.getSupportedPaymentMethods('RW');
        setPaymentMethods(response.data.paymentMethods || []);
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      }
    };
    
    loadPaymentMethods();
  }, []);

  // PawaPay payment methods configuration
  const pawapayMethods = {
    momo: {
      name: 'MTN Mobile Money',
      icon: '📱',
      countries: ['RW', 'UG', 'GH'],
      phoneFormat: 'RW'
    },
    airtel_money: {
      name: 'Airtel Money',
      icon: '💳',
      countries: ['RW', 'UG', 'TZ'],
      phoneFormat: 'RW'
    },
    mpesa: {
      name: 'M-Pesa',
      icon: '💰',
      countries: ['KE'],
      phoneFormat: 'KE'
    },
    orange_money: {
      name: 'Orange Money',
      icon: '🍊',
      countries: ['UG'],
      phoneFormat: 'UG'
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    // Reset phone number when method changes
    setPhoneNumber('');
  };
  

  const formatPhoneNumber = (phone, country) => {
    let cleaned = phone.replace(/\D/g, '');
    
    switch (country) {
      case 'RW': // Rwanda
        if (cleaned.startsWith('0')) cleaned = '25' + cleaned;
        else if (cleaned.startsWith('7')) cleaned = '250' + cleaned;
        break;
      case 'KE': // Kenya
        if (cleaned.startsWith('0')) cleaned = '254' + cleaned.substring(1);
        else if (cleaned.startsWith('7')) cleaned = '254' + cleaned;
        break;
      case 'UG': // Uganda
        if (cleaned.startsWith('0')) cleaned = '256' + cleaned.substring(1);
        break;
      default:
        break;
    }
    
    return '+' + cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === 'phone') {
      // Format for MTN Rwanda: +2507xxxxxx
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.startsWith('250')) {
        formattedValue = '+' + formattedValue;
      } else if (formattedValue.startsWith('0')) {
        formattedValue = '+25' + formattedValue;
      } else if (formattedValue.startsWith('7')) {
        formattedValue = '+250' + formattedValue;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

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

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'phone'];
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Validate MTN Rwanda phone number
    const phoneRegex = /^\+250[78]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid MTN Rwanda phone number (e.g., +2507XXXXXXXX)');
      return false;
    }

    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!user) {
  //     toast.error('Please login to complete your order');
  //     navigate('/login');
  //     return;
  //   }

  //   if (cartItems.length === 0) {
  //     toast.error('Your cart is empty');
  //     navigate('/cart');
  //     return;
  //   }

  //   if (!validateForm()) {
  //     return;
  //   }

  //   // Validate payment method and phone number for mobile money
  //   const isMobileMoney = selectedPaymentMethod && 
  //     ['momo', 'airtel_money', 'mpesa', 'orange_money'].includes(selectedPaymentMethod);
    
  //   if (isMobileMoney && !phoneNumber) {
  //     toast.error('Please enter your phone number for mobile money payment');
  //     return;
  //   }

  //   if (!selectedPaymentMethod) {
  //     toast.error('Please select a payment method');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const orderData = {
  //       shippingAddress: {
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         street: formData.address,
  //         city: formData.city,
  //         state: formData.state,
  //         country: formData.country,
  //         phone: formData.phone,
  //         email: formData.email
  //       },
  //       billingAddress: {
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         street: formData.address,
  //         city: formData.city,
  //         state: formData.state,
  //         country: formData.country
  //       },
  //       paymentMethod: selectedPaymentMethod,
  //       couponCode: appliedCoupon?.code || null,
  //       phoneNumber: isMobileMoney ? formatPhoneNumber(phoneNumber, 'RW') : null
  //     };

  //     // Create order via API
  //     const response = await ordersAPI.createOrder(orderData);
      
  //     if (response.data) {
  //       // If PawaPay payment is required, initiate payment
  //       if (response.data.paymentRequired) {
  //         const paymentResponse = await paymentAPI.initiatePawaPayPayment({
  //           orderId: response.data.orderId,
  //           paymentMethod: selectedPaymentMethod,
  //           phoneNumber: formatPhoneNumber(phoneNumber, 'RW')
  //         });

  //         if (paymentResponse.data.success) {
  //           // Clear cart after successful order creation
  //           await clearCart();
            
  //           toast.success('Order created! Please complete the payment.');
  //           navigate(`/orders/${response.data.orderId}`, {
  //             state: { 
  //               paymentPending: true,
  //               paymentInfo: paymentResponse.data.payment
  //             }
  //           });
  //         } else {
  //           throw new Error('Failed to initiate payment');
  //         }
  //       } else {
  //         // For non-PawaPay methods, clear cart and redirect
  //         await clearCart();
  //         toast.success('Order placed successfully!');
  //         navigate(`/orders/${response.data.orderId}`);
  //       }
  //     } else {
  //       throw new Error('Failed to create order');
  //     }
  //   } catch (error) {
  //     console.error('Order creation error:', error);
  //     const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!user) {
    toast.error('Please login to complete your order');
    navigate('/login');
    return;
  }

  if (cartItems.length === 0) {
    toast.error('Your cart is empty');
    navigate('/cart');
    return;
  }

  if (!validateForm()) {
    return;
  }

  // Validate payment method
  const isMobileMoney = selectedPaymentMethod && 
    ['momo', 'airtel_money', 'mpesa', 'orange_money', 'tigo_pesa', 'vodacom_mpesa'].includes(selectedPaymentMethod);
  
  if (!selectedPaymentMethod) {
    toast.error('Please select a payment method');
    return;
  }

  setLoading(true);

  try {
    const orderData = {
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phone: formData.phone,
        email: formData.email
      },
      billingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      paymentMethod: selectedPaymentMethod,
      couponCode: appliedCoupon?.code || null,
      phoneNumber: isMobileMoney ? formData.phone : null
    };

    console.log('📦 Creating order with data:', orderData);

    // Create order via API
    const response = await ordersAPI.createOrder(orderData);
    
    if (response.data) {
      console.log('✅ Order created:', response.data);
      
      // Check if payment is required (for mobile money)
      if (isMobileMoney) {
        console.log('💰 Mobile money payment required, opening payment modal...');
        
        // Format phone number for backend
        const formattedPhone = formatPhoneNumber(formData.phone, 'RW');
        
        // Set the order for payment and open modal
        setSelectedOrderForPayment({
          id: response.data.orderId,
          order_number: response.data.orderNumber,
          total_amount: response.data.totalAmount,
          shipping_address: orderData.shippingAddress,
          // Add payment details for modal
          paymentMethod: selectedPaymentMethod,
          phoneNumber: formattedPhone,
          amount: response.data.totalAmount
        });
        
        // Clear cart after successful order creation
        await clearCart();
        
        // Open payment modal
        setShowPaymentModal(true);
        
      } else {
        // For non-PawaPay methods, clear cart and redirect
        await clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${response.data.orderId}`);
      }
    } else {
      throw new Error('Failed to create order');
    }
  } catch (error) {
    console.error('Order creation error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Payment Modal */}
    {/* <PaymentModal
      isOpen={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      type="order_payment"
      order={selectedOrderForPayment}
    /> */}

    <PaymentModal
  isOpen={showPaymentModal}
  onClose={() => {
    setShowPaymentModal(false);
    
    if (selectedOrderForPayment) {
      navigate(`/orders/${selectedOrderForPayment.id}`);
    }
  }}
  type="order_payment"
  order={selectedOrderForPayment}
  
  onPaymentSuccess={() => {
    toast.success('Payment completed successfully!');
    navigate(`/orders/${selectedOrderForPayment.id}`);
  }}
/>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+2507XXXXXXXX"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    We'll use this to contact you about your order
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Street Address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* PawaPay Mobile Money Methods */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Mobile Money</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(pawapayMethods).map(([key, method]) => (
                        <div
                          key={key}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPaymentMethod === key
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handlePaymentMethodChange(key)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <p className="font-medium text-gray-800">{method.name}</p>
                              <p className="text-sm text-gray-600">Available in {method.countries.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Number Input for Mobile Money */}
                  {selectedPaymentMethod && pawapayMethods[selectedPaymentMethod] && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {pawapayMethods[selectedPaymentMethod].name} Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 0781234567"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        You will receive a payment request on this number
                      </p>
                    </div>
                  )}

                  {/* Credit Card Option */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'credit_card'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePaymentMethodChange('credit_card')}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💳</span>
                      <div>
                        <p className="font-medium text-gray-800">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Pay with your card</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={formatImageUrl(item.product_image)}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No coupon input - automatically applied */}
                {appliedCoupon && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-800 font-semibold">
                          🎉 Discount Applied!
                        </p>
                        <p className="text-green-700 text-sm">
                          {appliedCoupon.code}: {appliedCoupon.discount_type === 'percentage' 
                            ? `${appliedCoupon.discount_value}% off` 
                            : `$${appliedCoupon.discount_value} off`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Notice */}
                {subtotal < 50 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-800">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedPaymentMethod}
                  className="w-full bg-primary-500 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 py-3 rounded-lg  transition-colors font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;