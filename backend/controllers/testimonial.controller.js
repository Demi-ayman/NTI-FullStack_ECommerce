const Testimonial = require('../models/testimonial.model')
const catchAsync = require('../utlities/catch-async.utiltis')

//create testimonial
exports.createTestimonial = catchAsync(async(req,res,next)=>{
    const {message,rating } = req.body;
    const testimonial= await Testimonial.create({
      user:req.user._id,
      name:req.user.name,
      message,
      rating
    })
    res.status(201).json({message:"Testimonial submitted successfully",data:testimonial});
})

// get all testimonials
exports.getAllTestimonials = catchAsync(async(req,res,next)=>{
  const testimonials = await Testimonial.find();
  if(!testimonials) return res.status(404).json({ message: "Testimonial not found" }); 
  res.status(200).json({message:"Testimonials List",data:testimonials});
})
// get approved testimonials
exports.getApprovedTestimonials = catchAsync(async(req,res,next)=>{
  const testimonials = await Testimonial.find({approved:true}).populate('user', 'name');
  if(!testimonials) return res.status(404).json({ message: "Testimonial not found" }); 
  res.status(200).json({message:"Testimonials List",data:testimonials});
})
// apporve only by admin
exports.approveTestimonial=catchAsync(async(req,res,next)=>{
  const testimonial=await Testimonial.findByIdAndUpdate(
    req.params.id,
    {approved:true},
    {new:true,runValidators:true}
  )
  if(!testimonial)return res.status(404).json({ message: "Testimonial not found" });
  res.status(200).json({ message: "Testimonial approved successfully",data:testimonial });
});
// delete only by admin 
exports.deleteTestimonial=catchAsync(async(req,res,next)=>{
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id );
  if (!testimonial) {
    return res.status(404).json({ message: "Testimonial not found" });
  }
  res.status(200).json({
    message: "Testimonial deleted successfully",
    data: testimonial,
  });
})

exports.updateTestimonial= catchAsync(async(req,res,next)=>{
  const{message,rating}=req.body;
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    {message,rating},
    {new:true,runValidators:true}
  ).populate('user','name');
  if(!testimonial) return res.status(404).json({ message: "Testimonial not found" });
  res.status(200).json({ message: "Testimonial updated successfully", data: testimonial });
})