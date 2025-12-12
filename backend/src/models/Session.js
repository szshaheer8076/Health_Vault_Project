const mongoose = require('mongoose');

// Simple session storage - NO JWT!
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000  // Auto-delete after 30 days
  }
});

module.exports = mongoose.model('Session', sessionSchema);