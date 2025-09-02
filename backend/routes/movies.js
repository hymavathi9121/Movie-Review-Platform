const express = require("express");
const router = express.Router();
const {
  getMovies,
  getMovieById,
  addMovie,
  addReview,
  getReviews
} = require("../controllers/movieController");

// public
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.get("/:id/reviews", getReviews);

// no auth required
router.post("/:id/reviews", addReview);
router.post("/", addMovie); 

module.exports = router;
