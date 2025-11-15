// // frontend/src/components/Reviews/ProductReviews.jsx
// import React, { useState, useEffect } from 'react';
// import { reviewsAPI } from '../../services/api';
// import ReviewList from './ReviewList';
// import ReviewStats from './ReviewStats';
// import ReviewForm from './ReviewForm';
// import { useAuth } from '../../context/AuthContext';

// const ProductReviews = ({ productId }) => {
//   const { user } = useAuth();
//   const [reviews, setReviews] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [pagination, setPagination] = useState({});
//   const [userReview, setUserReview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 10,
//     sort: 'newest',
//     rating: null
//   });

//   useEffect(() => {
//     fetchReviews();
//     if (user) {
//       fetchUserReview();
//     }
//   }, [productId, filters, user]);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const response = await reviewsAPI.getProductReviews(productId, filters);
//       setReviews(response.data.reviews);
//       setStats(response.data.stats);
//       setPagination(response.data.pagination);
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserReview = async () => {
//     try {
//       const response = await reviewsAPI.getUserReview(productId);
//       setUserReview(response.data.review);
//     } catch (error) {
//       console.error('Error fetching user review:', error);
//     }
//   };

//   const handleFilterChange = (newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
//   };

//   const handlePageChange = (newPage) => {
//     setFilters(prev => ({ ...prev, page: newPage }));
//   };

//   const handleReviewSubmit = async (reviewData) => {
//     try {
//       await reviewsAPI.createReview(reviewData);
//       setShowForm(false);
//       fetchReviews();
//       fetchUserReview();
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleReviewUpdate = async (reviewId, reviewData) => {
//     try {
//       await reviewsAPI.updateReview(reviewId, reviewData);
//       setShowForm(false);
//       fetchReviews();
//       fetchUserReview();
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleReviewDelete = async (reviewId) => {
//     try {
//       await reviewsAPI.deleteReview(reviewId);
//       setUserReview(null);
//       fetchReviews();
//     } catch (error) {
//       throw error;
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-8">
//       {/* Review Stats */}
//       {stats && (
//         <ReviewStats 
//           stats={stats}
//           onFilterChange={handleFilterChange}
//           currentFilters={filters}
//         />
//       )}

//       {/* User Review Section */}
//       {user && !userReview && !showForm && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Share Your Experience
//           </h3>
//           <p className="text-gray-600 mb-4">
//             Purchased this product? Help others by sharing your review.
//           </p>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Write a Review
//           </button>
//         </div>
//       )}

//       {/* Review Form */}
//       {showForm && (
//         <ReviewForm
//           productId={productId}
//           existingReview={userReview}
//           onSubmit={userReview ? 
//             (data) => handleReviewUpdate(userReview.id, data) : 
//             handleReviewSubmit
//           }
//           onCancel={() => setShowForm(false)}
//         />
//       )}

//       {/* User's Existing Review */}
//       {userReview && !showForm && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="font-semibold text-blue-900">Your Review</h3>
//               <div className="flex items-center mt-1">
//                 <div className="flex text-yellow-400">
//                   {'★'.repeat(userReview.rating)}{'☆'.repeat(5 - userReview.rating)}
//                 </div>
//                 <span className="ml-2 text-sm text-blue-700">
//                   {userReview.title}
//                 </span>
//               </div>
//               <p className="text-blue-800 mt-2">{userReview.comment}</p>
//               <span className="text-xs text-blue-600 mt-1 block">
//                 Status: {userReview.is_approved ? 'Approved' : 'Pending Approval'}
//               </span>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="text-blue-600 hover:text-blue-800 text-sm"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleReviewDelete(userReview.id)}
//                 className="text-red-600 hover:text-red-800 text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reviews List */}
//       <ReviewList
//         reviews={reviews}
//         loading={loading}
//         pagination={pagination}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default ProductReviews;




// import React, { useState, useEffect } from 'react';
// import { reviewsAPI } from '../../services/api';
// import ReviewList from './ReviewList';
// import ReviewStats from './ReviewStats';
// import ReviewForm from './ReviewForm';
// import { useAuth } from '../../context/AuthContext';

// const ProductReviews = ({ productId }) => {
//   const { user } = useAuth();
//   const [reviews, setReviews] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [pagination, setPagination] = useState({});
//   const [userReview, setUserReview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 10,
//     sort: 'newest',
//     rating: null
//   });

//   useEffect(() => {
//     fetchReviews();
//     if (user) {
//       fetchUserReview();
//     }
//   }, [productId, filters, user]);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const response = await reviewsAPI.getProductReviews(productId, filters);
//       console.log('Product reviews response:', response.data);
//       setReviews(response.data.reviews || []);
//       setStats(response.data.stats);
//       setPagination(response.data.pagination || {});
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       setReviews([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserReview = async () => {
//     try {
//       const response = await reviewsAPI.getUserReview(productId);
//       console.log('User review response:', response.data);
//       setUserReview(response.data.review);
//     } catch (error) {
//       console.error('Error fetching user review:', error);
//       setUserReview(null);
//     }
//   };

//   const handleFilterChange = (newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
//   };

//   const handlePageChange = (newPage) => {
//     setFilters(prev => ({ ...prev, page: newPage }));
//   };

//   const handleReviewSubmit = async (reviewData) => {
//     try {
//       await reviewsAPI.createReview(reviewData);
//       setShowForm(false);
//       fetchReviews();
//       fetchUserReview();
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleReviewUpdate = async (reviewId, reviewData) => {
//     try {
//       await reviewsAPI.updateReview(reviewId, reviewData);
//       setShowForm(false);
//       fetchReviews();
//       fetchUserReview();
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleReviewDelete = async (reviewId) => {
//     try {
//       await reviewsAPI.deleteReview(reviewId);
//       setUserReview(null);
//       fetchReviews();
//     } catch (error) {
//       throw error;
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-8">
//       {/* Review Stats */}
//       {stats && (
//         <ReviewStats 
//           stats={stats}
//           onFilterChange={handleFilterChange}
//           currentFilters={filters}
//         />
//       )}

//       {/* User Review Section */}
//       {user && !userReview && !showForm && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Share Your Experience
//           </h3>
//           <p className="text-gray-600 mb-4">
//             Purchased this product? Help others by sharing your review.
//           </p>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Write a Review
//           </button>
//         </div>
//       )}

//       {/* Review Form */}
//       {showForm && (
//         <ReviewForm
//           productId={productId}
//           existingReview={userReview}
//           onSubmit={userReview ? 
//             (data) => handleReviewUpdate(userReview.id, data) : 
//             handleReviewSubmit
//           }
//           onCancel={() => setShowForm(false)}
//         />
//       )}

//       {/* User's Existing Review */}
//       {userReview && !showForm && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//           <div className="flex justify-between items-start">
//             <div className="flex-1">
//               <h3 className="font-semibold text-blue-900">Your Review</h3>
//               <div className="flex items-center mt-1">
//                 <div className="flex text-yellow-400">
//                   {'★'.repeat(userReview.rating)}{'☆'.repeat(5 - userReview.rating)}
//                 </div>
//                 <span className="ml-2 text-sm text-blue-700">
//                   {userReview.title}
//                 </span>
//               </div>
//               <p className="text-blue-800 mt-2">{userReview.comment}</p>
//               <span className="text-xs text-blue-600 mt-1 block">
//                 Status: {userReview.is_approved ? 'Approved' : 'Pending Approval'}
//               </span>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="text-blue-600 hover:text-blue-800 text-sm"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleReviewDelete(userReview.id)}
//                 className="text-red-600 hover:text-red-800 text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reviews List */}
//       <ReviewList
//         reviews={reviews}
//         loading={loading}
//         pagination={pagination}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default ProductReviews;



import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../../services/api';
import ReviewList from './ReviewList';
import ReviewStats from './ReviewStats';
import ReviewForm from './ReviewForm';
import { useAuth } from '../../context/AuthContext';

const ProductReviews = ({ productId, canReview, checkingReviewEligibility, purchaseDetails }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'newest',
    rating: null
  });

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserReview();
    }
  }, [productId, filters, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getProductReviews(productId, filters);
      console.log('Product reviews response:', response.data);
      setReviews(response.data.reviews || []);
      setStats(response.data.stats);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await reviewsAPI.getUserReview(productId);
      console.log('User review response:', response.data);
      setUserReview(response.data.review);
    } catch (error) {
      console.error('Error fetching user review:', error);
      setUserReview(null);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await reviewsAPI.createReview(reviewData);
      setShowForm(false);
      fetchReviews();
      fetchUserReview();
    } catch (error) {
      throw error;
    }
  };

  const handleReviewUpdate = async (reviewId, reviewData) => {
    try {
      await reviewsAPI.updateReview(reviewId, reviewData);
      setShowForm(false);
      fetchReviews();
      fetchUserReview();
    } catch (error) {
      throw error;
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      setUserReview(null);
      fetchReviews();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Review Stats */}
      {stats && (
        <ReviewStats 
          stats={stats}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
      )}

      {/* User Review Section
      {user && !userReview && !showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {checkingReviewEligibility ? (
              'Checking review eligibility...'
            ) : canReview ? (
              'Share Your Experience'
            ) : (
              'Review This Product'
            )}
          </h3>
          
          {checkingReviewEligibility ? (
            <p className="text-gray-600 mb-4">Checking if you can review this product...</p>
          ) : canReview ? (
            <>
              <p className="text-gray-600 mb-4">
                Purchased this product? Help others by sharing your review.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Write a Review
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                To review this product, you need to have purchased it within the last 30 days.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowForm(true)}
                  disabled
                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                >
                  Write a Review
                </button>
                <button
                  onClick={() => window.location.href = '/products'}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            </>
          )}
        </div>
      )} */}
      {user && !userReview && !showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {checkingReviewEligibility ? (
              'Checking review eligibility...'
            ) : canReview ? (
              'Share Your Experience'
            ) : (
              'Review This Product'
            )}
          </h3>
          
          {checkingReviewEligibility ? (
            <p className="text-gray-600 mb-4">Checking if you can review this product...</p>
          ) : canReview ? (
            <>
              <p className="text-gray-600 mb-4">
                {purchaseDetails ? (
                  <>
                    You purchased this product on {new Date(purchaseDetails.orderDate).toLocaleDateString()}. 
                    Share your experience to help other customers!
                  </>
                ) : (
                  'You are eligible to review this product. Share your experience!'
                )}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Write a Review
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                To review this product, you need to have purchased and received it within the last 30 days.
              </p>
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowForm(true)}
                    disabled
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    Write a Review
                  </button>
                  <button
                    onClick={() => window.location.href = '/products'}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Already purchased this product? Make sure:
                  <br />• Your order was delivered within the last 30 days
                  <br />• You're logged into the correct account
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          existingReview={userReview}
          onSubmit={userReview ? 
            (data) => handleReviewUpdate(userReview.id, data) : 
            handleReviewSubmit
          }
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* User's Existing Review */}
      {userReview && !showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Your Review</h3>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-400">
                  {'★'.repeat(userReview.rating)}{'☆'.repeat(5 - userReview.rating)}
                </div>
                <span className="ml-2 text-sm text-blue-700">
                  {userReview.title}
                </span>
              </div>
              <p className="text-blue-800 mt-2">{userReview.comment}</p>
              <span className="text-xs text-blue-600 mt-1 block">
                Status: {userReview.is_approved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleReviewDelete(userReview.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <ReviewList
        reviews={reviews}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductReviews;