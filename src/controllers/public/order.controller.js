const asyncHandler  = require('express-async-handler');
const Order = require('../../models/Order');
const Cart  = require('../../models/Cart');

// @desc  Gửi yêu cầu đặt hàng (liên hệ)
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { name, phone, address, note } = req.body;

  if (!name || !phone) {
    res.status(400); throw new Error('Vui lòng cung cấp tên và số điện thoại');
  }

  // Lấy giỏ hàng
  const cart = sessionId ? await Cart.findOne({ sessionId }) : null;
  const items = cart?.items?.map((item) => ({
    productId:    item.productId,
    variantSku:   item.variantSku,
    productName:  item.snapshot.name,
    variantTitle: item.snapshot.variantTitle,
    price:        item.snapshot.price,
    quantity:     item.quantity,
    imageUrl:     item.snapshot.imageUrl,
  })) || [];

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    sessionId,
    contactInfo: { name, phone, address, note },
    items,
    totalAmount,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: order,
    message: 'Yêu cầu đặt hàng đã được ghi nhận. Chúng tôi sẽ liên hệ bạn sớm!',
  });
});

module.exports = { createOrder };
