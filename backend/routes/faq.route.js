const express = require('express');
const router = express.Router()
const faqController = require('../controllers/faq.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware');

router.get('/',faqController.getAllFAQs);
router.get('/:id',faqController.getFAQ);

// admin roles

router.post('/',authenticate,authorize('admin'),faqController.createFAQ);
router.put('/:id',authenticate,authorize('admin'),faqController.updateFAQ);
router.delete('/:id',authenticate,authorize('admin'),faqController.deleteFAQ);

module.exports = router;