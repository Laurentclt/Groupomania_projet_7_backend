const express = require("express")
const router = express.Router();
const postCtrl = require('../controllers/Post')
const auth = require('../middleware/auth')

router.get('/',auth, postCtrl.getAllPosts)
router.get('/:id',auth, postCtrl.getPost)
router.post('/', auth, postCtrl.addPost)
router.delete('/:id', auth, postCtrl.deletePost)
router.put('/:id', auth, postCtrl.updatePost)
router.post('/:id/like', auth, postCtrl.addLike)
router.post('/:id/comment', auth, postCtrl.addComment)



module.exports = router;