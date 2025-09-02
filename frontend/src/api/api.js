import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://movie-review-platform-j7dq.onrender.com",
});

export default API;
