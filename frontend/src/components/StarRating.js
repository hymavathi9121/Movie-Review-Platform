import React from 'react';

export default function StarRating({ value, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ fontSize: 22, cursor: 'pointer' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{ color: star <= value ? 'gold' : 'lightgray' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
