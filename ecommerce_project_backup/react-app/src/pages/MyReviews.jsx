// import React, { useState, useEffect } from 'react';
// import { reviewsAPI } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const MyReviews = () => {
//   const { user } = useAuth();
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingReview, setEditingReview] = useState(null);

//   useEffect(() => {
//     fetchUserReviews();
//   }, []);

//   const fetchUserReviews = async () => {
//     try {
//       setLoading(true);
//       const response = await reviewsAPI.getUserReviews();
//       setReviews(response.data.reviews);
//     } catch (error) {
//       console.error('Error fetching user reviews:', error);
//       toast.error('Failed to load your reviews');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteReview = async (reviewId) => {
//     if (!window.confirm('Are you sure you want to delete this review?')) {
//       return;
//     }

//     try {
//       await reviewsAPI.deleteReview(reviewId);
//       toast.success('Review deleted successfully');
//       fetchUserReviews();
//     } catch (error) {
//       console.error('Error deleting review:', error);
//       toast.error('Failed to delete review');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
//           <p className="text-gray-600 mt-2">Manage your product reviews</p>
//         </div>

//         {reviews.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//             <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"/>
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">No Reviews Yet</h2>
//             <p className="text-gray-600 mb-6">
//               You haven't written any reviews yet. Start reviewing products you've purchased!
//             </p>
//             <button 
//               onClick={() => window.location.href = '/products'}
//               className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
//             >
//               Browse Products
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {reviews.map((review) => (
//               <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 text-lg mb-2">
//                       {review.product_name}
//                     </h3>
                    
//                     <div className="flex items-center space-x-4 mb-3">
//                       <div className="flex text-yellow-400">
//                         {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//                       </div>
//                       <span className="text-sm text-gray-500">
//                         {new Date(review.created_at).toLocaleDateString()}
//                       </span>
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         review.is_approved 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-amber-100 text-amber-800'
//                       }`}>
//                         {review.is_approved ? 'Approved' : 'Pending Approval'}
//                       </span>
//                     </div>

//                     {review.title && (
//                       <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
//                     )}
                    
//                     <p className="text-gray-700 leading-relaxed">{review.comment}</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
//                   <button
//                     onClick={() => setEditingReview(review)}
//                     className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteReview(review.id)}
//                     className="text-red-600 hover:text-red-800 text-sm font-medium"
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

// export default MyReviews;




// import React, { useState, useEffect } from 'react';
// import { reviewsAPI } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const MyReviews = () => {
//   const { user } = useAuth();
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingReview, setEditingReview] = useState(null);


//   // In MyReviews.jsx, add this debug code temporarily
// useEffect(() => {
//   console.log('Available reviewsAPI methods:', Object.keys(reviewsAPI));
//   fetchUserReviews();
// }, []);


//   useEffect(() => {
//     fetchUserReviews();
//   }, []);

//   const fetchUserReviews = async () => {
//     try {
//       setLoading(true);
//       const response = await reviewsAPI.getUserReviews();
//       console.log('User reviews response:', response.data); // Debug log
      
//       // Handle the response structure - it might be response.data.reviews or just response.data
//       const reviewsData = response.data.reviews || response.data || [];
//       setReviews(reviewsData);
//     } catch (error) {
//       console.error('Error fetching user reviews:', error);
//       toast.error('Failed to load your reviews');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteReview = async (reviewId) => {
//     if (!window.confirm('Are you sure you want to delete this review?')) {
//       return;
//     }

//     try {
//       await reviewsAPI.deleteReview(reviewId);
//       toast.success('Review deleted successfully');
//       fetchUserReviews();
//     } catch (error) {
//       console.error('Error deleting review:', error);
//       toast.error('Failed to delete review');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
//           <p className="text-gray-600 mt-2">Manage your product reviews</p>
//         </div>

//         {reviews.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//             <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
//               <svg fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"/>
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">No Reviews Yet</h2>
//             <p className="text-gray-600 mb-6">
//               You haven't written any reviews yet. Start reviewing products you've purchased!
//             </p>
//             <button 
//               onClick={() => window.location.href = '/products'}
//               className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
//             >
//               Browse Products
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {reviews.map((review) => (
//               <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 text-lg mb-2">
//                       {review.product_name || 'Product'}
//                     </h3>
                    
//                     <div className="flex items-center space-x-4 mb-3">
//                       <div className="flex text-yellow-400">
//                         {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//                       </div>
//                       <span className="text-sm text-gray-500">
//                         {new Date(review.created_at).toLocaleDateString()}
//                       </span>
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         review.is_approved 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-amber-100 text-amber-800'
//                       }`}>
//                         {review.is_approved ? 'Approved' : 'Pending Approval'}
//                       </span>
//                     </div>

//                     {review.title && (
//                       <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
//                     )}
                    
//                     <p className="text-gray-700 leading-relaxed">{review.comment}</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
//                   <button
//                     onClick={() => setEditingReview(review)}
//                     className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteReview(review.id)}
//                     className="text-red-600 hover:text-red-800 text-sm font-medium"
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

// export default MyReviews;





import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching user reviews...');
      const response = await reviewsAPI.getUserReviews();
      console.log('User reviews response:', response);
      
      // Handle different response structures
      let reviewsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          reviewsData = response.data;
        } else if (response.data.reviews) {
          reviewsData = response.data.reviews;
        } else if (Array.isArray(response.data.data)) {
          reviewsData = response.data.data;
        }
      }
      
      console.log('Processed reviews data:', reviewsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load your reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewsAPI.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      fetchUserReviews(); // Refresh the list
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-2">Manage your product reviews</p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Reviews Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't written any reviews yet. Start reviewing products you've purchased!
            </p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {review.product_name || 'Product'}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        review.is_approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {review.is_approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>

                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                    )}
                    
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setEditingReview(review)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;