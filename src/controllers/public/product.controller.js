const asyncHandler = require('express-async-handler');
const Product      = require('../../models/Product');

// @desc  Lấy danh sách sản phẩm (public)
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const {
    categoryId, categoryCode, woodCode,
    featured, page = 1, limit = 12, sort = 'sortOrder',
  } = req.query;

  const filter = { status: 'published' };

  if (categoryId) filter.categoryId = categoryId;
  if (categoryCode) filter['categoryInfo.slug'] = { $regex: categoryCode, $options: 'i' };
  if (woodCode) filter['categoryInfo.woodCode'] = woodCode.toUpperCase();
  if (featured === 'true') filter.isFeatured = true;

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .select('-description -metaTitle -metaDescription')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page:  Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc  Lấy chi tiết sản phẩm theo slug
// @route GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { 'stats.viewCount': 1 } },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  res.json({ success: true, data: product });
});

// @desc  Lấy sản phẩm nổi bật
// @route GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'published', isFeatured: true })
    .select('name slug shortDescription images variants categoryInfo isFeatured')
    .sort('sortOrder')
    .limit(8);

  res.json({ success: true, data: products });
});

module.exports = { getProducts, getProductBySlug, getFeaturedProducts };
