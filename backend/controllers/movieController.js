// controllers/movieController.js
const Movie = require("../models/Movie");
const Review = require("../models/Review");
const axios = require("axios");

// @desc Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ movies, total: movies.length });
  } catch (err) {
    console.error("Get movies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get movie by ID with reviews
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const reviews = await Review.find({ movie: req.params.id }).populate("user", "username");
    res.json({ ...movie.toObject(), reviews });
  } catch (err) {
    console.error("Get movie by id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add a new movie (Admin)
exports.addMovie = async (req, res) => {
  try {
    let { title, description, synopsis, releaseYear, genre, trailerUrl } = req.body;

    // use synopsis if description not given
    const finalDescription = description || synopsis || "";

    // Fix trailer URL if it's YouTube watch link
    if (trailerUrl && trailerUrl.includes("watch?v=")) {
      trailerUrl = trailerUrl.replace("watch?v=", "embed/");
    }

    // TMDb poster fetch
    let posterUrl = "/default-poster.jpg";
    try {
      const tmdbRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: title,
          year: releaseYear
        }
      });

      if (tmdbRes.data.results.length > 0) {
        const posterPath = tmdbRes.data.results[0].poster_path;
        posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : posterUrl;
      }
    } catch (err) {
      console.warn("TMDb fetch failed, using default poster.", err.message);
    }

    const movie = new Movie({
      title,
      synopsis: finalDescription, // store in schema
      releaseYear,
      genre,
      trailerUrl,
      posterUrl,
      avgRating: 0,
      reviewCount: 0
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error("Add movie error:", err.response?.data || err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add a review
exports.addReview = async (req, res) => {
  try {
    const { text, rating, userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const review = new Review({ user: userId, movie: req.params.id, text, rating });
    await review.save();

    const movie = await Movie.findById(req.params.id);
    if (movie) {
      movie.reviewCount += 1;
      movie.avgRating =
        (movie.avgRating * (movie.reviewCount - 1) + rating) / movie.reviewCount;
      await movie.save();
    }

    res.status(201).json(review);
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get reviews for a movie
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.id }).populate("user", "username");
    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
