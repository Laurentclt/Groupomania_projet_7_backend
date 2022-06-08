const express = require("express")
const router = express.Router();
const postCtrl = require('../controllers/Post')

router.get('/', postCtrl.getAllPosts)
router.get('/:id',postCtrl.getPost)
router.post('/', postCtrl.addPost)
router.delete('/:id', postCtrl.deletePost)
router.post('/:id/like', postCtrl.addLike)
router.post('/:id/comment',postCtrl.addComment)



module.exports = router;