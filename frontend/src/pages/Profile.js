import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import API from "../api/api";
import { Link } from "react-router-dom";
import { FaList, FaStar } from "react-icons/fa";
import './Profile.css';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get("/users"); // backend uses req.userId from JWT
        setProfile(res.data);
      } catch (err) {
        console.error("Profile load error:", err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return <div className="center-text">Please log in</div>;
  if (!profile) return <div className="center-text">Loading...</div>;

  const watchlist = profile.watchlist || [];
  const reviews = profile.reviews || [];

  return (
    <div className="profile-container">
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>
      <p>Joined: {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : "N/A"}</p>

      {/* Watchlist */}
      <section className="profile-section">
        <h2><FaList /> My Watchlist</h2>
        {watchlist.length === 0 ? (
          <p>No movies in watchlist.</p>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map(item => {
              const movie = item?.movie;
              if (!movie?._id) return null;

              const handleRemove = async (e) => {
                e.preventDefault(); // prevent <Link> navigation
                try {
                  await API.delete(`/watchlist/${movie._id}`);
                  setProfile(prev => ({
                    ...prev,
                    watchlist: prev.watchlist.filter(m => m?.movie?._id !== movie._id) // safe check
                  }));
                } catch (err) {
                  console.error("Remove error:", err.response?.data || err.message);
                }
              };

              return (
                <div key={movie._id} className="watchlist-card">
                  <Link to={`/movies/${movie._id}`} className="watchlist-item">
                    <img
                      src={movie.posterUrl || "/default-poster.jpg"}
                      alt={movie.title || "Movie"}
                    />
                    <span>{movie.title || "Unknown"}</span>
                  </Link>
                  <button className="remove-btn" onClick={handleRemove}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="profile-section">
        <h2><FaStar /> My Reviews</h2>
        {reviews.length === 0 ? (
          <p>You haven't submitted any reviews yet.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map(r => {
              const movie = r?.movie;
              if (!movie?._id) return null;
              return (
                <div key={r._id} className="review-item">
                  <Link to={`/movies/${movie._id}`} className="review-movie-title">
                    {movie.title || "Unknown"} ({movie.releaseYear || "N/A"})
                  </Link>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color={i < r.rating ? "gold" : "#555"} />
                    ))}
                  </div>
                  <p>{r.text || "No review text"}</p>
                  <small>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</small>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
