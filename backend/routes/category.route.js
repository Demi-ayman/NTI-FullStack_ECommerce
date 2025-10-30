const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/',categoryController.getAllCategories);
router.get('/:id',categoryController.getCategory);


// admin roles
router.post('/',authenticate,authorize('admin'),categoryController.createCategory);
router.put('/:id',authenticate,authorize('admin'),categoryController.updateCategory);
router.delete('/:id',authenticate,authorize('admin'),categoryController.deleteCategory);
router.get('/:categoryId/subcategories', categoryController.getSubCategoriesByCategory);
module.exports = router;