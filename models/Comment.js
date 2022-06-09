const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    postId : {type : String, required : true},
    userId : { type : String, required : true},
    content : { type : String, required : true},
})




module.exports = mongoose.model('Comment', commentSchema);