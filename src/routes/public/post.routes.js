const router = require('express').Router();
const { getPosts, getPostBySlug } = require('../../controllers/public/post.controller');

router.get('/',      getPosts);
router.get('/:slug', getPostBySlug);

module.exports = router;
