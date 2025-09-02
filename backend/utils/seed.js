require('dotenv').config();
const connectDB = require('../config/db');
const Movie = require('../models/Movie');

const movies = [
  {
    title: "The Example Movie",
    genre: ["Drama","Thriller"],
    releaseYear: 2020,
    director: "A Director",
    cast: ["Actor One","Actor Two"],
    synopsis: "An example synopsis.",
    posterUrl: "https://via.placeholder.com/200x300"
  },
  {
    title: "Another Picture",
    genre: ["Comedy"],
    releaseYear: 2021,
    director: "Another Director",
    cast: ["Star A","Star B"],
    synopsis: "Light hearted comedy.",
    posterUrl: "https://via.placeholder.com/200x300"
  }
];

const run = async () => {
  await connectDB(process.env.MONGO_URI);
  await Movie.deleteMany({});
  await Movie.insertMany(movies);
  console.log('Seeded movies');
  process.exit(0);
};

run();
