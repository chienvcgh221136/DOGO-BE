const asyncHandler  = require('express-async-handler');
const Post = require('../../models/Post');

// @desc  Danh sách bài viết
// @route GET /api/posts
const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 9, tag } = req.query;
  const filter = { status: 'published' };
  if (tag) filter.tags = tag;

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .select('title slug excerpt thumbnailUrl publishedAt tags categoryTag')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    data: posts,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc  Chi tiết bài viết theo slug
// @route GET /api/posts/:slug
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { viewCount: 1 } },
    { new: true }
  );
  if (!post) { res.status(404); throw new Error('Không tìm thấy bài viết'); }
  res.json({ success: true, data: post });
});

module.exports = { getPosts, getPostBySlug };
