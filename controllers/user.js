const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
    User.findOne().then((user) => {
        res.status(200).json({ message: `profil demandé : ${user}`});
    })   
}

exports.updateUser = (req, res, next) => {
    User.findOneAndUpdate( {_id: req.body.userId},{...req.body}, function (err) {
        if ( req.body.userId !== _id){
            res.status(401).json({error : 'requête non autorisée'})
        }
        else if (err) {
            res.status(500).json({ error })
        }
        else {
            res.status(200).json({message: "profil modifié"})
        }
    })
}

exports.deleteUser = (req, res, next) => {
    User.findOneAndDelete( {id: req.params.id}, function (err, doc) {
        if ( req.body.userId !== _id){
            res.status(401).json({error : 'requête non autorisée'})
        }
        else if (err) {
            res.status(500).json({ error })
        }
        else {
            res.status(200).json({ message : "compte supprimé"})
        }
    })
}