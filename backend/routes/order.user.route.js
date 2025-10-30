const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');


router.post('/', authenticate, orderController.createOrder);


router.get('/my-orders', authenticate, orderController.getUserOrders);

module.exports = router;
