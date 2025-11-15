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

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pending') {
        const response = await reviewsAPI.getAdminPendingReviews();
        setPendingReviews(response.data.reviews || []);
      } else {
        // For all reviews, we might need a different endpoint
        // For now, we'll use the same endpoint but you should create a proper one
        const response = await reviewsAPI.getAdminPendingReviews();
        setAllReviews(response.data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (reviewId, action) => {
    try {
      setModerating(prev => ({ ...prev, [reviewId]: true }));
      
      await reviewsAPI.moderateAdminReview(reviewId, { action });
      
      toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Remove from pending reviews
      setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
      setAllReviews(prev => prev.filter(review => review.id !== reviewId));
      
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
      
      // Remove from lists
      setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
      setAllReviews(prev => prev.filter(review => review.id !== reviewId));
      
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
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

  if (loading) {
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

        {/* Tabs */}
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
              {activeTab === 'pending' ? 'No Pending Reviews' : 'No Reviews'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'pending' 
                ? 'All reviews have been moderated.' 
                : 'No reviews found in the system.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviewsToDisplay.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.product_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        review.is_approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>by {review.username}</span>
                      <span>•</span>
                      <span>{formatDate(review.created_at)}</span>
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                    )}
                    
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;