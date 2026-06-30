const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String, required: true },
    quantity:   { type: Number, required: true, min: 1, default: 1 },
    // Snapshot giá tại thời điểm thêm vào giỏ
    snapshot: {
      name:      String,
      slug:      String,
      variantTitle: String,
      price:     Number,
      imageUrl:  String,
      woodName:  String,
    },
  },
  { _id: true, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 ngày
  },
  { timestamps: true }
);

// TTL index — MongoDB tự xóa giỏ hàng hết hạn
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Cart', cartSchema);
