import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createMovie } from '../services/api';
import { MovieFormData } from '../types';
import MovieForm from '../components/MovieForm';

const AddMoviePage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: MovieFormData) => {
    setIsSubmitting(true);
    
    try {
      await createMovie(formData);
      toast.success('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
      toast.error('Failed to add movie');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          <Plus className="mr-2 h-6 w-6" />
          Add New Movie
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in the details to add a new movie to the catalog
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <MovieForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default AddMoviePage;