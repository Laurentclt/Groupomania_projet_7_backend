const User = require('../models/User')

exports.signup = (req, res, next) => {
    console.log('utilisateur inscrit')
    res.status(200)
}

exports.login = (req, res, next) => {
    console.log('utilisateur connecté')
    res.status(200)
}