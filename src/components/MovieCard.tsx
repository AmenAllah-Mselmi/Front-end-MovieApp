import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Movie } from '../types';
import StarRating from './ui/StarRating';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formattedDate = new Date(movie.release_date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link 
      to={`/movies/${movie.id}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
    >
      <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-300 dark:bg-gray-700">
            <Clock className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Rating badge */}
        {movie.average_rating > 0 && (
          <div className="absolute right-3 top-3 flex items-center rounded-full bg-black/70 px-2 py-1 text-sm font-bold text-white backdrop-blur-sm">
            {movie.average_rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
            {movie.title}
          </h3>
          
          <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          {movie.genres.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {movie.genres.map(genre => (
                <span 
                  key={genre.id}
                  className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {movie.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <StarRating rating={movie.average_rating} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {movie.reviews.length} review{movie.reviews.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;