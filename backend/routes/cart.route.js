 const express = require('express');
 const router = express.Router()
 const cartController = require('../controllers/cart.controller');
 const { authenticate } = require('../middlewares/auth.middleware');
 
 router.post('/',authenticate,cartController.addToCart);
 
 router.get('/',authenticate,cartController.getCart);
 
 router.delete('/:id',authenticate,cartController.removeItem);
 
 module.exports = router
 