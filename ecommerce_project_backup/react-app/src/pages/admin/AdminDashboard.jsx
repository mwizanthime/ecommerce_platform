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


// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { dashboardAPI, reviewsAPI  } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import UserManagement from './UserManagement';
import CouponManagement from './CouponManagement';
import ReviewManagement from './ReviewManagement';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewStats, setReviewStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getAdminDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample chart data - replace with actual data from your API
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 240 },
    { name: 'Feb', sales: 3000, orders: 139 },
    { name: 'Mar', sales: 2000, orders: 980 },
    { name: 'Apr', sales: 2780, orders: 390 },
    { name: 'May', sales: 1890, orders: 480 },
    { name: 'Jun', sales: 2390, orders: 380 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home & Kitchen', value: 300 },
    { name: 'Books', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const userGrowthData = [
    { name: 'Jan', users: 100 },
    { name: 'Feb', users: 150 },
    { name: 'Mar', users: 200 },
    { name: 'Apr', users: 280 },
    { name: 'May', users: 350 },
    { name: 'Jun', users: 420 },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'coupons'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Coupon Management
          </button>
          <button
  onClick={() => setActiveTab('reviews')}
  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
    activeTab === 'reviews'
      ? 'border-primary-500 text-primary-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }`}
>
  Review Management
</button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div>
          {/* Stats Grid - Add Review Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats.totalUsers || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardData?.stats.totalProducts || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
              <p className="text-3xl font-bold text-purple-600">{dashboardData?.stats.totalOrders || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
              <p className="text-3xl font-bold text-orange-600">${dashboardData?.stats.totalRevenue || 0}</p>
            </div>
          </div>

          {/* Quick Stats - Add Review Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Sellers</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-2">{dashboardData?.stats.pendingSellers || 0}</p>
              <p className="text-gray-600">Sellers waiting for approval</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Products</h3>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {dashboardData?.lowStockProducts ? dashboardData.lowStockProducts.length : 0}
              </p>
              <p className="text-gray-600">Products that need restocking</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Statistics</h3>
              <p className="text-3xl font-bold text-indigo-600 mb-2">{reviewStats?.total || 0}</p>
              <div className="text-gray-600 text-sm">
                <span className="text-green-600">{reviewStats?.approved || 0} approved</span>
                <span className="mx-2">•</span>
                <span className="text-yellow-600">{reviewStats?.pending || 0} pending</span>
                <br />
                <span className="text-blue-600">{reviewStats?.recent || 0} recent (7 days)</span>
              </div>
            </div>
          </div>

          {/* Review Rating Distribution */}
          {reviewStats?.ratingDistribution && reviewStats.ratingDistribution.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Reviewed Products</h2>
              <div className="space-y-3">
                {reviewStats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-b-0">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800">{product.name}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {product.review_count} reviews
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* ... rest of the overview content ... */}
        </div>
      )}

{activeTab === 'reviews' && <ReviewManagement />}
      {activeTab === 'users' && <UserManagement />}
{activeTab === 'coupons' && <CouponManagement />}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;