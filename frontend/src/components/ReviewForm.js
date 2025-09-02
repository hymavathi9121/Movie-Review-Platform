import React, { useState } from 'react';
import API from '../api/api';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import './ReviewForm.css';

export default function ReviewForm({ movieId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId"); // read from storage

      if (!userId) {
        alert("You must be logged in to review!");
        return;
      }

      await API.post(`/movies/${movieId}/reviews`, { rating, text, userId });

      alert('Review submitted!');
      setRating(0);
      setText('');
    } catch (err) {
      alert('Error submitting review');
      console.error(err);
    }
  };

  return (
    <motion.form
      className="review-form"
      onSubmit={handleSubmit}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Write a Review</h3>

      <div className="stars">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <label key={starValue}>
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => setRating(starValue)}
              />
              <FaStar
                className="star"
                size={24}
                color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>

      <textarea
        className="review-textarea"
        placeholder="Write your thoughts..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />

      <button type="submit" className="submit-review-btn">Submit Review</button>
    </motion.form>
  );
}
