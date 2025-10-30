const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const catchAsync = require('../utlities/catch-async.utiltis')
exports.addToCart = catchAsync(async (req, res, next) => {
  const { prodId, quantity } = req.body;
  const userId = req.user._id;

  // Validate product
  const product = await Product.findById(prodId);
  if (!product)
    return res.status(404).json({ message: 'Product not found' });

  // Find existing cart for the user
  let cart = await Cart.findOne({ user: userId });

  //  If cart doesn’t exist, create a new one
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: prodId, quantity }],
      totalPrice: product.price * quantity,
    });
    return res.status(201).json({ message: 'Cart created', data: cart });
  }

  //If cart exists, update it
  const existingItem = cart.items.find(
    (item) => item.product.toString() === prodId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: prodId, quantity });
  }

  // Recalculate total price
  const products = await Product.find({_id:{ $in: cart.items.map(i => i.product) }});
  cart.totalPrice = cart.items.reduce((sum,item)=>{
    const prod = products.find(p=>p._id.toString() === item.product.toString());
    return sum + (prod?.price || 0) * item.quantity;
  },0);
  // cart.totalPrice = 0;
  // for (const item of cart.items) {
  //   const productData = await Product.findById(item.product);
  //   cart.totalPrice += productData.price * item.quantity;
  // }

  await cart.save();

  res.status(200).json({ message: 'Product added to cart', data: cart });
});

// get user cart 

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json({ message: 'Cart fetched', data: cart });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

exports.removeItem=catchAsync(async(req,res,next)=>{
  const prodId = req.params.id;
  const cart = await Cart.findOne({user:req.user._id});
  if(!cart) return res.status(404).json({message:'Cart not found'})

  cart.items = cart.items.filter(
  (item)=>item.product.toString()!==prodId);

  const products = await Product.find({ _id: { $in: cart.items.map(i => i.product) } });
  cart.totalPrice = cart.items.reduce((sum, item) => {
    const prod = products.find(p => p._id.toString() === item.product.toString());
    return sum + (prod?.price || 0) * item.quantity;
  }, 0);
  // cart.totalPrice = 0;
  // for (const item of cart.items) {
  //   const productData = await Product.findById(item.product);
  //   cart.totalPrice += productData.price * item.quantity;
  // }

  await cart.save();
  res.status(200).json({message:'Item removed from cart', data:cart});
});


