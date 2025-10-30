const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Subcategory name is required"],
    unique:true,
    trim:true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required: [true, "Parent category is required"]
  },
  description: {
      type: String,
      default: "",
    },
    isActive: {
    type: Boolean,
    default: true
  }
},{timestamps:true});

subCategorySchema.virtual('productCount',{
  ref:'Product',
  localField:'_id',
  foreignField:'subcategory',
  count:true
})
subCategorySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Subcategory',subCategorySchema);