// frontend/src/components/Reviews/ReviewStats.jsx
import React from 'react';

const ReviewStats = ({ stats, onFilterChange, currentFilters }) => {
  const { rating, total_reviews, rating_distribution } = stats;

  const handleRatingFilter = (rating) => {
    onFilterChange({ 
      rating: currentFilters.rating === rating ? null : rating 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{rating}</div>
          <div className="flex justify-center text-yellow-400 text-lg mt-1">
            {'★'.repeat(Math.round(parseFloat(rating)))}
            {'☆'.repeat(5 - Math.round(parseFloat(rating)))}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {total_reviews} {total_reviews === 1 ? 'Review' : 'Reviews'}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-gray-900 mb-3">Rating Breakdown</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const stat = rating_distribution.find(s => s.rating === rating);
              const percentage = stat ? stat.percentage : 0;
              const count = stat ? stat.count : 0;
              
              return (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`flex items-center w-full text-left p-1 rounded ${
                    currentFilters.rating === rating ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-12 text-sm text-gray-600">{rating} ★</span>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-12 text-sm text-gray-600 text-right">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;