import React, { useState } from 'react';
import { X, Star, MapPin, MessageCircle, Plus } from 'lucide-react';
import { getAverageRating } from '../data';
import ReviewForm from './ReviewForm';

const RestaurantDetail = ({ restaurant, onClose, onAddReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!restaurant) return null;

  const avgRating = getAverageRating(restaurant.reviews);

  const handleAddReview = (review) => {
    onAddReview(restaurant.id, review);
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out animate-slideUp pointer-events-auto max-h-[85vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pb-4 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{restaurant.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {restaurant.cuisine}
              </span>
              {restaurant.reviews.length > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-gray-500 text-sm">({restaurant.reviews.length})</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Reviews Section - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Reviews ({restaurant.reviews.length})
            </h3>
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Review
            </button>
          </div>

          {restaurant.reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{review.author}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                  <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleAddReview}
          restaurantName={restaurant.name}
        />
      )}
    </div>
  );
};

export default RestaurantDetail;
