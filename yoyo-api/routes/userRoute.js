const express = require('express');
const { registerUser, loginUser, getUserProfile, updateShippingAddress } = require('../controllers/userController');
const checkLogin = require('../middlewares/checkLogin');
const userRoutes = express.Router();

userRoutes
	.post('/register', registerUser)
	.post('/login', loginUser)
	.get('/profile', checkLogin, getUserProfile)
	.put('/update/shipping', checkLogin, updateShippingAddress);

module.exports = userRoutes;
