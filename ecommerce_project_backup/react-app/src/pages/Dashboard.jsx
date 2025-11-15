// // src/pages/Dashboard.jsx
// import React from 'react';
// import { useAuth } from '../context/AuthContext';

// const Dashboard = () => {
//   const { user } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Welcome, {user?.username}!
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-blue-800">Total Orders</h3>
//               <p className="text-2xl font-bold text-blue-600">0</p>
//             </div>
            
//             <div className="bg-green-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-green-800">Total Revenue</h3>
//               <p className="text-2xl font-bold text-green-600">$0.00</p>
//             </div>
            
//             <div className="bg-purple-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-purple-800">Products</h3>
//               <p className="text-2xl font-bold text-purple-600">0</p>
//             </div>
//           </div>

//           <div className="p-4 bg-gray-50 rounded-lg">
//             <p className="text-gray-600">
//               {user?.role === 'admin' 
//                 ? 'Admin dashboard with analytics and user management coming soon.'
//                 : user?.role === 'seller'
//                 ? 'Seller dashboard with product management and sales analytics coming soon.'
//                 : 'Customer order history and preferences coming soon.'
//               }
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import SellerDashboard from './seller/SellerDashboard';
import CustomerDashboard from './customer/CustomerDashboard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'seller':
        return <SellerDashboard />;
      case 'customer':
        return <CustomerDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;