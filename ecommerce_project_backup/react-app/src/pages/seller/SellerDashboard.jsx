// // src/pages/seller/SellerDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Bar, Line, Doughnut } from 'react-chartjs-2';
// import { dashboardAPI, productsAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import ProductForm from './ProductForm';
// import toast from 'react-hot-toast';

// const SellerDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProducts();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await dashboardAPI.getSellerDashboard();
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching seller dashboard:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await productsAPI.getProducts();
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const handleProductCreated = () => {
//     fetchProducts();
//     fetchDashboardData();
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // Chart data for seller
//   const salesChartData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Monthly Sales',
//         data: [5000, 8000, 12000, 9000, 15000, 18000],
//         backgroundColor: 'rgba(16, 185, 129, 0.5)',
//         borderColor: 'rgba(16, 185, 129, 1)',
//         borderWidth: 2,
//       },
//     ],
//   };

//   const topProductsData = {
//     labels: dashboardData?.topProducts?.map(p => p.name) || [],
//     datasets: [
//       {
//         label: 'Units Sold',
//         data: dashboardData?.topProducts?.map(p => p.total_sold) || [],
//         backgroundColor: [
//           'rgba(59, 130, 246, 0.8)',
//           'rgba(16, 185, 129, 0.8)',
//           'rgba(245, 158, 11, 0.8)',
//           'rgba(139, 92, 246, 0.8)',
//           'rgba(239, 68, 68, 0.8)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
//           <p className="text-gray-600">Manage your products and track your sales</p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('overview')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'overview'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab('products')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'products'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 My Products
//               </button>
//               <button
//                 onClick={() => setActiveTab('add-product')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'add-product'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Add Product
//               </button>
//               <button
//                 onClick={() => setActiveTab('analytics')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'analytics'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Analytics
//               </button>
//             </nav>
//           </div>

//           <div className="p-6">
//             {/* Overview Tab */}
//             {activeTab === 'overview' && dashboardData && (
//               <div className="space-y-6">
//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="bg-green-50 p-6 rounded-lg border border-green-200">
//                     <div className="flex items-center">
//                       <div className="bg-green-100 p-3 rounded-lg mr-4">
//                         <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-green-600 font-medium">Total Products</p>
//                         <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalProducts}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
//                     <div className="flex items-center">
//                       <div className="bg-blue-100 p-3 rounded-lg mr-4">
//                         <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-blue-600 font-medium">Total Orders</p>
//                         <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalOrders}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
//                     <div className="flex items-center">
//                       <div className="bg-purple-100 p-3 rounded-lg mr-4">
//                         <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
//                         <p className="text-2xl font-bold text-gray-800">${dashboardData.stats.totalRevenue}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Recent Orders */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
//                   <div className="space-y-3">
//                     {dashboardData.recentOrders.map((order) => (
//                       <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
//                         <div>
//                           <p className="font-medium text-gray-800">{order.product_name}</p>
//                           <p className="text-sm text-gray-600">Order #{order.order_number}</p>
//                           <p className="text-xs text-gray-500">{order.username} - Qty: {order.quantity}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium text-gray-800">${(order.price * order.quantity).toFixed(2)}</p>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                             order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                             order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-red-100 text-red-800'
//                           }`}>
//                             {order.status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Top Products */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
//                   <div className="space-y-3">
//                     {dashboardData.topProducts.map((product) => (
//                       <div key={product.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
//                         <div>
//                           <p className="font-medium text-gray-800">{product.name}</p>
//                           <p className="text-sm text-gray-600">Units Sold: {product.total_sold}</p>
//                         </div>
//                         <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                           Top Seller
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* My Products Tab */}
//             {activeTab === 'products' && (
//               <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-800">My Products</h3>
//                   <button
//                     onClick={() => setActiveTab('add-product')}
//                     className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//                   >
//                     Add New Product
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {products.filter(p => p.seller_id === dashboardData?.stats?.sellerId).map((product) => (
//                     <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4">
//                       <img
//                         src={product.primary_image || '/api/placeholder/300/300'}
//                         alt={product.name}
//                         className="w-full h-48 object-cover rounded-lg mb-4"
//                       />
//                       <h4 className="font-semibold text-gray-800 mb-2">{product.name}</h4>
//                       <p className="text-gray-600 text-sm mb-2">${product.price}</p>
//                       <div className="flex justify-between items-center">
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           product.is_published 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {product.is_published ? 'Published' : 'Draft'}
//                         </span>
//                         <span className="text-sm text-gray-600">
//                           Stock: {product.quantity}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {products.filter(p => p.seller_id === dashboardData?.stats?.sellerId).length === 0 && (
//                   <div className="text-center py-8 text-gray-500">
//                     <p>You haven't added any products yet.</p>
//                     <button
//                       onClick={() => setActiveTab('add-product')}
//                       className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//                     >
//                       Add Your First Product
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Add Product Tab */}
//             {activeTab === 'add-product' && (
//               <ProductForm onProductCreated={handleProductCreated} />
//             )}

//             {/* Analytics Tab */}
//             {activeTab === 'analytics' && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="bg-white p-6 rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales</h3>
//                     <Line data={salesChartData} options={chartOptions} />
//                   </div>
//                   <div className="bg-white p-6 rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
//                     <Doughnut data={topProductsData} options={chartOptions} />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerDashboard;



// // src/pages/seller/SellerDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { dashboardAPI, productsAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import ProductManagement from './ProductManagement';
// import SellerOrders from './SellerOrders';

// const SellerDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await dashboardAPI.getSellerDashboard();
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching seller dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sample chart data
//   const salesData = [
//     { name: 'Jan', sales: 4000, orders: 24 },
//     { name: 'Feb', sales: 3000, orders: 13 },
//     { name: 'Mar', sales: 2000, orders: 98 },
//     { name: 'Apr', sales: 2780, orders: 39 },
//     { name: 'May', sales: 1890, orders: 48 },
//     { name: 'Jun', sales: 2390, orders: 38 },
//   ];

//   const topProductsData = [
//     { name: 'Product A', sales: 400 },
//     { name: 'Product B', sales: 300 },
//     { name: 'Product C', sales: 200 },
//     { name: 'Product D', sales: 278 },
//     { name: 'Product E', sales: 189 },
//   ];

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Seller Dashboard</h1>

//       {/* Tab Navigation */}
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="flex -mb-px">
//           <button
//             onClick={() => setActiveTab('overview')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'overview'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Overview
//           </button>
//           <button
//     onClick={() => setActiveTab('orders')}
//     className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//       activeTab === 'orders'
//         ? 'border-primary-500 text-primary-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`}
//   >
//     Orders
//   </button>
//           <button
//             onClick={() => setActiveTab('products')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'products'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Product Management
//           </button>
//           <button
//             onClick={() => setActiveTab('analytics')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'analytics'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Analytics
//           </button>
//         </nav>
//       </div>
// {activeTab === 'orders' && (<SellerOrders />)}
//       {/* Tab Content */}
//       {activeTab === 'overview' && (
//         <div>
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
//               <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats.totalProducts || 0}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
//               <p className="text-3xl font-bold text-green-600">{dashboardData?.stats.totalOrders || 0}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
//               <p className="text-3xl font-bold text-purple-600">${dashboardData?.stats.totalRevenue || 0}</p>
//             </div>
//           </div>


//           {/* Recent Orders */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
//             <div className="space-y-4">
//               {dashboardData?.recentOrders.map((order) => (
//                 <div key={order.id} className="border-b border-gray-200 pb-4 last:border-b-0">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-semibold text-gray-800">Order #{order.order_number}</h3>
//                       <p className="text-sm text-gray-600">{order.username}</p>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                       order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                       order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {order.status}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-gray-600">{order.product_name} (x{order.quantity})</p>
//                     <p className="font-semibold text-gray-800">${order.price * order.quantity}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Top Products */}
//           {dashboardData?.topProducts && dashboardData.topProducts.length > 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h2>
//               <div className="space-y-3">
//                 {dashboardData.topProducts.map((product, index) => (
//                   <div key={product.name} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-b-0">
//                     <div className="flex items-center">
//                       <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
//                         {index + 1}
//                       </span>
//                       <span className="font-medium">{product.name}</span>
//                     </div>
//                     <span className="text-primary-600 font-semibold">{product.total_sold} sold</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 'products' && <ProductManagement />}

//       {activeTab === 'analytics' && (
//         <div className="space-y-8">
//           {/* Sales Chart */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Performance</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={salesData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
//                 <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Top Products Chart */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Products</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={topProductsData} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="sales" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SellerDashboard;



// // src/pages/seller/SellerDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { dashboardAPI, sellerOrdersAPI, productsAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import ProductManagement from './ProductManagement';
// import SellerOrders from './SellerOrders';

// const SellerDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [ordersData, setOrdersData] = useState([]);
//   const [productsData, setProductsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   // useEffect(() => {
//   //   fetchDashboardData();
//   //   fetchOrdersData();
//   //   fetchProductsData();
//   // }, []);


// useEffect(() => {
//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchDashboardData(),
//         fetchOrdersData(),
//         fetchProductsData()
//       ]);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAllData();
// }, []);



//   // Add this debugging useEffect
// useEffect(() => {
//   if (ordersData.length > 0) {
//     console.log('=== ORDERS DATA DEBUG ===');
//     console.log('Total orders:', ordersData.length);
//     console.log('Paid orders:', ordersData.filter(order => order.payment_status === 'paid').length);
    
//     const paidOrders = ordersData.filter(order => order.payment_status === 'paid');
//     paidOrders.forEach((order, index) => {
//       console.log(`Order ${index + 1}:`, {
//         order_number: order.order_number,
//         payment_status: order.payment_status,
//         total_amount: order.total_amount,
//         items: order.items?.map(item => ({
//           product_name: item.product_name,
//           quantity: item.quantity,
//           price: item.price,
//           item_total: item.quantity * (parseFloat(item.price) || 0)
//         }))
//       });
//     });

//     // Calculate expected revenue
//     const expectedRevenue = paidOrders.reduce((sum, order) => {
//       const orderRevenue = order.items?.reduce((itemSum, item) => {
//         return itemSum + (item.quantity * (parseFloat(item.price) || 0));
//       }, 0) || 0;
//       return sum + orderRevenue;
//     }, 0);

//     console.log('Expected seller revenue:', expectedRevenue);
//   }
// }, [ordersData]);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await dashboardAPI.getSellerDashboard();
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching seller dashboard data:', error);
//       // Fallback to calculating data from orders and products
//       calculateDashboardData();
//     }
//   };

//   const fetchOrdersData = async () => {
//     try {
//       const response = await sellerOrdersAPI.getSellerOrders();
//       setOrdersData(response.data.orders || []);
//     } catch (error) {
//       console.error('Error fetching orders data:', error);
//     }
//   };

//   const fetchProductsData = async () => {
//     try {
//       const response = await productsAPI.getSellerProducts();
//       setProductsData(response.data.products || []);
//     } catch (error) {
//       console.error('Error fetching products data:', error);
//     }
//   };

//   // // Calculate dashboard data from orders and products if dashboard API fails
//   // const calculateDashboardData = () => {
//   //   const totalRevenue = ordersData.reduce((sum, order) => {
//   //     return sum + (parseFloat(order.total_amount) || 0);
//   //   }, 0);

//   //   const totalOrders = ordersData.length;
//   //   const totalProducts = productsData.length;
//   //   const uniqueCustomers = new Set(ordersData.map(order => order.user_email)).size;

//   //   setDashboardData({
//   //     stats: {
//   //       totalRevenue,
//   //       totalOrders,
//   //       totalProducts,
//   //       uniqueCustomers,
//   //       totalItemsSold: ordersData.reduce((sum, order) => {
//   //         return sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0);
//   //       }, 0)
//   //     }
//   //   });
//   // };

// // Also update the total revenue calculation
// const calculateDashboardData = () => {
//   const totalRevenue = ordersData.reduce((sum, order) => {
//     if (order.payment_status !== 'paid') return sum;
    
//     // Calculate seller's revenue from this order
//     const sellerRevenue = order.items?.reduce((itemSum, item) => {
//       return itemSum + (item.quantity * (parseFloat(item.price) || 0));
//     }, 0) || 0;
    
//     return sum + sellerRevenue;
//   }, 0);

//   const totalOrders = ordersData.filter(order => {
//     if (order.payment_status !== 'paid') return false;
    
//     // Only count orders that have this seller's products
//     const sellerRevenue = order.items?.reduce((sum, item) => {
//       return sum + (item.quantity * (parseFloat(item.price) || 0));
//     }, 0) || 0;
    
//     return sellerRevenue > 0;
//   }).length;

//   const totalProducts = productsData.length;
//   const uniqueCustomers = new Set(
//     ordersData
//       .filter(order => order.payment_status === 'paid')
//       .map(order => order.user_email)
//   ).size;

//   setDashboardData({
//     stats: {
//       totalRevenue,
//       totalOrders,
//       totalProducts,
//       uniqueCustomers,
//       totalItemsSold: ordersData.reduce((sum, order) => {
//         if (order.payment_status !== 'paid') return sum;
//         return sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0);
//       }, 0)
//     }
//   });
// };



//   // Colors for charts
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
//   const CUSTOMER_COLORS = ['#4F46E5', '#EC4899'];

//   // // Generate sales data from orders
//   // const getSalesData = () => {
//   //   const monthlyData = {};
    
//   //   ordersData.forEach(order => {
//   //     const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short' });
//   //     const revenue = parseFloat(order.total_amount) || 0;
      
//   //     if (!monthlyData[month]) {
//   //       monthlyData[month] = { name: month, revenue: 0, orders: 0 };
//   //     }
      
//   //     monthlyData[month].revenue += revenue;
//   //     monthlyData[month].orders += 1;
//   //   });

//   //   // Fill in missing months
//   //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   //   return months.map(month => ({
//   //     name: month,
//   //     revenue: monthlyData[month]?.revenue || 0,
//   //     orders: monthlyData[month]?.orders || 0
//   //   }));
//   // };

// const getSalesData = () => {
//   const monthlyData = {};
  
//   ordersData.forEach(order => {
//     // Only process paid orders
//     if (order.payment_status !== 'paid') return;
    
//     const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short' });
    
//     // Calculate seller's revenue from this order (only their products)
//     const sellerRevenue = order.items?.reduce((sum, item) => {
//       return sum + (item.quantity * (parseFloat(item.price) || 0));
//     }, 0) || 0;
    
//     if (!monthlyData[month]) {
//       monthlyData[month] = { name: month, revenue: 0, orders: 0 };
//     }
    
//     monthlyData[month].revenue += sellerRevenue;
//     if (sellerRevenue > 0) {
//       monthlyData[month].orders += 1;
//     }
//   });

//   // Fill in missing months
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   return months.map(month => ({
//     name: month,
//     revenue: monthlyData[month]?.revenue || 0,
//     orders: monthlyData[month]?.orders || 0
//   }));
// };


//   // Get top products from orders
//   const getTopProductsData = () => {
//     const productSales = {};
    
//     ordersData.forEach(order => {
//       order.items?.forEach(item => {
//         const productId = item.product_id;
//         const productName = item.product_name;
//         const quantity = item.quantity || 0;
//         const price = parseFloat(item.price) || 0;
//         const revenue = quantity * price;
        
//         if (!productSales[productId]) {
//           productSales[productId] = {
//             id: productId,
//             name: productName,
//             sold: 0,
//             revenue: 0
//           };
//         }
        
//         productSales[productId].sold += quantity;
//         productSales[productId].revenue += revenue;
//       });
//     });

//     return Object.values(productSales)
//       .sort((a, b) => b.revenue - a.revenue)
//       .slice(0, 5)
//       .map((product, index) => ({
//         ...product,
//         review: 4.5, // Placeholder
//         profit: product.revenue
//       }));
//   };

//   // Get customer statistics
//   const getCustomerStats = () => {
//     const totalCustomers = dashboardData?.stats?.unique_customers || 
//       new Set(ordersData.map(order => order.user_email)).size;
    
//     return [
//       { name: 'Male', value: 75, count: Math.round(totalCustomers * 0.75) },
//       { name: 'Female', value: 25, count: Math.round(totalCustomers * 0.25) }
//     ];
//   };

//   // // Get distribution data
//   // const getDistributionData = () => {
//   //   // Placeholder data - you can enhance this with actual order data
//   //   return [
//   //     { name: 'Asia', value: 90 },
//   //     { name: 'Americas', value: 25 },
//   //     { name: 'Europe', value: 24 },
//   //     { name: 'Others', value: 12 }
//   //   ];
//   // };

//   const renderStarRating = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
    
//     return (
//       <div className="flex items-center">
//         {[...Array(5)].map((_, i) => (
//           <span
//             key={i}
//             className={`text-sm ${
//               i < fullStars
//                 ? 'text-yellow-400'
//                 : i === fullStars && hasHalfStar
//                 ? 'text-yellow-400'
//                 : 'text-gray-300'
//             }`}
//           >
//             ★
//           </span>
//         ))}
//         <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
//       </div>
//     );
//   };

//   const formatProfit = (profit) => {
//     if (profit >= 1000) {
//       return `$${(profit / 1000).toFixed(1)}K`;
//     }
//     return `$${profit}`;
//   };

//   const formatNumber = (num) => {
//     if (!num) return '0';
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
//   };

//   // // Show loading only if we have no data at all
//   // if (loading && !dashboardData && ordersData.length === 0 && productsData.length === 0) {
//   //   return <LoadingSpinner />;
//   // }

//   // Update the loading check
// if (loading) {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <LoadingSpinner size="lg" />
//       <p className="ml-4 text-gray-600">Loading seller dashboard data...</p>
//     </div>
//   );
// }

//   // Get actual data
//   const stats = dashboardData?.stats || {};
//   const salesData = getSalesData();
//   const topProductsData = getTopProductsData();
//   const customerStats = getCustomerStats();
//   // const distributionData = getDistributionData();

//   // Calculate totals from actual data if stats are missing
//   const totalCustomers = stats.unique_customers || new Set(ordersData.map(order => order.user_email)).size;

//   // const totalRevenue = stats.total_revenue || ordersData.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);


// // And update the main totalRevenue calculation
// const totalRevenue = stats.total_revenue || ordersData.reduce((sum, order) => {
//   if (order.payment_status !== 'paid') return sum;
  
//   const sellerRevenue = order.items?.reduce((itemSum, item) => {
//     return itemSum + (item.quantity * (parseFloat(item.price) || 0));
//   }, 0) || 0;
  
//   return sum + sellerRevenue;
// }, 0);


//   const totalOrders = stats.total_orders || ordersData.length;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
        
//       </div>

//       {/* Tab Navigation */}
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="flex -mb-px">
//           <button
//             onClick={() => setActiveTab('overview')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'overview'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Overview
//           </button>
//           <button
//             onClick={() => setActiveTab('orders')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'orders'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Orders
//           </button>
//           <button
//             onClick={() => setActiveTab('products')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'products'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Product Management
//           </button>
//         </nav>
//       </div>

//       {activeTab === 'orders' && <SellerOrders />}

//       {/* Tab Content */}
//       {activeTab === 'overview' && (
//         <div className="space-y-6">
//           {/* Stats Grid - Using actual calculated data */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Customers Card */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Customers</h3>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {formatNumber(totalCustomers)}
//                   </p>
//                   <p className="text-sm text-green-600 font-medium mt-1">7% vs. previous month</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Total Sales Card */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Sales</h3>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     ${formatNumber(totalRevenue)}
//                   </p>
//                   <p className="text-sm text-green-600 font-medium mt-1">7% vs. previous month</p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Total Order Card */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Order</h3>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {formatNumber(totalOrders)}
//                   </p>
//                   <p className="text-sm text-green-600 font-medium mt-1">3.5% vs. previous month</p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="border-t border-gray-200 my-6"></div>

//           {/* Charts and Tables Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Sales Revenue Chart */}
//             {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-800 mb-6">Sales Revenue</h2>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={salesData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                     <XAxis 
//                       dataKey="name" 
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: '#6B7280', fontSize: 12 }}
//                     />
//                     <YAxis 
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: '#6B7280', fontSize: 12 }}
//                       tickFormatter={(value) => `$${value / 1000}k`}
//                     />
//                     <Tooltip 
//                       formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
//                       contentStyle={{ 
//                         backgroundColor: 'white', 
//                         border: '1px solid #E5E7EB',
//                         borderRadius: '6px',
//                       }}
//                     />
//                     <Bar 
//                       dataKey="revenue" 
//                       fill="#4F46E5"
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div> */}
// <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//   <h2 className="text-lg font-semibold text-gray-800 mb-6">Sales Revenue</h2>
//   {salesData.some(month => month.revenue > 0) ? (
//     <div className="h-64">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//           <XAxis 
//             dataKey="name" 
//             axisLine={false}
//             tickLine={false}
//             tick={{ fill: '#6B7280', fontSize: 12 }}
//           />
//           <YAxis 
//             axisLine={false}
//             tickLine={false}
//             tick={{ fill: '#6B7280', fontSize: 12 }}
//             tickFormatter={(value) => `$${value / 1000}k`}
//           />
//           <Tooltip 
//             formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
//             contentStyle={{ 
//               backgroundColor: 'white', 
//               border: '1px solid #E5E7EB',
//               borderRadius: '6px',
//             }}
//           />
//           <Bar 
//             dataKey="revenue" 
//             fill="#4F46E5"
//             radius={[4, 4, 0, 0]}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   ) : (
//     <div className="h-64 flex flex-col items-center justify-center text-gray-500">
//       <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//       </svg>
//       <p className="text-lg font-medium">No sales data yet</p>
//       <p className="text-sm">Revenue will appear here when you make sales</p>
//     </div>
//   )}
// </div>

//             {/* Top Products Table */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Products</h2>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">No</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product Name</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Review</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sold</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Profit</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {topProductsData.length > 0 ? (
//                       topProductsData.map((product, index) => (
//                         <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
//                           <td className="py-4 px-4 text-sm text-gray-600">{index + 1}</td>
//                           <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.name}</td>
//                           <td className="py-4 px-4 text-sm">
//                             {renderStarRating(product.review)}
//                           </td>
//                           <td className="py-4 px-4 text-sm text-gray-600">{product.sold}</td>
//                           <td className="py-4 px-4 text-sm font-semibold text-gray-900">
//                             {formatProfit(product.profit)}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
//                           No products sold yet
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Customers Statistics */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-800 mb-6">Customers Statistics</h2>
//               <div className="flex items-center justify-between">
//                 <div className="w-48 h-48">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={customerStats}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         paddingAngle={2}
//                         dataKey="value"
//                         startAngle={90}
//                         endAngle={-270}
//                       >
//                         {customerStats.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={CUSTOMER_COLORS[index % CUSTOMER_COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="flex-1 ml-8">
//                   <div className="space-y-6">
//                     {customerStats.map((stat, index) => (
//                       <div key={stat.name} className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-4 h-4 rounded-full mr-3"
//                             style={{ backgroundColor: CUSTOMER_COLORS[index] }}
//                           ></div>
//                           <span className="text-sm font-medium text-gray-700">{stat.name}</span>
//                         </div>
//                         <div className="text-right">
//                           <span className="text-lg font-bold text-gray-900">{stat.value}%</span>
//                           <div className="text-sm text-gray-500">{stat.count.toLocaleString()}</div>
//                         </div>
//                       </div>
//                     ))}
//                     <div className="pt-4 border-t border-gray-200">
//                       <div className="text-center">
//                         <p className="text-2xl font-bold text-gray-900">
//                           {totalCustomers}
//                         </p>
//                         <p className="text-sm text-gray-600 mt-1">Total Customers</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Distribution Maps */}
//             {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-800 mb-6">Distribution Maps</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 {distributionData.map((region, index) => (
//                   <div key={region.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-sm font-medium text-gray-700">{region.name}</span>
//                       <span className="text-sm font-bold text-gray-900">{region.value}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
//                         style={{ width: `${region.value}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div> */}
//           </div>
//         </div>
//       )}

//       {activeTab === 'products' && <ProductManagement />}
//     </div>
//   );
// };

// export default SellerDashboard;


// src/pages/seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsAPI, sellerOrdersAPI, productsAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ProductManagement from './ProductManagement';
import SellerOrders from './SellerOrders';
import CategoryManager from '../../components/categories/CategoryManager';

const SellerDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAnalyticsData(),
          fetchOrdersData(),
          fetchProductsData()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await analyticsAPI.getSellerAnalytics();
      console.log('Seller Analytics Response:', response);
      // Extract the nested data
      const data = response.data.data || response.data;
      console.log('Analytics data to set:', data);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchOrdersData = async () => {
    try {
      const response = await sellerOrdersAPI.getSellerOrders();
      setOrdersData(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders data:', error);
    }
  };

  const fetchProductsData = async () => {
    try {
      const response = await productsAPI.getSellerProducts();
      setProductsData(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };


const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };



  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const CUSTOMER_COLORS = ['#4F46E5', '#EC4899'];

  // Format monthly sales data from analytics - FIXED
  const getSalesData = () => {
    if (!analyticsData?.monthlySales) {
      console.log('No monthlySales data found:', analyticsData);
      return [];
    }
    
    const salesData = analyticsData.monthlySales.map(month => ({
      name: new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      revenue: parseFloat(month.revenue) || 0,
      orders: month.orders || 0
    })).reverse();
    
    console.log('Processed sales data:', salesData);
    return salesData;
  };

  // Get top products from analytics - FIXED
  const getTopProductsData = () => {
    if (!analyticsData?.topProducts) {
      console.log('No topProducts data found:', analyticsData);
      return [];
    }
    
    return analyticsData.topProducts.map((product, index) => ({
      id: product.id,
      name: product.name,
      sold: product.total_sold || 0,
      revenue: parseFloat(product.revenue) || 0,
      review: 4.5,
      profit: parseFloat(product.revenue) || 0
    }));
  };

  // Get order status distribution - FIXED
  const getOrderStatusData = () => {
    if (!analyticsData?.orderStatus) {
      console.log('No orderStatus data found:', analyticsData);
      return [];
    }
    
    return analyticsData.orderStatus.map(status => ({
      name: status.status,
      value: status.count
    }));
  };

  // Get customer statistics - FIXED
  const getCustomerStats = () => {
    const totalCustomers = analyticsData?.stats?.unique_customers || 0;
    
    return [
      { name: 'Returning', value: 60, count: Math.round(totalCustomers * 0.6) },
      { name: 'New', value: 40, count: Math.round(totalCustomers * 0.4) }
    ];
  };

  const formatProfit = (profit) => {
    if (profit >= 1000) {
      return `$${(profit / 1000).toFixed(1)}K`;
    }
    return `$${Math.round(profit)}`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-gray-600">Loading seller dashboard data...</p>
      </div>
    );
  }

  // Debug panel - remove this after it works
  console.log('Current analyticsData:', analyticsData);

  // Get actual data - FIXED
  const stats = analyticsData?.stats || {};
  const salesData = getSalesData();
  const topProductsData = getTopProductsData();
  const orderStatusData = getOrderStatusData();
  const customerStats = getCustomerStats();

  // Calculate totals
  const totalCustomers = stats.unique_customers || 0;
  const totalRevenue = stats.total_revenue || 0;
  const totalOrders = stats.total_orders || 0;
  const totalProducts = productsData.length;
  const totalItemsSold = stats.total_items_sold || 0;
  const avgOrderValue = stats.avg_order_value || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
      </div>

      {/* Rest of your component remains the same */}
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        {/* <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
    
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Product Management
          </button>
          <button
      onClick={() => setActiveTab('categories')}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
    >
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
      Suggest Categories
    </button>
        </nav> */}
        <nav className="flex -mb-px">
  <button
    onClick={() => setActiveTab('overview')}
    className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
      activeTab === 'overview'
        ? 'border-blue-500 text-blue-600 bg-blue-50'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <svg className={`w-5 h-5 mr-2 ${activeTab === 'overview' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
    Overview
  </button>
  
  <button
    onClick={() => setActiveTab('orders')}
    className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
      activeTab === 'orders'
        ? 'border-blue-500 text-blue-600 bg-blue-50'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <svg className={`w-5 h-5 mr-2 ${activeTab === 'orders' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
    Orders
  </button>
  
  <button
    onClick={() => setActiveTab('products')}
    className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
      activeTab === 'products'
        ? 'border-blue-500 text-blue-600 bg-blue-50'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <svg className={`w-5 h-5 mr-2 ${activeTab === 'products' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    Product Management
  </button>
  
  <button
    onClick={() => setActiveTab('categories')}
    className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
      activeTab === 'categories'
        ? 'border-blue-500 text-blue-600 bg-blue-50'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <svg className={`w-5 h-5 mr-2 ${activeTab === 'categories' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
    Suggest Categories
  </button>
</nav>
      </div>

      {activeTab === 'orders' && <SellerOrders />}
{activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customers Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Customers</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatNumber(totalCustomers)}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1">Unique customers</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Sales Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Revenue</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${formatNumber(totalRevenue)}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1">Lifetime revenue</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Order Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Orders</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatNumber(totalOrders)}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1">Completed orders</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Items Sold Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Items Sold</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatNumber(totalItemsSold)}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1">Total products sold</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Order Value</h3>
              <p className="text-3xl font-bold text-blue-600">${parseFloat(avgOrderValue || 0).toFixed(2)}</p>
              <p className="text-gray-600 mt-2">Average revenue per order</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Products</h3>
              <p className="text-3xl font-bold text-green-600">{totalProducts}</p>
              <p className="text-gray-600 mt-2">Products in your catalog</p>
            </div>
          </div>

          {/* Charts and Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Revenue</h2>
              {salesData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="70%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                        }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="#4F46E5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-lg font-medium">No sales data yet</p>
                  <p className="text-sm">Revenue will appear here when you make sales</p>
                </div>
              )}
            </div>

            {/* Top Products Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sold</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProductsData.length > 0 ? (
                      topProductsData.map((product, index) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            {renderStarRating(product.review)}
                           </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{product.sold}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                            {formatProfit(product.revenue)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                          No products sold yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Status</h2>
              {orderStatusData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Orders']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No order data available
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Customer Overview</h2>
              <div className="flex items-center justify-between">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {customerStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CUSTOMER_COLORS[index % CUSTOMER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-8">
                  <div className="space-y-6">
                    {customerStats.map((stat, index) => (
                      <div key={stat.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: CUSTOMER_COLORS[index] }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">{stat.value}%</span>
                          <div className="text-sm text-gray-500">{stat.count.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {totalCustomers}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Total Customers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      )}

      {activeTab === 'products' && <ProductManagement />}
    </div>
  );
};

export default SellerDashboard;