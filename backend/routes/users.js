const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  getUser,
  updateUser,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/userController");

// Protected routes (JWT required)
router.use(authMiddleware);

router.get("/", getUser); // GET current user
router.put("/", updateUser);


// Watchlist routes
router.get("/watchlist", getWatchlist);
router.post("/watchlist", addToWatchlist);
//router.delete("/watchlist", removeFromWatchlist);
router.delete("/watchlist/:movieId", removeFromWatchlist);


module.exports = router;
