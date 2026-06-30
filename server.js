require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const cookieParser = require('cookie-parser');
const connectDB   = require('./src/config/db');

// Routes
const productRoutes  = require('./src/routes/public/product.routes');
const categoryRoutes = require('./src/routes/public/category.routes');
const cartRoutes     = require('./src/routes/public/cart.routes');
const orderRoutes    = require('./src/routes/public/order.routes');
const postRoutes     = require('./src/routes/public/post.routes');
const settingRoutes  = require('./src/routes/public/setting.routes');
const adminRoutes    = require('./src/routes/admin.routes');

// Kết nối DB
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Public API Routes ─────────────────────────────────────────────
app.use('/api/products',      productRoutes);
app.use('/api/categories',    categoryRoutes);
app.use('/api/cart',          cartRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/posts',         postRoutes);
app.use('/api/settings',      settingRoutes);

// ── Admin API Routes ──────────────────────────────────────────────
app.use('/api/admin',         adminRoutes);

// ── Health check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', env: process.env.NODE_ENV });
});

// ── Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV}`);
});
