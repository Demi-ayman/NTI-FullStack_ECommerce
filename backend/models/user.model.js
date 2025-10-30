const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Please enter your name"],
  },
  email:{
    type:String,
    required: [true, "Please enter your email"],
    unique: true,
    
  },
  password:{
    type:String,
    required:true,
    required: [true, "Please enter your password"],
    minlength: 6,
  },
  role:{
    type:String,
    enum:['admin','user'],
    default:'user'
  }
}
,{ timestamps: true });

userSchema.pre('save', async function (next) {
  if(!this.isModified('password'))
  {
   return next();
  }
  this.password = await bcrypt.hash(this.password,12);
  next();

})
userSchema.methods.correctPassword= async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
  
}
module.exports = mongoose.model('User',userSchema)