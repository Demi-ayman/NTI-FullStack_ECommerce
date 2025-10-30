const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware');

// user adds testimonial
router.post('/',authenticate, testimonialController.createTestimonial);

// get all approved testimonials
router.get('/',testimonialController.getApprovedTestimonials);

// admin routes
router.get('/all',authenticate,authorize('admin'),testimonialController.getAllTestimonials);



router.put('/:id/approve',authenticate,authorize('admin'),testimonialController.approveTestimonial)

router.put('/:id',authenticate,authorize('admin'),testimonialController.updateTestimonial);

router.delete('/:id',authenticate,authorize('admin'),testimonialController.deleteTestimonial)

module.exports = router;