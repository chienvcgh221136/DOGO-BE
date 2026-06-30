const asyncHandler = require('express-async-handler');
const Cart    = require('../../models/Cart');
const Product = require('../../models/Product');

// Helper: lấy hoặc tạo cart theo sessionId
const getOrCreateCart = async (sessionId) => {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }
  return cart;
};

// @desc  Xem giỏ hàng
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return res.json({ success: true, data: { items: [] } });

  const cart = await Cart.findOne({ sessionId });
  res.json({ success: true, data: cart || { items: [] } });
});

// @desc  Thêm sản phẩm vào giỏ
// @route POST /api/cart/add
const addToCart = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    res.status(400); throw new Error('Thiếu sessionId');
  }

  const { productId, variantSku, quantity = 1 } = req.body;

  // Kiểm tra sản phẩm tồn tại
  const product = await Product.findById(productId);
  if (!product || product.status !== 'published') {
    res.status(404); throw new Error('Sản phẩm không tồn tại');
  }

  const variant = product.variants.find((v) => v.sku === variantSku);
  if (!variant) {
    res.status(404); throw new Error('Biến thể sản phẩm không tồn tại');
  }

  const cart = await getOrCreateCart(sessionId);

  // Nếu đã có item này trong giỏ → cộng số lượng
  const existing = cart.items.find(
    (i) => i.productId.toString() === productId && i.variantSku === variantSku
  );

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({
      productId,
      variantSku,
      quantity: Number(quantity),
      snapshot: {
        name:         product.name,
        slug:         product.slug,
        variantTitle: variant.title,
        price:        variant.price,
        imageUrl:     product.images?.[0]?.url || '',
        woodName:     product.categoryInfo?.woodName || '',
      },
    });
  }

  // Reset expiry
  cart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await cart.save();

  res.json({ success: true, data: cart, message: 'Đã thêm vào giỏ hàng' });
});

// @desc  Cập nhật số lượng
// @route PUT /api/cart/update
const updateCartItem = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { itemId, quantity } = req.body;

  const cart = await Cart.findOne({ sessionId });
  if (!cart) { res.status(404); throw new Error('Giỏ hàng không tồn tại'); }

  const item = cart.items.id(itemId);
  if (!item) { res.status(404); throw new Error('Không tìm thấy sản phẩm trong giỏ'); }

  if (quantity <= 0) {
    cart.items.pull({ _id: itemId });
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();
  res.json({ success: true, data: cart });
});

// @desc  Xóa item khỏi giỏ
// @route DELETE /api/cart/remove/:itemId
const removeCartItem = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const cart = await Cart.findOne({ sessionId });
  if (!cart) { res.status(404); throw new Error('Giỏ hàng không tồn tại'); }

  cart.items.pull({ _id: req.params.itemId });
  await cart.save();
  res.json({ success: true, data: cart, message: 'Đã xóa khỏi giỏ hàng' });
});

// @desc  Xóa toàn bộ giỏ
// @route DELETE /api/cart/clear
const clearCart = asyncHandler(async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  await Cart.findOneAndDelete({ sessionId });
  res.json({ success: true, message: 'Đã xóa giỏ hàng' });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
