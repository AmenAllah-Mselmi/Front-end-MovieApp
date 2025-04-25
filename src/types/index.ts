export interface Movie {
  id: number;
  title: string;
  release_date: string;
  description: string;
  image: string;
  genres: Genre[];
  reviews: Review[];
  average_rating: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  movie: number;
  reviewer_name: string;
  title: string;
  rating: number;
  comment: string;
  helpful_votes: number;
  verified_purchase: boolean;
  created_at: string;
  edited_at: string | null;
}

export interface MovieFormData {
  title: string;
  release_date: string;
  description: string;
  image: File | null;
  genres: number[];
}

export interface ReviewFormData {
  reviewer_name: string;
  title: string;
  rating: number;
  comment: string;
}