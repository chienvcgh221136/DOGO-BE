const router   = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { login, getMe } = require('../controllers/admin/auth.controller');
const productCtrl = require('../controllers/admin/product.controller');
const mediaCtrl   = require('../controllers/admin/media.controller');
const orderCtrl   = require('../controllers/admin/order.controller');
const postCtrl    = require('../controllers/admin/post.controller');
const settingCtrl = require('../controllers/admin/setting.controller');
const { uploadProduct, uploadPost, uploadGeneral } = require('../config/cloudinary');

// ── Auth ──────────────────────────────────────────────────────────
router.post('/login', login);
router.get('/me', protect, getMe);

// ── Products ─────────────────────────────────────────────────────
router.get('/products',        protect, productCtrl.getProducts);
router.post('/products',       protect, productCtrl.createProduct);
router.get('/products/:id',    protect, productCtrl.getProductById);
router.put('/products/:id',    protect, productCtrl.updateProduct);
router.delete('/products/:id', protect, productCtrl.deleteProduct);

// ── Media / Upload ───────────────────────────────────────────────
router.get('/media',    protect, mediaCtrl.getMedia);
router.post('/media/upload/product', protect, uploadProduct.single('image'), mediaCtrl.uploadMedia);
router.post('/media/upload/post',    protect, uploadPost.single('image'),    mediaCtrl.uploadMedia);
router.post('/media/upload/general', protect, uploadGeneral.single('image'), mediaCtrl.uploadMedia);
router.delete('/media/:id',          protect, mediaCtrl.deleteMedia);

// ── Orders ───────────────────────────────────────────────────────
router.get('/orders',     protect, orderCtrl.getOrders);
router.put('/orders/:id', protect, orderCtrl.updateOrder);

// ── Posts ────────────────────────────────────────────────────────
router.get('/posts',        protect, postCtrl.getPosts);
router.post('/posts',       protect, postCtrl.createPost);
router.put('/posts/:id',    protect, postCtrl.updatePost);
router.delete('/posts/:id', protect, postCtrl.deletePost);

// ── Settings ─────────────────────────────────────────────────────
router.put('/settings/:key', protect, settingCtrl.updateSetting);

module.exports = router;
