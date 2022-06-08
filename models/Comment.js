const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userId : { type : String},
    likes : { type : Number},
    dislikes : { type : Number},
    usersLiked : { type : Array},
    usersDisliked : { type : Array},
    comments : { type : String},
})




module.exports = mongoose.model('Comment', commentSchema);