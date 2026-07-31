const express = require('express');
const router = express.Router();
const {
    listUsers,
    getUserPosts,
    listAllPosts
} = require('../controllers/admin');


router.route('/users').get(listUsers)
router.route('/users/:userId/posts').get(getUserPosts);
router.route('/posts').get(listAllPosts);


module.exports = router;