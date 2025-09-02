import axios from "axios";

// Detect environment (local dev vs production)
const baseURL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://movie-review-platform-j7dq.onrender.com");

const API = axios.create({
  baseURL,
});

export default API;
