const mongoose = require('mongoose');
const connectDB = async()=>{
  try{
    const conn = await mongoose.connect(process.env.MONG_URI);
    console.log(`mongoDB connected ${conn.connection.host}`);
    console.log('Connected to database:', mongoose.connection.name);

  }catch(e){
    console.log( `Error: ${e}`);
    process.exit(1) // for save resources
  }
}
module.exports = connectDB;