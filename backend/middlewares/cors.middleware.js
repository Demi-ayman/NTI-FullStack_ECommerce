const cors = require('cors');
const allowedOrigins =process.env.ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin:function(origin,cb)
  {
    if(!origin) return cb(null,true);
    if(allowedOrigins.includes(origin))
    {
      return cb(null, true);
    }else{
      console.error('CORS policy: origin not allowed ->', origin);
      return cb(new Error('CORS policy:origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']

}
module.exports=cors(corsOptions)