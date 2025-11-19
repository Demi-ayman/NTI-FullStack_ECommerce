const cors = require('cors');

// FIX: Add ( || "") to prevent crash if env var is missing
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(',');

const corsOptions = {
  origin: function(origin, cb) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return cb(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    } else {
      console.error('CORS policy: origin not allowed ->', origin);
      return cb(new Error('CORS policy: origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

module.exports = cors(corsOptions);