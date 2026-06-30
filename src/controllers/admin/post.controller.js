const asyncHandler = require('express-async-handler');
const Post    = require('../../models/Post');
const slugify = require('slugify');

// @desc  Lấy tất cả bài viết
// @route GET /api/admin/posts
const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { status } : {};
  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ success: true, data: posts, pagination: { total, page: Number(page) } });
});

// @desc  Tạo bài viết
// @route POST /api/admin/posts
const createPost = asyncHandler(async (req, res) => {
  const { title, ...rest } = req.body;
  if (!title) { res.status(400); throw new Error('Tiêu đề là bắt buộc'); }

  const slug = slugify(title, { lower: true, locale: 'vi', strict: true });
  const post = await Post.create({
    title, slug,
    adminId: req.admin._id,
    adminName: req.admin.fullName,
    ...rest,
  });
  res.status(201).json({ success: true, data: post });
});

// @desc  Cập nhật bài viết
// @route PUT /api/admin/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error('Không tìm thấy bài viết'); }
  if (req.body.status === 'published' && !post.publishedAt) {
    req.body.publishedAt = new Date();
  }
  Object.assign(post, req.body);
  await post.save();
  res.json({ success: true, data: post });
});

// @desc  Xóa bài viết
// @route DELETE /api/admin/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) { res.status(404); throw new Error('Không tìm thấy bài viết'); }
  res.json({ success: true, message: 'Đã xóa bài viết' });
});

module.exports = { getPosts, createPost, updatePost, deletePost };
