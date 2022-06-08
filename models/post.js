const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String},
  likes: { type: Number},
  dislikes : { type: Number},
  usersLiked : { type: Array},
  usersDisliked : { type: Array},
  comments: { type : String}
});

module.exports = mongoose.model('Post', postSchema);