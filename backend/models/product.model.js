const mongoose = require('mongoose');
const slugify = require('slugify')
const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Product name is required"]
  },
  description:{
    type:String,
    required:[true,"Product description is required"]
  },
  price:{
    type:Number,
    require:[true,"Product price is required"]
  },
  stock:{
    type:Number,
    default:0
  },
  slug:{
    type:String,
    unique:true,
    lowercase:true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required:true
  },
  subcategory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Subcategory'
  }
  ,
  imgURL:{
    type:String,
    default:""
  }
}
,{timestamps:true})

// automatically create slug from product name
productSchema.pre('save', function(next){
  if(!this.slug && this.name)
  {
    this.slug=slugify(this.name,{lower:true,strict:true});
  }
  next();
});
module.exports = mongoose.model("Product",productSchema)