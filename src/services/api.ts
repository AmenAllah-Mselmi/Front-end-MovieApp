import axios from 'axios';
import { Movie, Genre, Review, MovieFormData, ReviewFormData } from '../types';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const getMovies = async (genreId?: number): Promise<Movie[]> => {
  const params = genreId ? { genres: genreId } : {};
  const response = await api.get('/movies/', { params });
  return response.data;
};

export const getMovie = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movies/${id}/`);
  return response.data;
};

export const createMovie = async (movieData: MovieFormData): Promise<Movie> => {
  const formData = new FormData();
  formData.append('title', movieData.title);
  formData.append('release_date', movieData.release_date);
  formData.append('description', movieData.description);
  
  if (movieData.image) {
    formData.append('image', movieData.image);
  }
  
  movieData.genres.forEach(genreId => {
    formData.append('genres', genreId.toString());
  });

  const response = await api.post('/movies/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const updateMovie = async (id: number, movieData: MovieFormData): Promise<Movie> => {
  const formData = new FormData();
  formData.append('title', movieData.title);
  formData.append('release_date', movieData.release_date);
  formData.append('description', movieData.description);
  
  if (movieData.image) {
    formData.append('image', movieData.image);
  }
  
  movieData.genres.forEach(genreId => {
    formData.append('genres', genreId.toString());
  });

  const response = await api.put(`/movies/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const deleteMovie = async (id: number): Promise<void> => {
  await api.delete(`/movies/${id}/`);
};

// Genres API
export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/genres/');
  return response.data;
};

export const createGenre = async (name: string): Promise<Genre> => {
  const response = await api.post('/genres/', { name });
  return response.data;
};

// Reviews API
export const getReviews = async (movieId?: number): Promise<Review[]> => {
  const params = movieId ? { movie: movieId } : {};
  const response = await api.get('/reviews/', { params });
  return response.data;
};

export const addReview = async (movieId: number, reviewData: ReviewFormData): Promise<Review> => {
  const response = await api.post(`/movies/${movieId}/add_review/`, reviewData);
  return response.data;
};

export const updateReview = async (reviewId: number, reviewData: ReviewFormData): Promise<Review> => {
  const response = await api.put(`/reviews/${reviewId}/`, reviewData);
  return response.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/reviews/${id}/`);
};