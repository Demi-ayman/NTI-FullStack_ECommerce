const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const signToken = (user)=>{
  return jwt.sign({
    id:user._id ,
    name:user.name,
    role:user.role
  },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN}
  )
}

// for email checking
exports.checkEmail = async(req,res)=>{
  try{
    const {email} = req.query;
    if(!email){
      return res.status(400).json({message:'Email is required'});
    }
    const user = await User.findOne({email});
    res.status(200).json(!!user);
  }catch(err){
    console.log(err);
    res.status(500).json({message:'Error checking email'});
  }
}
// register 
exports.register = async(req,res)=>{
  try{
    const {name, email, password} =req.body 
    // check all required fields 
    if(!name || !email || !password){
      return res.status(400).json({message:'Please fill all required fields'})
    }

    // check if email already exists
    const existingUser = await User.findOne({email});
    if(existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({name,email,password,role:'user'});

    // generate token
    const token = signToken(user);
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    } });
  }catch(e){
    console.error(e);
   res.status(500).json({ message: 'Error registering user' }); 
  }
}


exports.login= async (req,res)=>{
  try{
    const {email, password} = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user =await User.findOne({email});
    if(!user){
      return res.status(404).json({message:'email or password Invalid'});
    }
    const isCorrect =  await user.correctPassword(password);
    if(!isCorrect) {
      return res.status(401).json({message:'email or password Invalid'});
      
    }
    const token = signToken(user);
      return res.status(200).json({message:"login successfully",token ,user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }});
  }catch(e){
    res.status(500).json({message:'Error, login failed'})
  }
}