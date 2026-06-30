const router = require('express').Router();
const { createOrder } = require('../../controllers/public/order.controller');

router.post('/', createOrder);

module.exports = router;
