const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profilePic: { type: String },
  joinDate: { type: Date, default: Date.now },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  watchlist: [
    {
      movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
