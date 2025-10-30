const Order = require('../models/order.model');
const Product = require('../models/product.model')
const catchAsync = require('../utlities/catch-async.utiltis')

//create order(multiple products)
exports.createOrder = catchAsync(async(req,res,next)=>{
  const {products, name, address, paymentMethod, price} = req.body;
  
  if(!products || !Array.isArray(products) || products.length ===0){
    return res.status(400).json({message:"Products array is required"});
  }
  // validate products and calculate total price
  let totalPrice = 0;
  for(const item of products){
    const productData = await Product.findById(item.product);

    if(!productData) return res.status(404).json({message:`product not found: ${item.product}`});

    totalPrice += productData.price *(item.quantity || 1)
  }

  // create order 
  const order = await Order.create({
    userId:req.user._id,
    products,
    name,
    address,
    totalPrice,
    paymentMethod
  });
  res.status(201).json({message:'Order created successfully',data:order})
})

  // const existingProduct = await Product.findById(product);
  // if(!existingProduct)return res.status(404).json({message:'Product not found'});


  // const order = await Order.create({
  //   userId:req.user._id,
  //   product,
  //   name,
  //   address,
  //   totalPrice,
  //   paymentMethod
  // });


  // res.status(200).json({message:'Order created successfully',data:order});



// get all orders by admin
exports.getAllOrders =catchAsync(async(req,res,next)=>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = req.query.status;
  let query = {};
  if (status) {
    query.status = status;
  }
  const orders = await Order.find(query)
    .populate('userId', 'name email')
    .populate('products.product', 'name price imgURL') 
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);
  const total = await Order.countDocuments(query);
  res.status(200).json({
    message: 'All orders',
    data: orders,
    pagination: { 
      current: page,
      total: Math.ceil(total / limit),
      totalOrders: total
    }
  });

})

// get logged in user's orders
exports.getUserOrders = catchAsync(async(req,res,next)=>{
  const orders = await Order.find({userId:req.user._id}).populate('products.product','name price imgURL');
  if(!orders.length)return res.status(404).json({message:'No orders found for this user'})
  res.status(200).json({message:'User orders',data:orders});
});

// get single order by id
exports.getOrderById = catchAsync(async(req,res,next)=>{
  const order = await Order.findById(req.params.id).populate('userId', 'name email').populate('product', 'name price imgURL');
  if(!order) return res.status(404).json({message:'order not found'})
  res.status(200).json({message:'orders details', data:order});
});

//only can updated by admin
exports.updateOrderStatus = catchAsync(async(req,res,next)=>{
  const {status, isPaid}  =req.body;
  const order = await Order.findById(req.params.id);
  if(!order){
    return res.status(404).json({message:'Order not found'});
  }
  if(status) order.status = status;
  if(isPaid){
    order.isPaid = true,
    order.paidAt = Date.now();
  }
  await order.save();
  res.status(200).json({message:'Order updated successfully', data:order});

});

// only admin can delete order 

exports.deleteOrder=catchAsync(async(req,res,next)=>{
  const order = await Order.findByIdAndDelete(req.params.id);
  if(!order){
    return res.status(404).json({message:'Order not found'});
  }
  res.status(200).json({message:'order deleted successfully',data:order});

})

