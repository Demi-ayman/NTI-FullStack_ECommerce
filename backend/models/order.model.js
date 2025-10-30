const mongoose = require('mongoose');
  const orderSchema = new mongoose.Schema({
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    products:[
      {
        product
        :{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Product',
          required:true
        },
        quantity:{
          type:Number,
          required:true,
          min:1,
          default:1
        },
        price:{
          type:Number,
          min:0
        }
      }
    ],
    name:{
      type:String,
      required:[true,"Customer name is required"],
      trim:true
    },
    address:{
      type:String,
      required:[true,"Delivery address is required"]
    },
    status:{
      type:String ,
      enum:["Pending","Processing","Shipped","Delivered","Cancelled"],
      default:"Pending"
    },
    totalPrice:{
      type:Number,
      required:true,
      min:0
    },
    paymentMethod:{
      type:String,
      enum:["CashOnDelivery","CreditCard","PayPal"],
      default:"CashOnDelivery"
    },
    isPaid:{
      type:Boolean,
      default:false
    },
    paidAt:{
      type:Date
    }
  },
  {timestamps:true}
)
module.exports = mongoose.model("Order",orderSchema)