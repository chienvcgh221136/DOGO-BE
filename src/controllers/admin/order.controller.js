const asyncHandler = require('express-async-handler');
const Order = require('../../models/Order');

// @desc  Lấy danh sách đơn hàng
// @route GET /api/admin/orders
const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { status } : {};
  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ success: true, data: orders, pagination: { total, page: Number(page) } });
});

// @desc  Cập nhật trạng thái đơn
// @route PUT /api/admin/orders/:id
const updateOrder = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Không tìm thấy đơn hàng'); }

  if (status) order.status = status;
  if (adminNote !== undefined) order.adminNote = adminNote;
  if (status === 'contacted') order.contactedAt = new Date();

  await order.save();
  res.json({ success: true, data: order });
});

module.exports = { getOrders, updateOrder };
