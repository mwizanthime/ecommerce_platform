
//src/components/reviews/ReviewForm
import React, { useState } from 'react';
import StarRating from '../Common/StarRating';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, existingReview, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);


// In your ReviewForm component, update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (rating === 0) {
    toast.error('Please select a rating');
    return;
  }


  if (!comment.trim()) {
    toast.error('Please write a review');
    return;
  }

  setSubmitting(true);
  try {
    const reviewData = { 
      productId, 
      rating, 
      comment: comment.trim() 
    };
    
    console.log('Submitting review data:', reviewData);
    
    await onSubmit(reviewData);
    toast.success(existingReview ? 'Review updated successfully' : 'Review submitted successfully');
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to submit review';
    
    toast.error(errorMessage);
    
    // Log additional details for debugging
    if (error.response?.data) {
      console.error('Server error details:', error.response.data);
    }
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <div className="flex items-center space-x-2">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              editable={true}
              size="lg"
            />
            <span className="text-sm text-gray-600">
              {rating > 0 ? `${rating} out of 5` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details of your experience with this product..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={1000}
            required
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;