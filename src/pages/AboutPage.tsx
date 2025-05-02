import React from 'react';
import { Users, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
          About MovieApp
        </h1>
        
        <div className="mb-12">
          <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
            Welcome to MovieApp, your premier destination for discovering, reviewing, and sharing your favorite films. Our platform is designed to bring movie enthusiasts together and create a vibrant community of film lovers.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Founded in 2025, we've grown from a small movie database to a comprehensive platform that helps millions of users find their next favorite film.
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <Users className="mx-auto mb-4 h-12 w-12 text-blue-500" />
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Our Community
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Join thousands of movie enthusiasts who share their thoughts, reviews, and recommendations every day.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <Heart className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Our Mission
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              To create the most comprehensive and user-friendly movie platform that connects film lovers worldwide.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-8 dark:bg-blue-900/20">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Join Us Today
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Become part of our growing community and start sharing your movie experiences with fellow enthusiasts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;