const express = require("express")
const router = express.Router();
const postCtrl = require('../controllers/Post')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')

router.get('/',auth, postCtrl.getAllPosts)
router.get('/:id',auth, postCtrl.getPost)
router.post('/', auth, multer, postCtrl.addPost)
router.delete('/:id', auth, postCtrl.deletePost)
router.put('/:id', auth, multer, postCtrl.updatePost)
router.post('/:id/like', auth, postCtrl.addLike)
router.post('/:id/comments', auth, postCtrl.addComment)
router.delete('/:postId/comments/:id', auth, postCtrl.deleteComment)
router.put('/:postId/comments/:id', auth, postCtrl.updateComment )



module.exports = router;