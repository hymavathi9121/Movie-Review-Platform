import React, { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import "./AddMovie.css";

export default function AddMovie() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    releaseYear: "",
    director: "",
    cast: "",
    synopsis: "",
    posterUrl: "",
    trailerUrl: ""
  });
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Please log in as admin to add movies.</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert genre and cast to arrays
      const payload = {
        ...formData,
        genre: formData.genre.split(",").map(g => g.trim()),
        cast: formData.cast.split(",").map(c => c.trim())
      };

      const res = await API.post("/movies", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert(`Movie "${res.data.title}" added successfully!`);
      setFormData({
        title: "",
        genre: "",
        releaseYear: "",
        director: "",
        cast: "",
        synopsis: "",
        posterUrl: "",
        trailerUrl: ""
      });
    } catch (err) {
      console.error(err);
      alert("Error adding movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="add-movie-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Add New Movie</h1>
      <form className="add-movie-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input name="genre" placeholder="Genre (comma separated)" value={formData.genre} onChange={handleChange} required />
        <input name="releaseYear" placeholder="Release Year" value={formData.releaseYear} onChange={handleChange} type="number" required />
        <input name="director" placeholder="Director" value={formData.director} onChange={handleChange} />
        <input name="cast" placeholder="Cast (comma separated)" value={formData.cast} onChange={handleChange} />
        <textarea name="synopsis" placeholder="Synopsis" value={formData.synopsis} onChange={handleChange} />
        <input name="posterUrl" placeholder="Poster URL" value={formData.posterUrl} onChange={handleChange} />
        <input name="trailerUrl" placeholder="Trailer URL" value={formData.trailerUrl} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Movie"}</button>
      </form>
    </motion.div>
  );
}
