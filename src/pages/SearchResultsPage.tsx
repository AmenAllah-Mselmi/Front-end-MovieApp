import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Loader, Film, ArrowLeft } from 'lucide-react';
import { getMovies } from '../services/api';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import Button from '../components/ui/Button';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const moviesData = await getMovies();
        setMovies(moviesData);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredMovies([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const results = movies.filter(movie => {
      const movieTitle = movie.title.toLowerCase();
      const movieDescription = movie.description.toLowerCase();
      const genreNames = movie.genres.map(g => g.name.toLowerCase());
      
      return searchTerms.some(term => 
        movieTitle.includes(term) || 
        movieDescription.includes(term) ||
        genreNames.some(name => name.includes(term))
      );
    });
    
    setFilteredMovies(results);
  }, [movies, query]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">Searching...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </button>
      </div>
      
      <div className="mb-8">
        <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          <Search className="mr-2 h-5 w-5" />
          Search Results: "{query}"
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
        </p>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <Film className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No matches found</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            We couldn't find any movies matching your search. Try different keywords.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Browse All Movies
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;