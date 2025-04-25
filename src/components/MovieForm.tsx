import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, AlignLeft, ImageIcon } from 'lucide-react';
import Button from './ui/Button';
import { MovieFormData, Genre } from '../types';
import { getGenres } from '../services/api';

interface MovieFormProps {
  initialData?: Partial<MovieFormData>;
  onSubmit: (formData: MovieFormData) => Promise<void>;
  isSubmitting: boolean;
}

const MovieForm: React.FC<MovieFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState<MovieFormData>({
    title: initialData?.title || '',
    release_date: initialData?.release_date || '',
    description: initialData?.description || '',
    image: null,
    genres: initialData?.genres || [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MovieFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await getGenres();
        setGenres(genresList);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };

    loadGenres();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof MovieFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => 
      parseInt(option.value, 10)
    );
    
    setFormData(prev => ({ ...prev, genres: selectedOptions }));
    
    // Clear error
    if (errors.genres) {
      setErrors(prev => ({ ...prev, genres: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MovieFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.release_date) {
      newErrors.release_date = 'Release date is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!initialData?.image && !formData.image) {
      newErrors.image = 'Image is required';
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'Select at least one genre';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      navigate('/');
    } catch (error) {
      console.error('Error submitting movie:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="title" 
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <Film className="mr-1 inline-block h-4 w-4" /> Movie Title
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
          placeholder="Enter movie title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="release_date" 
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <Calendar className="mr-1 inline-block h-4 w-4" /> Release Date
        </label>
        <input
          type="date"
          id="release_date"
          name="release_date"
          value={formData.release_date}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
            errors.release_date
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
          }`}
        />
        {errors.release_date && (
          <p className="mt-1 text-sm text-red-500">{errors.release_date}</p>
        )}
      </div>
      
      <div>
        <label 
          htmlFor="image" 
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <ImageIcon className="mr-1 inline-block h-4 w-4" /> Movie Poster
        </label>
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                errors.image ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
          </div>
          
          {imagePreview && (
            <div className="h-24 w-24 overflow-hidden rounded-md border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-full w-full object-cover" 
              />
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label 
          htmlFor="genres" 
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Genres
        </label>
        <select
          id="genres"
          name="genres"
          multiple
          value={formData.genres.map(id => id.toString())}
          onChange={handleGenreChange}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
            errors.genres
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
          }`}
          size={5}
        >
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Hold Ctrl (or Cmd) to select multiple genres
        </p>
        {errors.genres && (
          <p className="mt-1 text-sm text-red-500">{errors.genres}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="description" 
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <AlignLeft className="mr-1 inline-block h-4 w-4" /> Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
            errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
          }`}
          placeholder="Enter movie description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {initialData?.title ? 'Update Movie' : 'Add Movie'}
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;