// // src/pages/Profile.jsx
// import React from 'react';
// import { useAuth } from '../context/AuthContext';

// const Profile = () => {
//   const { user } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
        
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Username</label>
//                   <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Role</label>
//                   <p className="mt-1 text-lg text-gray-900 capitalize">{user?.role}</p>
//                 </div>
                
//                 {user?.role === 'seller' && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Approval Status</label>
//                     <p className={`mt-1 text-lg ${
//                       user?.is_approved ? 'text-green-600' : 'text-yellow-600'
//                     }`}>
//                       {user?.is_approved ? 'Approved' : 'Pending Approval'}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
//               <div className="space-y-3">
//                 <button className="w-full bg-primary-500 text-gray-700 py-2 px-4 rounded hover:bg-primary-600 transition-colors">
//                   Edit Profile
//                 </button>
//                 <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
//                   Change Password
//                 </button>
//                 {user?.role === 'seller' && (
//                   <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
//                     Seller Dashboard
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


// // src/pages/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { usersAPI } from '../services/api';
// import toast from 'react-hot-toast';

// const Profile = () => {
//   const { user, updateUser } = useAuth();
//   const [activeTab, setActiveTab] = useState('profile');
//   const [loading, setLoading] = useState(false);
  
//   // Profile form state
//   const [profileForm, setProfileForm] = useState({
//     username: '',
//     email: ''
//   });

//   // Password form state
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   // Initialize form with user data
//   useEffect(() => {
//     if (user) {
//       setProfileForm({
//         username: user.username || '',
//         email: user.email || ''
//       });
//     }
//   }, [user]);

//   const handleProfileChange = (e) => {
//     setProfileForm({
//       ...profileForm,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handlePasswordChange = (e) => {
//     setPasswordForm({
//       ...passwordForm,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await usersAPI.updateUser(user.id, profileForm);
//       toast.success('Profile updated successfully!');
      
//       // Update user in context
//       updateUser({
//         ...user,
//         username: profileForm.username,
//         email: profileForm.email
//       });
//     } catch (error) {
//       console.error('Profile update error:', error);
//       toast.error(error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();
    
//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       toast.error('New passwords do not match');
//       return;
//     }

//     if (passwordForm.newPassword.length < 6) {
//       toast.error('Password must be at least 6 characters long');
//       return;
//     }

//     setLoading(true);

//     try {
//       await usersAPI.updateUser(user.id, {
//         password: passwordForm.newPassword,
//         currentPassword: passwordForm.currentPassword
//       });
      
//       toast.success('Password updated successfully!');
//       setPasswordForm({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     } catch (error) {
//       console.error('Password update error:', error);
//       toast.error(error.response?.data?.message || 'Failed to update password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>
        
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Tab Navigation */}
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'profile'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Personal Information
//               </button>
//               <button
//                 onClick={() => setActiveTab('password')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'password'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Change Password
//               </button>
//               <button
//                 onClick={() => setActiveTab('account')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'account'
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Account Info
//               </button>
//             </nav>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {/* Personal Information Tab */}
//             {activeTab === 'profile' && (
//               <div>
//                 <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
//                 <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
//                   <div>
//                     <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       id="username"
//                       name="username"
//                       value={profileForm.username}
//                       onChange={handleProfileChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={profileForm.email}
//                       onChange={handleProfileChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       required
//                     />
//                   </div>
// {/* Profile Picture Upload */}
// <div className="flex items-center space-x-4 mb-6">
//   <div className="relative">
//     <img
//       src={user.profile_picture || '/api/placeholder/100/100'}
//       alt="Profile"
//       className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
//     />
//     <button
//       type="button"
//       className="absolute -bottom-2 -right-2 bg-primary-500 text-gray-700 p-1 rounded-full hover:bg-primary-600"
//     >
//       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//       </svg>
//     </button>
//   </div>
//   <div>
//     <h3 className="font-medium text-gray-900">Profile Picture</h3>
//     <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size 2MB.</p>
//   </div>
// </div>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-primary-500 text-gray-700 px-6 py-2 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Updating...' : 'Update Profile'}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Change Password Tab */}
//             {activeTab === 'password' && (
//               <div>
//                 <h2 className="text-xl font-semibold mb-6">Change Password</h2>
//                 <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
//                   <div>
//                     <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                       Current Password
//                     </label>
//                     <input
//                       type="password"
//                       id="currentPassword"
//                       name="currentPassword"
//                       value={passwordForm.currentPassword}
//                       onChange={handlePasswordChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                       New Password
//                     </label>
//                     <input
//                       type="password"
//                       id="newPassword"
//                       name="newPassword"
//                       value={passwordForm.newPassword}
//                       onChange={handlePasswordChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       required
//                       minLength="6"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
//                   </div>

//                   <div>
//                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                       Confirm New Password
//                     </label>
//                     <input
//                       type="password"
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       value={passwordForm.confirmPassword}
//                       onChange={handlePasswordChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-primary-500 text-gray-700 border border-gray-700 px-6 py-2 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Updating...' : 'Change Password'}
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Account Information Tab */}
//             {activeTab === 'account' && (
//               <div>
//                 <h2 className="text-xl font-semibold mb-6">Account Information</h2>
//                 <div className="space-y-6 max-w-md">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">User ID</label>
//                       <p className="mt-1 text-gray-900">{user.id}</p>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Account Role</label>
//                       <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Email Address</label>
//                     <p className="mt-1 text-gray-900">{user.email}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Username</label>
//                     <p className="mt-1 text-gray-900">{user.username}</p>
//                   </div>

//                   {user.role === 'seller' && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Seller Status</label>
//                       <p className={`mt-1 text-lg ${
//                         user.is_approved ? 'text-green-600' : 'text-yellow-600'
//                       }`}>
//                         {user.is_approved ? 'Approved' : 'Pending Approval'}
//                       </p>
//                       {!user.is_approved && (
//                         <p className="text-sm text-gray-500 mt-1">
//                           Your seller account is pending approval. You'll be able to add products once approved.
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Member Since</label>
//                     <p className="mt-1 text-gray-900">
//                       {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
//                     </p>
//                   </div>

//                   {/* Quick Actions */}
//                   <div className="border-t border-gray-200 pt-6">
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
//                     <div className="space-y-3">
//                       {user.role === 'seller' && (
//                         <button
//                           onClick={() => window.location.href = '/dashboard'}
//                           className="w-full bg-primary-500 text-gray-700 border border-gray-500 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-left"
//                         >
//                           Go to Seller Dashboard
//                         </button>
//                       )}
//                       <button
//                         onClick={() => window.location.href = '/orders'}
//                         className="w-full bg-primary-500 text-gray-700 border border-gray-500 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-left"
//                       >
//                         View Order History
//                       </button>
//                       <button
//                         onClick={() => window.location.href = '/products'}
//                         className="w-full bg-primary-500 text-gray-700 border border-gray-500 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-left"
//                       >
//                         Continue Shopping
//                       </button>
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

// export default Profile;




// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import toast from 'react-hot-toast';


const Profile = () => {
  const { user, updateUser, fetchUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

 useEffect(() => {
  console.log('=== PROFILE DEBUG INFO ===');
  console.log('User object:', user);
  console.log('Profile picture value:', user?.profile_picture);
  console.log('Profile picture type:', typeof user?.profile_picture);
  
  if (user?.profile_picture) {
    const url = getProfilePictureUrl(user.profile_picture);
    console.log('Constructed URL:', url);
    
    // Test if the image loads
    const img = new Image();
    img.onload = () => console.log('✅ Image URL is accessible');
    img.onerror = () => console.log('❌ Image URL is NOT accessible');
    img.src = url;
  }
}, [user]);

  // Profile Picture Handlers
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };


// // Profile Picture Handlers - Updated URL construction
// const getProfilePictureUrl = (profilePicture) => {
//   if (!profilePicture) {
//     return null;
//   }

//   // If it's already a full URL, use it as is
//   if (profilePicture.startsWith('http')) {
//     return profilePicture;
//   }

//   // If it starts with /uploads, construct the full URL
//   if (profilePicture.startsWith('/uploads')) {
//     return `http://localhost:5000${profilePicture}`;
//   }

//   // If it's just a filename, construct the path
//   return `http://localhost:5000/uploads/${profilePicture}`;
// };


const getProfilePictureUrl = (profilePicture) => {
  console.log('getProfilePictureUrl called with:', profilePicture);
  
  if (!profilePicture) {
    console.log('No profile picture provided');
    return null;
  }

  // If it's already a full URL, use it as is
  if (profilePicture.startsWith('http')) {
    console.log('Already a full URL:', profilePicture);
    return profilePicture;
  }

  // If it starts with /uploads, construct the full URL
  if (profilePicture.startsWith('/uploads')) {
    const fullUrl = `http://localhost:5000${profilePicture}`;
    console.log('Constructed URL from /uploads:', fullUrl);
    return fullUrl;
  }

  // If it's just a filename, construct the path
  const fullUrl = `http://localhost:5000/uploads/profiles/${profilePicture}`;
  console.log('Constructed URL from filename:', fullUrl);
  return fullUrl;
};

// Add this useEffect for debugging
useEffect(() => {
  console.log('=== USER OBJECT DEBUG ===');
  console.log('Full user object:', user);
  console.log('Profile picture value:', user?.profile_picture);
  console.log('Profile picture type:', typeof user?.profile_picture);
  
  if (user?.profile_picture) {
    const profileUrl = getProfilePictureUrl(user.profile_picture);
    console.log('Final profile URL:', profileUrl);
    
    // Test if the image exists
    if (profileUrl) {
      const img = new Image();
      img.onload = () => console.log('✅ Profile picture URL is accessible');
      img.onerror = () => console.log('❌ Profile picture URL is NOT accessible');
      img.src = profileUrl;
    }
  }
}, [user]);
  
  // const handleProfilePictureUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   // Validate file type and size
  //   const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  //   if (!validTypes.includes(file.type)) {
  //     toast.error('Please select a valid image file (JPEG, PNG, GIF)');
  //     return;
  //   }

  //   if (file.size > 2 * 1024 * 1024) { // 2MB
  //     toast.error('Image size must be less than 2MB');
  //     return;
  //   }

  //   setProfilePictureLoading(true);
  //   const formData = new FormData();
  //   formData.append('profile_picture', file);

  //   try {
  //     const response = await usersAPI.uploadProfilePicture(formData);
  //     toast.success('Profile picture updated successfully!');
      
  //     // Update user in context
  //     updateUser(response.data.user);
  //   } catch (error) {
  //     console.error('Profile picture upload error:', error);
  //     toast.error(error.response?.data?.message || 'Failed to upload profile picture');
  //   } finally {
  //     setProfilePictureLoading(false);
  //     // Reset file input
  //     event.target.value = '';
  //   }
  // };

// src/pages/Profile.jsx - Update the upload handler
// const handleProfilePictureUpload = async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   console.log('Selected file:', file);

//   // Validate file type and size
//   const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//   if (!validTypes.includes(file.type)) {
//     toast.error('Please select a valid image file (JPEG, PNG, GIF)');
//     return;
//   }

//   if (file.size > 2 * 1024 * 1024) { // 2MB
//     toast.error('Image size must be less than 2MB');
//     return;
//   }

//   setProfilePictureLoading(true);
//   const formData = new FormData();
//   formData.append('profile_picture', file);

//   try {
//     console.log('Uploading profile picture...');
//     const response = await usersAPI.uploadProfilePicture(formData);
//     console.log('Upload response:', response.data);
    
//     toast.success('Profile picture updated successfully!');
    
//     // Update user in context
//     updateUser(response.data.user);
//   } catch (error) {
//     console.error('Profile picture upload error:', error);
//     console.error('Error details:', error.response?.data);
    
//     if (error.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error('Failed to upload profile picture. Please try again.');
//     }
//   } finally {
//     setProfilePictureLoading(false);
//     // Reset file input
//     event.target.value = '';
//   }
// };




// Update the upload handler with more detailed logging
// const handleProfilePictureUpload = async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   console.log('Selected file:', file);
//   console.log('Current user before upload:', user);

//   // Validate file type and size
//   const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//   if (!validTypes.includes(file.type)) {
//     toast.error('Please select a valid image file (JPEG, PNG, GIF)');
//     return;
//   }

//   if (file.size > 2 * 1024 * 1024) { // 2MB
//     toast.error('Image size must be less than 2MB');
//     return;
//   }

//   setProfilePictureLoading(true);
//   const formData = new FormData();
//   formData.append('profile_picture', file);

//   try {
//     console.log('Uploading profile picture...');
//     const response = await usersAPI.uploadProfilePicture(formData);
//     console.log('Upload response:', response.data);
    
//     toast.success('Profile picture updated successfully!');
    
//     // Update user in context
//     console.log('Updating user context with:', response.data.user);
//     updateUser(response.data.user);
//   } catch (error) {
//     console.error('Profile picture upload error:', error);
//     console.error('Error details:', error.response?.data);
    
//     if (error.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error('Failed to upload profile picture. Please try again.');
//     }
//   } finally {
//     setProfilePictureLoading(false);
//     // Reset file input
//     event.target.value = '';
//   }
// };


const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  console.log('Selected file:', file);

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    toast.error('Please select a valid image file (JPEG, PNG, GIF)');
    return;
  }

  if (file.size > 2 * 1024 * 1024) { // 2MB
    toast.error('Image size must be less than 2MB');
    return;
  }

  setProfilePictureLoading(true);
  const formData = new FormData();
  formData.append('profile_picture', file);

  try {
    console.log('Uploading profile picture...');
    const response = await usersAPI.uploadProfilePicture(formData);
    console.log('Upload response:', response.data);
    
    toast.success('Profile picture updated successfully!');
    
    // Refresh user data from auth profile
    await fetchUserProfile();
  } catch (error) {
    console.error('Profile picture upload error:', error);
    console.error('Error details:', error.response?.data);
    
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to upload profile picture. Please try again.');
    }
  } finally {
    setProfilePictureLoading(false);
    event.target.value = '';
  }
};



// Update the remove handler too
const handleRemoveProfilePicture = async () => {
  if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

  setProfilePictureLoading(true);
  try {
    const response = await usersAPI.removeProfilePicture();
    toast.success('Profile picture removed successfully!');
    
    // Refresh user data from auth profile
    await fetchUserProfile();
  } catch (error) {
    console.error('Remove profile picture error:', error);
    toast.error(error.response?.data?.message || 'Failed to remove profile picture');
  } finally {
    setProfilePictureLoading(false);
  }
};

  // const handleRemoveProfilePicture = async () => {
  //   if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

  //   setProfilePictureLoading(true);
  //   try {
  //     const response = await usersAPI.removeProfilePicture();
  //     toast.success('Profile picture removed successfully!');
      
  //     // Update user in context
  //     updateUser(response.data.user);
  //   } catch (error) {
  //     console.error('Remove profile picture error:', error);
  //     toast.error(error.response?.data?.message || 'Failed to remove profile picture');
  //   } finally {
  //     setProfilePictureLoading(false);
  //   }
  // };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await usersAPI.updateUser(user.id, profileForm);
      toast.success('Profile updated successfully!');
      
      // Update user in context
      updateUser({
        ...user,
        username: profileForm.username,
        email: profileForm.email
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // const handlePasswordUpdate = async (e) => {
  //   e.preventDefault();
    
  //   if (passwordForm.newPassword !== passwordForm.confirmPassword) {
  //     toast.error('New passwords do not match');
  //     return;
  //   }

  //   if (passwordForm.newPassword.length < 6) {
  //     toast.error('Password must be at least 6 characters long');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     await usersAPI.updateUser(user.id, {
  //       password: passwordForm.newPassword,
  //       currentPassword: passwordForm.currentPassword
  //     });
      
  //     toast.success('Password updated successfully!');
  //     setPasswordForm({
  //       currentPassword: '',
  //       newPassword: '',
  //       confirmPassword: ''
  //     });
  //   } catch (error) {
  //     console.error('Password update error:', error);
  //     toast.error(error.response?.data?.message || 'Failed to update password');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// src/pages/Profile.jsx - Update handlePasswordUpdate
const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('New passwords do not match');
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    toast.error('Password must be at least 6 characters long');
    return;
  }

  setLoading(true);

  try {
    // Only send password-related fields for password update
    const passwordData = {
      password: passwordForm.newPassword,
      currentPassword: passwordForm.currentPassword
    };

    await usersAPI.updateUser(user.id, passwordData);
    
    toast.success('Password updated successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  } catch (error) {
    console.error('Password update error:', error);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to update password');
    }
  } finally {
    setLoading(false);
  }
};


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'account'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Info
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                
                {/* Profile Picture Upload Section */}
                {/* <div className="flex items-center space-x-6 mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    

                    <img
  src={
    user.profile_picture 
      ? `http://localhost:5000${user.profile_picture}`
      : `/api/placeholder/100/100?text=${user.username.charAt(0).toUpperCase()}`
  }
  alt="Profile"
  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
  onError={(e) => {
    console.error('Image failed to load:', user.profile_picture);
    e.target.src = `/api/placeholder/100/100?text=${user.username.charAt(0).toUpperCase()}`;
  }}
/>
                    {profilePictureLoading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">Profile Picture</h3>
                    <p className="text-sm text-gray-500 mb-3">JPG, JPEG, PNG or GIF. Max size 2MB.</p>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={handleProfilePictureClick}
                        disabled={profilePictureLoading}
                        className="bg-primary-600 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        Upload Photo
                      </button>
                      {user.profile_picture && (
                        <button
                          type="button"
                          onClick={handleRemoveProfilePicture}
                          disabled={profilePictureLoading}
                          className="bg-primary-6 text-red-500 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureUpload}
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    className="hidden"
                  />
                </div> */}
<div className="flex items-center space-x-6 mb-8 p-4 bg-gray-50 rounded-lg">
  {/* <div className="relative">
    <img
      src={
        user.profile_picture 
          ? getProfilePictureUrl(user.profile_picture)
          : `https://ui-avatars.com/api/?name=${user.username.charAt(0).toUpperCase()}&background=random&size=100&color=fff`
      }
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
      onError={(e) => {
        console.error('Image failed to load:', user.profile_picture);
        console.log('Full user object:', user); // Debug: check what's in user object
        e.target.src = `https://ui-avatars.com/api/?name=${user.username.charAt(0).toUpperCase()}&background=random&size=100&color=fff`;
      }}
    />
    {profilePictureLoading && (
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )}
  </div> */}
<div className="relative">
  {user?.profile_picture ? (
    <img
      src={getProfilePictureUrl(user.profile_picture)}
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
      onError={(e) => {
        console.error('❌ Image failed to load');
        console.error('User profile_picture:', user.profile_picture);
        console.error('Attempted URL:', e.target.src);
        e.target.src = `https://ui-avatars.com/api/?name=${user.username.charAt(0).toUpperCase()}&background=random&size=100&color=fff`;
      }}
      onLoad={() => console.log('✅ Profile picture loaded successfully')}
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md flex items-center justify-center">
      <span className="text-2xl font-bold text-gray-600">
        {user?.username?.charAt(0).toUpperCase()}
      </span>
    </div>
  )}
  {profilePictureLoading && (
    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  )}
</div>


  <div className="flex-1">
    <h3 className="font-medium text-gray-900 text-lg">Profile Picture</h3>
    <p className="text-sm text-gray-500 mb-3">JPG, JPEG, PNG or GIF. Max size 2MB.</p>
    <div className="flex space-x-3">
      <button
        type="button"
        onClick={handleProfilePictureClick}
        disabled={profilePictureLoading}
        className="bg-primary-600 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
      >
        {profilePictureLoading ? 'Uploading...' : 'Upload Photo'}
      </button>
      {user.profile_picture && (
        <button
          type="button"
          onClick={handleRemoveProfilePicture}
          disabled={profilePictureLoading}
          className="bg-primary-6 text-red-500 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Remove
        </button>
      )}
    </div>
  </div>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleProfilePictureUpload}
    accept="image/jpeg,image/jpg,image/png,image/gif"
    className="hidden"
  />
</div>
                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-600 text-gray-700 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {/* Other tabs remain the same */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                      minLength="6"
                    />
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-600 text-gray-700 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                <div className="space-y-6 max-w-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">User ID</label>
                      <p className="mt-1 text-gray-900">{user.id}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Role</label>
                      <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
                    </div>
                    
                  </div>
<div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <div className="relative">
  {user?.profile_picture ? (
    <img
      src={getProfilePictureUrl(user.profile_picture)}
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
      onError={(e) => {
        console.error('❌ Image failed to load');
        console.error('User profile_picture:', user.profile_picture);
        console.error('Attempted URL:', e.target.src);
        e.target.src = `https://ui-avatars.com/api/?name=${user.username.charAt(0).toUpperCase()}&background=random&size=100&color=fff`;
      }}
      onLoad={() => console.log('✅ Profile picture loaded successfully')}
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md flex items-center justify-center">
      <span className="text-2xl font-bold text-gray-600">
        {user?.username?.charAt(0).toUpperCase()}
      </span>
    </div>
  )}
  {profilePictureLoading && (
    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  )}
</div>
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-gray-900">{user.username}</p>
                  </div>

                  {user.role === 'seller' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Seller Status</label>
                      <p className={`mt-1 text-lg ${
                        user.is_approved ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {user.is_approved ? 'Approved' : 'Pending Approval'}
                      </p>
                      {!user.is_approved && (
                        <p className="text-sm text-gray-500 mt-1">
                          Your seller account is pending approval. You'll be able to add products once approved.
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-gray-900">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {user.role === 'seller' && (
                        <button
                          onClick={() => window.location.href = '/dashboard'}
                          className="w-full bg-primary-600 text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-left"
                        >
                          Go to Seller Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => window.location.href = '/orders'}
                        className="w-full bg-primary-600 text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-left"
                      >
                        View Order History
                      </button>
                      <button
                        onClick={() => window.location.href = '/products'}
                        className="w-full bg-primary-600 text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-left"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;