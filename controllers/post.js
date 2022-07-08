const Post  = require('../models/Post');
const User = require('../models/User')
const Comment = require ('../models/Comment')
const fs = require("fs");


const newDate = () => {
    let datePost = new Date();

    let localDate = datePost.toLocaleString('fr-FR',{
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'});
    return localDate
}

exports.getAllPosts =  (req, res, next) => {
    Comment.aggregate([
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'userId', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$out': 'commentUsers'
        }
      ]).exec((err, result)=>{
        if (err) {
            console.log("error" ,err)
        }
        if (result) {
            Post.aggregate([
                {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'userId', 
                    'foreignField': '_id', 
                    'as': 'user'
                  }
                }, {
                  '$lookup': {
                    'from': 'commentUsers', 
                    'localField': '_id', 
                    'foreignField': 'postId', 
                    'as': 'comments'
                  }
                },
            ]).exec((err, result)=>{
                if (err) {
                    console.log("error" ,err)
                }
                if (result) {
                console.log({result})
        
                Post.find().sort({"chrono": -1}).then(() => {
                    res.status(200).json(result);
                })
                .catch((error) => {
                    res.status(400).json({error})
                })
                }
            });
        }
        })
}

exports.getPost = (req, res, next) => {
    Post.findOne().then((post) => {
        res.status(200).json(post);
    })
}

exports.addPost = (req, res, next) => {
    if (req.body.userId === req.auth.userId) {    
        const post = new Post({
            ...req.body,
            date: newDate(),
            chrono: Date.now(),
            imageUrl: req.file
            ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            : '',
        });
        post.save()
            .then(() => res.status(201).json({ message: 'publication ajoutée !'}))
            .catch(error => res.status(400).json({ error }));
    }
}

exports.deletePost = (req, res, next) => {
    if (req.body.userId === req.auth.userId) {
        Post.findOneAndDelete( {_id: req.params.id}, function (err, doc) {
            if (err) {
                res.status(500).json({ error })
            }
            else {
                const filename = doc.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) {
                    res.status(500).json({message: error})
                    }
                })
                res.status(200).json({doc})
            }
    
        })
    }else {
        res.status(401).json('Unauhtorized request')
    }
}
exports.updatePost =  (req, res, next) => {
    if (req.body.userId === req.auth.userId) {
        // enlever l'image si req.file
        Post.findOneAndUpdate({_id: req.params.id},
            {
            ...req.body,
            date: newDate(),
            chrono: Date.now(),
            imageUrl: req.file
            ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            : '', 
            }, {new: true}, function(err, doc) {
            if (err) {
                res.status(500).json ({ error })
            }
            else {
               
                // const filename = imageUrl.split('/images/')[1];
                // fs.unlink(`images/${filename}`, (error) => {
                //     if (error) {
                //     res.status(500).json({message: error})
                //     }
                // })
                res.status(200).json({doc})
            }
        })
    }else {
        res.status(401).json('Unauthorized request')
    }
};

exports.addLike = (req, res, next) => {
    Post.findOne({_id: req.body.postId}).then((post) => {
        if  (post.usersLiked.indexOf(req.body.userId) < 0) {
                post.usersLiked.push(req.body.userId)
                post.save()
                    .then( res.status(201).json({value: 1}))
                    .catch((error) => res.status(400).json({error}))
        }
        else  {
            const user = req.body.userId
            const index = post.usersLiked.indexOf(user)
            if (index > -1) {
                post.usersLiked.splice(index, 1)
            }
            post.save()
            .then( res.status(201).json({value: 0}))
            .catch((error) => res.status(400).json({error}))
        }
    })
    .then(res.status(200)) 
    .catch((error) => res.status(400).json(error))    
}

exports.addComment = (req, res, next) => {
    console.log(req.params.id)
    let comment = new Comment({
        ...req.body,
        postId: req.params.id,
        date: newDate(),
        chrono: Date.now()
    });
    comment.save(comment)
    .then( res.status(201).json(comment))
    .catch(error => res.status(400).json({error}))

}

// exports.getComments = (req, res, next) => { 
//     Comment.aggregate([
//         {
//           '$lookup': {
//             'from': 'users', 
//             'localField': 'userId', 
//             'foreignField': '_id', 
//             'as': 'user'
//           }
//         }
//       ]).exec((err, result)=>{
//         if (err) {
//             console.log("error" ,err)
//         }
//         if (result) {
//         console.log({result})

//         Comment.find().sort({"chrono": -1}).then(() => {
//             res.status(200).json(result);
//         })
//         .catch((error) => {
//             res.status(400).json({error})
//         })
//         }
//     });
// }
    
    
exports.deleteComment = (req, res, next) => {
    console.log(req.auth.userId)
    if (req.body.userId === req.auth.userId) {
        Comment.findOneAndDelete( {_id: req.params.id }, function (err, doc) {
            if (err) {
                res.status(500).json({ error })
            }
            else {
                res.status(200).json({doc})
            }
    
        })
    }else {
        res.status(401).json('Unauthorized request')
    }
}
exports.updateComment = (req, res, next) => {
    console.log(req.body.userId, req.auth.userId)
    if (req.body.userId === req.auth.userId) {
        Comment.findOneAndUpdate({_id: req.params.id},
            {
            ...req.body,
            date: newDate(),
            chrono: Date.now(),
            }, {new: true}, function(err, doc) {
            if (err) {
                res.status(500).json ({ error })
            }
            else {
                res.status(200).json({doc})
            }
        })
    }else {
        res.status(401).json('Unauthorized request')
    }
};