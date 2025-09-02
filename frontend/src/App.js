import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddMovie from './pages/AddMovie';
import './App.css';
import { FaHome, FaFilm, FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function App() {
  const { user, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  // Apply dark mode
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div>
      <motion.nav
        className="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="nav-logo">🎥 MovieReview</div>

        {/* Hamburger for mobile */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}><FaHome /> Home</Link>
          <Link to="/movies" onClick={() => setMenuOpen(false)}><FaFilm /> Movies</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}><FaUserCircle /> Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}><FaSignInAlt /> Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}><FaUserPlus /> Register</Link>
            </>
          )}
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </motion.nav>

      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-movie" element={<AddMovie />} />
        </Routes>
      </main>
    </div>
  );
}
