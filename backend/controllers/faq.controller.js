const FAQ=require('../models/faq.model');
const catchAsync = require('../utlities/catch-async.utiltis');

// create new faq
exports.createFAQ = catchAsync(async(req,res)=>{
  const faq = await FAQ.create(req.body);
  res.status(201).json({message:'faq created successfully',data:faq});
})

// get all FAQs
exports.getAllFAQs = catchAsync(async(req,res)=>{
  const faqs = await FAQ.find();
  res.status(200).json({message:'Faq lists',data:faqs});
})

// get single FAQ by id
exports.getFAQ = catchAsync(async(req,res)=>{
  const faq = await FAQ.findById(req.params.id);
  if(!faq) return res.status(404).json({message:'FAQ not found'});
  res.status(200).json({message:'FAQ details ',data:faq});
})

// update FAQ
exports.updateFAQ = catchAsync(async(req,res)=>{
  const faq=await FAQ.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
  if(!faq) return res.status(404).json({message:'FAQ not found'});
  res.status(200).json({message:'FAQ updated successfully',data:faq});
});

// delete faq
exports.deleteFAQ =catchAsync(async(req,res)=>{
  const faq=await FAQ.findByIdAndDelete(req.params.id)
  if(!faq) return res.status(404).json({message:'FAQ not found'});
  res.status(200).json({message:'FAQ deleted successfully ',data:faq});
})