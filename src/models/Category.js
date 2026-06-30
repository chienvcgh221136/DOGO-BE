const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    parentId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    woodMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: 'WoodMaterial', default: null },
    woodMaterialInfo: {
      code:     String,
      name:     String,
      colorHex: String,
    },
    code:        { type: String, required: true, unique: true, uppercase: true },
    name:        { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    imageUrl:    { type: String, default: '' },
    level:       { type: Number, enum: [1, 2], default: 1 },
    sortOrder:   { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index để truy vấn nhanh
categorySchema.index({ level: 1, isActive: 1 });
categorySchema.index({ parentId: 1 });

module.exports = mongoose.model('Category', categorySchema);
