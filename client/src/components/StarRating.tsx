import React from 'react';
import { FaStar } from 'react-icons/fa';

interface StarProps {
  rating: number;
  max?: number;
  onRatingChange?: (newRating: number) => void;
}

const StarRating: React.FC<StarProps> = ({ rating, max = 5, onRatingChange }) => {
  return (
    <div className="star-container">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${starValue <= rating ? 'filled' : 'empty'}`}
            onClick={() => onRatingChange?.(starValue)}
            style={{ cursor: onRatingChange ? 'pointer' : 'default' }}
          >
            <FaStar/>
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;