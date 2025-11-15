// // src/pages/admin/UserManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { usersAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingUser, setEditingUser] = useState(null);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await usersAPI.getUsers();
//       setUsers(response.data.users);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveSeller = async (userId) => {
//     try {
//       await usersAPI.approveSeller(userId);
//       toast.success('Seller approved successfully');
//       fetchUsers(); // Refresh the list
//     } catch (error) {
//       console.error('Error approving seller:', error);
//       toast.error('Failed to approve seller');
//     }
//   };

//   // const handleDeleteUser = async (userId) => {
//   //   if (!window.confirm('Are you sure you want to delete this user?')) {
//   //     return;
//   //   }

//   //   try {
//   //     await usersAPI.deleteUser(userId);
//   //     toast.success('User deleted successfully');
//   //     fetchUsers(); // Refresh the list
//   //   } catch (error) {
//   //     console.error('Error deleting user:', error);
//   //     toast.error('Failed to delete user');
//   //   }
//   // };


//   // src/pages/admin/UserManagement.jsx
// const handleDeleteUser = async (userId) => {
//   if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone if the user has related records.')) {
//     return;
//   }

//   try {
//     await usersAPI.deleteUser(userId);
//     toast.success('User deleted successfully');
//     fetchUsers(); // Refresh the list
//   } catch (error) {
//     console.error('Error deleting user:', error);
    
//     if (error.response?.status === 400) {
//       // Show detailed error message for constraints
//       toast.error(error.response.data.message);
//     } else if (error.response?.status === 403) {
//       toast.error('Access denied');
//     } else {
//       toast.error('Failed to delete user');
//     }
//   }
// };



//   const handleEditUser = (user) => {
//     setEditingUser(user);
//   };

//   // const handleUpdateUser = async (e) => {
//   //   e.preventDefault();
//   //   const formData = new FormData(e.target);
//   //   const userData = {
//   //     username: formData.get('username'),
//   //     email: formData.get('email'),
//   //     role: formData.get('role')
//   //   };

//   //   try {
//   //     await usersAPI.updateUser(editingUser.id, userData);
//   //     toast.success('User updated successfully');
//   //     setEditingUser(null);
//   //     fetchUsers(); // Refresh the list
//   //   } catch (error) {
//   //     console.error('Error updating user:', error);
//   //     toast.error('Failed to update user');
//   //   }
//   // };

// const handleUpdateUser = async (e) => {
//   e.preventDefault();
//   const formData = new FormData(e.target);
//   const userData = {
//     username: formData.get('username'),
//     email: formData.get('email'),
//     role: formData.get('role')
//   };

//   try {
//     const response = await usersAPI.updateUser(editingUser.id, userData);
//     toast.success('User updated successfully');
//     setEditingUser(null);
//     fetchUsers(); // Refresh the list
//   } catch (error) {
//     console.error('Error updating user:', error);
//     if (error.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error('Failed to update user');
//     }
//   }
// };


//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>

//       {/* Edit User Modal */}
//       {/* {editingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">Edit User</h3>
//             <form onSubmit={handleUpdateUser}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Username</label>
//                   <input
//                     type="text"
//                     name="username"
//                     defaultValue={editingUser.username}
//                     className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     defaultValue={editingUser.email}
//                     className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Role</label>
//                   <select
//                     name="role"
//                     defaultValue={editingUser.role}
//                     className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="customer">Customer</option>
//                     <option value="seller">Seller</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setEditingUser(null)}
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//                 >
//                   Update User
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}


//       {editingUser && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white rounded-lg p-6 w-full max-w-md">
//       <h3 className="text-lg font-semibold mb-4">Edit User</h3>
//       <form onSubmit={handleUpdateUser}>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Username</label>
//             <input
//               type="text"
//               name="username"
//               defaultValue={editingUser.username}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               defaultValue={editingUser.email}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Role</label>
//             <select
//               name="role"
//               defaultValue={editingUser.role}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             >
//               <option value="customer">Customer</option>
//               <option value="seller">Seller</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//         </div>
//         <div className="flex justify-end space-x-3 mt-6">
//           <button
//             type="button"
//             onClick={() => setEditingUser(null)}
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
//           >
//             Update User
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 User
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Joined
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{user.username}</div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
//                     user.role === 'seller' ? 'bg-green-100 text-green-800' :
//                     'bg-blue-100 text-blue-800'
//                   }`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {user.role === 'seller' ? (
//                     user.is_approved ? (
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                         Approved
//                       </span>
//                     ) : (
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                         Pending
//                       </span>
//                     )
//                   ) : (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                       Active
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(user.created_at).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button
//                     onClick={() => handleEditUser(user)}
//                     className="text-primary-600 hover:text-primary-900"
//                   >
//                     Edit
//                   </button>
//                   {user.role === 'seller' && !user.is_approved && (
//                     <button
//                       onClick={() => handleApproveSeller(user.id)}
//                       className="text-green-600 hover:text-green-900"
//                     >
//                       Approve
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDeleteUser(user.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;





// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    // Status filter (for sellers)
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'approved' && user.is_approved) ||
      (statusFilter === 'pending' && user.role === 'seller' && !user.is_approved) ||
      (statusFilter === 'active' && user.role !== 'seller');

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleApproveSeller = async (userId) => {
    try {
      await usersAPI.approveSeller(userId);
      toast.success('Seller approved successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error approving seller:', error);
      toast.error('Failed to approve seller');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone if the user has related records.')) {
      return;
    }

    try {
      await usersAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      
      if (error.response?.status === 400) {
        // Show detailed error message for constraints
        toast.error(error.response.data.message);
      } else if (error.response?.status === 403) {
        toast.error('Access denied');
      } else {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      role: formData.get('role')
    };

    try {
      const response = await usersAPI.updateUser(editingUser.id, userData);
      toast.success('User updated successfully');
      setEditingUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update user');
      }
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="approved">Approved Sellers</option>
              <option value="pending">Pending Sellers</option>
            </select>
          </div>
        </div>

        {/* Results and Clear Filters */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
            {searchTerm && (
              <span> for "<strong>{searchTerm}</strong>"</span>
            )}
          </div>
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={editingUser.username}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser.email}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No users registered yet'
              }
            </p>
            {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'seller' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'seller' ? (
                      user.is_approved ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </button>
                    {user.role === 'seller' && !user.is_approved && (
                      <button
                        onClick={() => handleApproveSeller(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;