const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subcategory.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


//get all subcategories
router.get('/',subCategoryController.getAllSubcategories);

//get single subcategory by id
router.get('/:id',subCategoryController.getSubcategory);

// create subcategory only by admin
router.post('/',authenticate,authorize('admin'),subCategoryController.createSubcategory);

//update subcategory by id only by admin
router.put('/:id',authenticate,authorize('admin'),subCategoryController.updateSubcategory);

// delete subcategory by id only by admin
router.delete('/:id',authenticate,authorize('admin'),subCategoryController.deleteSubcategory);

router.get('/:subcategoryId/products', subCategoryController.getProductsBySubcategory);
module.exports = router;