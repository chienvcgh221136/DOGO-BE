const jwt    = require('jsonwebtoken');
const Admin  = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Không có quyền truy cập, vui lòng đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!req.admin || !req.admin.isActive) {
      return res.status(401).json({ success: false, message: 'Tài khoản không hợp lệ hoặc đã bị vô hiệu hóa' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = { protect };
