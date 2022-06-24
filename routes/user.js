const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/user')



router.post("/auth/signup", userCtrl.signup)

router.post("/auth/login", userCtrl.login)
router.put("/:id", userCtrl.updateUser)
router.get("/:id", userCtrl.getOneUser)
router.delete("/:id", userCtrl.deleteUser)

module.exports = router;
