const User = require('../models/user.model')
const catchAsync = require('../utlities/catch-async.utiltis')
const bcrypt = require('bcrypt')

exports.createUser = (role) => {
  return catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User created successfully",data:user });
  });
};


// get all user by admin
exports.getAllUsers = catchAsync(async(req,res,next)=>{
  const page = parseInt(req.query.page) ||1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page-1)*limit;
  const search = req.query.search;
  let query={isDeleted:{$ne:true}};
  if(search){
    query.name ={ $regex: search, $options: 'i' };
  }
  const users = await User.find()
  .select('-password')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  const total = await User.countDocuments();

  res.status(200).json({message:'Users retrieved successfully', 
    data:users,
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      totalUsers: total
    }
  })  
})

//get single user by _id
exports.getUser = catchAsync(async(req, res, next)=>{
  const user =await User.findById(req.params.id).select('-password')
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({message:'user info ',data:user});

})

// update user 

exports.updateUser = catchAsync(async(req,res,next)=>{
  const {name, email,role} = req.body;
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    {name,email,role}, 
    { new: true, runValidators: true } ).select('-password') ;
  if(!updated){
    return res.status(404).json({message:'user not found'});
  }
  res.status(200).json({message:'user updated successfully',data:updated})
})
  

exports.deleteUser = catchAsync(async(req,res,next)=>{
  const user = await User.findOneAndDelete(req.params.id);
  if(!user){
    return res.status(404).json({message:'user not found'});
  }
   res.status(200).json({
    message: 'User deleted successfully'
  });
})

exports.getUsersStats = catchAsync(async(req,res,next)=>{
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({role:'admin'});
  const totalCustomers = await User.countDocuments({role:'user'});

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  res.status(200).json({
    message:'Users statistics retrieved successfully',
    data:{
      totalUsers,
      totalAdmins,
      totalCustomers,
      newUsers
    }
  })
})