import React, { useState, useEffect, useRef } from 'react';
import { Tag, ChevronDown } from 'lucide-react';
import { Genre } from '../types';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  genres, 
  selectedGenreId, 
  onGenreSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGenreClick = (genreId: number | null) => {
    onGenreSelect(genreId);
    setIsOpen(false);
  };

  const getSelectedGenreName = () => {
    if (selectedGenreId === null) return 'All Genres';
    const genre = genres.find(g => g.id === selectedGenreId);
    return genre ? genre.name : 'All Genres';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-6">
      <h2 className="mb-3 flex items-center text-lg font-semibold text-gray-800 dark:text-white">
        <Tag className="mr-2 h-5 w-5" />
        Genres
      </h2>
      
      {/* Mobile dropdown */}
      <div className="relative md:hidden" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-2 text-left text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <span>{getSelectedGenreName()}</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={() => handleGenreClick(null)}
              className={`w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedGenreId === null ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : ''
              }`}
            >
              All Genres
            </button>
            
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedGenreId === genre.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : ''
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop sidebar list */}
      <div className="hidden divide-y divide-gray-200 rounded-md border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800 md:block">
        <button
          onClick={() => onGenreSelect(null)}
          className={`w-full p-3 text-left transition-colors ${
            selectedGenreId === null
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          All Genres
        </button>
        
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre.id)}
            className={`w-full p-3 text-left transition-colors ${
              selectedGenreId === genre.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;