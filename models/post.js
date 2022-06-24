const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  date: {type: String, required: true },
  imageUrl: { type: String},
  likes: { type: Number},
  usersLiked : { type: Array},
});

module.exports = mongoose.model('Post', postSchema);