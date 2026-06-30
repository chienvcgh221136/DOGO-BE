const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../../controllers/public/cart.controller');

router.get('/',                  getCart);
router.post('/add',              addToCart);
router.put('/update',            updateCartItem);
router.delete('/remove/:itemId', removeCartItem);
router.delete('/clear',          clearCart);

module.exports = router;
