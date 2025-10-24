import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, MessageCircle, Plus, User, Edit2, Check } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { USERS } from './UserSelector';
import { 
  getReviewsForRestaurant, 
  getUserReviewForRestaurant, 
  saveReview,
  updateRestaurant
} from '../firebase/firestore';

const RestaurantDetail = ({ restaurant, onClose, currentUser, onToast }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTags, setEditingTags] = useState(false);
  const [tags, setTags] = useState(restaurant.tags || []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (restaurant?.id && currentUser?.id) {
      loadReviews();
    }
  }, [restaurant?.id, currentUser?.id]);

  const loadReviews = async () => {
    if (!currentUser?.id) {
      console.error('No current user');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading reviews for restaurant:', restaurant.id);
      const allReviews = await getReviewsForRestaurant(restaurant.id);
      console.log('Loaded reviews:', allReviews);
      setReviews(allReviews);
      
      // Check if current user has a review
      const existingUserReview = await getUserReviewForRestaurant(restaurant.id, currentUser.id);
      console.log('User review:', existingUserReview);
      setUserReview(existingUserReview);
    } catch (error) {
      console.error('Error loading reviews:', error);
      console.error('Error details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return null;

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleAddReview = async (reviewData) => {
    try {
      await saveReview(restaurant.id, currentUser.id, reviewData);
      await loadReviews(); // Reload reviews
      setShowReviewForm(false);
      onToast?.('Review saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving review:', error);
      onToast?.('Failed to save review. Please try again.', 'error');
    }
  };

  const handleEditReview = () => {
    setShowReviewForm(true);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSaveTags = async () => {
    try {
      // Send tags as array, or don't include the field if empty
      const updateData = tags.length > 0 
        ? { tags } 
        : { tags: [] }; // Always send tags, even if empty
      
      await updateRestaurant(restaurant.id, updateData);
      setEditingTags(false);
      onToast?.('Tags updated successfully!', 'success');
      
      // Update the local restaurant object to reflect changes immediately
      restaurant.tags = tags;
    } catch (error) {
      console.error('Error saving tags:', error);
      onToast?.('Failed to save tags. Please try again.', 'error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center pointer-events-none">
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
            <div className="flex items-center gap-2 flex-wrap">
              {!editingTags ? (
                <>
                  {tags && tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))
                  ) : null}
                  <button
                    onClick={() => setEditingTags(true)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit Tags
                  </button>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(index)}
                            className="hover:text-red-600 font-bold text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTags}
                      className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Save Tags
                    </button>
                    <button
                      onClick={() => {
                        setEditingTags(false);
                        setTags(restaurant.tags || []);
                        setTagInput('');
                      }}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{avgRating}</span>
              </div>
            )}
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
              Reviews ({reviews.length})
            </h3>
            {userReview ? (
              <button
                onClick={handleEditReview}
                className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit My Review
              </button>
            ) : (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Review
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const reviewUser = USERS.find(u => u.id === review.userId);
                const isCurrentUserReview = review.userId === currentUser.id;
                
                return (
                  <div 
                    key={review.id} 
                    className={`bg-gray-50 rounded-lg p-4 ${isCurrentUserReview ? 'ring-2 ring-primary/20' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {reviewUser && (
                          <div 
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs"
                            style={{ backgroundColor: reviewUser.color }}
                            title={reviewUser.name}
                          >
                            <User size={12} />
                            <span>{reviewUser.name}</span>
                          </div>
                        )}
                        {isCurrentUserReview && (
                          <span className="text-xs text-primary font-medium">(You)</span>
                        )}
                      </div>
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
                    {review.createdAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt.toDate()).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleAddReview}
          restaurantName={restaurant.name}
          currentUser={currentUser}
          existingReview={userReview}
        />
      )}
    </>
  );
};

export default RestaurantDetail;
