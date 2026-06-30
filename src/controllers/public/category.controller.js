const asyncHandler  = require('express-async-handler');
const Category      = require('../../models/Category');
const CategorySize  = require('../../models/CategorySize');
const WoodMaterial  = require('../../models/WoodMaterial');

// @desc  Lấy cây danh mục (level 1 + children)
// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const parents = await Category.find({ level: 1, isActive: true }).sort('sortOrder');
  const children = await Category.find({ level: 2, isActive: true }).sort('sortOrder');

  const tree = parents.map((p) => ({
    ...p.toObject(),
    children: children.filter(
      (c) => c.parentId && c.parentId.toString() === p._id.toString()
    ),
  }));

  res.json({ success: true, data: tree });
});

// @desc  Lấy kích thước chuẩn theo categoryCode
// @route GET /api/categories/:code/sizes
const getCategorySizes = asyncHandler(async (req, res) => {
  const sizes = await CategorySize.findOne({ categoryCode: req.params.code.toUpperCase() });
  if (!sizes) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy kích thước' });
  }
  res.json({ success: true, data: sizes });
});

// @desc  Lấy danh sách loại gỗ
// @route GET /api/wood-materials
const getWoodMaterials = asyncHandler(async (req, res) => {
  const materials = await WoodMaterial.find({ isActive: true }).sort('sortOrder');
  res.json({ success: true, data: materials });
});

module.exports = { getCategories, getCategorySizes, getWoodMaterials };
