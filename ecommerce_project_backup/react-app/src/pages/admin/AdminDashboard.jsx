// // src/pages/admin/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar, Line, Doughnut } from 'react-chartjs-2';
// import { dashboardAPI, usersAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import UserManagement from './UserManagement';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const AdminDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await dashboardAPI.getAdminDashboard();
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveSeller = async (userId) => {
//     try {
//       await usersAPI.approveSeller(userId);
//       toast.success('Seller approved successfully');
//       fetchDashboardData(); // Refresh data
//     } catch (error) {
//       toast.error('Failed to approve seller');
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!dashboardData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Failed to load dashboard data</h2>
//           <button
//             onClick={fetchDashboardData}
//             className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Chart data for sales
//   const salesChartData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       {
//         label: 'Monthly Revenue',
//         data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
//         backgroundColor: 'rgba(59, 130, 246, 0.5)',
//         borderColor: 'rgba(59, 130, 246, 1)',
//         borderWidth: 2,
//       },
//     ],
//   };

//   // Chart data for product categories
//   const categoriesChartData = {
//     labels: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty'],
//     datasets: [
//       {
//         label: 'Products by Category',
//         data: [45, 25, 15, 30, 20, 18],
//         backgroundColor: [
//           'rgba(59, 130, 246, 0.8)',
//           'rgba(16, 185, 129, 0.8)',
//           'rgba(245, 158, 11, 0.8)',
//           'rgba(139, 92, 246, 0.8)',
//           'rgba(239, 68, 68, 0.8)',
//           'rgba(14, 165, 233, 0.8)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Chart data for order status
//   const ordersChartData = {
//     labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
//     datasets: [
//       {
//         label: 'Orders by Status',
//         data: [12, 8, 15, 45, 5],
//         backgroundColor: [
//           'rgba(245, 158, 11, 0.8)',
//           'rgba(59, 130, 246, 0.8)',
//           'rgba(139, 92, 246, 0.8)',
//           'rgba(16, 185, 129, 0.8)',
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
//           <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//           <p className="text-gray-600">Manage your e-commerce platform</p>
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
//                 onClick={() => setActiveTab('users')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'users'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 User Management
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
//             {activeTab === 'overview' && (
//               <div className="space-y-6">
//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
//                     <div className="flex items-center">
//                       <div className="bg-blue-100 p-3 rounded-lg mr-4">
//                         <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-blue-600 font-medium">Total Users</p>
//                         <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalUsers}</p>
//                       </div>
//                     </div>
//                   </div>

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

//                   <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
//                     <div className="flex items-center">
//                       <div className="bg-purple-100 p-3 rounded-lg mr-4">
//                         <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-purple-600 font-medium">Total Orders</p>
//                         <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalOrders}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
//                     <div className="flex items-center">
//                       <div className="bg-orange-100 p-3 rounded-lg mr-4">
//                         <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-sm text-orange-600 font-medium">Total Revenue</p>
//                         <p className="text-2xl font-bold text-gray-800">${dashboardData.stats.totalRevenue}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Pending Sellers */}
//                 {dashboardData.pendingSellers.length > 0 && (
//                   <div className="bg-white border border-gray-200 rounded-lg p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Seller Approvals</h3>
//                     <div className="space-y-3">
//                       {dashboardData.pendingSellers.map((seller) => (
//                         <div key={seller.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                           <div>
//                             <p className="font-medium text-gray-800">{seller.username}</p>
//                             <p className="text-sm text-gray-600">{seller.email}</p>
//                             <p className="text-xs text-gray-500">Joined: {new Date(seller.created_at).toLocaleDateString()}</p>
//                           </div>
//                           <button
//                             onClick={() => approveSeller(seller.id)}
//                             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
//                           >
//                             Approve
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Recent Orders & Low Stock */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Recent Orders */}
//                   <div className="bg-white border border-gray-200 rounded-lg p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
//                     <div className="space-y-3">
//                       {dashboardData.recentOrders.map((order) => (
//                         <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
//                           <div>
//                             <p className="font-medium text-gray-800">Order #{order.order_number}</p>
//                             <p className="text-sm text-gray-600">{order.username}</p>
//                             <p className="text-xs text-gray-500">${order.total_amount}</p>
//                           </div>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                             order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                             order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-red-100 text-red-800'
//                           }`}>
//                             {order.status}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Low Stock Products */}
//                   <div className="bg-white border border-gray-200 rounded-lg p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alert</h3>
//                     <div className="space-y-3">
//                       {dashboardData.lowStockProducts.map((product) => (
//                         <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
//                           <div>
//                             <p className="font-medium text-gray-800">{product.name}</p>
//                             <p className="text-sm text-gray-600">Stock: {product.quantity}</p>
//                           </div>
//                           <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
//                             Low Stock
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* User Management Tab */}
//             {activeTab === 'users' && (
//               <UserManagement />
//             )}

//             {/* Analytics Tab */}
//             {activeTab === 'analytics' && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="bg-white p-6 rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
//                     <Line data={salesChartData} options={chartOptions} />
//                   </div>
//                   <div className="bg-white p-6 rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
//                     <Doughnut data={categoriesChartData} options={chartOptions} />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="bg-white p-6 rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h3>
//                     <Bar data={ordersChartData} options={chartOptions} />
//                   </div>
//                   <div className="bg-white p-6 rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">User Registrations</h3>
//                     <div className="text-center py-12 text-gray-500">
//                       <p>User registration chart would be displayed here</p>
//                       <p className="text-sm">(Data integration required)</p>
//                     </div>
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

// export default AdminDashboard;


// // src/pages/admin/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
// import { dashboardAPI, reviewsAPI  } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import UserManagement from './UserManagement';
// import CouponManagement from './CouponManagement';
// import ReviewManagement from './ReviewManagement';

// const AdminDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [reviewStats, setReviewStats] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await dashboardAPI.getAdminDashboard();
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sample chart data - replace with actual data from your API
//   const salesData = [
//     { name: 'Jan', sales: 4000, orders: 240 },
//     { name: 'Feb', sales: 3000, orders: 139 },
//     { name: 'Mar', sales: 2000, orders: 980 },
//     { name: 'Apr', sales: 2780, orders: 390 },
//     { name: 'May', sales: 1890, orders: 480 },
//     { name: 'Jun', sales: 2390, orders: 380 },
//   ];

//   const categoryData = [
//     { name: 'Electronics', value: 400 },
//     { name: 'Clothing', value: 300 },
//     { name: 'Home & Kitchen', value: 300 },
//     { name: 'Books', value: 200 },
//   ];

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   const userGrowthData = [
//     { name: 'Jan', users: 100 },
//     { name: 'Feb', users: 150 },
//     { name: 'Mar', users: 200 },
//     { name: 'Apr', users: 280 },
//     { name: 'May', users: 350 },
//     { name: 'Jun', users: 420 },
//   ];

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

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
//             onClick={() => setActiveTab('users')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'users'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             User Management
//           </button>
//           <button
//             onClick={() => setActiveTab('coupons')}
//             className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//               activeTab === 'coupons'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Coupon Management
//           </button>
//           <button
//   onClick={() => setActiveTab('reviews')}
//   className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//     activeTab === 'reviews'
//       ? 'border-primary-500 text-primary-600'
//       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//   }`}
// >
//   Review Management
// </button>
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

//       {activeTab === 'overview' && (
//         <div>
//           {/* Stats Grid - Add Review Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
//               <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats.totalUsers || 0}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
//               <p className="text-3xl font-bold text-green-600">{dashboardData?.stats.totalProducts || 0}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
//               <p className="text-3xl font-bold text-purple-600">{dashboardData?.stats.totalOrders || 0}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
//               <p className="text-3xl font-bold text-orange-600">${dashboardData?.stats.totalRevenue || 0}</p>
//             </div>
//           </div>

//           {/* Quick Stats - Add Review Statistics */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Sellers</h3>
//               <p className="text-3xl font-bold text-yellow-600 mb-2">{dashboardData?.stats.pendingSellers || 0}</p>
//               <p className="text-gray-600">Sellers waiting for approval</p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Products</h3>
//               <p className="text-3xl font-bold text-red-600 mb-2">
//                 {dashboardData?.lowStockProducts ? dashboardData.lowStockProducts.length : 0}
//               </p>
//               <p className="text-gray-600">Products that need restocking</p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Statistics</h3>
//               <p className="text-3xl font-bold text-indigo-600 mb-2">{reviewStats?.total || 0}</p>
//               <div className="text-gray-600 text-sm">
//                 <span className="text-green-600">{reviewStats?.approved || 0} approved</span>
//                 <span className="mx-2">•</span>
//                 <span className="text-yellow-600">{reviewStats?.pending || 0} pending</span>
//                 <br />
//                 <span className="text-blue-600">{reviewStats?.recent || 0} recent (7 days)</span>
//               </div>
//             </div>
//           </div>

//           {/* Review Rating Distribution */}
//           {reviewStats?.ratingDistribution && reviewStats.ratingDistribution.length > 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Rating Distribution</h2>
//               <div className="grid grid-cols-5 gap-4">
//                 {[5, 4, 3, 2, 1].map((rating) => {
//                   const ratingData = reviewStats.ratingDistribution.find(r => r.rating === rating);
//                   const count = ratingData ? ratingData.count : 0;
//                   const percentage = reviewStats.total > 0 ? (count / reviewStats.total * 100).toFixed(1) : 0;
                  
//                   return (
//                     <div key={rating} className="text-center">
//                       <div className="flex justify-center text-yellow-400 text-lg mb-2">
//                         {'★'.repeat(rating)}
//                       </div>
//                       <p className="text-2xl font-bold text-gray-800">{count}</p>
//                       <p className="text-sm text-gray-600">{percentage}%</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Top Reviewed Products */}
//           {reviewStats?.topProducts && reviewStats.topProducts.length > 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Reviewed Products</h2>
//               <div className="space-y-3">
//                 {reviewStats.topProducts.map((product, index) => (
//                   <div key={product.id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-b-0">
//                     <div className="flex items-center">
//                       <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
//                         {index + 1}
//                       </span>
//                       <span className="font-medium text-gray-800">{product.name}</span>
//                     </div>
//                     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
//                       {product.review_count} reviews
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* ... rest of the overview content ... */}
//         </div>
//       )}

// {activeTab === 'reviews' && <ReviewManagement />}
//       {activeTab === 'users' && <UserManagement />}
// {activeTab === 'coupons' && <CouponManagement />}
//       {activeTab === 'analytics' && (
//         <div className="space-y-8">
//           {/* Sales Chart */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
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

//           {/* Category Distribution */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Categories</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* User Growth */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={userGrowthData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


// // src/pages/admin/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
// import { dashboardAPI, reviewsAPI,analyticsAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import UserManagement from './UserManagement';
// import CouponManagement from './CouponManagement';
// import ReviewManagement from './ReviewManagement';
// import CategoryManager from '../../components/categories/CategoryManager';

// const AdminDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [reviewStats, setReviewStats] = useState(null);
//   const [statsLoading, setStatsLoading] = useState(false);
// const [adminAnalytics, setAdminAnalytics] = useState(null);
// const [analyticsLoading, setAnalyticsLoading] = useState(false);
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   useEffect(() => {
//   if (activeTab === 'analytics') {
//     fetchAdminAnalytics();
//   }
// }, [activeTab]);

//   // Fetch review stats when overview tab is active or when component mounts
//   useEffect(() => {
//     if (activeTab === 'overview') {
//       fetchReviewStats();
//     }
//   }, [activeTab]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await dashboardAPI.getAdminDashboard();
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

// // In your AdminDashboard component, update the fetchAdminAnalytics function:
// const fetchAdminAnalytics = async () => {
//   try {
//     setAnalyticsLoading(true);
//     const response = await analyticsAPI.getAdminAnalytics();
//     console.log('Full API Response:', response);
    
//     // Handle different response structures
//     let analyticsData = response.data;
//     if (analyticsData && analyticsData.data) {
//       setAdminAnalytics(analyticsData);
//     } else {
//       // If the expected structure isn't there, create a fallback
//       setAdminAnalytics({
//         data: analyticsData || {
//           platformStats: {},
//           salesTrends: [],
//           categoryPerformance: [],
//           userGrowth: [],
//           topSellers: []
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching admin analytics:', error);
//     // Set fallback data instead of showing error
//     setAdminAnalytics({
//       data: {
//         platformStats: {},
//         salesTrends: [],
//         categoryPerformance: [],
//         userGrowth: [],
//         topSellers: []
//       }
//     });
//   } finally {
//     setAnalyticsLoading(false);
//   }
// };


//   const fetchReviewStats = async () => {
//     try {
//       setStatsLoading(true);
//       console.log('Fetching review statistics...');
//       const response = await reviewsAPI.getAdminReviewStats();
//       console.log('Review stats response:', response.data);
//       setReviewStats(response.data);
//     } catch (error) {
//       console.error('Error fetching review statistics:', error);
//       console.error('Error details:', error.response?.data);
//       // Set default stats if API fails
//       setReviewStats({
//         total: 0,
//         approved: 0,
//         pending: 0,
//         recent: 0,
//         ratingDistribution: [],
//         topProducts: []
//       });
//     } finally {
//       setStatsLoading(false);
//     }
//   };


//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="border-b border-gray-200">
//             {/* <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('overview')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'overview'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab('users')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'users'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 User Management
//               </button>
//               <button
//                 onClick={() => setActiveTab('coupons')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'coupons'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Coupon Management
//               </button>
//               <button
//                 onClick={() => setActiveTab('reviews')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'reviews'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Review Management
//               </button>
              
//     <button
//       onClick={() => setActiveTab('categories')}
//       className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
//     >
//       <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//       </svg>
//       Manage Categories
//     </button>
  
//               <button
//                 onClick={() => setActiveTab('analytics')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'analytics'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Analytics
//               </button>
//             </nav> */}
//             <nav className="flex -mb-px">
//   <button
//     onClick={() => setActiveTab('overview')}
//     className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
//       activeTab === 'overview'
//         ? 'border-blue-500 text-blue-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`}
//   >
//     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//     </svg>
//     Overview
//   </button>
  
//   <button
//     onClick={() => setActiveTab('users')}
//     className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
//       activeTab === 'users'
//         ? 'border-blue-500 text-blue-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`}
//   >
//     <svg className={`w-5 h-5 mr-2 ${activeTab === 'users' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//     </svg>
//     User Management
//   </button>
  
//   <button
//     onClick={() => setActiveTab('coupons')}
//     className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
//       activeTab === 'coupons'
//         ? 'border-blue-500 text-blue-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`}
//   >
//     <svg className={`w-5 h-5 mr-2 ${activeTab === 'coupons' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
//     </svg>
//     Coupon Management
//   </button>
  
//   <button
//     onClick={() => setActiveTab('reviews')}
//     className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
//       activeTab === 'reviews'
//         ? 'border-blue-500 text-blue-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`}
//   >
//     <svg className={`w-5 h-5 mr-2 ${activeTab === 'reviews' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
//     </svg>
//     Review Management
//   </button>
  
//   <button
//     onClick={() => setActiveTab('categories')}
//     className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
//       activeTab === 'categories'
//         ? 'border-blue-500 text-blue-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`}
//   >
//     <svg className={`w-5 h-5 mr-2 ${activeTab === 'categories' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//     </svg>
//     Manage Categories
//   </button>
  
//   <button
//     onClick={() => setActiveTab('analytics')}
//     className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
//       activeTab === 'analytics'
//         ? 'border-blue-500 text-blue-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`}
//   >
//     <svg className={`w-5 h-5 mr-2 ${activeTab === 'analytics' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//     </svg>
//     Analytics
//   </button>
// </nav>
//           </div>
//         </div>

//         {activeTab === 'overview' && (
//           <div className="space-y-6">
//             {/* Main Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="bg-blue-100 p-3 rounded-lg">
//                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Users</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.totalUsers || 0}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="bg-green-100 p-3 rounded-lg">
//                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Products</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.totalProducts || 0}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="bg-purple-100 p-3 rounded-lg">
//                     <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                     <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.totalOrders || 0}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="bg-orange-100 p-3 rounded-lg">
//                     <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                     <p className="text-2xl font-bold text-gray-900">${dashboardData?.stats?.totalRevenue || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Secondary Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Sellers</h3>
//                 <p className="text-3xl font-bold text-yellow-600 mb-2">{dashboardData?.stats?.pendingSellers || 0}</p>
//                 <p className="text-gray-600 text-sm">Sellers waiting for approval</p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Products</h3>
//                 <p className="text-3xl font-bold text-red-600 mb-2">
//                   {dashboardData?.lowStockProducts ? dashboardData.lowStockProducts.length : 0}
//                 </p>
//                 <p className="text-gray-600 text-sm">Products that need restocking</p>
//               </div>

//               <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Statistics</h3>
//                 {statsLoading ? (
//                   <div className="flex justify-center">
//                     <LoadingSpinner size="sm" />
//                   </div>
//                 ) : (
//                   <>
//                     <p className="text-3xl font-bold text-indigo-600 mb-2">{reviewStats?.total || 0}</p>
//                     <div className="text-gray-600 text-sm">
//                       <span className="text-green-600 font-medium">{reviewStats?.approved || 0} approved</span>
//                       <span className="mx-2">•</span>
//                       <span className="text-yellow-600 font-medium">{reviewStats?.pending || 0} pending</span>
//                       <br />
//                       <span className="text-blue-600">{reviewStats?.recent || 0} recent (7 days)</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Review Rating Distribution */}
//             {reviewStats?.ratingDistribution && reviewStats.ratingDistribution.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Rating Distribution</h2>
//                 <div className="grid grid-cols-5 gap-4">
//                   {[5, 4, 3, 2, 1].map((rating) => {
//                     const ratingData = reviewStats.ratingDistribution.find(r => r.rating === rating);
//                     const count = ratingData ? ratingData.count : 0;
//                     const percentage = reviewStats.total > 0 ? (count / reviewStats.total * 100).toFixed(1) : 0;
                    
//                     return (
//                       <div key={rating} className="text-center">
//                         <div className="flex justify-center text-yellow-400 text-lg mb-2">
//                           {'★'.repeat(rating)}
//                         </div>
//                         <p className="text-2xl font-bold text-gray-800">{count}</p>
//                         <p className="text-sm text-gray-600">{percentage}%</p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Top Reviewed Products */}
//             {reviewStats?.topProducts && reviewStats.topProducts.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Reviewed Products</h2>
//                 <div className="space-y-3">
//                   {reviewStats.topProducts.map((product, index) => (
//                     <div key={product.id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-b-0">
//                       <div className="flex items-center">
//                         <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold mr-3">
//                           {index + 1}
//                         </span>
//                         <span className="font-medium text-gray-800">{product.name}</span>
//                       </div>
//                       <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
//                         {product.review_count} reviews
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'reviews' && <ReviewManagement />}
//         {activeTab === 'users' && <UserManagement />}
//         {activeTab === 'coupons' && <CouponManagement />}
//         {activeTab === 'categories' && <CategoryManager />}
//         {activeTab === 'analytics' && (
//   <div className="space-y-8">
//     {analyticsLoading ? (
//       <div className="flex justify-center py-12">
//         <LoadingSpinner size="lg" />
//       </div>
//     ) : adminAnalytics ? (
//       <>

//         {/* Platform Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {adminAnalytics.data?.platformStats?.total_users || 0}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {adminAnalytics.data?.platformStats?.total_products || 0}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {adminAnalytics.data?.platformStats?.total_orders || 0}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-orange-100 p-3 rounded-lg">
//                 <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${adminAnalytics.data?.platformStats?.total_revenue || 0}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sales Trends Chart */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Trends</h2>
//           {adminAnalytics.data?.salesTrends?.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart 
//                 data={adminAnalytics.data.salesTrends.map(item => ({
//                   name: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
//                   revenue: parseFloat(item.revenue) || 0,
//                   orders: item.orders || 0,
//                   customers: item.customers || 0
//                 })).reverse()}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue ($)" />
//                 <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No sales trend data available
//             </div>
//           )}
//         </div>

//         {/* Category Performance */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Performance</h2>
//           {adminAnalytics.data?.categoryPerformance?.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={adminAnalytics.data.categoryPerformance}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="category" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
//                 <Bar dataKey="items_sold" fill="#82ca9d" name="Items Sold" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No category performance data available
//             </div>
//           )}
//         </div>

//         {/* User Growth */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth</h2>
//           {adminAnalytics.data?.userGrowth?.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart 
//                 data={adminAnalytics.data.userGrowth.map(item => ({
//                   name: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
//                   newUsers: item.new_users || 0,
//                   totalUsers: item.total_users || 0
//                 })).reverse()}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="New Users" />
//                 <Line type="monotone" dataKey="totalUsers" stroke="#ff7300" name="Total Users" />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-64 flex items-center justify-center text-gray-500">
//               No user growth data available
//             </div>
//           )}
//         </div>

//         {/* Top Sellers */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Sellers</h2>
//           {adminAnalytics.data?.topSellers?.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Seller</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Orders</th>
//                     <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {adminAnalytics.data.topSellers.map((seller, index) => (
//                     <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-4 px-4 text-sm font-medium text-gray-900">{seller.username}</td>
//                       <td className="py-4 px-4 text-sm text-gray-600">{seller.email}</td>
//                       <td className="py-4 px-4 text-sm text-gray-600">{seller.orders}</td>
//                       <td className="py-4 px-4 text-sm font-semibold text-gray-900">
//                         ${parseFloat(seller.revenue || 0).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               No top sellers data available
//             </div>
//           )}
//         </div>
//       </>
//     ) : (
//       <div className="text-center py-12">
//         <p className="text-gray-500">No analytics data available</p>
//       </div>
//     )}
//   </div>
// )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { dashboardAPI, reviewsAPI, analyticsAPI,paymentAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import UserManagement from './UserManagement';
import CouponManagement from './CouponManagement';
import ReviewManagement from './ReviewManagement';
import CategoryManager from '../../components/categories/CategoryManager';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewStats, setReviewStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAdminAnalytics();
    }
  }, [activeTab]);

  // Fetch review stats when overview tab is active or when component mounts
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchReviewStats();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdminDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await analyticsAPI.getAdminAnalytics();
      console.log('Full API Response:', response);
      
      // Handle different response structures
      let analyticsData = response.data;
      if (analyticsData && analyticsData.data) {
        setAdminAnalytics(analyticsData);
      } else {
        // If the expected structure isn't there, create a fallback
        setAdminAnalytics({
          data: analyticsData || {
            platformStats: {},
            salesTrends: [],
            categoryPerformance: [],
            userGrowth: [],
            topSellers: []
          }
        });
      }
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      // Set fallback data instead of showing error
      setAdminAnalytics({
        data: {
          platformStats: {},
          salesTrends: [],
          categoryPerformance: [],
          userGrowth: [],
          topSellers: []
        }
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // In your dashboard, add:
const [paymentStats, setPaymentStats] = useState({
  totalPayments: 0,
  totalAmount: 0,
  successfulPayments: 0,
  pendingPayments: 0
});

useEffect(() => {
  const fetchPaymentStats = async () => {
    const response = await paymentAPI.getPaymentHistory();
    const payments = response.data.payments;
    
    setPaymentStats({
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
      successfulPayments: payments.filter(p => p.status === 'completed').length,
      pendingPayments: payments.filter(p => p.status === 'pending' || p.status === 'processing').length
    });
  };
  
  fetchPaymentStats();
}, []);

  const fetchReviewStats = async () => {
    try {
      setStatsLoading(true);
      console.log('Fetching review statistics...');
      const response = await reviewsAPI.getAdminReviewStats();
      console.log('Review stats response:', response.data);
      setReviewStats(response.data);
    } catch (error) {
      console.error('Error fetching review statistics:', error);
      console.error('Error details:', error.response?.data);
      // Set default stats if API fails
      setReviewStats({
        total: 0,
        approved: 0,
        pending: 0,
        recent: 0,
        ratingDistribution: [],
        topProducts: []
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Helper function to generate last 12 months
  const generateLast12Months = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      months.unshift(`${year}-${month}`);
    }
    
    return months;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

return (
<div className="min-h-screen bg-gray-50 py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

    {/* Tab Navigation */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="border-b border-gray-200 max-w-7xl mx-auto px-4">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className={`w-5 h-5 mr-2 ${activeTab === 'users' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            User Management
          </button>
          
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'coupons'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className={`w-5 h-5 mr-2 ${activeTab === 'coupons' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Coupon Management
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className={`w-5 h-5 mr-2 ${activeTab === 'reviews' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Review Management
          </button>
          
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className={`w-5 h-5 mr-2 ${activeTab === 'categories' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Manage Categories
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className={`w-5 h-5 mr-2 ${activeTab === 'analytics' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
        </nav>
      </div>
    </div>

    {activeTab === 'overview' && (
      <div className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.totalProducts || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats?.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${dashboardData?.stats?.totalRevenue || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Sellers</h3>
            <p className="text-3xl font-bold text-yellow-600 mb-2">{dashboardData?.stats?.pendingSellers || 0}</p>
            <p className="text-gray-600 text-sm">Sellers waiting for approval</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Products</h3>
            <p className="text-3xl font-bold text-red-600 mb-2">
              {dashboardData?.lowStockProducts ? dashboardData.lowStockProducts.length : 0}
            </p>
            <p className="text-gray-600 text-sm">Products that need restocking</p>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Statistics</h3>
            {statsLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-indigo-600 mb-2">{reviewStats?.total || 0}</p>
                <div className="text-gray-600 text-sm">
                  <span className="text-green-600 font-medium">{reviewStats?.approved || 0} approved</span>
                  <span className="mx-2">•</span>
                  <span className="text-yellow-600 font-medium">{reviewStats?.pending || 0} pending</span>
                  <br />
                  <span className="text-blue-600">{reviewStats?.recent || 0} recent (7 days)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Review Rating Distribution */}
        {reviewStats?.ratingDistribution && reviewStats.ratingDistribution.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Rating Distribution</h2>
            <div className="grid grid-cols-5 gap-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const ratingData = reviewStats.ratingDistribution.find(r => r.rating === rating);
                const count = ratingData ? ratingData.count : 0;
                const percentage = reviewStats.total > 0 ? (count / reviewStats.total * 100).toFixed(1) : 0;
                
                return (
                  <div key={rating} className="text-center">
                    <div className="flex justify-center text-yellow-400 text-lg mb-2">
                      {'★'.repeat(rating)}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                    <p className="text-sm text-gray-600">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Reviewed Products */}
        {reviewStats?.topProducts && reviewStats.topProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Reviewed Products</h2>
            <div className="space-y-3">
              {reviewStats.topProducts.map((product, index) => (
                <div key={product.id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-b-0">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{product.name}</span>
                  </div>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
                    {product.review_count} reviews
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    {activeTab === 'reviews' && <ReviewManagement />}
    {activeTab === 'users' && <UserManagement />}
    {activeTab === 'coupons' && <CouponManagement />}
    {activeTab === 'categories' && <CategoryManager />}
    
    {activeTab === 'analytics' && (
      <div className="space-y-8">
        {analyticsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : adminAnalytics ? (
          <>
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminAnalytics.data?.platformStats?.total_users || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminAnalytics.data?.platformStats?.total_products || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminAnalytics.data?.platformStats?.total_orders || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${adminAnalytics.data?.platformStats?.total_revenue || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Get sales trends data */}
            {(() => {
              const salesTrendsData = adminAnalytics.data?.salesTrends || [];
              const userGrowthData = adminAnalytics.data?.userGrowth || [];
              const last12Months = generateLast12Months();
              
              // Process sales trends for chart
              const chartSalesData = last12Months.map(month => {
                const found = salesTrendsData.find(item => item.month === month);
                
                // Parse the month for display
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                const shortYear = year.toString().slice(-2);
                
                return {
                  name: `${monthName} '${shortYear}`,
                  revenue: found ? parseFloat(found.revenue) || 0 : 0,
                  orders: found ? found.orders || 0 : 0,
                  customers: found ? found.customers || 0 : 0
                };
              });

              // Process user growth for chart
              const chartUserData = last12Months.map(month => {
                const found = userGrowthData.find(item => item.month === month);
                
                // Parse the month for display
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                const shortYear = year.toString().slice(-2);
                
                return {
                  name: `${monthName} '${shortYear}`,
                  newUsers: found ? found.new_users || 0 : 0,
                  totalUsers: found ? found.total_users || 0 : 0
                };
              });

              return (
                <>
                  {/* Sales Trends Chart */}
<div className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Trends (Last 12 Months)</h2>
{chartSalesData.length > 0 ? (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartSalesData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="name" 
        angle={-45}
        textAnchor="end"
        height={60}
        interval={0}
      />
      <YAxis />
      <Tooltip formatter={(value) => {if (typeof value === 'number') {
            return value.toLocaleString();
          }
          return value;
        }}
      />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="revenue" 
        stroke="#8884d8" 
        name="Revenue ($)" 
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 6 }}
      />
      <Line 
        type="monotone" 
        dataKey="orders" 
        stroke="#82ca9d" 
        name="Orders" 
        strokeWidth={2}
        dot={{ r: 4 }}
      />
    </LineChart>
  </ResponsiveContainer>
) : (
  <div className="h-64 flex items-center justify-center text-gray-500">
    No sales trend data available
  </div>
)}
</div>

                  {/* Category Performance */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Performance</h2>
    {adminAnalytics.data?.categoryPerformance?.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={adminAnalytics.data.categoryPerformance}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="revenue" 
            fill="#8884d8" 
            name="Revenue ($)" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="items_sold" 
            fill="#82ca9d" 
            name="Items Sold" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No category performance data available
      </div>
    )}
  </div>

                  {/* User Growth Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth (Last 12 Months)</h2>
                    {chartUserData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartUserData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => value.toLocaleString()}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="newUsers" 
                            stroke="#8884d8" 
                            name="New Users" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="totalUsers" 
                            stroke="#ff7300" 
                            name="Total Users" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        No user growth data available
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

            {/* Top Sellers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Sellers</h2>
              {adminAnalytics.data?.topSellers?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Seller</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Orders</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminAnalytics.data.topSellers.map((seller, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{seller.username}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{seller.email}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{seller.orders}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                            ${parseFloat(seller.revenue || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No top sellers data available
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    )}
  </div>
</div>
);
};

export default AdminDashboard;