const asyncHandler = require('express-async-handler');
const jwt   = require('jsonwebtoken');
const Admin = require('../../models/Admin');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

// @desc  Đăng nhập admin
// @route POST /api/admin/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400); throw new Error('Vui lòng nhập username và password');
  }

  const admin = await Admin.findOne({ username: username.toLowerCase() });
  if (!admin || !admin.isActive) {
    res.status(401); throw new Error('Tài khoản không tồn tại hoặc đã bị khóa');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    res.status(401); throw new Error('Mật khẩu không đúng');
  }

  // Cập nhật thời gian đăng nhập
  admin.lastLoginAt = new Date();
  await admin.save();

  res.json({
    success: true,
    data: admin,
    token: generateToken(admin._id),
  });
});

// @desc  Lấy thông tin admin đang đăng nhập
// @route GET /api/admin/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = { login, getMe };
