const asyncHandler = require('express-async-handler');
const Product  = require('../../models/Product');
const slugify  = require('slugify');

// @desc  Lấy tất cả SP (kể cả draft)
// @route GET /api/admin/products
const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, data: products, pagination: { total, page: Number(page) } });
});

// @desc  Tạo sản phẩm mới
// @route POST /api/admin/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, ...rest } = req.body;
  if (!name) { res.status(400); throw new Error('Tên sản phẩm là bắt buộc'); }

  const slug = slugify(name, { lower: true, locale: 'vi', strict: true });
  const exists = await Product.findOne({ slug });
  if (exists) { res.status(400); throw new Error('Slug đã tồn tại'); }

  const product = await Product.create({ name, slug, ...rest });
  res.status(201).json({ success: true, data: product });
});

// @desc  Cập nhật sản phẩm
// @route PUT /api/admin/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Không tìm thấy sản phẩm'); }

  // Nếu publish lần đầu → set publishedAt
  if (req.body.status === 'published' && !product.publishedAt) {
    req.body.publishedAt = new Date();
  }

  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, data: product });
});

// @desc  Xóa sản phẩm
// @route DELETE /api/admin/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Không tìm thấy sản phẩm'); }
  res.json({ success: true, message: 'Đã xóa sản phẩm' });
});

// @desc  Lấy chi tiết SP (admin)
// @route GET /api/admin/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Không tìm thấy sản phẩm'); }
  res.json({ success: true, data: product });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, getProductById };
