const mongoose = require('mongoose');
const post = require ('./Post.js')
const user = require ('./User.js')

const commentSchema = mongoose.Schema({
    postId : {type : mongoose.Schema.Types.ObjectId, required : true , ref : post},
    userId : { type : mongoose.Schema.Types.ObjectId, required : true, ref : user},
    content : { type : String, required : true},
    date : { type : String, required : true},
    chrono : {type : Number, required: true},
})


module.exports = mongoose.model('Comment', commentSchema);