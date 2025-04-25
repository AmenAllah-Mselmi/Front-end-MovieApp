import React, { useState, useEffect } from 'react';
import { getMovies, getGenres } from '../services/api';
import { Movie, Genre } from '../types';
import MovieCard from '../components/MovieCard';
import GenreFilter from '../components/GenreFilter';
import { Film, Loader } from 'lucide-react';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres. Please try again later.');
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const moviesData = await getMovies(selectedGenreId || undefined);
        setMovies(moviesData);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenreId]);

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenreId(genreId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 flex items-center text-3xl font-bold text-gray-900 dark:text-white">
          <Film className="mr-3 h-8 w-8" />
          Movie App
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and explore your favorite movies
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Sidebar with filters */}
        <div className="md:col-span-1">
          <GenreFilter
            genres={genres}
            selectedGenreId={selectedGenreId}
            onGenreSelect={handleGenreSelect}
          />
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">Loading movies...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          ) : movies.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <Film className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No movies found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedGenreId 
                  ? "There are no movies in this genre yet."
                  : "There are no movies in the catalog yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;