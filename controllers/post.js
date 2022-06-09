const Post  = require('../models/Post.js');




exports.getAllPosts = (req, res, next) => {
    console.log("requête reçue")
    Post.find().then((posts) => {
        console.log(posts)
        res.status(200).json(posts);
    })
    .catch((error) => {
        res.status(400).json({error})
    })
}

exports.getPost = (req, res, next) => {
    console.log('affiche post')
    Post.findOne().then((post) => {
        console.log(post)
        res.status(200).json(post);
    })
}

exports.addPost = (req, res, next) => {
    const newPost = req.body

    res.status(200)
}

exports.deletePost = (req, res, next) => {
    console.log("post supprimé")
    res.status(200)
}
exports.updatePost =  (req, res, next) => {
    console.log("post modifié")
    res.status(200)
};

exports.addLike = (req, res, next) => {
    console.log('like ajouté')
    res.status(200)
}

exports.addComment = (req, res, next) => {
    console.log('commentaire ajouté')
    res.status(200)
}