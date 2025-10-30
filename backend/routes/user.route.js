const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize}=require('../middlewares/role.middleware');
const { model } = require('mongoose');

// normal signup
// router.post('/',userController.createUser('user'));

// get all user by admin
router.get('/',authenticate,authorize('admin'),userController.getAllUsers);

// get user by id by admin
router.get('/:id',authenticate,authorize('admin'),userController.getUser);


// get users statistics by admin
router.get('/stats/dashboard', authenticate, authorize('admin'), userController.getUsersStats);

// create admin
router.post('/create-admin',authenticate,authorize('admin'),userController.createUser('admin'));

// update user info
router.put('/:id',authenticate,authorize('admin'),userController.updateUser);

// delete user by admin
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);
module.exports = router