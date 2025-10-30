const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


router.get('/', authenticate, authorize('admin'), orderController.getAllOrders);


router.get('/:id', authenticate, authorize('admin'), orderController.getOrderById);


router.put('/:id', authenticate, authorize('admin'), orderController.updateOrderStatus);


router.delete('/:id', authenticate, authorize('admin'), orderController.deleteOrder);

module.exports = router;
