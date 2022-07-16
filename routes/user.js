const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/user')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')


router.post("/auth/signup", userCtrl.signup)
router.post("/auth/login", userCtrl.login)
router.put("/:id" ,auth, multer, userCtrl.updateUser)
router.delete("/:id" ,auth, userCtrl.deleteUser)

module.exports = router;
