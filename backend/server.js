require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");

const app = express();

// ✅ Allowed origins: localhost (dev) + Netlify + Vercel frontend
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://lambent-nougat-09a69e.netlify.app",
  "https://movie-review-platform-eight.vercel.app/" // Replace with your Vercel URL
];



app.use(express.json());

// Connect MongoDB
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
