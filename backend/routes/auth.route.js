const express = require('express')
const router = express.Router();
const {login, register, checkEmail} = require('../controllers/auth.controller');

//register
router.post('/register',register);

// login
router.post('/login',login)

// check email
router.get('/check-email',checkEmail);

module.exports = router; 