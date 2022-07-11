const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const fs = require("fs");

const newDate = () => {
  let datePost = new Date();

  let localDate = datePost.toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return localDate;
};

// vérification effectuée
exports.getAllPosts = (req, res, next) => {
  Comment.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $out: "commentUsers",
    },
  ]).exec((err, result) => {
    if (err) {
      console.log("error", err);
    }
    if (result) {
      Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "commentUsers",
            localField: "_id",
            foreignField: "postId",
            as: "comments",
          },
        },
      ]).exec((err, result) => {
        if (err) {
          console.log("error", err);
        }
        if (result) {
          console.log({ result });

          Post.find()
            .sort({ chrono: -1 })
            .then(() => {
              res.status(200).json(result);
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        }
      });
    }
  });
};

// vérification effectuée !
exports.addPost = (req, res, next) => {
  const post = new Post({
    ...req.body,
    userId: req.auth.userId,
    date: newDate(),
    chrono: Date.now(),
    imageUrl: req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : "",
  });
  post
    .save()
    .then((post) => {
      User.find({ _id: req.auth.userId }).then((user) => {
        console.log({ user });
        const copyPost = JSON.parse(JSON.stringify(post));
        copyPost.user = user;
        console.log(copyPost);
        res.status(201).json(copyPost);
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

// vérification effectuée !
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((data) => {
    let userPost = data.userId.toLocaleString().split('"');
    console.log(userPost[0]);
    User.findOne({ _id: req.auth.userId }).then((data) => {
      console.log(data.isAdmin);
      let admin = data.isAdmin;

      if (userPost[0] === req.auth.userId || admin) {
        Post.findOneAndDelete({ _id: req.params.id }, function (err, doc) {
          if (err) {
            res.status(500).json({ error });
          } else {
            const filename = doc.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, (error) => {
              if (error) {
                console.log("pas d'image");
              }
            });
            console.log(doc);
            res.status(200).json(doc);
          }
        });
      } else {
        res.status(401).json("Unauhtorized request");
      }
    });
  });
  Comment.deleteMany({ postId: req.params.id }).exec();
};

// vérification effectuée !
exports.updatePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    let userPost = post.userId.toLocaleString().split('"');
    console.log(userPost[0]);
    User.findOne({ _id: req.auth.userId }).then((user) => {
      let admin = user.isAdmin;
      if (userPost[0] === req.auth.userId || admin) {
        if (req.file) {
          const filename = post.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (error) => {
            if (error) {
              console.log("pas d'image");
            }
          });
        }
        Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            ...req.body,
            date: newDate(),
            chrono: Date.now(),
            imageUrl: req.file
              ? `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`
              : post.imageUrl,
          },
          { new: true },
          function (err, doc) {
            if (err) {
              res.status(200).json({ error });
            } else {
              res.status(200).json(doc);
            }
          }
        );
      } else {
        res.status(401).json("Unauthorized request");
      }
    });
  });
};
// vérification effectuée
exports.addLike = (req, res, next) => {
  Post.findOne({ _id: req.body.postId })
    .then((post) => {
      if (post.usersLiked.indexOf(req.auth.userId) < 0) {
        post.usersLiked.push(req.auth.userId);
        post
          .save()
          .then(res.status(201).json({ value: 1 }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        const user = req.auth.userId;
        const index = post.usersLiked.indexOf(user);
        if (index > -1) {
          post.usersLiked.splice(index, 1);
        }
        post
          .save()
          .then(res.status(201).json({ value: 0 }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .then(res.status(200))
    .catch((error) => res.status(400).json(error));
};

// vérification effectuée
exports.addComment = (req, res, next) => {
  console.log(req.params.id);
  let comment = new Comment({
    ...req.body,
    userId: req.auth.userId,
    postId: req.params.id,
    date: newDate(),
    chrono: Date.now(),
  });
  comment
    .save()
    .then((comment) => {
      User.find({ _id: req.auth.userId }).then((user) => {
        console.log({ user });
        const copyComment = JSON.parse(JSON.stringify(comment));
        copyComment.user = user;
        console.log(copyComment);
        res.status(201).json(copyComment);
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

// vérification effectuée
exports.deleteComment = (req, res, next) => {
  Comment.findOne({ _id: req.params.id }).then((data) => {
    let userComment = data.userId.toLocaleString().split('"');
    console.log(userComment[0]);
    User.findOne({ _id: req.auth.userId }).then((user) => {
      let admin = user.isAdmin;
      if (userComment[0] === req.auth.userId || admin) {
        Comment.findOneAndDelete({ _id: req.params.id }, function (err, doc) {
          if (err) {
            res.status(500).json({ error });
          } else {
            console.log("succes");
            res.status(200).json(doc);
          }
        });
      } else {
        res.status(401).json("Unauthorized request");
      }
    });
  });
};
// minuscule problème lors de l'update la chronologie n'est pas respecté => voir front pour regler le soucis
exports.updateComment = (req, res, next) => {
  Comment.findOne({ _id: req.params.id }).then((data) => {
    let userComment = data.userId.toLocaleString().split('"');
    console.log(userComment[0]);
    User.findOne({ _id: req.auth.userId }).then((user) => {
      let admin = user.isAdmin;
      if (userComment[0] === req.auth.userId || admin) {
      Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
          date: newDate(),
          chrono: Date.now(),
        },
        { new: true },
        function (err, doc) {
          if (err) {
            res.status(500).json({ error });
          } else {
            res.status(200).json( doc );
          }
        }
      );
    } else {
      res.status(401).json("Unauthorized request");
    }
  });
})
};
