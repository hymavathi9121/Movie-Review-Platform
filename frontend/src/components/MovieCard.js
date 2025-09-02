import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaPlusCircle } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import API from '../api/api';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle movie click
  const handleClick = () => {
    if (!user?._id) {
      navigate("/login");
    } else {
      navigate(`/movies/${movie._id}`);
    }
  };

  const addToWatchlist = async (e) => {
    e.stopPropagation(); // prevent triggering handleClick
    if (!user?._id) return alert("Login required");
    try {
      await API.post(`/users/watchlist`, { movieId: movie._id });
      alert('Added to watchlist!');
    } catch (err) {
      console.error(err);
      alert('Error adding to watchlist');
    }
  };

  return (
    <motion.div
      className="movie-card"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />

      <motion.div
        className="overlay"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="overlay-content">
          <h3>{movie.title}</h3>
          <p>{movie.releaseYear} • {movie.genre.join(', ')}</p>
          <p><FaStar color="#ffc107" /> {movie.avgRating?.toFixed(1) || 'N/A'}</p>
          {user && (
            <button onClick={addToWatchlist} className="watchlist-btn">
              <FaPlusCircle /> Watchlist
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
