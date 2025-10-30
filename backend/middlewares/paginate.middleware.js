module.exports = (Model) => async(req,res,next)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip =(page - 1)*limit;

  const sortBy = req.query.sort || 'createdAt';
  const order = req.query.order === 'desc' ?-1:1;

  // build a dynamic filter Object
  const {name,minPrice,maxPrice,category, subcategory} =req.query;
  let filter = {};

  if (name) filter.name = { $regex:name, $options:'i'};


  if(minPrice || maxPrice){
    filter.price = {};
    if(minPrice) filter.price.$gte = parseInt(minPrice);
    if(maxPrice) filter.price.$lte = parseInt(maxPrice);
  }
  if(category) filter.category = category;
  if(subcategory) filter.subcategory = subcategory;

  try{
    const [results, total] = await Promise.all([
      Model.find(filter)
      .sort({[sortBy]:order})
      .skip(skip)
      .limit(limit)
      .populate('category', 'name')
      .populate('subcategory', 'name'),
    Model.countDocuments(filter),
    ]);
    res.paginateResult = {
      page,
      limit,
      totalPages:Math.ceil(total/limit),
      totalResults:total,
      results,
    };
    next();
  }catch(e){
    next(e);
  }

}