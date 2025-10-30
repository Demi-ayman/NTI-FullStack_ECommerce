const mongoose = require('mongoose')
const testimonialSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  name:String,
  message:{
    type:String,
    required:true
  },
  rating:{
    type:Number,
    min:1,
    max:5,
    default:5
  },
  approved:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

module.exports = mongoose.model("Testimonial",testimonialSchema)