import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaStar } from 'react-icons/fa';
import ReviewForm from '../components/ReviewForm';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const addToWatchlist = async () => {
    if (!user?._id) return alert("Login required");
    try {
      await API.post(`/users/watchlist`, { userId: user._id, movieId: id });
      alert('Added to watchlist!');
    } catch (err) {
      console.error(err);
      alert('Error adding to watchlist');
    }
  };
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return youtubeMatch ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : url;
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <motion.div className="movie-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="movie-detail-header">
        <img src={movie.posterUrl} alt={movie.title} className="movie-detail-poster" />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <p><strong>Year:</strong> {movie.releaseYear}</p>
          <p><strong>Director:</strong> {movie.director}</p>

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          )}

          {/* Watchlist button */}
          {user && (
            <button className="watchlist-btn" onClick={addToWatchlist}>
              <FaPlusCircle /> Add to Watchlist
            </button>
          )}
        </div>
      </div>

      {/* Trailer Section */}
      {movie.trailerUrl && (
        <div className="trailer-section">
          <h2>Trailer</h2>
          <iframe
            width="100%"
            height="500"
            src={getEmbedUrl(movie.trailerUrl)}   /* use helper here */
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Reviews */}
      <div className="reviews-section">
        <h2><FaStar /> Reviews</h2>
        {movie.reviews?.length === 0 && <p>No reviews yet.</p>}
        {movie.reviews?.map(r => (
          <div key={r._id} className="review-item">
            <div className="review-header">
              <strong>{r.user?.username || "Unknown User"}</strong> – {r.rating} ⭐
            </div>
            <p>{r.text}</p>
            <small>{new Date(r.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      {/* Review Form */}
      {user && <ReviewForm movieId={id} />}
    </motion.div>
  );
}
