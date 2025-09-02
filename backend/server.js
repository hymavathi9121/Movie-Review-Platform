require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");

const app = express();

// ✅ Allowed origins (frontend deployed + localhost)
const allowedOrigins = [
  "http://localhost:3000", // dev
  process.env.FRONTEND_URL    // frontend Render URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allow cookies / JWT
}));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
