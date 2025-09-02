import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import MovieCard from "../components/MovieCard";
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/movies");
        const movies = res.data.movies || [];
        setFeatured(movies.slice(0, 5)); // top 5 featured
        setTrending(movies.slice(5, 15)); // next 10 trending
      } catch (err) {
        console.error("Error loading movies", err);
      }
    })();
  }, []);

  return (
    <div className="home-container">
      {/* Featured Section */}
      <section className="featured-section">
        {featured.map((m) => (
          <motion.div
            key={m._id}
            className="featured-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={m.posterUrl} alt={m.title} className="featured-img" />
            <div className="featured-caption">
              <h2>{m.title} ({m.releaseYear})</h2>
              <p>{m.description?.length > 200 ? m.description.slice(0,200)+'...' : m.description}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <h2>Trending Now</h2>
        <div className="trending-carousel">
          {trending.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
