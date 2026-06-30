const mongoose = require('mongoose');

const standardSizeSchema = new mongoose.Schema(
  {
    label:     { type: String, required: true },
    length:    { type: Number, default: null },
    width:     { type: Number, default: null },
    height:    { type: Number, default: null },
    depth:     { type: Number, default: null },
    note:      { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const categorySizeSchema = new mongoose.Schema(
  {
    categoryCode: { type: String, required: true, unique: true },
    categoryName: { type: String, required: true },
    dimensionLabels: {
      d1: { type: String, default: '' },
      d2: { type: String, default: '' },
      d3: { type: String, default: '' },
      d4: { type: String, default: '' },
    },
    standardSizes: [standardSizeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CategorySize', categorySizeSchema);
