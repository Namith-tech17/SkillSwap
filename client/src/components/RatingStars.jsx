import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * RatingStars Component
 * Demonstrates: Props (Sl. 5), useState (Sl. 6), Event Handling (Sl. 8)
 */
const RatingStars = ({ value = 5, onChange = null, readonly = false, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {stars.map((star) => {
        const activeValue = hoverRating || value;
        const isFilled = star <= activeValue;

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => {
              if (!readonly && onChange) {
                onChange(star);
              }
            }}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: readonly ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              outline: 'none'
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#eab308' : 'none'}
              color={isFilled ? '#ca8a04' : '#cbd5e1'}
              strokeWidth={1.8}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
