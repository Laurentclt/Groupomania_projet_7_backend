const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const fs = require ("fs")

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
              email: req.body.email,
              password: hash,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              isAdmin: false
            });
            user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
              .catch(error => res.status(400).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({email : req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error : "utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error : "mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            "RANDOM_TOKEN_SECRET",
                            {expiresIn: "24h"}
                        ),
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error}))
}


exports.getOneUser = (req, res, next) => {
    User.findOne({_id: req.params.id})
    .then(user => {
        res.status(200).json(user);
    })
    .catch((e) => new Error (`utilisateur non trouvé : ${e}`))   
}

// vérifié, problème lorsque changement d'image de profil, seulement l'image dans le header change. les images dans les posts nécéssitent un refresh pour s'actualiser
exports.updateUser = (req, res, next) => {
    User.findOne({ _id: req.auth.userId })
    .then(user => {
        if (req.file) {
            if (user.imageProfil !== undefined) {
            const filename = user.imageProfil.split('/images/')[1];
            fs.unlink(`images/${filename}`, (error) => {
                  if (error) {
                  console.log("pas d'image")
                  }
              })
            }
        }   
   
    User.findOneAndUpdate( {_id: req.auth.userId},
        {...req.body,
        imageProfil: req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : user.imageProfil 
        },
        {new: true}, function (err, doc) {
            if (err) {
                res.status(500).json({ error })
            }
            else {
              
                res.status(200).json(doc)
            }
    })
    })
}
exports.deleteUser = (req, res, next) => {
    if (req.body.userId !== req.auth.userId) {
        res.status(401).json({
          error: new Error("requête non autorisée!").message,
        });
    }
    User.findOneAndDelete( {_id: req.body.userId}, function (err, doc) {
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
            res.status(200).json({ message : `compte supprimé : ${doc} `})
        }
    })
}