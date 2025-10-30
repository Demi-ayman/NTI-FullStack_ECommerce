const Product = require('../models/product.model')
const catchAsync = require('../utlities/catch-async.utiltis')
const slugify = require('slugify')

exports.createProduct = catchAsync(async(req,res,next)=>{
  const{name, description,price,stock,category,subcategory } = req.body;
  let imgURL = '';
  if (req.file) {
    imgURL = '/uploads/' + req.file.filename;
  }
  const product = await Product.create({
    name,
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
    category,
    subcategory: subcategory || undefined,
    imgURL,
    slug: slugify(name, {lower:true, strict:true}),
  });
  res.status(201).json({message:'Product created successfully',data:product});
});

// get all products just name and category 
exports.getAllProducts = catchAsync(async(req,res,next)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  let query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(query)
    .populate('category', 'name')
    .populate('subcategory', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    message: 'Products list',
    data: products,
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      totalProducts: total
    }
  });
});

// get single product
exports.getProduct = catchAsync(async(req,res,next)=>{
  const product = await Product.findById(req.params.id)
  .populate('category','name')
  .populate('subcategory', 'name');
  if(!product)return res.status(404).json({message:'Product not found'}); 
  res.status(200).json({message:'Product details',data:product});
});

// update product
exports.updateProduct = catchAsync(async(req,res,next)=>{
  const { name, description, price, stock, category, subcategory } = req.body;
  
  let updateData = {
    name, 
    description, 
    price: parseFloat(price), 
    stock: parseInt(stock), 
    category,
    subcategory: subcategory || undefined
  };

  // Handle image upload
  if (req.file) {
    updateData.imgURL = '/uploads/' + req.file.filename;
  }

  // Update slug if name changed
  if (name) {
    updateData.slug = slugify(name, { lower: true, strict: true });
  }

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('category', 'name').populate('subcategory', 'name');
  
  if(!updated) return res.status(404).json({message:'Product not found'}); 
  res.status(200).json({message:'Product updated successfully', data: updated});
});

// delete product
exports.deleteProduct = catchAsync(async (req,res,next)=>{
  const product = await Product.findByIdAndDelete(req.params.id);
  if(!product) return res.status(404).json({message:'Product not found'}); 
  res.status(200).json({message:'Product deleted successfully', data: product});
});