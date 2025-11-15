// // src/pages/Orders.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { ordersAPI } from '../services/api';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const Orders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await ordersAPI.getOrders();
//       setOrders(response.data.orders || []);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
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
//                 <p><strong>Payment Method:</strong> {order.payment_method?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
//                 <p><strong>Total Amount:</strong> ${order.total_amount}</p>
//                 {order.tracking_number && (
//                   <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
//                 )}
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
//             {/* <div className="mb-6">
//               <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
//               <div className="space-y-4">
//                 {order.items?.map((item, index) => (
//                   <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                     <div className="flex items-center space-x-4">
//                       <img
//                         src={formatImageUrl(item.product_image)}
//                         alt={item.product_name}
//                         className="w-16 h-16 object-cover rounded"
//                         onError={(e) => {
//                           e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
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
//             </div> */}

// <div className="mb-6">
//   <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
//   <div className="space-y-4">
//     {order.items?.map((item, index) => (
//       <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//         <div className="flex items-center space-x-4">
//           <img
//             src={formatImageUrl(item.product_image)}
//             alt={item.product_name}
//             className="w-16 h-16 object-cover rounded"
//             onError={(e) => {
//               e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//             }}
//           />
//           <div>
//             <p className="font-medium text-gray-800">{item.product_name}</p>
//             <p className="text-sm text-gray-600">SKU: {item.sku || 'N/A'}</p>
//             <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//             <p className="text-sm text-gray-600">Status: 
//               <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status || 'pending')}`}>
//                 {(item.status || 'pending').charAt(0).toUpperCase() + (item.status || 'pending').slice(1)}
//               </span>
//             </p>
//             {item.tracking_number && (
//               <p className="text-sm text-gray-600">Tracking: {item.tracking_number}</p>
//             )}
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="font-semibold text-gray-800">
//             ${(item.price * item.quantity).toFixed(2)}
//           </p>
//           <p className="text-sm text-gray-600">${item.price} each</p>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>

//             {/* Order Total */}
//             <div className="border-t border-gray-200 pt-4">
//               <div className="flex justify-between items-center text-lg font-bold">
//                 <span>Total Amount:</span>
//                 <span>${order.total_amount}</span>
//               </div>
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
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
        
//         {orders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">No orders yet</h2>
//             <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
//             <button 
//               onClick={() => window.location.href = '/products'}
//               className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
//             >
//               Start Shopping
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
//                         Placed on {formatDate(order.created_at)}
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
//                         <strong>{order.item_count || order.items?.length || 0}</strong> items
//                       </p>
//                       <p className="text-lg font-bold text-gray-800">
//                         Total: ${order.total_amount}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
                      
//                       {order.status === 'delivered' && (
//                         <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
//                           Track Package
//                         </button>
//                       )}
                      
//                       {order.status === 'pending' && (
//                         <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium">
//                           Cancel Order
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
//                             src={formatImageUrl(item.product_image)}
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

// export default Orders;


// // src/pages/Orders.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { ordersAPI } from '../services/api';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import DeliveryTracking from '../components/DeliveryTracking';

// const Orders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [trackingInfo, setTrackingInfo] = useState(null);
//   const [cancellingOrder, setCancellingOrder] = useState(null);
//   const [cancelReason, setCancelReason] = useState('');
//   const [activeTab, setActiveTab] = useState('orders');

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await ordersAPI.getOrders();
//       setOrders(response.data.orders || []);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTrackingInfo = async (orderId) => {
//     try {
//       const response = await ordersAPI.getOrderTracking(orderId);
//       setTrackingInfo(response.data);
//     } catch (error) {
//       console.error('Error fetching tracking info:', error);
//       toast.error('Failed to load tracking information');
//     }
//   };

//   const handleCancelOrder = async (orderId) => {
//     try {
//       setCancellingOrder(orderId);
//       const response = await ordersAPI.cancelOrder(orderId, { reason: cancelReason });
      
//       toast.success(response.data.message);
      
//       // Refresh orders list
//       await fetchOrders();
//       setSelectedOrder(null);
//       setCancelReason('');
//     } catch (error) {
//       console.error('Error cancelling order:', error);
//       toast.error(error.response?.data?.message || 'Failed to cancel order');
//     } finally {
//       setCancellingOrder(null);
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

//   const OrderDetailsModal = ({ order, onClose }) => {
//     if (!order) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"> {/* Increased max-width */}
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
//                 {/* Your existing order details content */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
//                     <p><strong>Order Number:</strong> {order.order_number}</p>
//                     <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
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
//                     <p><strong>Payment Method:</strong> {order.payment_method?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
//                     <p><strong>Total Amount:</strong> ${order.total_amount}</p>
//                     {order.tracking_number && (
//                       <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
//                     )}
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
//                   <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
//                   <div className="space-y-4">
//                     {order.items?.map((item, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center space-x-4">
//                           <img
//                             src={formatImageUrl(item.product_image)}
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

//                 {/* Order Total */}
//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="flex justify-between items-center text-lg font-bold">
//                     <span>Total Amount:</span>
//                     <span>${order.total_amount}</span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
//                   {order.status === 'shipped' && order.tracking_number && (
//                     <button
//                       onClick={() => setActiveTab('tracking')}
//                       className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
//                     >
//                       Track Package
//                     </button>
//                   )}
                  
//                   {(order.status === 'pending' || order.status === 'confirmed') && (
//                     <button
//                       onClick={() => setCancellingOrder(order.id)}
//                       className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
//                     >
//                       Cancel Order
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={() => window.print()}
//                     className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
//                   >
//                     Print Receipt
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

//   const TrackingModal = ({ trackingData, onClose }) => {
//     if (!trackingData) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-2xl w-full">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Track Order: {trackingData.order.order_number}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Tracking Information */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <h3 className="font-semibold text-gray-800 mb-3">Tracking Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p><strong>Tracking Number:</strong> {trackingData.tracking_info.tracking_number}</p>
//                   <p><strong>Carrier:</strong> {trackingData.tracking_info.carrier}</p>
//                 </div>
//                 <div>
//                   <p><strong>Status:</strong> 
//                     <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trackingData.order.status)}`}>
//                       {trackingData.order.status.charAt(0).toUpperCase() + trackingData.order.status.slice(1)}
//                     </span>
//                   </p>
//                   {trackingData.tracking_info.estimated_delivery && (
//                     <p><strong>Estimated Delivery:</strong> {trackingData.tracking_info.estimated_delivery}</p>
//                   )}
//                 </div>
//               </div>
              
//               {trackingData.tracking_info.tracking_url && (
//                 <div className="mt-4">
//                   <a
//                     href={trackingData.tracking_info.tracking_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium inline-block"
//                   >
//                     View Detailed Tracking
//                   </a>
//                 </div>
//               )}
//             </div>

//             {/* Tracking History */}
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-4">Tracking History</h3>
//               <div className="space-y-4">
//                 {trackingData.tracking_history.map((tracking, index) => (
//                   <div key={tracking.id} className="flex items-start space-x-4">
//                     <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
//                       index === trackingData.tracking_history.length - 1 ? 'bg-green-500' : 'bg-primary-500'
//                     }`}></div>
//                     <div className="flex-1">
//                       <p className="font-medium text-gray-800">{tracking.description}</p>
//                       <p className="text-sm text-gray-600">
//                         {formatDate(tracking.created_at)} • {tracking.location}
//                       </p>
//                       {tracking.notes && (
//                         <p className="text-sm text-gray-500 mt-1">Note: {tracking.notes}</p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const CancelOrderModal = ({ orderId, onClose, onConfirm }) => {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-md w-full">
//           <div className="p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Cancel Order</h2>
//             <p className="text-gray-600 mb-4">
//               Are you sure you want to cancel this order? This action cannot be undone.
//             </p>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Reason for cancellation (optional)
//               </label>
//               <textarea
//                 value={cancelReason}
//                 onChange={(e) => setCancelReason(e.target.value)}
//                 placeholder="Please let us know why you're cancelling this order..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 rows="3"
//               />
//             </div>

//             <div className="flex space-x-3">
//               <button
//                 onClick={onClose}
//                 className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
//               >
//                 Keep Order
//               </button>
//               <button
//                 onClick={() => onConfirm(orderId)}
//                 disabled={cancellingOrder === orderId}
//                 className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
//               >
//                 {cancellingOrder === orderId ? 'Cancelling...' : 'Cancel Order'}
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
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
        
//         {orders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">No orders yet</h2>
//             <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
//             <button 
//               onClick={() => window.location.href = '/products'}
//               className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
//             >
//               Start Shopping
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
//                         Placed on {formatDate(order.created_at)}
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
//                        <p className="text-gray-600">
//                         <strong>{order.item_count || order.items?.length || 0}</strong> items
//                       </p>
//                       <p className="text-lg font-bold text-gray-800">
//                         Total: ${order.total_amount}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
                      
//                       {order.status === 'shipped' && order.tracking_number && (
//                         <button 
//                           onClick={() => fetchTrackingInfo(order.id)}
//                           className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
//                         >
//                           Track Package
//                         </button>
//                       )}
                      
//                       {(order.status === 'pending' || order.status === 'confirmed') && (
//                         <button 
//                           onClick={() => setCancellingOrder(order.id)}
//                           className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
//                         >
//                           Cancel Order
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
//                             src={formatImageUrl(item.product_image)}
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

//         {/* Tracking Modal */}
//         {trackingInfo && (
//           <TrackingModal 
//             trackingData={trackingInfo} 
//             onClose={() => setTrackingInfo(null)} 
//           />
//         )}

//         {/* Cancel Order Modal */}
//         {cancellingOrder && (
//           <CancelOrderModal 
//             orderId={cancellingOrder}
//             onClose={() => {
//               setCancellingOrder(null);
//               setCancelReason('');
//             }}
//             onConfirm={handleCancelOrder}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;

// src/pages/Orders.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const selectedOrder = useMemo(() => 
    orders.find(order => order.id === selectedOrderId),
    [orders, selectedOrderId]
  );

  // Enhanced Image URL helper
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath || imagePath === '/api/placeholder/300/300') {
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

  // Helper function to safely convert to number and format
  const formatCurrency = useCallback((value) => {
    if (value === null || value === undefined) return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }, []);

  // Helper function to safely convert to number
  const toNumber = useCallback((value) => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      console.log('Orders API Response:', response.data); // Debug log
      
      // Ensure all amounts are numbers
      const processedOrders = (response.data.orders || []).map(order => ({
        ...order,
        total_amount: toNumber(order.total_amount),
        items: (order.items || []).map(item => ({
          ...item,
          price: toNumber(item.price),
          quantity: toNumber(item.quantity)
        }))
      }));
      
      setOrders(processedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [toNumber]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refreshTrigger]);

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      
      let response;
      if (ordersAPI?.cancelOrder) {
        response = await ordersAPI.cancelOrder(orderId, { reason: cancelReason });
      } else {
        const token = localStorage.getItem('token');
        const apiResponse = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason: cancelReason })
        });
        
        if (!apiResponse.ok) throw new Error(`HTTP error! status: ${apiResponse.status}`);
        response = { data: await apiResponse.json() };
      }
      
      toast.success(response.data.message);
      setRefreshTrigger(prev => prev + 1);
      setSelectedOrderId(null);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const statusConfig = {
    pending: { 
      color: 'bg-amber-100 text-amber-800 border-amber-200', 
      label: 'Pending',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    confirmed: { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      label: 'Confirmed',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    shipped: { 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
      label: 'Shipped',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    delivered: { 
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
      label: 'Delivered',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    cancelled: { 
      color: 'bg-rose-100 text-rose-800 border-rose-200', 
      label: 'Cancelled',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  };

  const paymentStatusConfig = {
    pending: { 
      color: 'bg-amber-100 text-amber-800 border-amber-200', 
      label: 'Payment Pending',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      alert: true
    },
    paid: { 
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
      label: 'Paid',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    failed: { 
      color: 'bg-rose-100 text-rose-800 border-rose-200', 
      label: 'Payment Failed',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      alert: true
    },
    refunded: { 
      color: 'bg-slate-100 text-slate-800 border-slate-200', 
      label: 'Refunded',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  };

  // Enhanced order filtering and data handling
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (statusFilter === 'all') return true;
      return order.status === statusFilter;
    });
  }, [orders, statusFilter]);

  // Calculate item count properly
  const getItemCount = useCallback((order) => {
    return order.items?.length || order.item_count || 0;
  }, []);

  // Get items for display - handle different data structures
  const getOrderItems = useCallback((order) => {
    // return order.items || [];

    return (order.items || []).map(item => ({
    ...item,
    // Ensure status field exists for each item
    status: item.status || order.status || 'pending'
  }));
  }, []);

  const canCancelOrder = (order) => {
    return (order.status === 'pending' || order.status === 'confirmed') && 
           order.payment_status !== 'cancelled' && 
           order.payment_status !== 'refunded';
  };

  const isPaymentPending = (order) => {
    return order.payment_status === 'pending';
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const orderItems = getOrderItems(order);
    const paymentPending = isPaymentPending(order);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600 mt-1">{order.order_number}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Payment Pending Alert */}
              {paymentPending && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Payment Required
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Your order is waiting for payment confirmation. Please complete your payment to proceed with order processing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Order Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium text-gray-900">{order.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order Status:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {statusConfig[order.status]?.icon}
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${paymentStatusConfig[order.payment_status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {paymentStatusConfig[order.payment_status]?.icon}
                        {paymentStatusConfig[order.payment_status]?.label || order.payment_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-900">
                        {order.payment_method?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
                      </span>
                    </div>
                    {order.tracking_number && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="font-medium text-gray-900">{order.tracking_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-blue-200">
                      <span className="text-gray-600 font-semibold">Total Amount:</span>
                      <span className="font-bold text-lg text-gray-900">${formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Shipping Address
                  </h3>
                  {order.shipping_address ? (
                    <div className="space-y-3">
                      <p className="font-medium text-gray-900">
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                      <p className="text-gray-600">{order.shipping_address.street}</p>
                      <p className="text-gray-600">
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                      </p>
                      <p className="text-gray-600">{order.shipping_address.country}</p>
                      <div className="pt-2 border-t border-green-200">
                        <p className="text-gray-600">{order.shipping_address.phone}</p>
                        <p className="text-gray-600">{order.shipping_address.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No shipping address provided</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Order Items</h3>
                <div className="space-y-4">
                  {orderItems.length > 0 ? (
                    orderItems.map((item, index) => {
                      const itemPrice = toNumber(item.price);
                      const itemQuantity = toNumber(item.quantity);
                      const itemTotal = itemPrice * itemQuantity;
                      const itemStatus = item.status || order.status || 'pending';
  const itemTracking = item.tracking_number || order.tracking_number;
                      
                      return (
                        <div key={item.id || item.order_item_id || index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="relative">
                                <img
                                  src={getImageUrl(item.product_image || item.image)}
                                  alt={item.product_name || item.name}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
                                  }}
                                />
                              </div>
  <div className="flex-1">
    <h4 className="font-semibold text-gray-900 mb-1">{item.product_name || item.name}</h4>
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
      <span>SKU: {item.sku || 'N/A'}</span>
      <span>Quantity: {itemQuantity}</span>
      <span>Price: ${formatCurrency(itemPrice)}</span>
      <span className="font-medium">Total: ${formatCurrency(itemTotal)}</span>
    </div>
    <div className="mt-2">
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status || 'pending']?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {statusConfig[item.status || 'pending']?.icon}
        Status: {statusConfig[item.status || 'pending']?.label || (item.status || 'Pending')}
      </span>
      {item.tracking_number && (
        <span className="ml-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
          Tracking: {item.tracking_number}
        </span>
      )}
    </div>
  </div>
</div>
                            
                            <div className="text-right">
                              <p className="font-semibold text-gray-800 text-lg">
                                ${formatCurrency(itemTotal)}
                              </p>
                              <p className="text-sm text-gray-600">${formatCurrency(itemPrice)} each</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                      </svg>
                      <p>No items found in this order</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span>${formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>

              {canCancelOrder(order) && (
                <button
                  onClick={() => setCancellingOrder(order.id)}
                  className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Order
                </button>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-sm"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CancelOrderModal = ({ orderId, onClose, onConfirm }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're cancelling this order..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Keep Order
              </button>
              <button
                onClick={() => onConfirm(orderId)}
                disabled={cancellingOrder === orderId}
                className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancellingOrder === orderId ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelling...
                  </span>
                ) : (
                  'Cancel Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your purchases</p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-700"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            >
              <svg className={`w-5 h-5 mr-2 ${refreshTrigger > 0 ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {statusFilter === 'all' ? 'No Orders Yet' : `No ${statusFilter} Orders`}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {statusFilter === 'all' 
                ? 'Your orders will appear here once you start shopping.' 
                : `No orders found with ${statusFilter} status.`}
            </p>
            {statusFilter !== 'all' ? (
              <button 
                onClick={() => setStatusFilter('all')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-sm"
              >
                View All Orders
              </button>
            ) : (
              <button 
                onClick={() => window.location.href = '/products'}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-sm"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => {
              const orderItems = getOrderItems(order);
              const itemCount = getItemCount(order);
              const paymentPending = isPaymentPending(order);
              
              return (
                <div key={order.id} className={`bg-white rounded-2xl shadow-sm border ${paymentPending ? 'border-amber-200' : 'border-gray-200'} overflow-hidden hover:shadow-md transition-shadow`}>
                  
                  {/* Payment Pending Banner */}
                  {paymentPending && (
                    <div className="bg-amber-500 text-white px-4 py-2">
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm font-medium">Payment Required - Complete your payment to process this order</span>
                      </div>
                    </div>
                  )}

                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="mb-4 lg:mb-0">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Order #{order.order_number}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {statusConfig[order.status]?.icon}
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${paymentStatusConfig[order.payment_status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {paymentStatusConfig[order.payment_status]?.icon}
                          {paymentStatusConfig[order.payment_status]?.label || order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="mb-4 lg:mb-0">
                        <p className="text-gray-600 mb-2">
                          <strong className="text-gray-900">{itemCount}</strong> items
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="flex items-center px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-sm"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                        
                        {canCancelOrder(order) && (
                          <button
                            onClick={() => setCancellingOrder(order.id)}
                            className="flex items-center px-5 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-semibold shadow-sm"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items Preview */}
                    {orderItems.length > 0 && (
                      <div className="mt-6">
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                          {orderItems.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex-shrink-0 relative group">
                              <div className="w-16 h-16 relative rounded-lg border border-gray-200 overflow-hidden">
                                <img
                                  src={getImageUrl(item.product_image || item.image)}
                                  alt={item.product_name || item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
                                  }}
                                />
                                {index === 4 && orderItems.length > 5 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      +{orderItems.length - 5}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {orderItems.slice(0, 3).map((item, index) => (
                            <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status || 'pending']?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                              {statusConfig[item.status || 'pending']?.icon}
                              {toNumber(item.quantity)}x {(item.product_name || item.name)?.substring(0, 20)}{(item.product_name || item.name)?.length > 20 ? '...' : ''}
                            </span>
                          ))}
                          {orderItems.length > 3 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                              +{orderItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrderId && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrderId(null)} 
          />
        )}

        {/* Cancel Order Modal */}
        {cancellingOrder && (
          <CancelOrderModal 
            orderId={cancellingOrder}
            onClose={() => {
              setCancellingOrder(null);
              setCancelReason('');
            }}
            onConfirm={handleCancelOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;