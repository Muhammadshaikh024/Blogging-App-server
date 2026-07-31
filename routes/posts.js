const express = require('express');
const router = express.Router();
const {create,getMyPosts,update,remove} = require('../controllers/posts');

router.route('/').post(create);
router.route('/my-posts').get(getMyPosts);
router.route('/:id').put(update);
router.route('/:id').delete(remove)



module.exports = router;