const mongoose = require('mongoose');

const woodMaterialSchema = new mongoose.Schema(
  {
    code:        { type: String, required: true, unique: true, uppercase: true },
    name:        { type: String, required: true },
    description: { type: String, default: '' },
    colorHex:    { type: String, default: '#8B6914' },
    priceTier:   { type: String, enum: ['standard', 'premium', 'luxury'], default: 'premium' },
    imageUrl:    { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WoodMaterial', woodMaterialSchema);
