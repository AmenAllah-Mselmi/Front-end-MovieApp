import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  onRatingChange,
  interactive = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleMouseEnter = (hoveredRating: number) => {
    if (interactive) {
      setHoverRating(hoveredRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  // Calculate star fill percentages
  const getStarFill = (starPosition: number) => {
    const displayRating = hoverRating > 0 ? hoverRating : rating;
    
    if (starPosition <= Math.floor(displayRating)) {
      return 100; // Full star
    } else if (starPosition > Math.ceil(displayRating)) {
      return 0; // Empty star
    } else {
      // Partial star - calculate percentage
      return Math.round((displayRating - Math.floor(displayRating)) * 100);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const starPosition = index + 1;
        const fillPercentage = getStarFill(starPosition);
        
        return (
          <span
            key={index}
            className={`relative ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => handleClick(starPosition)}
            onMouseEnter={() => handleMouseEnter(starPosition)}
            onMouseLeave={handleMouseLeave}
            aria-label={`${starPosition} star${starPosition > 1 ? 's' : ''}`}
          >
            {/* Empty star */}
            <Star 
              size={size} 
              className="text-gray-300 dark:text-gray-600" 
              fill="none" 
            />
            
            {/* Filled star (overlaid with clip-path for partial filling) */}
            <Star
              size={size}
              className="absolute top-0 left-0 text-yellow-400"
              fill="currentColor"
              style={{
                clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;