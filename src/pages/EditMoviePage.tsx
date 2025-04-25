import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMovie, updateMovie } from '../services/api';
import { Movie, MovieFormData } from '../types';
import MovieForm from '../components/MovieForm';
import Button from '../components/ui/Button';

const EditMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) return;
        const movieData = await getMovie(parseInt(id, 10));
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

  const handleSubmit = async (formData: MovieFormData) => {
    if (!movie || !id) return;
    
    setIsSubmitting(true);
    
    try {
      await updateMovie(movie.id, formData);
      toast.success('Movie updated successfully!');
    } catch (error) {
      console.error('Error updating movie:', error);
      toast.error('Failed to update movie');
      throw error;
    } finally {
      setIsSubmitting(false);
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
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Movie not found</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The movie you're trying to edit doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // Prepare initial form data
  const initialData: Partial<MovieFormData> = {
    title: movie.title,
    release_date: movie.release_date,
    description: movie.description,
    genres: movie.genres.map(g => g.id),
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          <Edit className="mr-2 h-6 w-6" />
          Edit Movie: {movie.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update the details of this movie
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <MovieForm 
          initialData={initialData}
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditMoviePage;