const Post  = require('../models/Post');


exports.getAllPosts = (req, res, next) => {
    Post.find().then((posts) => {
        console.log(posts)
        res.status(200).json(posts);
    })
    .catch((error) => {
        res.status(400).json({error})
    })
}

exports.getPost = (req, res, next) => {
    Post.findOne().then((post) => {
        console.log(post)
        res.status(200).json(post);
    })
}

exports.addPost = (req, res, next) => {
    let datePost = new Date();

    let dateLocale = datePost.toLocaleString('fr-FR',{
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'});
    const post = new Post({
        ...req.body,
        date: dateLocale,
        chrono: Date.now(),
        imageUrl: req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : '',
    });
    post.save()
        .then(() => res.status(201).json({ message: 'publication ajoutée !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.deletePost = (req, res, next) => {
    Post.findOneAndDelete( {_id: req.params.id}, function (err, doc) {
        if (err) {
            res.status(500).json({ error })
        }
        else {
            console.log(doc)
            res.status(200).json({ message: 'publication supprimée'})
        }
    })
}
exports.updatePost =  (req, res, next) => {
    Post.findOneAndUpdate({_id: req.params.id}, {...req.body}, function(err, doc) {
        // test secu
        if (err) {
            res.status(500).json ({ error })
        }
        else {
            console.log(doc)
            res.status(200).json({ message : 'publication modifiée'})
        }
    })
    res.status(200)
};

exports.addLike = (req, res, next) => {
    usersLiked.push(req.body.userId)
    console.log('like ajouté')
    res.status(200)
}

exports.addComment = (req, res, next) => {
    console.log('commentaire ajouté')
    res.status(200)
}