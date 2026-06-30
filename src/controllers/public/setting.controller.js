const asyncHandler  = require('express-async-handler');
const ShopSetting = require('../../models/ShopSetting');

// @desc  Lấy cài đặt shop theo key
// @route GET /api/settings/:key
const getSetting = asyncHandler(async (req, res) => {
  const setting = await ShopSetting.findOne({ key: req.params.key });
  if (!setting) return res.status(404).json({ success: false, message: 'Không tìm thấy cài đặt' });
  res.json({ success: true, data: setting });
});

// @desc  Lấy nhiều cài đặt cùng lúc
// @route GET /api/settings?keys=shop_info,shop_contacts
const getSettings = asyncHandler(async (req, res) => {
  const keys = req.query.keys ? req.query.keys.split(',') : [];
  const filter = keys.length ? { key: { $in: keys } } : {};
  const settings = await ShopSetting.find(filter);
  // Trả về dạng object { key: value }
  const result = {};
  settings.forEach((s) => { result[s.key] = s.value; });
  res.json({ success: true, data: result });
});

module.exports = { getSetting, getSettings };
