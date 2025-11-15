// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { sellerOrdersAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const SellerOrders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [markingAsPaid, setMarkingAsPaid] = useState(null);

//   useEffect(() => {
//     fetchSellerOrders();
//   }, []);

//   // const fetchSellerOrders = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const response = await sellerOrdersAPI.getSellerOrders();
//   //     setOrders(response.data.orders || []);
//   //   } catch (error) {
//   //     console.error('Error fetching seller orders:', error);
//   //     toast.error('Failed to load orders');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const fetchSellerOrders = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching seller orders for user:', user);
      
//       const response = await sellerOrdersAPI.getSellerOrders();
//       console.log('Seller orders API response:', response);
      
//       if (response.data.success === false) {
//         throw new Error(response.data.message);
//       }
      
//       setOrders(response.data.orders || []);
//     } catch (error) {
//       console.error('Error fetching seller orders:', error);
//       console.error('Error details:', error.response?.data);
      
//       // More specific error messages
//       if (error.response?.status === 401) {
//         toast.error('Please login again to view your orders');
//       } else if (error.response?.status === 403) {
//         toast.error('You do not have permission to view seller orders');
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error('Failed to load orders. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };



//   const handleMarkAsPaid = async (orderId) => {
//     try {
//       setMarkingAsPaid(orderId);
//       const response = await sellerOrdersAPI.markOrderAsPaid(orderId);
      
//       toast.success(response.data.message);
      
//       // Refresh orders list
//       await fetchSellerOrders();
//       setSelectedOrder(null);
//     } catch (error) {
//       console.error('Error marking order as paid:', error);
//       toast.error(error.response?.data?.message || 'Failed to mark order as paid');
//     } finally {
//       setMarkingAsPaid(null);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       refunded: 'bg-blue-100 text-blue-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const calculateSellerTotal = (order) => {
//     return order.items.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   };

//   const OrderDetailsModal = ({ order, onClose }) => {
//     if (!order) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Order Details: {order.order_number}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Order Summary */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
//                 <p><strong>Order Number:</strong> {order.order_number}</p>
//                 <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
//                 <p><strong>Customer:</strong> {order.user_email}</p>
//                 <p><strong>Status:</strong> 
//                   <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                   </span>
//                 </p>
//                 <p><strong>Payment Status:</strong> 
//                   <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                     {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                   </span>
//                 </p>
//                 <p><strong>Your Products Total:</strong> ${calculateSellerTotal(order).toFixed(2)}</p>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
//                 {order.shipping_address && (
//                   <>
//                     <p><strong>Name:</strong> {order.shipping_address.firstName} {order.shipping_address.lastName}</p>
//                     <p><strong>Address:</strong> {order.shipping_address.street}</p>
//                     <p><strong>City:</strong> {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
//                     <p><strong>Country:</strong> {order.shipping_address.country}</p>
//                     <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
//                     <p><strong>Email:</strong> {order.shipping_address.email}</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Order Items */}
//             <div className="mb-6">
//               <h3 className="font-semibold text-gray-800 mb-4">Your Products in this Order</h3>
//               <div className="space-y-4">
//                 {order.items?.map((item, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                     <div className="flex items-center space-x-4">
//                       <img
//                         src={item.product_image || '/api/placeholder/300/300'}
//                         alt={item.product_name}
//                         className="w-16 h-16 object-cover rounded"
//                         onError={(e) => {
//                           e.target.src = '/api/placeholder/300/300';
//                         }}
//                       />
//                       <div>
//                         <p className="font-medium text-gray-800">{item.product_name}</p>
//                         <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
//                         <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-gray-800">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </p>
//                       <p className="text-sm text-gray-600">${item.price} each</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Seller Total */}
//             <div className="border-t border-gray-200 pt-4">
//               <div className="flex justify-between items-center text-lg font-bold">
//                 <span>Your Products Total:</span>
//                 <span>${calculateSellerTotal(order).toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
//               {order.payment_status === 'pending' && (
//                 <button
//                   onClick={() => handleMarkAsPaid(order.id)}
//                   disabled={markingAsPaid === order.id}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                 >
//                   {markingAsPaid === order.id ? 'Marking as Paid...' : 'Mark as Paid'}
//                 </button>
//               )}
              
//               <button
//                 onClick={() => window.print()}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
//               >
//                 Print Order
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">My Sales Orders</h1>
        
//         {orders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">No orders yet</h2>
//             <p className="text-gray-600 mb-6">Orders containing your products will appear here</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 {/* Order Header */}
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         Order #{order.order_number}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Placed on {formatDate(order.created_at)} by {order.user_email}
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                         {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Summary */}
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <p className="text-gray-600">
//                         <strong>{order.item_count || order.items?.length || 0}</strong> of your items
//                       </p>
//                       <p className="text-lg font-bold text-gray-800">
//                         Your Total: ${calculateSellerTotal(order).toFixed(2)}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
                      
//                       {order.payment_status === 'pending' && (
//                         <button
//                           onClick={() => handleMarkAsPaid(order.id)}
//                           disabled={markingAsPaid === order.id}
//                           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                         >
//                           {markingAsPaid === order.id ? 'Marking...' : 'Mark as Paid'}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Quick Items Preview */}
//                   {order.items && order.items.length > 0 && (
//                     <div className="mt-4 flex space-x-2 overflow-x-auto">
//                       {order.items.slice(0, 4).map((item, index) => (
//                         <div key={index} className="flex-shrink-0 w-16 h-16 relative">
//                           <img
//                             src={item.product_image || '/api/placeholder/300/300'}
//                             alt={item.product_name}
//                             className="w-full h-full object-cover rounded border border-gray-200"
//                             onError={(e) => {
//                               e.target.src = '/api/placeholder/300/300';
//                             }}
//                           />
//                           {index === 3 && order.items.length > 4 && (
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
//                               <span className="text-white text-xs font-bold">
//                                 +{order.items.length - 4}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrder && (
//           <OrderDetailsModal 
//             order={selectedOrder} 
//             onClose={() => setSelectedOrder(null)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;







// // src/pages/seller/SellerOrders.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { sellerOrdersAPI, ordersAPI } from '../../services/api'; // Import both
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import DeliveryTracking from '../../components/DeliveryTracking';

// const SellerOrders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [markingAsPaid, setMarkingAsPaid] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');

//   useEffect(() => {
//     fetchSellerOrders();
//   }, []);

//   const fetchSellerOrders = async () => {
//     try {
//       setLoading(true);
//       console.log('Current user:', user);
//       console.log('Available APIs:', { sellerOrdersAPI, ordersAPI });
      
//       let response;
      
//       // Try sellerOrdersAPI first, fallback to ordersAPI
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.getSellerOrders === 'function') {
//         console.log('Using sellerOrdersAPI');
//         response = await sellerOrdersAPI.getSellerOrders();
//       } else if (ordersAPI && typeof ordersAPI.getSellerOrders === 'function') {
//         console.log('Using ordersAPI.getSellerOrders');
//         response = await ordersAPI.getSellerOrders();
//       } else {
//         // Last resort - direct API call
//         console.log('Making direct API call');
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch('http://localhost:5000/api/orders/seller/orders', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       console.log('API Response:', response);
      
//       if (response.data.success === false) {
//         throw new Error(response.data.message);
//       }
      
//       setOrders(response.data.orders || []);
//       console.log('Orders loaded:', response.data.orders?.length || 0);
      
//     } catch (error) {
//       console.error('Full error object:', error);
//       console.error('Error response:', error.response);
      
//       // Specific error handling
//       if (error.response?.status === 403) {
//         toast.error('Access denied. Please check your seller permissions.');
//       } else if (error.response?.status === 401) {
//         toast.error('Please login again');
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else if (error.message) {
//         toast.error(error.message);
//       } else {
//         toast.error('Failed to load orders. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsPaid = async (orderId) => {
//     try {
//       setMarkingAsPaid(orderId);
      
//       let response;
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.markOrderAsPaid === 'function') {
//         response = await sellerOrdersAPI.markOrderAsPaid(orderId);
//       } else if (ordersAPI && typeof ordersAPI.markOrderAsPaid === 'function') {
//         response = await ordersAPI.markOrderAsPaid(orderId);
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/mark-paid`, {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       toast.success(response.data.message);
//       await fetchSellerOrders();
//       setSelectedOrder(null);
//     } catch (error) {
//       console.error('Error marking order as paid:', error);
//       toast.error(error.response?.data?.message || 'Failed to mark order as paid');
//     } finally {
//       setMarkingAsPaid(null);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       refunded: 'bg-blue-100 text-blue-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const calculateSellerTotal = (order) => {
//     if (!order.items) return 0;
//     return order.items.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   };

//    const OrderDetailsModal = ({ order, onClose }) => {
//     if (!order) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Order Details: {order.order_number}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Tab Navigation */}
//             <div className="border-b border-gray-200 mb-6">
//               <nav className="flex -mb-px">
//                 <button
//                   onClick={() => setActiveTab('details')}
//                   className={`py-3 px-6 text-center border-b-2 font-medium text-sm ${
//                     activeTab === 'details'
//                       ? 'border-primary-500 text-primary-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   Order Details
//                 </button>
//                 {(order.status === 'shipped' || order.status === 'delivered') && (
//                   <button
//                     onClick={() => setActiveTab('tracking')}
//                     className={`py-3 px-6 text-center border-b-2 font-medium text-sm ${
//                       activeTab === 'tracking'
//                         ? 'border-primary-500 text-primary-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     }`}
//                   >
//                     Delivery Tracking
//                   </button>
//                 )}
//               </nav>
//             </div>

//             {/* Tab Content */}
//             {activeTab === 'details' && (
//               <>
//                 {/* Your existing seller order details */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
//                     <p><strong>Order Number:</strong> {order.order_number}</p>
//                     <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
//                     <p><strong>Customer:</strong> {order.user_email}</p>
//                     <p><strong>Status:</strong> 
//                       <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                       </span>
//                     </p>
//                     <p><strong>Payment Status:</strong> 
//                       <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                         {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                       </span>
//                     </p>
//                     <p><strong>Your Products Total:</strong> ${calculateSellerTotal(order).toFixed(2)}</p>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
//                     {order.shipping_address && (
//                       <>
//                         <p><strong>Name:</strong> {order.shipping_address.firstName} {order.shipping_address.lastName}</p>
//                         <p><strong>Address:</strong> {order.shipping_address.street}</p>
//                         <p><strong>City:</strong> {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
//                         <p><strong>Country:</strong> {order.shipping_address.country}</p>
//                         <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
//                         <p><strong>Email:</strong> {order.shipping_address.email}</p>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-800 mb-4">Your Products in this Order</h3>
//                   <div className="space-y-4">
//                     {order.items?.map((item, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center space-x-4">
//                           <img
//                             src={item.product_image || '/api/placeholder/300/300'}
//                             alt={item.product_name}
//                             className="w-16 h-16 object-cover rounded"
//                             onError={(e) => {
//                               e.target.src = '/api/placeholder/300/300';
//                             }}
//                           />
//                           <div>
//                             <p className="font-medium text-gray-800">{item.product_name}</p>
//                             <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
//                             <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-gray-800">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                           <p className="text-sm text-gray-600">${item.price} each</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Seller Total */}
//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="flex justify-between items-center text-lg font-bold">
//                     <span>Your Products Total:</span>
//                     <span>${calculateSellerTotal(order).toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
//                   {order.payment_status === 'pending' && (
//                     <button
//                       onClick={() => handleMarkAsPaid(order.id)}
//                       disabled={markingAsPaid === order.id}
//                       className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                     >
//                       {markingAsPaid === order.id ? 'Marking as Paid...' : 'Mark as Paid'}
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={() => window.print()}
//                     className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
//                   >
//                     Print Order
//                   </button>
//                 </div>
//               </>
//             )}

//             {activeTab === 'tracking' && (
//               <div>
//                 <DeliveryTracking order={order} user={user} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">My Sales Orders</h1>
        
//         {orders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">No orders yet</h2>
//             <p className="text-gray-600 mb-6">Orders containing your products will appear here</p>
//             <button 
//               onClick={fetchSellerOrders}
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Refresh
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 {/* Order Header */}
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         Order #{order.order_number}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Placed on {formatDate(order.created_at)} by {order.user_email || 'Customer'}
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                         {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                         {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Unknown'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Summary */}
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <p className="text-gray-600">
//                         <strong>{order.items?.length || 0}</strong> of your items
//                       </p>
//                       <p className="text-lg font-bold text-gray-800">
//                         Your Total: ${calculateSellerTotal(order).toFixed(2)}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
                      
//                       {order.payment_status === 'pending' && (
//                         <button
//                           onClick={() => handleMarkAsPaid(order.id)}
//                           disabled={markingAsPaid === order.id}
//                           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                         >
//                           {markingAsPaid === order.id ? 'Marking...' : 'Mark as Paid'}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Quick Items Preview */}
//                   {order.items && order.items.length > 0 && (
//                     <div className="mt-4 flex space-x-2 overflow-x-auto">
//                       {order.items.slice(0, 4).map((item, index) => (
//                         <div key={index} className="flex-shrink-0 w-16 h-16 relative">
//                           <img
//                             src={item.product_image || '/api/placeholder/300/300'}
//                             alt={item.product_name}
//                             className="w-full h-full object-cover rounded border border-gray-200"
//                             onError={(e) => {
//                               e.target.src = '/api/placeholder/300/300';
//                             }}
//                           />
//                           {index === 3 && order.items.length > 4 && (
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
//                               <span className="text-white text-xs font-bold">
//                                 +{order.items.length - 4}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrder && (
//           <OrderDetailsModal 
//             order={selectedOrder} 
//             onClose={() => setSelectedOrder(null)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;





// // src/pages/seller/SellerOrders.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { sellerOrdersAPI, ordersAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const SellerOrders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [markingAsPaid, setMarkingAsPaid] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     fetchSellerOrders();
//   }, []);

//   const fetchSellerOrders = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching seller orders for user:', user);
      
//       let response;
      
//       // Try sellerOrdersAPI first, fallback to ordersAPI
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.getSellerOrders === 'function') {
//         console.log('Using sellerOrdersAPI');
//         response = await sellerOrdersAPI.getSellerOrders();
//       } else if (ordersAPI && typeof ordersAPI.getSellerOrders === 'function') {
//         console.log('Using ordersAPI.getSellerOrders');
//         response = await ordersAPI.getSellerOrders();
//       } else {
//         // Direct API call as fallback
//         console.log('Making direct API call for seller orders');
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch('http://localhost:5000/api/orders/seller/orders', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       console.log('Seller Orders API Response:', response);
      
//       if (response.data.success === false) {
//         throw new Error(response.data.message);
//       }
      
//       setOrders(response.data.orders || []);
//       console.log('Orders loaded:', response.data.orders?.length || 0);
      
//     } catch (error) {
//       console.error('Full error object:', error);
//       console.error('Error response:', error.response);
      
//       // Specific error handling
//       if (error.response?.status === 403) {
//         toast.error('Access denied. Please check your seller permissions.');
//       } else if (error.response?.status === 401) {
//         toast.error('Please login again');
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else if (error.message) {
//         toast.error(error.message);
//       } else {
//         toast.error('Failed to load orders. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsPaid = async (orderId) => {
//     try {
//       setMarkingAsPaid(orderId);
      
//       let response;
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.markOrderAsPaid === 'function') {
//         response = await sellerOrdersAPI.markOrderAsPaid(orderId);
//       } else if (ordersAPI && typeof ordersAPI.markOrderAsPaid === 'function') {
//         response = await ordersAPI.markOrderAsPaid(orderId);
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/mark-paid`, {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       toast.success(response.data.message);
//       await fetchSellerOrders();
//       setSelectedOrder(null);
//     } catch (error) {
//       console.error('Error marking order as paid:', error);
//       toast.error(error.response?.data?.message || 'Failed to mark order as paid');
//     } finally {
//       setMarkingAsPaid(null);
//     }
//   };

//   const handleUpdateOrderStatus = async (orderId, newStatus) => {
//     try {
//       setUpdatingStatus(orderId);
      
//       let response;
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.updateOrderStatus === 'function') {
//         response = await sellerOrdersAPI.updateOrderStatus(orderId, { status: newStatus });
//       } else if (ordersAPI && typeof ordersAPI.updateOrderStatus === 'function') {
//         response = await ordersAPI.updateOrderStatus(orderId, { status: newStatus });
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/status`, {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ status: newStatus })
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       toast.success(response.data.message);
//       await fetchSellerOrders();
      
//       // Update selected order if it's currently open
//       if (selectedOrder && selectedOrder.id === orderId) {
//         setSelectedOrder(prev => ({
//           ...prev,
//           status: newStatus
//         }));
//       }
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       toast.error(error.response?.data?.message || 'Failed to update order status');
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       refunded: 'bg-blue-100 text-blue-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const calculateSellerTotal = (order) => {
//     if (!order.items) return 0;
//     return order.items.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   };

//   const getStatusOptions = (currentStatus) => {
//     const statusFlow = {
//       pending: ['confirmed', 'cancelled'],
//       confirmed: ['shipped', 'cancelled'],
//       shipped: ['delivered'],
//       delivered: [],
//       cancelled: []
//     };
    
//     return statusFlow[currentStatus] || [];
//   };

//   const getNextStatusLabel = (status) => {
//     const labels = {
//       confirmed: 'Confirm Order',
//       shipped: 'Mark as Shipped',
//       delivered: 'Mark as Delivered',
//       cancelled: 'Cancel Order'
//     };
//     return labels[status] || `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`;
//   };

//   const filteredOrders = orders.filter(order => {
//     if (statusFilter === 'all') return true;
//     return order.status === statusFilter;
//   });

//   const OrderDetailsModal = ({ order, onClose }) => {
//     if (!order) return null;

//     const statusOptions = getStatusOptions(order.status);
//     const canUpdateStatus = statusOptions.length > 0;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Order Details: {order.order_number}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Tab Navigation */}
//             <div className="border-b border-gray-200 mb-6">
//               <nav className="flex -mb-px">
//                 <button
//                   onClick={() => setActiveTab('details')}
//                   className={`py-3 px-6 text-center border-b-2 font-medium text-sm ${
//                     activeTab === 'details'
//                       ? 'border-primary-500 text-primary-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   Order Details
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('actions')}
//                   className={`py-3 px-6 text-center border-b-2 font-medium text-sm ${
//                     activeTab === 'actions'
//                       ? 'border-primary-500 text-primary-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   Manage Order
//                 </button>
//               </nav>
//             </div>

//             {/* Tab Content */}
//             {activeTab === 'details' && (
//               <>
//                 {/* Order Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
//                     <div className="space-y-2">
//                       <p><strong>Order Number:</strong> {order.order_number}</p>
//                       <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
//                       <p><strong>Customer:</strong> {order.user_email}</p>
//                       <p><strong>Status:</strong> 
//                         <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                         </span>
//                       </p>
//                       <p><strong>Payment Status:</strong> 
//                         <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                           {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                         </span>
//                       </p>
//                       <p><strong>Your Products Total:</strong> ${calculateSellerTotal(order).toFixed(2)}</p>
//                       {order.tracking_number && (
//                         <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
//                     {order.shipping_address ? (
//                       <div className="space-y-2">
//                         <p><strong>Name:</strong> {order.shipping_address.firstName} {order.shipping_address.lastName}</p>
//                         <p><strong>Address:</strong> {order.shipping_address.street}</p>
//                         <p><strong>City:</strong> {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
//                         <p><strong>Country:</strong> {order.shipping_address.country}</p>
//                         <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
//                         <p><strong>Email:</strong> {order.shipping_address.email}</p>
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">No shipping address provided</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-800 mb-4">Your Products in this Order</h3>
//                   <div className="space-y-4">
//                     {order.items?.map((item, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center space-x-4">
//                           <img
//                             src={item.image_url || `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/placeholder/300/300`}
//                             alt={item.product_name}
//                             className="w-16 h-16 object-cover rounded"
//                             onError={(e) => {
//                               e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/placeholder/300/300`;
//                             }}
//                           />
//                           <div>
//                             <p className="font-medium text-gray-800">{item.product_name}</p>
//                             <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
//                             <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                             <p className="text-sm text-gray-600">Price: ${item.price} each</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-gray-800">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Seller Total */}
//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="flex justify-between items-center text-lg font-bold">
//                     <span>Your Products Total:</span>
//                     <span>${calculateSellerTotal(order).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </>
//             )}

//             {activeTab === 'actions' && (
//               <div className="space-y-6">
//                 {/* Payment Status Management */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Management</h3>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-600">Current Payment Status:</p>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                         {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                       </span>
//                     </div>
//                     {order.payment_status === 'pending' && (
//                       <button
//                         onClick={() => handleMarkAsPaid(order.id)}
//                         disabled={markingAsPaid === order.id}
//                         className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                       >
//                         {markingAsPaid === order.id ? 'Marking as Paid...' : 'Mark as Paid'}
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Status Management */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Management</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-gray-600">Current Status:</p>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                         </span>
//                       </div>
//                     </div>

//                     {canUpdateStatus && (
//                       <div>
//                         <p className="text-gray-600 mb-3">Update Order Status:</p>
//                         <div className="flex flex-wrap gap-2">
//                           {statusOptions.map((status) => (
//                             <button
//                               key={status}
//                               onClick={() => handleUpdateOrderStatus(order.id, status)}
//                               disabled={updatingStatus === order.id}
//                               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                                 status === 'cancelled' 
//                                   ? 'bg-red-500 text-white hover:bg-red-600' 
//                                   : 'bg-blue-500 text-white hover:bg-blue-600'
//                               } disabled:opacity-50`}
//                             >
//                               {updatingStatus === order.id ? 'Updating...' : getNextStatusLabel(status)}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {!canUpdateStatus && (
//                       <p className="text-gray-500 text-sm">
//                         No further actions available for {order.status} orders.
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Timeline */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center text-green-600">
//                       <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
//                       <span>Order placed - {formatDate(order.created_at)}</span>
//                     </div>
//                     {order.status !== 'pending' && (
//                       <div className="flex items-center text-blue-600">
//                         <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
//                         <span>Order confirmed</span>
//                       </div>
//                     )}
//                     {(order.status === 'shipped' || order.status === 'delivered') && (
//                       <div className="flex items-center text-purple-600">
//                         <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
//                         <span>Order shipped</span>
//                       </div>
//                     )}
//                     {order.status === 'delivered' && (
//                       <div className="flex items-center text-green-600">
//                         <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
//                         <span>Order delivered</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => window.print()}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
//               >
//                 Print Order
//               </button>
              
//               <button
//                 onClick={onClose}
//                 className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">My Sales Orders</h1>
          
//           {/* Status Filter */}
//           <div className="flex items-center space-x-4">
//             <label className="text-sm font-medium text-gray-700">Filter by status:</label>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//             >
//               <option value="all">All Orders</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
            
//             <button
//               onClick={fetchSellerOrders}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
        
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {statusFilter === 'all' 
//                 ? 'Orders containing your products will appear here' 
//                 : `No orders with ${statusFilter} status found`}
//             </p>
//             {statusFilter !== 'all' && (
//               <button 
//                 onClick={() => setStatusFilter('all')}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 View All Orders
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredOrders.map((order) => (
//               <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 {/* Order Header */}
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         Order #{order.order_number}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Placed on {formatDate(order.created_at)} by {order.user_email || 'Customer'}
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                         {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                         {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Unknown'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Summary */}
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <p className="text-gray-600">
//                         <strong>{order.items?.length || 0}</strong> of your items
//                       </p>
//                       <p className="text-lg font-bold text-gray-800">
//                         Your Total: ${calculateSellerTotal(order).toFixed(2)}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => {
//                           setSelectedOrder(order);
//                           setActiveTab('details');
//                         }}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
                      
//                       {order.payment_status === 'pending' && (
//                         <button
//                           onClick={() => handleMarkAsPaid(order.id)}
//                           disabled={markingAsPaid === order.id}
//                           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                         >
//                           {markingAsPaid === order.id ? 'Marking...' : 'Mark as Paid'}
//                         </button>
//                       )}

//                       {getStatusOptions(order.status).length > 0 && (
//                         <button
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setActiveTab('actions');
//                           }}
//                           className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
//                         >
//                           Manage Status
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Quick Items Preview */}
//                   {order.items && order.items.length > 0 && (
//                     <div className="mt-4 flex space-x-2 overflow-x-auto">
//                       {order.items.slice(0, 4).map((item, index) => (
//                         <div key={index} className="flex-shrink-0 w-16 h-16 relative">
//                           <img
//                             src={item.image_url || `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/placeholder/300/300`}
//                             alt={item.product_name}
//                             className="w-full h-full object-cover rounded border border-gray-200"
//                             onError={(e) => {
//                               e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/placeholder/300/300`;
//                             }}
//                           />
//                           {index === 3 && order.items.length > 4 && (
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
//                               <span className="text-white text-xs font-bold">
//                                 +{order.items.length - 4}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrder && (
//           <OrderDetailsModal 
//             order={selectedOrder} 
//             onClose={() => setSelectedOrder(null)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;





// // src/pages/seller/SellerOrders.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { sellerOrdersAPI, ordersAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const SellerOrders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [markingAsPaid, setMarkingAsPaid] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     fetchSellerOrders();
//   }, []);

//   // Add this function to handle image URLs properly
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     // If it's just a filename without path, add the uploads path
//     if (!imagePath.includes('/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//     }

//     // Default case
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//   };

//   const fetchSellerOrders = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching seller orders for user:', user);
      
//       let response;
      
//       // Try sellerOrdersAPI first, fallback to ordersAPI
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.getSellerOrders === 'function') {
//         console.log('Using sellerOrdersAPI');
//         response = await sellerOrdersAPI.getSellerOrders();
//       } else if (ordersAPI && typeof ordersAPI.getSellerOrders === 'function') {
//         console.log('Using ordersAPI.getSellerOrders');
//         response = await ordersAPI.getSellerOrders();
//       } else {
//         // Direct API call as fallback
//         console.log('Making direct API call for seller orders');
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch('http://localhost:5000/api/orders/seller/orders', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       console.log('Seller Orders API Response:', response);
      
//       if (response.data.success === false) {
//         throw new Error(response.data.message);
//       }
      
//       setOrders(response.data.orders || []);
//       console.log('Orders loaded:', response.data.orders?.length || 0);
      
//     } catch (error) {
//       console.error('Full error object:', error);
//       console.error('Error response:', error.response);
      
//       // Specific error handling
//       if (error.response?.status === 403) {
//         toast.error('Access denied. Please check your seller permissions.');
//       } else if (error.response?.status === 401) {
//         toast.error('Please login again');
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else if (error.message) {
//         toast.error(error.message);
//       } else {
//         toast.error('Failed to load orders. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsPaid = async (orderId) => {
//     try {
//       setMarkingAsPaid(orderId);
      
//       let response;
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.markOrderAsPaid === 'function') {
//         response = await sellerOrdersAPI.markOrderAsPaid(orderId);
//       } else if (ordersAPI && typeof ordersAPI.markOrderAsPaid === 'function') {
//         response = await ordersAPI.markOrderAsPaid(orderId);
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/mark-paid`, {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       toast.success(response.data.message);
//       await fetchSellerOrders();
//       setSelectedOrder(null);
//     } catch (error) {
//       console.error('Error marking order as paid:', error);
//       toast.error(error.response?.data?.message || 'Failed to mark order as paid');
//     } finally {
//       setMarkingAsPaid(null);
//     }
//   };

//   // const handleUpdateOrderStatus = async (orderId, newStatus) => {
//   //   try {
//   //     setUpdatingStatus(orderId);
      
//   //     let response;
//   //     if (sellerOrdersAPI && typeof sellerOrdersAPI.updateOrderStatus === 'function') {
//   //       response = await sellerOrdersAPI.updateOrderStatus(orderId, { status: newStatus });
//   //     } else if (ordersAPI && typeof ordersAPI.updateOrderStatus === 'function') {
//   //       response = await ordersAPI.updateOrderStatus(orderId, { status: newStatus });
//   //     } else {
//   //       const token = localStorage.getItem('token');
//   //       const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/status`, {
//   //         method: 'PATCH',
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`,
//   //           'Content-Type': 'application/json'
//   //         },
//   //         body: JSON.stringify({ status: newStatus })
//   //       });
        
//   //       if (!apiResponse.ok) {
//   //         throw new Error(`HTTP error! status: ${apiResponse.status}`);
//   //       }
        
//   //       response = { data: await apiResponse.json() };
//   //     }
      
//   //     toast.success(response.data.message);
//   //     await fetchSellerOrders();
      
//   //     // Update selected order if it's currently open
//   //     if (selectedOrder && selectedOrder.id === orderId) {
//   //       setSelectedOrder(prev => ({
//   //         ...prev,
//   //         status: newStatus
//   //       }));
//   //     }
//   //   } catch (error) {
//   //     console.error('Error updating order status:', error);
//   //     toast.error(error.response?.data?.message || 'Failed to update order status');
//   //   } finally {
//   //     setUpdatingStatus(null);
//   //   }
//   // };


//   // Update the handleUpdateOrderStatus function
// const handleUpdateOrderStatus = async (orderItemId, newStatus, trackingNumber = null) => {
//   try {
//     setUpdatingStatus(orderItemId);
    
//     const updateData = { status: newStatus };
//     if (trackingNumber) {
//       updateData.tracking_number = trackingNumber;
//     }

//     let response;
//     if (sellerOrdersAPI && typeof sellerOrdersAPI.updateOrderItemStatus === 'function') {
//       response = await sellerOrdersAPI.updateOrderItemStatus(orderItemId, updateData);
//     } else if (ordersAPI && typeof ordersAPI.updateOrderItemStatus === 'function') {
//       response = await ordersAPI.updateOrderItemStatus(orderItemId, updateData);
//     } else {
//       const token = localStorage.getItem('token');
//       const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/order-items/${orderItemId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updateData)
//       });
      
//       if (!apiResponse.ok) {
//         throw new Error(`HTTP error! status: ${apiResponse.status}`);
//       }
      
//       response = { data: await apiResponse.json() };
//     }
    
//     toast.success(response.data.message);
//     await fetchSellerOrders();
    
//   } catch (error) {
//     console.error('Error updating order item status:', error);
//     toast.error(error.response?.data?.message || 'Failed to update order item status');
//   } finally {
//     setUpdatingStatus(null);
//   }
// };






//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       refunded: 'bg-blue-100 text-blue-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const calculateSellerTotal = (order) => {
//     if (!order.items) return 0;
//     return order.items.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   };

//   const getStatusOptions = (currentStatus) => {
//     const statusFlow = {
//       pending: ['confirmed', 'cancelled'],
//       confirmed: ['shipped', 'cancelled'],
//       shipped: ['delivered'],
//       delivered: [],
//       cancelled: []
//     };
    
//     return statusFlow[currentStatus] || [];
//   };

//   const getNextStatusLabel = (status) => {
//     const labels = {
//       confirmed: 'Confirm Order',
//       shipped: 'Mark as Shipped',
//       delivered: 'Mark as Delivered',
//       cancelled: 'Cancel Order'
//     };
//     return labels[status] || `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`;
//   };

//   const filteredOrders = orders.filter(order => {
//     if (statusFilter === 'all') return true;
//     return order.status === statusFilter;
//   });

//   // const OrderDetailsModal = ({ order, onClose }) => {
//   //   if (!order) return null;

//   //   const statusOptions = getStatusOptions(order.status);
//   //   const canUpdateStatus = statusOptions.length > 0;

//   //   return (
//   //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//   //       <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//   //         <div className="p-6">
//   //           <div className="flex justify-between items-center mb-6">
//   //             <h2 className="text-2xl font-bold text-gray-800">
//   //               Order Details: {order.order_number}
//   //             </h2>
//   //             <button
//   //               onClick={onClose}
//   //               className="text-gray-500 hover:text-gray-700 text-2xl"
//   //             >
//   //               &times;
//   //             </button>
//   //           </div>

//   //           {/* Tab Navigation */}
//   //           <div className="border-b border-gray-200 mb-6">
//   //             <nav className="flex -mb-px">
//   //               <button
//   //                 onClick={() => setActiveTab('details')}
//   //                 className={`py-3 px-6 text-center border-b-2 font-medium text-sm ${
//   //                   activeTab === 'details'
//   //                     ? 'border-primary-500 text-primary-600'
//   //                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//   //                 }`}
//   //               >
//   //                 Order Details
//   //               </button>
//   //               <button
//   //                 onClick={() => setActiveTab('actions')}
//   //                 className={`py-3 px-6 text-center border-b-2 font-medium text-sm ${
//   //                   activeTab === 'actions'
//   //                     ? 'border-primary-500 text-primary-600'
//   //                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//   //                 }`}
//   //               >
//   //                 Manage Order
//   //               </button>
//   //             </nav>
//   //           </div>

//   //           {/* Tab Content */}
//   //           {activeTab === 'details' && (
//   //             <>
//   //               {/* Order Information */}
//   //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//   //                 <div className="bg-gray-50 p-4 rounded-lg">
//   //                   <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
//   //                   <div className="space-y-2">
//   //                     <p><strong>Order Number:</strong> {order.order_number}</p>
//   //                     <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
//   //                     <p><strong>Customer:</strong> {order.user_email}</p>
//   //                     <p><strong>Status:</strong> 
//   //                       <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//   //                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//   //                       </span>
//   //                     </p>
//   //                     <p><strong>Payment Status:</strong> 
//   //                       <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//   //                         {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//   //                       </span>
//   //                     </p>
//   //                     <p><strong>Your Products Total:</strong> ${calculateSellerTotal(order).toFixed(2)}</p>
//   //                     {order.tracking_number && (
//   //                       <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
//   //                     )}
//   //                   </div>
//   //                 </div>

//   //                 <div className="bg-gray-50 p-4 rounded-lg">
//   //                   <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
//   //                   {order.shipping_address ? (
//   //                     <div className="space-y-2">
//   //                       <p><strong>Name:</strong> {order.shipping_address.firstName} {order.shipping_address.lastName}</p>
//   //                       <p><strong>Address:</strong> {order.shipping_address.street}</p>
//   //                       <p><strong>City:</strong> {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
//   //                       <p><strong>Country:</strong> {order.shipping_address.country}</p>
//   //                       <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
//   //                       <p><strong>Email:</strong> {order.shipping_address.email}</p>
//   //                     </div>
//   //                   ) : (
//   //                     <p className="text-gray-500">No shipping address provided</p>
//   //                   )}
//   //                 </div>
//   //               </div>

//   //               {/* Order Items */}
//   //               <div className="mb-6">
//   //                 <h3 className="font-semibold text-gray-800 mb-4">Your Products in this Order</h3>
//   //                 <div className="space-y-4">
//   //                   {order.items?.map((item, index) => (
//   //                     <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//   //                       <div className="flex items-center space-x-4">
//   //                         <img
//   //                           src={item.product_image ? getImageUrl(item.product_image) : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`}
//   //                           alt={item.product_name}
//   //                           className="w-16 h-16 object-cover rounded"
//   //                           onError={(e) => {
//   //                             e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//   //                           }}
//   //                         />
//   //                         <div>
//   //                           <p className="font-medium text-gray-800">{item.product_name}</p>
//   //                           <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
//   //                           <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//   //                           <p className="text-sm text-gray-600">Price: ${item.price} each</p>
//   //                         </div>
//   //                       </div>
//   //                       <div className="text-right">
//   //                         <p className="font-semibold text-gray-800">
//   //                           ${(item.price * item.quantity).toFixed(2)}
//   //                         </p>
//   //                       </div>
//   //                     </div>
//   //                   ))}
//   //                 </div>
//   //               </div>

//   //               {/* Seller Total */}
//   //               <div className="border-t border-gray-200 pt-4">
//   //                 <div className="flex justify-between items-center text-lg font-bold">
//   //                   <span>Your Products Total:</span>
//   //                   <span>${calculateSellerTotal(order).toFixed(2)}</span>
//   //                 </div>
//   //               </div>
//   //             </>
//   //           )}

//   //           {activeTab === 'actions' && (
//   //             <div className="space-y-6">
//   //               {/* Payment Status Management */}
//   //               <div className="bg-white border border-gray-200 rounded-lg p-6">
//   //                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Management</h3>
//   //                 <div className="flex items-center justify-between">
//   //                   <div>
//   //                     <p className="text-gray-600">Current Payment Status:</p>
//   //                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//   //                       {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//   //                     </span>
//   //                   </div>
//   //                   {order.payment_status === 'pending' && (
//   //                     <button
//   //                       onClick={() => handleMarkAsPaid(order.id)}
//   //                       disabled={markingAsPaid === order.id}
//   //                       className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//   //                     >
//   //                       {markingAsPaid === order.id ? 'Marking as Paid...' : 'Mark as Paid'}
//   //                     </button>
//   //                   )}
//   //                 </div>
//   //               </div>

//   //               {/* Order Status Management */}
//   //               <div className="bg-white border border-gray-200 rounded-lg p-6">
//   //                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Management</h3>
//   //                 <div className="space-y-4">
//   //                   <div className="flex items-center justify-between">
//   //                     <div>
//   //                       <p className="text-gray-600">Current Status:</p>
//   //                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//   //                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//   //                       </span>
//   //                     </div>
//   //                   </div>

//   //                   {canUpdateStatus && (
//   //                     <div>
//   //                       <p className="text-gray-600 mb-3">Update Order Status:</p>
//   //                       <div className="flex flex-wrap gap-2">
//   //                         {statusOptions.map((status) => (
//   //                           <button
//   //                             key={status}
//   //                             onClick={() => handleUpdateOrderStatus(order.id, status)}
//   //                             disabled={updatingStatus === order.id}
//   //                             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//   //                               status === 'cancelled' 
//   //                                 ? 'bg-red-500 text-white hover:bg-red-600' 
//   //                                 : 'bg-blue-500 text-white hover:bg-blue-600'
//   //                             } disabled:opacity-50`}
//   //                           >
//   //                             {updatingStatus === order.id ? 'Updating...' : getNextStatusLabel(status)}
//   //                           </button>
//   //                         ))}
//   //                       </div>
//   //                     </div>
//   //                   )}

//   //                   {!canUpdateStatus && (
//   //                     <p className="text-gray-500 text-sm">
//   //                       No further actions available for {order.status} orders.
//   //                     </p>
//   //                   )}
//   //                 </div>
//   //               </div>

//   //               {/* Order Timeline */}
//   //               <div className="bg-white border border-gray-200 rounded-lg p-6">
//   //                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h3>
//   //                 <div className="space-y-3">
//   //                   <div className="flex items-center text-green-600">
//   //                     <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
//   //                     <span>Order placed - {formatDate(order.created_at)}</span>
//   //                   </div>
//   //                   {order.status !== 'pending' && (
//   //                     <div className="flex items-center text-blue-600">
//   //                       <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
//   //                       <span>Order confirmed</span>
//   //                     </div>
//   //                   )}
//   //                   {(order.status === 'shipped' || order.status === 'delivered') && (
//   //                     <div className="flex items-center text-purple-600">
//   //                       <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
//   //                       <span>Order shipped</span>
//   //                     </div>
//   //                   )}
//   //                   {order.status === 'delivered' && (
//   //                     <div className="flex items-center text-green-600">
//   //                       <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
//   //                       <span>Order delivered</span>
//   //                     </div>
//   //                   )}
//   //                 </div>
//   //               </div>
//   //             </div>
//   //           )}

//   //           {/* Action Buttons */}
//   //           <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
//   //             <button
//   //               onClick={() => window.print()}
//   //               className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
//   //             >
//   //               Print Order
//   //             </button>
              
//   //             <button
//   //               onClick={onClose}
//   //               className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
//   //             >
//   //               Close
//   //             </button>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // };

// // Update the OrderDetailsModal to show item-level status
// const OrderDetailsModal = ({ order, onClose }) => {
//   if (!order) return null;

//   const getStatusOptions = (currentStatus) => {
//     const statusFlow = {
//       pending: ['confirmed', 'cancelled'],
//       confirmed: ['shipped', 'cancelled'],
//       shipped: ['delivered'],
//       delivered: [],
//       cancelled: []
//     };
    
//     return statusFlow[currentStatus] || [];
//   };

//   const getNextStatusLabel = (status) => {
//     const labels = {
//       confirmed: 'Confirm',
//       shipped: 'Mark as Shipped',
//       delivered: 'Mark as Delivered',
//       cancelled: 'Cancel'
//     };
//     return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Order Details: {order.order_number}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 text-2xl"
//             >
//               &times;
//             </button>
//           </div>

//           {/* Order Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
//               <div className="space-y-2">
//                 <p><strong>Order Number:</strong> {order.order_number}</p>
//                 <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
//                 <p><strong>Customer:</strong> {order.user_email}</p>
//                 <p><strong>Payment Status:</strong> 
//                   <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor('paid')}`}>
//                     Paid
//                   </span>
//                 </p>
//                 <p><strong>Your Products Total:</strong> ${calculateSellerTotal(order).toFixed(2)}</p>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
//               {order.shipping_address ? (
//                 <div className="space-y-2">
//                   <p><strong>Name:</strong> {order.shipping_address.firstName} {order.shipping_address.lastName}</p>
//                   <p><strong>Address:</strong> {order.shipping_address.street}</p>
//                   <p><strong>City:</strong> {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
//                   <p><strong>Country:</strong> {order.shipping_address.country}</p>
//                   <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
//                   <p><strong>Email:</strong> {order.shipping_address.email}</p>
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No shipping address provided</p>
//               )}
//             </div>
//           </div>

//           {/* Order Items with Individual Status */}
//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-800 mb-4">Your Products in this Order</h3>
//             <div className="space-y-4">
//               {order.items?.map((item) => {
//                 const statusOptions = getStatusOptions(item.status);
//                 const canUpdateStatus = statusOptions.length > 0;

//                 return (
//                   <div key={item.order_item_id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={item.product_image ? getImageUrl(item.product_image) : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`}
//                           alt={item.product_name}
//                           className="w-16 h-16 object-cover rounded"
//                           onError={(e) => {
//                             e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                           }}
//                         />
//                         <div>
//                           <p className="font-medium text-gray-800">{item.product_name}</p>
//                           <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
//                           <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                           <p className="text-sm text-gray-600">Price: ${item.price} each</p>
//                           <p className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
//                         </div>
//                       </div>
                      
//                       <div className="text-right">
//                         <div className="mb-2">
//                           <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
//                             {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending'}
//                           </span>
//                         </div>
                        
//                         {item.tracking_number && (
//                           <p className="text-sm text-gray-600">
//                             Tracking: {item.tracking_number}
//                           </p>
//                         )}

//                         {canUpdateStatus && (
//                           <div className="mt-2 space-y-2">
//                             {statusOptions.map((status) => (
//                               <button
//                                 key={status}
//                                 onClick={() => {
//                                   let trackingNumber = null;
//                                   if (status === 'shipped') {
//                                     trackingNumber = prompt('Enter tracking number (optional):');
//                                     if (trackingNumber === null) return; // User cancelled
//                                   }
//                                   handleUpdateOrderStatus(item.order_item_id, status, trackingNumber);
//                                 }}
//                                 disabled={updatingStatus === item.order_item_id}
//                                 className={`block w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
//                                   status === 'cancelled' 
//                                     ? 'bg-red-500 text-white hover:bg-red-600' 
//                                     : 'bg-blue-500 text-white hover:bg-blue-600'
//                                 } disabled:opacity-50`}
//                               >
//                                 {updatingStatus === item.order_item_id ? 'Updating...' : getNextStatusLabel(status)}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Seller Total */}
//           <div className="border-t border-gray-200 pt-4">
//             <div className="flex justify-between items-center text-lg font-bold">
//               <span>Your Products Total:</span>
//               <span>${calculateSellerTotal(order).toFixed(2)}</span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
//             <button
//               onClick={() => window.print()}
//               className="bg-gray-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//             >
//               Print Order
//             </button>
            
//             <button
//               onClick={onClose}
//               className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">My Sales Orders</h1>
          
//           {/* Status Filter */}
//           <div className="flex items-center space-x-4">
//             <label className="text-sm font-medium text-gray-700">Filter by status:</label>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//             >
//               <option value="all">All Orders</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
            
//             <button
//               onClick={fetchSellerOrders}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
        
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {statusFilter === 'all' 
//                 ? 'Orders containing your products will appear here' 
//                 : `No orders with ${statusFilter} status found`}
//             </p>
//             {statusFilter !== 'all' && (
//               <button 
//                 onClick={() => setStatusFilter('all')}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 View All Orders
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredOrders.map((order) => (
//               <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 {/* Order Header */}
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         Order #{order.order_number}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Placed on {formatDate(order.created_at)} by {order.user_email || 'Customer'}
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                         {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
//                         {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Unknown'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Summary */}
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <p className="text-gray-600">
//                         <strong>{order.items?.length || 0}</strong> of your items
//                       </p>
//                       <p className="text-lg font-bold text-gray-800">
//                         Your Total: ${calculateSellerTotal(order).toFixed(2)}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => {
//                           setSelectedOrder(order);
//                           setActiveTab('details');
//                         }}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
                      
//                       {order.payment_status === 'pending' && (
//                         <button
//                           onClick={() => handleMarkAsPaid(order.id)}
//                           disabled={markingAsPaid === order.id}
//                           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                         >
//                           {markingAsPaid === order.id ? 'Marking...' : 'Mark as Paid'}
//                         </button>
//                       )}

//                       {getStatusOptions(order.status).length > 0 && (
//                         <button
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setActiveTab('actions');
//                           }}
//                           className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
//                         >
//                           Manage Status
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Quick Items Preview */}
//                   {order.items && order.items.length > 0 && (
//                     <div className="mt-4 flex space-x-2 overflow-x-auto">
//                       {order.items.slice(0, 4).map((item, index) => (
//                         <div key={index} className="flex-shrink-0 w-16 h-16 relative">
//                           <img
//                             src={item.product_image ? getImageUrl(item.product_image) : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`}
//                             alt={item.product_name}
//                             className="w-full h-full object-cover rounded border border-gray-200"
//                             onError={(e) => {
//                               e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                             }}
//                           />
//                           {index === 3 && order.items.length > 4 && (
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
//                               <span className="text-white text-xs font-bold">
//                                 +{order.items.length - 4}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrder && (
//           <OrderDetailsModal 
//             order={selectedOrder} 
//             onClose={() => setSelectedOrder(null)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;




// // src/pages/seller/SellerOrders.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { sellerOrdersAPI, ordersAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const SellerOrders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [markingAsPaid, setMarkingAsPaid] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState(null);
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     fetchSellerOrders();
//   }, []);

//   // Image URL helper
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     if (!imagePath.includes('/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//     }

//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//   };

//   const fetchSellerOrders = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching seller orders for user:', user?.id);
      
//       let response;
      
//       // Try sellerOrdersAPI first, fallback to ordersAPI
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.getSellerOrders === 'function') {
//         console.log('Using sellerOrdersAPI');
//         response = await sellerOrdersAPI.getSellerOrders();
//       } else if (ordersAPI && typeof ordersAPI.getSellerOrders === 'function') {
//         console.log('Using ordersAPI.getSellerOrders');
//         response = await ordersAPI.getSellerOrders();
//       } else {
//         // Direct API call as fallback
//         console.log('Making direct API call for seller orders');
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch('http://localhost:5000/api/orders/seller/orders', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       console.log('Seller Orders API Response:', response);
      
//       if (response.data.success === false) {
//         throw new Error(response.data.message);
//       }
      
//       setOrders(response.data.orders || []);
//       console.log('Orders loaded:', response.data.orders?.length || 0);
      
//     } catch (error) {
//       console.error('Full error object:', error);
//       console.error('Error response:', error.response);
      
//       // Specific error handling
//       if (error.response?.status === 403) {
//         toast.error('Access denied. Please check your seller permissions.');
//       } else if (error.response?.status === 401) {
//         toast.error('Please login again');
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else if (error.message) {
//         toast.error(error.message);
//       } else {
//         toast.error('Failed to load orders. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsPaid = async (orderId) => {
//     try {
//       setMarkingAsPaid(orderId);
      
//       let response;
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.markOrderAsPaid === 'function') {
//         response = await sellerOrdersAPI.markOrderAsPaid(orderId);
//       } else if (ordersAPI && typeof ordersAPI.markOrderAsPaid === 'function') {
//         response = await ordersAPI.markOrderAsPaid(orderId);
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/mark-paid`, {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       toast.success(response.data.message);
//       await fetchSellerOrders();
//       setSelectedOrder(null);
//     } catch (error) {
//       console.error('Error marking order as paid:', error);
//       toast.error(error.response?.data?.message || 'Failed to mark order as paid');
//     } finally {
//       setMarkingAsPaid(null);
//     }
//   };

//   const handleUpdateOrderStatus = async (orderItemId, newStatus, trackingNumber = null) => {
//     try {
//       setUpdatingStatus(orderItemId);
      
//       const updateData = { status: newStatus };
//       if (trackingNumber) {
//         updateData.tracking_number = trackingNumber;
//       }

//       let response;
//       if (sellerOrdersAPI && typeof sellerOrdersAPI.updateOrderItemStatus === 'function') {
//         response = await sellerOrdersAPI.updateOrderItemStatus(orderItemId, updateData);
//       } else if (ordersAPI && typeof ordersAPI.updateOrderItemStatus === 'function') {
//         response = await ordersAPI.updateOrderItemStatus(orderItemId, updateData);
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/order-items/${orderItemId}/status`, {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(updateData)
//         });
        
//         if (!apiResponse.ok) {
//           throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         }
        
//         response = { data: await apiResponse.json() };
//       }
      
//       toast.success(response.data.message);
//       await fetchSellerOrders();
      
//     } catch (error) {
//       console.error('Error updating order item status:', error);
//       toast.error(error.response?.data?.message || 'Failed to update order item status');
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       paid: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800',
//       refunded: 'bg-blue-100 text-blue-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const calculateSellerTotal = (order) => {
//     if (!order.items) return 0;
//     return order.items.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   };

//   const getStatusOptions = (currentStatus) => {
//     const statusFlow = {
//       pending: ['confirmed', 'cancelled'],
//       confirmed: ['shipped', 'cancelled'],
//       shipped: ['delivered'],
//       delivered: [],
//       cancelled: []
//     };
    
//     return statusFlow[currentStatus] || [];
//   };

//   const getNextStatusLabel = (status) => {
//     const labels = {
//       confirmed: 'Confirm',
//       shipped: 'Mark as Shipped',
//       delivered: 'Mark as Delivered',
//       cancelled: 'Cancel'
//     };
//     return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   // Filter orders based on item status
//   const filteredOrders = orders.filter(order => {
//     if (statusFilter === 'all') return true;
    
//     // Check if any item in this order matches the status filter
//     return order.items?.some(item => item.status === statusFilter);
//   });

//   const OrderDetailsModal = ({ order, onClose }) => {
//     if (!order) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Order Details: {order.order_number}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Order Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
//                 <div className="space-y-2">
//                   <p><strong>Order Number:</strong> {order.order_number}</p>
//                   <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
//                   <p><strong>Customer:</strong> {order.user_email}</p>
//                   <p><strong>Payment Status:</strong> 
//                     <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status || 'paid')}`}>
//                       {(order.payment_status || 'paid').charAt(0).toUpperCase() + (order.payment_status || 'paid').slice(1)}
//                     </span>
//                   </p>
//                   <p><strong>Your Products Total:</strong> ${calculateSellerTotal(order).toFixed(2)}</p>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
//                 {order.shipping_address ? (
//                   <div className="space-y-2">
//                     <p><strong>Name:</strong> {order.shipping_address.firstName} {order.shipping_address.lastName}</p>
//                     <p><strong>Address:</strong> {order.shipping_address.street}</p>
//                     <p><strong>City:</strong> {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
//                     <p><strong>Country:</strong> {order.shipping_address.country}</p>
//                     <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
//                     <p><strong>Email:</strong> {order.shipping_address.email}</p>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">No shipping address provided</p>
//                 )}
//               </div>
//             </div>

//             {/* Order Items with Individual Status */}
//             <div className="mb-6">
//               <h3 className="font-semibold text-gray-800 mb-4">Your Products in this Order</h3>
//               <div className="space-y-4">
//                 {order.items?.map((item, index) => {
//                   const statusOptions = getStatusOptions(item.status || 'pending');
//                   const canUpdateStatus = statusOptions.length > 0;

//                   return (
//                     <div key={item.order_item_id || index} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                           <img
//                             src={item.product_image ? getImageUrl(item.product_image) : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`}
//                             alt={item.product_name}
//                             className="w-16 h-16 object-cover rounded"
//                             onError={(e) => {
//                               e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                             }}
//                           />
//                           <div>
//                             <p className="font-medium text-gray-800">{item.product_name}</p>
//                             <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
//                             <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                             <p className="text-sm text-gray-600">Price: ${item.price} each</p>
//                             <p className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
//                           </div>
//                         </div>
                        
//                         <div className="text-right">
//                           <div className="mb-2">
//                             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status || 'pending')}`}>
//                               {(item.status || 'pending').charAt(0).toUpperCase() + (item.status || 'pending').slice(1)}
//                             </span>
//                           </div>
                          
//                           {item.tracking_number && (
//                             <p className="text-sm text-gray-600">
//                               Tracking: {item.tracking_number}
//                             </p>
//                           )}

//                           {canUpdateStatus && (
//                             <div className="mt-2 space-y-2">
//                               {statusOptions.map((status) => (
//                                 <button
//                                   key={status}
//                                   onClick={() => {
//                                     let trackingNumber = null;
//                                     if (status === 'shipped') {
//                                       trackingNumber = prompt('Enter tracking number (optional):');
//                                       if (trackingNumber === null) return; // User cancelled
//                                     }
//                                     handleUpdateOrderStatus(item.order_item_id, status, trackingNumber);
//                                   }}
//                                   disabled={updatingStatus === item.order_item_id}
//                                   className={`block w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
//                                     status === 'cancelled' 
//                                       ? 'bg-red-500 text-white hover:bg-red-600' 
//                                       : 'bg-blue-500 text-white hover:bg-blue-600'
//                                   } disabled:opacity-50`}
//                                 >
//                                   {updatingStatus === item.order_item_id ? 'Updating...' : getNextStatusLabel(status)}
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Seller Total */}
//             <div className="border-t border-gray-200 pt-4">
//               <div className="flex justify-between items-center text-lg font-bold">
//                 <span>Your Products Total:</span>
//                 <span>${calculateSellerTotal(order).toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => window.print()}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
//               >
//                 Print Order
//               </button>
              
//               <button
//                 onClick={onClose}
//                 className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">My Sales Orders</h1>
          
//           {/* Status Filter */}
//           <div className="flex items-center space-x-4">
//             <label className="text-sm font-medium text-gray-700">Filter by status:</label>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
//             >
//               <option value="all">All Orders</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
            
//             <button
//               onClick={fetchSellerOrders}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
        
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {statusFilter === 'all' 
//                 ? 'Orders containing your products will appear here' 
//                 : `No orders with ${statusFilter} status found`}
//             </p>
//             {statusFilter !== 'all' && (
//               <button 
//                 onClick={() => setStatusFilter('all')}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 View All Orders
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredOrders.map((order) => (
//               <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 {/* Order Header */}
//                 <div className="p-6 border-b border-gray-200">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         Order #{order.order_number}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Placed on {formatDate(order.created_at)} by {order.user_email || 'Customer'}
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status || 'paid')}`}>
//                         {(order.payment_status || 'paid').charAt(0).toUpperCase() + (order.payment_status || 'paid').slice(1)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Summary */}
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <p className="text-gray-600">
//                         <strong>{order.items?.length || 0}</strong> of your items
//                       </p>
//                       <p className="text-lg font-bold text-gray-800">
//                         Your Total: ${calculateSellerTotal(order).toFixed(2)}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
                      
//                       {(order.payment_status === 'pending' || !order.payment_status) && (
//                         <button
//                           onClick={() => handleMarkAsPaid(order.id)}
//                           disabled={markingAsPaid === order.id}
//                           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
//                         >
//                           {markingAsPaid === order.id ? 'Marking...' : 'Mark as Paid'}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Quick Items Preview */}
//                   {order.items && order.items.length > 0 && (
//                     <div className="mt-4">
//                       <div className="flex space-x-2 overflow-x-auto mb-2">
//                         {order.items.slice(0, 4).map((item, index) => (
//                           <div key={index} className="flex-shrink-0 w-16 h-16 relative">
//                             <img
//                               src={item.product_image ? getImageUrl(item.product_image) : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`}
//                               alt={item.product_name}
//                               className="w-full h-full object-cover rounded border border-gray-200"
//                               onError={(e) => {
//                                 e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                               }}
//                             />
//                             {index === 3 && order.items.length > 4 && (
//                               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
//                                 <span className="text-white text-xs font-bold">
//                                   +{order.items.length - 4}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         Status: {order.items.map(item => `${item.quantity}x ${item.status || 'pending'}`).join(', ')}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrder && (
//           <OrderDetailsModal 
//             order={selectedOrder} 
//             onClose={() => setSelectedOrder(null)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;



// // src/pages/seller/SellerOrders.jsx
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { sellerOrdersAPI, ordersAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const SellerOrders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [markingAsPaid, setMarkingAsPaid] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState(null);
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   const selectedOrder = useMemo(() => 
//     orders.find(order => order.id === selectedOrderId),
//     [orders, selectedOrderId]
//   );

//   // Image URL helper with enhanced error handling
//   const getImageUrl = useCallback((imagePath) => {
//     if (!imagePath) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
//     if (imagePath.startsWith('/uploads/')) {
//       return `${baseUrl}${imagePath}`;
//     }

//     if (!imagePath.includes('/')) {
//       return `${baseUrl}/uploads/${imagePath}`;
//     }

//     return `${baseUrl}${imagePath}`;
//   }, []);

//   const fetchSellerOrders = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching seller orders for user:', user?.id);
      
//       let response;
      
//       if (sellerOrdersAPI?.getSellerOrders) {
//         response = await sellerOrdersAPI.getSellerOrders();
//       } else if (ordersAPI?.getSellerOrders) {
//         response = await ordersAPI.getSellerOrders();
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch('http://localhost:5000/api/orders/seller/orders', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         response = { data: await apiResponse.json() };
//       }
      
//       if (response.data.success === false) {
//         throw new Error(response.data.message);
//       }
      
//       setOrders(response.data.orders || []);
      
//     } catch (error) {
//       console.error('Error fetching orders:', error);
      
//       if (error.response?.status === 403) {
//         toast.error('Access denied. Please check your seller permissions.');
//       } else if (error.response?.status === 401) {
//         toast.error('Please login again');
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else if (error.message) {
//         toast.error(error.message);
//       } else {
//         toast.error('Failed to load orders. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     fetchSellerOrders();
//   }, [fetchSellerOrders, refreshTrigger]);

//   const handleMarkAsPaid = async (orderId) => {
//     try {
//       setMarkingAsPaid(orderId);
      
//       let response;
//       if (sellerOrdersAPI?.markOrderAsPaid) {
//         response = await sellerOrdersAPI.markOrderAsPaid(orderId);
//       } else if (ordersAPI?.markOrderAsPaid) {
//         response = await ordersAPI.markOrderAsPaid(orderId);
//       } else {
//         const token = localStorage.getItem('token');
//         const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/mark-paid`, {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
//         response = { data: await apiResponse.json() };
//       }
      
//       toast.success(response.data.message);
//       setRefreshTrigger(prev => prev + 1); // Trigger refresh
//       setSelectedOrderId(null);
//     } catch (error) {
//       console.error('Error marking order as paid:', error);
//       toast.error(error.response?.data?.message || 'Failed to mark order as paid');
//     } finally {
//       setMarkingAsPaid(null);
//     }
//   };

//   // const handleUpdateOrderStatus = async (orderItemId, newStatus, trackingNumber = null) => {
//   //   try {
//   //     setUpdatingStatus(orderItemId);
      
//   //     const updateData = { status: newStatus };
//   //     if (trackingNumber) updateData.tracking_number = trackingNumber;

//   //     let response;
//   //     if (sellerOrdersAPI?.updateOrderItemStatus) {
//   //       response = await sellerOrdersAPI.updateOrderItemStatus(orderItemId, updateData);
//   //     } else if (ordersAPI?.updateOrderItemStatus) {
//   //       response = await ordersAPI.updateOrderItemStatus(orderItemId, updateData);
//   //     } else {
//   //       const token = localStorage.getItem('token');
//   //       const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/order-items/${orderItemId}/status`, {
//   //         method: 'PATCH',
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`,
//   //           'Content-Type': 'application/json'
//   //         },
//   //         body: JSON.stringify(updateData)
//   //       });
        
//   //       if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
//   //       response = { data: await apiResponse.json() };
//   //     }
      
//   //     toast.success(response.data.message);
//   //     setRefreshTrigger(prev => prev + 1); // Trigger refresh to update all data
      
//   //   } catch (error) {
//   //     console.error('Error updating order item status:', error);
//   //     toast.error(error.response?.data?.message || 'Failed to update order item status');
//   //   } finally {
//   //     setUpdatingStatus(null);
//   //   }
//   // };






//  // In your SellerOrders.jsx, update the handleUpdateOrderStatus function:

// const handleUpdateOrderStatus = async (orderItemId, newStatus, trackingNumber = null) => {
//   try {
//     setUpdatingStatus(orderItemId);
    
//     const updateData = { status: newStatus };
//     if (trackingNumber) updateData.tracking_number = trackingNumber;

//     let response;
//     if (sellerOrdersAPI?.updateOrderItemStatus) {
//       response = await sellerOrdersAPI.updateOrderItemStatus(orderItemId, updateData);
//     } else if (ordersAPI?.updateOrderItemStatus) {
//       response = await ordersAPI.updateOrderItemStatus(orderItemId, updateData);
//     } else {
//       const token = localStorage.getItem('token');
//       const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/order-items/${orderItemId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updateData)
//       });
      
//       if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
//       response = { data: await apiResponse.json() };
//     }
    
//     // ✅ NEW: Enhanced success message
//     let successMessage = response.data.message;
//     if (newStatus === 'delivered') {
//       successMessage = 'Product marked as delivered! ';
//       if (response.data.orderUpdated) {
//         successMessage += 'All items in this order are now delivered - order status updated to delivered.';
//       } else {
//         successMessage += 'Other items in this order are still pending delivery.';
//       }
//     }
    
//     toast.success(successMessage);
//     setRefreshTrigger(prev => prev + 1); // Trigger refresh to update all data
    
//   } catch (error) {
//     console.error('Error updating order item status:', error);
//     toast.error(error.response?.data?.message || 'Failed to update order item status');
//   } finally {
//     setUpdatingStatus(null);
//   }
// };
//   const formatDate = useCallback((dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }, []);

//   const statusConfig = {
//     pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Pending' },
//     confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Confirmed' },
//     shipped: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Shipped' },
//     delivered: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Delivered' },
//     cancelled: { color: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Cancelled' }
//   };

//   const paymentStatusConfig = {
//     pending: { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Pending' },
//     paid: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Paid' },
//     failed: { color: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Failed' },
//     refunded: { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Refunded' }
//   };

//   const calculateSellerTotal = useCallback((order) => {
//     return order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
//   }, []);

//   const statusFlow = {
//     pending: ['confirmed', 'cancelled'],
//     confirmed: ['shipped', 'cancelled'],
//     shipped: ['delivered'],
//     delivered: [],
//     cancelled: []
//   };

//   const getNextStatusLabel = (status) => {
//     const labels = {
//       confirmed: 'Confirm Order',
//       shipped: 'Mark as Shipped',
//       delivered: 'Mark as Delivered',
//       cancelled: 'Cancel Order'
//     };
//     return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   const filteredOrders = useMemo(() => 
//     orders.filter(order => 
//       statusFilter === 'all' || order.items?.some(item => item.status === statusFilter)
//     ), [orders, statusFilter]
//   );

//   const OrderDetailsModal = ({ order, onClose }) => {
//     if (!order) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
//         <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-200 flex flex-col">
//           {/* Header */}
//           <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
//               <p className="text-gray-600 mt-1">{order.order_number}</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Scrollable Content */}
//           <div className="flex-1 overflow-y-auto">
//             <div className="p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                 {/* Order Information */}
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//                   <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     Order Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Order Number:</span>
//                       <span className="font-medium text-gray-900">{order.order_number}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Order Date:</span>
//                       <span className="font-medium text-gray-900">{formatDate(order.created_at)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Customer:</span>
//                       <span className="font-medium text-gray-900">{order.user_email}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Payment Status:</span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium border ${paymentStatusConfig[order.payment_status || 'paid']?.color}`}>
//                         {paymentStatusConfig[order.payment_status || 'paid']?.label}
//                       </span>
//                     </div>
//                     <div className="flex justify-between pt-2 border-t border-blue-200">
//                       <span className="text-gray-600 font-semibold">Your Total:</span>
//                       <span className="font-bold text-lg text-gray-900">${calculateSellerTotal(order).toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
//                   <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     Shipping Address
//                   </h3>
//                   {order.shipping_address ? (
//                     <div className="space-y-3">
//                       <p className="font-medium text-gray-900">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
//                       <p className="text-gray-600">{order.shipping_address.street}</p>
//                       <p className="text-gray-600">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
//                       <p className="text-gray-600">{order.shipping_address.country}</p>
//                       <div className="pt-2 border-t border-green-200">
//                         <p className="text-gray-600">{order.shipping_address.phone}</p>
//                         <p className="text-gray-600">{order.shipping_address.email}</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic">No shipping address provided</p>
//                   )}
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="mb-8">
//                 <h3 className="font-semibold text-gray-900 mb-4 text-lg">Order Items</h3>
//                 <div className="space-y-4">
//                   {order.items?.map((item, index) => {
//                     const statusOptions = statusFlow[item.status || 'pending'] || [];
//                     const canUpdateStatus = statusOptions.length > 0;

//                     return (
//                       <div key={item.order_item_id || index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
//                         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                           <div className="flex items-center space-x-4 flex-1">
//                             <div className="relative">
//                               <img
//                                 src={getImageUrl(item.product_image)}
//                                 alt={item.product_name}
//                                 className="w-20 h-20 object-cover rounded-lg border border-gray-200"
//                                 onError={(e) => {
//                                   e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                                 }}
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-gray-900 mb-1">{item.product_name}</h4>
//                               <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
//                                 <span>SKU: {item.sku || 'N/A'}</span>
//                                 <span>Quantity: {item.quantity}</span>
//                                 <span>Price: ${item.price}</span>
//                                 <span className="font-medium">Total: ${(item.price * item.quantity).toFixed(2)}</span>
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="flex flex-col items-end space-y-3">
//                             <div className="text-right">
//                               <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig[item.status || 'pending']?.color}`}>
//                                 {statusConfig[item.status || 'pending']?.label}
//                               </span>
//                             </div>
                            
//                             {item.tracking_number && (
//                               <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
//                                 <strong>Tracking:</strong> {item.tracking_number}
//                               </div>
//                             )}

//                             {canUpdateStatus && (
//                               <div className="flex flex-wrap gap-2">
//                                 {statusOptions.map((status) => (
//                                   <button
//                                     key={status}
//                                     onClick={() => {
//                                       let trackingNumber = null;
//                                       if (status === 'shipped') {
//                                         trackingNumber = prompt('Enter tracking number (optional):');
//                                         if (trackingNumber === null) return;
//                                       }
//                                       handleUpdateOrderStatus(item.order_item_id, status, trackingNumber);
//                                     }}
//                                     disabled={updatingStatus === item.order_item_id}
//                                     className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                                       status === 'cancelled' 
//                                         ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm' 
//                                         : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
//                                     } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95`}
//                                   >
//                                     {updatingStatus === item.order_item_id ? (
//                                       <span className="flex items-center">
//                                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                       </svg>
//                                         Updating...
//                                       </span>
//                                     ) : (
//                                       getNextStatusLabel(status)
//                                     )}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Summary */}
//               <div className="border-t border-gray-200 pt-6">
//                 <div className="flex justify-between items-center text-xl font-bold text-gray-900">
//                   <span>Your Products Total:</span>
//                   <span>${calculateSellerTotal(order).toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="flex-shrink-0 flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
//             <button
//               onClick={() => window.print()}
//               className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//               </svg>
//               Print Order
//             </button>
            
//             <button
//               onClick={onClose}
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-sm"
//             >
//               Close Details
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//           <div className="mb-6 lg:mb-0">
//             <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Sales Orders</h1>
//             <p className="text-gray-600">Manage and track your product orders</p>
//           </div>
          
//           {/* Controls */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//               </svg>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-700"
//               >
//                 <option value="all">All Orders</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
            
//             <button
//               onClick={() => setRefreshTrigger(prev => prev + 1)}
//               className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
//             >
//               <svg className={`w-5 h-5 mr-2 ${refreshTrigger > 0 ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Refresh
//             </button>
//           </div>
//         </div>
        
//         {/* Orders Grid */}
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//             <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">
//               {statusFilter === 'all' ? 'No Orders Yet' : `No ${statusFilter} Orders`}
//             </h2>
//             <p className="text-gray-600 mb-6 max-w-md mx-auto">
//               {statusFilter === 'all' 
//                 ? 'Orders containing your products will appear here once customers start purchasing.' 
//                 : `No orders found with ${statusFilter} status.`}
//             </p>
//             {statusFilter !== 'all' && (
//               <button 
//                 onClick={() => setStatusFilter('all')}
//                 className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-sm"
//               >
//                 View All Orders
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {filteredOrders.map((order) => (
//               <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//                 {/* Order Header */}
//                 <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//                     <div className="mb-4 lg:mb-0">
//                       <h3 className="text-xl font-semibold text-gray-900">
//                         Order #{order.order_number}
//                       </h3>
//                       <p className="text-gray-600 mt-1">
//                         {formatDate(order.created_at)} • {order.user_email || 'Customer'}
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${paymentStatusConfig[order.payment_status || 'paid']?.color}`}>
//                         {paymentStatusConfig[order.payment_status || 'paid']?.label}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Content */}
//                 <div className="p-6">
//                   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//                     <div className="mb-4 lg:mb-0">
//                       <p className="text-gray-600 mb-2">
//                         <strong className="text-gray-900">{order.items?.length || 0}</strong> items from your store
//                       </p>
//                       <p className="text-2xl font-bold text-gray-900">
//                         ${calculateSellerTotal(order).toFixed(2)}
//                       </p>
//                     </div>
                    
//                     <div className="flex flex-wrap gap-3">
//                       <button
//                         onClick={() => setSelectedOrderId(order.id)}
//                         className="flex items-center px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-sm"
//                       >
//                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                         View Details
//                       </button>
                      
//                       {(order.payment_status === 'pending' || !order.payment_status) && (
//                         <button
//                           onClick={() => handleMarkAsPaid(order.id)}
//                           disabled={markingAsPaid === order.id}
//                           className="flex items-center px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {markingAsPaid === order.id ? (
//                             <>
//                               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                               </svg>
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                               Mark as Paid
//                             </>
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Items Preview */}
//                   {order.items && order.items.length > 0 && (
//                     <div className="mt-6">
//                       <div className="flex space-x-3 overflow-x-auto pb-2">
//                         {order.items.slice(0, 5).map((item, index) => (
//                           <div key={index} className="flex-shrink-0 relative group">
//                             <div className="w-16 h-16 relative rounded-lg border border-gray-200 overflow-hidden">
//                               <img
//                                 src={getImageUrl(item.product_image)}
//                                 alt={item.product_name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//                                 }}
//                               />
//                               {index === 4 && order.items.length > 5 && (
//                                 <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//                                   <span className="text-white text-xs font-bold">
//                                     +{order.items.length - 5}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="flex flex-wrap gap-2 mt-3">
//                         {order.items.slice(0, 3).map((item, index) => (
//                           <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status || 'pending']?.color}`}>
//                             {item.quantity}x {statusConfig[item.status || 'pending']?.label}
//                           </span>
//                         ))}
//                         {order.items.length > 3 && (
//                           <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
//                             +{order.items.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrderId && (
//           <OrderDetailsModal 
//             order={selectedOrder} 
//             onClose={() => setSelectedOrderId(null)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;






// src/pages/seller/SellerOrders.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sellerOrdersAPI, ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [markingAsPaid, setMarkingAsPaid] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedOrder = useMemo(() => 
    orders.find(order => order.id === selectedOrderId),
    [orders, selectedOrderId]
  );

  // Image URL helper with enhanced error handling
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    if (imagePath.startsWith('/uploads/')) {
      return `${baseUrl}${imagePath}`;
    }

    if (!imagePath.includes('/')) {
      return `${baseUrl}/uploads/${imagePath}`;
    }

    return `${baseUrl}${imagePath}`;
  }, []);

  const fetchSellerOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      let response;
      
      if (sellerOrdersAPI?.getSellerOrders) {
        response = await sellerOrdersAPI.getSellerOrders();
      } else if (ordersAPI?.getSellerOrders) {
        response = await ordersAPI.getSellerOrders();
      } else {
        const token = localStorage.getItem('token');
        const apiResponse = await fetch('http://localhost:5000/api/orders/seller/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
        response = { data: await apiResponse.json() };
      }
      
      if (response.data.success === false) {
        throw new Error(response.data.message);
      }
      
      setOrders(response.data.orders || []);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (error.response?.status === 403) {
        toast.error('Access denied. Please check your seller permissions.');
      } else if (error.response?.status === 401) {
        toast.error('Please login again');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSellerOrders();
  }, [fetchSellerOrders, refreshTrigger]);

  const handleMarkAsPaid = async (orderId) => {
    try {
      setMarkingAsPaid(orderId);
      
      let response;
      if (sellerOrdersAPI?.markOrderAsPaid) {
        response = await sellerOrdersAPI.markOrderAsPaid(orderId);
      } else if (ordersAPI?.markOrderAsPaid) {
        response = await ordersAPI.markOrderAsPaid(orderId);
      } else {
        const token = localStorage.getItem('token');
        const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/orders/${orderId}/mark-paid`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
        response = { data: await apiResponse.json() };
      }
      
      toast.success(response.data.message);
      setRefreshTrigger(prev => prev + 1);
      setSelectedOrderId(null);
    } catch (error) {
      console.error('Error marking order as paid:', error);
      toast.error(error.response?.data?.message || 'Failed to mark order as paid');
    } finally {
      setMarkingAsPaid(null);
    }
  };

  const handleUpdateOrderStatus = async (orderItemId, newStatus, trackingNumber = null) => {
    try {
      setUpdatingStatus(orderItemId);
      
      const updateData = { status: newStatus };
      if (trackingNumber) updateData.tracking_number = trackingNumber;

      let response;
      if (sellerOrdersAPI?.updateOrderItemStatus) {
        response = await sellerOrdersAPI.updateOrderItemStatus(orderItemId, updateData);
      } else if (ordersAPI?.updateOrderItemStatus) {
        response = await ordersAPI.updateOrderItemStatus(orderItemId, updateData);
      } else {
        const token = localStorage.getItem('token');
        const apiResponse = await fetch(`http://localhost:5000/api/orders/seller/order-items/${orderItemId}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
        response = { data: await apiResponse.json() };
      }
      
      let successMessage = response.data.message;
      if (newStatus === 'delivered') {
        successMessage = 'Product marked as delivered! ';
        if (response.data.orderUpdated) {
          successMessage += 'All items in this order are now delivered - order status updated to delivered.';
        } else {
          successMessage += 'Other items in this order are still pending delivery.';
        }
      }
      
      toast.success(successMessage);
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('Error updating order item status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order item status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const statusConfig = {
    pending: { 
      color: 'bg-amber-50 text-amber-800 border-amber-200', 
      label: 'Pending',
      icon: '⏳'
    },
    confirmed: { 
      color: 'bg-blue-50 text-blue-800 border-blue-200', 
      label: 'Confirmed',
      icon: '✅'
    },
    shipped: { 
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200', 
      label: 'Shipped',
      icon: '🚚'
    },
    delivered: { 
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200', 
      label: 'Delivered',
      icon: '📦'
    },
    cancelled: { 
      color: 'bg-rose-50 text-rose-800 border-rose-200', 
      label: 'Cancelled',
      icon: '❌'
    }
  };

  const paymentStatusConfig = {
    pending: { 
      color: 'bg-amber-50 text-amber-800 border-amber-200', 
      label: 'Pending',
      icon: '⏳'
    },
    paid: { 
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200', 
      label: 'Paid',
      icon: '💳'
    },
    failed: { 
      color: 'bg-rose-50 text-rose-800 border-rose-200', 
      label: 'Failed',
      icon: '❌'
    },
    refunded: { 
      color: 'bg-slate-100 text-slate-800 border-slate-200', 
      label: 'Refunded',
      icon: '↩️'
    }
  };

  const calculateSellerTotal = useCallback((order) => {
    return order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  }, []);

  const statusFlow = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
  };

  const getNextStatusLabel = (status) => {
    const labels = {
      confirmed: 'Confirm Order',
      shipped: 'Mark as Shipped',
      delivered: 'Mark as Delivered',
      cancelled: 'Cancel Order'
    };
    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Enhanced filtering with search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || 
        order.items?.some(item => item.status === statusFilter);
      
      const matchesSearch = searchTerm === '' || 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  // Calculate stats
  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(order => 
      order.items?.some(item => item.status === 'pending')
    ).length;
    const delivered = orders.filter(order => 
      order.items?.some(item => item.status === 'delivered')
    ).length;
    const revenue = orders.reduce((total, order) => total + calculateSellerTotal(order), 0);

    return { total, pending, delivered, revenue };
  }, [orders, calculateSellerTotal]);

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-100 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
              <p className="text-slate-600 mt-1 font-medium">{order.order_number}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Order Information */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center text-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Order Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Order Number:</span>
                      <span className="font-semibold text-slate-900">{order.order_number}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Order Date:</span>
                      <span className="font-medium text-slate-900">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Customer:</span>
                      <span className="font-medium text-slate-900">{order.user_email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Payment Status:</span>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${paymentStatusConfig[order.payment_status || 'paid']?.color}`}>
                        <span className="mr-1.5">{paymentStatusConfig[order.payment_status || 'paid']?.icon}</span>
                        {paymentStatusConfig[order.payment_status || 'paid']?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-slate-700 font-semibold text-lg">Your Total:</span>
                      <span className="font-bold text-xl text-slate-900">${calculateSellerTotal(order).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center text-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Shipping Address
                  </h3>
                  {order.shipping_address ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-600 font-semibold text-sm">
                            {order.shipping_address.firstName?.[0]}{order.shipping_address.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                          <p className="text-slate-600 text-sm">{order.shipping_address.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p>No shipping address provided</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="font-semibold text-slate-900 mb-4 text-lg flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  Order Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-4">
                  {order.items?.map((item, index) => {
                    const statusOptions = statusFlow[item.status || 'pending'] || [];
                    const canUpdateStatus = statusOptions.length > 0;

                    return (
                      <div key={item.order_item_id || index} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="relative">
                              <img
                                src={getImageUrl(item.product_image)}
                                alt={item.product_name}
                                className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-sm"
                                onError={(e) => {
                                  e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-2">{item.product_name}</h4>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm text-slate-600">
                                <div>
                                  <span className="font-medium text-slate-500">SKU:</span> {item.sku || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium text-slate-500">Qty:</span> {item.quantity}
                                </div>
                                <div>
                                  <span className="font-medium text-slate-500">Price:</span> ${item.price}
                                </div>
                                <div>
                                  <span className="font-medium text-slate-500">Total:</span> <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-3">
                            <div className="text-right">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig[item.status || 'pending']?.color}`}>
                                <span className="mr-1.5">{statusConfig[item.status || 'pending']?.icon}</span>
                                {statusConfig[item.status || 'pending']?.label}
                              </span>
                            </div>
                            
                            {item.tracking_number && (
                              <div className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                <strong className="text-slate-700">Tracking:</strong> {item.tracking_number}
                              </div>
                            )}

                            {canUpdateStatus && (
                              <div className="flex flex-wrap gap-2">
                                {statusOptions.map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => {
                                      let trackingNumber = null;
                                      if (status === 'shipped') {
                                        trackingNumber = prompt('Enter tracking number (optional):');
                                        if (trackingNumber === null) return;
                                      }
                                      handleUpdateOrderStatus(item.order_item_id, status, trackingNumber);
                                    }}
                                    disabled={updatingStatus === item.order_item_id}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                      status === 'cancelled' 
                                        ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm' 
                                        : status === 'delivered'
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                    } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95`}
                                  >
                                    {updatingStatus === item.order_item_id ? (
                                      <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                        Updating...
                                      </span>
                                    ) : (
                                      getNextStatusLabel(status)
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex justify-between items-center text-xl font-bold text-slate-900 bg-slate-50 p-4 rounded-xl">
                  <span>Your Products Total:</span>
                  <span>${calculateSellerTotal(order).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50/50">
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Order
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold shadow-sm"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Sales Orders</h1>
            <p className="text-slate-600">Manage and track your product orders</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center">
                {/* <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">{orderStats.total}</span>
                </div> */}
                <div>
                  <p className="text-sm text-slate-600">Total Orders</p>
                  <p className="font-semibold text-slate-900">{orderStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center">
                {/* <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-amber-600 font-bold">{orderStats.pending}</span>
                </div> */}
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="font-semibold text-slate-900">{orderStats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center">
                {/* <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-emerald-600 font-bold">{orderStats.delivered}</span>
                </div> */}
                <div>
                  <p className="text-sm text-slate-600">Delivered</p>
                  <p className="font-semibold text-slate-900">{orderStats.delivered}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center">
                {/* <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">${orderStats.revenue.toFixed(2)}</span>
                </div> */}
                <div>
                  <p className="text-sm text-slate-600">Revenue</p>
                  <p className="font-semibold text-slate-900">${orderStats.revenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-sm">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-slate-700"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="flex items-center justify-center px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
          >
            <svg className={`w-5 h-5 mr-2 ${refreshTrigger > 0 ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-slate-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              {statusFilter === 'all' ? 'No Orders Yet' : `No ${statusFilter} Orders`}
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {statusFilter === 'all' 
                ? 'Orders containing your products will appear here once customers start purchasing.' 
                : `No orders found with ${statusFilter} status.`}
            </p>
            {statusFilter !== 'all' && (
              <button 
                onClick={() => setStatusFilter('all')}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-semibold shadow-sm"
              >
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Order Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-xl font-semibold text-slate-900">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {formatDate(order.created_at)} • {order.user_email || 'Customer'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${paymentStatusConfig[order.payment_status || 'paid']?.color}`}>
                        <span className="mr-1.5">{paymentStatusConfig[order.payment_status || 'paid']?.icon}</span>
                        {paymentStatusConfig[order.payment_status || 'paid']?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 lg:mb-0">
                      <p className="text-slate-600 mb-2">
                        <strong className="text-slate-900">{order.items?.length || 0}</strong> items from your store
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        ${calculateSellerTotal(order).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="flex items-center px-5 py-2.5 bg-primary-500 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-sm"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                      
                      {(order.payment_status === 'pending' || !order.payment_status) && (
                        <button
                          onClick={() => handleMarkAsPaid(order.id)}
                          disabled={markingAsPaid === order.id}
                          className="flex items-center px-5 py-2.5 bg-primary-500 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {markingAsPaid === order.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Mark as Paid
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-6">
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {order.items.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex-shrink-0 relative group">
                            <div className="w-16 h-16 relative rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                              <img
                                src={getImageUrl(item.product_image)}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
                                }}
                              />
                              {index === 4 && order.items.length > 5 && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    +{order.items.length - 5}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status || 'pending']?.color}`}>
                            <span className="mr-1">{statusConfig[item.status || 'pending']?.icon}</span>
                            {item.quantity}x {statusConfig[item.status || 'pending']?.label}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrderId && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrderId(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default SellerOrders;