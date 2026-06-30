const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    sku:               { type: String, required: true },
    title:             { type: String, required: true },
    price:             { type: Number, required: true, min: 0 },
    compareAtPrice:    { type: Number, default: 0 },
    inventoryQuantity: { type: Number, default: 0 },
    inventoryPolicy:   { type: String, enum: ['deny', 'continue'], default: 'deny' },
    lowStockThreshold: { type: Number, default: 2 },
    stockStatus:       { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
    isAvailable:       { type: Boolean, default: true },
    dimensions: {
      length: { type: Number, default: null },
      width:  { type: Number, default: null },
      height: { type: Number, default: null },
      depth:  { type: Number, default: null },
    },
    sizeLabel: { type: String, default: '' },
    weightKg:  { type: Number, default: 0 },
    options: {
      size:  { type: String, default: '' },
      color: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    categoryInfo: {
      name:      String,
      slug:      String,
      parentName: String,
      woodName:  String,
      woodCode:  String,
      woodColorHex: String,
    },
    name:             { type: String, required: true },
    slug:             { type: String, required: true, unique: true },
    shortDescription: { type: String, default: '' },
    description:      { type: String, default: '' },
    status:           { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    isCustomOrder:    { type: Boolean, default: true },
    isFeatured:       { type: Boolean, default: false },
    images: [
      {
        url:      { type: String, required: true },
        publicId: { type: String, required: true },
        alt:      { type: String, default: '' },
        isPrimary:{ type: Boolean, default: false },
      },
    ],
    variants:   [variantSchema],
    tags:       [{ type: String }],
    metaTitle:       { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    sortOrder:  { type: Number, default: 0 },
    publishedAt:{ type: Date, default: null },
    stats: {
      viewCount:    { type: Number, default: 0 },
      soldCount:    { type: Number, default: 0 },
      reviewCount:  { type: Number, default: 0 },
      averageRating:{ type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ isFeatured: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);
