const router = require('express').Router();
const { getProducts, getProductBySlug, getFeaturedProducts } = require('../../controllers/public/product.controller');

router.get('/featured', getFeaturedProducts);
router.get('/',         getProducts);
router.get('/:slug',    getProductBySlug);

module.exports = router;
