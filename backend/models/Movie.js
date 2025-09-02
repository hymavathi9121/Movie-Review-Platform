const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  releaseYear: Number,
  director: String,
  cast: [String],
  synopsis: String,
  posterUrl: String,
  trailerUrl: String,   // ✅ Add this line
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
