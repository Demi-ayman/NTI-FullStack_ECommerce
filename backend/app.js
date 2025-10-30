const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const app = express()
const cors = require('./middlewares/cors.middleware')
const port = process.env.PORT;
const connectDB = require('./config/db.config');


app.use(cors);
app.use(express.json());
connectDB();
app.use('/uploads', express.static('uploads'));
app.use('/api/admin/users',require('./routes/user.route'));

app.use('/api/auth',require('./routes/auth.route'));

app.use('/api/admin/products',require('./routes/product.route'));

app.use('/api/cart',require('./routes/cart.route'));

app.use('/api/category',require('./routes/category.route'));

app.use('/api/subcategory',require('./routes/subcategory.route'));

app.use('/api/orders', require('./routes/order.user.route')); 

app.use('/api/admin/orders', require('./routes/order.admin.route'));

app.use('/api/testimonial',require('./routes/testimonial.route'));

app.use('/api/admin/faq',require('./routes/faq.route'))
app.listen(port,()=>{
  `server startedat port ${port}`
})