const express = require('express');
const checkLogin = require('../middlewares/checkLogin');
const isAdmin = require('../middlewares/isAdmin');
const {
	createCoupon,
	getAllCoupons,
	getCouponById,
	updateCoupon,
	deleteCoupon,
} = require('../controllers/couponController');

const couponRoutes = express.Router();

couponRoutes
	.post('/', checkLogin, isAdmin, createCoupon)
	.get('/', getAllCoupons)
	.get('/:id', getCouponById)
	.put('/update/:id', checkLogin, isAdmin, updateCoupon)
	.delete('/delete/:id', checkLogin, isAdmin, deleteCoupon);

module.exports = couponRoutes;
