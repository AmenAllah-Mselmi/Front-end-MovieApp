import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import StarRating from './ui/StarRating';
import Button from './ui/Button';
import { ReviewFormData } from '../types';

interface ReviewFormProps {
  initialData?: ReviewFormData;
  onSubmit: (reviewData: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  initialData,
  onSubmit, 
  onCancel,
  isSubmitting 
}) => {
  const [formData, setFormData] = useState<ReviewFormData>(
    initialData || {
      reviewer_name: '',
      title: '',
      rating: 0,
      comment: '',
    }
  );
  
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof ReviewFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    
    // Clear rating error
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};
    
    if (!formData.reviewer_name.trim()) {
      newErrors.reviewer_name = 'Name is required';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please add a comment';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      if (!initialData) {
        // Only reset form if it's a new review
        setFormData({
          reviewer_name: '',
          title: '',
          rating: 0,
          comment: '',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
          <MessageSquare className="mr-2 h-5 w-5" />
          {initialData ? 'Edit Review' : 'Write a Review'}
        </h3>
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            icon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="reviewer_name"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Your Name
          </label>
          <input
            type="text"
            id="reviewer_name"
            name="reviewer_name"
            value={formData.reviewer_name}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
              errors.reviewer_name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
            }`}
            placeholder="Enter your name"
          />
          {errors.reviewer_name && (
            <p className="mt-1 text-sm text-red-500">{errors.reviewer_name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Review Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
              errors.title
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
            }`}
            placeholder="Summarize your review in a title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rating
          </label>
          <div>
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              interactive={true}
              size={24}
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
              errors.comment
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
            }`}
            placeholder="Share your thoughts about the movie..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            {initialData ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;