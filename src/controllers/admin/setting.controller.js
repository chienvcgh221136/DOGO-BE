const asyncHandler  = require('express-async-handler');
const ShopSetting = require('../../models/ShopSetting');

// @desc  Cập nhật cài đặt theo key
// @route PUT /api/admin/settings/:key
const updateSetting = asyncHandler(async (req, res) => {
  const setting = await ShopSetting.findOneAndUpdate(
    { key: req.params.key },
    { value: req.body.value, label: req.body.label },
    { new: true, upsert: true }
  );
  res.json({ success: true, data: setting });
});

module.exports = { updateSetting };
