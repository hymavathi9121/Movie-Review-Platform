import React, { useEffect, useState } from "react";
import API from "../api/api";
import MovieCard from "../components/MovieCard";
import './Movies.css';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies");
        setMovies(res.data.movies || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  // Filtering
  const filteredMovies = movies.filter(movie => {
    return (
      movie.title.toLowerCase().includes(search.toLowerCase()) &&
      (genreFilter ? movie.genre.includes(genreFilter) : true) &&
      (yearFilter ? movie.releaseYear.toString() === yearFilter : true)
    );
  });

  // Extract unique genres and years for filters
  const genres = Array.from(new Set(movies.flatMap(m => m.genre)));
  const years = Array.from(new Set(movies.map(m => m.releaseYear)));

  return (
    <div className="movies-container">
      <h1>All Movies</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {filteredMovies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
