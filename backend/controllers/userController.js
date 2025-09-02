const User = require("../models/User");
const Review = require("../models/Review");

// @desc Get current logged-in user (with watchlist & reviews)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("watchlist.movie")
      .lean(); // use lean for faster queries

    if (!user) return res.status(404).json({ message: "User not found" });

    // fetch user's reviews
    const reviews = await Review.find({ user: req.userId })
      .populate("movie", "title posterUrl")
      .lean();

    delete user.passwordHash;

    res.json({ ...user, reviews });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update user info
exports.updateUser = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.json(userObj);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("watchlist.movie").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.watchlist);
  } catch (err) {
    console.error("Get watchlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add movie to watchlist
exports.addToWatchlist = async (req, res) => {
  const { movieId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.watchlist.some(item => item.movie.toString() === movieId);
    if (!exists) {
      user.watchlist.push({ movie: movieId });
      await user.save();
    }

    res.json(await user.populate("watchlist.movie"));
  } catch (err) {
    console.error("Add to watchlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Remove movie from watchlist
exports.removeFromWatchlist = async (req, res) => {
  const { movieId } = req.params; // use params now

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchlist = user.watchlist.filter(item => item.movie.toString() !== movieId);
    await user.save();

    res.json(await user.populate("watchlist.movie"));
  } catch (err) {
    console.error("Remove from watchlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
