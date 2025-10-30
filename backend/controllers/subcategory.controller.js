const Subcategory = require('../models/subcategory.model');
const catchAsync = require('../utlities/catch-async.utiltis');

// create subcategory 
exports.createSubcategory = catchAsync(async(req,res,next)=>{
  const {name,category} = req.body;
  if (!name || !category) {
    return res.status(400).json({ message: 'Name and category are required' });
  }
  const subcategory = await Subcategory.create({name,category});
  await subcategory.populate('category', 'name');
  res.status(201).json({message:"Subcategory created successfully ",data:subcategory});
});

// get all subcategory
exports.getAllSubcategories = catchAsync(async(req,res,next)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  let query = { isActive: { $ne: false } };
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const subcategories =  await Subcategory.find(query)
    .populate('category','name')
    .populate('productCount')
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit);

  const total = await Subcategory.countDocuments(query);
  
  res.status(200).json({
    message: 'SubCategory list',
    data: subcategories,
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      totalSubcategories: total
    }
  });
})

// get subcategory by id
exports.getSubcategory = catchAsync(async(req,res,next)=>{
  const subcategory =  await Subcategory.findById(req.params.id)
  .populate('category','name')
  .populate('productCount');

  if(!subcategory){
   return res.status(404).json({message:"Subcategory not found"})
  }
  res.status(200).json({message:'SubCategory details',data:subcategory});
});

//update category
exports.updateSubcategory =catchAsync(async(req,res,next)=>{
  const {name,category,description} = req.body;
  const subcategory = await Subcategory.findByIdAndUpdate(req.params.id,
    {name,category,description},
    {new: true, runValidators: true})
  .populate('category', 'name');

  if(!subcategory){
   return res.status(404).json({message:"Subcategory not found"})
  }
  res.status(200).json({message:'SubCategory updated successfully',data:subcategory});
})

//delete subcategory by id
exports.deleteSubcategory = catchAsync(async(req,res,next)=>{
  // const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
  // if(!subcategory){
  //  return res.status(404).json({message:"Subcategory not found"})
  // }
  //** make it soft delete 
  const subcategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  res.status(200).json({message:'SubCategory deleted successfully',data:subcategory});
})

exports.getProductsBySubcategory = catchAsync(async (req, res, next) => {
  const subcategoryId = req.params.subcategoryId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const subcategory = await Subcategory.findById(subcategoryId)
    .populate('category', 'name');
    
  if (!subcategory) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }

  const products = await Product.find({ 
    subcategory: subcategoryId,
    isActive: { $ne: false }
  })
    .populate('category', 'name')
    .populate('subcategory', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments({ 
    subcategory: subcategoryId,
    isActive: { $ne: false }
  });

  res.status(200).json({
    message: 'Products list',
    data: products,
    subcategory: {
      id: subcategory._id,
      name: subcategory.name,
      category: subcategory.category
    },
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      totalProducts: total
    }
  });
});