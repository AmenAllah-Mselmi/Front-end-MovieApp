import React, { useState } from 'react';
import { UserCircle, Trash2, ThumbsUp, Clock, Edit2 } from 'lucide-react';
import { Review, ReviewFormData } from '../types';
import StarRating from './ui/StarRating';
import Button from './ui/Button';
import ReviewForm from './ReviewForm';

interface ReviewsListProps {
  reviews: Review[];
  onDeleteReview?: (reviewId: number) => void;
  onHelpfulVote?: (reviewId: number) => void;
  onEditReview?: (reviewId: number, reviewData: ReviewFormData) => Promise<void>;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  onDeleteReview,
  onHelpfulVote,
  onEditReview
}) => {
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditSubmit = async (reviewId: number, reviewData: ReviewFormData) => {
    if (!onEditReview) return;
    
    setIsSubmitting(true);
    try {
      await onEditReview(reviewId, reviewData);
      setEditingReviewId(null);
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div
          key={review.id}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          {editingReviewId === review.id ? (
            <ReviewForm
              initialData={{
                reviewer_name: review.reviewer_name,
                title: review.title,
                rating: review.rating,
                comment: review.comment,
              }}
              onSubmit={(data) => handleEditSubmit(review.id, data)}
              onCancel={() => setEditingReviewId(null)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center">
                  <UserCircle className="mr-3 h-9 w-9 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {review.reviewer_name}
                      {review.verified_purchase && (
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(review.created_at)}</span>
                      {review.edited_at && (
                        <span className="ml-2 flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Edited
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <StarRating rating={review.rating} />
              </div>

              <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {review.title}
              </h4>
              
              <p className="text-gray-700 dark:text-gray-300">
                {review.comment}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onHelpfulVote?.(review.id)}
                    icon={<ThumbsUp className="h-4 w-4" />}
                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    Helpful ({review.helpful_votes})
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingReviewId(review.id)}
                    icon={<Edit2 className="h-4 w-4 text-blue-500" />}
                    className="text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Edit
                  </Button>
                  
                  {onDeleteReview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteReview(review.id)}
                      icon={<Trash2 className="h-4 w-4 text-red-500" />}
                      className="text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;