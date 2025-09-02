import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://movie-review-platform-j7dq.onrender.com/api",
  withCredentials: true, // needed for JWT in headers
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
