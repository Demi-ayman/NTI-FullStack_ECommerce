const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// create order(user)
router.post('/',authenticate,orderController.createOrder)

// get logged-in user orders
router.get('/my-orders',authenticate,orderController.getUserOrders);

// get all orders (admin)
router.get('/',authenticate,authorize('admin'),orderController.getAllOrders);

// get order by id onyl by admin
router.get('/:id',authenticate,authorize('admin'),orderController.getOrderById);

// update order by admin only
router.put('/:id',authenticate,authorize('admin'),orderController.updateOrderStatus);

// admin delete order
router.delete('/:id',authenticate,authorize('admin'),orderController.deleteOrder );

module.exports = router;