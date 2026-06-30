const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantSku:   String,
    productName:  String,
    variantTitle: String,
    price:        Number,
    quantity:     Number,
    imageUrl:     String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    sessionId: { type: String },
    contactInfo: {
      name:    { type: String, required: true },
      phone:   { type: String, required: true },
      address: { type: String, default: '' },
      note:    { type: String, default: '' },
    },
    items:       [orderItemSchema],
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    adminNote:   { type: String, default: '' },
    contactedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
