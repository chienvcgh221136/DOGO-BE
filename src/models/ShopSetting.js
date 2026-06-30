const mongoose = require('mongoose');

const shopSettingSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true },
    label: { type: String, default: '' },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopSetting', shopSettingSchema);
