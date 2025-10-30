const Category = require('../models/category.model')
const catchAsync = require('../utlities/catch-async.utiltis')
const Subcategory = require('../models/subcategory.model')
const Product = require('../models/product.model')
// create category
exports.createCategory = catchAsync(async(req,res,next)=>{
  const {name, description} = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: `Category '${name}' already exists` });
  }
  const category = await Category.create({name, description});
  res.status(201).json({message:'Category created successfully',data:category});
})

// get all categories

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  let query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const categories = await Category.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(query);

  // here we get counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const subcategoryCount = await Subcategory.countDocuments({ 
        category: category._id
      });
      const productCount = await Product.countDocuments({ 
        category: category._id
      });
      
      return {
        _id: category._id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        subcategoryCount,
        productCount
      };
    })
  );

  res.status(200).json({
    message: 'Categories list',
    data: categoriesWithCounts,
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      totalCategories: total
    }
  });
});

// get category by id

exports.getCategory= catchAsync(async(req,res,next)=>
{
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const subcategoryCount = await Subcategory.countDocuments({ 
    category: category._id
  });
  const productCount = await Product.countDocuments({ 
    category: category._id
  });

  const categoryWithCounts = {
    ...category.toObject(),
    subcategoryCount,
    productCount
  };

  res.status(200).json({ message: 'Category details', data: categoryWithCounts });
})

// update category
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  
  // we check if name already exists (excluding current category)
  if (name) {
    const existingCategory = await Category.findOne({ 
      name, 
      _id: { $ne: req.params.id } 
    });
    if (existingCategory) {
      return res.status(400).json({ message: `Category '${name}' already exists` });
    }
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.status(200).json({ message: 'Category updated', data: category });
})

// delete category soft delete
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const categoryId = req.params.id;

  // check if category has subcategories or products
  const subcategoryCount = await Subcategory.countDocuments({ 
    category: categoryId 
  });
  
  const productCount = await Product.countDocuments({ 
    category: categoryId 
  });

  if (subcategoryCount > 0 || productCount > 0) {
    return res.status(400).json({ 
      message: 'Cannot delete category that has subcategories or products. Please remove them first.' 
    });
  }

  // Perform hard delete
  const category = await Category.findByIdAndDelete(categoryId);
  
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(200).json({ 
    message: 'Category permanently deleted successfully' 
  });
});
exports.getSubCategoriesByCategory=catchAsync(async(req,res,next)=>{
  const categoryId = req.params.categoryId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const subcategories = await Subcategory.find({ 
    category: categoryId
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    const subcategoriesWithCounts = await Promise.all(
    subcategories.map(async (subcategory) => {
      const productCount = await Product.countDocuments({ 
        subcategory: subcategory._id
      });
      
      return {
        ...subcategory.toObject(),
        productCount
      };
    })
  );
    const total = await Subcategory.countDocuments({ 
    category: categoryId
  });
    res.status(200).json({
    message: 'Subcategories list',
    data: subcategoriesWithCounts,
    category: {
      id: category._id,
      name: category.name
    },
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      totalSubcategories: total
    }
  });
});