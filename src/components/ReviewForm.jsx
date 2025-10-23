import React, { useState, useEffect, useRef } from 'react';
import { X, Star } from 'lucide-react';

const ReviewForm = ({ isOpen, onClose, onSubmit, restaurantName, currentUser, existingReview }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Prefill form if editing existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setText(existingReview.text || '');
    } else {
      setRating(0);
      setText('');
    }
  }, [existingReview, isOpen]);

  // Handle textarea focus to ensure it's visible when keyboard appears
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        textareaRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const review = {
      rating,
      text: text.trim()
    };

    onSubmit(review);
    
    // Reset form
    setRating(0);
    setText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black bg-opacity-60 p-4 pb-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-transform duration-300 animate-scaleIn max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {existingReview ? 'Edit Review' : 'Write a Review'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{restaurantName}</p>
            <p className="text-xs text-gray-500 mt-1">
              Posting as <span className="font-semibold" style={{ color: currentUser.color }}>{currentUser.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating *
            </label>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              ref={textareaRef}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={(e) => {
                // Scroll textarea into view when keyboard appears
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base resize-none"
              placeholder="Share your experience..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={rating === 0}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
