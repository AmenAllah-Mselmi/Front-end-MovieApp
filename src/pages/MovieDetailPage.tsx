import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Film, 
  Edit, 
  Trash2, 
  Loader, 
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getMovie, deleteMovie, addReview, deleteReview, updateReview } from '../services/api';
import { Movie, ReviewFormData } from '../types';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) return;
        const movieData = await getMovie(parseInt(id, 10));
        console.log(movieData);
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleDeleteMovie = async () => {
    if (!movie) return;
    
    setDeleting(true);
    
    try {
      await deleteMovie(movie.id);
      toast.success('Movie deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleSubmitReview = async (reviewData: ReviewFormData) => {
    if (!movie) return;
    
    setSubmittingReview(true);
    
    try {
      const newReview = await addReview(movie.id, reviewData);
      
      // Update movie with new review
      setMovie(prevMovie => {
        if (!prevMovie) return null;
        
        // Calculate new average rating
        const totalRatings = prevMovie.reviews.reduce((sum, r) => sum + r.rating, 0) + reviewData.rating;
        const newAverageRating = totalRatings / (prevMovie.reviews.length + 1);
        
        return {
          ...prevMovie,
          reviews: [...prevMovie.reviews, newReview],
          average_rating: newAverageRating,
        };
      });
      
      toast.success('Review added successfully!');
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = async (reviewId: number, reviewData: ReviewFormData) => {
    if (!movie) return;
    
    try {
      const updatedReview = await updateReview(reviewId, reviewData);
      
      // Update movie with edited review
      setMovie(prevMovie => {
        if (!prevMovie) return null;
        
        const updatedReviews = prevMovie.reviews.map(r => 
          r.id === reviewId ? updatedReview : r
        );
        
        // Recalculate average rating
        const totalRatings = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverageRating = totalRatings / updatedReviews.length;
        
        return {
          ...prevMovie,
          reviews: updatedReviews,
          average_rating: newAverageRating,
        };
      });
      
      toast.success('Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!movie) return;
    
    try {
      await deleteReview(reviewId);
      
      // Update movie by removing review
      setMovie(prevMovie => {
        if (!prevMovie) return null;
        
        const updatedReviews = prevMovie.reviews.filter(r => r.id !== reviewId);
        
        // Recalculate average rating
        const totalRatings = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverageRating = updatedReviews.length 
          ? totalRatings / updatedReviews.length 
          : 0;
        
        return {
          ...prevMovie,
          reviews: updatedReviews,
          average_rating: newAverageRating,
        };
      });
      
      toast.success('Review deleted');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <Film className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Movie not found</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(movie.release_date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Movies
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Movie poster */}
        <div className="md:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-lg bg-gray-200 shadow-md dark:bg-gray-700">
            {movie.image ? (
              <img
                src={movie.image}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-96 items-center justify-center bg-gray-300 dark:bg-gray-600">
                <Film className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Movie details */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {movie.title}
              </h1>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => navigate(`/movies/${movie.id}/edit`)}
                >
                  Edit
                </Button>
                
                <div className="relative">
                  {confirmDelete ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={deleting}
                        onClick={handleDeleteMovie}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDelete(false)}
                        disabled={deleting}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      icon={<Trash2 className="h-4 w-4 text-red-500" />}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Release date */}
            <div className="mt-2 flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="mr-2 h-5 w-5" />
              Released: {formattedDate}
            </div>
            
            {/* Rating */}
            {movie.average_rating > 0 && (
              <div className="mt-3 flex items-center">
                <StarRating rating={movie.average_rating} size={24} />
                <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                  {movie.average_rating.toFixed(1)} 
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    ({movie.reviews.length} review{movie.reviews.length !== 1 ? 's' : ''})
                  </span>
                </span>
              </div>
            )}
            
            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="mt-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {movie.description}
              </p>
            </div>
            
            {/* Reviews section */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  <MessageSquare className="mr-2 inline-block h-6 w-6" />
                  Reviews
                </h2>
                
                <Button
                  variant={showReviewForm ? 'outline' : 'primary'}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  icon={showReviewForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                >
                  {showReviewForm ? 'Hide Form' : 'Write a Review'}
                </Button>
              </div>
              
              {/* Review form */}
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm 
                    onSubmit={handleSubmitReview} 
                    isSubmitting={submittingReview} 
                  />
                </div>
              )}
              
              {/* Reviews list */}
              <ReviewsList 
                reviews={movie.reviews} 
                onDeleteReview={handleDeleteReview}
                onEditReview={handleEditReview}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;