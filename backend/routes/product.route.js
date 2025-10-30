const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware');
const paginate = require('../middlewares/paginate.middleware')
const Product = require('../models/product.model');
const upload = require('../middlewares/upload.middleware')
// get all product
// router.get('/',paginate(Product),(req, res) => {
//   res.status(200).json({
//     message: 'Products list',
//     ...res.paginateResult,
//   });});
router.get('/', productController.getAllProducts);
// get product by id
router.get('/:id', productController.getProduct);

//create product (Admin only)
router.post('/', authenticate, authorize('admin'), upload.single('imgURL'), productController.createProduct);
// update product (Admin only) by id
router.put('/:id', authenticate, authorize('admin'), upload.single('imgURL'), productController.updateProduct);

//delete product (Admin only) by id
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);
module.exports=router