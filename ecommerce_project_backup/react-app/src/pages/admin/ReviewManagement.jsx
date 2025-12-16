// import React, { useState, useEffect } from 'react';
// import { reviewsAPI } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const ReviewManagement = () => {
//   const { user } = useAuth();
//   const [pendingReviews, setPendingReviews] = useState([]);
//   const [allReviews, setAllReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('pending');
//   const [moderating, setModerating] = useState({});

//   useEffect(() => {
//     fetchReviews();
//   }, [activeTab]);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       if (activeTab === 'pending') {
//         const response = await reviewsAPI.getAdminPendingReviews();
//         setPendingReviews(response.data.reviews || []);
//       } else {
//         // For all reviews, we might need a different endpoint
//         // For now, we'll use the same endpoint but you should create a proper one
//         const response = await reviewsAPI.getAdminPendingReviews();
//         setAllReviews(response.data.reviews || []);
//       }
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       toast.error('Failed to load reviews');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleModerate = async (reviewId, action) => {
//     try {
//       setModerating(prev => ({ ...prev, [reviewId]: true }));
      
//       await reviewsAPI.moderateAdminReview(reviewId, { action });
      
//       toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
//       // Remove from pending reviews
//       setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
//       setAllReviews(prev => prev.filter(review => review.id !== reviewId));
      
//     } catch (error) {
//       console.error('Error moderating review:', error);
//       toast.error(error.response?.data?.message || 'Failed to moderate review');
//     } finally {
//       setModerating(prev => ({ ...prev, [reviewId]: false }));
//     }
//   };

//   const handleDeleteReview = async (reviewId) => {
//     if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await reviewsAPI.deleteReview(reviewId);
//       toast.success('Review deleted successfully');
      
//       // Remove from lists
//       setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
//       setAllReviews(prev => prev.filter(review => review.id !== reviewId));
      
//     } catch (error) {
//       console.error('Error deleting review:', error);
//       toast.error('Failed to delete review');
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

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   const reviewsToDisplay = activeTab === 'pending' ? pendingReviews : allReviews;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
//           <p className="text-gray-600 mt-2">Manage and moderate product reviews</p>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('pending')}
//                 className={`py-4 px-6 text-sm font-medium border-b-2 ${
//                   activeTab === 'pending'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Pending Reviews ({pendingReviews.length})
//               </button>
//               <button
//                 onClick={() => setActiveTab('all')}
//                 className={`py-4 px-6 text-sm font-medium border-b-2 ${
//                   activeTab === 'all'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 All Reviews
//               </button>
//             </nav>
//           </div>
//         </div>

//         {/* Reviews List */}
//         {reviewsToDisplay.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//             <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"/>
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">
//               {activeTab === 'pending' ? 'No Pending Reviews' : 'No Reviews'}
//             </h2>
//             <p className="text-gray-600">
//               {activeTab === 'pending' 
//                 ? 'All reviews have been moderated.' 
//                 : 'No reviews found in the system.'}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {reviewsToDisplay.map((review) => (
//               <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {review.product_name}
//                       </h3>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         review.is_approved 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {review.is_approved ? 'Approved' : 'Pending'}
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
//                       <span>by {review.username}</span>
//                       <span>•</span>
//                       <span>{formatDate(review.created_at)}</span>
//                     </div>

//                     <div className="flex items-center mb-4">
//                       <div className="flex text-yellow-400 text-lg">
//                         {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//                       </div>
//                     </div>

//                     {review.title && (
//                       <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
//                     )}
                    
//                     <p className="text-gray-700 leading-relaxed">{review.comment}</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
//                   {!review.is_approved && (
//                     <>
//                       <button
//                         onClick={() => handleModerate(review.id, 'reject')}
//                         disabled={moderating[review.id]}
//                         className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
//                       >
//                         {moderating[review.id] ? 'Rejecting...' : 'Reject'}
//                       </button>
//                       <button
//                         onClick={() => handleModerate(review.id, 'approve')}
//                         disabled={moderating[review.id]}
//                         className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
//                       >
//                         {moderating[review.id] ? 'Approving...' : 'Approve'}
//                       </button>
//                     </>
//                   )}
//                   <button
//                     onClick={() => handleDeleteReview(review.id)}
//                     className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewManagement;


//src/pages/admin/reviewManagement.jsx
import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const ReviewManagement = () => {
  const { user } = useAuth();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [moderating, setModerating] = useState({});
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    rating: null,
    search: ''
  });

  useEffect(() => {
    fetchReviews();
    if (activeTab === 'all') {
      fetchReviewStats();
    }
  }, [activeTab, filters]);

  
const fetchReviews = async () => {
  try {
    setLoading(true);
    if (activeTab === 'pending') {
      const response = await reviewsAPI.getAdminPendingReviews();
      console.log('Pending reviews response:', response.data);
      setPendingReviews(response.data.reviews || []);
    } else {
      // Use the new endpoint for all reviews
      const response = await reviewsAPI.getAdminAllReviews(filters);
      console.log('All reviews response:', response.data);
      setAllReviews(response.data.reviews || []);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    console.error('Error details:', error.response?.data);
    toast.error('Failed to load reviews');
  } finally {
    setLoading(false);
  }
};
  const fetchReviewStats = async () => {
    try {
      const response = await reviewsAPI.getAdminReviewStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const handleModerate = async (reviewId, action) => {
    try {
      setModerating(prev => ({ ...prev, [reviewId]: true }));
      
      await reviewsAPI.moderateAdminReview(reviewId, { action });
      
      toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Refresh the lists
      await fetchReviews();
      if (activeTab === 'all') {
        await fetchReviewStats();
      }
      
    } catch (error) {
      console.error('Error moderating review:', error);
      toast.error(error.response?.data?.message || 'Failed to moderate review');
    } finally {
      setModerating(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      await reviewsAPI.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      
      // Refresh the lists
      await fetchReviews();
      if (activeTab === 'all') {
        await fetchReviewStats();
      }
      
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleBulkApprove = async () => {
    const pendingIds = pendingReviews.map(review => review.id);
    if (pendingIds.length === 0) return;

    if (!window.confirm(`Are you sure you want to approve all ${pendingIds.length} pending reviews?`)) {
      return;
    }

    try {
      setModerating(prev => ({ ...prev, bulk: true }));
      
      // Approve each review individually
      for (const reviewId of pendingIds) {
        await reviewsAPI.moderateAdminReview(reviewId, { action: 'approve' });
      }
      
      toast.success(`Approved ${pendingIds.length} reviews successfully`);
      await fetchReviews();
      await fetchReviewStats();
      
    } catch (error) {
      console.error('Error in bulk approve:', error);
      toast.error('Failed to approve some reviews');
    } finally {
      setModerating(prev => ({ ...prev, bulk: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (review) => {
    if (review.is_approved) {
      return {
        text: 'Approved',
        class: 'bg-green-100 text-green-800 border-green-200',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        )
      };
    } else {
      return {
        text: 'Pending',
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
        )
      };
    }
  };

  if (loading && activeTab === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const reviewsToDisplay = activeTab === 'pending' ? pendingReviews : allReviews;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600 mt-2">Manage and moderate product reviews</p>
        </div>

        {/* Stats Cards */}
        {stats && activeTab === 'all'  &&(
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1m8-9v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V7a1 1 0 011-1h4a1 1 0 011 1z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Reviews ({pendingReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Reviews
              </button>
            </nav>
          </div>

          {/* Filters and Actions */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {activeTab === 'all' && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <select
                    value={filters.rating || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value || null }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              {activeTab === 'pending' && pendingReviews.length > 0 && (
                <button
                  onClick={handleBulkApprove}
                  disabled={moderating.bulk}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {moderating.bulk ? 'Approving All...' : `Approve All (${pendingReviews.length})`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {reviewsToDisplay.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {activeTab === 'pending' ? 'No Pending Reviews' : 'No Reviews Found'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'pending' 
                ? 'All reviews have been moderated.' 
                : 'No reviews match your current filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviewsToDisplay.map((review) => {
              const statusBadge = getStatusBadge(review);
              
              return (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {review.product_name}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.class}`}>
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="font-medium">by {review.username}</span>
                        <span>•</span>
                        <span>{review.email}</span>
                        <span>•</span>
                        <span>{formatDate(review.created_at)}</span>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 text-lg">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating} out of 5
                        </span>
                      </div>

                      {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-2 text-lg">{review.title}</h4>
                      )}
                      
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Review ID: #{review.id}
                    </div>
                    
                    <div className="flex space-x-3">
                      {!review.is_approved && (
                        <>
                          <button
                            onClick={() => handleModerate(review.id, 'reject')}
                            disabled={moderating[review.id]}
                            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            {moderating[review.id] ? 'Rejecting...' : 'Reject'}
                          </button>
                          <button
                            onClick={() => handleModerate(review.id, 'approve')}
                            disabled={moderating[review.id]}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {moderating[review.id] ? 'Approving...' : 'Approve'}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;