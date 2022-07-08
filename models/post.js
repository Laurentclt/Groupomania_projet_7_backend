const mongoose = require('mongoose');
const user = require ('./User')

const postSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref : user},
  content: { type: String, required: true },
  date: {type: String, required: true },
  chrono: {type: Number, required: true},
  imageUrl: { type: String},
  likes: { type: Number},
  usersLiked : { type: Array},
});


module.exports = mongoose.model('Post', postSchema);